"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandInput } from "@ui-sdk/react/command";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { applyCatalogFilters, emptyFilterState } from "@/engine/filter";
import type { BoxConfig } from "@/engine/types";
import { CloseIcon } from "./icons";
import { CommandResults, toCatalogCommand } from "./results";

export function CatalogPalette({ box, items }: { box: BoxConfig; items: readonly object[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const scrollToRef = useRef<((index: number) => void) | null>(null);
  const commands = useMemo(() => {
    const state = { ...emptyFilterState(box), q: query };
    return applyCatalogFilters(items, box, state).map((item) => toCatalogCommand(box, item));
  }, [box, items, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogTrigger shortcut="mod+k" className="inline-flex items-center gap-2 rounded-full border border-line bg-elev px-3 py-1.5 text-sm">
        Search
        <DialogShortcut />
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <div className="flex items-start justify-between gap-3">
          <div>
            <DialogTitle className="font-serif text-xl">Search {box.item.noun.other}</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted">
              Jump to a {box.item.noun.one}. Filters on the page stay as they are.
            </DialogDescription>
          </div>
          <DialogClose aria-label="Close search" className="rounded-full border border-line p-1">
            <CloseIcon />
          </DialogClose>
        </div>
        <Command
          items={commands}
          filter={false}
          query={query}
          onQueryChange={(next) => setQuery(next)}
          onValueChange={(_value, details) => {
            if (details.index >= 0) scrollToRef.current?.(details.index);
          }}
          onAction={(value) => {
            const href = commands.find((command) => command.value === value)?.href;
            if (!href) return;
            setOpen(false);
            setQuery("");
            router.push(href);
          }}
        >
          <CommandInput
            aria-label={`Search ${box.item.noun.other}`}
            placeholder={box.search.placeholder}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {commands.length === 0 ? (
            <CommandEmpty className="px-1 py-6 text-sm">No {box.item.noun.other} match.</CommandEmpty>
          ) : (
            <div className="mt-3">
              <CommandResults commands={commands} maxHeight="20rem" scrollToRef={scrollToRef} />
            </div>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
