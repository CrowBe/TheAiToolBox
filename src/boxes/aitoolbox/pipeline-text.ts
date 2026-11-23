export type PageText = {
  /** Visible text plus title, description, canonical, and og:url. Quotes must be substrings. */
  corpus: string;
  title: string | null;
  descriptions: string[];
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

export function extractPageText(html: string): PageText {
  const visible = stripHidden(html);
  const pieces: string[] = [];
  const descriptions: string[] = [];
  const urls: string[] = [];
  const paragraphs: string[] = [];

  const title = cleanText(inner(visible.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""));
  addPiece(pieces, title);

  for (const match of visible.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const key = `${attr(tag, "name") ?? ""} ${attr(tag, "property") ?? ""}`.toLowerCase();
    const content = cleanText(attr(tag, "content") ?? "");
    if (!content) continue;
    if (/\b(description|og:description|twitter:description)\b/.test(key)) {
      descriptions.push(content);
      addPiece(pieces, content);
    } else if (/\b(og:title|twitter:title)\b/.test(key)) {
      addPiece(pieces, content);
    } else if (/\bog:url\b/.test(key)) {
      addUrl(pieces, urls, content);
    }
  }

  for (const match of visible.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    if (!rel.includes("canonical")) continue;
    addUrl(pieces, urls, cleanText(attr(tag, "href") ?? ""));
  }

  for (const match of visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) {
    addPiece(pieces, cleanText(inner(match[1] ?? "")));
  }
  for (const match of visible.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const paragraph = cleanText(inner(match[1] ?? ""));
    if (!paragraph) continue;
    paragraphs.push(paragraph);
    addPiece(pieces, paragraph);
  }

  const corpus = pieces.join("\n");
  for (const found of corpus.matchAll(/https:\/\/[^\s<>"']+/g)) {
    addUrl(pieces, urls, found[0]?.replace(/[),.;]+$/g, "") ?? "");
  }

  return {
    corpus: pieces.join("\n"),
    title: title || null,
    descriptions,
    urls,
    paragraphs,
  };
}

function stripHidden(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, " ");
}

function inner(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function cleanText(value: string): string {
  return decodeEntities(value).replace(/\s+/g, " ").trim();
}

function addPiece(pieces: string[], value: string): void {
  if (!value || pieces.includes(value)) return;
  pieces.push(value);
}

function addUrl(pieces: string[], urls: string[], value: string): void {
  if (!value.startsWith("https://") || urls.includes(value)) return;
  urls.push(value);
  addPiece(pieces, value);
}

function attr(tag: string, name: string): string | null {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i").exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => fromCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => fromCode(Number.parseInt(num, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function fromCode(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  return String.fromCodePoint(code);
}
