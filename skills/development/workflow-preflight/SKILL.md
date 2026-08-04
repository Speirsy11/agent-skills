---
name: workflow-preflight
description: Shared preflight checklist — capability and environment probes to
  run before expensive, long-running, external, or destructive work. Reference
  reached by other skills, not an autonomous trigger.
disable-model-invocation: true
---

One source of truth for the "is the ground solid?" checks, so every skill that
needs them points here instead of duplicating a checklist. The logs show these
discovered *deep* into runs — a CLI 401 after a claimed resume, missing provider
auth, wrong working directory, absent binaries, a port already in use, a sandbox
boundary. **Probe before the expensive work begins, not after it fails.**

Reached by `long-horizon-run`, `model-routing`, `target-lock`,
`resume-coding-agent`, deployment, and messaging skills. Each parent loads only
the branch it needs.

**Completion criterion:** every capability the run depends on has one *positive*
probe before expensive work starts. Skip branches that don't apply; don't skip
a branch the work relies on.

## Checks

- **Target path & repo state** — correct cwd; clean vs dirty worktree; the branch
  you think you're on.
- **CLI presence & version** — the binary exists; `--version` / `--help` confirms
  the flags and subcommands you're about to use actually exist (don't invent
  flags).
- **Auth** — the credential/token for each external tool is present and valid
  *now* (a 401 after dispatch is the expensive way to learn this).
- **Sandbox & permissions** — write access to the paths you'll touch; the
  operation is inside the sandbox boundary.
- **Services & ports** — required services up; the port you need is free or is
  the one actually serving your target (`target-lock`).
- **Process management** — how you'll start, poll, and stop any child process;
  that its handle is pollable (`long-horizon-run`).
- **Network & quotas** — reachability of external endpoints; headroom on any
  rate/quota-limited dependency, with a fallback if thin (`cron-hygiene`).
- **Delivery channel** — the destination for the final report exists and is
  writable (`delivery-proof`).
