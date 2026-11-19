# Brand

Source of truth for the company's visual identity and voice.

## Contents

| File / Folder | Contents |
|---|---|
| `brand-guidelines.md` | Name usage, logo rules, color tokens (light/dark), typography, spacing, voice/tone; write this first, before any sales or marketing collateral |
| `brand-tokens.css` | The guidelines' colors and fonts as CSS variables (`--brand-*`). The PDF and deck skills render with it; until it exists they use a default look and warn. Variable list: `.claude/skills/general-mdToPdf/assets/default-brand-tokens.css` |
| `logos/` | Approved logo assets |

## Conventions

- This folder governs all sales and marketing creative, both copy and visual. See `CLAUDE.md` and each folder's `AGENT.md`.
- If a live product's code defines the actual color tokens or fonts, that code wins; keep this document in sync with it rather than the reverse.
- `brand-guidelines.md` is the source and `brand-tokens.css` follows it. Change a color or font in the guidelines first, then in the tokens, in the same edit.
- Define at least one non-negotiable logo rule here (e.g. don't recolor, rotate, or reset the wordmark in another font) once you have a mark to protect.
- The `general-pitchDeck` skill (`.claude/skills/general-pitchDeck/`) reads three specific files from `logos/`: `wordmark.svg` (full logo, used on the title slide), `mark-tile.svg` (icon-only mark, used as the corner mark on every other slide), and `mark-ink.svg` (single-color version of the mark, for placing on backgrounds where the tile's own colors would clash). Add them under those exact names, or update the filenames in `deck-kit.js` to match what you actually have.
