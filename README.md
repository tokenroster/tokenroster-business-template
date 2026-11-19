# Startup Workspace Template

*A template from TokenRoster.*

A copy-and-fill starting point for running a startup's business documents (strategy, marketing, sales) with Claude Code: a `CLAUDE.md` of rules, single sources of truth for stats and brand, per-folder `AGENT.md` personas, and `README.md` files that describe conventions rather than list files. This template was extracted from a working repo, stripped of anything company-specific. `system-architecture.md` explains how the pieces fit together.

## What's in here

```
<repo>/
├── CLAUDE.md                  Rules and conventions (fill in the placeholders first)
├── system-architecture.md     How the system works, and the full folder map
├── company.json               Company name + domain, read by the skills at runtime
├── platform-stats.md          Stats, pricing, partnerships, contact details (skeleton)
├── avoiding-ai-tells.md       Writing guide for external and persona-voiced copy
├── setup-questionnaire.md     The answers general-companySetup turns into a configured repo
├── package.json               Task shortcuts only (setup, pdf, pdf:all, deck), no dependencies
├── .mcp.json                  TokenRoster MCP servers (public + manage, production, OAuth sign-in)
├── strategy/                  Internal direction-setting
│   ├── AGENT.md, README.md
│   ├── business-plan/, executive-summary/, projections/
│   └── pricing/, competitive-analysis/, bios/
├── marketing/                 One-to-many work
│   ├── AGENT.md, README.md
│   ├── brand/                 README.md, logos/ (guidelines and tokens land here)
│   ├── messaging/, channels/website/
│   └── lead-magnets/, applications/
├── sales/                     One-to-one work
│   ├── AGENT.md, README.md
│   ├── collateral/            1-pager/output/, pitch-deck/{generation/assets,output}/, templates/
│   ├── accounts/
│   └── emails/                drafts/, inbox/
├── docs/                      Working notes: README.md, action-items.md, specs
├── scratchpad/                Throwaway working files (git-ignored)
└── .claude/
    ├── settings.json          Shared project hooks (path guards)
    ├── settings.local.json.example  Copy to settings.local.json (git-ignored) for personal permissions + MCP enablement
    ├── hooks/                 guard-read-paths.js, guard-bash-paths.js: keep tool calls inside the repo
    └── skills/                See .claude/skills/README.md
        ├── general-companySetup/      First-time setup from the questionnaire
        ├── general-onePager/          Drafts audience-specific one-pager Markdown
        ├── general-mdToPdf/           Renders Markdown to PDF (needs `npm run setup:pdf`)
        ├── general-pitchDeck/         Renders a slide deck to PDF (needs `npm run setup:deck` + logo files)
        ├── general-summarizeChanges/  Summarizes uncommitted git changes
        └── general-tokenRosterSync/   Uploads a document to the company's TokenRoster listing
```

Deliberately not included: a written `brand-guidelines.md` or `brand-tokens.css` (setup writes them from your answers), and anything business-specific like an assessment-framework or valuation skill. Add the equivalent for your own business as it comes up.

All six skills are generic: they contain nothing company-specific and read the company name and domain from `company.json`, the numbers from `platform-stats.md`, and the look from `marketing/brand/brand-tokens.css` at runtime. You never edit them during setup, so later improvements to the template's skills can be copied or merged in cleanly. Until the brand tokens exist, the PDF and deck skills render in a shared default look and warn that the output isn't on-brand yet.

## Setup checklist

1. **Create your copy** of this repo (use it as a template, or clone it and point `origin` at your own remote).
2. **Run setup.** Ask Claude to set up the workspace: the `general-companySetup` skill walks through `setup-questionnaire.md` (or reads it if you've already answered it), then writes `company.json`, fills `platform-stats.md`, fills every `{{PLACEHOLDER}}` outside `.claude/skills/`, drafts the three `AGENT.md` personas, and writes `marketing/brand/brand-guidelines.md` and `brand-tokens.css`. Review the personas and ask for tweaks rather than starting from scratch.
3. **Check `platform-stats.md`.** Anything left `TBD` is a number no document can cite yet.
4. **Add logo files** to `marketing/brand/logos/`: `wordmark.svg`, `mark-tile.svg`, and `mark-ink.svg` (the deck skill reads these names).
5. **Install the rendering dependencies:** `npm run setup` from the repo root (installs each skill's own `node_modules` and Chromium; nothing is installed at the root).
6. **Sign in to TokenRoster** if you'll use `general-tokenRosterSync`: create your company listing on tokenroster.com, copy `.claude/settings.local.json.example` to `.claude/settings.local.json`, then run `/mcp`, pick `tokenroster-manage`, and authenticate.
7. **Delete every blockquote setup note** (here, at the top of `CLAUDE.md`, `platform-stats.md`, and each `AGENT.md`/`SKILL.md`) once its instructions are done.
8. **Leave the empty placeholder folders in place.** Each holds a `.gitkeep` so git tracks it until real files land, and the folder map in `system-architecture.md` expects them.

## The pattern this template encodes

- **One file per fact.** Numbers live in `platform-stats.md`, brand in `marketing/brand/`, company identity in `company.json`. Every document reads from them; nothing hardcodes a stat or a color.
- **Judgment by the model, formatting by code.** Choosing what to say is Claude's job; turning it into a brand-accurate PDF is a script's.
- **Personas, not just rules.** An `AGENT.md` per folder gives Claude a consistent expert judgment to apply, not just a style guide, so output quality doesn't depend on how the request was phrased.
- **READMEs describe conventions, not inventories.** They explain what belongs in a folder and why, not a list of what's currently in it (that list goes stale immediately; conventions don't).
- **Feedback compounds.** When you correct a draft (an email greeting, a tone choice, a naming rule), the fix belongs in the relevant `AGENT.md`, skill, or `avoiding-ai-tells.md`, not just in that one conversation, so the same correction doesn't have to be given twice.

## License

MIT, see `LICENSE`.
