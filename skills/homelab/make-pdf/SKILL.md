---
name: make-pdf
description: Turn a markdown file into a publication-quality PDF (or
  self-contained HTML / DOCX) — real margins, cover page, clickable TOC,
  watermark, page numbers, accessible tagging. Use for "make a PDF", "export
  this document", or polishing a report/memo/essay for sharing. Needs
  ~/bin/make-pdf and the browse Chromium runtime (machine-local).
---

`make-pdf` (adapted from gstack, MIT) renders markdown through headless
Chromium. If `~/bin/make-pdf` is missing, say so rather than improvising.

1. **Generate:** `make-pdf generate <input.md> [output.pdf]`. Defaults: 1in
   margins, letter, page numbers, tagged/accessible PDF.
2. **Common flags:** `--cover` and `--toc` for documents with structure;
   `--watermark DRAFT` for drafts; `--page-size a4`; `--margins 2cm`;
   `--no-chapter-breaks` if H1s shouldn't start new pages;
   `--to html|docx` for other formats (html = single self-contained file).
   A CONFIDENTIAL footer is on by default — `--no-confidential` to drop it,
   and ask which the user wants if it's going outside their org.
3. **Iterate fast:** `make-pdf preview <input.md>` renders to HTML in the
   browser instead of regenerating the PDF each round.
4. **Verify, don't assume.** Check the output exists and spot-check it
   (`pdftotext` or open it) — page breaks and wide tables are the usual
   casualties. Report the file path and size.
