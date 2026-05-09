# Agent guide

Conventions for AI agents working in this repo. Keep changes small, scoped, and consistent with what's already here.

## Ground rules

- **Use pnpm**, never `npm` or `yarn`. The root `preinstall` script enforces this.
- **Every package is `@workspace/<name>`**. New internal packages follow the same convention and live under `packages/` (libraries) or `apps/` (deployable apps).
- **Reuse the catalog**. Shared deps (react, vite, tailwindcss, drizzle-orm, zod, etc.) are pinned in `pnpm-workspace.yaml` under `catalog:`. Reference them as `"<name>": "catalog:"` in package.json. Add to the catalog before introducing a new shared dep.
- **Run `pnpm typecheck` before declaring work done.** This runs `tsc --build` across `packages/*` and per-package `typecheck` for `apps/*` and `tools`.

## Repo layout

```
apps/        Deployable apps (web frontend, api server)
packages/    Internal libraries (api-spec, generated clients, db)
tools/       One-off workspace scripts (tsx-based)
```

When adding code, choose:
- A **deployable** (web/API/worker) → new dir under `apps/`
- A **shared library** consumed by other packages → new dir under `packages/`
- A **maintenance script** (seeders, migrations runners, ad-hoc tooling) → add to `tools/src/`

## API contract flow

The API contract is OpenAPI-first.

1. Edit `packages/api-spec/openapi.yaml`.
2. Run `pnpm --filter @workspace/api-spec run codegen`. This regenerates:
   - `packages/api-client-react/src/generated/` — TanStack Query hooks consumed by the frontend
   - `packages/api-zod/src/generated/` — Zod schemas consumed by the API server for request/response validation
3. Implement the endpoint in `apps/api/src/routes/<name>.ts`, validating with the matching `@workspace/api-zod` schema.
4. Use the generated hook from `@workspace/api-client-react` on the frontend.

**Never hand-edit files in `*/src/generated/`** — they will be overwritten on the next codegen.

## Database

- Schema lives in `packages/db/src/schema/`.
- Use Drizzle's `pgTable` definitions; export from `packages/db/src/schema/index.ts`.
- For dev DBs: `pnpm --filter @workspace/db run push` (use `push-force` only if you understand the data loss).
- For prod DBs: write a migration; do not `push` against prod.
- All DB access goes through `@workspace/db` — don't import `pg` or `drizzle-orm` directly from `apps/api`.

## Seed data & the data-agent workflow

The seed is idempotent (upsert-on-slug) and runs automatically on every Vercel deploy. `vercel.json`'s `buildCommand` is prefixed with `pnpm db:deploy` (= `db:migrate && db:seed`), so migrations and seed data are applied before the web/API build runs.

Seed data lives in three focused files — edit only these when adding or updating reference data:

| File | Contents |
|------|----------|
| `tools/src/data/categories.ts` | `CATEGORIES` array (`InsertCategory[]`) |
| `tools/src/data/roles.ts` | `ROLES` array (`InsertRole[]`) |
| `tools/src/data/tools.ts` | `SeedTool` type + `TOOLS` array |

`tools/src/seed.ts` contains only the DB upsert logic — do not add data there.

### Scheduled data-validation / crawl agent

A coding agent can maintain `tools/src/data/tools.ts` on a schedule:

1. **Audit** — read the file, check each entry for stale data (pricing, URLs, launch year, security scores).
2. **Crawl** — discover new AI tools and build `SeedTool` objects for each. All fields are required; see the existing entries for examples.
3. **Validate** — every new entry must have a unique `slug` (kebab-case), a valid `categorySlug` from `categories.ts`, and `roles` values from `roles.ts`.
4. **PR** — commit the updated `tools/src/data/tools.ts` (and optionally `categories.ts` / `roles.ts`) to a new branch and open a PR. The seed will run on the next deploy once merged.

## Frontend (`apps/web`)

- shadcn/ui components live in `src/components/ui/`. They are pre-customized — match the existing styling conventions (e.g. `hover-elevate`, `[border-color:var(--*-outline)]`) when adding variants.
- Path alias: `@/` → `src/`.
- Auth via `@clerk/react`; protected routes use Clerk's `<SignedIn>` / `<SignedOut>` and the API uses the `requireAuth` middleware.
- Data fetching is exclusively through generated TanStack Query hooks from `@workspace/api-client-react`.

## API server (`apps/api`)

- Express 5, ESM, bundled to a single `dist/index.mjs` via esbuild (`build.mjs`).
- Routes registered in `src/routes/index.ts`. Each route file should validate input/output against the corresponding `@workspace/api-zod` schema.
- Logging via `pino` (`src/lib/logger.ts`); `pino-http` is mounted globally — use `req.log` rather than `console.*`.
- New env vars must be read at startup with explicit error messages, not at request time.

## Style

- TypeScript strict mode is on. Don't paper over type errors with `any` or `as unknown as` — fix the underlying type.
- Default to no comments. Add them only when the *why* is non-obvious (a workaround, a subtle invariant). Don't restate what the code already says.
- Don't add backwards-compatibility shims, dead `// removed` markers, or speculative abstractions. Three similar lines beat a premature helper.
- Match existing formatting; the repo uses Prettier (`pnpm prettier --check .`).

## What not to do

- Don't reintroduce Replit-specific configs, plugins, or comments. The repo was migrated off Replit; production targets are Vercel (web) and Render (api).
- Don't add a new package manager lockfile (`package-lock.json`, `yarn.lock`); the `preinstall` script will delete them.
- Don't lower `minimumReleaseAge` in `pnpm-workspace.yaml`. If you genuinely need a newer package, add it to a `minimumReleaseAgeExclude` list with justification.
- Don't commit secrets. `.env` is gitignored — use `.env.example` to document new variables.
