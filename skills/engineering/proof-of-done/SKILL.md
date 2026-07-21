---
name: proof-of-done
description: Use before claiming any task is done, fixed, working, deployed, or
  collected — including claims about work from an earlier session. Fires on
  "done", "fixed", "it's working", "deployed", "all collected", or any status
  report a user acts on. The exit gate other engineering skills reach for.
---

A completion claim must ship the **evidence** that proves it, generated *after*
the final change, in the **same message** as the claim. A diff is not evidence —
it shows what you *wrote*, not what the system now *does*. If you cannot produce
evidence, you have not finished; say **"changed but not verified"** and stop.

This is the exit gate. `add-new-feature`, `implement`, `diagnosing-bugs`,
`cron-hygiene`, and any run that ends in a status report should reach it before
declaring done. It is harness-portable (Claude Code, Codex, OpenClaw); the
Claude-only `verify` skill is the deeper version of step 2 — use it there.

## The rule

1. **Name the contract.** What must be *observably* true for this claim to
   hold? Translate the request into the exact surface the user experiences — an
   endpoint's response, a row count, a rendered page, a delivered message, a
   green test, a running process. Not "the code compiles"; *the thing the user
   asked for now behaves the way they asked.*
   **Done when:** you can state the claim as a binary check against a real
   surface, not against source.

2. **Exercise that surface, after the change.** Run the check against the
   *running* system, not the code you edited. Rebuild/restart first if a server
   caches (a dev server will happily serve the old behaviour). Capture the raw
   result — command output, HTTP response, the count, the log line, the
   screenshot. Evidence from *before* the fix, or inferred from the diff, does
   not count.
   **Done when:** you hold output produced after your last edit that directly
   answers step 1's check.

3. **Ship the evidence with the claim.** Put the captured result in the same
   message as "done". If it passed, show what passed. If it didn't, the claim
   was false — go back to work, don't soften the wording.
   **Done when:** the reader can see the proof without asking for it.

## Evidence by claim type

| Claim | Not evidence | Evidence |
|---|---|---|
| "Bug fixed" | the diff, "should work now" | the failing case re-run, now passing |
| "Endpoint/service works" | code changed, build passed | actual request → actual response, after restart |
| "Data collected / migrated" | "the job ran" | the `COUNT(*)` / row sample, run now |
| "Deployed" | push succeeded | remote SHA + health check / live URL fetched |
| "UI renders correctly" | localhost served 200 | rendered screenshot, *read*, checked for the specific defect (see `visual-verify`) |
| "Message/report sent" | message tool returned | message ID or read-back from the channel (see `delivery-proof`) |
| "Tests pass" | "tests should pass" | the test run output, this run |

## Claims about past work

"It was fixed before", "all the data's already collected", "that's still
running" — these are the highest-risk claims because the evidence is oldest.
**Re-verify against the live system before repeating them.** A memory of a prior
success is a hypothesis, not proof; the user is asking precisely because reality
may have drifted. Run step 2 fresh, then answer.

## When you genuinely can't verify

Some surfaces are unreachable from here (no credentials, no device, an external
party must act). Do not upgrade "I made the change" into "it works". State
exactly three things: **what you changed**, **what you could not check and why**,
and **the one command or action that would confirm it**. That is an honest
completion; a bare "done" on unverified work is not.
