# System Architecture

How this repository works as a system: the layers it is built from, how instructions reach the agent, how documents get produced, and how to extend it. It is also the repo's folder map.

Nothing here is specific to one company, product, client, or subject. The same architecture would run any company's workspace.

Last reviewed: 2026-11-19.

---

## File and folder breakdown

Placeholders in angle brackets (`<channel>`, `<account>`, `<program>`) stand for one folder per item.

```
<repo>/
├── CLAUDE.md                     Global rules: naming, folder policy, sources of truth, skill routing
├── system-architecture.md        This file: system design and folder map
├── README.md                     Repo introduction and setup checklist
├── company.json                  Company name and bare domain, read by the skills at runtime
├── platform-stats.md             Stats file: numbers, pricing, partnerships, contact details
├── avoiding-ai-tells.md          Writing guide for external and persona-voiced copy
├── setup-questionnaire.md        Setup answers that general-companySetup turns into a configured repo
├── package.json                  Task shortcuts only, no dependencies
├── .mcp.json                     Project MCP server declarations (TokenRoster public + manage)
├── .gitignore                    Ignores scratch, secrets, local settings, node_modules, generated PDFs
├── .gitattributes, LICENSE
│
├── .claude/
│   ├── settings.json             Shared project hooks
│   ├── settings.local.json.example  Template for personal settings (enabled MCP servers, permissions)
│   ├── settings.local.json       Personal settings (git-ignored)
│   ├── hooks/                    guard-read-paths.js, guard-bash-paths.js: keep tool calls in the repo
│   └── skills/
│       ├── README.md             Skill index
│       ├── general-companySetup/
│       │   └── SKILL.md          First-time setup from setup-questionnaire.md
│       ├── general-onePager/
│       │   └── SKILL.md          Process for writing an audience-specific one-pager
│       ├── general-mdToPdf/
│       │   ├── SKILL.md          Process for exporting Markdown to PDF
│       │   ├── scripts/          export-pdf.js, package.json (own node_modules)
│       │   └── assets/           Print layout CSS, default brand tokens, wrapper.html
│       ├── general-pitchDeck/
│       │   ├── SKILL.md          Process for building the deck PDF
│       │   ├── scripts/          deck-kit.js (slide helpers, renderer, QA screenshots), package.json
│       │   └── assets/           deck-theme.css (deck layout), default brand tokens
│       ├── general-summarizeChanges/
│       │   └── SKILL.md          Per-area summary of uncommitted git changes
│       └── general-tokenRosterSync/
│           └── SKILL.md          Uploads a document to the company's TokenRoster listing
│
├── strategy/                     Internal direction-setting
│   ├── AGENT.md                  Persona: operator and CEO
│   ├── business-plan/            Dated plan snapshots, customer and market detail
│   ├── executive-summary/        Dated executive summary snapshots
│   ├── projections/              Financial model and its summary
│   ├── pricing/                  Pricing model and dated proposals
│   ├── competitive-analysis/     One file or folder per competitor
│   ├── bios/                     Team bios, CVs, headshots
│   └── marketing-plan-<year>.md  Annual marketing plan
│
├── marketing/                    One-to-many work
│   ├── AGENT.md                  Persona: brand and growth strategist
│   ├── brand/                    brand-guidelines.md, brand-tokens.css, logos/
│   ├── messaging/                Customer profiles, company descriptions, founder intro
│   ├── channels/<channel>/       Content per channel (social, website, video, podcast, ads,
│   │                             print, press, events), plus UTM conventions
│   ├── lead-magnets/             Free signup offers
│   └── applications/<program>/   Awards, grants, competitions, program applications
│
├── sales/                        One-to-one work
│   ├── AGENT.md                  Persona: revenue leader
│   ├── collateral/
│   │   ├── 1-pager/              One Markdown source per audience, PDFs in output/
│   │   ├── pitch-deck/           Content source (<Company>_PitchDeck.md), generation/
│   │   │                         (build script + deck assets), output/ (versioned PDFs)
│   │   └── templates/            Agreements, standard emails
│   ├── accounts/<account>/       One folder per account: agreements/, pricing, meetings/
│   └── emails/                   drafts/ (outgoing) and inbox/ (logged incoming)
│
├── docs/                         Working notes
│   ├── README.md
│   ├── *-spec.md                 Product and feature specs for developers
│   └── action-items.md           Running cross-functional action list
│
└── scratchpad/                   Throwaway working files (git-ignored)
```

Every top-level folder holds a `README.md` describing its purpose and conventions, as does any subfolder with conventions of its own (`marketing/brand/`, `docs/`, `.claude/skills/`). Empty placeholder subfolders hold a `.gitkeep` and are described in their parent's README.

---

## 1. What the system is

The repo is an **agent-operated company workspace**. It is a plain Git repository of Markdown, a few data files, and small scripts. Claude Code is the runtime that does the work. There is no server and no build step at the root. Behavior comes from three things working together:

1. **Instructions** stored as files: rules, personas, skills, and READMEs that tell the agent how to act in each part of the repo.
2. **Sources of truth** stored as files: single canonical files for numbers and brand, which every document reads from instead of copying.
3. **Deterministic tooling**: Node scripts for anything that must come out exactly the same every time (layout, rendering, QA screenshots).

The guiding split: **judgment is done by the model, formatting is done by code.** Choosing what to say and how to say it for a reader is inference. Turning that content into a brand-accurate PDF is a script.

---

## 2. Design principles

| Principle | What it means in practice |
|---|---|
| Files are the interface | Every rule, persona, and process is a readable file in Git. No hidden state, no external memory system |
| One source of truth per fact | Stats, pricing, contact info, and brand each live in exactly one place. Documents reference them and never hand-copy values |
| Instructions are scoped | Global rules at the root, folder personas per working area, process detail inside skills. The narrowest applicable instruction governs the detail; the global rules still bind |
| Code for anything repeatable | If a step has one right answer, it runs as a script, not as prose the model follows |
| Content separate from engine | Documents own their words; skills own the styling and rendering shared by every document |
| Immutable history | Versioned outputs (deck versions, dated plans, numbered releases) are never edited after the fact. Change means a new version |
| Compounding guidance | When the user corrects copy or process, the lesson is written back into the relevant persona, skill, or README so the next session starts smarter |

---

## 3. Layered overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ CONTROL LAYER        CLAUDE.md · system-architecture.md                │
│                      AGENT.md personas · READMEs · writing guide       │
├────────────────────────────────────────────────────────────────────────┤
│ SOURCE-OF-TRUTH      company.json · stats file · brand guidelines      │
│ LAYER                brand tokens · shared messaging · financial model │
├────────────────────────────────────────────────────────────────────────┤
│ ENGINE LAYER         .claude/skills/  general-companySetup ·           │
│ (skills)             general-onePager · general-mdToPdf ·              │
│                      general-pitchDeck · general-summarizeChanges ·    │
│                      general-tokenRosterSync                           │
├────────────────────────────────────────────────────────────────────────┤
│ CONTENT LAYER        strategy/ · marketing/ · sales/ · docs/           │
│                      (inputs, working docs, and generated outputs)     │
├────────────────────────────────────────────────────────────────────────┤
│ INTEGRATION LAYER    MCP servers (.mcp.json) · claude.ai connectors    │
├────────────────────────────────────────────────────────────────────────┤
│ RUNTIME              Claude Code · project hooks · Node 18+ ·          │
│                      Playwright/Chromium · npm (task shortcuts)        │
└────────────────────────────────────────────────────────────────────────┘
```

Dependencies run in one direction: the control layer tells the agent which skill and which sources to use, skills read sources of truth, and skills write into the content layer.

---

## 4. Control layer: how the agent is instructed

### 4.1 Instruction hierarchy

| Level | File | Scope | Governs |
|---|---|---|---|
| 1 | `CLAUDE.md` (root) | Whole repo, loaded every session | Naming, folder policy, source-of-truth rules, which skill handles which job, writing bans, delivery and memory policy |
| 2 | `system-architecture.md` (root) | Whole repo | System design and folder map |
| 3 | `<folder>/AGENT.md` | One working folder | Expert persona: voice, priorities, judgment calls, domain non-negotiables |
| 4 | `.claude/skills/<skill>/SKILL.md` | One process | Step-by-step method, inputs, outputs, scripts to run |
| 5 | `<folder>/README.md` | One folder | Purpose and conventions of that folder (never a file inventory) |
| 6 | Reference guides (`avoiding-ai-tells.md`, brand guidelines) | Cross-cutting | Writing and visual standards |

**Precedence:** the root rules always apply. A persona operates inside them (it changes voice and judgment, not naming or sourcing rules). A skill defines the process, but still pulls numbers from the stats file and visuals from the brand guidelines. When a document conflicts with the brand guidelines, the guidelines win.

### 4.2 Personas

Each functional folder carries an `AGENT.md` that the agent adopts while reading or writing there. Every persona file has the same shape:

- **Identity and experience**: who the expert is and the background that shapes their judgment.
- **What they know cold**: the domain knowledge the persona brings.
- **How they approach the folder**: the questions they ask of every document.
- **Voice and style**: how documents in that folder should read.
- **Non-negotiables**: hard rules for the domain.
- **Living playbooks**: sections (an email-drafting method, for example) updated whenever the user gives feedback.

| Folder | Persona role |
|---|---|
| `strategy/` | Operator and CEO: internal, decision-grade, numbers-first |
| `marketing/` | Brand and growth strategist: one-to-many, voice consistency |
| `sales/` | Revenue leader: one-to-one, reader-specific, conversion-focused |

### 4.3 The feedback loop

```
user corrects copy or process
        │
        ▼
lesson written into AGENT.md / SKILL.md / README  ──►  next session loads it
```

Guidance is treated as living. The system improves by editing its own instruction files, not by relying on conversation memory.

---

## 5. Source-of-truth layer

| Source | Format | Holds | Read by |
|---|---|---|---|
| Company facts (`company.json`) | JSON | Exact company name and bare domain | `general-mdToPdf`, `general-pitchDeck`; written once by `general-companySetup` |
| Stats file (`platform-stats.md`) | Markdown | Traction counters, pricing, product facts, partnerships, contact details | Every business document, `general-onePager`, `general-pitchDeck` |
| Brand guidelines (`marketing/brand/brand-guidelines.md`) | Markdown (an HTML twin is optional) | Name usage, logo, color tokens (dark and light themes, state colors), typography, surfaces, motion, voice | All sales and marketing work |
| Brand tokens (`marketing/brand/brand-tokens.css`) | CSS variables | The guidelines' colors and fonts in machine-readable form; follows the guidelines, never leads them | `general-mdToPdf`, `general-pitchDeck` (each falls back to its bundled default tokens, with a warning, until this file exists) |
| Shared messaging (`marketing/messaging/`) | Markdown | Ideal customer profiles, company descriptions, founder intro | `general-onePager`, outreach |
| Financial model (`strategy/projections/`) | Spreadsheet | Projections | Strategy documents, deck |

**Propagation rule:** a number changes in its source first, then flows out to documents. Never the reverse.

```
new number ──► stats file ──► one-pagers, deck, plans, summaries
```

`general-companySetup` creates the first version of every source in this table from `setup-questionnaire.md`; after that, each is edited directly.

If the company exposes its own data through an MCP server, live counters can be pulled from it and written into the stats file before a stats-bearing document is generated. Counters the API doesn't expose stay manual.

---

## 6. Engine layer: skills

### 6.1 Anatomy of a skill

```
.claude/skills/<skill-name>/
├── SKILL.md          Frontmatter (name, description with trigger phrases)
│                     + numbered steps, inputs, outputs, quality checks
├── scripts/          Deterministic code the steps call (Node)
└── assets/           CSS themes, HTML wrappers, templates
```

The `description` field is the routing mechanism: it lists the phrases that should trigger the skill, so the agent picks the right process from the user's wording.

### 6.2 The skills

| Skill | Role | Reads | Writes |
|---|---|---|---|
| `general-onePager` | Writes a one-pager aimed at a single audience: identifies the reader and their main pain, gathers inputs, writes to a fixed structure, runs tone and quality checks | Stats file, brand guidelines, matching customer profile | Markdown source in `sales/collateral/1-pager/` |
| `general-mdToPdf` | Exports Markdown to a print PDF, one file or all one-pagers in a batch | Any `.md`, brand tokens, print layout CSS | PDF in `output/` (one-pagers) or beside the source |
| `general-companySetup` | First-time setup: walks the questionnaire, then writes `company.json`, `platform-stats.md`, `CLAUDE.md` placeholders, the three personas, brand guidelines, and brand tokens. Never edits a skill | `setup-questionnaire.md`, the company website if there is one | Root files, `AGENT.md` files, `marketing/brand/` |
| `general-pitchDeck` | Builds the widescreen deck PDF from a content source and a per-deck build script, then screenshots every slide for QA | Stats file, brand guidelines, brand tokens, deck content source | Versioned PDF in `sales/collateral/pitch-deck/output/` |
| `general-summarizeChanges` | Summarizes uncommitted git changes per area, scoped by "current" or "staged" | `git status`, diffs | Chat only, never stages or commits |
| `general-tokenRosterSync` | Uploads a finished document to the company's existing TokenRoster listing after explicit confirmation | The chosen document, `tokenroster-manage` MCP tools | A document on the TokenRoster listing |

### 6.3 How they chain

```
setup-questionnaire.md ──► general-companySetup ──► company.json, platform-stats.md,
                                                    personas, brand guidelines + tokens

general-onePager ──► general-mdToPdf ──► one-pager PDF

deck content (.md) + build script ──► general-pitchDeck engine ──► deck PDF
```

`general-mdToPdf` and `general-pitchDeck` share the same rendering approach (HTML into headless Chromium); they do not share code.

---

## 7. Document rendering

All visual output is **Markdown or HTML rendered to PDF by headless Chromium (Playwright)**. PowerPoint is not used because the environment has no office suite and custom brand fonts are not in PowerPoint's safe font list, so a `.pptx` would silently substitute fonts.

### 7.1 One-pagers (`general-onePager` + `general-mdToPdf`)

```
reader + pain point + value ──► general-onePager skill ──► <audience>.md
                                                             │
                     brand tokens + print layout CSS + wrapper.html
                                                             ▼
                                               export-pdf.js (Chromium) ──► output/<audience>.pdf
```

- **One reader per document.** A one-pager is written for a single audience, never a general one.
- **Numbers and look come from sources.** Stats from the stats file, look from the brand tokens (which follow the brand guidelines). Before tokens exist, the skill's default look is used and the export warns.
- **Batch mode.** `npm run pdf:all` (`export-pdf.js --all-one-pagers`) regenerates every one-pager PDF at once.

### 7.2 Pitch deck (`general-pitchDeck`)

| Piece | Lives in | Owned by |
|---|---|---|
| Engine: slide-HTML helpers, PDF renderer, QA screenshotter | `general-pitchDeck/scripts/deck-kit.js` | Skill (shared by every deck) |
| Brand tokens | `marketing/brand/brand-tokens.css`, else `general-pitchDeck/assets/default-brand-tokens.css` | Company (change colors and fonts here, never in the skill) |
| Layout CSS | `general-pitchDeck/assets/deck-theme.css` | Skill (edit here only to change layout for every deck) |
| Build script | `sales/collateral/pitch-deck/generation/` | One per deck, calls the engine |
| Readable content source | `sales/collateral/pitch-deck/<deck>.md` | One per deck, kept in sync with every render |
| Output | `sales/collateral/pitch-deck/output/<deck>_v<N>.pdf` | Every change is a new version |

Process: read the stats file, brand guidelines, and content source; write or update the build script using the engine's content helpers and layout classes; render; screenshot every slide and review before release; update the content source to match.

---

## 8. Integration layer

MCP servers are declared per project in `.mcp.json`; claude.ai connectors are attached per account. Skills and documents treat them as inputs.

| Kind | In this repo |
|---|---|
| TokenRoster public registry (`tokenroster`, HTTP, no auth) | Read-only company, framework, and registry data |
| TokenRoster manage (`tokenroster-manage`, HTTP, OAuth via `/mcp`) | The company's own listing: profile, documents (used by `general-tokenRosterSync`), assessment reports |
| Optional additions | A file-conversion MCP (e.g. markitdown) for turning PDFs and Office files into Markdown; the company's own product MCP for refreshing live counters into `platform-stats.md`; claude.ai connectors (email, calendar, notes) for drafting context |

Personal enablement of the declared servers goes in `.claude/settings.local.json` (see the `.example` file). Secrets and local overrides (`.env*`, `.mcp.local.json`, keys) are git-ignored.

---

## 9. Runtime and tooling

| Concern | How it is handled |
|---|---|
| Agent runtime | Claude Code. `.claude/settings.json` registers the path-guard hooks that keep every tool call inside the repo; personal permissions and MCP enablement go in the ignored `settings.local.json` |
| Node | 18+. Each tool keeps its own `package.json` inside its skill folder |
| Root `package.json` | Task shortcuts only (`setup`, `pdf`, `pdf:all`, `deck`). No dependencies at the root, ever |
| Rendering | Playwright with Chromium (`npx playwright install chromium` on first run), `marked` for Markdown |
| Scratch | `scratchpad/` for throwaway work (git-ignored) |
| Editor | VS Code; Obsidian can read the repo as a vault (its config is ignored) |
| Version control | Git is the history of every document; dated filenames and `vN` suffixes carry in-repo history |

---

## 10. Cross-cutting conventions

- **Naming.** kebab-case everywhere, except `README.md`, `SKILL.md`, and `AGENT.md`. Skills are named `<prefix>-<camelCaseName>`: a one-word prefix (`general` for reusable skills, the company name for company-specific ones), then the skill name in camelCase (`general-pitchDeck`).
- **Dated and versioned files.** Plans as `YYYY-MM-<name>.md`, releases as `<name>-vN.md`, decks as `<deck>_v<N>.pdf`.
- **READMEs.** Every top-level folder, and any subfolder with its own conventions, has one describing purpose and conventions, updated when files move. No inventories.
- **Writing.** No em dashes anywhere, in documents or chat. The writing guide (`avoiding-ai-tells.md`) applies to all external or persona-voiced copy.
- **Delivery.** Work lands as files in the repo or in chat. No hosted artifacts or external docs.
- **Memory.** No global memory system. Everything the agent needs to know persists in the repo's own files.
- **Path hygiene.** When a file moves, any skill that references its old path is updated in the same change.
- **New folders.** Ask before creating one that doesn't fit the existing map.

---

## 11. End-to-end examples

**An audience one-pager**
`CLAUDE.md` routes to `general-onePager` ▸ sales persona loads ▸ reads the stats file, brand guidelines, and the matching customer profile ▸ writes the `.md` ▸ `general-mdToPdf` renders the PDF.

**A deck update**
`general-pitchDeck` loads ▸ checks every slide number against the stats file ▸ edits the build script ▸ renders a new `v<N>` PDF ▸ screenshots each slide for QA ▸ updates the content source.

**A changed number**
Update the stats file (manually or from a product MCP) ▸ regenerate the one-pagers and deck that cite it.

---

## 12. Extending the system

| To add | Do this |
|---|---|
| A new skill | Create `.claude/skills/<name>/SKILL.md` with trigger-rich frontmatter; put repeatable logic in `scripts/`; list it in the skills README, `system-architecture.md`, and (if it is the required process for a job) `CLAUDE.md` |
| A new deck | Copy an existing build script, point it at the shared engine, write a new content source; don't fork the engine or the theme |
| A new one-pager audience | Run `general-onePager` for that reader; add a customer profile in `marketing/messaging/` first if none exists |
| A new working folder | Confirm it doesn't fit an existing one; add a `README.md`; add an `AGENT.md` if it needs its own judgment; update `system-architecture.md` |
| A new persona | Follow the persona shape in 4.2; register it in the persona table in `CLAUDE.md` |
| A new source of truth | One file, one owner; tell `CLAUDE.md` which documents must read it; never duplicate its values |
| A new integration | Declare it in `.mcp.json`; keep credentials in ignored local files |

---

## 13. Known constraints

- **Default look before the brand exists.** Until `brand-tokens.css` is written, one-pagers and decks render in the skills' shared default look. The export warns, but nothing blocks it, so check before sending anything external.
- **Web fonts need network.** Fonts load through the tokens file's `@import`; offline rendering needs fonts bundled with `@font-face` instead.
- **PDFs are not in Git.** `*.pdf` is git-ignored, so rendered one-pagers and deck versions live only on disk (or wherever they're shared). The Markdown sources and build scripts are versioned and can regenerate them.
