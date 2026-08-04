---
name: skillify
description: Codify the scrape flow that just succeeded in this session into a
  permanent browser-skill (runs in ~200ms via "browse skill run"). Use when the
  user says /skillify after a successful scrape. Needs ~/bin/browse
  (machine-local).
---

Turn the last successful `/scrape` prototype into a permanent browser-skill
(adapted from gstack, MIT). Iron contract: **never write a half-broken skill
to disk** — it tests green or it's discarded.

1. **Provenance guard.** Only codify a flow that succeeded *in this session*,
   from its final working commands — drop failed selector attempts and
   unrelated calls. Nothing to codify → say so and stop.
2. **Propose name + triggers** (3 phrases a user would actually say) and the
   host domain; confirm with the user.
3. **Write the skill** under `~/.gstack/browser-skills/<name>/`:
   - `script.ts` — a **pure** `parseFromHtml(html)` parser plus a `main()`
     that does the browse calls (goto → html → parse → print one JSON doc).
     Mirror the bundled reference:
     `~/.local/share/gstack-browse/browser-skills/hackernews-frontpage/script.ts`.
   - `_lib/browse-client.ts` — byte-identical copy of
     `~/.local/share/gstack-browse/browse/src/browse-client.ts` (self-contained,
     no version drift).
   - `fixtures/<host>-<date>.html` — the page HTML the prototype parsed.
   - `script.test.ts` — replays `parseFromHtml` against the fixture, asserts
     shape and a known value. No daemon needed.
   - `SKILL.md` — frontmatter: `name`, one-line `description` (what data it
     returns), `host`, `triggers:` list, `args: []`, `source: agent`,
     `trusted: false`.
4. **Prove it.** `bun test` the skill dir, then `$B skill run <name>`
   end-to-end ($B = `~/bin/browse`). Both green → confirm to the user with
   the run output. Either red → delete the dir and report why.
