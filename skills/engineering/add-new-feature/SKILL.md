---
name: add-new-feature
description: Use when adding a feature end-to-end — branch, implement, self-review,
  open a PR, resolve review, and merge. Fires on "add a feature", "ship this",
  or /add-new-feature.
---

Orchestrate the feature and delegate the heavy phases to subagents so this
context stays clean. Follow the **git-etiquette** skill throughout — branch
naming, PR format, merge gate.

1. **Branch.** Pull the default branch, create a task-type branch
   (git-etiquette).
2. **Implement.** Delegate to a subagent that builds the feature test-first with
   the **tdd** skill. Brief it with the spec, the branch, and repo conventions;
   it returns a summary of the diff and how it verified.
3. **Verify green.** Re-run the full test suite and typecheck/build yourself —
   don't trust the worker's summary. Send failures back before moving on.
4. **Self-review.** Run the **review-branch** skill on the diff (Standards +
   Spec against the feature spec). Where practical, run its sub-agents on a
   *different model* from the step-2 implementer — two models are less likely to
   share the same blind spot. Address blocking findings (loop back to a step-2
   worker if needed) before opening the PR.
5. **Open the PR.** Push and open (no approval needed); write the description
   with a summary, how you verified, and git-etiquette's risk callouts.
6. **Resolve review.** Poll the PR every ~5 min via the **loop** skill until
   CodeRabbit and human reviewers have commented. For each: reply, push a
   follow-up fix, re-request review. Done when every thread is resolved or
   agreed non-blocking.
7. **Merge.** Once CI is green and review has passed, ask for explicit approval,
   then merge and delete the branch.
