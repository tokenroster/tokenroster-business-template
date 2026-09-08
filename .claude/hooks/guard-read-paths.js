#!/usr/bin/env node
// PreToolUse guard for Read|Edit|Write|Glob|Grep.
// Blocks any resolved path that falls outside this project's root.

const path = require('path');

let raw = '';
process.stdin.on('data', (d) => { raw += d; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const toolName = input.tool_name;
  const ti = input.tool_input || {};
  const candidates = [];
  if (typeof ti.file_path === 'string') candidates.push(ti.file_path);
  if (typeof ti.path === 'string') candidates.push(ti.path);
  if (typeof ti.notebook_path === 'string') candidates.push(ti.notebook_path);

  if (candidates.length === 0) {
    process.exit(0);
  }

  // Script lives at <root>/.claude/hooks/guard-read-paths.js
  const projectRoot = path.resolve(__dirname, '..', '..');
  const rootLower = projectRoot.toLowerCase();

  for (const c of candidates) {
    const resolved = path.resolve(projectRoot, c);
    const resolvedLower = resolved.toLowerCase();
    if (resolvedLower !== rootLower && !resolvedLower.startsWith(rootLower + path.sep)) {
      const out = {
        decision: 'block',
        reason: `Path outside project root blocked: ${resolved}`,
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `This project restricts ${toolName} to files inside ${projectRoot}. Requested path resolves outside it: ${resolved}`,
        },
      };
      process.stdout.write(JSON.stringify(out));
      process.exit(0);
    }
  }

  process.exit(0);
});
