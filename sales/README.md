# Sales

One-to-one work: collateral handed to prospects, investors, partners, and other outside readers, plus per-account records and email.

| Convention | Detail |
|---|---|
| Naming | kebab-case (add a brand prefix here if you adopt one, see `CLAUDE.md`) |
| Audience | External, specific to each document's target reader |
| Updates | When stats, pricing, or product features change; update `platform-stats.md` first |

## Subfolders

| Folder | Contents |
|---|---|
| `collateral/1-pager/` | One Markdown source per audience, with exported PDFs in `output/`. Edit the Markdown, then regenerate the PDF |
| `collateral/pitch-deck/` | Deck content: the Markdown content source (`<Company>_PitchDeck.md`, `<Company>` being `name` from `company.json`), `generation/` for the build script and deck-specific assets, `output/` for versioned PDFs. See `.claude/skills/general-pitchDeck/SKILL.md` for the expected layout |
| `collateral/templates/` | Reusable agreements and standard emails |
| `accounts/<account>/` | One folder per account: `agreements/`, pricing, `meetings/` |
| `emails/drafts/` | Outgoing drafts. See `sales/AGENT.md` for whether drafts are kept or deleted once sent |
| `emails/inbox/` | Logged incoming emails |
