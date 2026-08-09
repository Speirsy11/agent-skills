---
id: delivery-and-handover
title: Delivery and handover
description: Carry authorized work through checks while keeping merge gated.
default: true
---

- In an authorized work-branch workflow, commit and push normal task changes without repeatedly seeking approval. Treat merge as the approval gate unless it was already authorized.
- Before merge or publish, resolve actionable review threads, security findings, and required checks, then verify the final remote state.
- A handover must state what changed, the verification performed and observed results, known limitations, unresolved uncertainty, and decisions that may need overruling.
- Preserve weak, empty, slow, looping, or flaky results as findings. Never soften them into success.
