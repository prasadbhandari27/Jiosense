# AssistCompositionPlanV1

`assist/compose` requires a plan before source generation. The plan binds every region, text item, available asset and trusted subtree to an explicit implementation decision.

Validation floors are:

1. every visible required region appears exactly once or has a typed waiver;
2. every required visible text item is assigned or waived;
3. every available manifest asset is placed or waived;
4. every trusted subtree preserves its island binding;
5. OneUI bindings cite contracts in the curated palette;
6. unknown regions remain represented;
7. absolute positioning above the versioned budget has structural justification;
8. screenshot/crop evidence cannot be placed as content.

A failing plan does not proceed to source generation. Waivers are individual, typed and reviewable; they do not reduce the denominator.

## Complete JSON shape

```json
{
  "planVersion": 1,
  "bundleId": "assist-bundle-v1-<24 hex>",
  "strategy": "assist/compose",
  "viewport": { "width": 1440, "height": 800 },
  "regions": [
    {
      "regionId": "region-v1/<root>/<anchor-or-hash>",
      "sourceFigIds": ["302:1"],
      "expectedBounds": { "x": 0, "y": 0, "width": 100, "height": 100 },
      "role": "section",
      "layout": "grid",
      "direction": "row",
      "gapEstimate": 16,
      "orderedChildren": [],
      "implementationBinding": "plain-react"
    }
  ],
  "componentBindings": [
    {
      "regionId": "region-v1/<root>/<anchor-or-hash>",
      "kind": "plain-react",
      "rationale": "Foreign composition; no contract-valid OneUI identity"
    }
  ],
  "textAssignments": [
    { "textId": "text-v1/<hash>", "regionId": "region-v1/<root>/<anchor-or-hash>" }
  ],
  "assetPlacements": [],
  "unknowns": [],
  "waivers": [],
  "expectedAbsolutePositionCount": 0
}
```

The TypeScript validator is authoritative for exact optional fields. Use the artifact inventories verbatim: never manufacture region, text, asset or contract IDs. `implementationBinding` and `componentBindings.kind` must agree. OneUI bindings require an allowed `ComponentContract` ID; plain React does not.

## Generated-source requirements

- First line: `/* @oneui-assist { ...machine-readable provenance... } */`.
- Every planned region: `data-assist-region="<regionId>"` on the visible semantic owner.
- Asset owners: `data-assist-asset-sha="<manifest sha256>"` where applicable.
- Import `@jds4/oneui-react/styles` once and mount under the requested `BrandProvider`.
- Screenshot evidence paths and hashes are forbidden application assets.
