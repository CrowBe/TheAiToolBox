"use client";

import type { ReactNode } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { SavedSession, type SessionAuth } from "@/engine/ui/session";
import type { BoxConfig } from "@/engine/types";

export function ClerkSession({
  box,
  items,
  signInPath,
  children,
}: {
  box: BoxConfig;
  items: readonly object[];
  signInPath: string;
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const auth: SessionAuth = !isLoaded ? "loading" : isSignedIn ? "signed-in" : "signed-out";
  return (
    <SavedSession
      box={box}
      items={items}
      auth={auth}
      signInPath={signInPath}
      onSignOut={() => {
        void signOut({ redirectUrl: "/" });
      }}
    >
      {children}
    </SavedSession>
  );
}
