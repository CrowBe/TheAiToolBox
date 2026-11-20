import { describe, expect, it, vi } from "vitest";
import { box as aitoolbox } from "@/boxes/aitoolbox/config";
import {
  catalogTools,
  registerCatalogTools,
  registerSavedTools,
  savedCatalogTools,
  type CatalogToolSchema,
  type SavedStore,
} from "./agent";
import type { BoxConfig } from "./types";

const box: BoxConfig = {
  id: "fixture",
  site: {
    name: "Fixture Box",
    shortName: "Fixture",
    tagline: "A fixture catalog.",
    description: "Used by engine tests.",
  },
  item: {
    noun: { one: "item", other: "items" },
    idField: "id",
    slugField: "slug",
    sortField: "name",
    path: "/items",
  },
  search: { fields: ["name", "summary", "tags"], placeholder: "Search items" },
  labels: [
    {
      field: "kind",
      label: "Kind",
      type: "string",
      control: "combobox",
      vocabulary: "kinds",
      param: "kind",
    },
    { field: "tags", label: "Tags", type: "string-list", control: "combobox", param: "tag" },
    { field: "year", label: "Year", type: "number", control: "combobox", param: "year" },
  ],
  card: { titleField: "name", subtitleField: "summary" },
  detail: {
    titleField: "name",
    subtitleField: "summary",
    bodyField: "summary",
    linkField: "url",
    linkLabel: "Open",
    meta: [],
  },
  collections: [],
  library: { path: "/box", label: "My box" },
  vocabularies: {
    kinds: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta" },
    ],
  },
};

const items = [
  {
    id: "one",
    slug: "one",
    name: "Alpha One",
    summary: "Paints wagons",
    tags: ["paint", "pair-programming"],
    kind: "alpha",
    year: 2020,
    url: "https://one.example",
  },
  {
    id: "two",
    slug: "two",
    name: "Beta Two",
    summary: "Ships crates",
    tags: ["ship"],
    kind: "beta",
    year: 2021,
    url: "https://two.example",
  },
];

function schemaOf(tools: ReturnType<typeof catalogTools>, name: string): CatalogToolSchema {
  const tool = tools.find((entry) => entry.name === name);
  if (!tool) throw new Error(`missing ${name}`);
  return tool.inputSchema;
}

describe("catalog agent tools", () => {
  it("derives names and input schemas from the box", () => {
    const tools = catalogTools(box, items);
    expect(tools.map((tool) => tool.name)).toEqual(["search_items", "get_item", "list_labels"]);
    expect(tools.every((tool) => tool.annotations.readOnlyHint)).toBe(true);

    const search = schemaOf(tools, "search_items");
    expect(Object.keys(search.properties)).toEqual(["query", "kind", "tags", "year"]);
    expect(search.properties.kind?.items).toEqual({ type: "string", enum: ["alpha", "beta"] });
    expect(search.properties.tags?.items).toEqual({ type: "string" });
    expect(search.properties.year?.items).toEqual({ type: "integer" });
    expect(schemaOf(tools, "get_item").required).toEqual(["slug"]);
    expect(schemaOf(tools, "list_labels").properties).toEqual({});

    const renamed = catalogTools(
      {
        ...box,
        item: { ...box.item, noun: { one: "benchmark", other: "benchmarks" } },
        labels: box.labels.filter((label) => label.field === "tags"),
      },
      items,
    );
    expect(renamed.map((tool) => tool.name)).toEqual(["search_benchmarks", "get_benchmark", "list_labels"]);
    expect(Object.keys(schemaOf(renamed, "search_benchmarks").properties)).toEqual(["query", "tags"]);
  });

  it("uses the AI Tool Box noun and label fields", () => {
    const tools = catalogTools(aitoolbox, []);
    expect(tools.map((tool) => tool.name)).toEqual(["search_tools", "get_tool", "list_labels"]);
    const search = schemaOf(tools, "search_tools");
    expect(Object.keys(search.properties)).toEqual([
      "query",
      "category",
      "roles",
      "pricingModel",
      "platforms",
      "launchedYear",
      "tags",
    ]);
    expect(search.properties.category?.items?.enum).toContain("code-assistants");
    expect(search.properties.tags?.items?.enum).toBeUndefined();
  });

  it("searches, looks up, and lists labels without throwing", () => {
    const tools = catalogTools(box, items);
    const search = tools[0]?.execute;
    const get = tools[1]?.execute;
    const list = tools[2]?.execute;
    if (!search || !get || !list) throw new Error("missing tool");

    expect(search({ query: "pair programming" })).toMatchObject({
      total: 1,
      matches: [{ slug: "one", title: "Alpha One", href: "/items/one" }],
    });
    expect(search({ kind: ["alpha"], year: [2021] })).toMatchObject({ total: 0, matches: [] });
    expect(search({ kind: "beta" })).toMatchObject({
      total: 1,
      matches: [{ slug: "two" }],
    });
    expect(search({ query: 4 })).toEqual({ error: "query must be text." });
    expect(search({ kind: ["gamma"] })).toEqual({ error: "Unknown kind.", values: ["alpha", "beta"] });
    expect(search(null)).toEqual({ error: "Input must be an object." });

    expect(get({ slug: "one" })).toMatchObject({ name: "Alpha One", href: "/items/one" });
    expect(get({})).toEqual({ error: "Pass a slug." });
    expect(get({ slug: "missing" })).toEqual({ error: 'No item found for slug "missing".' });

    expect(list({})).toMatchObject({
      labels: [
        { field: "kind", options: [{ value: "alpha", count: 1 }, { value: "beta", count: 1 }] },
        { field: "tags", param: "tag" },
        { field: "year", options: [{ value: "2021", count: 1 }, { value: "2020", count: 1 }] },
      ],
    });
  });

  it("registers on document.modelContext and skips a host without it", async () => {
    const signal = new AbortController().signal;
    const registerTool = vi.fn<
      (tool: { name: string; annotations: { readOnlyHint: boolean } }, options?: { signal?: AbortSignal }) => Promise<void>
    >();
    registerTool.mockResolvedValue(undefined);
    registerCatalogTools({ modelContext: { registerTool } }, box, items, signal);
    expect(registerTool).toHaveBeenCalledTimes(3);
    expect(registerTool.mock.calls.map((call) => call[0].name)).toEqual([
      "search_items",
      "get_item",
      "list_labels",
    ]);
    for (const call of registerTool.mock.calls) {
      expect(call[0].annotations).toEqual({ readOnlyHint: true });
      expect(call[1]).toEqual({ signal });
    }

    const bare = {};
    expect(() => registerCatalogTools(bare, box, items, signal)).not.toThrow();
    const aborted = new AbortController();
    aborted.abort();
    const again = vi.fn();
    registerCatalogTools({ modelContext: { registerTool: again } }, box, items, aborted.signal);
    expect(again).not.toHaveBeenCalled();
  });
});

function memoryStore(initial: string[] = []): SavedStore & { slugs: string[] } {
  const state = { slugs: [...initial] };
  return {
    get slugs() {
      return state.slugs;
    },
    async list() {
      return { slugs: [...state.slugs] };
    },
    async change(action, slug) {
      if (action === "save") {
        state.slugs = state.slugs.includes(slug) ? state.slugs : [slug, ...state.slugs];
      } else {
        state.slugs = state.slugs.filter((entry) => entry !== slug);
      }
      return { slugs: [...state.slugs] };
    },
  };
}

describe("saved agent tools", () => {
  const known = new Set(items.map((item) => item.slug));

  it("names save tools from the box noun and does not mark them read-only", () => {
    const tools = savedCatalogTools(box, items, known, memoryStore());
    expect(tools.map((tool) => tool.name)).toEqual(["save_item", "unsave_item", "list_saved"]);
    expect(tools.map((tool) => ("annotations" in tool ? tool.annotations : undefined))).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(JSON.stringify(tools)).not.toContain("readOnlyHint");
    expect(JSON.stringify(tools)).not.toContain("consequentialHint");
    expect(tools[0]?.inputSchema.required).toEqual(["slug"]);
    expect(tools[2]?.inputSchema.properties).toEqual({});

    const renamed = savedCatalogTools(
      { ...box, item: { ...box.item, noun: { one: "tool", other: "tools" } }, library: { path: "/box", label: "My box" } },
      items,
      known,
      memoryStore(),
    );
    expect(renamed.map((tool) => tool.name)).toEqual(["save_tool", "unsave_tool", "list_saved"]);
  });

  it("uses the AI Tool Box noun", () => {
    const tools = savedCatalogTools(aitoolbox, [], new Set(), memoryStore());
    expect(tools.map((tool) => tool.name)).toEqual(["save_tool", "unsave_tool", "list_saved"]);
    expect(tools[0]?.description).toContain("My box");
    expect(tools[0]?.inputSchema.properties.slug?.description).toContain("tool");
  });

  it("returns structured errors and does not throw", async () => {
    const store = memoryStore();
    const change = vi.spyOn(store, "change");
    const tools = savedCatalogTools(box, items, known, store);
    const save = tools[0]?.execute;
    const unsave = tools[1]?.execute;
    const list = tools[2]?.execute;
    if (!save || !unsave || !list) throw new Error("missing tool");

    expect(await save(null)).toEqual({ error: "Input must be an object." });
    expect(await save({})).toEqual({ error: "Pass a slug." });
    expect(await save({ slug: "missing" })).toEqual({ error: 'No item found for slug "missing".' });
    expect(change).not.toHaveBeenCalled();

    expect(await save({ slug: "one" })).toEqual({ slugs: ["one"] });
    expect(await list({})).toEqual({
      total: 1,
      saved: [{ slug: "one", title: "Alpha One", href: "/items/one" }],
    });
    expect(await unsave({ slug: "one" })).toEqual({ slugs: [] });
    expect(await list({})).toEqual({ total: 0, saved: [] });

    const failing: SavedStore = {
      async list() {
        throw new Error("list down");
      },
      async change() {
        return { error: "You can save up to 500 items." };
      },
    };
    const broken = savedCatalogTools(box, items, known, failing);
    expect(await broken[0]?.execute({ slug: "two" })).toEqual({ error: "You can save up to 500 items." });
    expect(await broken[2]?.execute({})).toEqual({ error: "list down" });
  });

  it("registers saved tools only for the provided signal and skips a missing host", () => {
    const signal = new AbortController().signal;
    const registerTool = vi.fn();
    const tools = savedCatalogTools(box, items, known, memoryStore());
    registerSavedTools({ modelContext: { registerTool } }, tools, signal);
    expect(registerTool).toHaveBeenCalledTimes(3);
    expect(registerTool.mock.calls.map((call) => call[0].name)).toEqual([
      "save_item",
      "unsave_item",
      "list_saved",
    ]);
    for (const call of registerTool.mock.calls) {
      expect(call[0].annotations).toBeUndefined();
      expect(call[1]).toEqual({ signal });
    }

    const aborted = new AbortController();
    aborted.abort();
    const again = vi.fn();
    registerSavedTools({ modelContext: { registerTool: again } }, tools, aborted.signal);
    expect(again).not.toHaveBeenCalled();
    expect(() => registerSavedTools({}, tools, signal)).not.toThrow();
  });
});
