# Skills

Reusable Claude skill files for the company's workflows. Skills stay company-agnostic: anything they need about the company (name, domain) they read from `company.json` at the repo root, so setup never edits a skill and template updates to skills merge cleanly.

Drop `SKILL.md`-based skill folders here as you build repeatable processes. Each skill defines a repeatable process and where its output lands. Document each one in the table below as you add it.

| Skill | Purpose |
|------|---------|
| [general-companySetup](general-companySetup/SKILL.md) | First-time setup: turns `setup-questionnaire.md` answers into `company.json`, a filled-in `CLAUDE.md`, personas, and brand guidelines. Run this before any other skill on a fresh copy of the template. |
| [general-onePager](general-onePager/SKILL.md) | Generates audience-specific one-pagers in an established format. Outputs land in `sales/collateral/1-pager/`. |
| [general-mdToPdf](general-mdToPdf/SKILL.md) | Converts markdown source files to professional PDF exports. Single-file and batch export for `sales/collateral/1-pager/` one-pagers into `sales/collateral/1-pager/output/`. Needs its own `npm install` before first use, see `general-mdToPdf/SKILL.md`. |
| [general-pitchDeck](general-pitchDeck/SKILL.md) | Builds/updates a brand-compliant pitch deck as a PDF (HTML + Chromium, not PowerPoint). Depends on `general-mdToPdf`'s installed Playwright/Chromium. Needs three logo SVGs and `company.json` filled in before first use, see `general-pitchDeck/SKILL.md`. |

| [general-summarizeChanges](general-summarizeChanges/SKILL.md) | Summarizes uncommitted git changes per area, scoped to "current" (everything) or "staged" from the user's wording. Report only, never stages or commits. |
| [general-tokenRosterSync](general-tokenRosterSync/SKILL.md) | Uploads a completed document to the company's existing TokenRoster listing through the `tokenroster-manage` MCP server (OAuth sign-in). Confirms before every upload. |

Naming: `<prefix>-<camelCaseName>`, with `general` for reusable skills and the company name as the prefix for company-specific ones.

Add rows here as you build more (e.g. an assessment-framework or valuation skill), following the same pattern.
