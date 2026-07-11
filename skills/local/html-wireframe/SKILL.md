---
name: html-wireframe
description: Turn an idea into a live, clickable high-fidelity HTML mockup shown
  on a canvas node — multiple styled screens you can click through. Use to mock
  up a UI, wireframe a screen or flow, or see a near-final layout before building.
---

Build a high-fidelity, clickable HTML mockup and show it live on a canvas node
so it can be reacted to fast. Builds on the **canvas** skill (the display
surface). This is visual + navigation exploration with fake data — when the
question turns to real logic or state behaviour, graduate to the **prototype**
skill.

1. **Clarify the frame.** Which screens and the flow between them, plus the one
   question the mockup answers (layout? flow? look?). One or two questions, then
   build.
2. **Build styled screens.** Real colours, spacing, and typography — near-final
   look, with realistic placeholder content. One HTML file per screen, linked
   with plain anchors so the flow is click-through. Write files under
   `~/.openclaw/canvas/`.
3. **Present on canvas** with liveReload via the **canvas** skill; `snapshot`
   for a shareable still.
4. **Iterate** on reactions — files hot-reload, so change and re-present. Keep
   it disposable; don't wire real logic or backends.
