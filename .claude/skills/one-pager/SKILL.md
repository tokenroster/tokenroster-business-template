---
name: one-pager
description: >
  Generates a {{COMPANY}} one-pager for a specific audience. Use whenever the user
  asks to create, write, or draft a one-pager, sales doc, leave-behind, or audience-specific
  pitch document. Trigger for phrases like "make a one-pager for X", "draft a one-pager",
  "we need a doc for X audience", "write a pitch doc for X", or any variation of
  creating a short-form sales or partnership document for a specific audience.
---

# {{COMPANY}} One-Pager Generator

This skill produces audience-specific one-pagers in {{COMPANY}}'s established format.
Every one-pager is tight, direct, and written entirely for one reader, not a general audience.

> Setup note: this skeleton assumes two modes (platform vs. custom service), copied from a two-sided-marketplace example. If your business only ever sells one thing to different audiences, delete the mode distinction in Step 1 and keep a single structure. Delete this blockquote once you've decided.

---

## Step 1 — Identify the audience and mode

Before writing anything, determine:

1. **Who is the audience?** (e.g. end customers, investors, channel partners, institutional buyers)
2. **What is their primary job to be done?** (raise capital, find deal flow, screen applicants, evaluate a purchase, etc.)
3. **What does {{COMPANY}} give them?** (standard product/service vs. a bespoke engagement)
4. **Do they have a named contact or proof point?** (e.g. a named partner org, a city, a client name)

Then determine the mode (delete this table and Step 3's second structure if you only need one mode):

| Mode | Use when | Examples |
|---|---|---|
| **Platform** | Audience uses the standard product/service every other customer gets | [e.g. end users, investors] |
| **Custom service** | Audience receives something built to their specific criteria | [e.g. institutional clients, bespoke engagements] |

If unsure, ask: *does this audience get the same thing every other user gets, or do we build something from scratch for them?* Custom service = bespoke.

---

## Step 2 — Gather inputs

Collect the following before writing. If not provided, use defaults from the reference data below.

**Required:**
- Audience name (e.g. "accelerators", "city EDCs")
- Their core pain point (1 sentence)
- The primary value {{COMPANY}} delivers to them

**Optional but preferred:**
- A named proof point (partner org, city, fund, or client name)
- Specific features most relevant to this audience
- Any pricing or engagement notes that differ from standard

**Reference data:**

If you keep a shared numbers file (see `CLAUDE.md`'s "Key numbers" section), read it before writing any one-pager, it's the single source of truth for current stats, pricing, and contact information. Do not use hardcoded numbers, pull from that file every time.

Always read `marketing/brand/brand-guidelines.md` before writing or exporting any one-pager. It governs voice/tone as well as color, typography, and logo usage for the exported PDF.

---

## Step 3 — Write the one-pager

### Platform mode structure

Follow this section order exactly:

**1. Header**
```
# {{COMPANY}}
### [Tagline — written for this audience, not generic]

**{{COMPANY_DOMAIN}} · [Month Year]**

---
```
Tagline formula: what {{COMPANY}} does *for this specific reader*, in plain language. Not a brand statement.

**2. The problem**
Section header: `## The [X] problem`, name the specific problem this audience has.
- 2–3 sentences maximum
- Written in second person ("you", "your") where possible
- End with an italicized one-liner: `*{{COMPANY}} [fixes/is/solves] that.*`

**3. What you get**
Section header: `## What [we do / you get]`
- 1–2 sentences of framing
- A feature table with 2 columns and **explicit header labels** (e.g. `{{COMPANY}} provides | Why it matters`), never use empty header cells
- 4–6 rows maximum, only features relevant to this audience

**4. How it works** *(include if the workflow needs explaining)*
Section header: `## How it works for your [audience type]`
- Numbered steps (3–5 max)
- Written as a journey through the product from their perspective

**5. Who it's for**
Section header: `## Who it's for`
- One tight paragraph. Single audience. No bullet lists of four different customer types.
- Include: stage, geography if relevant, what they need that the product provides

**6. Pricing**
Section header: `## Pricing`
- 3-column table: Plan | Price | Best for
- Include your actual pricing tiers
- Enterprise/top-tier row: reframe for this audience (what does it mean *to them*, not to a generic buyer)
- End with a closing italic note if you have one (e.g. no-contract, free-trial framing)

**7. Proof it works**
Section header: `## Proof it works`
- 1–2 sentences of context
- Blockquote with current traction stats, pulled from your numbers source, not invented
- 1 sentence on the growth/expansion plan, if relevant

**8. Get started**
Section header: `## Get started`
- 1–2 sentences max
- Direct CTA: what should they do right now
- If enterprise-focused: include a contact email

**9. Footer**
```
*{{COMPANY}} · Confidential & Proprietary · [Month Year]*
```

---

### Custom service mode structure

Follow this section order exactly:

**1. Header** — same format as platform mode

**2. The problem**
- Same format as platform mode
- End with: `*{{COMPANY}} [builds/designs/creates] that.*`

**3. What we do differently**
Section header: `## What we do differently`
- Open by explicitly contrasting with the standard product:
  "{{COMPANY}}'s platform uses a standard [X] for most customers. That's not what we build for [this audience]."
- Then describe the custom service clearly
- Feature table: what the custom engagement includes | why it matters

**4. How it works**
Section header: `## How it works`
- Numbered steps (3–5 max)
- Written as a client engagement process, not a product workflow
- Use plain language, no platform jargon

**5. Who this is for**
Section header: `## Who this is for`
- Bullet list of org types
- 4–6 bullets max

**6. Why {{COMPANY}}**
Section header: `## Why {{COMPANY}}`
- 2–3 sentences on relevant experience
- Name a specific proof point if available (named client, city, fund)
- Keep it factual, no superlatives

**7. Pricing**
Section header: `## Pricing`
- No table
- 2–3 sentences describing how engagements are scoped
- List what's typically included
- End with a scoped-proposal CTA

**8. Contact**
```
**[contact email]** · [{{COMPANY_DOMAIN}}](https://{{COMPANY_DOMAIN}})
```

**9. Footer** — same as platform mode

---

## Step 4 — Tone and style rules

Apply these to every one-pager regardless of mode:

- **One reader.** Every sentence should be written as if handed to a single person. No "whether you're a founder or an investor" constructions.
- **Short sentences.** If a sentence runs past 20 words, break it.
- **No superlatives.** Never "best", "leading", "premier", "cutting-edge", "world-class" (unless quoting a third party).
- **Second person.** Use "you" and "your" throughout the problem and solution sections.
- **Italicize the punch line.** The closing line of the problem section gets italics. One italicized line per section maximum.
- **Tables over bullets for features.** If listing more than 3 features, use a table with a "why it matters" column.
- **No trailing summary.** The document ends at the footer. No "in conclusion" or recap paragraph.
- **Specificity over generality.** A real number beats a vague growth claim. Named cities, real numbers, actual proof points.

---

## Step 5 — Quality checks before saving

- [ ] Tagline is written for this specific audience, not a general brand statement
- [ ] Problem section ends with the italicized one-liner
- [ ] Feature table only includes features relevant to this audience
- [ ] "Who it's for" is one tight paragraph, not a list of four audience types
- [ ] Pricing row for the top tier is reframed for this audience (platform mode)
- [ ] Traction stats match current reference data
- [ ] No superlatives
- [ ] CTA is direct and actionable
- [ ] Contact email included if enterprise or custom service audience
- [ ] Footer date matches the current month and year

---

## Output

Save the file to `sales/1-pager/` using this naming convention:

`onepager-[audience-name].md` (kebab-case, or your adopted external-doc convention, see `CLAUDE.md`)

After saving, confirm the file path to the user and note any decisions made (e.g. platform vs. custom service mode, proof points used).
