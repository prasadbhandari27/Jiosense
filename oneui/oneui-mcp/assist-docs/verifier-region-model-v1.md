# Assist verifier canonical region model v1

Verifier-v1 is additive. Verifier-v0, its 606-region denominator, and its historical results remain unchanged.

The v1 denominator is derived only from normalized source evidence. Candidate source, DOM, screenshots, metrics, and desired outcomes are not inputs. Every raw region receives exactly one disposition:

- `RENDER_REQUIRED`: an independently observable viewport contribution;
- `ACCOUNTED_BY_PARENT`: a neutral structural wrapper whose complete contribution is represented by its canonical parent;
- `DECORATIVE_PAINT`: visible paint, rule, mark, or primitive owned and scored through a canonical region;
- `IMPLEMENTATION_DETAIL`: a private/library/slot wrapper with no independent rendering obligation;
- `EVIDENCE_ONLY`: zero-bounds or outside-target-viewport evidence retained for traceability;
- `HIDDEN`: source visibility or opacity proves it is hidden;
- `TRUNCATED`: capture evidence is incomplete and remains explicitly unresolved.

## Versioned source-only rules

1. Root, in-viewport non-zero text, and in-viewport source assets are render-required.
2. A visible component/control is render-required when it has distinct geometry and its own paint/border or meaningful direct children. Same-geometry component wrappers are implementation details.
3. A container is render-required when it contributes independent paint/border, or when it is a viewport-relevant structural group with at least two meaningful direct children and at least 0.5% of viewport area.
4. Same-geometry and neutral wrappers are accounted by the nearest canonical parent.
5. Visible primitives are decorative paint owned by the nearest canonical render region; they remain in paint and geometry accounting without requiring a one-for-one React wrapper.
6. Off-viewport evidence remains in the ledger but is not a target-viewport render obligation.
7. Text content, display names, screen names, candidate output, and node-specific exceptions do not influence disposition.

Canonical regions preserve nearest canonical ancestry and ordered source descendants across flattened implementation wrappers. Levels 0–3 distinguish page shell, major groups, semantic children, and deep leaves without changing the exact source-address identity.

Canonical text is keyed by source text figId plus canonical owner. Hidden, zero-size, truncated, and outside-viewport records receive typed exclusions; identical text in distinct locations remains distinct. Text must match inside its canonical region.

Canonical order is a partial order over consecutive meaningful canonical siblings. Neutral React wrappers may be added or flattened, but reading, navigation, slot, list, and card-child order must remain.

Canonical asset and paint denominators are separate from region-marker accounting. An unavailable asset is not a missing available asset, and a neutral placeholder is not asset fidelity. Screenshot/crop substitution remains prohibited.

The canonical anti-cheat boundary remains strict: a matched canonical region needs a non-zero visible box and meaningful text, asset, paint, border, or visible descendants. Runtime instrumentation may associate an unmarked candidate node by generic geometry, but it may not create content, alter layout, or hide deletion.

The employee denominator was frozen before verifier-v1 inspected either candidate DOM. Its hashes are recorded in `verifier-v1-denominator-manifest.json` within the experiment directory.
