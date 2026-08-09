# agent-config contributor instructions

## Repository shape

- Keep skills exactly one category deep at `skills/<category>/<skill>/SKILL.md`.
- The current skill categories are `development`, `homelab`, and `misc`. Do not add or rename a category without the owner's decision.
- Store reusable instruction fragments under `instructions/<category>/` with frontmatter understood by `src/catalog.mjs`.
- Keep the CLI dependency-free unless a dependency provides a clear, reviewed benefit.

## TypeScript safety

- Never use `as any`, `as unknown as T`, unchecked assertions, or non-null assertions merely to silence TypeScript.
- Narrow unknown values with runtime validation, discriminated unions, type guards, or a better API and type design.
- If an assertion is unavoidable at an external boundary, isolate it, validate first, explain why it is safe, and test the boundary.

## Installer safety

- Preserve user-owned text outside the managed `AGENTS.md` block.
- Never overwrite a changed or unmanaged skill destination unless `--force` is explicit.
- Keep the `CLAUDE.md` adapter as `@AGENTS.md`; do not duplicate shared instructions there.
- Discover skill categories from the filesystem so future owner-selected categories require no CLI code change.

## Verification

- Run `npm test` and `npm run check` after CLI or catalog changes.
- Exercise the wizard in a disposable project after changing its prompts or install behavior.
- Confirm `npx skills@latest add . --list` still discovers exactly 42 skills after moving skill directories.
