import type { SavedChange } from "@/engine/saved";
import type { SavedStore } from "@/engine/agent";

type SavedBridge = {
  list: () => Promise<{ slugs: string[] } | { error: string }>;
  change: (action: SavedChange, slug: string) => Promise<{ slugs: string[] } | { error: string }>;
};

let current: SavedBridge | null = null;

export function setSavedBridge(bridge: SavedBridge | null) {
  current = bridge;
}

export const browserSavedStore: SavedStore = {
  list: () => current?.list() ?? Promise.resolve({ error: "Sign in to save." }),
  change: (action, slug) => current?.change(action, slug) ?? Promise.resolve({ error: "Sign in to save." }),
};
