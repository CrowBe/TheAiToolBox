import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractPageText, quoteIsOnPage } from "./pipeline-text";
import { extractPricingDetails } from "./pipeline-extract";

function fixture(name: string): string {
  return fs.readFileSync(path.join("scripts", "pipeline", "fixtures", name), "utf8");
}

describe("visible page text", () => {
  it("decodes a character reference once", () => {
    const html = fixture("entity-amp.html");
    const corpus = extractPageText(html).corpus;
    expect(corpus).toContain("Free&nbsp;plan");
    expect(corpus).not.toContain("Free plan");
  });

  it("does not treat a spaced or broken script end tag as text", () => {
    const corpus = extractPageText(fixture("script-ends.html")).corpus;
    expect(corpus).toContain("Before space");
    expect(corpus).toContain("After space");
    expect(corpus).toContain("After newline");
    expect(corpus).not.toContain("SECRET_SPACE");
    expect(corpus).not.toContain("SECRET_NEWLINE");
  });

  it("hides the rest of the page after an unclosed script", () => {
    const corpus = extractPageText(fixture("script-unclosed.html")).corpus;
    expect(corpus).toContain("Before unclosed");
    expect(corpus).not.toContain("SECRET_OPEN");
    expect(corpus).not.toContain("After unclosed");
  });

  it("ignores attribute values, even when they contain a greater-than sign", () => {
    const corpus = extractPageText(fixture("attribute-gt.html")).corpus;
    expect(corpus).toContain("Visible paragraph");
    expect(corpus).not.toContain("SECRET_ATTR");
    expect(corpus).not.toContain("Attr");
  });

  it("leaves head, meta, comments, and hidden elements out of the corpus", () => {
    const html = fixture("meta-only.html");
    const page = extractPageText(html);
    expect(html).toContain("SECRET_META");
    expect(html).toContain("AI writing assistant");
    expect(page.corpus).not.toContain("SECRET_META");
    expect(page.corpus).not.toContain("AI writing");
    expect(page.corpus).not.toContain("code editor");
    expect(page.corpus).not.toContain("SECRET_TITLE");
    expect(page.corpus).not.toContain("SECRET_STYLE");
    expect(page.corpus).not.toContain("SECRET_COMMENT");
    expect(page.corpus).not.toContain("SECRET_NOSCRIPT");
    expect(page.corpus).not.toContain("SECRET_TEMPLATE");
    expect(page.title).toBe("Meta Only");
    expect(page.paragraphs.join("\n")).not.toContain("SECRET_META");
  });

  it("keeps hidden, embedded, and fallback text out of every block", () => {
    const html = fixture("hidden-content.html");
    const page = extractPageText(html);
    const secrets = [
      "SECRET_HIDDEN",
      "SECRET_ARIA",
      "SECRET_DISPLAY",
      "SECRET_DISPLAY_CASE",
      "SECRET_DISPLAY_LIST",
      "SECRET_VISIBILITY",
      "SECRET_VISIBILITY_SPACE",
      "SECRET_HIDDEN_PARENT",
      "SECRET_DISPLAY_PARENT",
      "SECRET_SPAN",
      "SECRET_IFRAME",
      "SECRET_OBJECT",
      "SECRET_SVG_CDATA",
    ];
    for (const secret of secrets) {
      expect(html).toContain(secret);
      expect(page.corpus).not.toContain(secret);
    }
    expect(page.blocks).toContain("Visible tail");
    expect(page.blocks).toContain("Shown paragraph.");
  });

  it("does not join sibling blocks into one quote", () => {
    const page = extractPageText(fixture("split-price.html"));
    expect(page.blocks).toEqual(["Pro is", "$87/month."]);
    expect(quoteIsOnPage(page.corpus, "Pro is $87/month.")).toBe(false);
    expect(extractPricingDetails(page.corpus)?.quote).not.toBe("Pro is $87/month.");
    const inline = extractPageText(fixture("inline-price.html"));
    expect(inline.blocks).toEqual(["Pro is $87/month."]);
    expect(quoteIsOnPage(inline.corpus, "Pro is $87/month.")).toBe(true);
  });
});
