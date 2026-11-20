import { describe, expect, it } from "vitest";
import { safeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("keeps a same-site path and rejects an open redirect", () => {
    expect(safeNextPath("/tools/cursor")).toBe("/tools/cursor");
    expect(safeNextPath("/box?x=1")).toBe("/box?x=1");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil")).toBe("/");
    expect(safeNextPath(null, "/box")).toBe("/box");
  });
});
