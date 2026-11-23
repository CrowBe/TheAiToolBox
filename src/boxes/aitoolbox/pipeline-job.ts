import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { candidateFileSchema, type ToolCandidate } from "./pipeline.ts";
import {
  extractDescription,
  extractLaunchedYear,
  extractName,
  extractPricingDetails,
  extractTagline,
  extractToolUrl,
  type QuotedValue,
} from "./pipeline-extract.ts";
import { fetchPage, isFatalFetch, type FetchPageOptions, type PageFetch } from "./pipeline-fetch.ts";
import {
  renderReport,
  type PipelineChange,
  type PipelineGap,
  type PipelineRow,
} from "./pipeline-report.ts";
import { proseIsOnPage, quoteIsOnPage, type PageText } from "./pipeline-text.ts";
import {
  accentColorForSlug,
  isSocialUrl,
  normalizeUrl,
  sameSite,
  slugFromName,
} from "./pipeline-url.ts";
import {
  CATEGORY_RULES,
  matchMany,
  matchPricingModel,
  matchSingle,
  PLATFORM_RULES,
  PRICING_MODEL_IDS,
  ROLE_RULES,
  type MatchOne,
  type VocabRule,
} from "./pipeline-vocab.ts";
import { itemSchema, vocabularyFileSchema, type ToolRecord } from "./schema.ts";

export type { PipelineChange, PipelineGap, PipelineRow };

export type PipelineOptions = {
  candidatesPath?: string;
  checkExisting: boolean;
  toolsDir: string;
  vocabDir: string;
  reportPath: string;
  date: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxBytes?: number;
};

export type PipelineResult = {
  changed: boolean;
  changes: PipelineChange[];
  gaps: PipelineGap[];
  report: string;
};

type ToolFile = {
  path: string;
  original: string;
  record: ToolRecord;
  isNew: boolean;
};

type LoadedPage = PageFetch & { official: boolean };

type VocabEntry = { slug: string };

type Draft = {
  tool: ToolFile;
  action: "created" | "updated";
  rows: PipelineRow[];
};

/**
 * Read candidates and/or existing tools, fetch only those URLs, and write
 * quote-backed catalog updates plus a markdown report.
 * The candidate `thread` is not evidence: it was not fetched as page text.
 */
export async function runPipeline(options: PipelineOptions): Promise<PipelineResult> {
  if (!options.candidatesPath && !options.checkExisting) {
    throw new Error("Pass a candidates file, --check-existing, or both");
  }
  if (!z.iso.date().safeParse(options.date).success) throw new Error("Date must be YYYY-MM-DD");
  assertDirectory(options.toolsDir, "Tools directory");
  assertDirectory(options.vocabDir, "Vocabulary directory");

  const vocab = loadVocab(options.vocabDir);
  const tools = loadTools(options.toolsDir);
  const gaps: PipelineGap[] = [];
  const seenGaps = new Set<string>();
  const drafts: Draft[] = [];
  const addGap = (gap: PipelineGap) => {
    const key = `${gap.subject}\n${gap.reason}`;
    if (seenGaps.has(key)) return;
    seenGaps.add(key);
    gaps.push(gap);
  };

  const fetchOptions: FetchPageOptions = {
    fetchImpl: options.fetchImpl,
    timeoutMs: options.timeoutMs,
    maxBytes: options.maxBytes,
  };
  const cache = new Map<string, Promise<PageFetch>>();
  const load = (url: string) => {
    const cached = cache.get(url);
    if (cached) return cached;
    const pending = fetchPage(url, fetchOptions);
    cache.set(url, pending);
    return pending;
  };

  if (options.candidatesPath) {
    const candidates = readCandidates(options.candidatesPath);
    for (const candidate of candidates.candidates) {
      await processCandidate(
        candidate,
        tools,
        options.toolsDir,
        options.date,
        load,
        addGap,
        drafts,
        vocab,
      );
    }
  }
  if (options.checkExisting) {
    for (const tool of tools) {
      const page = await load(tool.record.url);
      applyExisting(tool, [{ ...page, official: true }], options.date, addGap, drafts);
    }
  }

  const changes = writeDrafts(drafts);
  const report = renderReport(changes, gaps);
  fs.mkdirSync(path.dirname(options.reportPath), { recursive: true });
  fs.writeFileSync(options.reportPath, report);
  return { changed: changes.length > 0, changes, gaps, report };
}

async function processCandidate(
  candidate: ToolCandidate,
  tools: ToolFile[],
  toolsDir: string,
  date: string,
  load: (url: string) => Promise<PageFetch>,
  addGap: (gap: PipelineGap) => void,
  drafts: Draft[],
  vocab: Vocabularies,
): Promise<void> {
  const subject = candidate.toolName.trim();
  const targets = unique([candidate.postUrl, ...candidate.links]);
  const officialUrls = targets.filter((url) => !isSocialUrl(url));
  if (officialUrls.length === 0) {
    addGap({ subject, reason: "no official site url; row not written" });
    return;
  }

  const pages: LoadedPage[] = [];
  for (const url of targets) {
    const fetched = await load(url);
    pages.push({ ...fetched, official: officialUrls.includes(url) });
  }

  const officialPages = pages.filter((page) => page.official);
  const officialOk = officialPages.filter((page) => page.ok);
  if (officialOk.length === 0) {
    addGap({ subject, reason: `${failureText(officialPages)}; row not written` });
    return;
  }
  for (const page of pages) {
    if (page.ok) continue;
    const label = page.official && isFatalFetch(page.kind) ? "official site unavailable" : "unfetchable";
    addGap({ subject, reason: `${label} ${page.requestedUrl} (${page.message})` });
  }

  const primaryOfficial = officialUrls[0] ?? "";
  const bySlug = findBySlug(tools, slugFromName(subject));
  const byHost = tools.find((tool) => sameSite(tool.record.url, primaryOfficial));
  if (bySlug && byHost && bySlug !== byHost) {
    addGap({ subject, reason: "slug and site point at different existing tools; row not written" });
    return;
  }
  if (bySlug && !sameSite(bySlug.record.url, primaryOfficial)) {
    addGap({
      subject,
      reason: `slug ${bySlug.record.slug} already belongs to ${bySlug.record.url}; row not written`,
    });
    return;
  }
  const existing = bySlug ?? byHost;
  if (existing) {
    applyExisting(existing, pages, date, addGap, drafts);
    return;
  }

  createTool(subject, pages, date, tools, toolsDir, addGap, drafts, vocab);
}

function createTool(
  subject: string,
  pages: LoadedPage[],
  date: string,
  tools: ToolFile[],
  toolsDir: string,
  addGap: (gap: PipelineGap) => void,
  drafts: Draft[],
  vocab: Vocabularies,
): void {
  const readable = pages.filter(hasText);
  const official = readable.filter((page) => page.official);
  const other = readable.filter((page) => !page.official);
  const ordered = [...official, ...other];
  const officialText = official.map((page) => page.corpus.corpus).join("\n");
  const otherText = other.map((page) => page.corpus.corpus).join("\n");
  const missing: string[] = [];
  const rows: PipelineRow[] = [];

  const name = firstProse(ordered, (page) => extractName(page, subject));
  const tagline = firstProse(ordered, (page) => extractTagline(page));
  const description = firstProse(ordered, (page) =>
    extractDescription(page, extractTagline(page)),
  );
  const url = firstProse(ordered, (page, source) => extractToolUrl(page, source));
  const pricing = firstProse(ordered, (page) => extractPricingDetails(page.corpus));
  takeProse(name, "name", rows, missing);
  takeProse(tagline, "tagline", rows, missing);
  takeProse(description, "description", rows, missing);
  takeProse(url, "url", rows, missing);
  takeProse(pricing, "pricingDetails", rows, missing);

  const year = preferYear(officialText, otherText);
  if (!year) missing.push("launchedYear");
  else if ("error" in year) missing.push(year.error);
  else if (!quoteIsOnPage(year.corpus, year.quote)) missing.push("launchedYear");
  else {
    rows.push({
      field: "launchedYear",
      value: String(year.year),
      source: sourceFor(ordered, year.quote, year.corpus),
      quote: year.quote,
    });
  }

  const category = preferMatch(officialText, otherText, (text) =>
    matchSingle(text, CATEGORY_RULES, "category"),
  );
  const roles = preferMany(officialText, otherText, ROLE_RULES, "role");
  const platforms = preferMany(officialText, otherText, PLATFORM_RULES, "platform");
  const pricingModel = preferMatch(officialText, otherText, (text) => matchPricingModel(text));
  takeMatch(category, "category", ordered, rows, missing);
  takeMany(roles, "roles", ordered, vocab.roles, rows, missing);
  takeMatch(pricingModel, "pricingModel", ordered, rows, missing);
  takeMany(platforms, "platforms", ordered, vocab.platforms, rows, missing);

  if (
    !name ||
    !tagline ||
    !description ||
    !url ||
    !pricing ||
    !year ||
    !("year" in year) ||
    !category.result.ok ||
    !pricingModel.result.ok ||
    roles.ids.length === 0 ||
    platforms.ids.length === 0 ||
    missing.length > 0
  ) {
    addGap({ subject, reason: `${missing.join("; ")}; row not written` });
    return;
  }

  const slug = slugFromName(name.evidence.value);
  if (!slug) {
    addGap({ subject, reason: "could not make a slug from the name; row not written" });
    return;
  }
  if (tools.some((tool) => tool.record.slug === slug)) {
    addGap({ subject, reason: `slug ${slug} already exists; row not written` });
    return;
  }
  if (!quoteIsOnPage(category.corpus, category.result.quote)) {
    addGap({ subject, reason: "no tag quote; row not written" });
    return;
  }

  const categoryId = category.result.id;
  rows.push({
    field: "tags",
    value: categoryId,
    source: sourceFor(ordered, category.result.quote, category.corpus),
    quote: category.result.quote,
  });

  const sourceUrl = url.source;
  const record: ToolRecord = {
    slug,
    name: name.evidence.value,
    tagline: tagline.evidence.value,
    description: description.evidence.value,
    url: url.evidence.value,
    status: "active",
    sourceUrl,
    lastChecked: date,
    category: categoryId,
    roles: roles.ids,
    pricingModel: pricingModel.result.id,
    pricingDetails: pricing.evidence.value,
    platforms: platforms.ids,
    tags: [categoryId],
    launchedYear: year.year,
    accentColor: accentColorForSlug(slug),
  };
  rows.push(
    { field: "slug", value: slug, source: sourceUrl, quote: "derived" },
    { field: "status", value: "active", source: sourceUrl, quote: "—" },
    { field: "sourceUrl", value: sourceUrl, source: sourceUrl, quote: url.evidence.quote },
    { field: "lastChecked", value: date, source: sourceUrl, quote: "—" },
    { field: "accentColor", value: record.accentColor, source: sourceUrl, quote: "derived" },
  );

  const parsed = itemSchema.safeParse(record);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => issue.message).join("; ");
    addGap({ subject, reason: `record failed schema: ${detail}; row not written` });
    return;
  }

  const tool: ToolFile = {
    path: path.join(toolsDir, `${slug}.json`),
    original: "",
    record,
    isNew: true,
  };
  tools.push(tool);
  drafts.push({ tool, action: "created", rows });
}

function applyExisting(
  tool: ToolFile,
  pages: LoadedPage[],
  date: string,
  addGap: (gap: PipelineGap) => void,
  drafts: Draft[],
): void {
  const own = pages.find((page) => urlsMatch(page.requestedUrl, tool.record.url));
  if (own && !own.ok) {
    if (isFatalFetch(own.kind)) discontinue(tool, own, date, drafts);
    else addGap({ subject: tool.record.name, reason: `unfetchable ${own.requestedUrl} (${own.message})` });
    return;
  }

  const page =
    (own && own.ok ? own : undefined) ??
    pages.find((item) => item.ok && item.official && sameSite(item.requestedUrl, tool.record.url));
  if (!page || !page.ok) {
    addGap({
      subject: tool.record.name,
      reason: `unfetchable ${tool.record.url} (no successful fetch)`,
    });
    return;
  }

  const rows: PipelineRow[] = [];
  if (tool.record.lastChecked !== date) {
    tool.record.lastChecked = date;
    rows.push({ field: "lastChecked", value: date, source: page.requestedUrl, quote: "—" });
  }
  if (!page.corpus) {
    addGap({
      subject: tool.record.name,
      reason: `${page.note ?? "no page text"} at ${page.requestedUrl}; left text fields unchanged`,
    });
  } else {
    const pricing = extractPricingDetails(page.corpus.corpus);
    const model = matchPricingModel(page.corpus.corpus);
    if (pricing && !model.ok) {
      addGap({
        subject: tool.record.name,
        reason: `${model.reason}; left existing pricing unchanged`,
      });
    } else if (
      pricing &&
      model.ok &&
      proseIsOnPage(page.corpus.corpus, pricing.value, pricing.quote) &&
      quoteIsOnPage(page.corpus.corpus, model.quote)
    ) {
      const pricingChanged = tool.record.pricingDetails !== pricing.value;
      const modelChanged = tool.record.pricingModel !== model.id;
      if (pricingChanged) {
        tool.record.pricingDetails = pricing.value;
        rows.push({
          field: "pricingDetails",
          value: pricing.value,
          source: page.requestedUrl,
          quote: pricing.quote,
        });
      }
      if (modelChanged) {
        tool.record.pricingModel = model.id;
        rows.push({
          field: "pricingModel",
          value: model.id,
          source: page.requestedUrl,
          quote: model.quote,
        });
      }
      if ((pricingChanged || modelChanged) && tool.record.sourceUrl !== page.requestedUrl) {
        tool.record.sourceUrl = page.requestedUrl;
        rows.push({
          field: "sourceUrl",
          value: page.requestedUrl,
          source: page.requestedUrl,
          quote: pricing.quote,
        });
      }
    }
  }
  if (rows.length > 0) drafts.push({ tool, action: "updated", rows });
}

function discontinue(
  tool: ToolFile,
  page: Extract<PageFetch, { ok: false }>,
  date: string,
  drafts: Draft[],
): void {
  const rows: PipelineRow[] = [];
  if (tool.record.status !== "discontinued") {
    tool.record.status = "discontinued";
    rows.push({ field: "status", value: "discontinued", source: page.requestedUrl, quote: page.message });
  }
  if (tool.record.lastChecked !== date) {
    tool.record.lastChecked = date;
    rows.push({ field: "lastChecked", value: date, source: page.requestedUrl, quote: "—" });
  }
  if (rows.length > 0) drafts.push({ tool, action: "updated", rows });
}

type ProseHit = { evidence: QuotedValue; source: string };

function hasText(page: LoadedPage): page is Extract<LoadedPage, { ok: true }> & { corpus: PageText } {
  return Boolean(page.ok && page.corpus);
}

function firstProse(
  pages: LoadedPage[],
  pick: (page: PageText, source: string) => QuotedValue | null,
): ProseHit | null {
  for (const page of pages) {
    if (!page.ok || !page.corpus) continue;
    const evidence = pick(page.corpus, page.requestedUrl);
    if (!evidence || !proseIsOnPage(page.corpus.corpus, evidence.value, evidence.quote)) continue;
    return { evidence, source: page.requestedUrl };
  }
  return null;
}

function takeProse(hit: ProseHit | null, field: string, rows: PipelineRow[], missing: string[]): void {
  if (!hit) {
    missing.push(field);
    return;
  }
  rows.push({ field, value: hit.evidence.value, source: hit.source, quote: hit.evidence.quote });
}

function preferMatch(
  officialText: string,
  otherText: string,
  match: (text: string) => MatchOne,
): { result: MatchOne; corpus: string } {
  if (officialText) {
    const result = match(officialText);
    if (result.ok || result.reason.startsWith("ambiguous") || !otherText) return { result, corpus: officialText };
  }
  const corpus = otherText || officialText;
  return { result: match(corpus), corpus };
}

function preferMany(
  officialText: string,
  otherText: string,
  rules: readonly VocabRule[],
  label: string,
): { ids: string[]; hits: { id: string; quote: string }[]; corpus: string; reason?: string } {
  const picked = preferMatch(officialText, otherText, (text) => {
    const many = matchMany(text, rules, label);
    if (!many.ok) return many;
    const first = many.hits[0];
    return first ? { ok: true, id: first.id, quote: first.quote } : { ok: false, reason: `no ${label} match` };
  });
  if (!picked.result.ok && picked.result.reason.startsWith("ambiguous")) {
    return { ids: [], hits: [], corpus: picked.corpus, reason: picked.result.reason };
  }
  const many = matchMany(picked.corpus, rules, label);
  if (!many.ok) return { ids: [], hits: [], corpus: picked.corpus, reason: many.reason };
  return { ids: many.hits.map((hit) => hit.id), hits: many.hits, corpus: picked.corpus };
}

function preferYear(
  officialText: string,
  otherText: string,
): { year: number; quote: string; corpus: string } | { error: string } | null {
  if (officialText) {
    const found = extractLaunchedYear(officialText);
    if (found && "error" in found) return found;
    if (found && "year" in found) return { ...found, corpus: officialText };
    if (!otherText) return null;
  }
  const corpus = otherText || officialText;
  const found = extractLaunchedYear(corpus);
  if (!found) return null;
  if ("error" in found) return found;
  return { ...found, corpus };
}

function takeMatch(
  picked: { result: MatchOne; corpus: string },
  field: string,
  pages: LoadedPage[],
  rows: PipelineRow[],
  missing: string[],
): void {
  if (!picked.result.ok) {
    missing.push(picked.result.reason);
    return;
  }
  if (!quoteIsOnPage(picked.corpus, picked.result.quote)) {
    missing.push(field);
    return;
  }
  rows.push({
    field,
    value: picked.result.id,
    source: sourceFor(pages, picked.result.quote, picked.corpus),
    quote: picked.result.quote,
  });
}

function takeMany(
  picked: { ids: string[]; hits: { id: string; quote: string }[]; corpus: string; reason?: string },
  field: string,
  pages: LoadedPage[],
  vocab: VocabEntry[],
  rows: PipelineRow[],
  missing: string[],
): void {
  if (picked.reason || picked.hits.length === 0) {
    missing.push(picked.reason ?? `no ${field} match`);
    return;
  }
  const order = new Map(vocab.map((entry, index) => [entry.slug, index]));
  const hits = [...picked.hits].sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
  let kept = 0;
  for (const hit of hits) {
    if (!quoteIsOnPage(picked.corpus, hit.quote)) continue;
    rows.push({
      field,
      value: hit.id,
      source: sourceFor(pages, hit.quote, picked.corpus),
      quote: hit.quote,
    });
    kept += 1;
  }
  if (kept === 0) missing.push(field);
  picked.ids = hits.filter((hit) => quoteIsOnPage(picked.corpus, hit.quote)).map((hit) => hit.id);
}

function sourceFor(pages: LoadedPage[], quote: string, corpus: string): string {
  const page = pages.find((item) => item.ok && item.corpus?.corpus.includes(quote));
  if (page) return page.requestedUrl;
  return corpus ? (pages.find((item) => item.ok)?.requestedUrl ?? "") : "";
}

function failureText(pages: LoadedPage[]): string {
  return pages
    .filter((page) => !page.ok)
    .map((page) => {
      const label = isFatalFetch(page.kind) ? "official site unavailable" : "unfetchable";
      return `${label} ${page.requestedUrl} (${page.message})`;
    })
    .join("; ");
}

function urlsMatch(left: string, right: string): boolean {
  try {
    return normalizeUrl(left) === normalizeUrl(right);
  } catch {
    return false;
  }
}

function findBySlug(tools: ToolFile[], slug: string | null): ToolFile | undefined {
  if (!slug) return undefined;
  return tools.find((tool) => tool.record.slug === slug);
}

function unique(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

type Vocabularies = {
  categories: VocabEntry[];
  roles: VocabEntry[];
  platforms: VocabEntry[];
  pricingModels: VocabEntry[];
};

function loadVocab(dir: string): Vocabularies {
  const categories = readVocab(dir, "categories.json");
  const roles = readVocab(dir, "roles.json");
  const platforms = readVocab(dir, "platforms.json");
  const pricingModels = readVocab(dir, "pricing-models.json");
  assertCoverage(categories, CATEGORY_RULES, "category");
  assertCoverage(roles, ROLE_RULES, "role");
  assertCoverage(platforms, PLATFORM_RULES, "platform");
  const pricingIds = [...pricingModels.map((entry) => entry.slug)].sort();
  const expected = [...PRICING_MODEL_IDS].sort();
  if (pricingIds.join() !== expected.join()) {
    throw new Error(
      `pricing model rules cover ${expected.join(", ")} but vocabulary is ${pricingIds.join(", ")}`,
    );
  }
  return { categories, roles, platforms, pricingModels };
}

function readVocab(dir: string, name: string): VocabEntry[] {
  const file = path.join(dir, name);
  const parsed = vocabularyFileSchema.safeParse(readJson(file));
  if (!parsed.success) throw new Error(`${file}: invalid vocabulary`);
  return parsed.data.map((entry) => ({ slug: entry.slug }));
}

function assertCoverage(entries: VocabEntry[], rules: readonly VocabRule[], label: string): void {
  const known = new Set(entries.map((entry) => entry.slug));
  const ruled = new Set(rules.map((rule) => rule.id));
  for (const id of ruled) {
    if (!known.has(id)) throw new Error(`${label} rule ${id} is not in the vocabulary`);
  }
  for (const id of known) {
    if (!ruled.has(id)) throw new Error(`${label} vocabulary ${id} has no keyword rule`);
  }
}

function loadTools(dir: string): ToolFile[] {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const filePath = path.join(dir, name);
      const original = fs.readFileSync(filePath, "utf8");
      const json: unknown = JSON.parse(original) as unknown;
      const parsed = itemSchema.safeParse(json);
      if (!parsed.success) {
        const detail = parsed.error.issues.map((issue) => issue.message).join("; ");
        throw new Error(`${filePath}: ${detail}`);
      }
      if (`${parsed.data.slug}.json` !== name) {
        throw new Error(`${filePath}: filename should be ${parsed.data.slug}.json`);
      }
      if (!json || typeof json !== "object" || Array.isArray(json)) {
        throw new Error(`${filePath}: invalid tool`);
      }
      return { path: filePath, original, record: json as ToolRecord, isNew: false };
    });
}

function readCandidates(file: string) {
  const parsed = candidateFileSchema.safeParse(readJson(file));
  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`${file}: ${detail}`);
  }
  return parsed.data;
}

function readJson(file: string): unknown {
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error(`${file}: invalid JSON`);
  }
}

function writeDrafts(drafts: Draft[]): PipelineChange[] {
  const changes: PipelineChange[] = [];
  const written = new Set<string>();
  for (const draft of drafts) {
    if (draft.rows.length === 0) continue;
    const next = `${JSON.stringify(draft.tool.record, null, 2)}\n`;
    if (!draft.tool.isNew && next === draft.tool.original) continue;
    if (written.has(draft.tool.path) && next === draft.tool.original) continue;
    fs.mkdirSync(path.dirname(draft.tool.path), { recursive: true });
    fs.writeFileSync(draft.tool.path, next);
    draft.tool.original = next;
    draft.tool.isNew = false;
    written.add(draft.tool.path);
    changes.push({
      name: draft.tool.record.name,
      file: displayPath(draft.tool.path),
      action: draft.action,
      rows: draft.rows,
    });
  }
  return changes;
}

function displayPath(file: string): string {
  const relative = path.relative(process.cwd(), file);
  const shown = relative.startsWith("..") ? file : relative;
  return shown.split(path.sep).join("/");
}

function assertDirectory(dir: string, label: string): void {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(`${label} not found: ${dir}`);
  }
}
