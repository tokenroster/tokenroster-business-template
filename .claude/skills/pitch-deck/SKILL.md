---
name: pitch-deck
description: >
  Builds or updates {{COMPANY}}'s brand-compliant pitch deck as a PDF. Use whenever the
  user asks to create, update, rebrand, or regenerate a pitch deck, or asks to
  add/remove/reorder a slide. Renders via HTML + Chromium, not PowerPoint —
  no LibreOffice or PowerPoint-safe brand fonts required. A PDF gets pixel-accurate
  brand fonts and reuses the same rendering pipeline as md-to-pdf.
---

# {{COMPANY}} Pitch Deck Generator

Produces a widescreen (13.333in x 7.5in) PDF deck styled to `marketing/brand/brand-guidelines.md`:
paper/ink surfaces, a single accent color, and a display/body/mono font trio. Content and
visual engine are separate, this skill owns the engine (`scripts/deck-kit.js`,
`assets/deck-theme.css`); each deck gets its own small build script that calls into it.

> Setup note: before your first deck, put three logo SVGs at `marketing/brand/logos/wordmark.svg`, `mark-tile.svg`, and `mark-ink.svg` (or rename the paths `deck-kit.js` reads them from), and fill in `COMPANY_NAME` near the top of `deck-kit.js`. Delete this blockquote once done.

---

## Step 0 — Verify prerequisites

This skill has its own dependencies, separate from md-to-pdf's, installed once from this
skill's `scripts/` folder:

1. Node.js 18+ installed (`node -v`)
2. `npm install` (installs `playwright` per `package.json`)
3. `npx playwright install chromium` (first run only)

---

## Step 1 — Read the source of truth first

Before writing or editing a single slide:

- `marketing/brand/brand-guidelines.md` — colors, fonts, logo rules, voice/tone
- Your shared numbers file, if you keep one (see `CLAUDE.md`) — every number that appears on a slide
- The deck's markdown content source, e.g. `sales/pitch-deck/{{COMPANY}}_PitchDeck.md` — current slide-by-slide text, so an update stays in sync with it (update this file too when the deck changes, see Step 6)

If a stat on an existing slide doesn't match your numbers source anymore, fix it. Don't propagate stale numbers.

---

## Step 2 — Where things live

| Path | What it is |
|---|---|
| `.claude/skills/pitch-deck/scripts/deck-kit.js` | Shared engine: slide-HTML helpers, PDF renderer, QA screenshotter. Require this, don't copy it. |
| `.claude/skills/pitch-deck/assets/deck-theme.css` | The brand CSS. Edit here if the *look* needs to change for every deck; don't fork a copy per deck. |
| `sales/pitch-deck/generation/generate-deck.js` | A deck's content script, write one per deck, using the shared kit. |
| `sales/pitch-deck/generation/assets/` | Deck-specific assets (e.g. embedded team photos) that aren't brand assets. |
| `sales/pitch-deck/{{COMPANY}}_PitchDeck.md` | Readable content source for the current deck (mirrors what's in the PDF). |
| `sales/pitch-deck/output/{{COMPANY}}_Deck_v[N].pdf` | Output. Version-bump the filename on a new revision; never overwrite an already-shared version. |

A new deck gets its own `<slug>/generation/generate-deck.js` under `sales/`, requiring the shared kit, and writes its PDF to that deck's own `output/` folder. Don't duplicate `deck-kit.js` or `deck-theme.css` per deck.

---

## Step 3 — Write the build script

```js
const kit = require(path.join(REPO_ROOT, '.claude', 'skills', 'pitch-deck', 'scripts', 'deck-kit.js'));
```

Every slide follows the same skeleton:

```js
const slideN = `${kit.slideOpen(N, 'Section Label')}
  ${kit.title('The slide headline')}
  ${kit.body(/* everything else */)}
${kit.slideClose}`;
```

- `slideOpen(n, section, extraClass?)` — eyebrow (`"03 · Solution"`) + corner logo mark. `extraClass` is only for the title slide (`'slide-title-page'`) or one-off layout needs.
- `title(t)` — pinned near the top of the slide. Every slide has one **except** the title slide, which uses the wordmark itself as the headline.
- `body(html)` — wraps everything else. It vertically centers and evenly spaces its children in whatever room is left below the title, which is what makes a 3-bullet slide and a chart-heavy slide both look intentionally full instead of top-heavy. **Title and body are siblings** — never nest `title()` inside `body()`.

### Content-block helpers

| Helper | Use for |
|---|---|
| `bullets([items])` | Standard bullet list. Items can contain inline `<strong>` |
| `lineChart(label, points, w, h)` | `points = [{k:'M1', v:3}, ...]` — trend over time |
| `barChart(label, points, w, h)` | `points = [{k:'Yr 1', v:100}, ...]` — bars with `$NK` labels |
| `flowBox(text)` | One box in a vertical process flow; chain with `<div class="flow-arrow">&#9660;</div>` between them |
| `personCard(photoDataUri, name, role, bio)` | Team bio with circular photo. Get the photo via `kit.embedImage(absPath)` |
| `partnerCard(name, blurb)` | Named entity + description, for a partners/logos slide |

### Layout wrappers (CSS classes, used directly in a template string)

| Class | Layout |
|---|---|
| `.split-60-40` / `.split-55-45` | Two-column grid — e.g. chart + bullets, or bullets + flow |
| `.row-2-people` | Two `personCard()`s side by side |
| `.partners-grid` | Three `partnerCard()`s side by side |
| `.chart-frame` | Centers a chart within its column |

Assemble and render:

```js
const html = kit.buildHtml('Deck Title', [slide1, slide2, /* ... */]);
await kit.renderPdf(html, outPdfPath);
```

---

## Step 4 — Design rules (don't drift from these)

- **One accent only.** `--accent` is the only hue besides paper/ink/surface/border. Never introduce a second color for "variety", multiple accent colors across documents is a real anti-pattern this engine exists to prevent.
- **Logo, once per slide, right version.** The wordmark SVG (used on the title slide) already bundles the mark tile with the wordmark, pairing it with a separate corner mark duplicates the logo. Every other slide gets only the corner mark (`kit.cornerMark()`, wired into `slideOpen` automatically).
- **Title stays pinned near the top.** Resist centering the title in the middle of the slide. Only `body()`'s contents center/spread.
- **No decorative accent stripes or color bars.** Avoid patterns that read as generic AI-generated slide design.
- **Split, don't shrink.** If a slide is fighting for space (e.g. team bios + partner cards both wanted to live on one slide), give the dense content its own slide rather than shrinking type below the deck's normal scale. The one deliberate exception to a uniform type scale should be obvious in context (chart/axis labels are always smaller than body copy), not an ad hoc squeeze.
- **Numbers in mono where the brand calls for it.** Chart values and any number a viewer might compare use `--font-mono` with tabular figures, already wired into `lineChart`/`barChart`. Extend the same treatment to any raw stat you place outside those helpers.

---

## Step 5 — QA (required, and not the usual pptx-skill way)

This renders via HTML + Chromium, not LibreOffice or PowerPoint COM automation. Use the kit's own screenshotter:

```js
await kit.screenshotSlides(html, qaDir);
```

Then **read every single output image** (the Read tool renders PNGs directly) and check each one for:

- Text overflow or cut-off content at a box/slide edge (check this first, it's the most common defect)
- Overlapping elements, especially footer text colliding with content above it
- Uneven whitespace (one slide dense, the next nearly empty)
- Chart labels/values that got clipped

Fix and re-screenshot only the slides that changed. Do not declare the deck done without having looked at every slide's rendered image at least once.

---

## Step 6 — After rendering

- Update the deck's markdown content source (e.g. `sales/pitch-deck/{{COMPANY}}_PitchDeck.md`) to match whatever actually shipped in the PDF, including slide order and count. The markdown is the readable record of what's in the deck, don't let it drift.
- Report the output path, and call out anything you corrected along the way (a stale stat, a data error inherited from a prior version) rather than silently fixing it.
- Leave prior dated/versioned PDFs in `sales/pitch-deck/output/` alone unless the user asks you to remove them.

---

## Related skills

- [md-to-pdf](../md-to-pdf/SKILL.md) — same rendering approach (HTML + Chromium via Playwright), but each skill installs its own copy so either can be copied into another project independently.
- [one-pager](../one-pager/SKILL.md) — same brand source of truth, different output shape (single page, not a slide deck).
