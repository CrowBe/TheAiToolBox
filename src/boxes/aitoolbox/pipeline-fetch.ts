import { extractPageText, type PageText } from "./pipeline-text.ts";

export const PIPELINE_USER_AGENT = "TheAiToolBoxPipeline/1.0";
export const DEFAULT_TIMEOUT_MS = 15_000;
export const DEFAULT_MAX_BYTES = 1_000_000;

const ACCEPT = "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.1";

export type FetchFailureKind = "dns" | "not_found" | "connection" | "timeout" | "transient";

export type PageFetch =
  | {
      ok: true;
      requestedUrl: string;
      status: number;
      corpus: PageText | null;
      note?: string;
    }
  | {
      ok: false;
      requestedUrl: string;
      kind: FetchFailureKind;
      status?: number;
      message: string;
    };

export type FetchPageOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxBytes?: number;
};

/**
 * Fetch one URL. Redirects are followed. Links in the body are not.
 * DNS failure, HTTP 404/410, and a refused or unreachable connection are
 * permanent (`dns`, `not_found`, `connection`). Timeouts, HTTP 403/429, and
 * 5xx responses are `transient` or `timeout` and must not mark a tool discontinued.
 */
export async function fetchPage(url: string, options: FetchPageOptions = {}): Promise<PageFetch> {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const signal = AbortSignal.timeout(timeoutMs);

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal,
      cache: "no-store",
      headers: {
        "user-agent": PIPELINE_USER_AGENT,
        accept: ACCEPT,
      },
    });
  } catch (error) {
    const kind = classifyTransportError(error);
    return {
      ok: false,
      requestedUrl: url,
      kind,
      message: transportMessage(kind, error),
    };
  }

  const outcome = classifyHttpStatus(response.status);
  if (outcome !== "ok") {
    await response.body?.cancel().catch(() => undefined);
    return {
      ok: false,
      requestedUrl: url,
      kind: outcome,
      status: response.status,
      message: `HTTP ${response.status}`,
    };
  }

  try {
    const bytes = await readLimited(response, maxBytes);
    if (bytes === "too-big") {
      return {
        ok: true,
        requestedUrl: url,
        status: response.status,
        corpus: null,
        note: "response exceeded max body size",
      };
    }
    if (!isTextContent(response.headers.get("content-type"))) {
      return {
        ok: true,
        requestedUrl: url,
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
        requestedUrl: url,
        status: response.status,
        corpus: null,
        note: "empty page",
      };
    }
    return { ok: true, requestedUrl: url, status: response.status, corpus: text };
  } catch (error) {
    const kind = classifyTransportError(error);
    return {
      ok: false,
      requestedUrl: url,
      kind,
      status: response.status,
      message: transportMessage(kind, error),
    };
  }
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
