---
name: tool-recovery
description: Use the moment a tool call fails, and mandatory after the same
  failure signature happens twice. Classify the error, spend a bounded retry
  budget, change the hypothesis before retrying, and circuit-break instead of
  looping. Fires on any tool error, timeout, non-zero exit, or auth/schema/path
  failure.
---

A repeated tool call with unchanged inputs is not recovery — it is a loop. The
logs show sessions firing three-plus identical calls (15+ in Codex, 25+ in
OpenClaw), burning context and amplifying instability. Recover by
**understanding the failure**, not by hitting the same wall harder.

## Steps

1. **Fingerprint and classify** the error into one of: transient (network,
   flake), auth (401/permission), sandbox/permission boundary, missing
   path/dependency, invalid schema/args, conflict (non-unique edit, merge),
   product failure (a real red test — that's a *result*, not a tool defect), or
   context limit (→ `context-guard`).
   **Done when:** the failure has a named class, not just a message.

2. **Act on the class:**
   - *Transient* → one identical retry with backoff, then reclassify.
   - *Deterministic* (auth, path, schema, conflict, sandbox) → **inspect the
     source of truth before the next call**: read the file, the `--help`/schema,
     the process state, the config, the actual directory. A second identical call
     cannot succeed where the first failed for a deterministic reason.
   **Done when:** you've either consumed the one transient retry or read the
   ground truth a deterministic error requires.

3. **State the changed hypothesis and changed method** before retrying. "The
   edit anchor wasn't unique, so I re-read and will match a larger span" — not a
   silent re-fire. If nothing about the call changes, don't make it.
   **Done when:** the next call differs in inputs or method, with a reason.

4. **Circuit-break on the second unchanged signature.** Stop, consolidate the
   root cause into one message, and escalate (`model-routing`) or report a
   specific blocker. Do not produce a retry storm — for infrastructure errors,
   deduplicate by root signature and raise one alert, not one per occurrence.
   **Done when:** the call succeeds, an alternative proved the needed fact, or a
   single specific blocker is reported with no ongoing retries.

## Boundary with product diagnosis

This skill is for when the **agent's own toolchain** fails — auth, schema, path,
sandbox. When the failing object is the **product** (a real bug in the code under
test), that's `diagnosing-bugs`. A failed edit or a missing command is evidence
about *your tools*, not about the product bug — don't confuse the two.
