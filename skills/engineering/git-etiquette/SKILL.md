---
name: git-etiquette
description: Use when branching, committing, opening or merging pull requests,
  or replying to code review — the repo-hygiene rules to follow.
---

Match the repo before inventing anything: check the existing branch names,
commit style, and PR format, and follow them wherever a convention is already
in use.

**Branches:** if the repo has no established convention, use
`<type>/<short-description>` in kebab-case, where type is one of `feature`,
`bugfix`, `refactor`, `docs` (pick the closest). E.g. `feature/dark-mode`,
`bugfix/login-redirect-loop`.

**Push freely.** Commit and push additive work on top of existing commits
without asking. The one exception is force-pushing or rewriting
already-published history — that's destructive, not additive, so it needs a
fresh OK every time.

**Merge is the one hard gate.** Never merge without the user's explicit
approval, and only ask once CI and code review have passed.

**After review fixes,** add a follow-up commit rather than force-pushing —
unless the repo clearly prefers a rebased history.

**PR descriptions** must call out anything with operational blast radius:
migrations, config or env-var changes, data backfills, and how to roll back.
