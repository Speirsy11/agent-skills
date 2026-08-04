---
name: target-lock
description: Use before changing or verifying anything when more than one app,
  port, repo, route, dashboard, or channel could be meant — lock the exact
  target and its acceptance contract first. Fires when nearby systems can be
  confused, or any user-visible change where "which one" isn't unambiguous.
---

Before editing, pin down **which system** you are changing and **what
observable result** proves the request — then verify on *that same surface*. The
logs show work landing on the wrong thing: a UI fix served on one port while the
user watched another; a dashboard's date range changed before the real bug was
understood. A correct fix on the wrong target is still a failure.

## Steps

1. **Record the target.** Write down, explicitly: repo/service, runtime, exact
   URL/route/port, data source, the visible element that must change, and the
   user identity if it matters. If any field is a guess, resolve it before
   editing — when a request names existing work ("the job we set up", "our UI
   package"), locate that artifact and confirm it *is* the target rather than
   building something new.
   **Done when:** every field is a known value, not an assumption.

2. **Turn the request into binary acceptance items.** Each clause of what the
   user asked becomes a check that is unambiguously true or false on the locked
   target. Keep this ledger visible through the work.
   **Done when:** the request is a list of pass/fail checks, nothing left as
   prose.

3. **Map edit surface to runtime surface.** Confirm the file you're editing is
   what the running target actually serves — watch for generated/built assets,
   forks, copies, and stale processes serving old code. Editing source that the
   live target never loads is the classic wrong-surface miss.
   **Done when:** you know the path from your edit to the pixels/bytes the user
   sees.

4. **Implement, then verify on the locked target in the user's modality.**
   Rebuild/restart as needed and check each acceptance item the same way the
   user would — UI → look at the page (`visual-verify`), message → read the
   channel (`delivery-proof`), data → query it. Add one **negative check**: prove
   the *nearest wrong target* did **not** change, so you know you hit the right one.
   **Done when:** every acceptance item is witnessed on the locked target, and
   the nearest wrong target is confirmed untouched.

## Relation to other skills

This is the "which system" lock; `frontend-parity` is the "which consumers of
the data" sweep once the system is fixed. Both feed the evidence `proof-of-done`
demands. Use `target-lock` whenever multiple candidates exist for repo, port,
route, dataset, or delivery channel.
