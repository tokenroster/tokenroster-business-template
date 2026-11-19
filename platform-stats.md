# Platform Stats

The single source of truth for every number and fact that appears in more than one document: traction, pricing, product facts, partnerships, and contact details. One-pagers, the pitch deck, plans, and summaries read from this file and never hardcode a value.

**Propagation rule:** a number changes here first, then flows out to the documents that cite it. Never edit a stat in a document without updating it here in the same change.

> Setup note: `general-companySetup` fills this from `setup-questionnaire.md` (Q10). Leave a row as `TBD` rather than inventing a figure. Delete this blockquote once the first real numbers are in.

Last updated: TBD

---

## Traction

| Metric | Value | As of | Source |
|---|---|---|---|
| [e.g. Active users] | TBD | TBD | [manual / API field / dashboard] |
| [e.g. Monthly revenue] | TBD | TBD | |

## Pricing

| Plan or offer | Price | Billing | Notes |
|---|---|---|---|
| [Plan name] | TBD | [monthly / annual / one-time] | |

## Product facts

- [One fact per line that documents repeat, e.g. supported platforms, integrations count, launch date]

## Partnerships

| Partner | Type | Since | Can be named publicly |
|---|---|---|---|
| [Partner] | [distribution / technology / customer] | TBD | [yes / no] |

## Contact

| Field | Value |
|---|---|
| Website | [domain from `company.json`] |
| Sales / general email | TBD |
| Founder contact | TBD |

## Live sources

If any value above is pulled from an API, database, or MCP server, record the exact source and field mapping here so the refresh can be repeated. Values the source doesn't expose stay manual.

| Value | Source | Field / query |
|---|---|---|
| | | |
