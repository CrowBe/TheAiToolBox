import { applyCatalogFilters, emptyFilterState } from "@/engine/filter";
import { countLabel } from "@/engine/text";
import type { BoxConfig, LockedFilter } from "@/engine/types";
import { ItemGrid } from "./card";

export function CatalogFallback({
  box,
  items,
  locked,
}: {
  box: BoxConfig;
  items: readonly object[];
  locked?: LockedFilter;
}) {
  const results = applyCatalogFilters(items, box, emptyFilterState(box), locked);
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold" htmlFor="catalog-search-fallback">
        Search
      </label>
      <input
        id="catalog-search-fallback"
        type="search"
        disabled
        placeholder={box.search.placeholder}
        className="w-full rounded-xl border border-line bg-elev px-4 py-3 text-base"
      />
      <p className="mt-4 text-sm text-muted">{countLabel(results.length, box.item.noun)}</p>
      <div className="mt-6">
        <ItemGrid box={box} items={results} />
      </div>
    </div>
  );
}
