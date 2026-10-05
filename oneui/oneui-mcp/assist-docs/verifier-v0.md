# Assist verifier v0

The verifier keeps independent channels rather than one aggregate score:

- coverage: matched, missing, extra and waived regions;
- semantic preservation: text, assets, trusted islands and ordered children;
- local geometry: region x/y/width/height and area-weighted relative error;
- cumulative drift: diagnostic only;
- foreground pixels: smoke evidence only.

Hard floors cover plan validity, provenance, exact-once required DOM regions, ordered children, 100% required text, available assets, manifest-only rasters, screenshot exclusion, no external asset URLs, curated OneUI imports, trusted islands and the plan absolute-position budget. Once a floor passes, a later iteration may not regress it.

The source/DOM audit prevents deletion-based score gains, page compression, screenshot content, non-manifest rasters, transient URLs, undeclared OneUI imports and unjustified absolute-position growth. Findings are addressed with `AssistRegionIdV1` wherever possible.

Build and browser orchestration use the existing validation/render infrastructure. The pure verifier contract is separately testable and does not host an AI model.
