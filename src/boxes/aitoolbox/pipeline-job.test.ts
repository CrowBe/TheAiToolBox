import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PIPELINE_USER_AGENT, classifyHttpStatus, classifyTransportError } from "./pipeline-fetch";
import { runPipeline } from "./pipeline-job";
import { proseIsOnPage, extractPageText } from "./pipeline-text";
import { itemSchema, type ToolRecord } from "./schema";

const DATE = "2026-11-23";
const VOCAB = path.join(process.cwd(), "data", "vocabularies");

function fixture(name: string): string {
  return fs.readFileSync(path.join("scripts", "pipeline", "fixtures", name), "utf8");
}

function keptTool(overrides: Partial<ToolRecord> = {}): ToolRecord {
  return {
    slug: "kept",
    name: "Kept",
    tagline: "A kept tool.",
    description: "This tool stays in the catalog.",
    url: "https://kept.example/app",
    status: "active",
    sourceUrl: "https://kept.example/app",
    lastChecked: "2026-11-01",
    category: "writing-tools",
    roles: ["writer"],
    pricingModel: "freemium",
    pricingDetails: "Free plan. Pro is $12/month.",
    platforms: ["web"],
    tags: ["writing"],
    launchedYear: 2024,
    accentColor: "#0E5F59",
    ...overrides,
  };
}

function pagesFetch(
  pages: Record<string, { status?: number; body?: string; hang?: boolean; error?: Error }>,
  calls: string[],
  inits: RequestInit[],
): typeof fetch {
  return async (input, init) => {
    const url = String(input);
    calls.push(url);
    inits.push(init ?? {});
    const page = pages[url];
    if (!page) throw new Error(`unexpected fetch ${url}`);
    if (page.hang) {
      await new Promise<never>((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) {
          reject(new Error("missing abort signal"));
          return;
        }
        const abort = () => reject(signal.reason ?? new DOMException("timed out", "TimeoutError"));
        if (signal.aborted) abort();
        else signal.addEventListener("abort", abort, { once: true });
      });
    }
    if (page.error) throw page.error;
    return new Response(page.body ?? "", {
      status: page.status ?? 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  };
}

async function runCase(options: {
  tools?: ToolRecord[];
  candidates?: unknown;
  checkExisting?: boolean;
  fetchImpl: typeof fetch;
  timeoutMs?: number;
}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pipeline-"));
  const toolsDir = path.join(root, "tools");
  fs.mkdirSync(toolsDir);
  for (const tool of options.tools ?? []) {
    const file = path.join(toolsDir, `${tool.slug}.json`);
    fs.writeFileSync(file, `${JSON.stringify(tool, null, 2)}\n`);
  }
  const candidatesPath = path.join(root, "candidates.json");
  if (options.candidates) fs.writeFileSync(candidatesPath, JSON.stringify(options.candidates));
  const reportPath = path.join(root, "report.md");
  const result = await runPipeline({
    candidatesPath: options.candidates ? candidatesPath : undefined,
    checkExisting: options.checkExisting ?? false,
    toolsDir,
    vocabDir: VOCAB,
    reportPath,
    date: DATE,
    fetchImpl: options.fetchImpl,
    timeoutMs: options.timeoutMs ?? 1000,
  });
  return { root, toolsDir, reportPath, result };
}

function candidate(toolName: string, postUrl: string, links: string[], thread?: string[]) {
  return {
    date: DATE,
    candidates: [{ toolName, postUrl, links, ...(thread ? { thread } : {}) }],
  };
}

function quoteCell(report: string, field: string): string {
  const line = report.split("\n").find((row) => row.startsWith(`| ${field} |`));
  expect(line, field).toBeDefined();
  return line?.split("|")[4]?.trim() ?? "";
}

describe("tool data pipeline", () => {
  it("accepts a quote that is a substring of the fetched page", async () => {
    const html = fixture("official-site.html");
    const calls: string[] = [];
    const inits: RequestInit[] = [];
    const { toolsDir, result } = await runCase({
      candidates: candidate("Northstar Writer", "https://northstar.example/", ["https://northstar.example/"]),
      fetchImpl: pagesFetch({ "https://northstar.example/": { body: html } }, calls, inits),
    });
    const corpus = extractPageText(html).corpus;
    expect(proseIsOnPage(corpus, "Northstar Writer", "Northstar Writer")).toBe(true);
    expect(calls).toEqual(["https://northstar.example/"]);
    expect(calls).not.toContain("https://tracker.example/click");
    expect(inits[0]?.redirect).toBe("follow");
    const headers = inits[0]?.headers as Record<string, string>;
    expect(headers["user-agent"]).toBe(PIPELINE_USER_AGENT);
    expect(result.changed).toBe(true);
    expect(result.report).toContain("<!-- pipeline-changed: 1 -->");
    const saved = JSON.parse(
      fs.readFileSync(path.join(toolsDir, "northstar-writer.json"), "utf8"),
    ) as ToolRecord;
    expect(itemSchema.safeParse(saved).success).toBe(true);
    expect(saved.name).toBe("Northstar Writer");
    expect(saved.category).toBe("writing-tools");
    expect(saved.roles).toEqual(["writer"]);
    expect(saved.platforms).toEqual(["web"]);
    expect(saved.pricingModel).toBe("freemium");
    expect(saved.launchedYear).toBe(2024);
    expect(saved.status).toBe("active");
    expect(saved.lastChecked).toBe(DATE);
    expect(corpus.includes(quoteCell(result.report, "name"))).toBe(true);
    expect(corpus.includes(quoteCell(result.report, "tagline"))).toBe(true);
    expect(corpus.includes(quoteCell(result.report, "description"))).toBe(true);
    expect(corpus.includes(quoteCell(result.report, "pricingDetails"))).toBe(true);
    expect(corpus.includes(quoteCell(result.report, "url"))).toBe(true);
  });

  it("rejects a value whose quote is not a literal substring of the page text", async () => {
    const html = fixture("script-only.html");
    const corpus = extractPageText(html).corpus;
    expect(html).toContain("Ghost Writer");
    expect(corpus.includes("Ghost Writer")).toBe(false);
    expect(proseIsOnPage(corpus, "Ghost Writer", "Ghost Writer")).toBe(false);
    expect(proseIsOnPage(corpus, "Not A Name", "Visible")).toBe(false);
    const calls: string[] = [];
    const { toolsDir, result } = await runCase({
      candidates: candidate("Ghost Writer", "https://ghost.example/", ["https://ghost.example/"]),
      fetchImpl: pagesFetch({ "https://ghost.example/": { body: html } }, calls, []),
    });
    expect(fs.readdirSync(toolsDir)).toEqual([]);
    expect(result.changed).toBe(false);
    expect(result.gaps.some((gap) => gap.reason.includes("row not written"))).toBe(true);
    expect(JSON.stringify(result.changes)).not.toContain("Ghost Writer");
  });

  it("lets the official site win when a post also has a value", async () => {
    const calls: string[] = [];
    const { toolsDir, result } = await runCase({
      candidates: candidate("Northstar Writer", "https://x.com/example/status/1", [
        "https://northstar.example/",
      ]),
      fetchImpl: pagesFetch(
        {
          "https://x.com/example/status/1": { body: fixture("social-post.html") },
          "https://northstar.example/": { body: fixture("official-site.html") },
        },
        calls,
        [],
      ),
    });
    expect(calls).toEqual(["https://x.com/example/status/1", "https://northstar.example/"]);
    const saved = JSON.parse(
      fs.readFileSync(path.join(toolsDir, "northstar-writer.json"), "utf8"),
    ) as ToolRecord;
    expect(saved.name).toBe("Northstar Writer");
    expect(saved.name).not.toBe("Social Name Instead");
    expect(saved.category).toBe("writing-tools");
    expect(saved.roles).toEqual(["writer"]);
    expect(saved.platforms).toEqual(["web"]);
    expect(saved.pricingModel).toBe("freemium");
    expect(saved.launchedYear).toBe(2024);
    expect(quoteCell(result.report, "name")).toBe("Northstar Writer");
    const nameLine = result.report.split("\n").find((row) => row.startsWith("| name |"));
    expect(nameLine).toContain("https://northstar.example/");
    expect(nameLine).not.toContain("https://x.com/");
  });

  it("writes a confident vocabulary match and gaps a tie or a miss", async () => {
    const matched = await runCase({
      candidates: candidate("Northstar Writer", "https://northstar.example/", ["https://northstar.example/"]),
      fetchImpl: pagesFetch(
        { "https://northstar.example/": { body: fixture("official-site.html") } },
        [],
        [],
      ),
    });
    const saved = JSON.parse(
      fs.readFileSync(path.join(matched.toolsDir, "northstar-writer.json"), "utf8"),
    ) as ToolRecord;
    expect(saved.category).toBe("writing-tools");
    expect(saved.pricingModel).toBe("freemium");

    const ambiguous = await runCase({
      candidates: candidate("Mixed Tool", "https://x.com/example/status/9", ["https://mixed.example/"]),
      fetchImpl: pagesFetch(
        {
          "https://x.com/example/status/9": { body: fixture("official-site.html") },
          "https://mixed.example/": { body: fixture("ambiguous.html") },
        },
        [],
        [],
      ),
    });
    expect(fs.readdirSync(ambiguous.toolsDir)).toEqual([]);
    expect(ambiguous.result.changed).toBe(false);
    expect(ambiguous.result.gaps.map((gap) => gap.reason).join("\n")).toContain(
      "ambiguous category: code-assistants, writing-tools",
    );

    const missed = await runCase({
      candidates: candidate("Plain Notes", "https://x.com/example/status/8", ["https://plain.example/"], [
        "Plain Notes is an AI writing assistant for writers. Use it as a web app. Free plan. Pro is $12/month. Launched in 2024.",
      ]),
      fetchImpl: pagesFetch(
        {
          "https://x.com/example/status/8": { body: fixture("no-category.html") },
          "https://plain.example/": { body: fixture("no-category.html") },
        },
        [],
        [],
      ),
    });
    expect(fs.readdirSync(missed.toolsDir)).toEqual([]);
    expect(missed.result.gaps.map((gap) => gap.reason).join("\n")).toContain("no category match");
    expect(missed.result.report).toContain("row not written");
  });

  it.each([404, 410])("marks an existing tool discontinued on HTTP %s and keeps the file", async (status) => {
    const tool = keptTool();
    const before = `${JSON.stringify(tool, null, 2)}\n`;
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch({ [tool.url]: { status, body: "gone" } }, [], []),
    });
    const file = path.join(toolsDir, "kept.json");
    expect(fs.existsSync(file)).toBe(true);
    const saved = JSON.parse(fs.readFileSync(file, "utf8")) as ToolRecord;
    expect(saved.status).toBe("discontinued");
    expect(saved.lastChecked).toBe(DATE);
    expect(saved.name).toBe("Kept");
    expect(saved.slug).toBe("kept");
    expect(fs.readFileSync(file, "utf8")).not.toBe(before);
    expect(result.changed).toBe(true);
    expect(result.report).toContain(`HTTP ${status}`);
    expect(result.gaps).toEqual([]);
  });

  it("keeps a DNS failure discontinued without deleting the tool", async () => {
    const tool = keptTool();
    const cause = Object.assign(new Error("getaddrinfo ENOTFOUND kept.example"), { code: "ENOTFOUND" });
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch(
        { [tool.url]: { error: Object.assign(new TypeError("fetch failed"), { cause }) } },
        [],
        [],
      ),
    });
    const saved = JSON.parse(fs.readFileSync(path.join(toolsDir, "kept.json"), "utf8")) as ToolRecord;
    expect(saved.status).toBe("discontinued");
    expect(saved.name).toBe("Kept");
    expect(result.report).toContain("DNS ENOTFOUND");
    expect(fs.readdirSync(toolsDir)).toEqual(["kept.json"]);
  });

  it("records a timeout as a gap and does not mark the tool discontinued", async () => {
    const tool = keptTool();
    const before = `${JSON.stringify(tool, null, 2)}\n`;
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      timeoutMs: 30,
      fetchImpl: pagesFetch({ [tool.url]: { hang: true } }, [], []),
    });
    const file = path.join(toolsDir, "kept.json");
    expect(fs.readFileSync(file, "utf8")).toBe(before);
    const saved = JSON.parse(fs.readFileSync(file, "utf8")) as ToolRecord;
    expect(saved.status).toBe("active");
    expect(result.changed).toBe(false);
    expect(result.gaps.map((gap) => gap.reason).join("\n")).toContain("timeout");
    expect(result.report).toContain("## Gaps");
    expect(result.report).not.toContain("discontinued");
  });

  it.each([403, 429, 503])("leaves HTTP %s unfetchable instead of discontinued", async (status) => {
    const tool = keptTool();
    const before = `${JSON.stringify(tool, null, 2)}\n`;
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch({ [tool.url]: { status, body: "nope" } }, [], []),
    });
    expect(fs.readFileSync(path.join(toolsDir, "kept.json"), "utf8")).toBe(before);
    expect(result.changed).toBe(false);
    expect(result.gaps.map((gap) => gap.reason).join("\n")).toContain(`HTTP ${status}`);
    expect(result.report).not.toContain("| status | discontinued |");
  });

  it("reports no changes when a successful check matches the saved row", async () => {
    const tool = keptTool({ lastChecked: DATE });
    const before = `${JSON.stringify(tool, null, 2)}\n`;
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch({ [tool.url]: { body: fixture("unchanged.html") } }, [], []),
    });
    expect(fs.readFileSync(path.join(toolsDir, "kept.json"), "utf8")).toBe(before);
    expect(result.changed).toBe(false);
    expect(result.changes).toEqual([]);
    expect(result.report).toContain("<!-- pipeline-changed: 0 -->");
    expect(result.report).toContain("No catalog changes.");
    expect(result.report).toContain("None.");
  });

  it("updates pricing from a quote and leaves the curated name in place", async () => {
    const tool = keptTool();
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch({ [tool.url]: { body: fixture("pricing-update.html") } }, [], []),
    });
    const saved = JSON.parse(fs.readFileSync(path.join(toolsDir, "kept.json"), "utf8")) as ToolRecord;
    expect(saved.name).toBe("Kept");
    expect(saved.tagline).toBe(tool.tagline);
    expect(saved.category).toBe("writing-tools");
    expect(saved.pricingModel).toBe("paid");
    expect(saved.pricingDetails).toBe("Pro is $30/month.");
    expect(saved.lastChecked).toBe(DATE);
    expect(saved.status).toBe("active");
    expect(extractPageText(fixture("pricing-update.html")).corpus.includes(saved.pricingDetails)).toBe(true);
    expect(result.changed).toBe(true);
  });

  it("does not change pricing when the model match is ambiguous", async () => {
    const tool = keptTool();
    const { toolsDir, result } = await runCase({
      tools: [tool],
      checkExisting: true,
      fetchImpl: pagesFetch({ [tool.url]: { body: fixture("pricing-ambiguous.html") } }, [], []),
    });
    const saved = JSON.parse(fs.readFileSync(path.join(toolsDir, "kept.json"), "utf8")) as ToolRecord;
    expect(saved.pricingModel).toBe("freemium");
    expect(saved.pricingDetails).toBe(tool.pricingDetails);
    expect(saved.lastChecked).toBe(DATE);
    expect(saved.status).toBe("active");
    expect(result.gaps.map((gap) => gap.reason).join("\n")).toContain("ambiguous pricing model");
  });

  it("exits quietly when the catalog does not change", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "pipeline-cli-"));
    const toolsDir = path.join(root, "tools");
    fs.mkdirSync(toolsDir);
    const reportPath = path.join(root, "report.md");
    const result = spawnSync(
      process.execPath,
      [
        "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
        "--experimental-strip-types",
        path.join(process.cwd(), "scripts", "pipeline", "run.ts"),
        "--check-existing",
        "--tools",
        toolsDir,
        "--vocab",
        VOCAB,
        "--report",
        reportPath,
        "--date",
        DATE,
      ],
      { encoding: "utf8", timeout: 15000 },
    );
    expect(result.status).toBe(3);
    expect(result.stdout).toContain("pipeline-changed=0");
    expect(fs.readFileSync(reportPath, "utf8")).toContain("<!-- pipeline-changed: 0 -->");

    const missing = spawnSync(
      process.execPath,
      [
        "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
        "--experimental-strip-types",
        path.join(process.cwd(), "scripts", "pipeline", "run.ts"),
      ],
      { encoding: "utf8", timeout: 15000 },
    );
    expect(missing.status).toBe(1);
  });
});

describe("fetch classification", () => {
  it("treats 404 and 410 as gone, and 403, 429, and 5xx as transient", () => {
    expect(classifyHttpStatus(200)).toBe("ok");
    expect(classifyHttpStatus(404)).toBe("not_found");
    expect(classifyHttpStatus(410)).toBe("not_found");
    expect(classifyHttpStatus(403)).toBe("transient");
    expect(classifyHttpStatus(429)).toBe("transient");
    expect(classifyHttpStatus(503)).toBe("transient");
  });

  it("separates DNS and connection failures from timeouts", () => {
    const dns = Object.assign(new TypeError("fetch failed"), {
      cause: Object.assign(new Error("getaddrinfo ENOTFOUND kept.example"), { code: "ENOTFOUND" }),
    });
    const refused = Object.assign(new TypeError("fetch failed"), {
      cause: Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:443"), { code: "ECONNREFUSED" }),
    });
    expect(classifyTransportError(dns)).toBe("dns");
    expect(classifyTransportError(refused)).toBe("connection");
    expect(classifyTransportError(new DOMException("timed out", "TimeoutError"))).toBe("timeout");
  });
});
