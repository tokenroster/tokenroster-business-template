# Startup Workspace Template

*A template from TokenRoster.*

A copy-and-fill starting point for running a startup's business documents (strategy, marketing, sales) the way this repo does: a `CLAUDE.md` of rules, a single stats source of truth, per-folder `AGENT.md` personas, and `README.md` files that describe conventions rather than list files. This template was extracted from a working repo, stripped of anything company-specific.

## What's in here

```
template/
├── CLAUDE.md              Rules and conventions (fill in the placeholders first)
├── strategy/               Internal direction-setting documents
│   ├── AGENT.md                   Persona template
│   ├── README.md
│   ├── business-plan/
│   ├── executive-summary/
│   └── competitive-analysis/
├── marketing/              Brand assets and creative
│   ├── AGENT.md                   Persona template
│   ├── README.md
│   ├── brand/
│   │   ├── README.md
│   │   └── logos/
│   └── website-copy/
├── sales/                  External-facing collateral
│   ├── AGENT.md                   Persona template
│   ├── README.md
│   ├── 1-pager/output/
│   ├── emails/drafts/
│   └── pitch-deck/generation/assets/, pitch-deck/output/
└── .claude/skills/          Reusable Claude skill files
    ├── README.md
    ├── one-pager/              Drafts audience-specific one-pager markdown
    ├── md-to-pdf/              Renders markdown → PDF (needs `npm install`, see its SKILL.md)
    └── pitch-deck/             Renders a slide deck to PDF via the same engine (needs logo files + company name filled in, see its SKILL.md)
```

Deliberately not included: a rendered `brand-guidelines.md`, a shared numbers file (`CLAUDE.md` explains the pattern as optional), and anything folder- or business-specific like an assessment-framework or valuation skill, or a folder for that output. Those are specific to the original business this was extracted from, or specific to whether your business even needs them; add the equivalent for your own business as it comes up.

The three included skills (`one-pager`, `md-to-pdf`, `pitch-deck`) are generic document-generation machinery, not tied to any one business model. They still need setup, see step 7 below, and each skill's own `SKILL.md` setup note.

## Setup checklist

1. **Copy this folder** to a new project root and rename as needed (this `template/` folder itself is not part of the new project, only its contents are).
2. **Find and fill every `{{PLACEHOLDER}}`** across the copied files, at minimum `{{COMPANY}}`, `{{STRATEGY_PERSONA_NAME}}`, `{{MARKETING_PERSONA_NAME}}`, `{{SALES_PERSONA_NAME}}` in `CLAUDE.md`, and the same persona names in each `AGENT.md`.
3. **Write the three personas properly.** Each `AGENT.md` has a bracketed skeleton, not real content. A good persona is specific to this company's stage, model, and buyers, don't reuse the original bio details or audience segments verbatim; treat them as a pattern to follow (bio, what they know cold, how they approach this folder, voice, non-negotiables), not text to keep.
4. **Decide if you need a shared numbers file.** If stats, pricing, or contact info will appear in more than one document, create one (e.g. `key-numbers.md` at the repo root) per the pattern in `CLAUDE.md`'s "Key numbers" section. Skip this if it doesn't apply yet.
5. **Write `marketing/brand/brand-guidelines.md`** before producing any real sales or marketing collateral, it doesn't exist yet in this template. `marketing/brand/README.md` describes what it should contain.
6. **Decide on house style rules** (e.g. em dash policy, file naming prefix for external docs) and either keep or delete the bracketed suggestions in `CLAUDE.md` and each `AGENT.md`.
7. **Set up the included skills before first use.** `md-to-pdf`: run `npm install` inside `.claude/skills/md-to-pdf/scripts/`, then `npx playwright install chromium` from the same folder. `pitch-deck`: same two commands inside `.claude/skills/pitch-deck/scripts/` (it has its own separate `package.json`, not shared with md-to-pdf), plus add `marketing/brand/logos/wordmark.svg`, `mark-tile.svg`, and `mark-ink.svg`, and fill in `COMPANY_NAME` near the top of `.claude/skills/pitch-deck/scripts/deck-kit.js`. `one-pager` needs no setup beyond its `{{PLACEHOLDER}}`s.
8. **Delete every blockquote setup-note** (like this section and the ones at the top of `CLAUDE.md` and each `AGENT.md`/`SKILL.md`) once its instructions are done.
9. **Remove unused empty folders** (`business-plan/`, `executive-summary/`, `competitive-analysis/`, `website-copy/`, `1-pager/output/`, `emails/drafts/`, `pitch-deck/generation/assets/`, `pitch-deck/output/`) if they don't apply yet, or leave them, each has a `.gitkeep` so git tracks the empty directory until real files land.

## The pattern this template encodes

- **If numbers repeat across documents, one file is the source of truth for them**, not scattered copies. Every document reads from it; nothing hardcodes a stat. (Optional, see `CLAUDE.md`.)
- **One file is the source of truth for brand** (`marketing/brand/brand-guidelines.md`). Every visual or copy decision defers to it.
- **Personas, not just rules.** An `AGENT.md` per folder gives Claude a consistent expert judgment to apply, not just a style guide, so output quality doesn't depend on how the request was phrased.
- **READMEs describe conventions, not inventories.** They explain what belongs in a folder and why, not a list of what's currently in it (that list goes stale immediately; conventions don't).
- **Feedback compounds.** When you correct a draft (an email greeting, a tone choice, a naming rule), the fix belongs in the relevant `AGENT.md` or skill file, not just in that one conversation, so the same correction doesn't have to be given twice.

## License

MIT, see `LICENSE`.
