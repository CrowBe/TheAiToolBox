"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { safeNextPath } from "./next-path";

type Mode = "sign-in" | "sign-up";
type Step = "email" | "code";

function messageOf(error: { longMessage?: string; message: string } | null): string {
  return error?.longMessage || error?.message || "Something went wrong. Try again.";
}

export function EmailCodeSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = safeNextPath(params.get("next"));
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [mode, setMode] = useState<Mode>("sign-in");
  const [message, setMessage] = useState("");
  const busy = signInStatus === "fetching" || signUpStatus === "fetching";

  function go(session: { currentTask?: unknown } | null | undefined, decorateUrl: (url: string) => string) {
    if (session?.currentTask) {
      setMessage("This account still has a required step. Finish it, then try again.");
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

  async function sendSignUp(address: string) {
    const created = await signUp.create({ emailAddress: address });
    if (created.error) {
      setMessage(messageOf(created.error));
      return;
    }
    const sent = await signUp.verifications.sendEmailCode();
    if (sent.error) {
      setMessage(messageOf(sent.error));
      return;
    }
    setMode("sign-up");
    setStep("code");
    setMessage("");
  }

  async function send(formData: FormData) {
    const address = String(formData.get("email") ?? "").trim();
    if (!address.includes("@")) {
      setMessage("Enter an email address.");
      return;
    }
    setEmail(address);
    setMessage("");
    const created = await signIn.create({ identifier: address });
    if (created.error?.code === "form_identifier_not_found" || signIn.isTransferable) {
      await sendSignUp(address);
      return;
    }
    if (created.error) {
      setMessage(messageOf(created.error));
      return;
    }
    const sent = await signIn.emailCode.sendCode({ emailAddress: address });
    if (sent.error) {
      setMessage(messageOf(sent.error));
      return;
    }
    setMode("sign-in");
    setStep("code");
  }

  async function verify(formData: FormData) {
    const token = String(formData.get("code") ?? "").trim();
    if (!token) {
      setMessage("Enter the code from your email.");
      return;
    }
    setMessage("");
    if (mode === "sign-up") {
      const verified = await signUp.verifications.verifyEmailCode({ code: token });
      if (verified.error) {
        setMessage(messageOf(verified.error));
        return;
      }
      if (signUp.status !== "complete") {
        setMessage("Enter the code from your email.");
        return;
      }
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => go(session, decorateUrl),
      });
      return;
    }
    const verified = await signIn.emailCode.verifyCode({ code: token });
    if (verified.error) {
      setMessage(messageOf(verified.error));
      return;
    }
    if (signIn.status !== "complete") {
      setMessage("Enter the code from your email.");
      return;
    }
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => go(session, decorateUrl),
    });
  }

  async function resend() {
    setMessage("");
    const sent =
      mode === "sign-up"
        ? await signUp.verifications.sendEmailCode()
        : await signIn.emailCode.sendCode({ emailAddress: email });
    if (sent.error) setMessage(messageOf(sent.error));
  }

  function startOver() {
    void signIn.reset();
    void signUp.reset();
    setStep("email");
    setCode("");
    setMessage("");
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted">We&apos;ll email you a one-time code. No password.</p>
      {step === "email" ? (
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send(new FormData(event.currentTarget));
          }}
        >
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
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void verify(new FormData(event.currentTarget));
          }}
        >
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
            <button type="button" className="text-sm text-accent underline-offset-2 hover:underline" onClick={() => void resend()}>
              Send a new code
            </button>
            <button type="button" className="text-sm text-muted underline-offset-2 hover:underline" onClick={startOver}>
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
