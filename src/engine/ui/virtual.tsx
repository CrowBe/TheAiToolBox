"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createVirtualizer, type VirtualItem } from "@ui-sdk/core";

export function useVirtualRows(
  keys: readonly string[],
  estimate: number,
  labelAt: (index: number) => string,
) {
  // createVirtualizer is an external store. useSyncExternalStore is how React
  // reads it, so the store is created once and subscribed during render.
  /* eslint-disable react-hooks/refs */
  const keysRef = useRef(keys);
  const labelRef = useRef(labelAt);
  keysRef.current = keys;
  labelRef.current = labelAt;
  const virtualRef = useRef<ReturnType<typeof createVirtualizer> | null>(null);
  if (virtualRef.current === null) {
    virtualRef.current = createVirtualizer({
      count: () => keysRef.current.length,
      estimate: () => estimate,
      overscan: 6,
      key: (index) => keysRef.current[index] ?? String(index),
      findable: (index) => labelRef.current(index),
    });
  }
  const virtual = virtualRef.current;
  const rows = useSyncExternalStore(virtual.subscribe, virtual.items, virtual.items);
  const size = virtual.size();
  const measure = virtual.measure.bind(virtual);
  const scrollToIndex = (index: number) => {
    virtual.scrollToIndex(index, { align: "auto" });
  };
  /* eslint-enable react-hooks/refs */
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const signature = `${keys.join("\u0000")}\u0001${keys.length}`;

  useEffect(() => {
    if (!scroller) return undefined;
    return virtual.connect(scroller, { findable: true });
    // The store is created once for this hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroller]);

  useEffect(() => {
    virtual.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return { rows, size, setScroller, measure, scrollToIndex };
}

export function listValues(data: readonly unknown[]): { value: string; label: string }[] {
  const result: { value: string; label: string }[] = [];
  for (const entry of data) {
    if (!entry || typeof entry !== "object" || "type" in entry || !("value" in entry)) continue;
    const value = entry.value;
    if (typeof value !== "string") continue;
    const label = "label" in entry && typeof entry.label === "string" ? entry.label : value;
    result.push({ value, label });
  }
  return result;
}

export function VirtualSpacer({
  rows,
  size,
  estimate,
  count,
  setScroller,
  maxHeight,
  renderRow,
}: {
  rows: readonly VirtualItem[];
  size: number;
  estimate: number;
  count: number;
  setScroller: (node: HTMLDivElement | null) => void;
  maxHeight: string;
  renderRow: (row: VirtualItem) => ReactNode;
}) {
  if (count === 0) return null;
  const total = Math.max(size, count * estimate);
  return (
    <div
      ref={setScroller}
      className="overflow-auto overscroll-contain"
      style={{ height: `min(${maxHeight}, ${total}px)` }}
    >
      <div className="relative w-full" style={{ height: total }}>
        {rows.map((row) => renderRow(row))}
      </div>
    </div>
  );
}
