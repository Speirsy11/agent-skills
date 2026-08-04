---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Before editing, lock the target and acceptance items with **target-lock** when
more than one app/repo/surface could be meant. If you delegate any slice, choose
the worker's model/effort with **model-routing** and hand it a bounded packet.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work — and satisfy **proof-of-done**:
exercise the change on the running system and show the evidence (visual surfaces
→ **visual-verify**) rather than claiming done from the diff.

Commit your work to the current branch.
