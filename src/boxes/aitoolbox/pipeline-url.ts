const SLUG = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;

const ACCENT_COLORS = [
  "#0E5F59",
  "#1D4ED8",
  "#7C3AED",
  "#B45309",
  "#BE123C",
  "#0F766E",
  "#0369A1",
  "#4338CA",
] as const;

export function slugFromName(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return SLUG.test(slug) ? slug : null;
}

export function accentColorForSlug(slug: string): string {
  let hash = 0;
  for (const char of slug) hash = (Math.imul(hash, 33) + char.charCodeAt(0)) >>> 0;
  return ACCENT_COLORS[hash % ACCENT_COLORS.length] ?? ACCENT_COLORS[0];
}

export function registrableHost(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return parts.join(".");
  return parts.slice(-2).join(".");
}

export function sameSite(left: string, right: string): boolean {
  try {
    return registrableHost(new URL(left).hostname) === registrableHost(new URL(right).hostname);
  } catch {
    return false;
  }
}

export function normalizeUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  const pathname = url.pathname.replace(/\/+$/, "");
  return `${url.protocol}//${url.hostname.toLowerCase()}${pathname}${url.search}`;
}

export function isSocialUrl(value: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(value).hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  } catch {
    return false;
  }
  return (
    hostname === "x.com" ||
    hostname.endsWith(".x.com") ||
    hostname === "twitter.com" ||
    hostname.endsWith(".twitter.com") ||
    hostname === "t.co" ||
    hostname.endsWith(".t.co")
  );
}
