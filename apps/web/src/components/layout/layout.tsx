import { ReactNode } from "react";
import { Nav } from "./nav";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Nav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
