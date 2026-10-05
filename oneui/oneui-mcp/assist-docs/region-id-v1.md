# AssistRegionIdV1

`AssistRegionIdV1` is the shared address used by the bundle, composition plan, DOM marker, verifier, repair feedback and experiment metrics.

Anchored regions use:

```text
region-v1/<encoded-root-figId>/<encoded-anchor-figId>
```

Composite regions use a truncated SHA-256 over the schema version, root figId, parent region ID, ordered descendant figIds, structural role and sibling position. Display names, authored text and coordinates are excluded. Bounds may change without changing identity.

The inventory records parent and ordered children explicitly. Duplicate figIds, ID collisions and unreachable references are rejected. `NODE_TRUNCATED` diagnostics are attached to their addressed regions; a truncation elsewhere does not mark an unrelated region incomplete.

The algorithm is deterministic for the same normalized source tree. The schema version is part of every composite derivation so a future incompatible algorithm cannot silently reuse v1 IDs.
