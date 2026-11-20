"use client";

import Link from "next/link";
import { readValues } from "@/engine/access";
import { countLabel } from "@/engine/text";
import type { BoxConfig } from "@/engine/types";
import { ItemGrid } from "./card";
import { useSavedSession } from "./session";

export function LibraryView({ box, items }: { box: BoxConfig; items: readonly object[] }) {
  const session = useSavedSession();
  const bySlug = new Map(
    items.flatMap((item) => {
      const slug = readValues(item, box.item.slugField)[0];
      return slug ? [[slug, item] as const] : [];
    }),
  );
  const saved = session.slugs.flatMap((slug) => {
    const item = bySlug.get(slug);
    return item ? [item] : [];
  });

  if (session.auth === "loading") {
    return (
      <section>
        <h1 className="font-serif text-4xl tracking-tight">{box.library.label}</h1>
        <p className="mt-3 text-muted">Loading saved {box.item.noun.other}…</p>
      </section>
    );
  }

  if (session.auth !== "signed-in") {
    return (
      <section className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
        <h1 className="font-serif text-4xl tracking-tight">Sign in to save</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Save {box.item.noun.other} to {box.library.label}. We&apos;ll email you a one-time code. No password.
        </p>
        {session.auth === "signed-out" ? (
          <Link
            href={session.signInHref}
            className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink no-underline"
          >
            Email me a code
          </Link>
        ) : (
          <p className="mt-4 text-sm text-muted">Saving stays off until Clerk keys are set.</p>
        )}
      </section>
    );
  }

  return (
    <section>
      <h1 className="font-serif text-4xl tracking-tight">{box.library.label}</h1>
      <p className="mt-3 text-muted">
        {saved.length === 0
          ? `No saved ${box.item.noun.other} yet.`
          : countLabel(saved.length, box.item.noun)}
      </p>
      {saved.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-serif text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-muted">Save a {box.item.noun.one} from the catalog and it will show up here.</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink no-underline"
          >
            Browse {box.item.noun.other}
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <ItemGrid box={box} items={saved} />
        </div>
      )}
    </section>
  );
}
