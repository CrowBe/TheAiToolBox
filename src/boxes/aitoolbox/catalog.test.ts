import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { readValues } from "@/engine/access";
import { applyCatalogFilters, emptyFilterState } from "@/engine/filter";
import { box } from "./config";
import { loadItems } from "./load";
import { itemSchema } from "./schema";

const items = loadItems();

describe("AIToolBox catalog", () => {
  it("loads every ported tool and keeps slugs unique", () => {
    const slugs = items.map((item) => item.slug);
    expect(slugs).toHaveLength(147);
    expect(new Set(slugs).size).toBe(slugs.length);
    const files = fs
      .readdirSync("data/tools")
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.slice(0, -".json".length))
      .sort();
    expect(files).toEqual([...slugs].sort());
  });

  it("uses https URLs and drops the old clearbit logos and security scores", () => {
    for (const item of items) {
      const url = new URL(item.url);
      expect(url.protocol).toBe("https:");
      expect(url.hostname.includes(".")).toBe(true);
    }
    expect(JSON.stringify(items)).not.toContain("clearbit");
    expect(JSON.stringify(items)).not.toContain("securityScore");
  });

  it("references only known categories, roles, pricing models, and platforms", () => {
    for (const category of box.vocabularies.categories ?? []) {
      expect(items.some((item) => item.category === category.id)).toBe(true);
    }
    for (const role of box.vocabularies.roles ?? []) {
      expect(items.some((item) => item.roles.includes(role.id))).toBe(true);
    }
    expect(box.item.path).toBe("/tools");
    expect(box.collections.map((collection) => collection.path)).toEqual(["/categories"]);
  });

  it("searches and filters the real catalog", () => {
    const byText = applyCatalogFilters(items, box, {
      ...emptyFilterState(box),
      q: "pair programming",
    });
    expect(byText.some((item) => readValues(item, "slug")[0] === "github-copilot")).toBe(true);

    const assistants = applyCatalogFilters(items, box, emptyFilterState(box), {
      field: "category",
      value: "code-assistants",
    });
    expect(assistants).toHaveLength(20);
    expect(assistants.every((item) => readValues(item, "category")[0] === "code-assistants")).toBe(
      true,
    );

    const priced = applyCatalogFilters(items, box, {
      q: "",
      selected: { ...emptyFilterState(box).selected, pricingModel: ["freemium"], roles: ["designer"] },
    });
    expect(priced.length).toBeGreaterThan(0);
    expect(
      priced.every(
        (item) =>
          readValues(item, "pricingModel")[0] === "freemium" &&
          readValues(item, "roles").includes("designer"),
      ),
    ).toBe(true);
  });

  it("rejects an http URL, an unknown key, and a duplicate tag", () => {
    const sample = items[0];
    expect(sample).toBeDefined();
    expect(itemSchema.safeParse({ ...sample, url: "http://example.com" }).success).toBe(false);
    expect(itemSchema.safeParse({ ...sample, securityScore: 10 }).success).toBe(false);
    expect(itemSchema.safeParse({ ...sample, tags: ["a", "a"] }).success).toBe(false);
  });

  it("keeps label, search, and detail fields on the item schema", () => {
    const keys = new Set(Object.keys(itemSchema.shape));
    for (const label of box.labels) expect(keys.has(label.field)).toBe(true);
    for (const field of box.search.fields) expect(keys.has(field)).toBe(true);
    for (const field of [
      box.card.titleField,
      box.card.subtitleField,
      box.detail.bodyField,
      box.detail.linkField,
      ...box.detail.meta.map((meta) => meta.field),
    ]) {
      expect(keys.has(field)).toBe(true);
    }
  });
});
