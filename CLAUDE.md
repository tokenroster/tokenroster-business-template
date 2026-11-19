# {{COMPANY}}: Claude Instructions

Rules and conventions for working in this repository. Read this before doing anything else.

> This file is a starting point, copied from a working setup. Read every `{{PLACEHOLDER}}` and bracketed note, fill it in or delete it, then delete this blockquote. See `README.md` at the repo root for the full setup checklist, and `system-architecture.md` for how the whole system fits together.

---

## File naming

All files use **kebab-case**. No exceptions except where noted.

- `business-plan.md` ✓
- `BusinessPlan.md` ✗
- `startup_marketing_plan.md` ✗

**Exceptions:**
- `README.md`, `SKILL.md`, and `AGENT.md`: all-caps is standard, do not change
- Skill folders in `.claude/skills/` are named `<prefix>-<camelCaseName>`: a one-word prefix (`general` for reusable skills, the company name for company-specific ones), then the skill name in camelCase, e.g. `general-pitchDeck`
- Dated and versioned files: plans as `YYYY-MM-<name>.md`, releases as `<name>-vN.md`, decks as `<deck>_v<N>.pdf`. Never edit a versioned output after the fact; a change means a new version
- [Optional] Files in `sales/` meant for external distribution can carry a brand prefix (e.g. `{{COMPANY}}_OnePager_Founders.md`) if you want shared files to self-identify their source. Decide once, then apply it consistently, or drop this exception entirely.

---

## Folder structure

| Folder | What belongs here |
|---|---|
| `strategy/` | Internal direction-setting: business plan, executive summary, projections, pricing, competitive analysis, bios, marketing plan |
| `marketing/` | One-to-many work: brand, shared messaging, channel content, lead magnets, program applications |
| `sales/` | One-to-one work: collateral (one-pagers, pitch deck, templates), accounts, emails |
| `docs/` | Working notes: product and feature specs, running action list |
| `scratchpad/` | Throwaway working files (git-ignored) |
| `.claude/skills/` | Claude skill files |

If a new document doesn't fit an existing folder, ask before creating a new one.

---

## Company facts for tooling

`company.json` at the repo root holds the company's exact name and bare domain. The skills
in `.claude/skills/` read it at runtime and contain nothing company-specific themselves.
If the name or domain changes, update `company.json` only. Never hardcode either into a
skill or script; keeping skills generic is what lets template updates merge cleanly.

---

## Stats file

`platform-stats.md` at the repo root is the single source of truth for traction numbers, pricing, product facts, partnerships, and contact details. Every document that cites one of these (one-pagers, the pitch deck, plans, summaries) reads it from there; never hardcode a value or quote one from memory.

When the user provides an updated number, update `platform-stats.md` first, then propagate to the documents that cite it. Never the reverse. If a value is pulled live from an API, database, or MCP server, its exact source and field mapping go in that file's "Live sources" table.

---

## Branding

**Always read `marketing/brand/brand-guidelines.md` before creating or updating any sales or marketing document, written or visual.** It is the single source of truth for the name, logo usage, color, typography, and voice/tone, covering `sales/`, `marketing/`, and any skill that generates collateral for either. Logo assets live in `marketing/brand/logos/`.

If a document's visual treatment (colors, fonts) or copy conflicts with `brand-guidelines.md`, the guidelines win, update the document, don't invent a new look.

`marketing/brand/brand-tokens.css` carries the guidelines' colors and fonts as CSS variables (`--brand-*`); the PDF and deck skills render with it. Change the brand there (guidelines first, then tokens), never inside a skill. Until it exists, the skills fall back to their default look and warn that the output isn't on-brand yet.

*(`brand-guidelines.md` doesn't exist yet in this template, write it as the first real document in this repo, before any sales or marketing collateral.)*

---

## One-pagers

Follow the full process in `.claude/skills/general-onePager/SKILL.md`. It ships with two modes, a standard-product mode with a pricing table, and a custom-service mode without one, adjust or collapse to one mode if your business doesn't need the distinction (see that file's setup note).

---

## Pitch deck

Rendered as a PDF (HTML + Chromium), not PowerPoint, this environment has no LibreOffice and brand fonts aren't guaranteed to be in PowerPoint's safe font list. Follow the full process in `.claude/skills/general-pitchDeck/SKILL.md`. Needs one-time setup (logo files, `company.json`) before first use, see that file.

---

## TokenRoster sync

This template can push a completed document (e.g. `setup-questionnaire.md`, or a business
plan derived from it) to the company's own TokenRoster listing. Follow the full process in
`.claude/skills/general-tokenRosterSync/SKILL.md`.

Requires a one-time manual step outside this repo: TokenRoster has no API/MCP way to create
a company listing, only to attach documents to one that already exists. The user must sign
up and create their listing at tokenroster.com's web app first.

MCP server config lives in `.mcp.json` at the repo root: `tokenroster` (public, read-only
registry, no auth) and `tokenroster-manage` (the user's own account). Both are production
servers, and `tokenroster-manage` signs in with OAuth: run `/mcp`, pick it, and choose
Authenticate. No API key or `.env` entry is needed. Personal settings (enabled MCP servers,
extra permissions) go in `.claude/settings.local.json`, copied from
`.claude/settings.local.json.example`.

---

## README files

Every top-level folder has a `README.md`, as does any subfolder with conventions of its own (e.g. `marketing/brand/`). Simple placeholder subfolders are described in their parent's README instead. Keep them current.

- When a file is added, moved, or removed from a folder, update that folder's README
- READMEs describe the folder's purpose and conventions only, no document inventories
- When creating a new top-level folder, or a subfolder with its own conventions, create its README in the same change

---

## Agent personas

Each working folder has an `AGENT.md` that defines an expert persona. Load and adopt that persona whenever you are reading, creating, or editing documents in that folder.

| Folder | Persona | File |
|---|---|---|
| `strategy/` | {{STRATEGY_PERSONA_NAME}}: [one-line role] | `strategy/AGENT.md` |
| `marketing/` | {{MARKETING_PERSONA_NAME}}: [one-line role] | `marketing/AGENT.md` |
| `sales/` | {{SALES_PERSONA_NAME}}: [one-line role] | `sales/AGENT.md` |

The persona governs voice, priorities, and judgment calls for that folder. The rules in this file (naming, `platform-stats.md`, skill processes) still apply, the persona operates within them.

---

## General rules

- Never update a stat in an individual document without updating `platform-stats.md` first
- When moving or renaming files, check if any skill files reference the old path and update them in the same change
- Do not create `README.md` files beyond what the README rule above requires, unless the user asks
- Do not create planning or analysis documents, work from conversation context
- Never use the em dash character, in documents or in chat. Use a comma, colon, period, or parentheses instead, or rewrite the sentence.
- Read `avoiding-ai-tells.md` before writing any external or persona-voiced copy (emails, one-pagers, decks, posts, applications, website copy) and run its checklist before handing the copy over.
- Deliver work as files in this repo or as text in chat. Do not publish hosted artifacts or create external documents unless the user explicitly asks.
- Do not use the global memory system. Keep everything self-contained in this project.
- Treat copy guidance as living. When the user gives feedback on any copy (emails, LinkedIn posts and responses, one-pagers, and so on), capture the lesson in the most relevant persistent doc: the folder's `AGENT.md`, or the relevant skill or `README`. The method should compound instead of resetting each chat.
