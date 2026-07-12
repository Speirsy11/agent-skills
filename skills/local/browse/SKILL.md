---
name: browse
description: Drive a fast headless Chromium from the CLI — navigate, click, fill,
  eval JS, screenshot, snapshot with element refs, responsive checks. Use to
  QA/test a web page or local HTML, verify a deployment, dogfood a flow, or when
  asked to "open in browser", "test the site", or "take a screenshot". Needs
  ~/bin/browse (machine-local, arm64 Mac).
---

`browse` (adapted from gstack, MIT) talks to a persistent headless-Chromium
server — ~100ms per command once warm. If `~/bin/browse` is missing, say so
rather than improvising.

1. **Mind the cwd.** The server keeps per-directory state in `./.gstack/` —
   run from the project you're testing or a scratch dir, never somewhere you'd
   pollute.
2. **Core loop:** `goto <url>` → `snapshot -i` (numbers interactive elements
   as `@e1…`) → act: `click @e3`, `fill @e4 "text"`, `type`, `press`,
   `scroll`, `wait <sel|--networkidle>`.
3. **Inspect:** `text` / `html [sel]` / `links` for content; `js "<expr>"` for
   anything else; `console --errors` and `network` after actions.
4. **Visual:** `screenshot [path]`, `responsive [prefix]` (phone/tablet/desktop
   set), `snapshot -D` to diff against the previous snapshot.
5. **Auth is consequential.** `cookie-import-browser` puts the user's real
   sessions into the headless browser — get their OK first, and treat anything
   beyond reading (submitting, posting, buying) with the same bar as computer
   use: ask before acting.
6. **Finish clean.** Verify what you set out to check (console clean, element
   state, screenshot), report it, and `stop` the server if you started it
   somewhere disposable.

`browse --help` lists the full command set (tabs, dialogs, chain, diff,
cookies, `skill run` for codified scrapers). Runtime:
`~/.local/share/gstack-browse`.
