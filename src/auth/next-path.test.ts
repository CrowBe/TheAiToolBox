import { describe, expect, it } from "vitest";
import { safeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("keeps a same-site path and rejects an open redirect", () => {
    expect(safeNextPath("/tools/cursor")).toBe("/tools/cursor");
    expect(safeNextPath("/box?x=1")).toBe("/box?x=1");
    expect(safeNextPath("https://evil.example")).toBe("/box");
    expect(safeNextPath("//evil.example")).toBe("/box");
    expect(safeNextPath("/\\evil")).toBe("/box");
    expect(safeNextPath("/%2f%2fevil.example")).toBe("/box");
    expect(safeNextPath("/%252F%252Fevil.example")).toBe("/box");
    expect(safeNextPath(null, "/box")).toBe("/box");
    expect(safeNextPath(null)).toBe("/box");
  });
});
