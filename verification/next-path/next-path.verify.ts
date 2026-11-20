// Bounded exhaustive check of safeNextPath (src/auth/next-path.ts).
// Property: whatever `next` the sign-in URL carries, router.replace(nextPath)
// in src/auth/email-code.tsx stays on this site. The oracle is the WHATWG URL
// parser, which is how the browser and the Next router resolve the href.
import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/auth/next-path";

const ORIGIN = "https://box.example";
const BASES = [`${ORIGIN}/sign-in?next=x`, `${ORIGIN}/tools/cursor`];

// Pieces that matter to URL parsing and to the decode loop in pathForms.
const TOKENS = [
  "/",
  "\\",
  "%2F",
  "%5C",
  "%252F",
  "%25",
  ":",
  "@",
  ".",
  "a",
  " ",
  "\t",
  "%09",
  "?",
  "#",
  "　",
];
const MAX_TOKENS = 5;

function* inputs(): Generator<string> {
  let layer = [""];
  yield "";
  for (let n = 1; n <= MAX_TOKENS; n += 1) {
    const next: string[] = [];
    for (const prefix of layer) {
      for (const token of TOKENS) {
        const value = prefix + token;
        next.push(value);
        yield value;
      }
    }
    layer = next;
  }
}

describe("safeNextPath never leaves the origin", () => {
  it(`for every string of up to ${MAX_TOKENS} tokens from ${TOKENS.length}`, () => {
    let count = 0;
    let kept = 0;
    for (const input of inputs()) {
      count += 1;
      const out = safeNextPath(input);
      if (out !== "/box") {
        kept += 1;
        if (out !== input.trim()) throw new Error(`rewrote next=${JSON.stringify(input)} to ${JSON.stringify(out)}`);
      }
      for (const base of BASES) {
        let url: URL;
        try {
          url = new URL(out, base);
        } catch {
          // e.g. "//" parses as an empty host: never a path on this site.
          throw new Error(`not a same-origin path: next=${JSON.stringify(input)} -> ${JSON.stringify(out)}`);
        }
        if (url.origin !== ORIGIN) {
          throw new Error(`off-origin redirect: next=${JSON.stringify(input)} -> ${JSON.stringify(out)} -> ${url.href}`);
        }
      }
    }
    expect(count).toBeGreaterThan(1_000_000);
    expect(kept).toBeGreaterThan(1000);
  });
});
