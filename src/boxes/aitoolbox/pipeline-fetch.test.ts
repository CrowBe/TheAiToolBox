import { describe, expect, it } from "vitest";
import { fetchPage, type HostLookup } from "./pipeline-fetch";

const lookup: HostLookup = async () => {
  throw new Error("dns lookup should not run for an address literal");
};

function refusingFetch(): typeof fetch {
  return async () => {
    throw new Error("fetch should not run for a blocked address");
  };
}

describe("fetch address guard", () => {
  it.each([
    "https://127.0.0.1/secret",
    "https://127.1/secret",
    "https://10.0.0.1/secret",
    "https://169.254.169.254/latest",
    "https://192.168.1.1/",
    "https://172.16.0.1/",
    "https://100.64.0.1/",
    "https://0.0.0.0/",
    "https://224.0.0.1/",
    "https://[::1]/",
    "https://[fc00::1]/",
    "https://[fe80::1]/",
    "https://[::ffff:127.0.0.1]/",
    "https://[::ffff:10.0.0.1]/",
    "https://[::ffff:169.254.169.254]/",
  ])("refuses %s before connecting", async (url) => {
    const result = await fetchPage(url, { fetchImpl: refusingFetch(), lookupImpl: lookup });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("refused");
      expect(result.message.startsWith("refused")).toBe(true);
    }
  });

  it("refuses when any resolved address is private, including an IPv4-mapped one", async () => {
    const calls: string[] = [];
    const result = await fetchPage("https://rebind.example/app", {
      fetchImpl: async (input) => {
        calls.push(String(input));
        return new Response("nope");
      },
      lookupImpl: async () => ["2001:db8::1", "::ffff:10.0.0.1"],
    });
    expect(calls).toEqual([]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("refused");
  });
});
