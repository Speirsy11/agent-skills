---
name: git-etiquette
description: Use when branching, committing, opening or merging pull requests,
  or replying to code review — the repo-hygiene rules to follow.
---

Match the repo before inventing anything: check the existing branch names,
commit style, and PR format, and follow them wherever a convention is already
in use.

**Branches:** the default branch is `main` — name it that in new repos, and if
a repo you just created (not yet shared or published) came up as `master`,
rename it. Never rename the default branch of an established repo without
being asked. If the repo has no
established convention for work branches, use `<type>/<short-description>` in
kebab-case, where type is one of `feature`, `bugfix`, `refactor`, `docs` (pick
the closest). E.g. `feature/dark-mode`, `bugfix/login-redirect-loop`.

**Push freely — on a work branch.** Commit and push additive work on top of
existing commits without asking, but don't commit directly to the default
branch unless the user asks or the repo clearly works that way. If a push is
rejected as non-fast-forward, fetch and reconcile — never force-push past it.
Force-pushing or rewriting already-published history is destructive, not
additive, so it needs a fresh OK every time.

**Merge is the one hard gate.** Never merge without the user's explicit
approval, and only ask once CI and code review have passed.

**After review fixes,** add a follow-up commit rather than force-pushing —
unless the repo clearly prefers a rebased history.

**PR descriptions** must call out anything with operational blast radius:
migrations, config or env-var changes, data backfills, and how to roll back.
