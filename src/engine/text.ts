export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function initials(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0] ?? "";
  const second = words[1];
  const chars = second ? `${first.slice(0, 1)}${second.slice(0, 1)}` : first.slice(0, 2);
  return chars.toUpperCase();
}

/** Favicon from the product's own origin. Callers fall back to initials. */
export function faviconSrc(website: string): string | null {
  try {
    const url = new URL(website);
    if (url.protocol !== "https:") return null;
    return `${url.origin}/favicon.ico`;
  } catch {
    return null;
  }
}

export function siteHostname(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website;
  }
}

export function inkForHex(hex: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return "#1b1914";
  const raw = match[1] ?? "";
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.64 ? "#1b1914" : "#f6f3ec";
}

export function countLabel(count: number, noun: { one: string; other: string }): string {
  return `${count.toLocaleString("en")} ${count === 1 ? noun.one : noun.other}`;
}
