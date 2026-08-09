---
name: long-horizon-run
description: Use for work that must run unattended past one turn — "keep going
  until finished", timed/overnight runs, "money making mode", monitoring a child
  process, or any loop expected to outlive the session. Persist a run contract
  and durable state; survive waiting, scheduling, and session loss; prove the
  callback.
---

Work that must outlive one turn needs **durable state on disk**, not an
ephemeral session or an invisible sleep. The logs show both halves failing: a
loop kept alive by pinging the model every 2 minutes paid full context **101
times**; a scheduled run's monitor was garbage-collected, no completion report
arrived, and the work's true state (done, but with an auth failure) was only
found by direct inspection later.

## Steps

1. **Write the run contract** to a file: terminal condition (what "finished"
   means — a clock, a queue drained, a state reached), stop/block rules, commit
   cadence, update cadence, and the delivery channel for the final report. This
   is the single authoritative source — when the user changes "stop each stage"
   to "finish the plan", update *this*, don't carry stale stops.
   **Done when:** a fresh agent could read the file and know exactly when to stop
   and how to report.

2. **Create durable state, keyed idempotently:** task, repo, branch, live
   handle, start time, last evidence, next check — plus a work queue, a done
   list, and a deferred-questions list. Chunks are sized in **work items, not
   minutes**; each chunk reads the state, does one item, writes it back.
   **Done when:** the run's progress lives in a file that survives a restart.

3. **Prove the handle is pollable before saying "started."** Don't report a
   process/job as running off a handle you haven't confirmed responds.
   **Done when:** you've polled the handle and seen it answer.

4. **No early exit.** A finished sub-task that wants user input **defers the
   question to the final summary** — it never ends the run. Only the terminal
   condition, reached and verified, concludes it. Progress pings go out at the
   contract's cadence (default 30 min), not per chunk.
   **Done when:** the loop only stops on the terminal condition or an explicit
   blocker, with questions parked for the wrap-up.

5. **If the monitor disappears, inspect durable outputs** — git/PR, the job's
   log, the message channel — **before** classifying the outcome. A vanished
   monitor is not a failed task. Then send the final callback and **verify its
   delivery** (`delivery-proof`) before closing out the durable state.
   **Done when:** the terminal condition is verified, callback delivery is
   evidenced, and no live handle or state is left orphaned.

## Use the native mechanism

Prefer the harness-native loop where it exists — Claude Code `/loop` /
`ScheduleWakeup`, OpenClaw cron (`cron-hygiene`) — over hand-rolled screen loops
or a driver that re-pays full context every tick. For continuity *within* a long
session (compaction, not scheduling), pair with `context-guard`.
