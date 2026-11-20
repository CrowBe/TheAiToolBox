import { vocabularyLabel } from "./access";
import { emptyFilterState } from "./filter";
import type { BoxConfig, FilterState, LabelField } from "./types";

export type QueryInput = {
  get: (name: string) => string | null;
  getAll: (name: string) => string[];
};

export function queryParam(label: Pick<LabelField, "field" | "param">): string {
  return label.param ?? label.field;
}

export function parseFilterQuery(params: QueryInput, config: BoxConfig): FilterState {
  const state = emptyFilterState(config);
  const query = params.get("q");
  state.q = query ?? "";
  for (const label of config.labels) {
    const raw = params.getAll(queryParam(label));
    const values = raw.flatMap((value) => value.split(",")).map((value) => value.trim());
    const unique: string[] = [];
    for (const value of values) {
      if (!value || unique.includes(value)) continue;
      unique.push(value);
    }
    state.selected[label.field] = unique;
  }
  return state;
}

export function serializeFilterQuery(state: FilterState, config: BoxConfig): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q !== "") params.set("q", state.q);
  for (const label of config.labels) {
    const param = queryParam(label);
    for (const value of state.selected[label.field] ?? []) params.append(param, value);
  }
  return params;
}

export function labelHref(config: BoxConfig, field: string, value: string): string {
  const collection = config.collections.find((item) => item.field === field);
  if (collection) return `${collection.path}/${encodeURIComponent(value)}`;
  const label = config.labels.find((item) => item.field === field);
  const params = new URLSearchParams();
  params.append(label ? queryParam(label) : field, value);
  return `/?${params.toString()}`;
}

export function valueLabel(config: BoxConfig, field: string, value: string): string {
  const label = config.labels.find((item) => item.field === field);
  return vocabularyLabel(config, label?.vocabulary, value);
}
