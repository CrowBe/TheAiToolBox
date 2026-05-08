# TheAiToolBox

An AI tools directory web app. Users can browse, filter, search, and rate AI tools, and authenticated users can save them to a personal toolbox.

## Stack

- **Package manager**: pnpm workspaces (Node 24)
- **Frontend**: React 19 + Vite + Tailwind 4 + shadcn/ui (`apps/web`)
- **API**: Express 5 bundled with esbuild (`apps/api`)
- **Database**: PostgreSQL via Drizzle ORM (`packages/db`)
- **Auth**: Clerk
- **API contract**: OpenAPI in `packages/api-spec`, codegen'd into `packages/api-client-react` (TanStack Query hooks) and `packages/api-zod` (request/response schemas)

## Repo layout

```
apps/
  web/              React + Vite frontend          (@workspace/ai-tools-directory)
  api/              Express API server             (@workspace/api-server)
packages/
  api-spec/         OpenAPI spec + Orval codegen   (@workspace/api-spec)
  api-client-react/ Generated React Query hooks    (@workspace/api-client-react)
  api-zod/          Generated Zod schemas          (@workspace/api-zod)
  db/               Drizzle schema + migrations    (@workspace/db)
tools/              Workspace-level scripts        (@workspace/scripts)
```

## Prerequisites

- Node.js 24
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker (for local database — or any PostgreSQL 16+ instance)
- A Clerk application (for auth)

## Quick start

```bash
# 1. Install
pnpm install

# 2. Start a local Postgres 16 database
docker compose up -d db

# 3. Configure env
cp .env.example .env   # DATABASE_URL is pre-filled for the compose service; add Clerk keys

# 4. Push the schema to your dev database
pnpm --filter @workspace/db run push

# 5. Run the API and frontend in parallel
pnpm dev
```

The frontend calls the API at `/api/*`. In development, point your frontend to the API by either running both behind a single proxy, or by setting a Vite dev proxy / `VITE_API_BASE_URL` if you prefer separate origins.

## Dev scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start `apps/web` and `apps/api` in parallel |
| `pnpm dev:web` | Start the Vite frontend only |
| `pnpm dev:api` | Start the Express API only |
| `pnpm typecheck` | Full workspace typecheck |
| `pnpm build` | Typecheck + build all packages |

## Environment variables

| Var | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | api-server, db | Postgres connection string |
| `CLERK_SECRET_KEY` | api-server | Clerk backend secret |
| `CLERK_PUBLISHABLE_KEY` | api-server | Used by the proxy middleware |
| `VITE_CLERK_PUBLISHABLE_KEY` | apps/web | Clerk frontend key |
| `ADMIN_USER_IDS` | api-server | Comma-separated Clerk user IDs allowed to access `/admin` |
| `PORT` | api-server, apps/web | Listen port (api defaults vary by host; web defaults to `5173`) |
| `BASE_PATH` | apps/web | Vite `base` (defaults to `/`) |

## Common scripts

```bash
pnpm typecheck                                          # full workspace typecheck
pnpm build                                              # typecheck + build all packages

pnpm --filter @workspace/api-spec run codegen           # regenerate API client + zod schemas
pnpm --filter @workspace/db run push                    # push Drizzle schema to DB (dev)
pnpm --filter @workspace/api-server run build           # esbuild bundle to dist/
pnpm --filter @workspace/ai-tools-directory run build   # vite build to dist/public
```

## Deployment

### Frontend → Vercel

- **Root directory**: `apps/web`
- **Install command**: `pnpm install` (run from repo root — Vercel detects the workspace)
- **Build command**: `pnpm --filter @workspace/ai-tools-directory run build`
- **Output directory**: `dist/public`
- **Env vars**: `VITE_CLERK_PUBLISHABLE_KEY`
- Add a rewrite so `/api/*` proxies to the Render API origin.

### API → Render

- **Service type**: Web Service (Node)
- **Build command**: `pnpm install && pnpm --filter @workspace/api-server run build`
- **Pre-deploy command**: `pnpm db:deploy`
- **Start command**: `node --enable-source-maps apps/api/dist/index.mjs`
- **Health check path**: `/api/healthz`
- **Env vars**: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `ADMIN_USER_IDS`, `PORT`

`pnpm db:deploy` runs migrations then seeds (both idempotent — safe to re-run on every deploy). Set this as Render's **Pre-Deploy Command** so schema and seed data stay in sync automatically.

## Notes

- `pnpm install` is enforced — `npm install` and `yarn install` are blocked by the root `preinstall` script.
- New npm packages must be at least 24h old (see `pnpm-workspace.yaml`); this is a deliberate supply-chain defense.
- The generated files in `packages/api-client-react/src/generated` and `packages/api-zod/src/generated` are produced by `@workspace/api-spec`'s `codegen` script — edit `openapi.yaml`, not the generated output.
