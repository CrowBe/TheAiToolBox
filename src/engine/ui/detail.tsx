import Link from "next/link";
import { markFrom, readValues, vocabularyLabel } from "@/engine/access";
import { labelHref } from "@/engine/query";
import { siteHostname } from "@/engine/text";
import type { BoxConfig } from "@/engine/types";
import { ItemMark } from "./mark";

export function DetailView({ box, item }: { box: BoxConfig; item: object }) {
  const title = readValues(item, box.detail.titleField)[0] ?? "Untitled";
  const subtitle = readValues(item, box.detail.subtitleField)[0] ?? "";
  const body = readValues(item, box.detail.bodyField)[0] ?? "";
  const link = readValues(item, box.detail.linkField)[0] ?? "";
  const mark = markFrom(box.detail.mark, item);
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              All {box.item.noun.other}
            </Link>
          </li>
          {box.collections.flatMap((collection) => {
            const values = readValues(item, collection.field);
            if (values.length !== 1) return [];
            const value = values[0] ?? "";
            return [
              <li key={`${collection.path}-sep`} aria-hidden="true">
                /
              </li>,
              <li key={collection.path}>
                <Link href={`${collection.path}/${encodeURIComponent(value)}`} className="hover:text-accent">
                  {vocabularyLabel(box, collection.vocabulary, value)}
                </Link>
              </li>,
            ];
          })}
        </ol>
      </nav>
      <header className="mt-4 flex items-start gap-4">
        <ItemMark name={mark.name || title} url={mark.url} color={mark.color} size="lg" />
        <div className="min-w-0">
          <h1 className="font-serif text-4xl tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-lg text-muted">{subtitle}</p> : null}
        </div>
      </header>
      {link ? (
        <p className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink no-underline"
          >
            {box.detail.linkLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span className="text-sm text-muted">{siteHostname(link)}</span>
        </p>
      ) : null}
      <div className="mt-8 space-y-4 text-base leading-relaxed">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      <dl className="mt-10 space-y-4 border-t border-line pt-6">
        {box.detail.meta.map((meta) => (
          <div key={meta.field} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <dt className="text-sm font-semibold">{meta.label}</dt>
            <dd className="text-sm leading-relaxed">{readValues(item, meta.field)[0] ?? "—"}</dd>
          </div>
        ))}
        {box.labels.map((label) => {
          const values = readValues(item, label.field);
          if (values.length === 0) return null;
          return (
            <div key={label.field} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <dt className="text-sm font-semibold">{label.label}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {values.map((value) => (
                  <Link
                    key={value}
                    href={labelHref(box, label.field, value)}
                    className="rounded-full bg-chip px-2.5 py-1 text-sm no-underline hover:bg-accent hover:text-accent-ink"
                  >
                    {vocabularyLabel(box, label.vocabulary, value)}
                  </Link>
                ))}
              </dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
}
