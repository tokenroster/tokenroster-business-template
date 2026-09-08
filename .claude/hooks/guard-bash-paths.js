#!/usr/bin/env node
// PreToolUse guard for Bash|PowerShell.
// Best-effort: scans the command text for path-looking tokens and blocks
// any that resolve outside this project's root. This is a text scan, not a
// sandbox — it stops naive/accidental escapes (a literal path pasted into a
// command) but can be evaded by indirection (env vars, base64, inline
// scripts that compute a path at runtime). True enforcement requires
// sandbox.filesystem settings, which only user-level or managed settings
// can configure.

const path = require('path');
const os = require('os');

let raw = '';
process.stdin.on('data', (d) => { raw += d; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const command = (input.tool_input && input.tool_input.command) || '';
  if (!command) process.exit(0);

  // Script lives at <root>/.claude/hooks/guard-bash-paths.js
  const projectRoot = path.resolve(__dirname, '..', '..');
  const rootLower = projectRoot.toLowerCase();

  const pathPattern = /(?:[A-Za-z]:[\\/][^\s"'`|<>]+)|(?:\/[a-zA-Z]\/[^\s"'`|<>]+)|(?:~[\\/][^\s"'`|<>]+)/g;
  const matches = command.match(pathPattern) || [];

  for (const m of matches) {
    let candidate = m;
    if (candidate.startsWith('~')) {
      candidate = path.join(os.homedir(), candidate.slice(1));
    } else if (/^\/[a-zA-Z]\//.test(candidate)) {
      // git-bash style /c/Users/... -> C:/Users/...
      candidate = candidate.replace(/^\/([a-zA-Z])\//, '$1:/');
    }
    const resolved = path.resolve(projectRoot, candidate);
    const resolvedLower = resolved.toLowerCase();
    if (resolvedLower !== rootLower && !resolvedLower.startsWith(rootLower + path.sep)) {
      const out = {
        decision: 'block',
        reason: `Command references a path outside project root: ${resolved}`,
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `Blocked: command references "${m}", which resolves outside the project root (${projectRoot}). Best-effort text guard, not a sandbox.`,
        },
      };
      process.stdout.write(JSON.stringify(out));
      process.exit(0);
    }
  }

  process.exit(0);
});
