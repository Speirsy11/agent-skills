---
id: architecture-and-data
title: Architecture and trusted data
description: Preserve variation points and derive facts from authoritative sources.
default: false
---

- Preserve the intended variation points of an abstraction. Do not hard-code assumptions from the current provider, model, context window, or development setup when broader implementations are expected.
- Prefer the smallest design that produces the requested capability. Do not add abstraction without a current, measurable benefit.
- Derive identifiers, ownership, locations, and other trusted metadata from the authoritative store, never from model or client assertions.
- Represent unsupported, unavailable, empty, limited, and failed outcomes distinctly when callers must respond differently to them.
