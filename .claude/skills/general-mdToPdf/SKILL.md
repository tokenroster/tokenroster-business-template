---
name: general-mdToPdf
description: >
  Converts the company's markdown files to professional PDF exports using a
  clean print stylesheet. Use whenever the user asks to export, convert, or
  generate a PDF from markdown, regenerate sales PDFs, or mentions general-mdToPdf
  or one-pager export. Handles single files and batch export of sales/collateral/1-pager one-pagers.
---

# Markdown to PDF

Converts `.md` source files to PDF using the one-pager print layout. Colors and fonts come from the brand tokens (see Step 4), so the PDF follows the company's brand once it has one and a consistent default look until then.

> Setup note: this skill needs its own npm install before first use, see Step 2. Delete this note once done.

---

## Step 1: Identify scope

**Single file:** user provides a path (e.g. `sales/collateral/1-pager/onepager-founders.md`)

**Batch:** all sales one-pagers when user says "regenerate PDFs" or "export all one-pagers":

```bash
node .claude/skills/general-mdToPdf/scripts/export-pdf.js --all-one-pagers
```

**Output convention:**

- `sales/collateral/1-pager/*.md` → `sales/collateral/1-pager/output/[same-basename].pdf`
- Other `.md` files → same folder as source, `.pdf` extension

---

## Step 2: Verify prerequisites

Before exporting, confirm:

1. Node.js 18+ installed (`node -v`)
2. Dependencies installed once, from this skill's `scripts/` folder: `npm install` (installs `playwright` and `marked` per `package.json`, not done automatically when this template is copied)
3. Chromium available (`npx playwright install chromium` on first run, from the same `scripts/` folder)
4. `company.json` at the repo root has a non-empty `domain` (written by the `general-companySetup` skill)

---

## Step 3: Run the export

From repo root:

```bash
# Single file
node .claude/skills/general-mdToPdf/scripts/export-pdf.js sales/collateral/1-pager/onepager-founders.md

# Multiple files
node .claude/skills/general-mdToPdf/scripts/export-pdf.js sales/collateral/1-pager/onepager-founders.md sales/collateral/1-pager/onepager-investors.md

# All one-pagers
node .claude/skills/general-mdToPdf/scripts/export-pdf.js --all-one-pagers

```

---

## Step 4: Print styling

Styling is split in two, so this skill never needs editing to apply a company's brand:

| Layer | File | Owns |
|---|---|---|
| Brand tokens | `marketing/brand/brand-tokens.css` (the company's), else `assets/default-brand-tokens.css` (this skill's default) | Every color and font: `--brand-ink`, `--brand-accent`, `--brand-font-body`, and the rest |
| Layout | `assets/one-pager-print.css` | Sizes, spacing, and which token each element uses |

`export-pdf.js` loads the company's `brand-tokens.css` if it exists. If not, it uses the default tokens and prints a warning, so a PDF made before the brand is defined still looks consistent but is flagged as not yet on-brand. Once `brand-guidelines.md` is written, `general-companySetup` writes `brand-tokens.css` from it with the same variable names, and every later export picks it up automatically.

| Element | Treatment |
|---------|-----------|
| Typeface | `--brand-font-display` for headings, `--brand-font-body` for everything else |
| Title, section headings | `--brand-ink` |
| Tagline, links, accent lines | `--brand-accent` |
| Body, footer | `--brand-ink-secondary`, `--brand-ink-tertiary` |
| Tables | `--brand-accent-strong` header, alternating `--brand-accent-tint` rows |
| Callouts, dividers | `--brand-accent-tint` background, `--brand-accent-strong` rule |

One accent per brand, not one per audience: never add per-document color variants.

Feature table column headers must be written in the markdown source, the export script does not inject them.

If layout breaks, fix CSS selectors (`table`, `h1 + h3`, `blockquote`, `hr`) before editing markdown.

The CTA-contact-line selector near the bottom of `one-pager-print.css` contains a `{{COMPANY_DOMAIN}}` token. Don't replace it by hand: `export-pdf.js` fills it at render time from `domain` in `company.json` at the repo root, and exits with an error if that field is empty.

---

## Step 5: Quality checks

- [ ] PDF has white background, headings and accents in the brand's colors
- [ ] If the export warned it used the default look, tell the user the PDF isn't on-brand yet
- [ ] Tables fit within page width without clipping
- [ ] Feature tables include column headers in the markdown source
- [ ] Header and footer dividers render correctly
- [ ] Footer confidentiality line renders at bottom
- [ ] Output saved to correct path
- [ ] File size reasonable (< 500 KB for a one-pager)

Web fonts load through the `@import` at the top of the tokens file, so rendering needs network access. If fonts fail offline, bundle font files under `marketing/brand/fonts/` and swap the `@import` in `brand-tokens.css` for `@font-face` rules.

---

## Step 6: After export

Confirm to the user:

- Source file(s) processed
- Output PDF path(s)
- Any layout issues noticed

When exporting sales collateral: edit the `.md` source first, then regenerate. PDFs in `sales/collateral/1-pager/output/` are exports, not source of truth.

---

## Related skills

- [general-onePager](../general-onePager/SKILL.md): creates the markdown source; run general-mdToPdf after saving a new one-pager
- [general-pitchDeck](../general-pitchDeck/SKILL.md): reuses this skill's Playwright/Chromium install for its own rendering
