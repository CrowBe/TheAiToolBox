import { parse, type DefaultTreeAdapterTypes } from "parse5";

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;
type TextNode = DefaultTreeAdapterTypes.TextNode;

/** Elements whose own normalised text can be a quote. Nested blocks stay separate. */
const BLOCK_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "dt",
  "dd",
  "td",
  "th",
  "blockquote",
  "figcaption",
]);

/** Inline tags whose text belongs to the enclosing block. */
const INLINE_TAGS = new Set(["a", "span", "strong", "em", "b", "i", "code", "small"]);

/** Subtrees that are not page content, including their fallback text. */
const OPAQUE_TAGS = new Set([
  "iframe",
  "object",
  "embed",
  "video",
  "audio",
  "canvas",
  "svg",
  "math",
  "select",
  "textarea",
  "button",
  "template",
  "noscript",
  "script",
  "style",
  "head",
]);

export type PageText = {
  /** One normalised visible block per entry. A quote must fit inside a single entry. */
  blocks: string[];
  /** Blocks separated by newlines. A newline is a block boundary, not part of a quote. */
  corpus: string;
  title: string | null;
  urls: string[];
  paragraphs: string[];
};

/**
 * A prose value is accepted only when `quote` contains `value` and `quote` is a
 * literal substring of one visible block. Vocabulary ids are not prose: those
 * use `quoteIsOnPage` for the matched keyword.
 */
export function proseIsOnPage(corpus: string, value: string, quote: string): boolean {
  return value.length > 0 && quote.includes(value) && quoteIsOnPage(corpus, quote);
}

export function quoteIsOnPage(corpus: string, quote: string): boolean {
  if (quote.length === 0 || quote.includes("\n")) return false;
  return corpus.split("\n").some((block) => block.includes(quote));
}

/**
 * Visible content only. Each block is one allowlisted element's text, with
 * inline children joined by the whitespace the parser already decoded.
 * Hidden subtrees, embedded fallback, and non-content tags are omitted.
 */
export function extractPageText(html: string): PageText {
  const blocks: string[] = [];
  const paragraphs: string[] = [];
  let title: string | null = null;
  walk(parse(html), blocks, paragraphs, (heading) => {
    title ??= heading;
  });
  const corpus = blocks.join("\n");
  return {
    blocks,
    corpus,
    title,
    urls: urlsIn(blocks),
    paragraphs,
  };
}

function walk(node: Node, blocks: string[], paragraphs: string[], onTitle: (heading: string) => void): void {
  if (!isElement(node)) {
    for (const child of childNodes(node)) walk(child, blocks, paragraphs, onTitle);
    return;
  }
  if (skipSubtree(node)) return;
  if (BLOCK_TAGS.has(node.tagName)) {
    const text = normalise(blockText(node));
    if (text) {
      blocks.push(text);
      if (node.tagName === "p") paragraphs.push(text);
      if (node.tagName === "h1") onTitle(text);
    }
  }
  for (const child of node.childNodes) walk(child, blocks, paragraphs, onTitle);
}

function blockText(element: Element): string {
  return element.childNodes.map((child) => inlineText(child)).join("");
}

function inlineText(node: Node): string {
  if (isText(node)) return node.value;
  if (!isElement(node) || skipSubtree(node) || !INLINE_TAGS.has(node.tagName)) return "";
  return node.childNodes.map((child) => inlineText(child)).join("");
}

function skipSubtree(element: Element): boolean {
  if (OPAQUE_TAGS.has(element.tagName)) return true;
  for (const attr of element.attrs) {
    const name = attr.name.toLowerCase();
    if (name === "hidden") return true;
    if (name === "aria-hidden" && attr.value.trim().toLowerCase() === "true") return true;
    if (name === "style" && styleHides(attr.value)) return true;
  }
  return false;
}

function styleHides(style: string): boolean {
  for (const declaration of style.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator < 0) continue;
    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).replace(/!important/gi, "").trim().toLowerCase();
    if (property === "display" && value === "none") return true;
    if (property === "visibility" && value === "hidden") return true;
  }
  return false;
}

function urlsIn(blocks: readonly string[]): string[] {
  const urls: string[] = [];
  for (const block of blocks) {
    for (const match of block.matchAll(/https:\/\/[^\s<>"']+/g)) {
      const value = match[0]?.replace(/[),.;]+$/g, "") ?? "";
      if (!value.startsWith("https://") || urls.includes(value)) continue;
      urls.push(value);
    }
  }
  return urls;
}

function normalise(value: string): string {
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
