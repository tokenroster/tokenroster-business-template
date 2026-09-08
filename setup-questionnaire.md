# Setup Questionnaire

Answers here will be used to fill in `CLAUDE.md`, the three `AGENT.md` personas, and `marketing/brand/brand-guidelines.md`. Answer inline below each question (bullets, short prose, whatever's fastest), then hand this back.

---

## 1. Company basics

1. Company name (exact spelling/capitalization to use everywhere)?
2. One-sentence description of what the company does?
3. Stage (pre-seed, seed, revenue-generating, etc.) and business model (SaaS, marketplace, services, hardware, etc.)?
4. Who are the founders, and is there a specific person behind the strategy/marketing/sales voice, or should personas be composites?

## 2. Strategy persona (`strategy/AGENT.md`)

5. Who should "own" internal strategy docs — background, years of experience, prior companies built/exited?
6. What domain expertise matters most for *this* company's stage/model (e.g., regulated industry, two-sided marketplace, hardware supply chain)?
7. What's this persona's operating philosophy — what are they allergic to, what do they insist on?
8. What are the company's key strategic bets or open risks that strategy docs should be pressure-tested against?

## 3. Marketing persona (`marketing/AGENT.md`)

9. Who owns brand/content — background, a signature win worth mentioning?
10. What's their core belief about brand or growth that should color judgment calls?
11. Who is the actual target audience/reader for marketing content, and what's the company's positioning or wedge?
12. What tone should the brand strike, and what should it explicitly avoid sounding like?

## 4. Sales persona + audiences (`sales/AGENT.md`)

13. Who owns sales collateral — background, deal size/type they've closed, what they have no patience for?
14. What are the distinct buyer segments (e.g., investors, enterprise customers, channel partners)? For each: primary anxiety, what closes them, what kills the deal.
15. Where does the record of a sent email actually live (Gmail thread, CRM/pipeline log)? Should draft `.md` files be kept or deleted once sent?

## 5. Brand guidelines (`marketing/brand/brand-guidelines.md`)

16. Do you have a logo already? If so, can you provide `wordmark.svg`, `mark-tile.svg` (icon-only), and `mark-ink.svg` (single-color)?
17. Primary/secondary colors (with light + dark mode tokens if applicable)?
18. Typography — brand fonts for headings/body, and fallbacks?
19. Any non-negotiable logo rules (no recoloring, no rotating, minimum clear space, etc.)?
20. Voice/tone in 3-5 words, plus words or phrases to avoid?

## 6. Key numbers (optional — only if stats repeat across docs)

21. Is there pricing, user/revenue stats, or contact info that will appear in more than one document (pitch deck, one-pager, exec summary)? If yes, what are the current figures, and are any pulled live from an API/database (and if so, which one)?

## 7. House style

22. Any house style rules — em dash policy, Oxford comma, specific terms to always/never use?
23. Should external-facing files in `sales/` carry a brand prefix (e.g. `{{COMPANY}}_OnePager_Founders.md`)?

## 8. Skill setup

24. Confirm company name for `.claude/skills/pitch-deck/scripts/deck-kit.js`'s `COMPANY_NAME`.
25. Any folders from the unused list (`business-plan/`, `executive-summary/`, `competitive-analysis/`, `website-copy/`, `1-pager/output/`, `emails/drafts/`) you want removed now vs. left as placeholders?
