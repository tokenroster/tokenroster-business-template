---
name: tokenroster-company-setup
description: >
  Runs first-time setup of this workspace template for a real company. Walks the user
  through setup-questionnaire.md (or reads it if already filled in) for company basics
  and brand facts, derives each folder's persona from that alone and generates the three
  AGENT.md files, writes company.json (name + domain, read by the skills at runtime), and
  fills in CLAUDE.md, README.md, and marketing/brand/brand-guidelines.md. Never edits
  the skills themselves. Use
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
- **Always start with Q0 (the domain), before any other question.** Ask it on its own,
  record the answer, then:
  - **If there's a live site**, read it with WebFetch before asking anything else: the
    home page first, then whatever about/team, pricing, and contact pages it links to.
    Also check the page source for a logo file (SVG preferred), color values (CSS custom
    properties, repeated hex values), and fonts (Google Fonts links, `font-family`).
  - Pre-fill every answer the site actually supports and tag each one
    `(from website, confirm)`. Questions the site can usually answer: Q1 name, Q2
    description, Q3 business model (stage only if stated), Q4 founder (about/team page),
    Q5 whether a logo exists and where, Q6 colors, Q7 fonts, Q9 voice (inferred from
    the copy), Q10 pricing and contact info. Q8, Q11, Q12, and Q13
    can't come from a website, always ask those.
  - Only pre-fill what's on the page. Leave a question blank rather than guess, and say
    in the tag when something is inferred rather than stated (e.g.
    `(inferred from website copy, confirm)`).
  - Show the user a short summary of what was pre-filled, then continue one question at
    a time: first confirm or correct each pre-filled answer, then ask the unanswered
    ones, in file order. Remove the tag once the user confirms an answer.
  - **If there's no site yet**, or it can't be fetched, say so in one line and walk
    through Q1 onward as normal.
- **If it's blank or partially blank**, ask exactly one question per message, never more.
  Either:
  - Ask the user to fill it in directly (fastest if they want to think it through in an
    editor), then come back, or
  - Walk through the unanswered questions conversationally, in file order, one question
    at a time: ask a single question, wait for the answer, write it into the file under
    that question, then ask the next. Never group questions, not even ones from the same
    section, and never bundle a follow-up with the next question.
- Q4 is optional: if the user names a real founder to anchor a persona, use that
  background in Step 4 instead of inventing one for that folder. If left blank, Claude
  invents a fitting expert for every persona.
- Confirm with the user once the file reads as complete before propagating anything,
  including the exact company name (Q1) and bare domain (Q0) that will go into
  `company.json`.

---

## Step 2 — Write `company.json` and resolve the placeholders

Write `company.json` at the repo root from the answered questionnaire:

```json
{
  "name": "<Q1, exact name/casing>",
  "domain": "<Q0, bare domain like example.com: no https://, no trailing slash>"
}
```

This is the only place the name and domain live for tooling. The skills (`one-pager`,
`md-to-pdf`, `pitch-deck`) read it at runtime, so **never edit anything under
`.claude/skills/` during setup**. Keeping skills identical to the template is what lets
template updates merge cleanly later. Only add fields to `company.json` when a script or
skill actually reads them.

Then resolve the placeholders that live in the content files:

| Placeholder | Comes from |
|---|---|
| `{{COMPANY}}` | Q1 (exact name/casing) |
| `{{STRATEGY_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |
| `{{MARKETING_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |
| `{{SALES_PERSONA_NAME}}` | Name generated in Step 4 (or Q4's named founder, if it applies to this folder) |

Find every occurrence with a repo-wide search that excludes the skills folder
(`grep -rl --exclude-dir=.claude '{{COMPANY}}\|{{STRATEGY_PERSONA_NAME}}\|{{MARKETING_PERSONA_NAME}}\|{{SALES_PERSONA_NAME}}' .`)
rather than guessing file locations, template files change. Tokens inside
`.claude/skills/` (`{{COMPANY_DOMAIN}}`, `{{BODY}}`, `{{STYLES}}`, `{{TITLE}}`) are
render-time tokens the scripts fill themselves, leave them alone.

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

## Step 7 — Finish up, keep the skeleton intact

- Never delete any file or folder of the skeleton project during setup. That includes
  the empty placeholder folders (`strategy/business-plan/`, `strategy/executive-summary/`,
  `strategy/competitive-analysis/`, `marketing/website-copy/`, `sales/1-pager/output/`,
  `sales/emails/drafts/`, `sales/pitch-deck/generation/assets/`,
  `sales/pitch-deck/output/`) and their `.gitkeep` files, the READMEs, `AGENT.md` files,
  skills, and `setup-questionnaire.md` itself. Setup only edits text inside content files
  (never skills) and fills in or adds new ones (`company.json`, `brand-guidelines.md`,
  `key-numbers.md`). Don't offer to remove anything. The skills' own remaining setup
  (installing dependencies, adding logo SVGs) is left to the user, each skill's SKILL.md
  covers it.
- Update each affected folder's `README.md` if a naming convention changed (e.g. the
  sales brand-prefix decision from Q12), per `CLAUDE.md`'s README rule. Don't create new
  READMEs, only update the ones that already exist.
- Once every `{{PLACEHOLDER}}` outside `.claude/skills/` is resolved, delete the setup blockquote at the
  top of `README.md` and the "template/README.md" pointer line at the top of `CLAUDE.md`.

---

## Step 8 — Report back

List what was filled in (including the `company.json` values), the persona each folder ended up with (name + one line each),
what was deliberately skipped (e.g. no shared numbers file yet, folders left as
placeholders), and anything still blocked on the user (missing logo files, an undecided
house style rule). Re-run a `{{` search excluding `.claude/` before declaring done, a
single missed placeholder is the most common failure mode here. Also run
`git status -- .claude/skills` and confirm it shows no changes.
