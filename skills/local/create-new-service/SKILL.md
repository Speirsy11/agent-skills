---
name: create-new-service
description: Use when standing up a new locally hosted service on the Mac mini
  homelab — create its manager artifact, register it in homed, verify health.
  Fires on "new service", "add a service", "set up <x> on the homelab", or
  /create-new-service.
---

`homed` is a registry and control surface, not a process manager — it will not
create the plist, container, or script for you (schema and driver model:
`~/Developer/homed/README.md`). This skill is the standard sequence so every
service is set up the same way.

Gather first: **name**, **port**, **driver** (`docker` | `launchd` | `screen` |
`process` | `manual`), **intent** (usually `always`), **exposure** (usually
`lan`), and **health** check kind.

1. **Create the manager artifact** for the driver:
   - `docker`: start the container (note its name).
   - `launchd`: write the run script to `~/.openclaw/scripts/<name>` and a
     `~/Library/LaunchAgents/local.<name>.plist`, then `launchctl load` it.
   - `screen`/`process`: write the run script to `~/.openclaw/scripts/<name>`.
   Symlink any script into `~/bin/` (e.g. `start-<name>`).
2. **Register in homed.** Add the service to `~/.config/homed/services.yaml`
   with `driver`, `intent`, `exposure`, `health`, `tags`, and driver `options` —
   match the schema and the surrounding entries.
3. **Validate.** Run `homed config validate` and `homed doctor`; fix whatever
   they flag.
4. **Start and verify.** `homed up <name>`, then `homed status` until manager
   and health badges are both green.
5. **DNS (if lan-exposed).** Add a `<name>.lan` → `192.168.0.192` alias in
   AdGuard.
6. **Document.** Add the service to TOOLS.md. (The homed dashboard at
   `http://127.0.0.1:8765` shows it automatically once registered.)
