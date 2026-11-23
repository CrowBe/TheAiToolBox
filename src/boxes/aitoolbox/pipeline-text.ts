import { parse, type DefaultTreeAdapterTypes } from "parse5";

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;
type TextNode = DefaultTreeAdapterTypes.TextNode;

const SKIPPED_TAGS = new Set(["script", "style", "noscript", "template", "head"]);

export type PageText = {
  /** Visible text nodes only. Quotes must be substrings of this string. */
  corpus: string;
  title: string | null;
  urls: string[];
  paragraphs: string[];
};

/**
 * A prose value is accepted only when `quote` contains `value` and `quote` is a
 * literal substring of the extracted page text. Vocabulary ids are not prose:
 * those use `quoteIsOnPage` for the matched keyword.
 */
export function proseIsOnPage(corpus: string, value: string, quote: string): boolean {
  return value.length > 0 && quote.includes(value) && quoteIsOnPage(corpus, quote);
}

export function quoteIsOnPage(corpus: string, quote: string): boolean {
  return quote.length > 0 && corpus.includes(quote);
}

/**
 * Visible text only. The HTML parser decodes character references once.
 * Script, style, noscript, template, and head contents, comments, and
 * attribute values are not part of the corpus.
 */
export function extractPageText(html: string): PageText {
  const document = parse(html);
  const body = findBody(document);
  const root = body ?? document;
  const corpus = collapse(textOf(root));
  const paragraphs: string[] = [];
  collectParagraphs(root, paragraphs);
  const title = firstHeading(root);
  return {
    corpus,
    title,
    urls: urlsIn(corpus),
    paragraphs,
  };
}

function textOf(node: Node): string {
  if (isText(node)) return node.value;
  if (!isElement(node)) {
    return childNodes(node).map(textOf).join("");
  }
  if (SKIPPED_TAGS.has(node.tagName)) return "";
  return node.childNodes.map(textOf).join("");
}

function collectParagraphs(node: Node, out: string[]): void {
  if (!isElement(node)) {
    for (const child of childNodes(node)) collectParagraphs(child, out);
    return;
  }
  if (SKIPPED_TAGS.has(node.tagName)) return;
  if (node.tagName === "p") {
    const text = collapse(textOf(node));
    if (text) out.push(text);
  }
  for (const child of node.childNodes) collectParagraphs(child, out);
}

function firstHeading(node: Node): string | null {
  if (!isElement(node)) {
    for (const child of childNodes(node)) {
      const found = firstHeading(child);
      if (found) return found;
    }
    return null;
  }
  if (SKIPPED_TAGS.has(node.tagName)) return null;
  if (node.tagName === "h1") {
    const text = collapse(textOf(node));
    if (text) return text;
  }
  for (const child of node.childNodes) {
    const found = firstHeading(child);
    if (found) return found;
  }
  return null;
}

function findBody(node: Node): Element | null {
  if (isElement(node) && node.tagName === "body") return node;
  for (const child of childNodes(node)) {
    const found = findBody(child);
    if (found) return found;
  }
  return null;
}

function urlsIn(corpus: string): string[] {
  const urls: string[] = [];
  for (const match of corpus.matchAll(/https:\/\/[^\s<>"']+/g)) {
    const value = match[0]?.replace(/[),.;]+$/g, "") ?? "";
    if (!value.startsWith("https://") || urls.includes(value)) continue;
    urls.push(value);
  }
  return urls;
}

function collapse(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isText(node: Node): node is TextNode {
  return node.nodeName === "#text";
}

function isElement(node: Node): node is Element {
  return "tagName" in node;
}

function childNodes(node: Node): Node[] {
  if (!("childNodes" in node)) return [];
  return node.childNodes;
}
