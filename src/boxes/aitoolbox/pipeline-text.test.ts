import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractPageText } from "./pipeline-text";

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
});
