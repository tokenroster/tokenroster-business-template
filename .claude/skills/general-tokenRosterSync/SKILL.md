---
name: general-tokenRosterSync
description: >
  Uploads a completed document (e.g. the filled-in setup-questionnaire.md, or a
  business plan derived from it) to this company's existing TokenRoster listing via
  the authenticated tokenroster-manage MCP server. Use when the user asks to sync,
  upload, or push a document to TokenRoster, or asks what's needed to connect this
  project to TokenRoster.
---

# TokenRoster Sync

Attaches a document from this repo to the user's own company listing on tokenroster.com,
using the document upload tools on the authenticated `tokenroster-manage` MCP server
(configured in `.mcp.json` at the repo root).

## What this does NOT do

TokenRoster has no API or MCP tool to create a new company listing. Per TokenRoster's own
auth documentation: "Creating and editing company listings still requires the web app's
browser-based login." This skill can only attach a document to a company that **already
exists** and is owned by the token holder.

## Step 1: Check prerequisites

Before attempting anything, verify:

1. **The company listing exists.** If `get_my_company` / `list_my_companies` returns nothing,
   stop and tell the user to sign in at tokenroster.com and create the listing there
   (browser-only, no shortcut).
2. **The `tokenroster-manage` MCP server is connected and signed in** for this session. It
   uses OAuth, not an API key. If its tools aren't available, tell the user to:
   - Approve the `.mcp.json` servers (first-run trust prompt, or list them under
     `enabledMcpjsonServers` in `.claude/settings.local.json`, see the `.example` file)
   - Run `/mcp`, select `tokenroster-manage`, and choose Authenticate to complete the
     browser sign-in
   - Restart the session if the tools still don't appear
3. **Which document to upload.** Ask the user if it's not obvious, e.g. the completed
   `setup-questionnaire.md`, or a polished document (business plan, exec summary) derived
   from it.

## Step 2: Confirm before uploading

This posts real data to a live, externally visible service. Always show the user what
will be sent (document name, size/summary, target company) and get explicit confirmation
before uploading, same as any other action that's visible outside this repo.

## Step 3: Upload

Load the `tokenroster-manage` tool schemas before calling them, and take field names from
the live schema, not from this file. Pick the method by file size:

**Tiny files (a few KB): `upload_document`.** It sends the file inline as base64 in the
tool call. Only use it when the content comfortably fits in one call.

**Everything else: the two-step flow.** Never paste a large file into a tool call.

1. Call `create_document_upload` for the target company. It returns a one-time upload URL,
   ready-made `curl` and PowerShell commands, and an `uploadPath`.
2. Run one of those commands from a shell against the local file. On Windows PowerShell 5,
   use `curl.exe`, not `curl` (an alias for `Invoke-WebRequest` there).
3. Call `complete_document_upload` with the returned `uploadPath` to attach the file to the
   listing.

Afterwards, `list_my_documents` confirms the document is on the listing.

`delete_document` is permanent. Only call it when the user explicitly asks, and confirm
first.

## Step 4: Report back

Tell the user what was uploaded and to which company (from the tool's response), or the
exact error if it failed (e.g. no credits, no matching company, token scope issue).

## Non-negotiables

- Authenticate only through the OAuth sign-in. Never ask the user for a token, auth code,
  or callback URL, and never borrow credentials from another project's config: they belong
  to a different context and would attribute the upload to the wrong account.
- Before uploading, confirm the signed-in account owns the intended company
  (`get_my_company`), so the document lands on the right listing.
