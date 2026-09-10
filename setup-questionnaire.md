# Setup Questionnaire

Answer the company basics below, then hand this back. That's the only input personas
need: Claude derives each folder's persona — name, background, domain expertise,
operating philosophy, target audience, buyer segments, all of it — from these facts,
fitted to this company's stage and model, and writes it straight into `strategy/AGENT.md`,
`marketing/AGENT.md`, and `sales/AGENT.md`. You don't fill those files in yourself. Once
drafted, review the personas and say what's off, don't try to get everything right in
this file first.

The other sections (brand, key numbers, house style, skill setup) are separate facts
Claude can't infer, answer those too.

Answer inline below each question (bullets, short prose, whatever's fastest).

---

## 1. Company basics

1. Company name (exact spelling/capitalization to use everywhere)?
2. One-sentence description of what the company does?
3. Stage (pre-seed, seed, revenue-generating, etc.) and business model (SaaS, marketplace, services, hardware, etc.)?
4. Is there a real founder or operator whose background should anchor one or more of the personas (name + short bio)? Leave blank to let Claude invent a fitting expert for each folder instead.

## 2. Brand guidelines (`marketing/brand/brand-guidelines.md`)

5. Do you have a logo already? If so, can you provide `wordmark.svg`, `mark-tile.svg` (icon-only), and `mark-ink.svg` (single-color)?
6. Primary/secondary colors (with light + dark mode tokens if applicable)?
7. Typography — brand fonts for headings/body, and fallbacks?
8. Any non-negotiable logo rules (no recoloring, no rotating, minimum clear space, etc.)?
9. Voice/tone in 3-5 words, plus words or phrases to avoid?

## 3. Key numbers (optional — only if stats repeat across docs)

10. Is there pricing, user/revenue stats, or contact info that will appear in more than one document (pitch deck, one-pager, exec summary)? If yes, what are the current figures, and are any pulled live from an API/database (and if so, which one)?

## 4. House style

11. Any house style rules — em dash policy, Oxford comma, specific terms to always/never use?
12. Should external-facing files in `sales/` carry a brand prefix (e.g. `{{COMPANY}}_OnePager_Founders.md`)?
13. Where does the record of a sent email actually live (Gmail thread, CRM/pipeline log)? Should draft `.md` files be kept or deleted once sent?

## 5. Skill setup

14. Confirm company name for `.claude/skills/pitch-deck/scripts/deck-kit.js`'s `COMPANY_NAME`.
15. Any folders from the unused list (`business-plan/`, `executive-summary/`, `competitive-analysis/`, `website-copy/`, `1-pager/output/`, `emails/drafts/`) you want removed now vs. left as placeholders?
