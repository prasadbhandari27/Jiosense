#!/usr/bin/env node
/**
 * PostToolUse hook (Write|Edit|MultiEdit) — ENFORCING for imports, advisory for the rest.
 *
 * Two jobs, in order:
 *
 *   1. AUTO-MIGRATE React Native barrel imports to deep imports, in place.
 *      Any file the agent just wrote or edited that contains
 *      `import { … } from '@oneui/ui-native'` is rewritten so each name comes
 *      from its deepest valid specifier. This is the enforcement point: it does
 *      not depend on the agent remembering to call `migrate_oneui_imports`, nor
 *      on `~/.claude/rules/oneui-workflow.md` being fresh.
 *
 *      WHY IT HAS TO BE HERE. Metro does not reliably tree-shake, so a single
 *      barrel import anywhere in an app pulls all 52 components into the bundle
 *      and cancels the saving for every other file — measured at ~508 KB for one
 *      `OneUIBrandProvider` line. Advisory text demonstrably does not hold: in
 *      two consecutive external-app tests the agent got every component right
 *      (the catalog answers those per-component) and the provider wrong (nothing
 *      authoritative answers for it at write time).
 *
 *      SCOPE IS DELIBERATELY NARROW — only the file just written. It never sweeps
 *      the project, so pre-existing barrel imports in untouched files stay
 *      untouched and the barrel API keeps working. Names with no deep export
 *      (`Surface`, `COMPONENT_APPEARANCE_ROLES`) stay on the barrel by design.
 *      Namespace/default imports are refused rather than mangled.
 *
 *   2. Remind the agent to run the `validate_oneui_code` gate (unchanged).
 *
 * Non-blocking: never rejects the edit, always exits 0. Any failure is swallowed
 * — a broken hook must not break the agent's write.
 *
 * Opt out with ONEUI_NO_AUTO_MIGRATE=1 (the reminder still fires).
 *
 * Reads PostToolUse JSON on stdin; emits hookSpecificOutput.additionalContext.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

function findProjectRoot(from) {
  if (!from) return null;
  let dir = dirname(resolve(from));
  for (;;) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function done(additionalContext) {
  if (additionalContext) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext,
        },
      }),
    );
  }
  process.exit(0);
}

let input;
try {
  input = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0);
}

const toolInput = input.tool_input ?? input.toolInput ?? {};
const filePath = toolInput.file_path ?? toolInput.path ?? '';
// .ts / .js included: a barrel import in a non-JSX module (an entry file, a hook
// module, a re-export barrel of the app's own) costs exactly as much as one in a
// component file.
if (!/\.(tsx|jsx|ts|js)$/.test(filePath)) done();

// Prefer the content the tool just wrote; fall back to reading the file on disk.
let content =
  toolInput.content ??
  toolInput.new_string ??
  (Array.isArray(toolInput.edits) ? toolInput.edits.map((e) => e.new_string ?? '').join('\n') : '');
if (!content && filePath) {
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    /* ignore — may be a partial edit */
  }
}
if (!content) done();

const isNative = /@oneui\/ui-native/.test(content);
const isWeb = /@jds4\/oneui-react/.test(content);
if (!isNative && !isWeb) done();

const platform = isNative ? 'reactnative' : 'react';

// ── 1. auto-migrate native barrel imports ────────────────────────────────────
//
// Re-reads the file from disk rather than trusting `content`: on an Edit the tool
// input holds only the changed fragment, so the fragment alone is not a safe
// thing to rewrite and write back. The hook runs after the write, so disk is
// authoritative.
let migrationNote = '';
if (isNative && !process.env.ONEUI_NO_AUTO_MIGRATE) {
  try {
    const { projectDeepImportSupport } = await import('../../dist/lib/importSweep.js');
    const { migrateBarrelImports, describeMigration } = await import(
      '../../dist/lib/deepImports.js'
    );
    const projectRoot = findProjectRoot(filePath);
    const support = projectRoot ? projectDeepImportSupport(projectRoot) : { supported: false };
    // Deep specifiers only resolve from 0.1.0-alpha.12 on; rewriting on an older
    // install produces imports Metro cannot find. Same gate importGuard applies.
    if (support.supported) {
      const onDisk = readFileSync(filePath, 'utf8');
      const result = migrateBarrelImports(onDisk);

      if (result.changed) {
        writeFileSync(filePath, result.code, 'utf8');
        const moved = [...new Set(result.moved.map((m) => m.name))].sort().join(', ');
        migrationNote =
          `OneUI: auto-migrated barrel imports in \`${filePath}\` to deep imports — ${describeMigration(result)}. ` +
          `Moved: ${moved}. ` +
          'Metro does not reliably tree-shake, so one barrel import would have pulled all 52 ' +
          'components into the bundle. Keep writing deep imports directly: ' +
          "components from '@oneui/ui-native/components/<Name>', provider and hooks from " +
          "'@oneui/ui-native/theme'. " +
          (result.keptOnBarrel.length > 0
            ? `${[...new Set(result.keptOnBarrel)].sort().join(', ')} correctly stayed on the barrel (no deep export exists). `
            : '');
      } else if (result.skipped.length > 0) {
        migrationNote = `OneUI: ${result.skipped.join(' ')} `;
      }
    }
  } catch {
    /* never break the agent's write over a migration failure */
  }
}

done(
  migrationNote +
    `OneUI: \`${filePath}\` imports ${isNative ? '@oneui/ui-native' : '@jds4/oneui-react'}. ` +
    `Before declaring this done, run \`validate_oneui_code\` (platform: "${platform}") on the file ` +
    `and self-heal any issues until the gate returns "All clear." Lint/typecheck passing is NOT the gate.`,
);
