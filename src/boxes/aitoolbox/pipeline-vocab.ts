/**
 * Keyword tables for category, audience, platform, and pricing model.
 *
 * Matching is case-insensitive. A keyword hits only on alphanumeric boundaries,
 * so "ai writing" does not match inside "openai writing". Each keyword belongs
 * to one id in its table.
 *
 * Category is one value. The id with the most keyword hits wins. Zero hits, or
 * a tie for the most hits, is not confident: the caller must not write a new row.
 *
 * Roles and platforms are lists. Every id with at least one hit is kept. Zero
 * hits is not confident. A single keyword cannot select two ids.
 *
 * Pricing model is one value, with the combo rules in `matchPricingModel`:
 * - "free tier", "free plan", or "freemium" => freemium
 * - "free forever", "completely free", or "100% free", and no public price => free
 * - that free-forever language plus a public price, with no open-source or
 *   enterprise language => freemium
 * - a public price alone => paid
 * - open-source language alone => open_source
 * - "contact sales", "enterprise pricing", or "custom pricing" alone => enterprise
 * - open-source or enterprise language combined with a different signal => ambiguous
 * - no signal => no match
 */

export type VocabRule = {
  id: string;
  keywords: readonly string[];
};

export type MatchOne =
  | { ok: true; id: string; quote: string }
  | { ok: false; reason: string };

export type MatchMany =
  | { ok: true; hits: { id: string; quote: string }[] }
  | { ok: false; reason: string };

export const CATEGORY_RULES: readonly VocabRule[] = [
  {
    id: "code-assistants",
    keywords: ["code assistant", "code editor", "coding agent", "pair programming", "ide plugin"],
  },
  { id: "automation", keywords: ["workflow automation", "no-code automation", "automate workflows"] },
  { id: "video-generation", keywords: ["text-to-video", "video generation", "generate videos", "ai video"] },
  {
    id: "customer-support",
    keywords: ["customer support", "support tickets", "help desk", "customer service agent"],
  },
  { id: "sales-marketing", keywords: ["sales prospecting", "lead enrichment", "outbound sales"] },
  { id: "legal", keywords: ["contract review", "legal research", "law firm"] },
  { id: "developer-platforms", keywords: ["vector database", "inference api", "model hub", "llm api"] },
  {
    id: "security-compliance",
    keywords: ["application security", "compliance automation", "vulnerability scanning"],
  },
  { id: "voice-agents", keywords: ["voice agent", "phone agent", "voice ai"] },
  { id: "browser-agents", keywords: ["browser agent", "drives a browser"] },
  { id: "chat-assistants", keywords: ["chat assistant", "ai chatbot", "conversational assistant"] },
  { id: "image-generation", keywords: ["image generation", "text-to-image", "generate images"] },
  { id: "audio-music", keywords: ["music generation", "text-to-speech", "voice cloning"] },
  { id: "design-ux", keywords: ["ui design", "logo maker", "design tool"] },
  { id: "meeting-assistants", keywords: ["meeting notes", "meeting transcription", "ai notetaker"] },
  { id: "data-analytics", keywords: ["business intelligence", "data analysis", "analytics dashboard"] },
  { id: "finance-accounting", keywords: ["invoice automation", "financial analysis", "accounting software"] },
  { id: "education", keywords: ["ai tutor", "learning platform", "for students and teachers"] },
  { id: "3d-cad", keywords: ["text-to-3d", "3d model", "cad software"] },
  { id: "writing-tools", keywords: ["ai writing", "writing assistant", "grammar checker"] },
  { id: "productivity", keywords: ["note-taking", "knowledge management", "enterprise search"] },
  { id: "research", keywords: ["literature review", "academic papers", "scientific research"] },
  { id: "presentations", keywords: ["slide deck", "generate slides", "presentation tool"] },
];

export const ROLE_RULES: readonly VocabRule[] = [
  { id: "developer", keywords: ["for developers", "software engineers"] },
  { id: "designer", keywords: ["for designers", "graphic designers"] },
  { id: "marketer", keywords: ["for marketers", "marketing teams"] },
  { id: "researcher", keywords: ["for researchers", "academic researchers"] },
  { id: "writer", keywords: ["for writers", "content writers"] },
  { id: "data-scientist", keywords: ["data scientists", "machine learning engineers"] },
  { id: "product-manager", keywords: ["product managers"] },
  { id: "student", keywords: ["for students"] },
  { id: "entrepreneur", keywords: ["for founders", "entrepreneurs"] },
  { id: "video-creator", keywords: ["video creators", "for youtubers"] },
  { id: "educator", keywords: ["for teachers", "for educators"] },
  { id: "analyst", keywords: ["business analysts"] },
  { id: "sales-professional", keywords: ["sales teams", "account executives"] },
  { id: "support-agent", keywords: ["support agents", "support reps"] },
  { id: "recruiter", keywords: ["for recruiters", "talent acquisition"] },
  { id: "legal-professional", keywords: ["for lawyers", "in-house counsel"] },
  { id: "finance-professional", keywords: ["for accountants", "finance teams"] },
  { id: "operations-manager", keywords: ["operations teams"] },
  { id: "security-engineer", keywords: ["security engineers"] },
  { id: "musician", keywords: ["for musicians", "music producers"] },
  { id: "photographer", keywords: ["for photographers"] },
];

export const PLATFORM_RULES: readonly VocabRule[] = [
  { id: "web", keywords: ["web app", "web application", "in the browser", "browser-based"] },
  { id: "desktop", keywords: ["desktop app", "for mac and windows"] },
  { id: "mobile", keywords: ["mobile app", "ios app", "android app"] },
  { id: "ide", keywords: ["ide plugin", "vs code extension"] },
  { id: "cli", keywords: ["command-line", "command line", "cli tool"] },
  { id: "api", keywords: ["rest api", "api access"] },
  { id: "browser-extension", keywords: ["browser extension", "chrome extension"] },
  { id: "self-hosted", keywords: ["self-hosted", "self hosted"] },
];

export const PRICING_MODEL_IDS = ["free", "freemium", "paid", "enterprise", "open_source"] as const;

const PRICE_RE =
  /\$\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:month|mo|year|yr|user)|\s+per\s+(?:month|year|user))?/i;

export function findPhrase(text: string, phrase: string): string | null {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, "i").exec(text);
  return match?.[0] ?? null;
}

export function matchSingle(text: string, rules: readonly VocabRule[], label: string): MatchOne {
  const scores = new Map<string, { score: number; quote: string }>();
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      const quote = findPhrase(text, keyword);
      if (!quote) continue;
      const current = scores.get(rule.id);
      if (!current) scores.set(rule.id, { score: 1, quote });
      else current.score += 1;
    }
  }

  let bestScore = 0;
  const leaders: { id: string; quote: string }[] = [];
  for (const [id, hit] of scores) {
    if (hit.score > bestScore) {
      bestScore = hit.score;
      leaders.length = 0;
      leaders.push({ id, quote: hit.quote });
    } else if (hit.score === bestScore) {
      leaders.push({ id, quote: hit.quote });
    }
  }

  if (leaders.length === 0) return { ok: false, reason: `no ${label} match` };
  if (leaders.length > 1) {
    const ids = leaders.map((leader) => leader.id).sort();
    return { ok: false, reason: `ambiguous ${label}: ${ids.join(", ")}` };
  }
  const winner = leaders[0];
  if (!winner) return { ok: false, reason: `no ${label} match` };
  return { ok: true, id: winner.id, quote: winner.quote };
}

export function matchMany(text: string, rules: readonly VocabRule[], label: string): MatchMany {
  const hits: { id: string; quote: string }[] = [];
  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      const quote = findPhrase(text, keyword);
      if (!quote) continue;
      hits.push({ id: rule.id, quote });
      break;
    }
  }
  if (hits.length === 0) return { ok: false, reason: `no ${label} match` };
  return { ok: true, hits };
}

export function matchPricingModel(text: string): MatchOne {
  const freeTier = firstPhrase(text, ["free tier", "free plan", "freemium"]);
  const freeOnly = firstPhrase(text, ["free forever", "completely free", "100% free"]);
  const openSource = firstPhrase(text, ["open source", "open-source", "mit license", "apache license"]);
  const enterprise = firstPhrase(text, ["contact sales", "enterprise pricing", "custom pricing"]);
  const priceQuote = PRICE_RE.exec(text)?.[0] ?? null;

  if ((freeTier || freeOnly) && priceQuote && !openSource && !enterprise) {
    return { ok: true, id: "freemium", quote: freeTier ?? freeOnly ?? priceQuote };
  }

  const hits: { id: string; quote: string }[] = [];
  if (freeTier) hits.push({ id: "freemium", quote: freeTier });
  else if (freeOnly) hits.push({ id: "free", quote: freeOnly });
  if (openSource) hits.push({ id: "open_source", quote: openSource });
  if (enterprise) hits.push({ id: "enterprise", quote: enterprise });
  if (priceQuote && !freeTier && !freeOnly) hits.push({ id: "paid", quote: priceQuote });

  const ids = [...new Set(hits.map((hit) => hit.id))].sort();
  const first = hits[0];
  if (ids.length === 1 && first) return { ok: true, id: first.id, quote: first.quote };
  if (ids.length === 0) return { ok: false, reason: "no pricing model match" };
  return { ok: false, reason: `ambiguous pricing model: ${ids.join(", ")}` };
}

function firstPhrase(text: string, phrases: readonly string[]): string | null {
  for (const phrase of phrases) {
    const found = findPhrase(text, phrase);
    if (found) return found;
  }
  return null;
}
