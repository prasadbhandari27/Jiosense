# Compiler-v2 assist layer

The assist layer is experimental evidence infrastructure beside the deterministic compiler. It does not change compiler-v2 output. The IDE agent must always analyze first and dispatch from MCP evidence; the MCP does not host a model.

The vocabulary is:

- `compile`: deterministic compiler-v2;
- `assist/repair`: AI refinement of a high-first-party deterministic result;
- `assist/hybrid`: protected deterministic islands plus AI-composed unknown regions (design groundwork only);
- `assist/compose`: fresh composition from screenshot and compiler evidence, without a deterministic page scaffold;
- `assist/repair-legacy`: the existing scaffold-editing loop, retained temporarily for compatibility and experiments.

An IDE agent analyzes a Figma screen, creates a validated composition plan, authors the screen, and asks the MCP verifier for region-addressed repair feedback. The MCP does not host a model or require an AI API key. The analyzer returns evidence plus an executable recommendation, while invocation remains explicitly controlled by the IDE agent.

Natural MCP handoff (the user only supplies a Figma URL and asks for a React screen):

1. The IDE agent calls `figma_analyze_screen(figmaUrl, projectRoot)` before `figma_to_code` or authoring.
2. `compile` dispatches to deterministic `figma_to_code` plus the compatibility repair loop.
3. `assist/compose` reads `oneui://assist/composition-plan-v1`, creates the plan, authors fresh code without a deterministic scaffold, and calls `verify_assisted_screen`.
4. The agent imports `@jds4/oneui-react/styles`, uses the requested `BrandProvider`, and renders at the bundle viewport for verification. The production application root remains fluid; the Figma width must not become an app-shell `width` or `max-width`.
5. `verify_assisted_screen(bundleId, projectPath, planPath, sourcePath, previewUrl)` builds, inspects and returns region-addressed repairs.

The complete low-capability-client contract is packaged as `oneui://assist/client-orchestration-v1`. Responsive root ownership is packaged as `oneui://assist/responsive-root-v1`. Clients must read MCP resources rather than searching a parent repository.

All current inputs are regression/tuning evidence (`heldOut: false`). Assisted output carries explicit provenance and must not become a deterministic fixture.
