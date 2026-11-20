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

Read-only WebMCP tools are built in `src/engine/agent.ts` from the box config and registered with `document.modelContext` when it exists. Do not add write tools until auth exists. Do not polyfill the API.

Route folders must match the box config (`item.path` is `/tools`, the category collection path is `/categories`).

## Data

Validate with the Zod schema in `src/boxes/aitoolbox/schema.ts`. Slugs are unique kebab-case ids, the filename matches the slug, and URLs are `https`. Category, role, pricing, and platform values must exist in the vocabulary files.

Logos are the tool origin's `/favicon.ico`, with initials as the fallback. Do not use logo.clearbit.com.

Clerk is not wired. `getViewer()` stays signed out unless you are doing the auth follow-up. Builds must succeed with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` unset.

## Commands

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```
