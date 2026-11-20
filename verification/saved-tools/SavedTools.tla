----------------------------- MODULE SavedTools -----------------------------
(***************************************************************************)
(* Saving a tool to "My box".                                              *)
(*                                                                         *)
(* Browser: SavedSession.change in src/engine/ui/session.tsx. Clicks on    *)
(* SaveToggle and the WebMCP save_tool / unsave_tool tools                 *)
(* (src/engine/agent.ts) all go through it, and it never waits for an      *)
(* earlier request before it sends the next one.                           *)
(*                                                                         *)
(* Server: POST in src/app/api/saved/route.ts reads the user with          *)
(* users.getUser, runs applySavedChange (src/engine/saved.ts), and writes  *)
(* the whole privateMetadata back with users.replaceUserMetadata. Node     *)
(* runs other requests between those two awaits.                           *)
(*                                                                         *)
(* One step here is one stretch of code that runs without an await, or     *)
(* one Clerk call. The model assumes Clerk applies each call atomically.   *)
(***************************************************************************)
EXTENDS Naturals, Sequences, FiniteSets

CONSTANTS
    Slugs,        \* tool slugs the catalog knows (knownSlugs() in route.ts)
    Limit,        \* SAVED_LIMIT in src/engine/saved.ts, scaled down
    MaxRequests,  \* POST /api/saved requests the browser sends in one run
    WriteCanFail  \* TRUE: replaceUserMetadata may throw, so route.ts returns 500

VARIABLES
    stored,  \* privateMetadata.saved.aitoolbox in Clerk
    view,    \* slugsRef.current in SavedSession (what the Save buttons show)
    req,     \* request id -> where that POST is
    writes   \* <<action, slug>> of each replaceUserMetadata that landed, in order

vars == <<stored, view, req, writes>>

Ids == 1..MaxRequests
Actions == {"save", "unsave"}

InSeq(s, seq) == \E i \in 1..Len(seq) : seq[i] = s
Remove(seq, s) == SelectSeq(seq, LAMBDA e : e /= s)
ToSet(seq) == {seq[i] : i \in 1..Len(seq)}
DupFree(seq) == \A i, j \in 1..Len(seq) : i /= j => seq[i] /= seq[j]

\* applySavedChange, src/engine/saved.ts:142-167, for a known slug.
Apply(cur, action, s) ==
    IF action = "unsave" THEN [ok |-> TRUE, slugs |-> Remove(cur, s)]
    ELSE IF InSeq(s, cur) THEN [ok |-> TRUE, slugs |-> cur]
    ELSE IF Len(cur) >= Limit THEN [ok |-> FALSE, slugs |-> <<>>]
    ELSE [ok |-> TRUE, slugs |-> <<s>> \o cur]

\* The optimistic list in SavedSession.change, session.tsx:90-95.
Optimistic(cur, action, s) ==
    IF action = "unsave" THEN Remove(cur, s)
    ELSE IF InSeq(s, cur) THEN cur
    ELSE <<s>> \o cur

StartLists ==
    {seq \in UNION {[1..n -> Slugs] : n \in 0..Limit} : DupFree(seq)}

Unsent == [pc |-> "unsent", action |-> "save", slug |-> CHOOSE s \in Slugs : TRUE,
           previous |-> <<>>, result |-> [ok |-> FALSE, slugs |-> <<>>]]

Init ==
    /\ stored \in StartLists
    /\ view = stored          \* the initial GET /api/saved has loaded
    /\ req = [r \in Ids |-> Unsent]
    /\ writes = <<>>

(* session.tsx:88-96. Everything before `await fetch` runs in one go:   *)
(* remember `previous`, show the optimistic list, send the POST.        *)
(* Requests take ids in send order.                                     *)
Send(r, action, s) ==
    /\ req[r].pc = "unsent"
    /\ IF r = 1 THEN TRUE ELSE req[r - 1].pc /= "unsent"
    /\ req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = "sent", !.action = action,
                                           !.slug = s, !.previous = view]]
    /\ view' = Optimistic(view, action, s)
    /\ UNCHANGED <<stored, writes>>

(* route.ts:48-50. users.getUser reads Clerk; applySavedChange is pure.  *)
(* A save past the cap returns 400 here and never writes.               *)
Read(r) ==
    /\ req[r].pc = "sent"
    /\ LET res == Apply(stored, req[r].action, req[r].slug) IN
         req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = IF res.ok THEN "read" ELSE "replied",
                                             !.result = res]]
    /\ UNCHANGED <<stored, view, writes>>

(* route.ts:51-52. replaceUserMetadata writes the list computed in Read. *)
Write(r) ==
    /\ req[r].pc = "read"
    /\ stored' = req[r].result.slugs
    /\ writes' = Append(writes, <<req[r].action, req[r].slug>>)
    /\ req' = [req EXCEPT ![r].pc = "replied"]
    /\ UNCHANGED view

(* route.ts:53-54. replaceUserMetadata throws; Clerk is unchanged; 500. *)
WriteFails(r) ==
    /\ WriteCanFail
    /\ req[r].pc = "read"
    /\ req' = [req EXCEPT ![r] = [@ EXCEPT !.pc = "replied",
                                           !.result = [ok |-> FALSE, slugs |-> <<>>]]]
    /\ UNCHANGED <<stored, view, writes>>

(* session.tsx:104-118. Responses can arrive in any order. Success sets *)
(* the list from the body; an error puts back `previous`.               *)
Deliver(r) ==
    /\ req[r].pc = "replied"
    /\ view' = IF req[r].result.ok THEN req[r].result.slugs ELSE req[r].previous
    /\ req' = [req EXCEPT ![r].pc = "delivered"]
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
