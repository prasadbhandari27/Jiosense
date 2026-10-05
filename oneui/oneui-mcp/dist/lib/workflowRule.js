const n="<!-- ONEUI_WORKFLOW_RULE_START -->",r="<!-- ONEUI_WORKFLOW_RULE_END -->";function t(e={}){const o=e.assistComposeEnabled?"- For every React-web Figma URL, call `figma_analyze_screen` BEFORE `figma_to_code` or writing TSX.\n- Follow the analyzer's executable strategy. `compile` -> `figma_to_code` with repair enabled.\n  Assisted composition -> read `oneui://assist/client-orchestration-v1`, create the plan, write fresh code,\n  then call `verify_assisted_screen`. Never search a parent repository for assist protocol docs.":"- For React-web Figma URLs, call `figma_to_code` with deterministic codegen enabled before writing TSX.\n- Use the returned refined evidence, generated file, diagnostics, and bounded render-and-repair instructions.",i=e.assistComposeEnabled?" Read `oneui://assist/responsive-root-v1`.":"";return`When building OneUI/JDS UI \u2014 React web (\`@jds4/oneui-react\`), React Native
(\`@oneui/ui-native\`), or Android Compose (\`com.jds\` / JDS) \u2014 follow this workflow.

## Phase 1: Context & Rules
- \`get_project_context\` \u2014 resolve brand, installed version, platform, components
- \`get_core_invariants\` + \`get_skill("oneui")\` \u2014 always-apply correctness rules & workflow

## Phase 2: Knowledge & Components
- \`search_design_system\` / \`list_skills\` + \`get_skill\` \u2014 load relevant guidance
- \`list_components\` + \`get_component_info\` \u2014 REAL props only, never invent an API
- \`get_component_info(name, section: "interaction")\` \u2014 \`interactionBehavior\` gives the hover / press / focus / keyboard / disabled behaviour in plain English. Read it before writing your own state styles, focus ring, or key handler
- \`get_brand_tokens\` (default \`jio\`) + \`get_surface_guide\` (before any tinted/dark bg)
- **Catalog miss path (mandatory):** If the user asks for a component that is not in
  \`list_components\` / \`get_component_info\` for the target platform: say so plainly,
  do **not** invent an API, and **offer all three** next steps in the user-visible reply \u2014
  (a) compose from released components,
  (b) \`build-with-tokens\` for a token-only custom component,
  (c) \`request_component\` to file the gap with the DS team.
  Name the tool \`request_component\` in plain chat text \u2014 do not bury the offer only inside
  AskUserQuestion / a blocking multiple-choice (those can be interrupted and the demand
  signal is lost). Never file without explicit user confirmation. Do not wait for the user
  to already know \`request_component\` exists \u2014 surface it whenever a named component is absent.

## Phase 3: Build
${o}
- If compiler codegen fails, report its typed error. Never patch MCP source, create a bypass script, or mutate
  the retained refined evidence inside the target project.
- \`<BrandProvider>\` (web) / \`<OneUIBrandProvider>\` (native)
- Web entrypoints import \`@jds4/oneui-react/styles\` exactly once before rendering.
- The Figma frame width is a verification viewport, never a production root-width instruction. Keep the
  application root fluid (normally width 100%); do not add a source-width \`max-width\`/centered device shell
  unless the user explicitly requests one.${i}
- Every tinted/dark/coloured area \u2192 \`<Surface mode="...">\`, never a bg on a raw div/View
- Icons: use them wherever the pattern expects one (nav back/close/menu, a leading icon on typed
  list rows, a trailing chevron on rows that navigate deeper, a supporting icon on actions with an
  obvious glyph, semantic status icons) \u2014 but never decorate plain rows/labels that don't need one.
  See \`rules/icons-and-text.md\`.
- Tokens only: zero literals; role-explicit typography; no legacy \`--Typography-*\`
- **React Native imports: deep, never barrel.** Write
  \`import { Button } from '@oneui/ui-native/components/Button'\` \u2014 one line per component \u2014
  and take the provider/hooks from \`@oneui/ui-native/theme\`. Metro does not reliably
  tree-shake, so a single \`from '@oneui/ui-native'\` anywhere in the app ships all 52
  components and cancels the saving for the whole bundle (measured: 623 KB \u2192 320 KB of
  design-system bytes when an app is fully migrated). \`Surface\` and
  \`COMPONENT_APPEARANCE_ROLES\` have no deep export and stay on the barrel.
  **Migrate the WHOLE file, never just the component you are adding.** Adding a deep import
  beside existing barrel lines produces mixed imports, which saves nothing \u2014 the barrel line
  still pulls everything in. The MCP also repairs this automatically (it sweeps the project
  and fixes files as they are written), but do not rely on that alone: when you edit a file
  that still has a barrel import, rewrite every OneUI import in it, or run
  \`migrate_oneui_imports({ files: [<the file>], dryRun: false })\`. It is a no-op on files
  with no barrel import, so it is safe to run on anything you touch.
- Figma \u2192 RN: drive \`figma_to_code\` / the \`oneui:figma-to-native\` skill
- **Unstamped REST hard stop:** if \`figma_to_code\` returns \`STAMP_OR_BRIDGE_REQUIRED\` /
  \`stamped: false\` on REST, **do not write UI**. Ask the user to (1) connect Desktop Bridge or
  (2) stamp the Figma frame with the OneUI Stamp plugin, wait for their answer, then re-run
  (\`ensure_figma_bridge\` + \`extractSource: "bridge"\`, or stamp \u2192 \`extractSource: "rest"\` /
  \`"auto"\`). Present **only these two** paths \u2014 including in \`AskUserQuestion\` or any other choice
  UI \u2014 never add a third "proceed with degraded defaults / skip" option. \`allowUnstampedRest: true\`
  is an escape hatch for when the user, unprompted, explicitly asks to skip and accept degraded
  output \u2014 it is not a menu item to offer.
- Figma \u2192 Android Compose: drive \`figma_to_code(platform:"android")\` / the \`oneui:figma-to-android\` skill
- **Install OneUI library:** If the user says "Install OneUI library" (or similar) **without naming a platform**, inspect the project (or call \`setup_oneui_project\` **without** \`platform\`): Flutter \`pubspec.yaml\` \u2192 Flutter pack; Expo/react-native \u2192 native pack; otherwise web. If they say Flutter / ui_flutter, use \`platform: "flutter"\`. Then \`check_oneui_registry\` for that platform and \`setup_oneui_project\` (\`mode: "auto"\` for Flutter). Confirm vendor/pubspec/pub get for Flutter. If auto cannot authenticate, STOP \u2014 \`mode:"terminal"\` or \`mode:"ai"\` + PAT. Never invent a PAT.
- Figma \u2192 Flutter: drive \`figma_to_code(platform:"flutter")\` / the \`oneui:figma-to-flutter\` skill. Load \`get_skill_reference("figma-to-flutter", "references/widget-authoring.md")\` and \`references/avatar.md\` (initials via \`alt\`; image \`src\`; progress 0\u2013100; \`OneUiToastProvider\` + \`Scope.add\`; SelectableSingleTextButton \u22642 chars; token EdgeInsets; independent selection state). Import \`package:ui_flutter/ui_flutter.dart\` only. Validate with \`validate_oneui_code(platform:"flutter")\`, then \`verify_flutter_screen_loop\`.
- **Figma \u2192 Figma (design-file migration, NOT code):** a legacy JDS / Jio Testlab frame rebuilt as a
  OneUI design frame \u2192 drive \`jds_to_oneui_migration\`. This is the only Figma path that produces a
  DESIGN file rather than code, so \`figma_to_code\` is the wrong tool for it. The tool returns the
  ordered official-Figma-MCP calls (\`mcp__figma__use_figma\` / \`get_screenshot\` / \`get_metadata\` /
  \`search_design_system\`) with the Plugin-API code already written \u2014 YOU execute them; oneui-mcp
  never touches Figma. Requires the official Figma MCP to be connected. Two-pass: run the inventory
  snippet it returns, then call the tool again with \`inventory\` + \`cloneId\` to get the swap and
  audit snippets materialised.
- **PRD and/or screenshot \u2192 RN (no Figma): do NOT hand-author the TSX.** You are the codegen
  frontend \u2014 the IR-generation step Figma gets from \`figma_to_code\` is YOUR job here.
  Generate the RefinedNode IR from whatever the user gave, in ALL of these cases:
  (1) PRD plain text only, (2) a screenshot only, (3) PRD text + screenshot. A screenshot is
  optional grounding, NEVER a prerequisite \u2014 plain text alone is enough to author the IR
  (infer screens/sections/components/copy from the PRD description). Build the tree (node kinds
  \`component\` / \`surface\` / \`node\`; map attention\u2192variant high=bold/medium=subtle/low=ghost)
  and call \`codegen_from_ir({ tree, screenName, platform: "reactnative", write: true })\`.
  It does NOT need a Figma URL or node-id \u2014 YOU author the IR. It guards the IR against the
  component catalog (real names + props), then runs the SAME deterministic backend
  \`figma_to_code\` uses. codegen_from_ir is not Figma-only and is not "broken": a stringified
  \`tree\` arg is parsed automatically. Only hand-author TSX if a required component genuinely
  has no @oneui/ui-native equivalent \u2014 never as the default for a PRD build.
- **PRD and/or screenshot \u2192 Android Compose (no Figma): do NOT hand-author screen \`.kt\`.** Same IR
  contract. FIRST load \`get_skill("build-with-tokens")\` + \`references/android-tokens.md\` (Dim4=16dp @360
  default density, Shape, Appearance, Surface, blur) **and**
  \`get_skill_reference("prd-to-android", "references/android-mvi-architecture.md")\` (MVI + Clean Architecture).
  Then author RefinedNode IR and call
  \`codegen_from_ir({ tree, screenName, platform: "android", write: true })\` \u2192 wrap Screen in
  feature ViewModel/UseCase/Repository per that architecture \u2192
  \`validate_oneui_code(platform:"android")\` \u2192 \`verify_android_screen_loop\`. Skill:
  \`prd-to-android\`. Docs: \`packages/mcp/docs/PRD-TO-ANDROID.md\`,
  \`packages/mcp/docs/android-mvi-architecture.md\`.

## Phase 4: Validate & Self-heal (MANDATORY)
- \`validate_oneui_code\` (platform "react" | "reactnative" | "android" | "flutter") on every written file
- Self-heal up to 3 passes until the gate returns "All clear"
- Lint/typecheck passing is NOT the code gate
- Figma \u2192 React \`compile\` with repair enabled is not complete when \`figma_to_code\` returns.
  Obey its \`REPAIR_REQUIRED\` state: serve the generated route, call \`modeB_verify_iteration\`,
  repair the reported regions, and repeat until \`COMPLETE\` or the explicit 5-iteration cap.
- Never report a React Figma screen complete after only one generation or validation pass.

## Phase 5: Verify on device (React Native \u2014 MANDATORY for any built RN screen)
Applies to BOTH paths: a Figma \u2192 RN screen AND a PRD \u2192 RN screen. The only thing that
changes is where the reference image comes from.
- **Build & launch \u2014 try in this STRICT order, never skip straight to web:**
  1. **iOS simulator** \u2014 \`expo run:ios\` (boots/uses a Simulator automatically). Try this first.
  2. **Android emulator** \u2014 \`expo run:android\`, only if no iOS simulator is available (e.g. non-macOS).
  3. **Web (\`expo start --web\`) is a LAST RESORT ONLY** \u2014 use it only if neither a simulator nor an
     emulator can be booted on this machine, and say so explicitly when you fall back to it. Web is
     NOT a valid substitute for this phase's verification: \`@oneui/ui-native\` renders through
     react-native-web, which does not reproduce native layout/gesture/platform behavior faithfully.
     A screenshot from \`expo start --web\` does not satisfy the device-verify requirement below \u2014
     treat it as a compile-sanity check only, and tell the user real device/simulator verification
     is still outstanding.
- Screenshot the running screen (the OUTPUT): \`xcrun simctl io booted screenshot ...\` (iOS) /
  \`adb -s <device> exec-out screencap -p > ...\` (Android)
- Get the REFERENCE image:
  - **Figma path** \u2192 fetch the frame for the same node-id (Figma MCP \`get_screenshot\`).
  - **PRD path** \u2192 the screenshot the user provided in PRD \xA76 (its resolved file path),
    matched to the screen it maps to.
- Compare: read BOTH images and enumerate concrete mismatches. Judge SEMANTICALLY first \u2014
  right sections/hierarchy, component choice, surface/attention treatment, colour-role
  resolution, spacing scale, typography, icons/images, clipping, scrim. A PRD screenshot is
  often an approximate mock (a different app, a rough comp), so do NOT gate on pixel-exactness;
  a Figma frame is the exact design source, so hold it to a tighter bar.
- Fix in the \`.native.tsx\` \u2192 re-run \`validate_oneui_code\` \u2192 rebuild \u2192 re-screenshot \u2192 re-compare
- Completion contract: loop until the rendered screen matches the reference (Figma frame, or
  the intent of the PRD screenshot). Cap 5 iterations. If not converged, return
  NEEDS_HUMAN_INPUT with specific blockers \u2014 NEVER silently declare success on
  \`validate_oneui_code\` alone. Permitted blockers only after \u22653 distinct fix attempts
  (Figma node 404 / no \xA76 screenshot, platform-incapable design feature, or plateaued
  similarity). If no working device or no reference image, say so explicitly rather than
  claiming done.

## Phase 5b: Verify on device (Android Compose \u2014 MANDATORY for any built Android screen)
Applies to Figma \u2192 Android AND PRD \u2192 Android.
- Host the composable under FoundationTheme; \`./gradlew installDebug\`
- Screenshot: \`adb exec-out screencap -p > .oneui-verify/actual.png\`
- Reference: Figma frame screenshot OR PRD \xA76 path
- \`validate_oneui_code(platform:"android")\` then \`verify_android_screen_loop\` (cap 5)
- Never declare done on validate alone. Skill: \`figma-to-android\` / \`prd-to-android\`.

## Hard Rules
- No literals (colors, px, font-size/weight/line-height; Android: no literal dp/hex)
- Real component props only \u2014 from \`get_component_info\`
- Don't re-implement interaction the component already ships \u2014 check \`interactionBehavior\` for its hover/press/focus/keyboard states first
- Surface discipline: tinted/dark \u2192 \`<Surface>\` / foundation \`Surface\` / IR \`kind:surface\`
- \`validate_oneui_code\` clean is required; for any RN or Android screen (Figma OR PRD) the device
  verify loop is ALSO required \u2014 a clean gate is not a verified screen
- **Catalog miss:** when a named component is confirmed absent, **offer** \`request_component\`
  as one of the three standard next steps (compose / build-with-tokens / request) in plain
  chat text \u2014 do not wait for the user to name the tool, and do not hide the offer only in
  AskUserQuestion. If they accept filing: confirm, then call \`request_component\`. Auto-fill
  ONLY requestor name/email (git/user identity) and MCP version. For component name, platform,
  use case, priority (p1/p2/p3), project/team, and Figma link \u2014 use what the user already said,
  otherwise ASK (never invent). Ask whether they have a Figma link; omit only if they say none.
  Do NOT invent a fake component API. After filing, continue with released components or
  \`build-with-tokens\` if UI is still needed.`}const a=t();function s(e={}){return["---",'paths: "**/*.tsx,**/*.ts,**/*.jsx,**/*.js"',"---","","## OneUI Build Workflow","",t(e),""].join(`
`)}function l(e={}){return[n,"## OneUI Build Workflow","",t(e),r].join(`
`)}function d(e,o={}){return["OneUI / JDS design-system MCP. Use it to build React (web) apps that follow the OneUI design system.","Once near the start of a session, call check_mcp_updates to see if a newer build of this MCP","itself is published. The check is read-only \u2014 if one is available, tell the user. When the",'user explicitly asks to update (e.g. "update", "lets update"), call update_mcp; do not refuse',"and do not invent a different install path.","FIRST, for any install/setup: run check_oneui_registry \u2014 the @jds4/* packages use Azure","Artifacts (primary with the gated credential), then anonymous internal JFrog as a verified","company-network/VPN fallback. If neither works, follow get_registry_setup before installing.","Never write or log a real PAT.","",t(o),"","For a new PRD \u2192 **code**, use the /oneui-build-from-prd prompt \u2014 it orchestrates all steps and the self-heal loop automatically.",'For Android Compose from a PRD (no Figma), use platform `"android"` / skill `prd-to-android` \u2014 load references/android-tokens.md + references/android-mvi-architecture.md first, then codegen_from_ir, then MVI feature wiring.',"For a filled PRD \u2192 **Figma frame** on the temporary Untitled file, use /oneui-prd-to-figma (skill `prd-to-figma`).","For a fresh WEB project, run setup_oneui_project first; keep packages current with check/update_oneui_packages.",'For "Install OneUI library" with no platform named: omit `platform` on `setup_oneui_project` so it sniffs the folder (Flutter pubspec \u2192 flutter, Expo \u2192 reactnative, else web). Do not assume Flutter unless the project is Flutter.',"For a brand-new Flutter app, run create_oneui_flutter_app.","For a fresh REACT NATIVE app, run create_oneui_native_app \u2014 it returns the @oneui/create-native-app CLI","command (on the private JIO-DS-OneUI-Native feed). The CLI prompts for the PAT interactively, so present","the command for the USER to run in their own terminal; do NOT run it from a non-interactive shell.","Right after ANY React Native scaffold/setup finishes (create_oneui_native_app or",'setup_oneui_project({platform:"reactnative"})), run check_oneui_versions once to confirm',"@oneui/ui-native / @oneui/icons-jio-native / @oneui/native-cdn are current \u2014 do not assume the","scaffolded versions are the newest published ones.",e].join(`
`)}export{r as ONEUI_RULE_MARKER_END,n as ONEUI_RULE_MARKER_START,a as WORKFLOW_RULE_BODY,s as buildClaudeModularRule,l as buildMarkedSection,d as buildMcpInstructions,t as buildWorkflowRuleBody};
