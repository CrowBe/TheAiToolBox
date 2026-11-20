import { Suspense } from "react";
import Link from "next/link";
import { countValue } from "@/engine/access";
import { countLabel } from "@/engine/text";
import type { BoxConfig, Collection, VocabularyEntry } from "@/engine/types";
import { CatalogBrowser } from "./browser";
import { CatalogFallback } from "./fallback";

export function CollectionIndex({
  box,
  items,
  collection,
}: {
  box: BoxConfig;
  items: readonly object[];
  collection: Collection;
}) {
  const entries = box.vocabularies[collection.vocabulary] ?? [];
  return (
    <div>
      <h1 className="font-serif text-4xl tracking-tight">{collection.label}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        {entries.length.toLocaleString("en")} {collection.label.toLowerCase()} in {box.site.shortName}.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => {
          const count = countValue(items, collection.field, entry.id);
          return (
            <li key={entry.id}>
              <Link
                href={`${collection.path}/${entry.id}`}
                className="block h-full rounded-2xl border border-line bg-elev p-4 no-underline hover:border-accent"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-2xl">{entry.label}</span>
                  <span className="text-sm text-muted">{countLabel(count, box.item.noun)}</span>
                </span>
                {entry.description ? (
                  <span className="mt-2 block text-sm leading-snug text-muted line-clamp-3">
                    {entry.description}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CollectionPage({
  box,
  items,
  collection,
  entry,
}: {
  box: BoxConfig;
  items: readonly object[];
  collection: Collection;
  entry: VocabularyEntry;
}) {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                All {box.item.noun.other}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={collection.path} className="hover:text-accent">
                {collection.label}
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">{entry.label}</h1>
        {entry.description ? <p className="mt-3 text-lg text-muted">{entry.description}</p> : null}
      </header>
      <Suspense
        fallback={
          <CatalogFallback
            box={box}
            items={items}
            locked={{ field: collection.field, value: entry.id }}
          />
        }
      >
        <CatalogBrowser
          box={box}
          items={items}
          lockedField={collection.field}
          lockedValue={entry.id}
        />
      </Suspense>
    </div>
  );
}
