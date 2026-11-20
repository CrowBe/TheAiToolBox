import { describe, expect, it } from "vitest";
import { withUserLock } from "./user-lock";

describe("withUserLock", () => {
  it("runs one user's tasks one at a time, in call order", async () => {
    const order: string[] = [];
    let releaseFirst: () => void = () => undefined;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const first = withUserLock("user-a", async () => {
      await firstGate;
      order.push("first");
    });
    const second = withUserLock("user-a", async () => {
      order.push("second");
    });

    await Promise.resolve();
    expect(order).toEqual([]);
    releaseFirst();
    await first;
    await second;
    expect(order).toEqual(["first", "second"]);
  });

  it("does not make different users wait for each other", async () => {
    let releaseFirst: () => void = () => undefined;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const first = withUserLock("user-a", () => firstGate);
    let ran = false;
    const second = withUserLock("user-b", async () => {
      ran = true;
    });
    await second;
    expect(ran).toBe(true);
    releaseFirst();
    await first;
  });

  it("continues the queue after a task throws", async () => {
    const first = withUserLock("user-c", async () => {
      throw new Error("nope");
    });
    const second = withUserLock("user-c", async () => "ok");
    await expect(first).rejects.toThrow("nope");
    await expect(second).resolves.toBe("ok");
  });
});
