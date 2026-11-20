import Link from "next/link";
import type { ReactNode } from "react";
import type { BoxConfig } from "@/engine/types";

export function SiteFrame({
  box,
  accountSlot,
  command,
  children,
}: {
  box: BoxConfig;
  accountSlot?: ReactNode;
  command?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="font-serif text-xl tracking-tight no-underline">
            {box.site.shortName}
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
            {command}
            {box.collections.map((collection) => (
              <Link key={collection.path} href={collection.path} className="no-underline hover:text-accent">
                {collection.label}
              </Link>
            ))}
            {accountSlot}
          </nav>
        </div>
      </header>
      <main id="content" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{box.site.name}</p>
          <p>{box.site.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
