// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { ItemCard } from "./card";
import { DetailView } from "./detail";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

const sample = loadItems()[0];

describe("discontinued tools", () => {
  afterEach(() => cleanup());

  it("renders a Discontinued badge on the card and the detail page", () => {
    expect(sample).toBeDefined();
    if (!sample) return;
    const discontinued = { ...sample, status: "discontinued" as const };
    const card = render(
      <ul>
        <ItemCard box={box} item={discontinued} />
      </ul>,
    );
    expect(screen.getByText("Discontinued")).toBeTruthy();
    expect(screen.getByText(sample.name)).toBeTruthy();
    card.unmount();

    render(<DetailView box={box} item={discontinued} />);
    expect(screen.getByRole("heading", { name: sample.name })).toBeTruthy();
    expect(screen.getByText("Discontinued")).toBeTruthy();
  });

  it("leaves an active tool without that badge", () => {
    expect(sample).toBeDefined();
    if (!sample) return;
    render(<DetailView box={box} item={sample} />);
    expect(screen.getByRole("heading", { name: sample.name })).toBeTruthy();
    expect(screen.queryByText("Discontinued")).toBeNull();
  });
});
