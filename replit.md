# AITools Directory

## Overview

An AI tools directory website where users can browse, filter, and curate AI software tools. Features a "toolbox" theme where authenticated users can save tools to their personal collection.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifact: `ai-tools-directory`, path `/`)
- **API framework**: Express 5 (artifact: `api-server`, path `/api`)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (Replit-managed, provisioned)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)

## Architecture

```
artifacts/ai-tools-directory/   React+Vite frontend (/)
artifacts/api-server/           Express API server (/api)
lib/api-spec/                   OpenAPI spec + codegen config
lib/api-client-react/           Generated React Query hooks
lib/db/                         Drizzle schema + migrations
```

## DB Schema

- `categories` — 12 AI tool categories (coding, writing, image-generation, etc.)
- `roles` — 8 professional roles (software-engineer, designer, etc.)
- `tools` — 27 seeded AI tools with pricing, security, tags
- `ratings` — user ratings (no login required)
- `toolbox_items` — user saved tools (Clerk userId, toolId, unique constraint)

## Auth Flow

- Clerk auth with custom dark-themed sign-in/sign-up pages
- `CLERK_PROXY_PATH` = `/api/__clerk`
- Env vars: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- `requireAuth` middleware in `artifacts/api-server/src/routes/toolbox.ts`

## Routes

Frontend:
- `/` — Home with toolbox theme, hero, role grid, category accordion
- `/browse` — Filter/search all tools
- `/search` — In-browser LLM semantic search
- `/tool/:slug` — Tool detail page (pricing, security, ratings)
- `/category/:slug` — Category filtered view
- `/role/:slug` — Role filtered view
- `/toolbox` — Saved tools (requires auth)
- `/sign-in`, `/sign-up` — Clerk auth pages

API:
- `GET /api/tools` — list/filter tools
- `GET /api/tools/:slug` — tool detail
- `GET /api/tools/stats/summary` — aggregate stats
- `GET /api/tools/by-category` — grouped tools
- `GET /api/categories` — list categories
- `GET /api/roles` — list roles
- `GET/POST /api/ratings/:toolId` — ratings
- `GET /api/toolbox` — user toolbox (auth required)
- `POST /api/toolbox/:toolId` — add to toolbox (auth required)
- `DELETE /api/toolbox/:toolId` — remove from toolbox (auth required)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure details.
