---
name: second-opinion
description: Get an independent second opinion from the *other* coding agent —
  Claude asks Codex, Codex asks Claude — so work isn't judged by the same model
  that produced it. Use for a cross-check or "second opinion" on a diff, plan,
  decision, or answer, or when another skill needs an independent verify.
---

Route the thing under review to the *other* agent in a fresh, non-interactive
session, so a different model judges it independently.

1. **Detect self.** If `$CLAUDECODE` is set, you're Claude Code → ask **Codex**.
   Otherwise you're Codex → ask **Claude**.
2. **Package artifact + question without leading the witness.** Give the
   diff/plan/decision/answer and the specific question — but *not* your own
   conclusion or the reasoning you want confirmed. State what "good" means
   (acceptance criteria), not what you decided.
3. **Call the other agent non-interactively:**
   - Claude → Codex: `codex exec "<prompt>"` (or `codex review` for a pure diff).
   - Codex → Claude: `claude -p "<prompt>"`.
   Pass large artifacts by file path; capture the full output.
4. **Report back** the other agent's verdict, the issues it caught, and where it
   disagrees with you.
5. **Surface conflicts.** When the two opinions diverge, present both to the user
   side by side — don't silently reconcile or override.
