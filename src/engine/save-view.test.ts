import { describe, expect, it } from "vitest";
import { beginSave, initialSaveView, receiveSaveReply, type SaveReply, type SaveViewState } from "./save-view";

function send(state: SaveViewState, action: "save" | "unsave", slug: string) {
  return beginSave(state, action, slug);
}

function reply(state: SaveViewState, next: SaveReply) {
  return receiveSaveReply(state, next);
}

describe("save view", () => {
  it("shows the server list after one save and restores the confirmed list after one failure", () => {
    const saved = reply(send(initialSaveView(["claude"]), "save", "cursor"), {
      ok: true,
      version: 1,
      slugs: ["cursor", "claude"],
    });
    expect(saved.view).toEqual(["cursor", "claude"]);
    expect(saved.inflight).toBe(0);

    const failed = reply(send(initialSaveView(["claude", "grok"]), "save", "cursor"), { ok: false });
    expect(failed.view).toEqual(["claude", "grok"]);
    expect(failed.confirmed).toEqual(["claude", "grok"]);
  });

  it("does not restore a stale snapshot when an earlier failure overlaps a later one", () => {
    // F2: cap is full. Two saves of cursor are in flight. Both replies are 400.
    // The second request's snapshot includes the first optimistic save.
    let state = initialSaveView(["claude", "grok"]);
    state = send(state, "save", "cursor");
    state = send(state, "save", "cursor");
    expect(state.view).toEqual(["cursor", "claude", "grok"]);

    state = reply(state, { ok: false });
    expect(state.inflight).toBe(1);
    expect(state.view).toEqual(["cursor", "claude", "grok"]);

    state = reply(state, { ok: false });
    expect(state.view).toEqual(["claude", "grok"]);
    expect(state.confirmed).toEqual(["claude", "grok"]);
  });

  it("keeps the newest server list when an older success arrives last", () => {
    let state = initialSaveView([]);
    state = send(state, "save", "cursor");
    state = send(state, "save", "claude");
    expect(state.view).toEqual(["claude", "cursor"]);

    state = reply(state, { ok: true, version: 2, slugs: ["claude", "cursor"] });
    expect(state.inflight).toBe(1);
    expect(state.view).toEqual(["claude", "cursor"]);

    state = reply(state, { ok: true, version: 1, slugs: ["cursor"] });
    expect(state.view).toEqual(["claude", "cursor"]);
    expect(state.confirmed).toEqual(["claude", "cursor"]);
  });

  it("keeps an older success when a newer request fails and then settles", () => {
    let state = initialSaveView([]);
    state = send(state, "save", "cursor");
    state = send(state, "save", "claude");
    state = reply(state, { ok: false });
    state = reply(state, { ok: true, version: 1, slugs: ["cursor"] });
    expect(state.view).toEqual(["cursor"]);
  });

  it("prefers the higher version no matter which reply arrives first", () => {
    let first = send(send(initialSaveView(["grok"]), "unsave", "grok"), "save", "cursor");
    first = reply(first, { ok: true, version: 1, slugs: [] });
    first = reply(first, { ok: true, version: 2, slugs: ["cursor"] });
    expect(first.view).toEqual(["cursor"]);

    let second = send(send(initialSaveView(["grok"]), "unsave", "grok"), "save", "cursor");
    second = reply(second, { ok: true, version: 2, slugs: ["cursor"] });
    second = reply(second, { ok: true, version: 1, slugs: [] });
    expect(second.view).toEqual(["cursor"]);
  });
});
