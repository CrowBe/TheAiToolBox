// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAgent } from "@ui-sdk/react/agent";
import type { BoxConfig } from "@/engine/types";
import { CatalogBrowser } from "./browser";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

const box: BoxConfig = {
  id: "fixture",
  site: {
    name: "Fixture Box",
    shortName: "Fixture",
    tagline: "A fixture catalog.",
    description: "Used by interface tests.",
  },
  item: {
    noun: { one: "item", other: "items" },
    idField: "id",
    slugField: "slug",
    sortField: "name",
    path: "/items",
  },
  search: { fields: ["name", "summary", "tags"], placeholder: "Search items" },
  labels: [
    {
      field: "kind",
      label: "Kind",
      type: "string",
      control: "combobox",
      vocabulary: "kinds",
      param: "kind",
    },
    { field: "tags", label: "Tags", type: "string-list", control: "combobox", param: "tag" },
  ],
  card: { titleField: "name", subtitleField: "summary" },
  detail: {
    titleField: "name",
    subtitleField: "summary",
    bodyField: "summary",
    linkField: "url",
    linkLabel: "Open",
    meta: [],
  },
  collections: [],
  library: { path: "/box", label: "My box" },
  vocabularies: {
    kinds: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta" },
    ],
  },
};

const items = [
  {
    id: "one",
    slug: "one",
    name: "Alpha One",
    summary: "Paints wagons",
    tags: ["paint", "pair-programming"],
    kind: "alpha",
    url: "https://one.example",
  },
  {
    id: "two",
    slug: "two",
    name: "Beta Two",
    summary: "Ships crates",
    tags: ["ship"],
    kind: "beta",
    url: "https://two.example",
  },
  {
    id: "three",
    slug: "three",
    name: "Alpha Three",
    summary: "Paints ships",
    tags: ["paint"],
    kind: "alpha",
    url: "https://three.example",
  },
];

function installDomStubs() {
  const proto = HTMLElement.prototype as HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
    togglePopover?: () => boolean;
  };
  proto.showPopover ??= () => {};
  proto.hidePopover ??= () => {};
  proto.togglePopover ??= () => true;
  if (!("Popover" in globalThis)) {
    Object.defineProperty(HTMLElement.prototype, "popover", { value: "", writable: true });
  }
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  Element.prototype.scrollIntoView = () => {};
  Element.prototype.getAnimations = () => [];
  if (!globalThis.PointerEvent) {
    globalThis.PointerEvent = MouseEvent as typeof PointerEvent;
  }
}

describe("catalog browser", () => {
  beforeEach(() => {
    installDomStubs();
    (globalThis as { __UI_SDK_STRICT__?: boolean }).__UI_SDK_STRICT__ = true;
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("lets an agent search and filter the catalog", async () => {
    const agent = createAgent();
    render(<CatalogBrowser box={box} items={items} />);

    const snapshot = agent.snapshot();
    const labels = snapshot.map((component) => component.label);
    expect(labels).toContain("Search");
    const search = snapshot.find((component) => component.label === "Search");
    expect(search).toMatchObject({ component: "command" });
    expect(labels).toContain("Kind");
    expect(labels).toContain("Tags");

    const searched = await agent.act({
      steps: [{ ref: "Search", action: "setQuery", args: ["pair programming"] }],
    });
    expect(searched.ok, searched.error?.message).toBe(true);
    expect(document.body.textContent).toContain("1 item");
    expect(document.body.textContent).toContain("Alpha One");
    expect(document.body.textContent).not.toContain("Beta Two");
    expect(window.location.search).toContain("q=pair+programming");

    const cleared = await agent.act({
      steps: [{ ref: "Search", action: "setQuery", args: [""] }],
    });
    expect(cleared.ok, cleared.error?.message).toBe(true);
    expect(document.body.textContent).toContain("3 items");

    const filtered = await agent.act({
      steps: [{ ref: "Kind", action: "setValue", args: ["Alpha"] }],
    });
    expect(filtered.ok, filtered.error?.message).toBe(true);
    const kind = agent.snapshot().find((component) => component.label === "Kind");
    expect(kind && "value" in kind ? kind.value : undefined).toEqual(["alpha"]);
    expect(document.body.textContent).toContain("2 items");
    expect(window.location.search).toContain("kind=alpha");
  });
});
