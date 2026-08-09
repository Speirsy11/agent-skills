---
name: codex-computer-use
description: Use when an agent hits a GUI/desktop wall — a task needs clicking,
  a desktop app, or a browser flow with no CLI/API. Routes it to Codex computer
  use, which screenshots the screen and drives apps via mouse/keyboard.
  Requires a Mac with the Codex app's computer use configured.
---

When a task needs to *operate a GUI* — click through a desktop app, drive a
browser flow, interact with something that has no CLI/API — route it to Codex's
computer use, which screenshots the screen, reasons about it, and drives
mouse/keyboard. If you *are* Codex, use it directly (step 2's backends); any
other agent delegates via `codex exec` (step 4). Either way it needs a Mac with
the Codex app's computer use set up — if `codex` is missing or unconfigured,
say so rather than improvising.

1. **Confirm it's really a wall.** First exhaust CLI, API, and file paths —
   computer use is slow and operates real apps with real accounts. Only reach
   here when there's genuinely no headless way to do it.
2. **Pick the backend:**
   - Web task → tell Codex to use **Chrome / browser** control (preferred for
     the web).
   - Desktop app → **`@Computer`**, naming the app.
3. **Get the user's OK before any irreversible or consequential action** —
   sending, buying, deleting, posting, but also logging in, uploading, or
   granting permissions. Read-only navigation and inspection can proceed
   without asking.
4. **Delegate non-interactively** (skip if you're Codex): `codex exec
   "<instruction>"` with the `@Computer`/browser instruction and clear success
   criteria. On macOS it runs in a background session rather than seizing the
   active desktop — but it's still operating real apps.
5. **Verify and report.** Confirm the outcome (a screenshot or the resulting
   state), then report what Codex did and whether it met the criteria — don't
   assume success.
