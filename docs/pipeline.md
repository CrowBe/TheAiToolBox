# Tool data pipeline

`pnpm pipeline` reads one candidates file and/or every saved tool URL, fetches only those pages, and writes quote-backed catalog updates. It does not crawl links, run a browser, or call a model. Field rules are in the README under "Tool data pipeline".

## Run locally

```bash
pnpm pipeline -- data/pipeline/candidates/2026-11-23.json --report data/pipeline/report.md
pnpm pipeline -- --check-existing --report data/pipeline/report.md
pnpm pipeline -- data/pipeline/candidates/2026-11-23.json --check-existing --report data/pipeline/report.md
```

`data/pipeline/report.md` is gitignored. Pass a candidates file, `--check-existing`, or both. `--tools` and `--vocab` override the catalog directories. `--date YYYY-MM-DD` sets `lastChecked` (default is today, UTC).

The candidates file matches `data/pipeline/candidates.schema.json`. `data/pipeline/candidates.example.json` is a shape sample, not a file the workflow runs.

## Exit codes

| Exit | Meaning |
| --- | --- |
| 0 | Catalog files changed. stdout prints `pipeline-changed=1`. The report starts with `<!-- pipeline-changed: 1 -->`. |
| 3 | Nothing changed. stdout prints `pipeline-changed=0`. The report starts with `<!-- pipeline-changed: 0 -->`. |
| 1 | Bad candidates file or bad arguments. |

The GitHub Actions workflow treats exit 3 as success. It does not open a pull request, and it does not comment. Exit 1 fails the job. Exit 0 continues to the checks below.

## GitHub Actions

`.github/workflows/tool-pipeline.yml` uses only `GITHUB_TOKEN`. It does not read other secrets, call a paid API, or call a model.

Triggers:

- **push** of an added or edited `data/pipeline/candidates/*.json` on any branch except `pipeline/**`.
- **workflow_dispatch** with optional `candidates_path` (`data/pipeline/candidates/<date>.json`) and optional `check_existing`.
- **schedule** Friday ~21:30 Australia/Sydney, `--check-existing` only. Actions cron is UTC and does not follow daylight saving. `30 10 * * 5` is 21:30 AEDT (UTC+11, roughly October through April) and 20:30 AEST (UTC+10, roughly April through October).

One run is in progress at a time (`concurrency: tool-pipeline`). A second run waits.

On exit 0 the job runs `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`. If those pass, it commits files under `data/tools` on `pipeline/<UTC date>-<run id>` and opens one pull request to `main`. The body is the CLI report (field, value, source, and quote, then Gaps), plus a short note about `GITHUB_TOKEN`. The hidden marker `<!-- pipeline-source: ... -->` records the candidates path, or `check-existing` when there is no file.

If an open pull request from a `pipeline/` branch already has that marker, the job force-updates that branch to the commit it just ran on, plus one new catalog commit, and edits the pull request body. It does not open a second pull request. Pipeline branches are bot-owned; a force-with-lease update replaces earlier commits on that branch.

The job never merges, never enables auto-merge, and never approves.

Pushes this workflow creates do not start it again. `pipeline/**` is excluded from the push trigger, catalog commits only touch `data/tools`, and their subject starts with `pipeline:`. A push that still arrives on `pipeline/**`, or whose tip subject starts with `pipeline:`, exits successfully without running the CLI.

## Curator handoff

The Curator is a separate bot. This workflow does not run it.

The handoff is a git push of one day's file:

1. Write `data/pipeline/candidates/<YYYY-MM-DD>.json` so it validates against `data/pipeline/candidates.schema.json`. `date` matches the filename. Each candidate has `toolName`, `postUrl`, `links`, and an optional `thread`. URLs are `https`, and the host must contain a dot.
2. Push that file to a branch in this repository. Base the branch on current `main`. The catalog pull request is opened from that commit, so other commits on the branch would be part of the diff against `main`.
3. Change one candidates file per push. Zero added or modified files ends quietly. Two or more fails the job.
4. Use any branch name other than `pipeline/**`. Do not start the commit subject with `pipeline:`.

The workflow checks out that commit and runs `pnpm pipeline -- <file>`. The Curator chooses the URLs. This job only fetches the URLs in the file (and, on the weekly schedule or when `check_existing` is set, each saved tool URL).

## `GITHUB_TOKEN` and CI

Pull requests and pushes created with the default `GITHUB_TOKEN` do not start other workflows. `.github/workflows/ci.yml` will not run on the `pull_request` or `push` event for a catalog pull request opened by this workflow. The pipeline job has already run typecheck, lint, test, and build.

`ci.yml` also runs `pnpm audit --prod --audit-level=high`. The pipeline job does not.

Ways to run CI on that pull request. None of these are wired as secrets in `tool-pipeline.yml`:

- Open the pull request with a personal access token or a GitHub App installation token instead of `GITHUB_TOKEN`. Events from those tokens can start `ci.yml`.
- Run `.github/workflows/ci.yml` with `workflow_dispatch` on the `pipeline/...` branch. `workflow_dispatch` still runs when the caller is `GITHUB_TOKEN`. This workflow does not dispatch it.

This repository does not store a personal access token or a GitHub App key for the pipeline.
