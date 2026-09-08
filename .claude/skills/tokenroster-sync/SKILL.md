---
name: tokenroster-sync
description: >
  Uploads a completed document (e.g. the filled-in setup-questionnaire.md, or a
  business plan derived from it) to this company's existing TokenRoster listing via
  the authenticated tokenroster-manage MCP server. Use when the user asks to sync,
  upload, or push a document to TokenRoster, or asks what's needed to connect this
  project to TokenRoster.
---

# TokenRoster Sync

Attaches a document from this repo to the user's own company listing on tokenroster.com,
using the `upload_document` tool on the authenticated `tokenroster-manage` MCP server
(configured in `.mcp.json` at the repo root).

## What this does NOT do

TokenRoster has no API or MCP tool to create a new company listing. Per TokenRoster's own
auth documentation: "Creating and editing company listings still requires the web app's
browser-based login." This skill can only attach a document to a company that **already
exists** and is owned by the token holder.

## Step 1 — Check prerequisites

Before attempting anything, verify:

1. **`TOKENROSTER_API_KEY` is set** (in `.env`, loaded from `.env.example`'s template, or
   the shell environment). If missing, stop and tell the user:
   - Sign in at tokenroster.com and create the company listing (browser-only, no shortcut)
   - Generate a personal access token at https://tokenroster.com/manage/tokens
   - Put it in `.env` as `TOKENROSTER_API_KEY=trpat_...` (never hardcode it in any tracked
     file, never paste it into chat, never copy one from another project's config)
2. **The `tokenroster-manage` MCP server is connected** for this session. If the tool isn't
   available, the user needs to approve/enable it (first-run trust prompt for `.mcp.json`
   servers) and may need to restart the session.
3. **Which document to upload.** Ask the user if it's not obvious, e.g. the completed
   `setup-questionnaire.md`, or a polished document (business plan, exec summary) derived
   from it.

## Step 2 — Confirm before uploading

This posts real data to a live, externally visible service. Always show the user what
will be sent (document name, size/summary) and get explicit confirmation before calling
`upload_document`, same as any other action that's visible outside this repo.

## Step 3 — Discover the real tool schema, then call it

`upload_document`'s exact input schema has not been verified against the live server as of
this skill being written (TokenRoster's docs describe it only in prose: "programmatically
add documents"). Do not guess field names. Once `tokenroster-manage` is connected, its
tools are available with full parameter schemas, exactly like any other MCP tool, so:

1. Locate `upload_document` among the connected tools and read its actual input schema.
2. Map the confirmed document to that schema (likely something like a filename/title plus
   file content, but confirm from the live schema, not this note).
3. Call it.

## Step 4 — Report back

Tell the user what was uploaded and to which company (from the tool's response), or the
exact error if it failed (e.g. no credits, no matching company, token scope issue).

## Non-negotiables

- Never source `TOKENROSTER_API_KEY` from anywhere outside this project's own `.env` /
  environment. Do not read another project's config to find one, even if you know one
  exists elsewhere, that key belongs to a different context and reusing it here would
  attribute the upload to the wrong account.
- Never log, print, or write the token value anywhere other than `.env`.
