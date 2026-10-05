#!/usr/bin/env node
/**
 * SessionStart hook — deterministically checks whether a newer OneUI MCP
 * build is published on the CDN, independent of whether the agent chooses to
 * call the check_mcp_updates tool itself (the `instructions` field only
 * nudges the model to do that, it doesn't guarantee it runs).
 *
 * Advisory + non-blocking: never installs anything, never blocks session
 * start, and stays silent (emits nothing) when already current or when the
 * check can't complete (offline, dist missing, CDN unreachable) — mirrors
 * ensure-rules.mjs's "swallow and exit 0" contract.
 */
function done(additionalContext) {
  if (additionalContext) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext,
        },
      }),
    );
  }
  process.exit(0);
}

try {
  const { checkForMcpUpdate } = await import('../../dist/lib/mcpUpdateCheck.js');
  const result = await checkForMcpUpdate();
  if (!result.checked || !result.updateAvailable) {
    done();
  } else {
    done(
      `OneUI MCP: a newer build is published (${result.latestVersion}; this session is running ` +
        `${result.currentVersion}). This is just a heads-up — mention it to the user. If they ask ` +
        `to update, call update_mcp (not a manual npm install unless that tool fails). ` +
        `Call check_mcp_updates for the full report.`,
    );
  }
} catch {
  done();
}
