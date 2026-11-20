import Link from "next/link";
import { itemHref, markFrom, readValues, vocabularyLabel } from "@/engine/access";
import type { BoxConfig } from "@/engine/types";
import { ItemMark } from "./mark";

export function cardBadges(config: BoxConfig, item: object): { key: string; label: string }[] {
  const badges: { key: string; label: string }[] = [];
  for (const label of config.labels) {
    if (!label.showOnCard) continue;
    const values = readValues(item, label.field).slice(0, label.cardLimit ?? 1);
    for (const value of values) {
      badges.push({
        key: `${label.field}:${value}`,
        label: vocabularyLabel(config, label.vocabulary, value),
      });
    }
  }
  return badges;
}

export function ItemCard({ box, item }: { box: BoxConfig; item: object }) {
  const title = readValues(item, box.card.titleField)[0] ?? "Untitled";
  const subtitle = readValues(item, box.card.subtitleField)[0] ?? "";
  const mark = markFrom(box.card.mark, item);
  const badges = cardBadges(box, item);

  return (
    <li className="h-full">
      <Link
        href={itemHref(box, item)}
        className="flex h-full flex-col rounded-2xl border border-line bg-elev p-4 no-underline transition-colors hover:border-accent"
      >
        <span className="flex items-start gap-3">
          <ItemMark name={mark.name || title} url={mark.url} color={mark.color} />
          <span className="min-w-0">
            <span className="block font-serif text-xl leading-tight">{title}</span>
            <span className="mt-1 block text-sm leading-snug text-muted line-clamp-3">{subtitle}</span>
          </span>
        </span>
        {badges.length > 0 ? (
          <span className="mt-4 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span key={badge.key} className="rounded-full bg-chip px-2 py-0.5 text-xs">
                {badge.label}
              </span>
            ))}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export function ItemGrid({ box, items }: { box: BoxConfig; items: readonly object[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={itemHref(box, item)} box={box} item={item} />
      ))}
    </ul>
  );
}
