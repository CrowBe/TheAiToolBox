// Ties the TLA+ step to the real code: for every input in the bounds below,
// applySavedChange (src/engine/saved.ts) does what `Apply` in SavedTools.tla
// says, at the real SAVED_LIMIT.
import { describe, expect, it } from "vitest";
import { SAVED_LIMIT, applySavedChange, readSavedSlugs } from "@/engine/saved";

const box = { id: "aitoolbox", noun: { one: "tool", other: "tools" } };
const slugs = ["cursor", "claude", "grok"] as const;
const actions = ["save", "unsave"] as const;

// `Apply` in SavedTools.tla, line for line.
function modelApply(cur: string[], action: "save" | "unsave", s: string): { ok: boolean; slugs: string[] } {
  if (action === "unsave") return { ok: true, slugs: cur.filter((entry) => entry !== s) };
  if (cur.includes(s)) return { ok: true, slugs: cur };
  if (cur.length >= SAVED_LIMIT) return { ok: false, slugs: [] };
  return { ok: true, slugs: [s, ...cur] };
}

function dupFreeLists(alphabet: readonly string[], maxLength: number): string[][] {
  const out: string[][] = [[]];
  const grow = (prefix: string[]) => {
    if (prefix.length === maxLength) return;
    for (const s of alphabet) {
      if (prefix.includes(s)) continue;
      const next = [...prefix, s];
      out.push(next);
      grow(next);
    }
  };
  grow([]);
  return out;
}

const filler = (n: number) => Array.from({ length: n }, (_, i) => `filler-${i}`);

// Small lists, and the same small lists pushed up against the cap.
function storedLists(): string[][] {
  const small = dupFreeLists(slugs, slugs.length);
  const lists: string[][] = [...small];
  for (const list of small) {
    for (const total of [SAVED_LIMIT - 2, SAVED_LIMIT - 1, SAVED_LIMIT]) {
      const pad = total - list.length;
      if (pad < 0) continue;
      lists.push([...list, ...filler(pad)]);
      lists.push([...filler(pad), ...list]);
    }
  }
  return lists;
}

const known = new Set<string>([...slugs, ...filler(SAVED_LIMIT)]);

describe("applySavedChange matches Apply in SavedTools.tla", () => {
  it("for every stored list, action, and slug in bounds", () => {
    let cases = 0;
    for (const stored of storedLists()) {
      const metadata = { theme: "dark", saved: { hardware: ["lathe"], aitoolbox: stored } };
      for (const action of actions) {
        for (const slug of slugs) {
          cases += 1;
          const real = applySavedChange(metadata, box, slug, action, known);
          const model = modelApply(stored, action, slug);
          const label = `${action} ${slug} on [${stored.length}] ${stored.slice(0, 4).join(",")}`;
          if (!model.ok) {
            expect("error" in real, label).toBe(true);
            continue;
          }
          expect("error" in real, label).toBe(false);
          if ("error" in real) continue;
          expect(real.slugs, label).toEqual(model.slugs);
          // Only privateMetadata.saved.aitoolbox changes (the model has no other keys).
          expect(real.metadata, label).toEqual({
            theme: "dark",
            saved: { hardware: ["lathe"], aitoolbox: model.slugs },
          });
          expect(readSavedSlugs(real.metadata, box.id), label).toEqual(model.slugs);
        }
      }
    }
    expect(cases).toBeGreaterThan(600);
  });

  it("writes a duplicate-free list within the cap even from a messy stored value", () => {
    // The model starts from clean lists. Clerk may hold anything, so the
    // first write must already be clean.
    const messy: unknown[] = [
      ["cursor", "cursor", " claude ", 7, null, "Bad Slug", "grok"],
      "cursor",
      { cursor: true },
      [...filler(SAVED_LIMIT - 1), "filler-0", "cursor"],
    ];
    for (const value of messy) {
      for (const action of actions) {
        for (const slug of slugs) {
          const real = applySavedChange({ saved: { aitoolbox: value } }, box, slug, action, known);
          if ("error" in real) continue;
          expect(new Set(real.slugs).size).toBe(real.slugs.length);
          expect(real.slugs.length).toBeLessThanOrEqual(SAVED_LIMIT);
        }
      }
    }
  });
});
