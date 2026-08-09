---
id: planning-and-scope
title: Planning and scope
description: Align the user flow, then keep implementation units bounded.
default: false
---

- When responsibility between a CLI, UI, service, or operator is unclear, map the end-to-end user flow and assign each step to a surface before coding.
- Preserve a durable master plan, then split large work into PR-sized units with dependencies, owned surfaces, acceptance criteria, exclusions, verification, and checkable status.
- Record the current unit's owned and forbidden surfaces. Do not implement future-unit behavior or change protected modules merely to make the current task easier.
- Answer questions available from the repository yourself. Ask the user only for product decisions the available evidence cannot resolve.
