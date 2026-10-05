# {{COMPANY}}: Claude Instructions

Rules and conventions for working in this repository. Read this before doing anything else.

> This file is a starting point, copied from a working setup. Read every `{{PLACEHOLDER}}` and bracketed note, fill it in or delete it, then delete this blockquote. See `template/README.md` in the source repo for the full setup checklist.

---

## File naming

All files use **kebab-case**. No exceptions except where noted.

- `business-plan.md` ✓
- `BusinessPlan.md` ✗
- `startup_marketing_plan.md` ✗

**Exceptions:**
- `README.md` and `SKILL.md`: all-caps is standard, do not change
- [Optional] Files in `sales/` meant for external distribution can carry a brand prefix (e.g. `{{COMPANY}}_OnePager_Founders.md`) if you want shared files to self-identify their source. Decide once, then apply it consistently, or drop this exception entirely.

---

## Folder structure

| Folder | What belongs here |
|---|---|
| `strategy/` | Internal direction-setting documents: business plan, exec summary, marketing plan |
| `marketing/` | Brand assets and creative: guidelines, video ideas, visual assets |
| `sales/` | External-facing collateral: one-pagers, pitch deck, emails |
| `.claude/skills/` | Claude skill files |

If a new document doesn't fit an existing folder, ask before creating a new one.

---

## Company facts for tooling

`company.json` at the repo root holds the company's exact name and bare domain. The skills
in `.claude/skills/` read it at runtime and contain nothing company-specific themselves.
If the name or domain changes, update `company.json` only. Never hardcode either into a
skill or script; keeping skills generic is what lets template updates merge cleanly.

---

## Key numbers (optional, only if this applies to you)

If stats, pricing, or contact info show up in more than one document (a one-pager, a pitch deck, an executive summary), don't let each copy drift independently. Put them in a single file, e.g. `key-numbers.md` at the repo root, and pull from it every time instead of hardcoding. If the user provides updated numbers, update that file first, then propagate to affected documents.

If any numbers are pulled live from an API, database, or MCP server, document the exact source and field mapping here. Not every startup needs this file at all, e.g. if you have one pricing page and one pitch deck and they're trivially kept in sync by hand, skip it. Delete this section if it doesn't apply.

---

## Branding

**Always read `marketing/brand/brand-guidelines.md` before creating or updating any sales or marketing document, written or visual.** It is the single source of truth for the name, logo usage, color, typography, and voice/tone, covering `sales/`, `marketing/`, and any skill that generates collateral for either. Logo assets live in `marketing/brand/logos/`.

If a document's visual treatment (colors, fonts) or copy conflicts with `brand-guidelines.md`, the guidelines win, update the document, don't invent a new look.

*(`brand-guidelines.md` doesn't exist yet in this template, write it as the first real document in this repo, before any sales or marketing collateral.)*

---

## One-pagers

Follow the full process in `.claude/skills/one-pager/SKILL.md`. It ships with two modes, a standard-product mode with a pricing table, and a custom-service mode without one, adjust or collapse to one mode if your business doesn't need the distinction (see that file's setup note).

---

## Pitch deck

Rendered as a PDF (HTML + Chromium), not PowerPoint, this environment has no LibreOffice and brand fonts aren't guaranteed to be in PowerPoint's safe font list. Follow the full process in `.claude/skills/pitch-deck/SKILL.md`. Needs one-time setup (logo files, `company.json`) before first use, see that file.

---

## TokenRoster sync

This template can push a completed document (e.g. `setup-questionnaire.md`, or a business
plan derived from it) to the company's own TokenRoster listing. Follow the full process in
`.claude/skills/tokenroster-sync/SKILL.md`.

Requires a one-time manual step outside this repo: TokenRoster has no API/MCP way to create
a company listing, only to attach documents to one that already exists. The user must sign
up and create their listing at tokenroster.com's web app first, then generate a personal
access token at `/manage/tokens` and put it in `.env` as `TOKENROSTER_API_KEY` (see
`.env.example`). MCP server config lives in `.mcp.json` at the repo root.

---

## README files

Every folder has a `README.md`. Keep it current.

- When a file is added, moved, or removed from a folder, update that folder's README
- READMEs describe the folder's purpose and conventions only, no document inventories
- If a new subfolder is created, create a README for it immediately

---

## Agent personas

Each working folder has an `AGENT.md` that defines an expert persona. Load and adopt that persona whenever you are reading, creating, or editing documents in that folder.

| Folder | Persona | File |
|---|---|---|
| `strategy/` | {{STRATEGY_PERSONA_NAME}}: [one-line role] | `strategy/AGENT.md` |
| `marketing/` | {{MARKETING_PERSONA_NAME}}: [one-line role] | `marketing/AGENT.md` |
| `sales/` | {{SALES_PERSONA_NAME}}: [one-line role] | `sales/AGENT.md` |

The persona governs voice, priorities, and judgment calls for that folder. The rules in this file (naming, stats source, skill processes) still apply, the persona operates within them.

---

## General rules

- If you adopted a shared numbers file (see "Key numbers" above), never update stats in individual documents without updating it first
- When moving or renaming files, check if any skill files reference the old path and update them
- Do not create `README.md` files unless the user asks
- Do not create planning or analysis documents, work from conversation context
- [Optional house style rule, e.g. never use the em dash character, use a comma, colon, period, or parentheses instead, or rewrite the sentence. Keep, change, or delete.]
- Do not use the global memory system. Keep everything self-contained in this project.
- Treat copy guidance as living. When the user gives feedback on any copy (emails, LinkedIn posts and responses, one-pagers, and so on), capture the lesson in the most relevant persistent doc: the folder's `AGENT.md`, or the relevant skill or `README`. The method should compound instead of resetting each chat.
