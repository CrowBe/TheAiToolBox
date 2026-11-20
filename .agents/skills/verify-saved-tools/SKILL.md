---
name: verify-saved-tools
description: Formal check of saved tools and the sign-in redirect. Use before you finish any change to POST/GET /api/saved (src/app/api/saved/route.ts), src/engine/saved.ts, SavedSession.change in src/engine/ui/session.tsx, the WebMCP save_tool/unsave_tool/list_saved tools in src/engine/agent.ts, or the `next` redirect in src/auth/next-path.ts and src/auth/email-code.tsx. Runs a TLA+ model of the read-modify-write against Clerk privateMetadata.saved.<box>, plus exhaustive checks on the real code.
---

# Verify saved tools and the sign-in redirect

## What is checked

**Saved tools (TLA+ model plus real-code checks).** The model covers every
order in which up to 3 overlapping `POST /api/saved` requests can run, and
every order in which their replies can reach the browser.

| Property | Plain words | Status |
|---|---|---|
| `CapHolds` | The stored list never grows past `SAVED_LIMIT` (500). | holds |
| `NoDuplicates` | The stored list never holds a slug twice. | holds |
| `SavedChangesPersist` | A save the server answered 200 is not silently undone by a request about a different tool. | **fails: finding F1** |
| `ViewMatchesServer` | Once every reply has arrived, the Save buttons agree with Clerk. | **fails: finding F2** |

Harm if these break: a user or an agent saves tools, gets "Saved", and after a
reload some of them are gone, or the buttons show tools as saved that are not.

**Sign-in redirect (bounded exhaustive check on the real function).** Property:
whatever `?next=` the sign-in URL carries, `router.replace(nextPath)` stays on
this origin. Harm if it breaks: an open redirect from our sign-in page to a
phishing site. `next-path.verify.ts` feeds `safeNextPath` every string of up to
5 pieces from 16 URL-significant pieces (`/`, `\`, `%2F`, `%5C`, `%252F`, `%25`,
`:`, `@`, `.`, `a`, space, tab, `%09`, `?`, `#`, U+3000), about 1.1M inputs. It
resolves each result with the WHATWG `URL` parser against
`https://box.example/...` and requires the same origin. Status: holds.

## Run it

```bash
bash verification/run.sh
```

The run takes about 10 seconds. The first run downloads TLA+ tools v1.7.4
(`tla2tools.jar`, sha256 pinned in the script) and, on Linux x86_64 without
Java 11+, Temurin JRE 21.0.13.1+2 (sha256 pinned). Both go into
`~/.cache/tb-fv` (override with `TB_FV_TOOLS`). After that it needs no network.
`pnpm install` must have run.

Exit 0 and `OK: matches the skill's recorded state` mean all of these:

- `holds` passes: `TypeOK`, `CapHolds`, and `NoDuplicates` over 1,238,476 states.
- `mutant-no-cap` and `mutant-no-dedupe` fail. These are broken copies of the model, and their failing shows that the properties can fail.
- `F1-lost-update` and `F2-stale-view` still fail. These are the known findings below.
- vitest on `verification/**/*.verify.ts` passes. That covers the `Apply` conformance check, the route replay (in which F1 still reproduces), and the redirect check.

Any `FAIL` line means something changed. The line names the check and the log
file. Logs go to a temp dir that is printed at the end and never into the repo.

Read every TLC result, a pass or a counterexample, with the pstack
`/statechart` skill. It turns a counterexample into its shortest path in plain
words. On a pass, it draws how the system moves between states.

## Does my change touch this?

The change touches this check if it edits any file in the coverage record or
changes how those files get called. Two examples: a new caller of
`/api/saved`, or a new place that reads `next`. Check with:

```bash
git diff 60c541d -- src/app/api/saved/route.ts src/engine/saved.ts src/engine/ui/session.tsx src/engine/agent.ts src/auth/next-path.ts src/auth/email-code.tsx src/proxy.ts
```

## Coverage record

Sync commit: **60c541d** (Let a new email create an account from the sign-in form).
At that commit the model and checks were confirmed against these files.

| Code | Covered by | How it maps |
|---|---|---|
| `src/app/api/saved/route.ts` `POST` | `SavedTools.tla` `Read`, `Write`, `WriteFails`; `route-replay.verify.ts` | `users.getUser` and the pure `applySavedChange` call form `Read`. `users.replaceUserMetadata` is `Write`. The `catch` that returns 500 is `WriteFails`. The replay test confirms on the real handler that each POST makes exactly one `getUser` call, then one `replaceUserMetadata` call. |
| `src/engine/saved.ts` `applySavedChange`, `cleanSlugs`, `normalizeSlug`, `SAVED_LIMIT` | `Apply` in the model; `apply.verify.ts` | Exhaustive over all duplicate-free lists of 3 slugs, the same lists padded to 498, 499, and 500 entries, both actions, and every slug. The real result must equal `Apply` at the real cap and leave other metadata keys alone. Messy stored values must still produce a clean list. |
| `src/engine/ui/session.tsx` `SavedSession.change` (optimistic update, `previous`, reply handling) | `Send`, `Optimistic`, `Deliver` in the model | Checked by reading the code only. The logic is inline in the component, so no code-level test reaches it. Re-read it by hand on any change. |
| `src/engine/agent.ts` `savedCatalogTools` (`save_tool`, `unsave_tool`) | `Send` | These tools call `browserSavedStore.change`, which is the same `change`. They can send any action for any slug, which is why `Send` allows any action and slug. |
| `src/auth/next-path.ts` `safeNextPath`; `src/auth/email-code.tsx` (`safeNextPath(params.get("next"))` then `router.replace(nextPath)`) | `next-path.verify.ts` | Runs the real function. The oracle is `new URL(out, base).origin`. |

## Known findings (current code, not fixed)

**F1: overlapping saves lose updates.** `POST` reads the user, computes the new
list, and writes the whole `privateMetadata` back. Nothing stops a second
request from reading in between. TLC's shortest trace (7 states):

1. Clerk holds `[]`. The browser sends request 1, "unsave cursor". It reads `[]`.
2. The browser sends request 2, "save claude". It also reads `[]`.
3. Request 2 writes `[claude]` and answers 200.
4. Request 1 writes `[]`, computed from its old read. claude is gone, though its save was answered 200.

`route-replay.verify.ts` replays the same race on the real handler with two
saves. cursor and claude both get 200, and Clerk ends with only `[claude]`.
Ways to reach it: two quick clicks on different Save buttons (`change` does not
wait for the earlier request), two tabs, or an agent making parallel
`save_tool` calls.

**F2: the Save buttons settle on a list Clerk does not hold.** `change` saves
`previous` when it sends a request and restores it on any error. Replies apply
in the order they arrive. TLC's shortest trace (7 states, with the cap scaled
to 2):

1. Clerk holds `[claude, grok]`, which is full. The browser sends "save cursor", the button shows Saved, and `previous` is `[claude, grok]`.
2. Before the reply arrives, the browser sends "save cursor" again, as an agent retrying `save_tool` would. This request's `previous` is `[cursor, claude, grok]`.
3. Reply 1 is a 400 (cap), and the buttons roll back to `[claude, grok]`.
4. Request 2 reads Clerk, and reply 2 is also a 400. The buttons roll back to `[cursor, claude, grok]`. cursor shows as Saved, but Clerk does not hold it.

The same shape happens without the cap. Any failed request that overlaps
another can restore a stale `previous`. A late 200 reply can also overwrite a
newer list.

## Real bug or modeling error?

When a check fails unexpectedly, map each step of the trace to code. Each
step must match code that runs without an `await` in between: `Send` is
`session.tsx` from the start of `change` up to `await fetch`, `Read` is
`route.ts` `getUser` plus `applySavedChange`, `Write` is
`replaceUserMetadata`, and `Deliver` is the code after `await response.json()`.

- If every step can happen in the code, it is a real bug. Prove it on the real handler the way `route-replay.verify.ts` does: release the gated Clerk calls in the trace's order. Report it with the trace. Do not weaken the property.
- If a step cannot happen in the code (for example, the code now holds a lock or queue the model lacks), the model is out of date. Fix the model to match the code, not the other way round.
- If `apply.verify.ts` fails, the real `applySavedChange` no longer does what `Apply` says. Either the change is a bug, or it is intended, in which case update `Apply` in both `SavedTools.tla` and `modelApply` in `apply.verify.ts` the same way.
- If `next-path.verify.ts` fails, the error message names the input, the output, and the off-origin URL. Treat that as a real open redirect.

## When the change is intended

- **Fixing F1 or F2.** The matching check starts failing. For F1, the replay test fails ("F1 reproduces") and `F1-lost-update` passes. Once the model describes the fix, move that invariant into `holds.cfg`, delete its finding cfg and its `expect_violation` line in `run.sh`, and change the replay test so that it requires both saves to survive. A client-side queue in `change` alone does not fix F1, because two tabs or two agents are still two clients. Model more than one client before you call F1 fixed.
- **Changing the steps.** If you add an `await`, move a Clerk call, or add a new Clerk write, update the matching action in `SavedTools.tla` and the replay test's expected call order.
- **Changing the cap, the dedupe, or slug cleaning.** Update `Apply` and `modelApply` together.
- **New redirect sources**, for example a server redirect that reads `next`. Add them to `next-path.verify.ts` or to a sibling check, then add them to the coverage record.

After the update, run `bash verification/run.sh` until it prints `OK`. Then
move the sync commit above to the commit you confirmed, and only after you
have re-read each covered file against its row in the coverage record. For
broader drift, use the pstack `/maintain-formal-verification-skill` skill.

## Not covered

- More than 3 requests, or more than 3 slugs, in the model. The cap is scaled to 2 in the model. `apply.verify.ts` checks the real 500 separately.
- `GET /api/saved` and the initial load in `SavedSession`, including its `revision` guard. The model starts after the load.
- Network failures before the server runs, failures in `getUser`, and partial Clerk writes. The model assumes each Clerk call is atomic and that a failed `replaceUserMetadata` changes nothing.
- Other `privateMetadata` keys. `replaceUserMetadata` overwrites them too, so any future writer of other keys races the same way as F1.
- Sign-out mid-request, `clerkMiddleware`/`src/proxy.ts`, and whether `auth()` returns the right user.
- The redirect check covers strings of up to 5 pieces from the list above, not every string. It does not cover Clerk's own redirect handling, or the `signInHref` built in `session.tsx`.
