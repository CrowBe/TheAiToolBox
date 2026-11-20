import { Suspense } from "react";
import { clerkEnabled } from "./config";
import { EmailCodeSignIn } from "./email-code";

export function SignScreen() {
  return (
    <Suspense fallback={<p className="text-muted">Loading sign-in…</p>}>
      {clerkEnabled() ? <EmailCodeSignIn /> : <SignInUnavailable />}
    </Suspense>
  );
}

function SignInUnavailable() {
  return (
    <section className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted">
        We&apos;ll email you a one-time code. No password. Saving stays off until Clerk keys are set.
      </p>
    </section>
  );
}
