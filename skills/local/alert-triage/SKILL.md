---
name: alert-triage
description: Use when an Uptime Kuma / homed / watchdog alert arrives — start
  from the monitor's own history and runbook, not a fresh diagnosis every time.
  Third occurrence of the same alert becomes a root-cause task. Needs this box's
  homelab infra (Uptime Kuma, homed, Dozzle).
---

The logs show the same alert re-triaged from scratch each time it fired (Dozzle
DOWN ×3, Gateway ×2) — and the alert script's own `docker compose ps` timing out
in every one of those incidents. During the one OrbStack outage `homed` existed
for, it showed no data. Alerts should get *smarter* each time they fire, not
restart the same guesswork.

## Steps

1. **Start from history, not diagnosis.** First action on any alert: check this
   monitor's incident history and runbook. Seen it before? Apply the known fix
   and note the recurrence — don't re-derive it.
   **Done when:** you know whether this exact alert has fired before and what
   fixed it last time.

2. **Apply the known fix, or diagnose a genuinely new one.** For a first-time
   alert, diagnose (`diagnosing-bugs`), then **write what actually fixed it to
   the per-monitor runbook before closing** — so the next occurrence hits step 1.
   **Done when:** the incident is resolved *and* its fix is recorded in the
   runbook.

3. **Third occurrence = root-cause task.** The same alert firing a third time is
   not "restart again" — open a root-cause task. A repeated restart is not a
   resolution.
   **Done when:** a thrice-recurring alert has a root-cause task, not a third
   restart.

4. **Fix the alerting's own failures.** If the alert script itself is broken
   (the Dozzle handler's `docker compose ps` timed out every time; `homed`
   returned no data during OrbStack's outage), that's part of the incident —
   an observability tool that fails during the event it exists for is the
   priority bug.
   **Done when:** the tools used to triage the alert actually worked during it.

## Related

The watchdogs that raise these alerts are created under `cron-hygiene` (which
gives them dead-man checks so a *missing* run alerts too). Notifications route
through `delivery-proof` to the declared channel.
