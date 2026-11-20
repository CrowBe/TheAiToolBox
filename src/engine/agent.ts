import { readValues, itemHref } from "./access";
import { applyCatalogFilters, emptyFilterState } from "./filter";
import { optionsFor } from "./options";
import type { BoxConfig, LabelField } from "./types";

type SchemaProperty = {
  type: string;
  description: string;
  items?: { type: string; enum?: string[] };
  minimum?: number;
  maximum?: number;
};

export type CatalogToolSchema = {
  type: "object";
  properties: Record<string, SchemaProperty>;
  required?: string[];
};

export type CatalogTool = {
  name: string;
  description: string;
  inputSchema: CatalogToolSchema;
  annotations: { readOnlyHint: true };
  execute: (input: unknown) => unknown;
};

type RegisterTool = (
  tool: {
    name: string;
    description: string;
    inputSchema: CatalogToolSchema;
    annotations: { readOnlyHint: true };
    execute: (input: unknown) => unknown;
  },
  options?: { signal?: AbortSignal },
) => unknown;

const annotations = { readOnlyHint: true } as const;

function agentName(noun: string): string {
  const cleaned = noun
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || "record";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function vocabularyIds(config: BoxConfig, label: LabelField): string[] | undefined {
  if (!label.vocabulary) return undefined;
  const entries = config.vocabularies[label.vocabulary];
  return entries?.map((entry) => entry.id);
}

function labelProperty(config: BoxConfig, label: LabelField): SchemaProperty {
  const allowed = vocabularyIds(config, label);
  const items: { type: string; enum?: string[] } =
    label.type === "number" ? { type: "integer" } : { type: "string" };
  if (allowed && allowed.length > 0 && items.type === "string") items.enum = allowed;
  return {
    type: "array",
    description: `${label.label}. A record matches when it has any of these.`,
    items,
  };
}

function readList(
  label: LabelField,
  value: unknown,
  allowed: string[] | undefined,
): string[] | { error: string; values?: string[] } {
  const entries = Array.isArray(value) ? value : [value];
  const parsed: string[] = [];
  for (const entry of entries) {
    if (label.type === "number" && typeof entry === "number" && Number.isFinite(entry)) {
      parsed.push(String(entry));
      continue;
    }
    if (typeof entry === "string" && entry.trim()) {
      parsed.push(entry.trim());
      continue;
    }
    return { error: `${label.field} has a value of the wrong kind.` };
  }
  if (!allowed) return parsed;
  const known = new Set(allowed);
  const unknown = parsed.filter((entry) => !known.has(entry));
  if (unknown.length > 0) return { error: `Unknown ${label.field}.`, values: allowed };
  return parsed;
}

function searchTool(config: BoxConfig, items: readonly object[]): CatalogTool {
  const properties: Record<string, SchemaProperty> = {
    query: { type: "string", description: "Words to match." },
  };
  for (const label of config.labels) properties[label.field] = labelProperty(config, label);
  return {
    name: `search_${agentName(config.item.noun.other)}`,
    description: `Finds ${config.item.noun.other} in ${config.site.name}.`,
    inputSchema: { type: "object", properties },
    annotations,
    execute(input) {
      try {
        if (!isRecord(input)) return { error: "Input must be an object." };
        const query = input.query;
        if (query !== undefined && typeof query !== "string") return { error: "query must be text." };
        const selected: Record<string, string[]> = {};
        for (const label of config.labels) selected[label.field] = [];
        for (const label of config.labels) {
          if (input[label.field] === undefined) continue;
          const parsed = readList(label, input[label.field], vocabularyIds(config, label));
          if ("error" in parsed) return parsed;
          selected[label.field] = parsed;
        }
        const matches = applyCatalogFilters(items, config, {
          q: typeof query === "string" ? query : "",
          selected,
        });
        return {
          total: matches.length,
          matches: matches.map((item) => {
            const labels: Record<string, string[]> = {};
            for (const label of config.labels) labels[label.field] = readValues(item, label.field);
            return {
              slug: readValues(item, config.item.slugField)[0] ?? "",
              title: readValues(item, config.card.titleField)[0] ?? "",
              subtitle: readValues(item, config.card.subtitleField)[0] ?? "",
              href: itemHref(config, item),
              url: readValues(item, config.detail.linkField)[0] ?? "",
              labels,
            };
          }),
        };
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Search failed." };
      }
    },
  };
}

function getTool(config: BoxConfig, items: readonly object[]): CatalogTool {
  const noun = config.item.noun.one;
  return {
    name: `get_${agentName(noun)}`,
    description: `Returns one ${noun} from ${config.site.name} when its slug is known.`,
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: `Slug of the ${noun}.` } },
      required: ["slug"],
    },
    annotations,
    execute(input) {
      try {
        if (!isRecord(input) || typeof input.slug !== "string" || !input.slug.trim()) {
          return { error: "Pass a slug." };
        }
        const slug = input.slug.trim();
        const item = items.find((entry) => readValues(entry, config.item.slugField)[0] === slug);
        if (!item) return { error: `No ${noun} found for slug "${slug}".` };
        return { ...item, href: itemHref(config, item) };
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Lookup failed." };
      }
    },
  };
}

function listLabels(config: BoxConfig, items: readonly object[]): CatalogTool {
  return {
    name: "list_labels",
    description: `Lists the labels that can filter ${config.site.name}, and the values in use.`,
    inputSchema: { type: "object", properties: {} },
    annotations,
    execute() {
      try {
        const state = emptyFilterState(config);
        return {
          labels: config.labels.map((label) => ({
            field: label.field,
            label: label.label,
            param: label.param ?? label.field,
            options: optionsFor(items, config, state, label).map((option) => ({
              value: option.value,
              label: option.label,
              count: option.count,
            })),
          })),
        };
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Could not list labels." };
      }
    },
  };
}

export function catalogTools(config: BoxConfig, items: readonly object[]): CatalogTool[] {
  return [searchTool(config, items), getTool(config, items), listLabels(config, items)];
}

function readRegister(host: object): RegisterTool | null {
  if (!("modelContext" in host)) return null;
  const context: unknown = host.modelContext;
  if (!context || typeof context !== "object" || !("registerTool" in context)) return null;
  const registerTool = context.registerTool;
  if (typeof registerTool !== "function") return null;
  const register = registerTool as RegisterTool;
  return (tool, options) => register.call(context, tool, options);
}

export function registerCatalogTools(
  host: object,
  config: BoxConfig,
  items: readonly object[],
  signal: AbortSignal,
): void {
  const register = readRegister(host);
  if (!register || signal.aborted) return;
  for (const tool of catalogTools(config, items)) {
    void Promise.resolve(register(tool, { signal })).catch(() => undefined);
  }
}
