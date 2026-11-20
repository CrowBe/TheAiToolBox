// Replays TLC traces against the real POST handler in
// src/app/api/saved/route.ts with Clerk faked in memory. Each Clerk call
// waits until the test releases it, so the test picks the interleaving.
import { beforeEach, describe, expect, it, vi } from "vitest";

type Call = { kind: "getUser" | "replaceUserMetadata"; release: () => void };

const clerk = vi.hoisted(() => {
  const state = {
    privateMetadata: {} as Record<string, unknown>,
    calls: [] as Call[],
  };
  const gate = (kind: Call["kind"]) =>
    new Promise<void>((resolve) => {
      state.calls.push({ kind, release: resolve });
    });
  const client = {
    users: {
      async getUser(userId: string) {
        await gate("getUser");
        return { id: userId, privateMetadata: structuredClone(state.privateMetadata) };
      },
      async replaceUserMetadata(_userId: string, params: { privateMetadata: Record<string, unknown> }) {
        await gate("replaceUserMetadata");
        // Clerk replaces privateMetadata whole.
        state.privateMetadata = structuredClone(params.privateMetadata);
        return {};
      },
    },
  };
  return { state, client };
});

vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: "user_test" }),
  clerkClient: async () => clerk.client,
}));
vi.mock("@/auth/config", () => ({ clerkEnabled: () => true, clerkServerEnabled: () => true }));

const { POST } = await import("@/app/api/saved/route");

const settle = async () => {
  for (let i = 0; i < 20; i += 1) await new Promise((resolve) => setImmediate(resolve));
};

function post(action: "save" | "unsave", slug: string) {
  return POST(
    new Request("http://localhost/api/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, slug }),
    }),
  );
}

// Start a request and run it until it waits on its next Clerk call.
// Returns a holder: returning the promise itself would make start() wait on it.
async function start(action: "save" | "unsave", slug: string) {
  const response = post(action, slug);
  await settle();
  return { response };
}

// Release the oldest waiting Clerk call of this kind.
async function step(kind: Call["kind"]) {
  const index = clerk.state.calls.findIndex((call) => call.kind === kind);
  expect(index, `a request is waiting on ${kind}`).toBeGreaterThanOrEqual(0);
  const [call] = clerk.state.calls.splice(index, 1);
  call.release();
  await settle();
}

const stored = () => (clerk.state.privateMetadata.saved as Record<string, unknown> | undefined)?.aitoolbox;

beforeEach(() => {
  clerk.state.privateMetadata = { theme: "dark", saved: { hardware: ["lathe"] } };
  clerk.state.calls = [];
});

describe("POST /api/saved, real handler", () => {
  it("is one getUser then one replaceUserMetadata per save (Read, Write in the model)", async () => {
    const a = await start("save", "cursor");
    expect(clerk.state.calls.map((call) => call.kind)).toEqual(["getUser"]);
    await step("getUser");
    expect(clerk.state.calls.map((call) => call.kind)).toEqual(["replaceUserMetadata"]);
    await step("replaceUserMetadata");
    expect(clerk.state.calls).toEqual([]);
    expect(await (await a.response).json()).toEqual({ slugs: ["cursor"] });
    expect(clerk.state.privateMetadata).toEqual({
      theme: "dark",
      saved: { hardware: ["lathe"], aitoolbox: ["cursor"] },
    });
  });

  it("keeps both saves when the requests do not overlap", async () => {
    const a = await start("save", "cursor");
    await step("getUser");
    await step("replaceUserMetadata");
    const b = await start("save", "claude");
    await step("getUser");
    await step("replaceUserMetadata");
    expect((await (await a.response).json()).slugs).toEqual(["cursor"]);
    expect((await (await b.response).json()).slugs).toEqual(["claude", "cursor"]);
    expect(stored()).toEqual(["claude", "cursor"]);
  });

  // Finding F1 (SavedTools.tla, SavedChangesPersist). This test passes while
  // the bug is present. When it fails, the race is fixed: update the skill.
  it("F1 reproduces: two overlapping saves both answer 200 and one is lost", async () => {
    const a = await start("save", "cursor");
    const b = await start("save", "claude");
    await step("getUser"); // A reads []
    await step("getUser"); // B reads []
    await step("replaceUserMetadata"); // A writes [cursor]
    await step("replaceUserMetadata"); // B writes [claude] over it
    const ra = await a.response;
    const rb = await b.response;
    expect([ra.status, rb.status]).toEqual([200, 200]);
    expect((await ra.json()).slugs).toEqual(["cursor"]);
    expect((await rb.json()).slugs).toEqual(["claude"]);
    expect(stored()).toEqual(["claude"]);
  });
});
