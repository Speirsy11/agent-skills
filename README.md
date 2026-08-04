# agent-config

A personal, reusable configuration library for coding agents. Instructions and
skills live together, but remain independently selectable when installing into
a project.

## Layout

```text
agent-config/
├── instructions/
│   ├── development/  coding, architecture, testing, and delivery rules
│   └── misc/         cross-cutting agent behaviour
├── skills/
│   ├── development/  software delivery workflows and developer tooling
│   ├── homelab/      machine and homelab-specific workflows
│   └── misc/         general-purpose and productivity workflows
├── bin/              CLI entrypoint
└── src/              dependency-free installer
```

Skill categories are directory-driven. Add or move a skill at
`skills/<category>/<skill>/SKILL.md` and the wizard discovers it automatically.
This one-category level also keeps the repository compatible with the upstream
`skills` CLI.

## Install into the current project

Run the wizard from any project directory:

```bash
npx github:Speirsy11/agent-config add
```

After the package is published to npm, the equivalent command is:

```bash
npx @speirsy/agent-config@latest add
```

The wizard walks through:

1. instruction packs;
2. skill categories;
3. individual skills in each chosen category;
4. Codex/AGENTS-compatible and Claude Code targets;
5. a final installation summary.

The current directory is the target by default. Use `--target` to install
somewhere else.

```bash
# Preview everything without writing
npx github:Speirsy11/agent-config add --all --dry-run --yes

# Install selected rules and skills without prompts
npx github:Speirsy11/agent-config add \
  --instructions typescript-safety,testing-and-verification \
  --skills tdd,proof-of-done \
  --agents codex,claude \
  --yes

# Install every development skill
npx github:Speirsy11/agent-config add \
  --categories development \
  --yes

# See the live catalog
npx github:Speirsy11/agent-config list
```

Run `agent-config --help` for every option.

## What the installer writes

Selected instructions are compiled into a marked block in the project root
`AGENTS.md`. Existing content outside that block is preserved. For Claude Code,
the installer creates or augments `CLAUDE.md` with the documented shared-file
adapter:

```text
@AGENTS.md
```

Selected skills are copied to:

- `.agents/skills/<name>` for Codex and other AGENTS-compatible agents;
- `.claude/skills/<name>` for Claude Code.

Re-running the installer is idempotent. A skill that still matches the source
is left alone; a locally changed skill is never overwritten unless `--force`
is explicit.

## Skills-only compatibility

The existing skills-only flow remains available:

```bash
npx skills@latest add Speirsy11/agent-config
```

That command installs skills only. Use this repository's `agent-config` wizard
when you also want selectable instruction packs and the shared `AGENTS.md` /
`CLAUDE.md` setup.

## Develop and verify

```bash
npm test
npm run check
node bin/agent-config.mjs add --all --dry-run --yes
```

The CLI has no runtime dependencies and requires Node.js 20 or newer.

## Provenance and credits

Some skills are third-party and vendored for a self-contained install. Their
exact upstream sources remain recorded in `skill-lock.json`.

- [`mattpocock/skills`](https://github.com/mattpocock/skills) (MIT)
- [`vercel-labs/skills`](https://github.com/vercel-labs/skills)
- [`rendercv/rendercv-skill`](https://github.com/rendercv/rendercv-skill)
- [`garrytan/gstack`](https://github.com/garrytan/gstack) (MIT)

Update vendored skills with `npx skills@latest update` and review the resulting
path and content changes before committing them.
