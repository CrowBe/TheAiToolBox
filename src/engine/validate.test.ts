import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { BoxConfig } from "./types";
import { CatalogValidationError, validateCatalog } from "./validate";
import { faviconSrc, initials } from "./text";

const schema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    kind: z.string().min(1),
    url: z.string().min(1),
  })
  .strict();

const box: BoxConfig = {
  id: "validate",
  site: { name: "Validate", shortName: "Validate", tagline: "t", description: "d" },
  item: {
    noun: { one: "item", other: "items" },
    idField: "id",
    slugField: "slug",
    sortField: "name",
    path: "/items",
  },
  search: { fields: ["name"], placeholder: "Search" },
  labels: [
    {
      field: "kind",
      label: "Kind",
      type: "string",
      control: "checkboxes",
      vocabulary: "kinds",
    },
  ],
  card: { titleField: "name", subtitleField: "name" },
  detail: {
    titleField: "name",
    subtitleField: "name",
    bodyField: "name",
    linkField: "url",
    linkLabel: "Open",
    meta: [],
  },
  collections: [],
  vocabularies: { kinds: [{ id: "alpha", label: "Alpha" }] },
};

const good = { id: "one", slug: "one", name: "One", kind: "alpha", url: "https://one.example" };

describe("validateCatalog", () => {
  it("accepts records that match the schema and vocabulary", () => {
    expect(validateCatalog({ items: [good], schema, config: box, sources: ["one.json"] })).toEqual([
      good,
    ]);
  });

  it("reports duplicate ids, unknown labels, and filename mismatches", () => {
    expect(() =>
      validateCatalog({
        items: [good, { ...good, id: "two", slug: "two", kind: "missing" }, { ...good, slug: "again" }],
        schema,
        config: box,
        sources: ["one.json", "wrong.json", "again.json"],
      }),
    ).toThrow(CatalogValidationError);
    try {
      validateCatalog({
        items: [good, { ...good, id: "two", slug: "two", kind: "missing" }, { ...good, slug: "again" }],
        schema,
        config: box,
        sources: ["one.json", "wrong.json", "again.json"],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CatalogValidationError);
      const issues = (error as CatalogValidationError).issues.join("\n");
      expect(issues).toContain("duplicate");
      expect(issues).toContain("missing");
      expect(issues).toContain("filename");
    }
  });

  it("rejects unknown keys", () => {
    expect(schema.safeParse({ ...good, extra: true }).success).toBe(false);
  });
});

describe("marks", () => {
  it("builds initials and only trusts https favicons", () => {
    expect(initials("GitHub Copilot")).toBe("GC");
    expect(initials("n8n")).toBe("N8");
    expect(faviconSrc("https://cursor.com/docs")).toBe("https://cursor.com/favicon.ico");
    expect(faviconSrc("http://cursor.com")).toBeNull();
    expect(faviconSrc("not a url")).toBeNull();
  });
});
