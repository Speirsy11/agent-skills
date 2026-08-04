---
name: visual-verify
description: Use before claiming any change with a visual success criterion is
  done — web UI, PDF/CV layout, charts, generated documents, anything the user
  judges by looking. Fires on "does it look right", "fix the layout/styling",
  "the PDF is broken", or any UI/render task. Render it, read the image, then
  claim.
---

The visual arm of `proof-of-done`: when the contract is *how it looks*, the
evidence is a **rendered image you looked at** — not a 200 response, not "the
CSS is updated". Render the artifact, *read the pixels*, check the specific
claim, and attach the image. The user should never be the one who opens it,
spots the defect, and photographs it back at you.

## Steps

1. **Name the visual claim as a checkable defect.** Not "the CV looks good" —
   "bullets align, no mid-item page split, nothing overflows the margin". Pull
   the specifics from what the user asked or last complained about.
   **Done when:** you have a short list of things to *look for* in the render.

2. **Render the real artifact, after the change.** Produce an actual image with
   whatever runtime this box has:
   - Web page / local HTML → `browse` (`goto` → `screenshot`; `--responsive` or
     resize for mobile). Rebuild/restart the dev server first — a stale server
     serves the old pixels.
   - PDF / CV → render to PDF, then rasterise each page to PNG (`rendercv` for
     CVs, `make-pdf` for documents).
   - Native app / no CLI surface → `codex-computer-use` to screenshot the screen.

     If the render tool is missing, say so — don't claim visually verified without an image.

   **Done when:** you hold a PNG produced after your last edit.

3. **Actually read the image.** Open it and check each item from step 1 against
   the pixels — alignment, spacing, page breaks, overflow, colour, the element
   that was supposed to change. Rendering without looking proves nothing.
   **Done when:** every step-1 item is confirmed present/absent in the image.

4. **Attach it with the claim.** Send the rendered image in the same message as
   "done", so the user sees what you saw. If a defect remains, the task isn't
   done — iterate, don't report.
   **Done when:** the reader can judge the result from your message alone.

## "Make it look like X"

When the target is a reference (a design, another page, a mockup): capture **X**
and the **current state** and compare them **side by side** before iterating.
Iterating against a remembered impression of X is how drift creeps in — put both
images in front of yourself each round.

## Why this exists

The logs show a recurring loop: agent claims a visual bug fixed → user opens it
→ user photographs the defect → sends it back (the RenderCV bullet/page-split
saga, the apfel-bench *"Its not fixed"* loop). Every instance was preventable by
rendering and looking *before* claiming. This skill is that gate; it satisfies
`proof-of-done` for any visual claim. For data/schema changes that a UI renders,
pair it with `frontend-parity`, which finds *which* surfaces to re-render.
