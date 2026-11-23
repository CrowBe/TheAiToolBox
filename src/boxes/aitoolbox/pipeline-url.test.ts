import { describe, expect, it } from "vitest";
import { registrableHost, sameSite } from "./pipeline-url";

describe("registrable site", () => {
  it("uses the public suffix list, including private domains", () => {
    expect(registrableHost("alpha.github.io")).toBe("alpha.github.io");
    expect(registrableHost("beta.github.io")).toBe("beta.github.io");
    expect(sameSite("https://alpha.github.io/app", "https://beta.github.io/")).toBe(false);
    expect(sameSite("https://a.co.uk/app", "https://b.co.uk/")).toBe(false);
    expect(sameSite("https://www.a.co.uk/docs", "https://a.co.uk/")).toBe(true);
    expect(sameSite("https://www.northstar.example/", "https://docs.northstar.example/guide")).toBe(true);
    expect(sameSite("https://github.io/", "https://github.io/")).toBe(false);
  });
});
