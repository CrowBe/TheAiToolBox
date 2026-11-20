# Agent guide

The AI Tool Box is a single Next.js app. The catalog is JSON in the repo. Do not add a database, an API server, or a codegen step.

## Ground rules

- Use pnpm. The `preinstall` script rejects npm and yarn.
- Do not lower `minimumReleaseAge` in `pnpm-workspace.yaml`.
- TypeScript strict mode is on. Don't paper over errors with `any`.
- Do not commit secrets. `.env.example` documents names only.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` before calling the work done.

## Where code goes

- Catalog records: `data/tools/<slug>.json`
- Vocabularies: `data/vocabularies/`
- This site's schema, config, and loader: `src/boxes/aitoolbox/`
- Shared catalog behavior: `src/engine/`
- Routes: `src/app/`
- Auth seam: `src/auth/`

`src/engine` must stay schema-driven. It should not mention AI tools, categories, or AIToolBox copy. A box config decides the fields, filters, cards, and copy. Another catalog later gets its own folder under `src/boxes` and reuses the engine.

Interactive controls live in `src/engine/ui` and use `@ui-sdk/react` (combobox, command, dialog) plus `createVirtualizer` from `@ui-sdk/core`. Search, filter, and validation modules do not import UI SDK. Import components from their entry points, and keep `@layer ui-sdk;` as the first line of `src/app/globals.css`.

Read-only WebMCP tools are built in `src/engine/agent.ts` from the box config and registered with `document.modelContext` when it exists. Signed-in save tools (`save_tool`, `unsave_tool`, `list_saved` for this box) are registered from the same module and removed with the `AbortSignal` on sign-out. Do not polyfill the API. Do not mark the save tools read-only.

Route folders must match the box config (`item.path` is `/tools`, the category collection path is `/categories`, `library.path` is `/box`).

## Data

Validate with the Zod schema in `src/boxes/aitoolbox/schema.ts`. Slugs are unique kebab-case ids, the filename matches the slug, and URLs are `https`. Category, role, pricing, and platform values must exist in the vocabulary files.

Logos are the tool origin's `/favicon.ico`, with initials as the fallback. Do not use logo.clearbit.com.

Clerk signs users in with an email code only. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` stay unset in CI. Do not commit keys. With both unset, save buttons say "Sign in to save" and `clerkMiddleware` is not invoked. Saved slugs are written to Clerk `privateMetadata.saved.<box id>` from `POST /api/saved`. Do not add a database for saves.

## Commands

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
