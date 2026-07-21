---
name: frontend-parity
description: Use when a change touches a schema, collection, API response, or
  config that a UI renders — before finishing. Fires on adding/renaming fields,
  changing an endpoint's shape, adding items to a collection, or "the UI didn't
  update". Find every consumer, update them in the same change, rebuild, re-render.
---

A data change is not done when the data layer is done — it is done when every
**surface that renders it** has been updated and *seen* to reflect it. The logs
show this breaking repeatedly (signal-harvester alone, 5×): coins added to a
collection but the UI never updated; `localhost:3003` serving stale behaviour
because the dev server was never rebuilt.

## Steps

1. **Enumerate the consumers.** Grep every UI surface for the fields, endpoints,
   or collection names you changed — web app, mobile, dashboards, README/doc
   examples. Do not rely on memory of "where it's shown".
   **Done when:** you have the full list of files/components that read the
   changed data, with none left to check.

2. **Update them in the same change — or declare the gap.** Bring every consumer
   into parity in this same unit of work. If one is genuinely out of scope, say
   so explicitly ("deferred: mobile view still shows old shape"), don't leave it
   silently stale.
   **Done when:** every consumer is either updated or listed as explicitly
   deferred.

3. **Rebuild and restart the serving process.** Dev servers cache — the running
   process, not the source, is what the user sees. Rebuild/restart before you
   look, or you'll verify a lie (`localhost:3003` did this twice).
   **Done when:** the process serving the page is running your new code.

4. **Re-render and confirm.** Fetch the page and check the changed data actually
   appears — hand off to `visual-verify` to screenshot and read it. This is the
   evidence `proof-of-done` requires.
   **Done when:** the new field/value is visible in a render taken after the
   restart.

## Keep a surfaces list

Maintain a short per-project note of every surface that renders domain data (web
UI, mobile, dashboard, doc examples). Parity then becomes a **checklist you read**
rather than a set you try to recall — recall is exactly what failed here. When
the target *which app/port/repo* is itself ambiguous, lock it first with
`target-lock`.
