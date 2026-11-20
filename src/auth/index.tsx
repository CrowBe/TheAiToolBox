import type { ReactNode } from "react";

export type Viewer = { state: "signed-out" } | { state: "signed-in"; userId: string };

/**
 * Clerk seam. Browsing stays signed out until a later change reads
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in the browser and CLERK_SECRET_KEY
 * on the server. Neither variable is required to build or browse.
 * Saved tools should key off `getViewer()` once sign-in exists.
 */
export function getViewer(): Viewer {
  return { state: "signed-out" };
}

export function AuthBoundary({ children }: { children: ReactNode }) {
  return children;
}

export function AccountSlot({ viewer }: { viewer: Viewer }) {
  if (viewer.state === "signed-out") return null;
  return <span className="text-sm">{viewer.userId}</span>;
}
