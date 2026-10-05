
## Core Design System Rules (always apply)

These rules cover ~80% of day-to-day guidance. For deeper topics (color scales,
typography system, the parent-step-relative surface algorithm, architecture,
responsive behaviour, motion, elevation) CALL the `search_design_system` tool.

### Zero literals
- All styling uses CSS custom properties: `var(--Token-Name)`.
- Never hardcode colors, pixel sizes, font sizes, or spacing values.
- Never emit inline styles with raw values in generated ASTs.

### Surface modes (unified vocabulary, no BG/FG split)
There are **8 surface modes**, one vocabulary for both containers and component fills:
`default`, `ghost`, `minimal`, `subtle`, `moderate`, `bold`, `elevated`, `blend`.

- `default`: page surface (2500 light / 200 dark), ignores parent.
- `ghost`: same step as parent, still triggers context remapping.
- `minimal` / `subtle` / `moderate`: parent + 1 / 2 / 3 steps toward contrasting direction.
- `bold`: role `baseStep` (or darker baseStep if parent is already dark).
- `elevated`: parent + 1 step toward lighter (capped at 2500).
- `blend`: same step as parent, used when a fill should visually merge with media or material context.

The same `bold` token is used whether the surface is a hero background or a primary button fill.
Context-awareness happens automatically because every surface is resolved against its parent step.

### Surface usage (MANDATORY)
- When placing components on a non-default background, ALWAYS wrap them in `<Surface mode="...">`.
  Never set `background` directly on a plain div containing interactive components; children will not adapt.
- Inside a Surface, reference generic role tokens (e.g. `--Primary-Bold`, `--Primary-TintedA11y`,
  `--Text-High`). The brand CSS engine remaps them per `[data-surface]` block automatically.
- Do not add decorative strokes or borders on top of a tinted Surface: the fill IS the boundary.

### Figma attention levels → Button variants
- **High** → `bold` variant: fill `--{Role}-Bold`, text `--{Role}-Bold-High`.
- **Medium** → `subtle` variant: fill `--{Role}-Subtle`, text `--{Role}-TintedA11y`.
- **Low** → `ghost` variant: fill `transparent`, text `--{Role}-TintedA11y`.

Nested inside `<Surface mode="bold">`, these tokens remap automatically. No per-component inversion
logic, no separate on-bold token family at the API boundary.

### Shape defaults
- Buttons default to `Shape-Pill` (9999px, standalone constant, NOT part of the numeric scale).
- Other interactive controls (inputs, chips, selects) default to `Shape-2`.
- Containers and cards use sized tokens (`Shape-3` … `Shape-10`).
- Circular elements (avatars, dots) use `Shape-Pill`.

### Focus halo
- Interactive components use `--Surface-Halo-Gap` for the inner gap ring, NOT `--Surface-Main`.
- `--Surface-Halo-Gap` auto-adapts inside `[data-surface]` contexts.

### Token naming (role-explicit unified, prefer these)
- Surface fills: `--{Role}-{Mode}` (e.g. `--Primary-Bold`, `--Primary-Subtle`, `--Primary-Elevated`).
- Content tokens: `--{Role}-High`, `--{Role}-Medium-Text`, `--{Role}-Low`,
  `--{Role}-Tinted`, `--{Role}-TintedA11y`, `--{Role}-Stroke-Medium`, `--{Role}-Stroke-Low`.
- On-bold content: `--{Role}-Bold-High`, `--{Role}-Bold-Medium`, `--{Role}-Bold-TintedA11y`.
- State tokens: `--{Role}-Hover`, `--{Role}-Pressed`, `--{Role}-Bold-Hover`, `--{Role}-Bold-Pressed`,
  `--{Role}-Subtle-Hover`, `--{Role}-Subtle-Pressed`.
- Typography sizes: `--{Role}-{Size}-FontSize` (e.g. `--Body-M-FontSize`, `--Display-L-FontSize`).
- Typography line-heights: `--{Role}-{Size}-LineHeight` (always pair with the FontSize token).
- Typography weights: `--{Role}-FontWeight-{Level}` (e.g. `--Body-FontWeight-High`).
- Shape: `--Shape-{Size}` or `--Shape-Pill`.
- Spacing: `--Spacing-{Size}` (e.g. `--Spacing-4`, `--Spacing-6`).

The legacy role alias families (`--{Role}-FG-*`, `--{Role}-BG-*`, `--Surface-Bold`, `--Text-High`,
etc.) are still emitted by the engine for backward compatibility but must NOT be authored into new
code or AI-generated output.

### Roles (multi-accent)
Up to 9 appearance roles: `primary`, `secondary`, `neutral`,
`sparkle`, `brand-bg`, `positive`, `negative`, `warning`, `informative`.
