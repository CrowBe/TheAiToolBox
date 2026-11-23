import { httpsUrl } from "./schema.ts";
import { proseIsOnPage, quoteIsOnPage, type PageText } from "./pipeline-text.ts";
import { sameSite } from "./pipeline-url.ts";

export type QuotedValue = {
  value: string;
  quote: string;
};

const PRICING_CUES = [
  /free tier/i,
  /free plan/i,
  /free forever/i,
  /completely free/i,
  /freemium/i,
  /open[- ]source/i,
  /contact sales/i,
  /enterprise pricing/i,
  /custom pricing/i,
  /\$\d/,
];

const YEAR_SOURCE = String.raw`(?:launched|founded|released|established|since)\s+(?:in\s+)?((?:19|20)\d{2})\b`;

export function extractName(page: PageText, hint: string | undefined): QuotedValue | null {
  const hinted = hint?.trim() ?? "";
  if (hinted && proseIsOnPage(page.corpus, hinted, hinted)) return { value: hinted, quote: hinted };
  const title = page.title?.trim() ?? "";
  if (!title || !quoteIsOnPage(page.corpus, title)) return null;
  const value = title.split(/\s+[|–—]\s+|\s+-\s+/)[0]?.trim() ?? "";
  if (!proseIsOnPage(page.corpus, value, title)) return null;
  return { value, quote: title };
}

export function extractTagline(page: PageText): QuotedValue | null {
  for (const description of page.descriptions) {
    if (!quoteIsOnPage(page.corpus, description)) continue;
    if (description.length <= 180 && proseIsOnPage(page.corpus, description, description)) {
      return { value: description, quote: description };
    }
    if (description.length > 180) {
      const cut = description.slice(0, 180);
      const space = cut.lastIndexOf(" ");
      const value = (space >= 40 ? cut.slice(0, space) : cut).trim();
      if (proseIsOnPage(page.corpus, value, description)) return { value, quote: description };
    }
  }
  return null;
}

export function extractDescription(page: PageText, tagline: QuotedValue | null): QuotedValue | null {
  const candidates = page.paragraphs.filter(
    (paragraph) =>
      paragraph.length >= 40 &&
      paragraph.length <= 1500 &&
      proseIsOnPage(page.corpus, paragraph, paragraph),
  );
  candidates.sort((left, right) => right.length - left.length);
  const best = candidates[0];
  if (best) return { value: best, quote: best };
  if (tagline && proseIsOnPage(page.corpus, tagline.quote, tagline.quote)) {
    return { value: tagline.quote, quote: tagline.quote };
  }
  return null;
}

export function extractToolUrl(page: PageText, pageUrl: string): QuotedValue | null {
  for (const candidate of page.urls) {
    if (!httpsUrl.safeParse(candidate).success) continue;
    if (!proseIsOnPage(page.corpus, candidate, candidate)) continue;
    if (!sameSite(candidate, pageUrl)) continue;
    return { value: candidate, quote: candidate };
  }
  return null;
}

export function extractPricingDetails(corpus: string): QuotedValue | null {
  const chunks: string[] = [];
  for (const line of corpus.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    chunks.push(trimmed);
    for (const part of trimmed.split(/(?<=\.)\s+/)) {
      const sentence = part.trim();
      if (sentence && sentence !== trimmed) chunks.push(sentence);
    }
  }
  const hits = chunks.filter(
    (chunk) =>
      chunk.length >= 8 &&
      chunk.length <= 400 &&
      PRICING_CUES.some((cue) => cue.test(chunk)) &&
      proseIsOnPage(corpus, chunk, chunk),
  );
  hits.sort((left, right) => pricingScore(right) - pricingScore(left) || left.length - right.length);
  const best = hits[0];
  return best ? { value: best, quote: best } : null;
}

export function extractLaunchedYear(
  corpus: string,
): { year: number; quote: string } | { error: string } | null {
  const matches: { year: number; quote: string }[] = [];
  for (const match of corpus.matchAll(new RegExp(YEAR_SOURCE, "gi"))) {
    const quote = match[0];
    const year = Number(match[1]);
    if (!quote || !quoteIsOnPage(corpus, quote)) continue;
    if (!Number.isInteger(year) || year < 1990 || year > 2100) continue;
    matches.push({ year, quote });
  }
  const years = [...new Set(matches.map((match) => match.year))].sort();
  const first = matches[0];
  if (years.length === 0 || !first) return null;
  if (years.length > 1) return { error: `ambiguous launched year: ${years.join(", ")}` };
  return first;
}

function pricingScore(chunk: string): number {
  let score = 0;
  if (/\$\d/.test(chunk)) score += 2;
  if (/free (?:tier|plan)|freemium|free forever|completely free/i.test(chunk)) score += 2;
  if (/open[- ]source|contact sales|enterprise pricing|custom pricing/i.test(chunk)) score += 2;
  return score;
}
