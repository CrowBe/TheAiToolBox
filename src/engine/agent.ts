import { readValues, itemHref } from "./access";
import { applyCatalogFilters, emptyFilterState } from "./filter";
import { optionsFor } from "./options";
import { normalizeSlug } from "./saved";
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

export type SavedStore = {
  list: () => Promise<{ slugs: string[] } | { error: string }>;
  change: (action: "save" | "unsave", slug: string) => Promise<{ slugs: string[] } | { error: string }>;
};

export type SavedCatalogTool = {
  name: string;
  description: string;
  inputSchema: CatalogToolSchema;
  execute: (input: unknown) => Promise<unknown>;
};

type RegisterableTool = {
  name: string;
  description: string;
  inputSchema: CatalogToolSchema;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: unknown) => unknown;
};

type RegisterTool = (tool: RegisterableTool, options?: { signal?: AbortSignal }) => unknown;

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

const slugSchema = {
  type: "object" as const,
  properties: {
    slug: { type: "string", description: "Slug of the record." },
  },
  required: ["slug"],
};

function slugInput(input: unknown): { slug: string } | { error: string } {
  if (!isRecord(input)) return { error: "Input must be an object." };
  if (!("slug" in input)) return { error: "Pass a slug." };
  return normalizeSlug(input.slug);
}

function caught(error: unknown, fallback: string): { error: string } {
  return { error: error instanceof Error && error.message ? error.message : fallback };
}

function summary(config: BoxConfig, items: readonly object[], slug: string) {
  const item = items.find((entry) => readValues(entry, config.item.slugField)[0] === slug);
  if (!item) return { slug };
  return {
    slug,
    title: readValues(item, config.card.titleField)[0] ?? slug,
    href: itemHref(config, item),
  };
}

export function savedCatalogTools(
  config: BoxConfig,
  items: readonly object[],
  known: ReadonlySet<string>,
  store: SavedStore,
): SavedCatalogTool[] {
  const noun = config.item.noun.one;
  const name = agentName(noun);
  const slugField: CatalogToolSchema = {
    ...slugSchema,
    properties: {
      slug: { type: "string", description: `Slug of the ${noun}.` },
    },
  };

  return [
    {
      name: `save_${name}`,
      description: `Saves a ${noun} to ${config.library.label} in ${config.site.name}.`,
      inputSchema: slugField,
      async execute(input) {
        try {
          const parsed = slugInput(input);
          if ("error" in parsed) return parsed;
          if (!known.has(parsed.slug)) {
            return { error: `No ${noun} found for slug "${parsed.slug}".` };
          }
          const result = await store.change("save", parsed.slug);
          if ("error" in result) return result;
          return { slugs: result.slugs };
        } catch (error) {
          return caught(error, `Could not save the ${noun}.`);
        }
      },
    },
    {
      name: `unsave_${name}`,
      description: `Removes a ${noun} from ${config.library.label} in ${config.site.name}.`,
      inputSchema: slugField,
      async execute(input) {
        try {
          const parsed = slugInput(input);
          if ("error" in parsed) return parsed;
          const result = await store.change("unsave", parsed.slug);
          if ("error" in result) return result;
          return { slugs: result.slugs };
        } catch (error) {
          return caught(error, `Could not remove the ${noun}.`);
        }
      },
    },
    {
      name: "list_saved",
      description: `Lists ${config.item.noun.other} saved to ${config.library.label} in ${config.site.name}.`,
      inputSchema: { type: "object", properties: {} },
      async execute() {
        try {
          const result = await store.list();
          if ("error" in result) return result;
          const saved = result.slugs.map((slug) => summary(config, items, slug));
          return { total: saved.length, saved };
        } catch (error) {
          return caught(error, "Could not list saved records.");
        }
      },
    },
  ];
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

function registerTools(host: object, tools: readonly RegisterableTool[], signal: AbortSignal): void {
  const register = readRegister(host);
  if (!register || signal.aborted) return;
  for (const tool of tools) {
    void Promise.resolve(register(tool, { signal })).catch(() => undefined);
  }
}

export function registerCatalogTools(
  host: object,
  config: BoxConfig,
  items: readonly object[],
  signal: AbortSignal,
): void {
  registerTools(host, catalogTools(config, items), signal);
}

export function registerSavedTools(
  host: object,
  tools: readonly SavedCatalogTool[],
  signal: AbortSignal,
): void {
  registerTools(host, tools, signal);
}
