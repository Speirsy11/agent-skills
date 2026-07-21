---
name: model-routing
description: Use when spawning a subagent, worker, reviewer, or coding CLI;
  creating a cron job; configuring an agent; or picking a model/effort level.
  Route by task shape instead of inheriting a default, package delegated work,
  and escalate on evidence. Fires on "delegate", "spawn", "which model/effort".
---

Model and effort are a *decision*, not a default. The logs show both failure
directions: a small model (minimax-m3) ran a **70× higher tool-error rate** doing
multi-step orchestration it couldn't handle, while Codex ran **xhigh effort 3×
more than all other efforts combined** — including "reply OK" probes. Choose by
task shape; make the choice explicit; escalate when evidence says the choice was
wrong.

## Routing matrix

| Task shape | Route | Effort |
|---|---|---|
| Single-step, short-context, format-tolerant (classify, summarise, reminder check, one mechanical edit) | small / cheap model | off / low |
| Bounded vertical slice with a test oracle — one package, known design, tests define done | general model | medium |
| Ambiguity, hidden state, blast radius, cross-repo/multi-service, recovery after lost context | strong supervisor | high; reserve xhigh for genuinely hard reasoning |

**Hard limits on small models:** never multi-step tool orchestration, never
precise anchored text edits, never prompts over ~30k tokens (OpenRouter 402'd on
context 4×). Whole-file writes over anchored edits where they must edit at all.

**Cross-model where independence matters** — reviews, verification, second
opinions. Use `second-opinion` rather than judging work with the same model that
produced it.

## Delegating work

1. **Score the task** on ambiguity, blast radius, statefulness, and oracle
   strength — that scores map onto the matrix above.
2. **Discover the runtime's real controls** before dispatching: role, model/agent
   profile, thinking level, timeout, context handoff. Use only parameters the
   runtime supports — do **not** invent a `model` argument a `spawn` call doesn't
   expose. Where the model can't be set per-call, pick the agent profile or
   parent model that fits.
3. **The strongest agent supervises.** It owns decomposition and the final
   verification; cheap workers execute bounded slices, they don't own ambiguous
   orchestration.
4. **Build a task packet for each worker:** objective, inputs (paths not pasted
   blobs — saves context), allowed scope, ≤5 steps, a done-if test, a
   fail-and-report rule, and the output schema.
5. **Record the route** (model + effort + why) and **escalate one tier** on the
   first ambiguity signal or the second identical failure — don't retry a weak
   worker forever.

## When to escalate

**Immediately:** destructive/irreversible state, security/credentials/money,
ambiguous target among multiple apps, architecture with broad downstream impact,
a supervisor that must survive a session boundary (hand to `long-horizon-run`).

**After evidence:** second identical failure, lost process handle or missing
context, acceptance conflicts with current state, worker claims success but the
verifier disagrees, runtime/schema differs from the task packet.

Cron jobs state their model and why in the job definition; a job that repeatedly
errors gets escalated a tier, not retried forever (`cron-hygiene`).
