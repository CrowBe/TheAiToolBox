----------------------------- MODULE SavedTools -----------------------------
(***************************************************************************)
(* Saving a tool to "My box".                                              *)
(*                                                                         *)
(* Browser: SavedSession.change in src/engine/ui/session.tsx. Clicks and   *)
(* the WebMCP save_tool / unsave_tool tools all call it, and it does not   *)
(* wait for an earlier request before sending the next one. The displayed *)
(* list is beginSave / receiveSaveReply in src/engine/save-view.ts.       *)
(*                                                                         *)
(* Server: POST in src/app/api/saved/route.ts. withUserLock (user-lock.ts) *)
(* lets one read-modify-write per user run at a time in this Node         *)
(* process. Read is users.getUser plus applySavedChange. Write is         *)
(* users.replaceUserMetadata of the whole privateMetadata, including a    *)
(* savedVersion one higher than the value just read. A 400 (cap) never    *)
(* writes. The catch that returns 500 is WriteFails; Clerk is unchanged.  *)
(*                                                                         *)
(* The lock is not shared across processes. This spec is one process.     *)
(* Clerk applies each call atomically and a failed replace writes nothing.*)
(*                                                                         *)
(* One step is one stretch of code with no await, or one Clerk call.      *)
(***************************************************************************)
EXTENDS Naturals, Sequences, FiniteSets

CONSTANTS
    Slugs,        \* tool slugs the catalog knows (knownSlugs() in route.ts)
    Limit,        \* SAVED_LIMIT in src/engine/saved.ts, scaled down
    MaxRequests,  \* POST /api/saved requests one browser sends in one run
    WriteCanFail  \* TRUE: replaceUserMetadata may throw, so route.ts returns 500

VARIABLES
    stored,       \* privateMetadata.saved.aitoolbox in Clerk
    view,         \* slugs the Save buttons show (SaveViewState.view)
    confirmed,    \* SaveViewState.confirmed: last list known to match Clerk
    bestVersion,  \* SaveViewState.best.version, or 0 when this batch has no success
    bestSlugs,    \* SaveViewState.best.slugs
    req,          \* request id -> where that POST is
    writes        \* <<action, slug>> of each replaceUserMetadata that landed, in order

vars == <<stored, view, confirmed, bestVersion, bestSlugs, req, writes>>

Ids == 1..MaxRequests
Actions == {"save", "unsave"}

InSeq(s, seq) == \E i \in 1..Len(seq) : seq[i] = s
Remove(seq, s) == SelectSeq(seq, LAMBDA e : e /= s)
ToSet(seq) == {seq[i] : i \in 1..Len(seq)}
DupFree(seq) == \A i, j \in 1..Len(seq) : i /= j => seq[i] /= seq[j]

\* applySavedChange, src/engine/saved.ts, for a known slug.
Apply(cur, action, s) ==
    IF action = "unsave" THEN [ok |-> TRUE, slugs |-> Remove(cur, s)]
    ELSE IF InSeq(s, cur) THEN [ok |-> TRUE, slugs |-> cur]
    ELSE IF Len(cur) >= Limit THEN [ok |-> FALSE, slugs |-> <<>>]
    ELSE [ok |-> TRUE, slugs |-> <<s>> \o cur]

\* optimisticSlugs in src/engine/save-view.ts.
Optimistic(cur, action, s) ==
    IF action = "unsave" THEN Remove(cur, s)
    ELSE IF InSeq(s, cur) THEN cur
    ELSE <<s>> \o cur

\* receiveSaveReply's choice of the next displayed list.
\* run.sh's stale-view mutant replaces this expression; keep it on one line.
Settle(r, settling, bestV, bestS) == IF settling THEN IF bestV > 0 THEN bestS ELSE confirmed ELSE view

StartLists ==
    {seq \in UNION {[1..n -> Slugs] : n \in 0..Limit} : DupFree(seq)}

Unsent == [pc |-> "unsent", action |-> "save", slug |-> CHOOSE s \in Slugs : TRUE,
           previous |-> <<>>, result |-> [ok |-> FALSE, slugs |-> <<>>], version |-> 0]

Init ==
    /\ stored \in StartLists
    /\ view = stored          \* the initial GET /api/saved has loaded
    /\ confirmed = stored
    /\ bestVersion = 0
    /\ bestSlugs = <<>>
    /\ req = [r \in Ids |-> Unsent]
    /\ writes = <<>>

(* session.tsx change, up to await fetch: beginSave, then send.            *)
(* Requests take ids in send order. Several may be in flight.              *)
Send(r, action, s) ==
    /\ req[r].pc = "unsent"
    /\ IF r = 1 THEN TRUE ELSE req[r - 1].pc /= "unsent"
    /\ req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = "sent", !.action = action,
                                           !.slug = s, !.previous = view]]
    /\ view' = Optimistic(view, action, s)
    /\ UNCHANGED <<stored, writes, confirmed, bestVersion, bestSlugs>>

(* route.ts inside withUserLock: getUser, then applySavedChange.            *)
(* The lock is held while pc = "read" (the computed write is not in yet).   *)
(* A save past the cap returns 400 here, writes nothing, and releases it.   *)
Read(r) ==
    /\ req[r].pc = "sent"
    /\ \A o \in Ids : req[o].pc /= "read"
    /\ LET res == Apply(stored, req[r].action, req[r].slug) IN
         req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = IF res.ok THEN "read" ELSE "replied",
                                             !.result = res]]
    /\ UNCHANGED <<stored, view, writes, confirmed, bestVersion, bestSlugs>>

(* replaceUserMetadata writes the list from Read. savedVersion becomes       *)
(* Len(writes)+1, which is what the route stores under the lock.             *)
Write(r) ==
    /\ req[r].pc = "read"
    /\ stored' = req[r].result.slugs
    /\ writes' = Append(writes, <<req[r].action, req[r].slug>>)
    /\ req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = "replied", !.version = Len(writes) + 1]]
    /\ UNCHANGED <<view, confirmed, bestVersion, bestSlugs>>

(* replaceUserMetadata throws. Clerk is unchanged. The route returns 500.    *)
WriteFails(r) ==
    /\ WriteCanFail
    /\ req[r].pc = "read"
    /\ req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = "replied",
                                           !.result = [ok |-> FALSE, slugs |-> <<>>]]]
    /\ UNCHANGED <<stored, view, writes, confirmed, bestVersion, bestSlugs>>

(* The code after await response.json(). Replies can arrive in any order.    *)
(* Settle keeps the optimistic list until this batch is done, then shows the *)
(* highest version, or confirmed if every reply failed.                      *)
Deliver(r) ==
    /\ req[r].pc = "replied"
    /\ LET newBest == req[r].result.ok /\ req[r].version > bestVersion
           bestV == IF newBest THEN req[r].version ELSE bestVersion
           bestS == IF newBest THEN req[r].result.slugs ELSE bestSlugs
           settling == \A o \in Ids : o = r \/ req[o].pc \in {"unsent", "delivered"}
           nextView == Settle(r, settling, bestV, bestS)
       IN (view' = nextView
           /\ confirmed' = (IF settling THEN nextView ELSE confirmed)
           /\ bestVersion' = (IF settling THEN 0 ELSE bestV)
           /\ bestSlugs' = (IF settling THEN <<>> ELSE bestS)
           /\ req' = [req EXCEPT ![r].pc = "delivered"])
    /\ UNCHANGED <<stored, writes>>

Next ==
    \E r \in Ids :
        \/ \E a \in Actions, s \in Slugs : Send(r, a, s)
        \/ Read(r)
        \/ Write(r)
        \/ WriteFails(r)
        \/ Deliver(r)

Spec == Init /\ [][Next]_vars

-----------------------------------------------------------------------------
(* Properties *)

TypeOK ==
    /\ stored \in Seq(Slugs)
    /\ view \in Seq(Slugs)
    /\ confirmed \in Seq(Slugs)
    /\ bestSlugs \in Seq(Slugs)
    /\ bestVersion \in Nat
    /\ \A r \in Ids : req[r].pc \in {"unsent", "sent", "read", "replied", "delivered"}

\* The stored list never grows past SAVED_LIMIT.
CapHolds == Len(stored) <= Limit

\* The stored list never holds the same slug twice.
NoDuplicates == DupFree(stored)

\* For every slug some write changed, the last write that meant to change
\* it decides whether it is saved. A save the server answered "ok" to is not
\* silently undone by a write about a different tool.
LastWrite(s) ==
    LET ks == {k \in 1..Len(writes) : writes[k][2] = s}
    IN writes[CHOOSE k \in ks : \A j \in ks : j <= k]

SavedChangesPersist ==
    \A s \in Slugs :
        (\E k \in 1..Len(writes) : writes[k][2] = s) =>
            ((LastWrite(s)[1] = "save") <=> InSeq(s, stored))

\* Once every response has arrived, the Save buttons agree with Clerk.
Settled == \A r \in Ids : req[r].pc \in {"unsent", "delivered"}

ViewMatchesServer == Settled => ToSet(view) = ToSet(stored)
=============================================================================
