# Agent guide

Conventions for AI agents working in this repo. Keep changes small, scoped, and consistent with what's already here.

## Ground rules

- **Use pnpm**, never `npm` or `yarn`. The root `preinstall` script enforces this.
- **Every package is `@workspace/<name>`**. New internal packages follow the same convention and live under `lib/` (libraries) or `artifacts/` (deployable apps).
- **Reuse the catalog**. Shared deps (react, vite, tailwindcss, drizzle-orm, zod, etc.) are pinned in `pnpm-workspace.yaml` under `catalog:`. Reference them as `"<name>": "catalog:"` in package.json. Add to the catalog before introducing a new shared dep.
- **Run `pnpm typecheck` before declaring work done.** This runs `tsc --build` across `lib/*` and per-package `typecheck` for `artifacts/*` and `scripts`.

## Repo layout

```
artifacts/   Deployable apps (frontend, api server)
lib/         Internal libraries (api-spec, generated clients, db)
scripts/     One-off workspace scripts (tsx-based)
```

When adding code, choose:
- A **deployable** (web/API/worker) → new dir under `artifacts/`
- A **shared library** consumed by other packages → new dir under `lib/`
- A **maintenance script** (seeders, migrations runners, ad-hoc tooling) → add to `scripts/src/`

## API contract flow

The API contract is OpenAPI-first.

1. Edit `lib/api-spec/openapi.yaml`.
2. Run `pnpm --filter @workspace/api-spec run codegen`. This regenerates:
   - `lib/api-client-react/src/generated/` — TanStack Query hooks consumed by the frontend
   - `lib/api-zod/src/generated/` — Zod schemas consumed by the API server for request/response validation
3. Implement the endpoint in `artifacts/api-server/src/routes/<name>.ts`, validating with the matching `@workspace/api-zod` schema.
4. Use the generated hook from `@workspace/api-client-react` on the frontend.

**Never hand-edit files in `*/src/generated/`** — they will be overwritten on the next codegen.

## Database

- Schema lives in `lib/db/src/schema/`.
- Use Drizzle's `pgTable` definitions; export from `lib/db/src/schema/index.ts`.
- For dev DBs: `pnpm --filter @workspace/db run push` (use `push-force` only if you understand the data loss).
- For prod DBs: write a migration; do not `push` against prod.
- All DB access goes through `@workspace/db` — don't import `pg` or `drizzle-orm` directly from `artifacts/api-server`.

## Frontend (`artifacts/ai-tools-directory`)

- shadcn/ui components live in `src/components/ui/`. They are pre-customized — match the existing styling conventions (e.g. `hover-elevate`, `[border-color:var(--*-outline)]`) when adding variants.
- Path alias: `@/` → `src/`.
- Auth via `@clerk/react`; protected routes use Clerk's `<SignedIn>` / `<SignedOut>` and the API uses the `requireAuth` middleware.
- Data fetching is exclusively through generated TanStack Query hooks from `@workspace/api-client-react`.

## API server (`artifacts/api-server`)

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
