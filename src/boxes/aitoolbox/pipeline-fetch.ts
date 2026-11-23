import { lookup } from "node:dns/promises";
import { extractPageText, type PageText } from "./pipeline-text.ts";
import { sameSite } from "./pipeline-url.ts";

export const PIPELINE_USER_AGENT = "TheAiToolBoxPipeline/1.0";
export const DEFAULT_TIMEOUT_MS = 15_000;
export const DEFAULT_MAX_BYTES = 1_000_000;

const ACCEPT = "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.1";

export type FetchFailureKind = "dns" | "not_found" | "connection" | "timeout" | "transient" | "refused";

export type HostLookup = (hostname: string) => Promise<readonly string[]>;

const MAX_REDIRECTS = 5;

export type PageFetch =
  | {
      ok: true;
      requestedUrl: string;
      finalUrl: string;
      offSite: boolean;
      status: number;
      corpus: PageText | null;
      note?: string;
    }
  | {
      ok: false;
      requestedUrl: string;
      finalUrl: string;
      offSite: boolean;
      kind: FetchFailureKind;
      status?: number;
      message: string;
    };

export type FetchPageOptions = {
  fetchImpl?: typeof fetch;
  lookupImpl?: HostLookup;
  timeoutMs?: number;
  maxBytes?: number;
};

/**
 * Fetch one URL. Redirects are followed manually, at most five hops, and each
 * hop's host is resolved before connecting. Loopback, private, link-local,
 * CGNAT, unique-local, multicast, and unspecified addresses are `refused`
 * and must not mark a tool discontinued. Links in the body are not fetched.
 * A final URL on another registrable site is `offSite`: its body is not evidence.
 * DNS failure, HTTP 404/410, and a refused or unreachable connection are
 * permanent (`dns`, `not_found`, `connection`), including after a redirect.
 * Timeouts, HTTP 403/429, and 5xx responses are `transient` or `timeout`.
 */
export async function fetchPage(url: string, options: FetchPageOptions = {}): Promise<PageFetch> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const lookupImpl = options.lookupImpl ?? defaultLookup;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const signal = AbortSignal.timeout(timeoutMs);
  let current = url;

  try {
    for (let hop = 0; ; hop += 1) {
      const blocked = await blockedAddress(current, lookupImpl);
      if (blocked) {
        return {
          ok: false,
          requestedUrl: url,
          finalUrl: current,
          offSite: hop > 0 && !sameSite(url, current),
          kind: "refused",
          message: hop === 0 ? `refused ${blocked}` : `refused redirect to ${blocked}`,
        };
      }

      const response = await fetchImpl(current, {
        method: "GET",
        redirect: "manual",
        signal,
        cache: "no-store",
        headers: {
          "user-agent": PIPELINE_USER_AGENT,
          accept: ACCEPT,
        },
      });

      if (isRedirect(response.status)) {
        const location = response.headers.get("location");
        await response.body?.cancel().catch(() => undefined);
        if (hop >= MAX_REDIRECTS) {
          return {
            ok: false,
            requestedUrl: url,
            finalUrl: current,
            offSite: !sameSite(url, current),
            kind: "transient",
            status: response.status,
            message: "too many redirects",
          };
        }
        if (!location) {
          return {
            ok: false,
            requestedUrl: url,
            finalUrl: current,
            offSite: !sameSite(url, current),
            kind: "transient",
            status: response.status,
            message: `HTTP ${response.status}`,
          };
        }
        current = new URL(location, current).href;
        continue;
      }

      return await finishResponse(url, current, response, maxBytes);
    }
  } catch (error) {
    const kind = classifyTransportError(error);
    return {
      ok: false,
      requestedUrl: url,
      finalUrl: current,
      offSite: current !== url && !sameSite(url, current),
      kind,
      message: transportMessage(kind, error),
    };
  }
}

async function finishResponse(
  requestedUrl: string,
  fetchedUrl: string,
  response: Response,
  maxBytes: number,
): Promise<PageFetch> {
  const landing = landingOf(requestedUrl, response, fetchedUrl);
  const outcome = classifyHttpStatus(response.status);
  if (outcome !== "ok") {
    await response.body?.cancel().catch(() => undefined);
    return {
      ok: false,
      requestedUrl,
      finalUrl: landing.finalUrl,
      offSite: landing.offSite,
      kind: outcome,
      status: response.status,
      message: landing.offSite
        ? `HTTP ${response.status} after redirect to ${landing.finalUrl}`
        : `HTTP ${response.status}`,
    };
  }

  if (landing.offSite) {
    await response.body?.cancel().catch(() => undefined);
    return {
      ok: true,
      requestedUrl,
      finalUrl: landing.finalUrl,
      offSite: true,
      status: response.status,
      corpus: null,
      note: `redirected to ${landing.finalUrl}`,
    };
  }

  const bytes = await readLimited(response, maxBytes);
  if (bytes === "too-big") {
    return {
      ok: true,
      requestedUrl,
      finalUrl: landing.finalUrl,
      offSite: false,
      status: response.status,
      corpus: null,
      note: "response exceeded max body size",
    };
  }
  if (!isTextContent(response.headers.get("content-type"))) {
    return {
      ok: true,
      requestedUrl,
      finalUrl: landing.finalUrl,
      offSite: false,
      status: response.status,
      corpus: null,
      note: "unsupported content type",
    };
  }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const text = extractPageText(html);
  if (!text.corpus) {
    return {
      ok: true,
      requestedUrl,
      finalUrl: landing.finalUrl,
      offSite: false,
      status: response.status,
      corpus: null,
      note: "empty page",
    };
  }
  return {
    ok: true,
    requestedUrl,
    finalUrl: landing.finalUrl,
    offSite: false,
    status: response.status,
    corpus: text,
  };
}

function landingOf(
  requestedUrl: string,
  response: Response,
  fetchedUrl: string,
): { finalUrl: string; offSite: boolean } {
  const reported = response.url;
  const finalUrl = reported || fetchedUrl;
  return { finalUrl, offSite: !sameSite(requestedUrl, finalUrl) };
}

function isRedirect(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

async function defaultLookup(hostname: string): Promise<readonly string[]> {
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

async function blockedAddress(target: string, lookupHost: HostLookup): Promise<string | null> {
  const raw = rawHostname(target);
  if (raw && looksLikeIp(raw)) return blockedLiteral(raw);
  const hostname = new URL(target).hostname;
  if (looksLikeIp(hostname)) return blockedLiteral(hostname);
  const host = hostname.endsWith(".") ? hostname.slice(0, -1) : hostname;
  const records = await lookupHost(host);
  if (records.length === 0) {
    throw Object.assign(new Error(`getaddrinfo ENOTFOUND ${host}`), { code: "ENOTFOUND" });
  }
  for (const record of records) {
    const bits = addressBits(record);
    if (!bits || blockedBits(bits)) return record;
  }
  return null;
}

function blockedLiteral(host: string): string | null {
  const bits = addressBits(host);
  if (!bits || blockedBits(bits)) return bits ? describeAddress(bits) : host;
  return null;
}

function rawHostname(target: string): string {
  const match = /^[a-z][a-z0-9+.-]*:\/\/([^/?#]*)/i.exec(target.trim());
  const authority = (match?.[1] ?? "").replace(/^[^@]*@/, "");
  if (authority.startsWith("[")) {
    const end = authority.indexOf("]");
    return end >= 0 ? authority.slice(1, end) : authority;
  }
  return authority.split(":")[0] ?? authority;
}

function looksLikeIp(host: string): boolean {
  const bare = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  if (bare.includes(":")) return true;
  const parts = bare.split(".");
  return parts.length > 0 && parts.every((part) => /^(0x[0-9a-f]+|\d+)$/i.test(part));
}

type AddressBits = { kind: "v4"; value: number } | { kind: "v6"; value: Uint8Array };

function describeAddress(bits: AddressBits): string {
  if (bits.kind === "v4") return formatIpv4(bits.value);
  const mapped = mappedIpv4(bits.value);
  return mapped === null ? formatIpv6(bits.value) : formatIpv4(mapped);
}

function blockedBits(bits: AddressBits): boolean {
  if (bits.kind === "v4") return blockedIpv4(bits.value);
  const mapped = mappedIpv4(bits.value);
  if (mapped !== null) return blockedIpv4(mapped);
  const bytes = bits.value;
  if (bytes.every((byte) => byte === 0)) return true;
  if (bytes.slice(0, 15).every((byte) => byte === 0) && bytes[15] === 1) return true;
  if (bytes[0] === 0xff) return true;
  if ((bytes[0]! & 0xfe) === 0xfc) return true;
  return bytes[0] === 0xfe && (bytes[1]! & 0xc0) === 0x80;
}

function blockedIpv4(addr: number): boolean {
  const first = addr >>> 24;
  const second = (addr >>> 16) & 0xff;
  if (first === 0 || first === 10 || first === 127) return true;
  if (first === 100 && (second & 0xc0) === 64) return true;
  if (first === 169 && second === 254) return true;
  if (first === 172 && (second & 0xf0) === 16) return true;
  if (first === 192 && second === 168) return true;
  return (first & 0xf0) === 224;
}

function addressBits(host: string): AddressBits | null {
  const bare = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  const zone = bare.split("%")[0] ?? bare;
  if (zone.includes(":")) {
    const value = parseIpv6(zone);
    return value ? { kind: "v6", value } : null;
  }
  const value = parseIpv4(zone);
  return value === null ? null : { kind: "v4", value };
}

function parseIpv4(host: string): number | null {
  const parts = host.split(".");
  if (parts.length < 1 || parts.length > 4) return null;
  const numbers = parts.map(parseIpv4Part);
  if (numbers.some((part) => part === null)) return null;
  const values = numbers as number[];
  if (values.length === 1) return values[0]! <= 0xffffffff ? values[0]! : null;
  if (values.length === 2) {
    if (values[0]! > 0xff || values[1]! > 0xffffff) return null;
    return ((values[0]! << 24) | values[1]!) >>> 0;
  }
  if (values.length === 3) {
    if (values[0]! > 0xff || values[1]! > 0xff || values[2]! > 0xffff) return null;
    return ((values[0]! << 24) | (values[1]! << 16) | values[2]!) >>> 0;
  }
  if (values.some((part) => part > 0xff)) return null;
  return ((values[0]! << 24) | (values[1]! << 16) | (values[2]! << 8) | values[3]!) >>> 0;
}

function parseIpv4Part(part: string): number | null {
  if (/^0x[0-9a-f]+$/i.test(part)) return Number.parseInt(part, 16);
  if (/^0\d+$/.test(part)) {
    if (/[89]/.test(part)) return null;
    return Number.parseInt(part, 8);
  }
  if (!/^\d+$/.test(part)) return null;
  return Number.parseInt(part, 10);
}

function parseIpv6(host: string): Uint8Array | null {
  const lastColon = host.lastIndexOf(":");
  const tail = host.slice(lastColon + 1);
  let body = host;
  if (tail.includes(".")) {
    const v4 = parseIpv4(tail);
    if (v4 === null) return null;
    const hi = ((v4 >>> 16) & 0xffff).toString(16);
    const lo = (v4 & 0xffff).toString(16);
    body = `${host.slice(0, lastColon)}:${hi}:${lo}`;
  }
  const halves = body.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  if (halves.length === 1 && left.length !== 8) return null;
  if (halves.length === 2 && left.length + right.length > 7) return null;
  const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];
  if (groups.length !== 8) return null;
  const bytes = new Uint8Array(16);
  for (let index = 0; index < groups.length; index += 1) {
    const group = groups[index] ?? "";
    if (!/^[0-9a-f]{1,4}$/i.test(group)) return null;
    const value = Number.parseInt(group, 16);
    bytes[index * 2] = value >> 8;
    bytes[index * 2 + 1] = value & 0xff;
  }
  return bytes;
}

function mappedIpv4(bytes: Uint8Array): number | null {
  for (let index = 0; index < 10; index += 1) {
    if (bytes[index] !== 0) return null;
  }
  if (bytes[10] !== 0xff || bytes[11] !== 0xff) return null;
  return ((bytes[12]! << 24) | (bytes[13]! << 16) | (bytes[14]! << 8) | bytes[15]!) >>> 0;
}

function formatIpv4(addr: number): string {
  return `${addr >>> 24}.${(addr >>> 16) & 0xff}.${(addr >>> 8) & 0xff}.${addr & 0xff}`;
}

function formatIpv6(bytes: Uint8Array): string {
  const groups: string[] = [];
  for (let index = 0; index < 16; index += 2) {
    groups.push(((bytes[index]! << 8) | bytes[index + 1]!).toString(16));
  }
  return groups.join(":");
}

export function classifyHttpStatus(status: number): "ok" | "not_found" | "transient" {
  if (status >= 200 && status < 300) return "ok";
  if (status === 404 || status === 410) return "not_found";
  return "transient";
}

export function classifyTransportError(error: unknown): FetchFailureKind {
  const codes = errorCodes(error);
  if (
    codes.some((code) =>
      ["TimeoutError", "AbortError", "ETIMEDOUT", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT", "UND_ERR_BODY_TIMEOUT"].includes(
        code,
      ),
    )
  ) {
    return "timeout";
  }
  if (codes.some((code) => code === "ENOTFOUND" || code === "EAI_NONAME")) return "dns";
  if (
    codes.some((code) =>
      ["ECONNREFUSED", "EHOSTUNREACH", "ENETUNREACH", "EADDRNOTAVAIL"].includes(code),
    )
  ) {
    return "connection";
  }
  return "transient";
}

export function isFatalFetch(kind: FetchFailureKind): boolean {
  return kind === "dns" || kind === "not_found" || kind === "connection";
}

async function readLimited(response: Response, maxBytes: number): Promise<Uint8Array | "too-big"> {
  const declared = Number(response.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > maxBytes) {
    await response.body?.cancel().catch(() => undefined);
    return "too-big";
  }
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return "too-big";
      }
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function isTextContent(contentType: string | null): boolean {
  if (!contentType) return true;
  const type = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  return (
    type.startsWith("text/") ||
    type === "application/xhtml+xml" ||
    type === "application/xml" ||
    type === "application/json"
  );
}

function transportMessage(kind: FetchFailureKind, error: unknown): string {
  if (kind === "timeout") return "timeout";
  if (kind === "dns") return "DNS ENOTFOUND";
  if (kind === "connection") return "connection failed";
  const codes = errorCodes(error);
  return codes[0] ?? "fetch failed";
}

function errorCodes(error: unknown): string[] {
  const codes: string[] = [];
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const record = current as { code?: unknown; name?: unknown; cause?: unknown; message?: unknown };
    if (typeof record.code === "string") codes.push(record.code);
    if (typeof record.name === "string") codes.push(record.name);
    if (typeof record.message === "string") {
      const match = record.message.match(
        /\b(ENOTFOUND|EAI_AGAIN|EAI_NONAME|ECONNREFUSED|EHOSTUNREACH|ENETUNREACH|EADDRNOTAVAIL|ETIMEDOUT|ECONNRESET)\b/,
      );
      if (match?.[1]) codes.push(match[1]);
    }
    current = record.cause;
  }
  return codes;
}
