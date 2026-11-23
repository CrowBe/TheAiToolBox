import { getDomain } from "tldts";

const SLUG = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;

const PUBLIC_SUFFIX = { allowPrivateDomains: true } as const;

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

/** Registrable domain from the public suffix list, including private domains. */
export function registrableHost(hostname: string): string | null {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return getDomain(host, PUBLIC_SUFFIX);
}

export function sameSite(left: string, right: string): boolean {
  try {
    const leftHost = registrableHost(new URL(left).hostname);
    const rightHost = registrableHost(new URL(right).hostname);
    return leftHost !== null && leftHost === rightHost;
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
