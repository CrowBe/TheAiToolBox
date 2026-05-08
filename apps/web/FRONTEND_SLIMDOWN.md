# Frontend slim-down plan

**Goal:** reduce the dependency surface of `apps/web` while staying on the current stack (React 19 + Vite + Tailwind 4 + shadcn/ui). No framework swap, no behaviour change, no UI redesign.

**Why:** the package currently lists ~50 runtime deps, but a large fraction were installed by the original `shadcn add` runs and the corresponding components are never imported anywhere outside `src/components/ui/`. Each unused dep is supply-chain risk (we set `minimumReleaseAge: 1440` for a reason), CI install time, and bundle bloat for any shared chunks.

**Scope:** `apps/web` only. The API contract (`@workspace/api-client-react`, OpenAPI/Orval pipeline), Clerk auth, wouter, and TanStack Query all stay — they are actively used and removing them would be a framework swap, not a slim-down.

---

## 1 — What stays

These shadcn components are referenced by `App.tsx`, `components/layout/`, `pages/`, or `hooks/use-toast.ts`, directly or transitively:

| Component | Radix dep it pulls in |
| --- | --- |
| `accordion` | `@radix-ui/react-accordion` |
| `badge` | — |
| `button` | `@radix-ui/react-slot` (for `asChild`) |
| `card` | — |
| `dialog` | `@radix-ui/react-dialog` |
| `input`, `textarea`, `label` | `@radix-ui/react-label` |
| `scroll-area` | `@radix-ui/react-scroll-area` |
| `select` | `@radix-ui/react-select` |
| `skeleton`, `spinner` | — |
| `switch` | `@radix-ui/react-switch` |
| `tabs` | `@radix-ui/react-tabs` |
| `toast` + `toaster` (via `hooks/use-toast.ts`) | `@radix-ui/react-toast` |
| `toggle-group` | `@radix-ui/react-toggle-group` (+ `toggleVariants` from `toggle.tsx`) |
| `tooltip` | `@radix-ui/react-tooltip` |

App-specific UI to keep as-is: `add-to-toolbox-button`, `rating-form`, `rating-stars`, `security-badge`, `tool-card`.

Other live deps to keep: `@clerk/react`, `@clerk/themes`, `@tanstack/react-query`, `wouter`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` (provides `animate-in`/`animate-out`/`animate-accordion-*` used by Radix-based components), `zod`, `react`, `react-dom`.

---

## 2 — What goes (and what to delete with it)

### 2a. Dead shadcn components → delete files

The following files in `src/components/ui/` are not imported from anywhere outside that directory. Delete the file; that automatically frees its Radix peer.

```
alert.tsx                aspect-ratio.tsx       avatar.tsx
alert-dialog.tsx         breadcrumb.tsx         button-group.tsx
calendar.tsx             carousel.tsx           chart.tsx
checkbox.tsx             collapsible.tsx        command.tsx
context-menu.tsx         drawer.tsx             dropdown-menu.tsx
empty.tsx                field.tsx              form.tsx
hover-card.tsx           input-group.tsx        input-otp.tsx
item.tsx                 kbd.tsx                menubar.tsx
navigation-menu.tsx      pagination.tsx         popover.tsx
progress.tsx             radio-group.tsx        resizable.tsx
separator.tsx            sheet.tsx              sidebar.tsx
slider.tsx               sonner.tsx             table.tsx
toggle.tsx*              toast.tsx — KEEP
```

`*` `toggle.tsx` — `toggle-group.tsx` only imports the `toggleVariants` constant, not the `Toggle` component. Two options:
   - (preferred) move `toggleVariants` into `toggle-group.tsx` and delete `toggle.tsx` → drops `@radix-ui/react-toggle`
   - keep `toggle.tsx` → keep `@radix-ui/react-toggle`

### 2b. Radix peers that become unused

Once 2a is done, remove these from `apps/web/package.json`:

```
@radix-ui/react-alert-dialog
@radix-ui/react-aspect-ratio
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-collapsible
@radix-ui/react-context-menu
@radix-ui/react-dropdown-menu
@radix-ui/react-hover-card
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-popover
@radix-ui/react-progress
@radix-ui/react-radio-group
@radix-ui/react-separator
@radix-ui/react-slider
@radix-ui/react-toggle    ← only if toggle.tsx is removed (see 2a)
```

15 Radix packages out (16 if `toggle.tsx` is dropped).

### 2c. Heavy third-party libs that become unused

| Package | Reason |
| --- | --- |
| `recharts` | only imported by `chart.tsx` (deleted) |
| `embla-carousel-react` | only imported by `carousel.tsx` (deleted) |
| `react-day-picker` | only imported by `calendar.tsx` (deleted) |
| `react-resizable-panels` | only imported by `resizable.tsx` (deleted) |
| `vaul` | only imported by `drawer.tsx` (deleted) |
| `cmdk` | only imported by `command.tsx` (deleted) |
| `input-otp` | only imported by `input-otp.tsx` (deleted) |
| `react-hook-form` | only imported by `form.tsx` (deleted) |
| `@hookform/resolvers` | peer of `react-hook-form` |
| `sonner` | only imported by `sonner.tsx` (deleted) |
| `next-themes` | only imported by `sonner.tsx` (deleted) |
| `framer-motion` | grep finds zero imports across `src/` |
| `react-icons` | grep finds zero imports across `src/` |
| `date-fns` | only imported by `calendar.tsx` (deleted) |
| `@tailwindcss/typography` | declared in `index.css` as `@plugin`, but no `prose` class is used anywhere. Delete the `@plugin` line and the dep. |

15 third-party packages out.

### 2d. Catalog cleanup

Once the deps above are removed and no other workspace package needs them, remove the corresponding entries from the `catalog:` block in `pnpm-workspace.yaml`. From the audit, the only catalog entry that becomes orphaned by this change is `framer-motion`.

---

## 3 — Code changes that need a touch (not just file deletion)

These are the only edits needed — everything else is `rm` + `package.json` cleanup.

1. **`src/index.css`** — remove `@plugin "@tailwindcss/typography";` (line 4).
2. **`src/components/ui/toggle-group.tsx`** — inline `toggleVariants` (small `cva` block) so we can delete `toggle.tsx`. Optional; skip if you'd rather keep the Toggle primitive around.
3. **`apps/web/package.json`** — remove the 15 Radix packages from 2b, the 15 libs from 2c, and (if 2 was done) `@radix-ui/react-toggle`.
4. **`pnpm-workspace.yaml`** — remove `framer-motion: ^12.23.24` from `catalog:`.

No changes to `App.tsx`, `main.tsx`, the layout, the pages, or `vite.config.ts`.

---

## 4 — Execution order

Do this on a single PR; the changes are mechanically linked.

1. Delete the 37 dead files in `src/components/ui/` (list in 2a).
2. Update `toggle-group.tsx` and delete `toggle.tsx` (optional, 2a).
3. Remove the `@plugin "@tailwindcss/typography";` line in `index.css`.
4. Remove the 30 (or 31) packages from `apps/web/package.json`.
5. Remove `framer-motion` from `pnpm-workspace.yaml` `catalog:`.
6. `pnpm install` — regenerates the lockfile.
7. `pnpm typecheck` — catches anything we missed (e.g. an unnoticed `@/components/ui/<x>` import).
8. `pnpm dev:web` and click through every route (`/`, `/browse`, `/search`, `/tool/:slug`, `/category/:slug`, `/role/:slug`, `/toolbox`, `/admin`, `/sign-in`, `/sign-up`) to confirm nothing visibly regressed.
9. `pnpm --filter @workspace/ai-tools-directory run build` — confirms the production build still succeeds and the bundle shrinks.

---

## 5 — Risks and rollback

- **Risk: a shadcn component appears unused but is used dynamically.** None found by grep — all usage is via static `import { X } from "@/components/ui/<file>"`. Type-check + manual click-through covers it.
- **Risk: removing `@tailwindcss/typography` breaks long-form text.** No `prose` class is used in `src/`; the only long-form text is the tool description on `/tool/:slug`, which uses regular Tailwind classes.
- **Risk: the toolbox page's toast stops working.** `toast.tsx`, `toaster.tsx`, and `hooks/use-toast.ts` are explicitly preserved (transitively reachable from `pages/toolbox.tsx` and `App.tsx`).
- **Rollback:** the change is one PR; revert restores everything. No data, schema, or API changes.

---

## 6 — What is explicitly NOT in scope

Listed so we don't quietly grow the work:

- Replacing TanStack Query (it is the consumption surface for the generated `@workspace/api-client-react` hooks — replacing it means regenerating the client and rewriting every page's data layer).
- Replacing wouter (working fine; ~3KB).
- Replacing Clerk (auth provider — out of scope).
- Replacing the OpenAPI → Orval codegen pipeline.
- Replacing shadcn/ui itself (the components we keep are vendored into `src/components/ui/`, so they cost us no runtime dep beyond their underlying Radix primitives).
- A move to Astro / SvelteKit / Next.js. Those are framework swaps, not slim-downs, and require separate planning.

---

## 7 — Estimated impact

- **Direct deps removed:** ~30 packages (15 Radix + 15 third-party), plus 1 catalog entry.
- **Files removed:** 37 in `src/components/ui/`.
- **Bundle size:** the largest single win is `recharts` (~150 KB gzipped on its own). `framer-motion`, `cmdk`, `react-day-picker`, and `react-hook-form` together are another 100 KB+ gzipped. None of these were tree-shaken away in production today because the transitive imports inside the unused shadcn files kept them in the dependency graph.
- **Effort:** ~half a day, mostly mechanical. No design or product decisions required.
