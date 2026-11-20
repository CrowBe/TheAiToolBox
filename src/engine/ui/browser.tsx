"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Command, CommandEmpty, CommandInput, CommandStatus } from "@ui-sdk/react/command";
import { applyCatalogFilters, emptyFilterState, withoutField } from "@/engine/filter";
import { parseFilterQuery, serializeFilterQuery } from "@/engine/query";
import { countLabel } from "@/engine/text";
import type { BoxConfig, FilterState, LockedFilter } from "@/engine/types";
import { FilterPanel } from "./filters";
import { CommandResults, toCatalogCommand } from "./results";

export function CatalogBrowser({
  box,
  items,
  lockedField,
  lockedValue,
}: {
  box: BoxConfig;
  items: readonly object[];
  lockedField?: string;
  lockedValue?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchId = useId();
  const locked: LockedFilter | undefined =
    lockedField && lockedValue ? { field: lockedField, value: lockedValue } : undefined;
  const [state, setState] = useState<FilterState>(() =>
    withoutField(parseFilterQuery(searchParams, box), lockedField),
  );
  const stateRef = useRef(state);
  const scrollToRef = useRef<((index: number) => void) | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const onPop = () => {
      const next = withoutField(
        parseFilterQuery(new URLSearchParams(window.location.search), box),
        lockedField,
      );
      stateRef.current = next;
      setState(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [box, lockedField]);

  function commit(next: FilterState) {
    const cleaned = withoutField(next, lockedField);
    stateRef.current = cleaned;
    setState(cleaned);
    const query = serializeFilterQuery(cleaned, box).toString();
    const url = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(window.history.state, "", url);
  }

  function setField(field: string, values: string[]) {
    const current = stateRef.current;
    commit({ ...current, selected: { ...current.selected, [field]: values } });
  }

  function clear() {
    commit(emptyFilterState(box));
  }

  const results = applyCatalogFilters(items, box, state, locked);
  const commands = results.map((item) => toCatalogCommand(box, item));
  const selectedCount = Object.values(state.selected).reduce((sum, values) => sum + values.length, 0);
  const activeCount = selectedCount + (state.q.trim() ? 1 : 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:items-start">
      <aside
        id="catalog-filters"
        className={`lg:sticky lg:top-20 lg:col-start-1 lg:row-start-1 ${
          filtersOpen ? "block" : "hidden lg:block"
        }`}
      >
        <FilterPanel box={box} items={items} state={state} locked={locked} onChange={setField} />
      </aside>
      <div className="min-w-0 lg:col-start-2">
        <div className="mb-3 flex flex-wrap items-center gap-2 lg:hidden">
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 text-sm"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
        <Command
          items={commands}
          filter={false}
          query={state.q}
          autoHighlight={false}
          onQueryChange={(next) => {
            if (next === stateRef.current.q) return;
            commit({ ...stateRef.current, q: next });
          }}
          onValueChange={(_value, details) => {
            if (details.index >= 0) scrollToRef.current?.(details.index);
          }}
          onAction={(value) => {
            const href = commands.find((command) => command.value === value)?.href;
            if (href) router.push(href);
          }}
        >
          <label id={searchId} className="mb-2 block text-sm font-semibold">
            Search
          </label>
          <CommandInput
            aria-labelledby={searchId}
            placeholder={box.search.placeholder}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CommandStatus className="text-sm text-muted">
              {(status) => countLabel(status.count, box.item.noun)}
            </CommandStatus>
            {activeCount > 0 ? (
              <button
                type="button"
                className="text-sm text-accent underline-offset-2 hover:underline"
                onClick={clear}
              >
                Clear
              </button>
            ) : null}
          </div>
          {commands.length === 0 ? (
            <CommandEmpty className="mt-6 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-serif text-2xl text-ink">No {box.item.noun.other} match</p>
              <p className="mt-2">Try a shorter search or clear a filter.</p>
              <button
                type="button"
                className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                onClick={clear}
              >
                Clear filters
              </button>
            </CommandEmpty>
          ) : (
            <div className="mt-4">
              <CommandResults commands={commands} maxHeight="70dvh" scrollToRef={scrollToRef} />
            </div>
          )}
        </Command>
      </div>
    </div>
  );
}
