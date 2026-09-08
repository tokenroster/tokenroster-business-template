---
name: summarize-changes
description: >
  Summarizes source-control (git) changes in a condensed, per-area format.
  Trigger whenever the user asks to list, summarize, or review changes in git/source
  control — including bare prompts like "summarize changes", "current changes",
  "staged changes", "what changed", "summarize current", or "summarize staged".
  The word "current" scopes the summary to all uncommitted changes (staged +
  unstaged); the word "staged" scopes it to only what's staged for commit. With
  neither word, default to all current uncommitted changes.
---

# Summarize Changes

Produces a condensed, grouped summary of git changes — substance, not a bare file
list. If the project has its own documented format for change summaries (e.g. a
"Summarizing source-control changes" section in a CLAUDE.md / AGENTS.md / CONTRIBUTING
doc), follow that format exactly instead of the default in Step 3. This skill's own
job is the part most such docs leave unstated: how to scope the summary when the
user says "current" vs. "staged".

## Step 1 — Determine scope from the user's wording

| User says | Scope | Command to enumerate files |
|---|---|---|
| "staged" (e.g. "summarize staged", "what's staged") | Only files staged for commit | `git status --short` — take only lines with a non-space **first** column (`M `, `A `, `D `, etc. in the index column) |
| "current" (e.g. "summarize current changes") | All uncommitted changes — staged and unstaged together | `git status --short` — every line, regardless of column |
| Neither word / generic "summarize changes" | Same as "current" | `git status --short` — every line |

Don't guess past what the user typed — if they say "staged," only describe staged
files, even if there are other unstaged changes sitting alongside them. If they
say "current," describe everything uncommitted, staged or not, as one summary
(it's fine to note in passing which parts are staged if that's relevant to what
they're about to do next, e.g. before a commit).

## Step 2 — Gather the actual diffs, not just filenames

`git status` only gives file paths and M/A/D flags — never enough to write a real
one-line description. For each touched file (scoped per Step 1):

- Staged files: `git diff --cached -- <path>`
- Unstaged files: `git diff -- <path>`
- New/untracked files: read the file directly (there's no diff to show)

Read enough of each diff to describe **what** changed, not just that a file
changed. "Updated `foo.ts`" is not a summary; describe the actual behavior or
content change.

## Step 3 — Group and format the output

Default format when the project has no documented convention of its own:

```text
<area>
  - <what changed, one line>
  - ...

<area>
  - ...
```

- Group by the project's natural top-level areas — packages/modules in a
  monorepo, top-level directories otherwise, or by feature if the project is
  small enough that directory boundaries aren't meaningful.
- One line per logical change — several files that are all part of the same
  change (e.g. a shared constant plus its call sites) can share one bullet;
  unrelated changes within the same area get separate bullets, called out
  distinctly enough that they could be split into separate commits if asked.
- Describe substance, not filenames — what actually changed and why it's
  notable, not "modified X.ts".
- If summarizing "current" and some of those changes are staged while others
  aren't, it's fine to mention that split in prose before or after the output —
  don't invent a third grouping axis inside the output itself.

## Notes

- This skill only reports — it never stages, commits, or modifies anything.
- If `git status` shows nothing for the requested scope (e.g. "summarize staged"
  with nothing staged), say so plainly rather than falling back to the other
  scope silently.
