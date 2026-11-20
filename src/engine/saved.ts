import { z } from "zod";

export const SAVED_LIMIT = 500;

const boxIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugPattern = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
const forbiddenKeys = new Set(["__proto__", "constructor", "prototype"]);

export type SavedBox = {
  id: string;
  noun: { one: string; other: string };
};

export type SavedChange = "save" | "unsave";

export type SavedRecord = {
  metadata: Record<string, unknown>;
  slugs: string[];
};

export type SavedFailure = { error: string };

const saveBodySchema = z.object({
  action: z.enum(["save", "unsave"]),
  slug: z.string(),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function copyRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return {};
  const copy: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) continue;
    copy[key] = entry;
  }
  return copy;
}

export function normalizeSlug(value: unknown): { slug: string } | SavedFailure {
  if (typeof value !== "string") return { error: "Pass a slug." };
  const slug = value.trim();
  if (!slugPattern.test(slug)) return { error: "Pass a slug." };
  return { slug };
}

export function readSaveBody(input: unknown): { action: SavedChange; slug: string } | SavedFailure {
  if (!isRecord(input)) return { error: "Input must be an object." };
  const parsed = saveBodySchema.safeParse(input);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    if (field === "action") return { error: "Pass save or unsave." };
    return { error: "Pass a slug." };
  }
  const slug = normalizeSlug(parsed.data.slug);
  if ("error" in slug) return slug;
  return { action: parsed.data.action, slug: slug.slug };
}

function cleanSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const slug = entry.trim();
    if (!slugPattern.test(slug) || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

export function readSavedSlugs(metadata: unknown, boxId: string): string[] {
  if (!boxIdPattern.test(boxId) || !isRecord(metadata) || !isRecord(metadata.saved)) return [];
  return cleanSlugs(metadata.saved[boxId]);
}

/** Monotonic write counter stored beside `saved`. Missing or junk counts as 0. */
export function readSavedVersion(metadata: unknown): number {
  if (!isRecord(metadata)) return 0;
  const value = metadata.savedVersion;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return 0;
  return value;
}

function savedObject(metadata: unknown): Record<string, unknown> {
  if (!isRecord(metadata) || !isRecord(metadata.saved)) return {};
  return copyRecord(metadata.saved);
}

export function applySavedChange(
  metadata: unknown,
  box: SavedBox,
  slug: string,
  action: SavedChange,
  known: ReadonlySet<string>,
): SavedRecord | SavedFailure {
  if (!boxIdPattern.test(box.id)) return { error: "Unknown box." };
  const parsed = normalizeSlug(slug);
  if ("error" in parsed) return parsed;
  const clean = parsed.slug;
  const base = copyRecord(metadata);
  const saved = savedObject(metadata);
  const current = cleanSlugs(saved[box.id]);

  if (action === "unsave") {
    return commit(base, saved, box.id, current.filter((entry) => entry !== clean));
  }

  if (!known.has(clean)) return { error: `No ${box.noun.one} found for slug "${clean}".` };
  if (current.includes(clean)) return commit(base, saved, box.id, current);
  if (current.length >= SAVED_LIMIT) {
    return { error: `You can save up to ${SAVED_LIMIT} ${box.noun.other}.` };
  }
  return commit(base, saved, box.id, [clean, ...current]);
}

function commit(
  base: Record<string, unknown>,
  saved: Record<string, unknown>,
  boxId: string,
  slugs: string[],
): SavedRecord {
  return {
    metadata: {
      ...base,
      saved: {
        ...saved,
        [boxId]: slugs,
      },
    },
    slugs,
  };
}
