"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui-sdk/react/dialog";
import { readValues } from "@/engine/access";
import { registerSavedTools, savedCatalogTools } from "@/engine/agent";
import type { SavedChange } from "@/engine/saved";
import { beginSave, initialSaveView, receiveSaveReply, type SaveViewState } from "@/engine/save-view";
import type { BoxConfig } from "@/engine/types";
import { CloseIcon } from "./icons";
import { browserSavedStore, setSavedBridge } from "./saved-bridge";

export type SessionAuth = "off" | "loading" | "signed-out" | "signed-in";

type SavedContextValue = {
  auth: SessionAuth;
  slugs: readonly string[];
  libraryLabel: string;
  libraryPath: string;
  signInHref: string;
  signOut: (() => void) | null;
  change: (action: SavedChange, slug: string) => Promise<{ slugs: string[] } | { error: string }>;
  openPrompt: () => void;
};

const SavedContext = createContext<SavedContextValue>({
  auth: "off",
  slugs: [],
  libraryLabel: "My box",
  libraryPath: "/box",
  signInHref: "/sign-in",
  signOut: null,
  change: async () => ({ error: "Sign in to save." }),
  openPrompt: () => undefined,
});

export function useSavedSession() {
  return useContext(SavedContext);
}

function isSlugList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

export function SavedSession({
  box,
  items,
  auth,
  signInPath,
  onSignOut,
  children,
}: {
  box: BoxConfig;
  items: readonly object[];
  auth: SessionAuth;
  signInPath: string;
  onSignOut?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [seenAuth, setSeenAuth] = useState(auth);
  const slugsRef = useRef<string[]>([]);
  const saveView = useRef<SaveViewState>(initialSaveView([]));
  const revision = useRef(0);

  if (seenAuth !== auth) {
    setSeenAuth(auth);
    setSlugs([]);
  }

  const publish = useCallback((state: SaveViewState) => {
    saveView.current = state;
    slugsRef.current = state.view;
    setSlugs(state.view);
  }, []);

  const change = useCallback(
    async (action: SavedChange, slug: string) => {
      revision.current += 1;
      publish(beginSave(saveView.current, action, slug));
      const fail = (error: string) => {
        publish(receiveSaveReply(saveView.current, { ok: false }));
        setNotice(error);
        return { error };
      };
      try {
        const response = await fetch("/api/saved", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action, slug }),
          cache: "no-store",
        });
        const body = (await response.json()) as { slugs?: unknown; error?: unknown; version?: unknown };
        const slugs = body.slugs;
        const version = body.version;
        if (!response.ok || !isSlugList(slugs) || typeof version !== "number" || !Number.isSafeInteger(version)) {
          const error = typeof body.error === "string" ? body.error : "Could not save.";
          return fail(error);
        }
        publish(receiveSaveReply(saveView.current, { ok: true, version, slugs }));
        setNotice(null);
        return { slugs };
      } catch (error) {
        const message = error instanceof Error && error.message ? error.message : "Could not save.";
        return fail(message);
      }
    },
    [publish],
  );

  const list = useCallback(async () => ({ slugs: slugsRef.current }), []);

  useEffect(() => {
    if (auth !== "signed-in") {
      saveView.current = initialSaveView([]);
      slugsRef.current = [];
      return;
    }
    const controller = new AbortController();
    const started = revision.current;
    let active = true;
    saveView.current = initialSaveView([]);
    slugsRef.current = [];
    fetch("/api/saved", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as { slugs?: unknown; error?: unknown };
        if (!response.ok || !isSlugList(body.slugs)) {
          throw new Error(typeof body.error === "string" ? body.error : "Could not load saved records.");
        }
        return body.slugs;
      })
      .then((next) => {
        if (!active || revision.current !== started) return;
        publish(initialSaveView(next));
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setNotice(error instanceof Error ? error.message : "Could not load saved records.");
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [auth, publish]);

  useEffect(() => {
    if (auth !== "signed-in") return;
    setSavedBridge({ list, change });
    const controller = new AbortController();
    const known = new Set(
      items.flatMap((item) => {
        const slug = readValues(item, box.item.slugField)[0];
        return slug ? [slug] : [];
      }),
    );
    registerSavedTools(document, savedCatalogTools(box, items, known, browserSavedStore), controller.signal);
    return () => {
      controller.abort();
      setSavedBridge(null);
    };
  }, [auth, box, change, items, list]);

  const nextPath = pathname === signInPath ? box.library.path : pathname || box.library.path;
  const signInHref = `${signInPath}?next=${encodeURIComponent(nextPath)}`;
  const openPrompt = useCallback(() => setPromptOpen(true), []);

  const value: SavedContextValue = {
    auth,
    slugs: auth === "signed-in" ? slugs : [],
    libraryLabel: box.library.label,
    libraryPath: box.library.path,
    signInHref,
    signOut: onSignOut ?? null,
    change,
    openPrompt,
  };

  return (
    <SavedContext.Provider value={value}>
      {children}
      {notice ? (
        <p
          role="alert"
          className="fixed bottom-4 left-1/2 z-40 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-line bg-elev px-4 py-3 text-sm shadow-lg"
        >
          {notice}
        </p>
      ) : null}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogBackdrop />
        <DialogContent>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-serif text-2xl">Sign in to save</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-muted">
                Save {box.item.noun.other} to {box.library.label}. We&apos;ll email you a one-time code. No
                password.
              </DialogDescription>
            </div>
            <DialogClose aria-label="Close" className="rounded-full border border-line p-1">
              <CloseIcon />
            </DialogClose>
          </div>
          {auth === "signed-out" ? (
            <Link
              href={signInHref}
              className="mt-4 inline-flex w-fit rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink no-underline"
              onClick={() => setPromptOpen(false)}
            >
              Email me a code
            </Link>
          ) : (
            <p className="mt-4 text-sm text-muted">Saving stays off until Clerk keys are set.</p>
          )}
        </DialogContent>
      </Dialog>
    </SavedContext.Provider>
  );
}

export function AccountSlot() {
  const session = useSavedSession();
  if (session.auth === "signed-in") {
    return (
      <>
        <Link href={session.libraryPath} className="no-underline hover:text-accent">
          {session.libraryLabel}
        </Link>
        {session.signOut ? (
          <button type="button" className="hover:text-accent" onClick={session.signOut}>
            Sign out
          </button>
        ) : null}
      </>
    );
  }
  if (session.auth === "signed-out") {
    return (
      <Link href={session.signInHref} className="no-underline hover:text-accent">
        Sign in
      </Link>
    );
  }
  return null;
}

export function SaveToggle({ slug, title }: { slug: string; title: string }) {
  const session = useSavedSession();
  const signedIn = session.auth === "signed-in";
  const saved = signedIn && session.slugs.includes(slug);
  const label =
    session.auth === "loading"
      ? `Save ${title}`
      : signedIn
        ? saved
          ? `Remove ${title} from ${session.libraryLabel}`
          : `Save ${title}`
        : `Sign in to save ${title}`;
  const text = session.auth === "loading" ? "Save" : signedIn ? (saved ? "Saved" : "Save") : "Sign in to save";

  return (
    <button
      type="button"
      className={`shrink-0 rounded-full border px-3 py-1 text-sm ${
        saved ? "border-transparent bg-accent font-medium text-accent-ink" : "border-line bg-elev"
      }`}
      aria-pressed={signedIn ? saved : undefined}
      aria-label={label}
      aria-busy={session.auth === "loading"}
      disabled={session.auth === "loading" || !slug}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!signedIn) {
          session.openPrompt();
          return;
        }
        void session.change(saved ? "unsave" : "save", slug);
      }}
    >
      {text}
    </button>
  );
}
