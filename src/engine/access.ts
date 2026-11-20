import type { BoxConfig, MarkConfig } from "./types";

function readField(item: object, field: string): unknown {
  const found = Object.entries(item).find(([key]) => key === field);
  return found ? found[1] : undefined;
}

export function readValues(item: object, field: string): string[] {
  const value = readField(item, field);
  if (typeof value === "string" && value.trim()) return [value];
  if (typeof value === "number" && Number.isFinite(value)) return [String(value)];
  if (typeof value === "boolean") return [value ? "true" : "false"];
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string" && entry.trim()) return [entry];
    if (typeof entry === "number" && Number.isFinite(entry)) return [String(entry)];
    return [];
  });
}

export function itemHref(config: BoxConfig, item: object): string {
  const slug = readValues(item, config.item.slugField)[0] ?? "";
  return `${config.item.path}/${encodeURIComponent(slug)}`;
}

export function vocabularyLabel(
  config: BoxConfig,
  vocabulary: string | undefined,
  value: string,
): string {
  if (!vocabulary) return value;
  const entry = config.vocabularies[vocabulary]?.find((item) => item.id === value);
  return entry?.label ?? value;
}

export function countValue(items: readonly object[], field: string, value: string): number {
  return items.filter((item) => readValues(item, field).includes(value)).length;
}

export function markFrom(config: MarkConfig | undefined, item: object): {
  name: string;
  url: string;
  color?: string;
} {
  if (!config) return { name: "", url: "" };
  const color = config.colorField ? readValues(item, config.colorField)[0] : undefined;
  return {
    name: readValues(item, config.nameField)[0] ?? "",
    url: readValues(item, config.urlField)[0] ?? "",
    color: color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : undefined,
  };
}
