"use client";

import { useEffect } from "react";
import { registerCatalogTools } from "@/engine/agent";
import type { BoxConfig } from "@/engine/types";

export function CatalogTools({ box, items }: { box: BoxConfig; items: readonly object[] }) {
  useEffect(() => {
    const controller = new AbortController();
    registerCatalogTools(document, box, items, controller.signal);
    return () => controller.abort();
  }, [box, items]);
  return null;
}
