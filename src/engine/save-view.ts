import type { SavedChange } from "@/engine/saved";

export type SaveReply = { ok: true; version: number; slugs: readonly string[] } | { ok: false };

export type SaveViewState = {
  /** Slugs the Save buttons show. */
  view: string[];
  /** Last list that matched the server, before the current batch of replies. */
  confirmed: string[];
  /** POSTs whose replies have not been applied yet. */
  inflight: number;
  /** Newest successful reply in this batch. */
  best: { version: number; slugs: string[] } | null;
};

export function initialSaveView(slugs: readonly string[]): SaveViewState {
  const view = [...slugs];
  return { view, confirmed: [...view], inflight: 0, best: null };
}

/** The optimistic list SavedSession shows before the reply. The server is unchanged. */
export function optimisticSlugs(current: readonly string[], action: SavedChange, slug: string): string[] {
  if (action === "unsave") return current.filter((entry) => entry !== slug);
  if (current.includes(slug)) return [...current];
  return [slug, ...current];
}

export function beginSave(state: SaveViewState, action: SavedChange, slug: string): SaveViewState {
  return {
    view: optimisticSlugs(state.view, action, slug),
    confirmed: state.confirmed,
    inflight: state.inflight + 1,
    best: state.best,
  };
}

/**
 * Apply one POST reply.
 * Buttons keep the optimistic list until every in-flight reply has arrived.
 * They then show the list from the highest `version`, or `confirmed` when
 * every reply failed. A reply never restores the list snapshotted at send time.
 */
export function receiveSaveReply(state: SaveViewState, reply: SaveReply): SaveViewState {
  const inflight = state.inflight - 1;
  const best =
    reply.ok && (state.best === null || reply.version > state.best.version)
      ? { version: reply.version, slugs: [...reply.slugs] }
      : state.best;
  if (inflight > 0) return { ...state, inflight, best };
  if (best) {
    const slugs = [...best.slugs];
    return { view: slugs, confirmed: [...slugs], inflight: 0, best: null };
  }
  return { ...state, view: [...state.confirmed], inflight: 0, best: null };
}
