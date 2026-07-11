---
name: codex-computer-use
description: Delegate to Codex's computer use when Claude Code hits a GUI/desktop
  wall — Codex screenshots the screen and drives apps via mouse/keyboard. Use
  when a task needs clicking, a desktop app, or a browser flow Claude Code can't
  do itself.
---

When a task needs to *operate a GUI* — click through a desktop app, drive a
browser flow, interact with something that has no CLI/API — hand it to Codex's
computer use. Codex screenshots the screen, reasons about it, and drives
mouse/keyboard. This runs only from Claude Code (`$CLAUDECODE` set), delegating
out to Codex.

1. **Confirm it's really a wall.** First exhaust CLI, API, and file paths —
   computer use is slow and drives the real desktop. Only reach here when
   there's genuinely no headless way to do it.
2. **Pick the backend:**
   - Web task → tell Codex to use **Chrome / browser** control (preferred for
     the web).
   - Desktop app → **`@Computer`**, naming the app.
3. **Get the user's OK before any irreversible or side-effecting action**
   (sending, buying, deleting, posting). Read-only navigation and inspection can
   proceed without asking.
4. **Delegate non-interactively:** `codex exec "<instruction>"` with the
   `@Computer`/browser instruction and clear success criteria. On macOS it runs
   in the background without taking over the desktop.
5. **Verify and report.** Confirm the outcome (a screenshot or the resulting
   state), then report what Codex did and whether it met the criteria — don't
   assume success.
