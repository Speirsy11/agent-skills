# agent-skills

A personal collection of [agent skills](https://skills.sh/) for Claude Code,
Codex, and OpenClaw, kept in one repo so they can be synced across machines.

## Layout

```
skills/
├── engineering/   dev workflow — features, review, tdd, planning, tooling
├── productivity/  grilling, handoff, teach, writing skills, CV
└── local/         machine-specific — need this box's infra (homed, canvas, Discord)
```

## Install on another machine

```bash
npx skills add <owner>/agent-skills          # all skills
npx skills add <owner>/agent-skills -s '*'   # pick interactively
```

The `local/` skills assume machine-specific infrastructure and will only work
where that infra exists:

- `create-new-service` → the `homed` homelab registry + AdGuard on this Mac mini
- `html-wireframe` → the OpenClaw `canvas` plugin + connected nodes
- `discord-formatting` → the Rocky/Discord setup

## Provenance

Some skills are third-party, vendored here for a self-contained clone — see
`skill-lock.json` for each one's source (`mattpocock/skills`,
`vercel-labs/skills`, `rendercv/rendercv-skill`). Update them with
`npx skills update`.

Authored here (originals):

- **engineering/** — `git-etiquette`, `add-new-feature`, `review-branch`, `second-opinion`
- **local/** — `create-new-service`, `html-wireframe`

> ⚠️ This repo vendors third-party skills. Keep it **private**, or replace the
> vendored copies with `skill-lock.json` references before making it public.
