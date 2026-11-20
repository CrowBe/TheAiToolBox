"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CommandItem, CommandList } from "@ui-sdk/react/command";
import { itemHref, markFrom, readValues } from "@/engine/access";
import type { BoxConfig } from "@/engine/types";
import { cardBadges } from "./card";
import { ItemMark } from "./mark";
import { listValues, useVirtualRows, VirtualSpacer } from "./virtual";

const rowEstimate = 108;

export type CatalogCommand = {
  value: string;
  label: string;
  href: string;
  subtitle: string;
  badges: { key: string; label: string }[];
  mark: { name: string; url: string; color?: string };
};

export function toCatalogCommand(box: BoxConfig, item: object): CatalogCommand {
  const title = readValues(item, box.card.titleField)[0] ?? "Untitled";
  const mark = markFrom(box.card.mark, item);
  return {
    value: readValues(item, box.item.slugField)[0] ?? title,
    label: title,
    href: itemHref(box, item),
    subtitle: readValues(item, box.card.subtitleField)[0] ?? "",
    badges: cardBadges(box, item),
    mark: { name: mark.name || title, url: mark.url, color: mark.color },
  };
}

export function CommandResults({
  commands,
  maxHeight,
  scrollToRef,
}: {
  commands: readonly CatalogCommand[];
  maxHeight: string;
  scrollToRef: { current: ((index: number) => void) | null };
}) {
  const lookup = new Map(commands.map((command) => [command.value, command]));
  return (
    <CommandList>
      {(state) => {
        const ranked = listValues(state.items).flatMap((item) => {
          const command = lookup.get(item.value);
          return command ? [command] : [];
        });
        const ordered = ranked.length > 0 || commands.length === 0 ? ranked : commands;
        return (
          <VirtualCommandRows ordered={ordered} maxHeight={maxHeight} scrollToRef={scrollToRef} />
        );
      }}
    </CommandList>
  );
}

function VirtualCommandRows({
  ordered,
  maxHeight,
  scrollToRef,
}: {
  ordered: readonly CatalogCommand[];
  maxHeight: string;
  scrollToRef: { current: ((index: number) => void) | null };
}) {
  const keys = ordered.map((command) => command.value);
  const labelAt = (index: number) => ordered[index]?.label ?? "";
  const virtual = useVirtualRows(keys, rowEstimate, labelAt);
  const scrollToIndex = virtual.scrollToIndex;
  const cleanups = useRef(new Map<number, () => void>());

  useEffect(() => {
    scrollToRef.current = scrollToIndex;
    return () => {
      scrollToRef.current = null;
    };
  }, [scrollToRef, scrollToIndex]);

  return (
    <VirtualSpacer
      rows={virtual.rows}
      size={virtual.size}
      estimate={rowEstimate}
      count={ordered.length}
      setScroller={virtual.setScroller}
      maxHeight={maxHeight}
      renderRow={(row) => {
        const command = ordered[row.index];
        if (!command) return null;
        return (
          <div
            key={row.key}
            className="absolute inset-x-0"
            style={{ top: row.start }}
            ref={(node) => {
              cleanups.current.get(row.index)?.();
              cleanups.current.delete(row.index);
              if (node) cleanups.current.set(row.index, virtual.measure(row.index, node));
            }}
          >
            <CommandItem
              value={command.value}
              label={command.label}
              index={row.index}
              render={<Link href={command.href} />}
            >
              <ItemMark name={command.mark.name} url={command.mark.url} color={command.mark.color} />
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-lg leading-tight">{command.label}</span>
                {command.subtitle ? (
                  <span className="mt-1 block text-sm leading-snug text-muted line-clamp-2">
                    {command.subtitle}
                  </span>
                ) : null}
                {command.badges.length > 0 ? (
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {command.badges.map((badge) => (
                      <span key={badge.key} className="rounded-full bg-chip px-2 py-0.5 text-xs">
                        {badge.label}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </CommandItem>
          </div>
        );
      }}
    />
  );
}
