---
name: tokenroster-company-setup
description: >
  Runs first-time setup of this workspace template for a real company. Walks the user
  through setup-questionnaire.md (or reads it if already filled in), then propagates the
  answers into CLAUDE.md, README.md, the three AGENT.md personas, and
  marketing/brand/brand-guidelines.md, replacing every {{PLACEHOLDER}} in the repo. Use
  when the user asks to set up, initialize, onboard, or configure this template for a new
  company, asks to fill in or process the setup questionnaire, or asks how to get started
  with this repo.
---

# Company Setup

Turns this generic template into a real company's workspace by running the checklist
already described in `README.md`'s "Setup checklist" section, driven by answers to
`setup-questionnaire.md`. This skill doesn't invent a new process, it executes that one
and keeps it from being skipped or done half-way.

---

## Step 1 — Get the questionnaire answered

Read `setup-questionnaire.md` at the repo root. Each numbered question needs an answer
written inline beneath it.

- **If it's already filled in** (every question has real content under it, not blank),
  skip straight to Step 2.
- **If it's blank or partially blank**, don't dump all 25 questions on the user at once.
  Either:
  - Ask the user to fill it in directly (fastest if they want to think it through in an
    editor), then come back, or
  - Walk through the sections conversationally (company basics, then each persona, then
    brand, then key numbers, then house style, then skill setup) and write their answers
    into the file yourself as they respond, section by section.
- Confirm with the user once the file reads as complete before propagating anything,
  changes from here touch most of the repo.

---

## Step 2 — Extract the placeholder values

From the answered questionnaire, resolve:

| Placeholder | Comes from |
|---|---|
| `{{COMPANY}}` | Q1 (exact name/casing) |
| `{{COMPANY_DOMAIN}}` | Company's domain, ask if not given (used in one-pager/pitch-deck headers) |
| `{{STRATEGY_PERSONA_NAME}}` | Q5 (a real name, or a composite persona name if Q4 says so) |
| `{{MARKETING_PERSONA_NAME}}` | Q9 |
| `{{SALES_PERSONA_NAME}}` | Q13 |

Find every occurrence with a repo-wide search (`grep -rl '{{COMPANY}}\|{{STRATEGY_PERSONA_NAME}}\|{{MARKETING_PERSONA_NAME}}\|{{SALES_PERSONA_NAME}}\|{{COMPANY_DOMAIN}}'`)
rather than guessing file locations, template files change. Do not touch `{{BODY}}`,
`{{STYLES}}`, or `{{TITLE}}` in `.claude/skills/md-to-pdf/` — those are that skill's own
render-time template tokens, unrelated to company setup.

---

## Step 3 — Fill in `CLAUDE.md`

Replace `{{COMPANY}}` and the three persona-name placeholders throughout. Using Q22/Q23,
either fill in or delete the bracketed house-style line and the sales brand-prefix
exception. Delete the top blockquote setup note once every placeholder in the file is
resolved.

---

## Step 4 — Write the three personas

For each of `strategy/AGENT.md`, `marketing/AGENT.md`, `sales/AGENT.md`: replace the
bracketed skeleton with real content built from the matching questionnaire section (Q5–8
strategy, Q9–12 marketing, Q13–15 sales), following the existing structure in each file
(bio → what they know cold → how they approach this folder → voice → non-negotiables,
plus sales's audience table and marketing's email-drafting section). Write a persona
specific to this company, don't leave generic SaaS boilerplate in the bullets. Delete each
file's top blockquote once done.

---

## Step 5 — Decide on a shared numbers file

From Q21: if stats, pricing, or contact info will repeat across more than one document,
create `key-numbers.md` at the repo root per the pattern `CLAUDE.md`'s "Key numbers"
section describes, and note any live API/database source there. If nothing repeats yet,
skip it, don't create a file with nothing to centralize.

---

## Step 6 — Write `marketing/brand/brand-guidelines.md`

This file doesn't exist in the template, Q16–20 are its source material: name usage, logo
rules (once real logo SVGs are available), color tokens (light + dark if applicable),
typography, and voice/tone in 3-5 words plus words to avoid. Follow the file list
`marketing/brand/README.md` already promises (`brand-guidelines.md` + `logos/`). If the
user has logo files, ask them to place `wordmark.svg`, `mark-tile.svg`, and `mark-ink.svg`
in `marketing/brand/logos/`, that's what the pitch-deck skill expects by name.

Do not create any sales or marketing collateral before this file exists, per `CLAUDE.md`.

---

## Step 7 — Wire up the pitch-deck skill

Set `COMPANY_NAME` near the top of `.claude/skills/pitch-deck/scripts/deck-kit.js` to the
Q1 answer (Q24 confirms it). Leave the rest of that skill's setup (installing
dependencies, adding logo SVGs) to the user, it's covered by that skill's own SKILL.md.

---

## Step 8 — Clean up placeholder scaffolding

- Per Q25, ask which of the unused empty folders (`strategy/business-plan/`,
  `strategy/executive-summary/`, `strategy/competitive-analysis/`,
  `marketing/website-copy/`, `sales/1-pager/output/`, `sales/emails/drafts/`,
  `sales/pitch-deck/generation/assets/`, `sales/pitch-deck/output/`) to remove now versus
  leave as placeholders (each has a `.gitkeep`, so leaving them is fine and reversible).
  Don't delete folders the user didn't ask to remove.
- Update each affected folder's `README.md` if a subfolder was removed or a naming
  convention changed (e.g. the sales brand-prefix decision from Q23), per `CLAUDE.md`'s
  README rule. Don't create new READMEs, only update the ones that already exist.
- Once every `{{PLACEHOLDER}}` is resolved repo-wide, delete the setup blockquote at the
  top of `README.md` and the "template/README.md" pointer line at the top of `CLAUDE.md`.

---

## Step 9 — Report back

List what was filled in, what was deliberately skipped (e.g. no shared numbers file yet,
folders left as placeholders), and anything still blocked on the user (missing logo files,
an undecided house style rule). Re-run a repo-wide `{{` search before declaring done, a
single missed placeholder is the most common failure mode here.
