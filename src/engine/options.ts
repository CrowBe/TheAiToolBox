import { readValues, vocabularyLabel } from "./access";
import { matchesQuery, matchesSelected } from "./filter";
import type { BoxConfig, FilterOption, FilterState, LabelField, LockedFilter } from "./types";

export function facetCounts(
  items: readonly object[],
  config: BoxConfig,
  state: FilterState,
  field: string,
  locked?: LockedFilter,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (locked && !matchesSelected(item, locked.field, [locked.value])) continue;
    if (!matchesQuery(item, config, state.q)) continue;
    let include = true;
    for (const label of config.labels) {
      if (label.field === field || label.field === locked?.field) continue;
      const selected = state.selected[label.field] ?? [];
      if (!matchesSelected(item, label.field, selected)) {
        include = false;
        break;
      }
    }
    if (!include) continue;
    for (const value of readValues(item, field)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return counts;
}

export function optionsFor(
  items: readonly object[],
  config: BoxConfig,
  state: FilterState,
  label: LabelField,
  locked?: LockedFilter,
): FilterOption[] {
  const counts = facetCounts(items, config, state, label.field, locked);
  const selected = new Set(state.selected[label.field] ?? []);
  const vocabulary = label.vocabulary ? config.vocabularies[label.vocabulary] : undefined;
  const options: FilterOption[] = vocabulary
    ? vocabulary.map((entry) => ({
        value: entry.id,
        label: entry.label,
        count: counts.get(entry.id) ?? 0,
      }))
    : [...collectValues(items, label.field)].map((value) => ({
        value,
        label: vocabularyLabel(config, undefined, value),
        count: counts.get(value) ?? 0,
      }));

  if (!vocabulary) {
    options.sort((a, b) => {
      if (label.type === "number") return Number(b.value) - Number(a.value);
      return a.label.localeCompare(b.label, "en");
    });
  }

  return options.filter((option) => option.count > 0 || selected.has(option.value));
}

function collectValues(items: readonly object[], field: string): Set<string> {
  const values = new Set<string>();
  for (const item of items) {
    for (const value of readValues(item, field)) values.add(value);
  }
  return values;
}

export type ActiveFilter = {
  field: string;
  value: string;
  group: string;
  label: string;
};

export function activeFilters(
  config: BoxConfig,
  state: FilterState,
  lockedField?: string,
): ActiveFilter[] {
  const chips: ActiveFilter[] = [];
  for (const label of config.labels) {
    if (label.field === lockedField) continue;
    for (const value of state.selected[label.field] ?? []) {
      chips.push({
        field: label.field,
        value,
        group: label.label,
        label: vocabularyLabel(config, label.vocabulary, value),
      });
    }
  }
  return chips;
}
