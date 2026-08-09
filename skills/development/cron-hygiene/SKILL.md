---
name: cron-hygiene
description: Use when creating or modifying any scheduled job, reminder, or
  watchdog. Fires it once immediately, makes every run write an outcome, adds a
  dead-man check, and pins the delivery channel — so scheduled work stops failing
  silently. Fires on "set up a daily job", "add a reminder", "schedule a check".
---

Scheduled jobs fail where no one is watching: the logs hold **330 cron runs**
whose failures were always found by the user, not reported by the system — a
missed 7:35 reminder, a 1-minute collector down for an unknown period, briefings
that quietly produced nothing when a quota-limited tool 429'd. A job you can't
see is a job you can't trust.

## Steps

1. **Fire once immediately and show the real output.** Never ship a job that has
   never run — run it now, paste what it produced, confirm it's what you intend to
   recur. (This is `proof-of-done` for scheduled work.)
   **Done when:** the job has executed once and its actual output is shown.

2. **Every run writes an outcome line** — timestamp, success/failure, a one-line
   result — to a durable log the job owns.
   **Done when:** a run leaves a readable trace whether it succeeded or failed.

3. **Add a dead-man check.** A daily sweep reports jobs that errored *or didn't
   fire at all* — the absence of a run must itself notify. A missed reminder
   should page itself, not wait to be noticed missing.
   **Done when:** a job silently not running triggers an alert on its own.

4. **Pin the delivery channel from one registry.** Take the notification
   destination from a single source (the Discord migration happened piecemeal
   across weeks because it wasn't) and verify it via `delivery-proof`.
   **Done when:** the job's output goes to a declared channel, confirmed
   delivered.

5. **No unguarded quota-limited dependencies.** If the job leans on a
   rate/quota-limited tool (Gemini search 429'd ×10 inside daily briefings), give
   it a fallback or the run will quietly yield nothing.
   **Done when:** every external dependency either has a fallback or its failure
   is surfaced, not swallowed.

## Related

Model choice for the job follows `model-routing` (state the model + why in the
job; escalate a repeatedly-erroring job a tier rather than retrying forever).
Alerts the watchdogs raise are handled by `alert-triage`.
