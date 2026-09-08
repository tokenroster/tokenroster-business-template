# Skills

Reusable Claude skill files for {{COMPANY}} workflows.

Drop `SKILL.md`-based skill folders here as you build repeatable processes. Each skill defines a repeatable process and where its output lands. Document each one in the table below as you add it.

| Skill | Purpose |
|------|---------|
| [tokenroster-company-setup](tokenroster-company-setup/SKILL.md) | First-time setup: turns `setup-questionnaire.md` answers into a filled-in `CLAUDE.md`, personas, and brand guidelines, replacing every `{{PLACEHOLDER}}` in the repo. Run this before any other skill on a fresh copy of the template. |
| [one-pager](one-pager/SKILL.md) | Generates audience-specific one-pagers in an established format. Outputs land in `sales/1-pager/`. |
| [md-to-pdf](md-to-pdf/SKILL.md) | Converts markdown source files to professional PDF exports. Single-file and batch export for `sales/1-pager/` one-pagers into `sales/1-pager/output/`. Needs its own `npm install` before first use, see `md-to-pdf/SKILL.md`. |
| [pitch-deck](pitch-deck/SKILL.md) | Builds/updates a brand-compliant pitch deck as a PDF (HTML + Chromium, not PowerPoint). Depends on `md-to-pdf`'s installed Playwright/Chromium. Needs three logo SVGs and a company name filled in before first use, see `pitch-deck/SKILL.md`. |

Add rows here as you build more (e.g. an assessment-framework or valuation skill), following the same pattern.
