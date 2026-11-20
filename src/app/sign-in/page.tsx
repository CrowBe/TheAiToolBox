import type { Metadata } from "next";
import { Suspense } from "react";
import { clerkEnabled } from "@/auth/config";
import { EmailCodeSignIn } from "@/auth/email-code";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with an email code to save tools.",
};

export default function SignInPage() {
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
