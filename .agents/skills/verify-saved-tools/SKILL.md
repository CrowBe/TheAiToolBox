---
name: verify-saved-tools
description: Formal check of saved tools and the sign-in redirect. Use before you finish any change to POST/GET /api/saved (src/app/api/saved/route.ts), src/engine/saved.ts, src/engine/save-view.ts, SavedSession.change in src/engine/ui/session.tsx, the WebMCP save_tool/unsave_tool/list_saved tools in src/engine/agent.ts, or the `next` redirect in src/auth/next-path.ts and src/auth/email-code.tsx. Runs a TLA+ model of the per-user read-modify-write against Clerk privateMetadata.saved.<box>, plus exhaustive checks on the real code.
---

# Verify saved tools and the sign-in redirect

## What is checked

**Saved tools (TLA+ model plus real-code checks).** The model covers every
order in which up to 3 overlapping `POST /api/saved` requests can run on one
Node process, and every order in which their replies can reach the browser.

| Property | Plain words | Status |
|---|---|---|
| `CapHolds` | The stored list never grows past `SAVED_LIMIT` (500). | holds |
| `NoDuplicates` | The stored list never holds a slug twice. | holds |
| `SavedChangesPersist` | A save the server answered 200 is not silently undone by a request about a different tool. | holds |
| `ViewMatchesServer` | Once every reply has arrived, the Save buttons agree with Clerk. | holds |

Harm if these break: a user or an agent saves tools, gets "Saved", and after a
reload some of them are gone, or the buttons show tools as saved that are not.

`mutant-lost-update` and `mutant-stale-view` put the old bugs back into the
model. Each must fail. See "Old bugs" below.

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

The run takes about 15 seconds. The first run downloads TLA+ tools v1.7.4
(`tla2tools.jar`, sha256 pinned in the script) and, on Linux x86_64 without
Java 11+, Temurin JRE 21.0.13.1+2 (sha256 pinned). Both go into
`~/.cache/tb-fv` (override with `TB_FV_TOOLS`). After that it needs no network.
`pnpm install` must have run.

Exit 0 and `OK: matches the skill's recorded state` mean all of these:

- `holds` passes: `TypeOK`, `CapHolds`, `NoDuplicates`, `SavedChangesPersist`, and `ViewMatchesServer` over 680,512 states.
- `mutant-no-cap` and `mutant-no-dedupe` fail. These are broken copies of the model, and their failing shows that the cap and dedupe properties can fail.
- `mutant-lost-update` fails `SavedChangesPersist`, and `mutant-stale-view` fails `ViewMatchesServer`. These put the old bugs back. Their failing shows the properties still catch those bugs.
- vitest on `verification/**/*.verify.ts` passes. That covers the `Apply` conformance check, the route replay (two overlapping saves both persist), and the redirect check.

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
git diff SYNC_COMMIT -- src/app/api/saved/route.ts src/app/api/saved/user-lock.ts src/engine/saved.ts src/engine/save-view.ts src/engine/ui/session.tsx src/engine/agent.ts src/auth/next-path.ts src/auth/email-code.tsx src/proxy.ts
```

## Coverage record

Sync commit: **SYNC_COMMIT** (Serialize saved-tool writes and settle the buttons from the newest reply).
At that commit the model and checks were confirmed against these files.

| Code | Covered by | How it maps |
|---|---|---|
| `src/app/api/saved/route.ts` `POST`; `src/app/api/saved/user-lock.ts` `withUserLock` | `SavedTools.tla` `Read`, `Write`, `WriteFails`; `route-replay.verify.ts` | `withUserLock` is the guard on `Read`: a request may read only while no other request for that user is in `read` (it has computed a write that is not stored yet). `users.getUser` and the pure `applySavedChange` call are the rest of `Read`. A 400 releases the lock and does not write. `users.replaceUserMetadata` is `Write`. It stores `savedVersion` one higher than the value just read; under the lock that is `Len(writes)+1` in the model. The `catch` that returns 500 is `WriteFails`. The replay test confirms each POST does one `getUser` then, on success, one `replaceUserMetadata`, and that two overlapping saves of different tools both persist with `theme` and `saved.hardware` left in place. |
| `src/engine/saved.ts` `applySavedChange`, `cleanSlugs`, `normalizeSlug`, `SAVED_LIMIT`, `readSavedVersion` | `Apply` in the model; `apply.verify.ts` | Exhaustive over all duplicate-free lists of 3 slugs, the same lists padded to 498, 499, and 500 entries, both actions, and every slug. The real result must equal `Apply` at the real cap and leave other metadata keys alone, including an existing `savedVersion`. Messy stored values must still produce a clean list. The route, not `Apply`, increments `savedVersion`. |
| `src/engine/save-view.ts` `optimisticSlugs`, `beginSave`, `receiveSaveReply` | `Optimistic`, `Send`, `Deliver`, `Settle` | `Send` is `beginSave` (optimistic list, one more request in flight). `Deliver` is `receiveSaveReply`: the buttons stay optimistic until every reply in the batch has arrived, then show the list from the highest `version`, or `confirmed` if every reply failed. `save-view.test.ts` (`pnpm test`) replays the old stale-snapshot traces on these functions. |
| `src/engine/ui/session.tsx` `SavedSession.change` | `Send`, `Deliver` | `change` calls `beginSave` before `await fetch` and `receiveSaveReply` on the JSON body. It does not restore the list it snapshotted at send time. `session-save.test.tsx` (`pnpm test`) drives two overlapping replies through the component. |
| `src/engine/agent.ts` `savedCatalogTools` (`save_tool`, `unsave_tool`) | `Send` | These tools call `browserSavedStore.change`, which is the same `change`. They can send any action for any slug while another request is in flight, which is why `Send` allows any action and slug and does not wait. |
| `src/auth/next-path.ts` `safeNextPath`; `src/auth/email-code.tsx` (`safeNextPath(params.get("next"))` then `router.replace(nextPath)`) | `next-path.verify.ts` | Runs the real function. The oracle is `new URL(out, base).origin`. |

## Old bugs the mutants still catch

**F1, lost update, is fixed in the product and fails again if the lock is removed.**
`replaceUserMetadata` overwrites the whole `privateMetadata` and Clerk has no
compare-and-swap. `POST` used to read the user, compute the new list, and write
that list back, and a second request could read in between. `mutant-lost-update`
deletes the lock guard (`req[o].pc /= "read"` becomes `TRUE`). TLC's shortest
trace (7 states), starting from Clerk holding `[cursor]`:

1. The browser sends "save cursor". It reads `[cursor]` (already saved, so the computed list stays `[cursor]`) and holds that write.
2. The browser sends "save claude". With the lock gone it also reads `[cursor]` and computes `[claude, cursor]`.
3. The claude write lands. Clerk holds `[claude, cursor]`.
4. The cursor write lands, still computed from the old read. Clerk holds `[cursor]`. claude is gone, though its save was answered 200.

The route replay on the fixed handler starts both saves together. The second
waits until the first `replaceUserMetadata` finishes, both answer 200, and
Clerk ends on `[claude, cursor]`.

**F2, stale buttons, is fixed in the product and fails again if a reply writes its own snapshot.**
`change` used to remember `previous` at send time and restore it on any error,
and a success replaced the buttons with that reply's list even when a newer
reply had already been applied. `mutant-stale-view` makes `Settle` do that
again (`req[r].result.slugs` on success, else `req[r].previous`). TLC's shortest
trace (7 states, cap scaled to 2):

1. Clerk holds `[claude, grok]`, which is full. The browser sends "save cursor". The buttons show it saved, and this request's snapshot is `[claude, grok]`.
2. The read is a 400 (cap). Before the reply is applied, the browser sends "save cursor" again. This request's snapshot is `[cursor, claude, grok]`.
3. Reply 1 is applied and the buttons roll back to `[claude, grok]`.
4. Reply 2 is also a 400. The buttons roll back to `[cursor, claude, grok]`. cursor shows as Saved, but Clerk does not hold it.

On the fixed path both failures leave the buttons on `[claude, grok]`, and a
late 200 with an older `version` does not replace a newer list. The buttons
keep the optimistic list until every reply in the batch has arrived.

**Remaining gap.** The lock lives in the Node process (`user-lock.ts`). Two
server processes do not share it, so two isolates can still lose an update.
Clerk's API offers no conditional write, so this cannot be closed without a
store of our own. One browser session's buttons follow the newest `version`
among that session's own replies. A save made in another tab shows up on the
next load (`GET /api/saved`), not in this session's open batch.

## Real bug or modeling error?

When a check fails unexpectedly, map each step of the trace to code. Each
step must match code that runs without an `await` in between: `Send` is
`session.tsx` from the start of `change` through `beginSave`, up to
`await fetch`. `Read` is `getUser` plus `applySavedChange`, and it runs only
while this user has no computed write waiting. `Write` is
`replaceUserMetadata`. `Deliver` is `receiveSaveReply` after
`await response.json()`.

- If every step can happen in the code, it is a real bug. Prove it on the real handler the way `route-replay.verify.ts` does: release the gated Clerk calls in the trace's order. Report it with the trace. Do not weaken the property.
- If a step cannot happen in the code (for example, the code now holds a lock or queue the model lacks), the model is out of date. Fix the model to match the code, not the other way round.
- If `apply.verify.ts` fails, the real `applySavedChange` no longer does what `Apply` says. Either the change is a bug, or it is intended, in which case update `Apply` in both `SavedTools.tla` and `modelApply` in `apply.verify.ts` the same way.
- If `next-path.verify.ts` fails, the error message names the input, the output, and the off-origin URL. Treat that as a real open redirect.

## When the change is intended

- **The lock or the settle rule.** `SavedChangesPersist` and `ViewMatchesServer` stay in `holds.cfg`. `run.sh` builds `mutant-lost-update` by replacing `req[o].pc /= "read"` with `TRUE`, and `mutant-stale-view` by replacing the one-line body of `Settle`. Keep that `Settle` line on one line. If you change the route or `receiveSaveReply`, those mutants must still fail on the old bugs.
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
- Network failures before the server runs, failures in `getUser`, and partial Clerk writes. The model assumes each Clerk call is atomic and that a failed `replaceUserMetadata` changes nothing. A reply the browser never reads looks like a failure, so the buttons can return to `confirmed` even though that write landed.
- The per-user lock across processes. Two isolates can still lose an update. Other writers of `privateMetadata` (anything besides this `POST`) race the same way, because `replaceUserMetadata` replaces the whole object.
- A second tab's buttons. They are a second client. This session does not pull in that tab's writes until the next load.
- Sign-out mid-request, `clerkMiddleware`/`src/proxy.ts`, and whether `auth()` returns the right user.
- The redirect check covers strings of up to 5 pieces from the list above, not every string. It does not cover Clerk's own redirect handling, or the `signInHref` built in `session.tsx`.
