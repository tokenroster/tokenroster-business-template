# Sales

External-facing collateral: documents handed to prospects, investors, partners, and other outside readers.

| Convention | Detail |
|---|---|
| Naming | kebab-case (add a brand prefix here if you adopt one, see `CLAUDE.md`) |
| Audience | External, specific to each document's target reader |
| Updates | When stats, pricing, or product features change; if you keep a shared numbers file (see `CLAUDE.md`), update it first |

`1-pager/` contains one-pager markdown sources, plus `1-pager/output/` for their exported PDFs. PDFs are generated from the markdown source files, edit the markdown, then regenerate.

`emails/` and `emails/drafts/` hold sales outreach. See `sales/AGENT.md` for the convention on whether draft files are kept or deleted once sent.

`pitch-deck/` holds deck content: `generation/` for the build script and deck-specific assets, `output/` for rendered PDFs. Add the markdown content source (`<Company>_PitchDeck.md`, `<Company>` being `name` from `company.json`) and `generation/generate-deck.js` when you write your first deck, see `.claude/skills/pitch-deck/SKILL.md` for the expected layout.
