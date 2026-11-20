# The AI Tool Box

A searchable, filterable catalog of AI tools. The list lives in the repo as JSON. There is no database, API server, or codegen step.

This is the first of a family of catalogs (benchmarks, inference engines, consumer hardware, quant). The shared pieces are a **box config** and the catalog engine. This repo only ships AIToolBox.

## Stack

- Next.js (App Router) and React, TypeScript strict
- Tailwind CSS
- Zod for the catalog schema
- pnpm
- Deploy on Vercel from the repo root with no extra config

## Layout

```
data/tools/                  one JSON file per tool
data/vocabularies/           categories, roles, pricing models, platforms
src/engine/                  schema-driven search, filters, validation, and pages
src/boxes/aitoolbox/         this site's config, Zod schema, and loader
src/app/                     Next.js routes wired to that config
src/auth/                    signed-out Clerk seam
```

`src/engine` does not mention tools, categories, or this site's copy. It takes a `BoxConfig`: site name and description, which fields are searchable, which fields are filterable labels and how they render, card and detail fields, and vocabulary lists. Pages, filters, and validation all read that config. A later catalog can add its own folder under `src/boxes` and reuse the engine.

Routes follow the config: items are `/tools/[slug]` because `item.path` is `/tools`, and categories are `/categories` because that collection's `path` is `/categories`.

## Prerequisites

- Node.js 22+
- pnpm 10 (`corepack enable && corepack prepare pnpm@10.33.4 --activate`)

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## How to add a tool

1. Add `data/tools/<slug>.json`. The filename must match `slug`.
2. Use a `category`, `roles`, `pricingModel`, and `platforms` that already exist under `data/vocabularies/`. Add a vocabulary entry first if you need a new one.
3. Run `pnpm test`. It checks the schema, unique slugs, https URLs, and vocabulary references.

Example:

```json
{
  "slug": "example-tool",
  "name": "Example Tool",
  "tagline": "One sentence on what it does.",
  "description": "A short paragraph for the detail page.",
  "url": "https://example.com",
  "category": "writing-tools",
  "roles": ["writer"],
  "pricingModel": "freemium",
  "pricingDetails": "Free tier. Pro is $10/month.",
  "platforms": ["web"],
  "tags": ["drafting"],
  "launchedYear": 2024,
  "accentColor": "#0E5F59"
}
```

Logos are not stored. The card tries `https://<tool-domain>/favicon.ico` and falls back to initials. `logo.clearbit.com` is not used.

Platforms were labelled at port time from each tool's tags, with a short override list for desktop apps, CLIs, libraries, and well-known mobile apps. Edit the JSON to correct them.

## Schema

| Field | Type | Used for |
| --- | --- | --- |
| `slug` | kebab-case id | Identity, filename, `/tools/[slug]` |
| `name` | string | Title, search, sort |
| `tagline` | string | Card subtitle, search |
| `description` | string | Detail body, search |
| `url` | `https://` URL | Detail link and favicon |
| `category` | category id | Filter, card, `/categories/[slug]` |
| `roles` | role id[] | Audience filter (`?audience=`) |
| `pricingModel` | pricing id | Filter (`?pricing=`), card |
| `pricingDetails` | string | Detail page |
| `platforms` | platform id[] | Filter (`?platform=`) |
| `tags` | kebab-case id[] | Filter (`?tag=`), search |
| `launchedYear` | number | Filter (`?year=`), card |
| `accentColor` | `#RRGGBB` | Initials background |

Filters combine with AND across fields and OR inside a field. Every label is a multi-select combobox with typeahead. Search is a command list: the query filters the catalog, and choosing a row opens the tool. Press Cmd+K or Ctrl+K from any page to jump to a tool without changing the current filters. The home page writes filters and the query to the URL, so a filtered view can be shared. Category pages lock that category and still sync the other filters. The open catalog list is virtualized.

## Browser agents

When the browser exposes `document.modelContext`, the page registers three read-only WebMCP tools derived from the box config: `search_tools`, `get_tool`, and `list_labels`. The names follow the box noun, so another catalog gets the same tools with its own words. Browsers without the API are unchanged. Saving a record is not registered; that waits on sign-in.

To try it in Chrome, enable the `enable-webmcp-testing` flag at `chrome://flags/#enable-webmcp-testing`, relaunch, and reload the site. In DevTools, `await document.modelContext.getTools()` lists the tools.

## Environment

No variables are required to build or browse.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Reserved for a later Clerk sign-in. Unset today. |
| `CLERK_SECRET_KEY` | Reserved for that same change. Unset today. |

`src/auth` is the seam. `getViewer()` is signed out, and `AuthBoundary` renders its children. Saved tools are not built yet; they should read that viewer.

## Deployment

Import the repo in Vercel. Framework preset: Next.js. Root directory: the repository root. Do not set a database URL.

`vercel.json` sets the framework to Next.js and clears the install command, build command, and output directory. The linked project still had the old monorepo build (`pnpm db:deploy` and `apps/web/dist/public`). Those `null` values return it to the Next.js defaults.

## CI

`.github/workflows/ci.yml` runs `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm audit --prod --audit-level=high` on pull requests.

## Supply chain

pnpm refuses package versions published less than a day ago (`minimumReleaseAge` in `pnpm-workspace.yaml`). Do not lower it. `pnpm install` is required; npm and yarn are blocked.
