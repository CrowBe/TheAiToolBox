import type { Metadata } from "next";
import { SignScreen } from "@/auth/sign-screen";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with an email code to save tools.",
};

export default function SignUpPage() {
  return <SignScreen />;
}
