import { describe, expect, it } from "vitest";
import { applyCatalogFilters, emptyFilterState, matchesQuery } from "./filter";
import { optionsFor } from "./options";
import { parseFilterQuery, serializeFilterQuery } from "./query";
import type { BoxConfig, FilterState } from "./types";

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
      control: "checkboxes",
      vocabulary: "kinds",
      param: "kind",
    },
    { field: "tags", label: "Tags", type: "string-list", control: "combobox", param: "tag" },
    { field: "year", label: "Year", type: "number", control: "checkboxes", param: "year" },
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
  collections: [{ field: "kind", label: "Kinds", path: "/kinds", vocabulary: "kinds" }],
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
    tags: ["paint", "wood", "pair-programming"],
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
  {
    id: "three",
    slug: "three",
    name: "Alpha Three",
    summary: "Paints ships",
    tags: ["paint", "ship"],
    kind: "alpha",
    year: 2021,
    url: "https://three.example",
  },
];

function names(state: FilterState, locked?: { field: string; value: string }) {
  return applyCatalogFilters(items, box, state, locked).map((item) => item.name);
}

function state(partial: Partial<FilterState> & { selected?: FilterState["selected"] }): FilterState {
  const base = emptyFilterState(box);
  return {
    q: partial.q ?? "",
    selected: { ...base.selected, ...partial.selected },
  };
}

describe("catalog filters", () => {
  it("returns every item sorted by the configured field", () => {
    expect(names(emptyFilterState(box))).toEqual(["Alpha One", "Alpha Three", "Beta Two"]);
  });

  it("matches a case-insensitive search token", () => {
    expect(names(state({ q: "SHIP" }))).toEqual(["Alpha Three", "Beta Two"]);
  });

  it("requires every search token", () => {
    expect(names(state({ q: "paint ships" }))).toEqual(["Alpha Three"]);
    expect(names(state({ q: "nope" }))).toEqual([]);
  });

  it("treats hyphens as spaces while searching", () => {
    const first = items[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(matchesQuery(first, box, "pair programming")).toBe(true);
  });

  it("ORs values inside one label and ANDs across labels", () => {
    expect(names(state({ selected: { kind: ["alpha", "beta"] } }))).toEqual([
      "Alpha One",
      "Alpha Three",
      "Beta Two",
    ]);
    expect(names(state({ selected: { kind: ["alpha"], tags: ["ship"] } }))).toEqual(["Alpha Three"]);
    expect(names(state({ selected: { year: ["2021"], kind: ["alpha"] } }))).toEqual(["Alpha Three"]);
  });

  it("keeps a locked label even when that label is also selected", () => {
    expect(
      names(state({ selected: { kind: ["alpha"] } }), { field: "kind", value: "beta" }),
    ).toEqual(["Beta Two"]);
  });

  it("counts facets without applying the facet's own selection", () => {
    const filtered = state({ selected: { tags: ["ship"], kind: ["alpha"] } });
    const kind = box.labels.find((label) => label.field === "kind");
    const year = box.labels.find((label) => label.field === "year");
    expect(kind).toBeDefined();
    expect(year).toBeDefined();
    if (!kind || !year) return;
    const kinds = optionsFor(items, box, filtered, kind);
    expect(kinds.map((option) => [option.value, option.count])).toEqual([
      ["alpha", 1],
      ["beta", 1],
    ]);
    const years = optionsFor(items, box, emptyFilterState(box), year);
    expect(years.map((option) => option.value)).toEqual(["2021", "2020"]);
  });
});

describe("filter query strings", () => {
  it("round-trips selected labels and keeps an empty query out of the URL", () => {
    const original = state({
      q: "paint",
      selected: { kind: ["alpha"], tags: ["ship", "paint"], year: ["2021"] },
    });
    const params = serializeFilterQuery(original, box);
    expect(params.get("q")).toBe("paint");
    expect(params.getAll("kind")).toEqual(["alpha"]);
    expect(params.getAll("tag")).toEqual(["ship", "paint"]);
    expect(params.getAll("year")).toEqual(["2021"]);
    expect(params.has("tags")).toBe(false);
    expect(parseFilterQuery(params, box)).toEqual(original);
  });

  it("accepts comma-separated values and ignores unknown params", () => {
    const params = new URLSearchParams("tag=ship,paint&foo=bar");
    expect(parseFilterQuery(params, box).selected.tags).toEqual(["ship", "paint"]);
    expect(parseFilterQuery(params, box).q).toBe("");
  });
});
