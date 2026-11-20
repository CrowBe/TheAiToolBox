import { readValues } from "./access";
import { normalizeText } from "./text";
import type { BoxConfig, FilterState, LockedFilter } from "./types";

export function emptyFilterState(config: BoxConfig): FilterState {
  const selected: Record<string, string[]> = {};
  for (const label of config.labels) selected[label.field] = [];
  return { q: "", selected };
}

export function sameFilterState(a: FilterState, b: FilterState): boolean {
  if (a.q !== b.q) return false;
  const fields = new Set([...Object.keys(a.selected), ...Object.keys(b.selected)]);
  for (const field of fields) {
    const left = a.selected[field] ?? [];
    const right = b.selected[field] ?? [];
    if (left.length !== right.length || left.some((value, index) => value !== right[index])) {
      return false;
    }
  }
  return true;
}

export function withoutField(state: FilterState, field: string | undefined): FilterState {
  if (!field) return state;
  const current = state.selected[field] ?? [];
  if (current.length === 0) return state;
  return { ...state, selected: { ...state.selected, [field]: [] } };
}

function tokens(query: string): string[] {
  const normalized = normalizeText(query);
  return normalized ? normalized.split(" ") : [];
}

function haystack(item: object, config: BoxConfig): string {
  const parts: string[] = [];
  for (const field of config.search.fields) parts.push(...readValues(item, field));
  return normalizeText(parts.join(" "));
}

export function matchesQuery(item: object, config: BoxConfig, query: string): boolean {
  const parts = tokens(query);
  if (parts.length === 0) return true;
  const text = haystack(item, config);
  return parts.every((part) => text.includes(part));
}

export function matchesSelected(
  item: object,
  field: string,
  selected: readonly string[],
): boolean {
  if (selected.length === 0) return true;
  const values = readValues(item, field);
  return selected.some((value) => values.includes(value));
}

export function matchesFilters(
  item: object,
  config: BoxConfig,
  state: FilterState,
  locked?: LockedFilter,
): boolean {
  if (locked && !matchesSelected(item, locked.field, [locked.value])) return false;
  if (!matchesQuery(item, config, state.q)) return false;
  for (const label of config.labels) {
    if (locked?.field === label.field) continue;
    const selected = state.selected[label.field] ?? [];
    if (!matchesSelected(item, label.field, selected)) return false;
  }
  return true;
}

function compareItems(a: object, b: object, field: string): number {
  const left = readValues(a, field)[0] ?? "";
  const right = readValues(b, field)[0] ?? "";
  return left.localeCompare(right, "en", { sensitivity: "base", numeric: true });
}

export function applyCatalogFilters<T extends object>(
  items: readonly T[],
  config: BoxConfig,
  state: FilterState,
  locked?: LockedFilter,
): T[] {
  return items
    .filter((item) => matchesFilters(item, config, state, locked))
    .slice()
    .sort((a, b) => compareItems(a, b, config.item.sortField));
}
