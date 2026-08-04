---
name: scrape
description: Pull structured data off a web page as JSON, read-only, via the
  headless browse CLI. Use for "scrape X", "get the list of Y from <site>",
  "pull the prices/titles/links from this page". Needs ~/bin/browse
  (machine-local).
---

One entry point for getting data off the web (adapted from gstack, MIT).
`$B` = `~/bin/browse`. Two paths:

1. **Intent.** The request is the intent ("top stories on Hacker News"). If
   missing, ask once — further questions belong in the prototype loop where
   they're cheaper.
2. **Read-only by contract.** If the intent implies writes — submit, post,
   log in, order, delete — refuse and point at the browse skill's primitives
   with the user driving. Cookie/auth flows need explicit user OK first.
3. **Match path (~200ms).** `$B skill list`, then `$B skill show <name>` for
   plausible matches. Confident match = domain, described data, and declared
   args all cover the intent → `$B skill run <name> [--arg k=v]`, emit its
   JSON, stop. Ambiguous → prototype instead of guessing.
4. **Prototype path (~30s).** `$B goto <url>` → `$B text` or `$B html` (for
   structured rows) or `$B links` (for URLs) → iterate selectors. Emit one
   JSON document with a stable shape — `{ "items": [...], "count": N }`.
5. **Output discipline.** One JSON document; logs and commentary stay out of
   it — callers may pipe it to `jq`.
6. **Failure is a report, not a partial.** If 3–4 selector attempts don't
   yield a sensible shape, say what you tried and what's blocking
   (JS-rendered, paywalled, lazy-loaded) and ask how to proceed. Never emit a
   half-result as done, and never suggest codifying a broken flow.

After a successful prototype, add exactly one line: "Say /skillify to make
this a permanent skill (200ms next call)." No more nudging than that.
