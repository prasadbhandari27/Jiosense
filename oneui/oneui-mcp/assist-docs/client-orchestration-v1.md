# Assist client orchestration v1

This document is the self-contained contract for an IDE agent, including smaller models. The user only needs to ask for a React screen and provide a node-specific Figma URL.

## Mandatory first action

For every React-web Figma screen, call `figma_analyze_screen` before `figma_to_code` or writing TSX. Use live evidence unless the user explicitly asks for an approved cached regression. Do not infer strategy from the screen name.

## Dispatch

Read `executableStrategy` from the analyzer response. `recommendedStrategy` is the evidence classification; `executableStrategy` is the supported two-way action for the current MCP.

- `compile`: call `figma_to_code` with React codegen and `modeB: true`; treat its `REPAIR_REQUIRED` state as a completion gate, serve the generated route, and call `modeB_verify_iteration` after every repair until it returns `COMPLETE` or the five-iteration cap is exhausted with explicit blockers. A single generation/validation pass is never completion. Do not also create a fresh compose implementation.
- `assist/compose`: do not call `figma_to_code`. Read `oneui://assist/composition-plan-v1`, create the plan, author fresh TSX from bundle evidence, then call `verify_assisted_screen` for up to three repair iterations.
- `assist/hybrid`: product hybrid is not implemented. Use the response's `executableStrategy`; do not invent an island implementation.

Strategy selection is performed by the IDE agent from MCP evidence. The MCP does not host a model. The user is not required to name a strategy.

If a compile tool call fails, report its typed error and retained evidence. Do not search for MCP implementation source, create patch scripts, or mutate a generated/refined tree to bypass the failure. A compiler defect must be repaired and repackaged at the MCP boundary; it must not become target-project glue.

## Web runtime floor

Every generated web project must:

1. import `@jds4/oneui-react/styles` exactly once;
2. render under the Jio/light `BrandProvider` requested by the bundle;
3. use the bundle viewport for verification;
4. wait for fonts, CSS and manifest assets before capture;
5. report missing package CSS as a runtime failure, not a visual-composition failure.

The bundle/Figma viewport is a verification target, not a production width. A mobile
frame captured at 360px must still produce a fluid application root (`width: 100%`),
unless the user explicitly requests a fixed device shell. Do not copy the source width
into an application `width`, `max-width`, centered wrapper, or breakpoint lock. Preserve
contract-backed fixed component sizes and horizontal rails, but let the page root fill
the available mobile viewport. Read `oneui://assist/responsive-root-v1` before adding or
changing an app shell.

## Compose sequence

1. Read `oneui://assist/composition-plan-v1` and `oneui://assist/verifier-region-model-v1` through MCP resources. Never search a parent monorepo for protocol documentation.
2. Load the bundle manifest and only the artifact handles required for the current step.
3. Create `AssistCompositionPlanV1`. Validate every required region, required text, available asset, trusted binding and unknown region before writing TSX.
4. Start generated source with an `@oneui-assist` provenance comment.
5. Render each planned region with its exact `data-assist-region` ID. A marker must wrap visible semantic content; empty markers do not count.
6. Use OneUI only for plan-declared contract bindings. Foreign composition defaults to plain React/CSS.
7. Never reference the screenshot, a screenshot crop, a transient URL or a non-manifest raster as content.
8. Build and serve the project at the exact viewport for verification without encoding
   that viewport width into the production application root.
9. Call `verify_assisted_screen` with bundle ID, plan path, project path, source path, any CSS source paths, preview URL and iteration.
10. Repair hard floors first, then coverage, text/assets, ordering, local geometry and finally pixel smoke. Never trade away a passed floor.

## Completion report

Return the selected strategy, bundle ID, generated path, plan path when applicable, build/runtime status, fallback/unresolved counts for compile, canonical region/text/order/asset results for compose, and final render path. State explicitly whether evidence was live or cached regression.
