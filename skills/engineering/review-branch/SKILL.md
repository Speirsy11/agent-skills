---
name: review-branch
description: Review a branch/diff on two axes — Standards (repo conventions, code
  smells, correctness) and Spec (does it do what the issue/PRD asked?) — via
  parallel sub-agents. Use to review a branch, a PR, or "review since X".
---

Review `git diff <fixed-point>...HEAD` on two axes, run as parallel
`general-purpose` sub-agents (so they don't pollute each other's context), then
report side by side. Never rerank across axes — a change can pass one and fail
the other. To *apply* or *post* findings, hand off to the built-in
`/code-review` (`--fix` applies, `--comment` posts inline PR comments, `ultra`
for a deep cloud review).

1. **Pin the fixed point.** Commit/branch/tag/merge-base the user names (ask if
   unspecified). Verify it resolves and the diff is non-empty before spawning.
2. **Find the spec.** Issue refs in commits (`#123`) → a path the user gave →
   a PRD/spec under `docs/`, `specs/`, `.scratch/`. If none, Spec reports "no spec".
3. **Find the standards.** `CODING_STANDARDS.md` / `CONTRIBUTING.md` if present.
   Always also apply the Fowler smell baseline (repo standards override it; each
   smell is a judgement call; skip what tooling enforces): mysterious name,
   duplicated code, feature envy, data clumps, primitive obsession, repeated
   switches, shotgun surgery, divergent change, speculative generality, message
   chains, middle man, refused bequest.
4. **Spawn both axes in parallel** (one message, two Agent calls):
   - **Standards** — correctness bugs first (logic, edge cases, races), then
     documented-standard breaches (cite the rule) and baseline smells (name +
     quote the hunk). Mark hard violations vs judgement calls. <400 words.
   - **Spec** — (a) required behaviour missing/partial, (b) scope creep not
     asked for, (c) requirements implemented wrong. Quote the spec line each. <400 words.
5. **Aggregate** under `## Standards` and `## Spec`, verbatim. End with per-axis
   finding counts + the worst issue in each. No cross-axis winner.
