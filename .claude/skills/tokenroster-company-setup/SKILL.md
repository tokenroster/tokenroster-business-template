---
name: tokenroster-company-setup
description: >
  Runs first-time setup of this workspace template for a real company. Walks the user
  through setup-questionnaire.md (or reads it if already filled in) for company basics
  and brand facts, derives each folder's persona from that alone and generates the three
  AGENT.md files, and propagates everything into CLAUDE.md, README.md, and
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
written inline beneath it. Note that this questionnaire collects company facts, not
persona bios or persona-supporting context, the personas (and everything about them:
background, domain expertise, audience, buyer segments) get derived and generated
entirely in Step 4.

- **If it's already filled in** (every question has real content under it, not blank),
  skip straight to Step 2.
- **If it's blank or partially blank**, don't dump all 15 questions on the user at once.
  Either:
  - Ask the user to fill it in directly (fastest if they want to think it through in an
    editor), then come back, or
  - Walk through the sections conversationally (company basics, then brand, then key
    numbers, then house style, then skill setup) and write their answers into the file
    yourself as they respond, section by section.
- Q4 is optional: if the user names a real founder to anchor a persona, use that
  background in Step 4 instead of inventing one for that folder. If left blank, Claude
  invents a fitting expert for every persona.
- Confirm with the user once the file reads as complete before propagating anything,
  changes from here touch most of the repo.

---

## Step 2 — Extract the placeholder values

From the answered questionnaire, resolve:

| Placeholder | Comes from |
|---|---|
| `{{COMPANY}}` | Q1 (exact name/casing) |
| `{{COMPANY_DOMAIN}}` | Company's domain, ask if not given (used in one-pager/pitch-deck headers) |
| `{{STRATEGY_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |
| `{{MARKETING_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |
| `{{SALES_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |

Find every occurrence with a repo-wide search (`grep -rl '{{COMPANY}}\|{{STRATEGY_PERSONA_NAME}}\|{{MARKETING_PERSONA_NAME}}\|{{SALES_PERSONA_NAME}}\|{{COMPANY_DOMAIN}}'`)
rather than guessing file locations, template files change. Do not touch `{{BODY}}`,
`{{STYLES}}`, or `{{TITLE}}` in `.claude/skills/md-to-pdf/` — those are that skill's own
render-time template tokens, unrelated to company setup.

---

## Step 3 — Fill in `CLAUDE.md`

Replace `{{COMPANY}}` and the three persona-name placeholders throughout. Using Q11/Q12,
either fill in or delete the bracketed house-style line and the sales brand-prefix
exception. Delete the top blockquote setup note once every placeholder in the file is
resolved.

---

## Step 4 — Derive and generate the three personas

The user only gave company facts (Q1-4), everything else here is Claude's inference, not
theirs to supply. For each of `strategy/AGENT.md`, `marketing/AGENT.md`, `sales/AGENT.md`,
work in two passes:

1. **Derive the supporting context** from Q1-3 (name, one-line description, stage/model)
   before writing any persona text:
   - Strategy: what domain expertise this company's stage/model actually demands (e.g.
     regulated industry, two-sided marketplace, hardware supply chain), and the key
     strategic bets or risks its documents should be pressure-tested against.
   - Marketing: who the real target reader is and what this company's positioning/wedge
     is likely to be. Brand voice/tone itself comes from Q9, don't re-derive it.
   - Sales: the distinct buyer segments this business model implies (e.g. investors,
     enterprise buyers, channel partners), and for each, a plausible primary anxiety,
     what closes them, and what kills the deal.
   This is an inference, not a guess to hide: it will be visibly wrong sometimes, that's
   what the review in step 3 below is for.
2. **Write the persona** from that derived context, following the existing structure
   already in each file (bio → what they know cold → how they approach this folder →
   voice → non-negotiables, plus sales's audience table and marketing's email-drafting
   section).

- If Q4 names a real founder/operator meant to anchor a given folder's persona, build
  that persona from their actual background instead of inventing one. Otherwise, invent a
  fictional expert whose credibility and domain fit this company's specific stage and
  model, don't reuse a generic "seasoned operator" bio.
- Ground every "what you know cold" bullet and "how you approach this folder" question in
  the context just derived, not generic wisdom that could apply to any company.
- Fill in the sales audience table from the derived buyer segments, and the
  email-source-of-truth section from Q13.
- Before finalizing, show the user each persona's name, bio, and derived context briefly
  (a few sentences each) so they can correct anything Claude guessed wrong, they
  shouldn't have to write these from scratch, but an inferred buyer segment or strategic
  risk needs a real check, not a rubber stamp.
- Delete each file's top blockquote once done.

---

## Step 5 — Decide on a shared numbers file

From Q10: if stats, pricing, or contact info will repeat across more than one document,
create `key-numbers.md` at the repo root per the pattern `CLAUDE.md`'s "Key numbers"
section describes, and note any live API/database source there. If nothing repeats yet,
skip it, don't create a file with nothing to centralize.

---

## Step 6 — Write `marketing/brand/brand-guidelines.md`

This file doesn't exist in the template, Q5–9 are its source material: name usage, logo
rules (once real logo SVGs are available), color tokens (light + dark if applicable),
typography, and voice/tone in 3-5 words plus words to avoid. Follow the file list
`marketing/brand/README.md` already promises (`brand-guidelines.md` + `logos/`). If the
user has logo files, ask them to place `wordmark.svg`, `mark-tile.svg`, and `mark-ink.svg`
in `marketing/brand/logos/`, that's what the pitch-deck skill expects by name.

Do not create any sales or marketing collateral before this file exists, per `CLAUDE.md`.

---

## Step 7 — Wire up the pitch-deck skill

Set `COMPANY_NAME` near the top of `.claude/skills/pitch-deck/scripts/deck-kit.js` to the
Q1 answer (Q14 confirms it). Leave the rest of that skill's setup (installing
dependencies, adding logo SVGs) to the user, it's covered by that skill's own SKILL.md.

---

## Step 8 — Clean up placeholder scaffolding

- Per Q15, ask which of the unused empty folders (`strategy/business-plan/`,
  `strategy/executive-summary/`, `strategy/competitive-analysis/`,
  `marketing/website-copy/`, `sales/1-pager/output/`, `sales/emails/drafts/`,
  `sales/pitch-deck/generation/assets/`, `sales/pitch-deck/output/`) to remove now versus
  leave as placeholders (each has a `.gitkeep`, so leaving them is fine and reversible).
  Don't delete folders the user didn't ask to remove.
- Update each affected folder's `README.md` if a subfolder was removed or a naming
  convention changed (e.g. the sales brand-prefix decision from Q12), per `CLAUDE.md`'s
  README rule. Don't create new READMEs, only update the ones that already exist.
- Once every `{{PLACEHOLDER}}` is resolved repo-wide, delete the setup blockquote at the
  top of `README.md` and the "template/README.md" pointer line at the top of `CLAUDE.md`.

---

## Step 9 — Report back

List what was filled in, the persona each folder ended up with (name + one line each),
what was deliberately skipped (e.g. no shared numbers file yet, folders left as
placeholders), and anything still blocked on the user (missing logo files, an undecided
house style rule). Re-run a repo-wide `{{` search before declaring done, a single missed
placeholder is the most common failure mode here.
