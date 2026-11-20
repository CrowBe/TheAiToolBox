// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BoxConfig } from "@/engine/types";
import { SavedSession, useSavedSession } from "./session";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const box: BoxConfig = {
  id: "fixture",
  site: { name: "Fixture", shortName: "Fixture", tagline: "Tag", description: "Desc" },
  item: { noun: { one: "tool", other: "tools" }, idField: "id", slugField: "slug", sortField: "name", path: "/tools" },
  search: { fields: ["name"], placeholder: "Search" },
  labels: [],
  card: { titleField: "name", subtitleField: "summary" },
  detail: { titleField: "name", subtitleField: "summary", bodyField: "summary", linkField: "url", linkLabel: "Open", meta: [] },
  collections: [],
  library: { path: "/box", label: "My box" },
  vocabularies: {},
};

type Pending = {
  action: string;
  slug: string;
  resolve: (response: Response) => void;
};

const posts: Pending[] = [];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function installDomStubs() {
  const proto = HTMLElement.prototype as HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
    togglePopover?: () => boolean;
  };
  proto.showPopover ??= () => {};
  proto.hidePopover ??= () => {};
  proto.togglePopover ??= () => true;
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

function Probe() {
  const session = useSavedSession();
  return (
    <div>
      <span data-testid="slugs">{session.slugs.join(",")}</span>
      <button type="button" onClick={() => void session.change("save", "cursor")}>
        save cursor
      </button>
      <button type="button" onClick={() => void session.change("save", "claude")}>
        save claude
      </button>
    </div>
  );
}

describe("SavedSession change", () => {
  beforeEach(() => {
    installDomStubs();
    posts.length = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (method !== "POST") return jsonResponse({ slugs: [] });
        const body = JSON.parse(String(init?.body)) as { action: string; slug: string };
        return new Promise<Response>((resolve) => {
          posts.push({ action: body.action, slug: body.slug, resolve });
        });
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("settles on the newest server list when an older success arrives last", async () => {
    render(
      <SavedSession box={box} items={[]} auth="signed-in" signInPath="/sign-in">
        <Probe />
      </SavedSession>,
    );
    await waitFor(() => expect(screen.getByTestId("slugs").textContent).toBe(""));

    await act(async () => {
      screen.getByRole("button", { name: "save cursor" }).click();
      screen.getByRole("button", { name: "save claude" }).click();
    });
    expect(screen.getByTestId("slugs").textContent).toBe("claude,cursor");
    expect(posts.map((post) => post.slug)).toEqual(["cursor", "claude"]);

    await act(async () => {
      posts[1]?.resolve(jsonResponse({ slugs: ["claude", "cursor"], version: 2 }));
    });
    expect(screen.getByTestId("slugs").textContent).toBe("claude,cursor");

    await act(async () => {
      posts[0]?.resolve(jsonResponse({ slugs: ["cursor"], version: 1 }));
    });
    expect(screen.getByTestId("slugs").textContent).toBe("claude,cursor");
  });

  it("returns to the loaded list when overlapping saves both fail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (method !== "POST") return jsonResponse({ slugs: ["claude", "grok"] });
        const body = JSON.parse(String(init?.body)) as { action: string; slug: string };
        return new Promise<Response>((resolve) => {
          posts.push({ action: body.action, slug: body.slug, resolve });
        });
      }),
    );
    render(
      <SavedSession box={box} items={[]} auth="signed-in" signInPath="/sign-in">
        <Probe />
      </SavedSession>,
    );
    await waitFor(() => expect(screen.getByTestId("slugs").textContent).toBe("claude,grok"));

    await act(async () => {
      screen.getByRole("button", { name: "save cursor" }).click();
      screen.getByRole("button", { name: "save cursor" }).click();
    });
    expect(screen.getByTestId("slugs").textContent).toBe("cursor,claude,grok");

    await act(async () => {
      posts[0]?.resolve(jsonResponse({ error: "You can save up to 500 tools." }, 400));
    });
    expect(screen.getByTestId("slugs").textContent).toBe("cursor,claude,grok");

    await act(async () => {
      posts[1]?.resolve(jsonResponse({ error: "You can save up to 500 tools." }, 400));
    });
    expect(screen.getByTestId("slugs").textContent).toBe("claude,grok");
  });
});
