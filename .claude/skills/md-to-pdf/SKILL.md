---
name: md-to-pdf
description: >
  Converts the company's markdown files to professional PDF exports using a
  clean print stylesheet. Use whenever the user asks to export, convert, or
  generate a PDF from markdown, regenerate sales PDFs, or mentions md-to-pdf
  or one-pager export. Handles single files and batch export of sales/1-pager one-pagers.
---

# Markdown to PDF

Converts `.md` source files to PDF using the default one-pager layout (Helvetica, navy + teal).

> Setup note: this skill needs its own npm install before first use — see Step 2. If you write `marketing/brand/brand-guidelines.md` with different colors/fonts than the default theme below, update `assets/one-pager-print.css` (or add a new file under `assets/themes/`) to match, and delete this note.

---

## Step 1 — Identify scope

**Single file:** user provides a path (e.g. `sales/1-pager/onepager-founders.md`)

**Batch:** all sales one-pagers when user says "regenerate PDFs" or "export all one-pagers":

```bash
node .claude/skills/md-to-pdf/scripts/export-pdf.js --all-one-pagers
```

**Output convention:**

- `sales/1-pager/*.md` → `sales/1-pager/output/[same-basename].pdf`
- Other `.md` files → same folder as source, `.pdf` extension

---

## Step 2 — Verify prerequisites

Before exporting, confirm:

1. Node.js 18+ installed (`node -v`)
2. Dependencies installed once, from this skill's `scripts/` folder: `npm install` (installs `playwright` and `marked` per `package.json`, not done automatically when this template is copied)
3. Chromium available (`npx playwright install chromium` on first run, from the same `scripts/` folder)
4. `company.json` at the repo root has a non-empty `domain` (written by the `tokenroster-company-setup` skill)

---

## Step 3 — Run the export

From repo root:

```bash
# Single file
node .claude/skills/md-to-pdf/scripts/export-pdf.js sales/1-pager/onepager-founders.md

# Multiple files
node .claude/skills/md-to-pdf/scripts/export-pdf.js sales/1-pager/onepager-founders.md sales/1-pager/onepager-investors.md

# All one-pagers
node .claude/skills/md-to-pdf/scripts/export-pdf.js --all-one-pagers

# With a theme (see assets/themes/)
node .claude/skills/md-to-pdf/scripts/export-pdf.js --theme ocean sales/1-pager/onepager-investors.md
```

---

## Step 4 — Print styling

Stylesheet: `.claude/skills/md-to-pdf/assets/one-pager-print.css`

| Element | Treatment |
|---------|-----------|
| Typeface | Helvetica / Arial |
| Title | 26pt bold navy `#0d1b2a` |
| Tagline | 13pt teal `#0e7c7b` |
| Body | 10pt gray `#4a5568` |
| Section headings | 13pt bold navy |
| Accent lines | Italic teal |
| Tables | Dark green headers, alternating light green rows |
| Dividers | Green rule below document header and above footer |

`assets/themes/*.css` (ocean, indigo, crimson, gold, slate) are alternate accent palettes layered on top of the base stylesheet via `--theme`. If you adopt a brand color from `marketing/brand/brand-guidelines.md`, prefer editing the base stylesheet (or adding one matching theme) over spreading multiple accent colors across different documents, one accent per brand is the target, not one per audience.

Feature table column headers must be written in the markdown source, the export script does not inject them.

If layout breaks, fix CSS selectors (`table`, `h1 + h3`, `blockquote`, `hr`) before editing markdown.

The CTA-contact-line selector near the bottom of `one-pager-print.css` contains a `{{COMPANY_DOMAIN}}` token. Don't replace it by hand: `export-pdf.js` fills it at render time from `domain` in `company.json` at the repo root, and exits with an error if that field is empty.

---

## Step 5 — Quality checks

- [ ] PDF has white background, headings and accents in the theme's colors
- [ ] Tables fit within page width without clipping
- [ ] Feature tables include column headers in the markdown source
- [ ] Header and footer dividers render correctly
- [ ] Footer confidentiality line renders at bottom
- [ ] Output saved to correct path
- [ ] File size reasonable (< 500 KB for a one-pager)

If fonts fail offline, bundle font files in `assets/fonts/` and add `@font-face` rules to the CSS.

---

## Step 6 — After export

Confirm to the user:

- Source file(s) processed
- Output PDF path(s)
- Any layout issues noticed

When exporting sales collateral: edit the `.md` source first, then regenerate. PDFs in `sales/1-pager/output/` are exports, not source of truth.

---

## Related skills

- [one-pager](../one-pager/SKILL.md) — creates the markdown source; run md-to-pdf after saving a new one-pager
- [pitch-deck](../pitch-deck/SKILL.md) — reuses this skill's Playwright/Chromium install for its own rendering
