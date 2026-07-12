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

**Option A — `skills` CLI** (copies into place, tracked in `.skill-lock.json`):

```bash
npx skills add Speirsy11/agent-skills -a '*' -g -y   # everything
npx skills add Speirsy11/agent-skills                # pick interactively
```

**Option B — clone + symlink** (repo stays the source of truth; `git pull` = update):

```bash
git clone git@github.com:Speirsy11/agent-skills.git ~/Developer/agent-skills

for skill in ~/Developer/agent-skills/skills/*/*; do
  name=$(basename "$skill")
  ln -sfn "$skill" ~/.agents/skills/"$name"                      # agents dir -> repo
  ln -sfn ../../.agents/skills/"$name" ~/.claude/skills/"$name"  # claude -> agents dir
done
```

Claude Code reads `~/.claude/skills/`, which resolves through `~/.agents/skills/`
into the repo — edit or pull in the repo and every agent sees it immediately.

The `local/` skills assume machine-specific infrastructure and will only work
where that infra exists:

- `create-new-service` → the `homed` homelab registry + AdGuard on this Mac mini
- `html-wireframe` → the OpenClaw `canvas` plugin + connected nodes
- `discord-formatting` → the Rocky/Discord setup
- `browse`, `scrape`, `skillify` → the gstack browse runtime at
  `~/.local/share/gstack-browse` + `~/bin/browse` (arm64 macOS binary)
- `make-pdf` → `~/bin/make-pdf` (arm64 macOS binary) + the browse runtime

## Provenance & credits

Some skills are third-party, vendored here for a self-contained clone — see
`skill-lock.json` for each one's exact source. Credit to the original authors:

- [`mattpocock/skills`](https://github.com/mattpocock/skills) (**MIT**) —
  `grilling`, `grill-with-docs`, `handoff`, `teach`, `writing-great-skills`,
  `tdd`, `implement`, `prototype`, `diagnosing-bugs`,
  `improve-codebase-architecture`, `domain-modeling`, `to-tickets`, `wayfinder`,
  `setup-matt-pocock-skills`
- [`vercel-labs/skills`](https://github.com/vercel-labs/skills) — `find-skills`
- [`rendercv/rendercv-skill`](https://github.com/rendercv/rendercv-skill) — `rendercv`
- [`garrytan/gstack`](https://github.com/garrytan/gstack) (**MIT**) —
  `browse`, `scrape`, `skillify`, `make-pdf` are lean rewrites of the gstack
  skills; the `browse`/`make-pdf` binaries are compiled from gstack source
  (v1.60.1.0) into `~/.local/share/gstack-browse` and `~/bin`

Update the vendored copies with `npx skills update`.

Authored here (originals):

- **engineering/** — `git-etiquette`, `add-new-feature`, `review-branch`, `second-opinion`, `codex-computer-use`
- **local/** — `create-new-service`, `html-wireframe`
