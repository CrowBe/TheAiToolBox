import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { candidateFileSchema, xQueryFileSchema } from "./pipeline";
import { httpsUrl, httpsUrlPattern } from "./schema";

type JsonSchema = {
  required?: string[];
  additionalProperties?: boolean;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  format?: string;
  pattern?: string;
};

describe("pipeline files", () => {
  it("validates the starter X queries for launches and pricing changes", () => {
    const queries: unknown = JSON.parse(fs.readFileSync("data/pipeline/x-queries.json", "utf8"));
    const parsed = xQueryFileSchema.safeParse(queries);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.length).toBeGreaterThanOrEqual(8);
    expect(parsed.data.length).toBeLessThanOrEqual(12);
    const purposes = parsed.data.map((row) => row.purpose.toLowerCase());
    expect(purposes.some((purpose) => purpose.includes("launch"))).toBe(true);
    expect(purposes.some((purpose) => purpose.includes("pricing"))).toBe(true);
  });

  it("validates an example candidates file against the candidate schema", () => {
    const example: unknown = JSON.parse(
      fs.readFileSync("data/pipeline/candidates.example.json", "utf8"),
    );
    expect(candidateFileSchema.safeParse(example).success).toBe(true);
    expect(
      candidateFileSchema.safeParse({
        date: "2026-11-23",
        candidates: [{ toolName: "Example", postUrl: "http://example.com", links: [] }],
      }).success,
    ).toBe(false);
    expect(candidateFileSchema.safeParse({ date: "11/23/2026", candidates: [] }).success).toBe(false);
    expect(
      candidateFileSchema.safeParse({
        date: "2026-11-23",
        candidates: [{ toolName: "Example", postUrl: "https://example.com/post", links: [], extra: true }],
      }).success,
    ).toBe(false);

    const file = JSON.parse(fs.readFileSync("data/pipeline/candidates.schema.json", "utf8")) as JsonSchema;
    const generated = z.toJSONSchema(candidateFileSchema) as JsonSchema;
    const item = file.properties?.candidates?.items;
    const generatedItem = generated.properties?.candidates?.items;
    expect(file.required).toEqual(generated.required);
    expect(file.additionalProperties).toBe(false);
    expect(file.properties?.date?.format).toBe("date");
    expect(item?.required).toEqual(generatedItem?.required);
    expect(item?.additionalProperties).toBe(false);
    expect(Object.keys(item?.properties ?? {}).sort()).toEqual(
      Object.keys(generatedItem?.properties ?? {}).sort(),
    );
    expect(item?.properties?.postUrl?.pattern).toBe(httpsUrlPattern);
    expect(item?.properties?.links?.items?.pattern).toBe(httpsUrlPattern);
    expect(item?.properties?.thread).toBeDefined();

    const pattern = new RegExp(httpsUrlPattern);
    for (const value of ["https://", "https://localhost", "https://example", "http://example.com"]) {
      expect(pattern.test(value)).toBe(false);
      expect(httpsUrl.safeParse(value).success).toBe(false);
    }
    for (const value of [
      "https://example.com",
      "https://example.com/path?q=1",
      "https://sub.example.com/a",
    ]) {
      expect(pattern.test(value)).toBe(true);
      expect(httpsUrl.safeParse(value).success).toBe(true);
    }
  });
});
