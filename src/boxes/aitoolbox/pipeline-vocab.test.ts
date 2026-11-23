import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { vocabularyFileSchema } from "./schema";
import {
  CATEGORY_RULES,
  findPhrase,
  matchMany,
  matchPricingModel,
  matchSingle,
  PLATFORM_RULES,
  PRICING_MODEL_IDS,
  ROLE_RULES,
  type VocabRule,
} from "./pipeline-vocab";

function vocabIds(file: string): string[] {
  const parsed = vocabularyFileSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")) as unknown);
  return parsed.map((entry) => entry.slug).sort();
}

function assertDisjoint(rules: readonly VocabRule[]): void {
  const owned = new Map<string, string>();
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      const key = keyword.toLowerCase();
      expect(owned.has(key), key).toBe(false);
      owned.set(key, rule.id);
    }
  }
  for (const [left, leftId] of owned) {
    for (const [right, rightId] of owned) {
      if (left === right || leftId === rightId) continue;
      expect(right.includes(left), `${left} inside ${right}`).toBe(false);
    }
  }
}

describe("vocabulary keyword rules", () => {
  it("covers every category, role, platform, and pricing model id", () => {
    expect(vocabIds("data/vocabularies/categories.json")).toEqual(
      CATEGORY_RULES.map((rule) => rule.id).sort(),
    );
    expect(vocabIds("data/vocabularies/roles.json")).toEqual(ROLE_RULES.map((rule) => rule.id).sort());
    expect(vocabIds("data/vocabularies/platforms.json")).toEqual(
      PLATFORM_RULES.map((rule) => rule.id).sort(),
    );
    expect(vocabIds("data/vocabularies/pricing-models.json")).toEqual([...PRICING_MODEL_IDS].sort());
  });

  it("keeps keywords disjoint inside each table", () => {
    assertDisjoint(CATEGORY_RULES);
    assertDisjoint(ROLE_RULES);
    assertDisjoint(PLATFORM_RULES);
  });

  it("matches a phrase on word boundaries", () => {
    expect(findPhrase("openai writing", "ai writing")).toBeNull();
    expect(findPhrase("An AI writing assistant", "ai writing")).toBe("AI writing");
  });

  it("picks one category, and treats a tie or a miss as no match", () => {
    expect(
      matchSingle("An AI writing assistant for long-form drafts.", CATEGORY_RULES, "category"),
    ).toMatchObject({ ok: true, id: "writing-tools" });
    const tie = matchSingle("It is an AI writing product and a code editor.", CATEGORY_RULES, "category");
    expect(tie.ok).toBe(false);
    if (!tie.ok) expect(tie.reason).toBe("ambiguous category: code-assistants, writing-tools");
    expect(matchSingle("Hello.", CATEGORY_RULES, "category")).toMatchObject({
      ok: false,
      reason: "no category match",
    });
  });

  it("keeps every matched role and platform, and gaps when none match", () => {
    expect(matchMany("Built for writers who ship essays.", ROLE_RULES, "role")).toMatchObject({
      ok: true,
      hits: [{ id: "writer" }],
    });
    expect(matchMany("Use it as a web app.", PLATFORM_RULES, "platform")).toMatchObject({
      ok: true,
      hits: [{ id: "web" }],
    });
    expect(matchMany("Hello.", ROLE_RULES, "role")).toMatchObject({ ok: false, reason: "no role match" });
    expect(matchMany("Hello.", PLATFORM_RULES, "platform")).toMatchObject({
      ok: false,
      reason: "no platform match",
    });
  });

  it("chooses a pricing model from the combo rules", () => {
    expect(matchPricingModel("Free plan includes drafts. Pro is $12/month.")).toMatchObject({
      ok: true,
      id: "freemium",
    });
    expect(matchPricingModel("Pro is $12/month.")).toMatchObject({ ok: true, id: "paid" });
    expect(matchPricingModel("This tool is completely free forever.")).toMatchObject({
      ok: true,
      id: "free",
    });
    expect(matchPricingModel("The project is open source.")).toMatchObject({
      ok: true,
      id: "open_source",
    });
    expect(matchPricingModel("Contact sales for a rollout.")).toMatchObject({
      ok: true,
      id: "enterprise",
    });
    for (const text of [
      "The project is open source. Pro is $12/month.",
      "Hello there.",
      "Free plan and open source notes.",
    ]) {
      expect(matchPricingModel(text).ok, text).toBe(false);
    }
  });
});
