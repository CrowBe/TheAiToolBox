import { Suspense } from "react";
import Link from "next/link";
import { countValue } from "@/engine/access";
import { countLabel } from "@/engine/text";
import type { BoxConfig } from "@/engine/types";
import { CatalogBrowser } from "./browser";
import { CatalogFallback } from "./fallback";

export function CatalogHome({ box, items }: { box: BoxConfig; items: readonly object[] }) {
  const featuredCollection = box.collections[0];
  const featured = featuredCollection
    ? (box.vocabularies[featuredCollection.vocabulary] ?? []).filter((entry) => entry.featured)
    : [];

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-accent">{box.site.tagline}</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">{box.site.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{box.site.description}</p>
        <p className="mt-4 text-sm text-muted">
          {countLabel(items.length, box.item.noun)}
          {box.collections.map((collection) => {
            const total = box.vocabularies[collection.vocabulary]?.length ?? 0;
            return (
              <span key={collection.path}>
                {" "}
                · {total.toLocaleString("en")} {collection.label.toLowerCase()}
              </span>
            );
          })}
        </p>
        {featuredCollection && featured.length > 0 ? (
          <ul className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {featured.map((entry) => (
              <li key={entry.id} className="shrink-0">
                <Link
                  href={`${featuredCollection.path}/${entry.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-elev px-3 py-1.5 text-sm no-underline hover:border-accent"
                >
                  {entry.label}
                  <span className="text-muted">
                    {countValue(items, featuredCollection.field, entry.id)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      <Suspense fallback={<CatalogFallback box={box} items={items} />}>
        <CatalogBrowser box={box} items={items} />
      </Suspense>
    </div>
  );
}
