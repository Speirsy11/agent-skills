---
id: testing-and-verification
title: Testing and verification
description: Prove changes with project checks and the real user-visible surface.
default: true
---

- Discover and run the repository's own validation, coverage, boundary, and formatting commands before claiming work complete.
- Exercise real integrations when the requirement depends on them. Compilation alone is not proof of runtime behavior.
- For UI or generated documents, establish a usable test path and inspect the rendered result at the relevant sizes.
- Tests that share state must use uniquely owned records and row-scoped setup, cleanup, and assertions. Never truncate shared tables or assert against unfiltered global state.
- Report the exact checks run and their observed outcomes.
