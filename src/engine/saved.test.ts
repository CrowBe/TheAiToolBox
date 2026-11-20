import { describe, expect, it } from "vitest";
import { SAVED_LIMIT, applySavedChange, readSaveBody, readSavedSlugs, readSavedVersion } from "./saved";

const tools = { id: "aitoolbox", noun: { one: "tool", other: "tools" } };
const hardware = { id: "hardware", noun: { one: "device", other: "devices" } };
const known = new Set(["cursor", "claude", "grok"]);

describe("saved records", () => {
  it("rejects a body that is not a slug change", () => {
    expect(readSaveBody(null)).toEqual({ error: "Input must be an object." });
    expect(readSaveBody({ action: "save" })).toEqual({ error: "Pass a slug." });
    expect(readSaveBody({ action: "keep", slug: "cursor" })).toEqual({ error: "Pass save or unsave." });
    expect(readSaveBody({ action: "save", slug: "Cursor" })).toEqual({ error: "Pass a slug." });
    expect(readSaveBody({ action: "save", slug: "  " })).toEqual({ error: "Pass a slug." });
    expect(readSaveBody({ action: "unsave", slug: " cursor " })).toEqual({
      action: "unsave",
      slug: "cursor",
    });
  });

  it("saves, dedupes, and unsaves one box without touching another", () => {
    const original = {
      theme: "dark",
      saved: {
        hardware: ["kept"],
        aitoolbox: ["claude"],
      },
    };

    const first = applySavedChange(original, tools, " cursor ", "save", known);
    expect(first).toEqual({
      metadata: {
        theme: "dark",
        saved: {
          hardware: ["kept"],
          aitoolbox: ["cursor", "claude"],
        },
      },
      slugs: ["cursor", "claude"],
    });
    expect(original.saved.aitoolbox).toEqual(["claude"]);

    const again = applySavedChange(
      "metadata" in first ? first.metadata : {},
      tools,
      "cursor",
      "save",
      known,
    );
    expect(again).toMatchObject({ slugs: ["cursor", "claude"] });

    const removed = applySavedChange(
      "metadata" in again ? again.metadata : {},
      tools,
      "claude",
      "unsave",
      known,
    );
    expect(removed).toMatchObject({
      slugs: ["cursor"],
      metadata: {
        theme: "dark",
        saved: { hardware: ["kept"], aitoolbox: ["cursor"] },
      },
    });
    expect(readSavedSlugs("metadata" in removed ? removed.metadata : {}, "hardware")).toEqual(["kept"]);
    expect(readSavedSlugs("metadata" in removed ? removed.metadata : {}, "aitoolbox")).toEqual(["cursor"]);
  });

  it("rejects unknown slugs and a list past the cap", () => {
    expect(applySavedChange({}, tools, "missing", "save", known)).toEqual({
      error: 'No tool found for slug "missing".',
    });
    expect(applySavedChange({}, hardware, "missing", "save", new Set(["lathe"]))).toEqual({
      error: 'No device found for slug "missing".',
    });

    const full = Array.from({ length: SAVED_LIMIT }, (_, index) => `tool-${index}`);
    const knownFull = new Set([...full, "extra"]);
    const metadata = { note: true, saved: { aitoolbox: full, hardware: ["lathe"] } };
    expect(applySavedChange(metadata, tools, "extra", "save", knownFull)).toEqual({
      error: `You can save up to ${SAVED_LIMIT} tools.`,
    });
    expect(applySavedChange(metadata, tools, "tool-3", "save", knownFull)).toMatchObject({
      slugs: full,
    });
    const freed = applySavedChange(metadata, tools, "tool-0", "unsave", knownFull);
    expect(freed).toMatchObject({ slugs: full.slice(1) });
    const added = applySavedChange(
      "metadata" in freed ? freed.metadata : {},
      tools,
      "extra",
      "save",
      knownFull,
    );
    expect(added).toMatchObject({ slugs: ["extra", ...full.slice(1)] });
    expect(readSavedSlugs("metadata" in added ? added.metadata : {}, "hardware")).toEqual(["lathe"]);
  });

  it("drops duplicate and invalid entries already stored for that box", () => {
    const metadata = {
      saved: {
        aitoolbox: ["cursor", "cursor", "NOT A SLUG", "", 4, "claude"],
        hardware: { nope: true },
      },
    };
    const next = applySavedChange(metadata, tools, "grok", "save", known);
    expect(next).toMatchObject({
      slugs: ["grok", "cursor", "claude"],
      metadata: {
        saved: {
          aitoolbox: ["grok", "cursor", "claude"],
          hardware: { nope: true },
        },
      },
    });
    expect(applySavedChange({}, tools, "nope", "unsave", known)).toMatchObject({ slugs: [] });
    expect(applySavedChange({}, { id: "Bad Box", noun: tools.noun }, "cursor", "save", known)).toEqual({
      error: "Unknown box.",
    });
  });

  it("keeps savedVersion so the route can increment it", () => {
    const metadata = { theme: "dark", savedVersion: 4, saved: { aitoolbox: ["claude"] } };
    const next = applySavedChange(metadata, tools, "cursor", "save", known);
    expect(next).toMatchObject({
      metadata: { theme: "dark", savedVersion: 4, saved: { aitoolbox: ["cursor", "claude"] } },
    });
    expect(readSavedVersion(metadata)).toBe(4);
    expect(readSavedVersion({ savedVersion: 0 })).toBe(0);
    expect(readSavedVersion({ savedVersion: -1 })).toBe(0);
    expect(readSavedVersion({ savedVersion: 1.5 })).toBe(0);
    expect(readSavedVersion({ savedVersion: "3" })).toBe(0);
    expect(readSavedVersion(null)).toBe(0);
  });
});
