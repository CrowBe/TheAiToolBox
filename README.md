# TheAiToolBox

An AI tools directory web app. Users can browse, filter, search, and rate AI tools, and authenticated users can save them to a personal toolbox.

## Stack

- **Package manager**: pnpm workspaces (Node 24)
- **Frontend**: React 19 + Vite + Tailwind 4 + shadcn/ui (`artifacts/ai-tools-directory`)
- **API**: Express 5 bundled with esbuild (`artifacts/api-server`)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **Auth**: Clerk
- **API contract**: OpenAPI in `lib/api-spec`, codegen'd into `lib/api-client-react` (TanStack Query hooks) and `lib/api-zod` (request/response schemas)

## Repo layout

```
artifacts/
  ai-tools-directory/   React + Vite frontend
  api-server/           Express API server
lib/
  api-spec/             OpenAPI spec + Orval codegen config
  api-client-react/     Generated React Query hooks (do not edit by hand)
  api-zod/              Generated Zod schemas (do not edit by hand)
  db/                   Drizzle schema + migrations
scripts/                Workspace-level scripts
```

## Prerequisites

- Node.js 24
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- A PostgreSQL database (any 16+ instance: local, Docker, Neon, Render, etc.)
- A Clerk application (for auth)

## Quick start

```bash
# 1. Install
pnpm install

# 2. Configure env
cp .env.example .env   # fill in DATABASE_URL and Clerk keys

# 3. Push the schema to your dev database
pnpm --filter @workspace/db run push

# 4. Run the API and frontend (in two terminals)
pnpm --filter @workspace/api-server run dev    # http://localhost:8080
pnpm --filter @workspace/ai-tools-directory run dev   # http://localhost:5173
```

The frontend calls the API at `/api/*`. In development, point your frontend to the API by either running both behind a single proxy, or by setting a Vite dev proxy / `VITE_API_BASE_URL` if you prefer separate origins.

## Environment variables

| Var | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | api-server, db | Postgres connection string |
| `CLERK_SECRET_KEY` | api-server | Clerk backend secret |
| `CLERK_PUBLISHABLE_KEY` | api-server | Used by the proxy middleware |
| `VITE_CLERK_PUBLISHABLE_KEY` | ai-tools-directory | Clerk frontend key |
| `ADMIN_USER_IDS` | api-server | Comma-separated Clerk user IDs allowed to access `/admin` |
| `PORT` | api-server, ai-tools-directory | Listen port (api defaults vary by host; web defaults to `5173`) |
| `BASE_PATH` | ai-tools-directory | Vite `base` (defaults to `/`) |

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

- **Root directory**: `artifacts/ai-tools-directory`
- **Install command**: `pnpm install` (run from repo root — Vercel detects the workspace)
- **Build command**: `pnpm --filter @workspace/ai-tools-directory run build`
- **Output directory**: `dist/public`
- **Env vars**: `VITE_CLERK_PUBLISHABLE_KEY`
- Add a rewrite so `/api/*` proxies to the Render API origin.

### API → Render

- **Service type**: Web Service (Node)
- **Build command**: `pnpm install && pnpm --filter @workspace/api-server run build`
- **Start command**: `node --enable-source-maps artifacts/api-server/dist/index.mjs`
- **Health check path**: `/api/healthz`
- **Env vars**: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `ADMIN_USER_IDS`, `PORT`

For the database, use a managed Postgres (Render Postgres, Neon, Supabase, etc.) and run `pnpm --filter @workspace/db run push` against the production URL when the schema changes.

## Notes

- `pnpm install` is enforced — `npm install` and `yarn install` are blocked by the root `preinstall` script.
- New npm packages must be at least 24h old (see `pnpm-workspace.yaml`); this is a deliberate supply-chain defense.
- The generated files in `lib/api-client-react/src/generated` and `lib/api-zod/src/generated` are produced by `@workspace/api-spec`'s `codegen` script — edit `openapi.yaml`, not the generated output.
