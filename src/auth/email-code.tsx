"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import {
  SESSION_TASK_MESSAGE,
  beginEmailCode,
  messageForClerkError,
  resendCooldownSeconds,
  resendEmailCode,
  resetEmailCode,
  verifyEmailCode,
  type EmailCodeClerk,
  type FlowMode,
  type FlowResult,
} from "./email-code-flow";
import { safeNextPath } from "./next-path";

export function EmailCodeSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = safeNextPath(params.get("next"));
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [mode, setMode] = useState<FlowMode>("sign-in");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const busy = pending || signInStatus === "fetching" || signUpStatus === "fetching";
  const waitSeconds = sentAt === null ? 0 : resendCooldownSeconds(sentAt, now);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace(nextPath);
  }, [isLoaded, isSignedIn, nextPath, router]);

  useEffect(() => {
    if (sentAt === null) return;
    const id = window.setInterval(() => {
      const next = Date.now();
      setNow(next);
      if (resendCooldownSeconds(sentAt, next) === 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [sentAt]);

  function clerk(): EmailCodeClerk {
    return {
      signIn: {
        create: (input) => signIn.create(input),
        emailCode: {
          sendCode: (input) => signIn.emailCode.sendCode(input?.emailAddress ? { emailAddress: input.emailAddress } : {}),
          verifyCode: (input) => signIn.emailCode.verifyCode(input),
        },
        get status() {
          return signIn.status;
        },
        get isTransferable() {
          return signIn.isTransferable;
        },
        reset: () => signIn.reset(),
      },
      signUp: {
        create: (input) => signUp.create(input),
        verifications: {
          sendEmailCode: () => signUp.verifications.sendEmailCode(),
          verifyEmailCode: (input) => signUp.verifications.verifyEmailCode(input),
        },
        get status() {
          return signUp.status;
        },
        get missingFields() {
          return signUp.missingFields;
        },
        get unverifiedFields() {
          return signUp.unverifiedFields;
        },
        reset: () => signUp.reset(),
      },
    };
  }

  function markSent() {
    const time = Date.now();
    setSentAt(time);
    setNow(time);
  }

  function go(session: { currentTask?: unknown } | null | undefined, decorateUrl: (url: string) => string) {
    if (session?.currentTask) {
      setMessage(SESSION_TASK_MESSAGE);
      return;
    }
    const destination = decorateUrl(nextPath);
    if (destination.startsWith("http")) {
      window.location.assign(destination);
      return;
    }
    router.push(destination);
    router.refresh();
  }

  async function activate(nextMode: FlowMode) {
    const finalized =
      nextMode === "sign-up"
        ? await signUp.finalize({
            navigate: ({ session, decorateUrl }) => go(session, decorateUrl),
          })
        : await signIn.finalize({
            navigate: ({ session, decorateUrl }) => go(session, decorateUrl),
          });
    if (finalized.error) setMessage(messageForClerkError(finalized.error));
  }

  async function apply(result: FlowResult) {
    if (result.step === "signed-in") {
      router.replace(nextPath);
      return;
    }
    if (result.step === "activate") {
      setMode(result.mode);
      await activate(result.mode);
      return;
    }
    if (result.step === "code") {
      setMode(result.mode);
      setStep("code");
      setMessage(result.message);
      return;
    }
    setStep("email");
    setMessage(result.message);
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const result = await beginEmailCode(clerk(), email);
      if (result.step === "code") {
        setCode("");
        markSent();
      }
      await apply(result);
    } finally {
      setPending(false);
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      await apply(await verifyEmailCode(clerk(), mode, code));
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    if (busy || waitSeconds > 0) return;
    setPending(true);
    setMessage("");
    try {
      const sent = await resendEmailCode(clerk(), mode, email);
      if (sent.ok) markSent();
      setMessage(sent.message);
    } finally {
      setPending(false);
    }
  }

  async function startOver() {
    setPending(true);
    try {
      await resetEmailCode(clerk());
    } finally {
      setPending(false);
    }
    setStep("email");
    setCode("");
    setMessage("");
    setSentAt(null);
  }

  if (!isLoaded) return <p className="text-muted">Loading sign-in…</p>;
  if (isSignedIn) return <p className="text-muted">You&apos;re signed in. Taking you back…</p>;

  return (
    <section className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted">We&apos;ll email you a one-time code. No password.</p>
      {step === "email" ? (
        <form className="mt-8 space-y-4" onSubmit={(event) => void send(event)}>
          <label className="block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-line bg-elev px-4 py-3 text-base"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-60"
          >
            Email me a code
          </button>
        </form>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={(event) => void verify(event)}>
          <p className="text-sm text-muted">
            Enter the code sent to <span className="text-ink">{email}</span>.
          </p>
          <label className="block text-sm font-semibold" htmlFor="code">
            Email code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="w-full rounded-xl border border-line bg-elev px-4 py-3 text-base tracking-widest"
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-60"
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={busy || waitSeconds > 0}
              className="text-sm text-accent underline-offset-2 hover:underline disabled:opacity-60 disabled:no-underline"
              onClick={() => void resend()}
            >
              {waitSeconds > 0 ? `Send a new code in ${waitSeconds}s` : "Send a new code"}
            </button>
            <button
              type="button"
              className="text-sm text-muted underline-offset-2 hover:underline"
              onClick={() => void startOver()}
            >
              Use a different email
            </button>
          </div>
        </form>
      )}
      {message ? (
        <p role="alert" className="mt-4 text-sm">
          {message}
        </p>
      ) : null}
      <div id="clerk-captcha" />
    </section>
  );
}
