---
name: context-guard
description: Use during any long session before context runs out — long tool
  loops, large outputs, multi-stage plans, compaction warnings, or resuming from
  a handoff/auto-summary. Checkpoint durable facts before saturation, then
  validate the restored state against reality before acting on it.
---

Context loss erases the *precise* things — exact constraints, live handles, the
obligation to report back — while keeping the vague task. The logs show sessions
running out mid-epic and resuming from an auto-summary that had dropped the
detail. Checkpoint **before** saturation, and never trust a restored summary
without re-checking reality.

## Steps

1. **Watch the risk.** Track message/tool volume, large blobs, repeated logs, and
   how much plan remains. Rising toward the limit is the trigger — don't wait for
   the forced compaction.
   **Done when:** you notice saturation approaching rather than hitting it.

2. **Checkpoint durable facts, not narration.** Persist: objective, current
   stage, exact constraints, decisions made, live handles, changed files, tests
   run and their state, and the next action. Replace raw tool output with concise
   facts and file references — **never copy secrets** into the checkpoint.
   **Done when:** a fresh agent could resume from the checkpoint without asking
   what the task, target, constraints, or live state are.

3. **Refresh only on meaningful change.** Update the checkpoint when state
   actually moves, not every turn — stale sediment is as bad as no checkpoint.
   **Done when:** the checkpoint reflects the latest real state, no more.

4. **After compaction or resume, validate before acting.** Compare the restored
   contract to the live system — probe the process, the git state, the file — to
   confirm the saved status still holds. A restored "server running" is a
   hypothesis until you poll it.
   **Done when:** the restored contract has been reconciled against reality and
   any drift corrected before the next action.

## Relation to save/restore and long runs

Where `context-save` / `context-restore` are user-invoked artifacts, this guard
fires **autonomously before overflow** and should reuse their checkpoint schema
as the single source of truth. For work that spans *sessions or scheduling*
(not just a full window), that's `long-horizon-run`; a context-limit tool error
routes here from `tool-recovery`.
