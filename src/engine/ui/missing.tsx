import Link from "next/link";
import type { BoxConfig } from "@/engine/types";

export function MissingView({ box }: { box: BoxConfig }) {
  return (
    <div className="mx-auto max-w-lg py-16">
      <h1 className="font-serif text-4xl tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">That page is not in the catalog.</p>
      <Link href="/" className="mt-6 inline-block text-accent">
        Back to {box.site.shortName}
      </Link>
    </div>
  );
}
