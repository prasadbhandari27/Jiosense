# AssistBundleV1

`AssistBundleV1` is a content-addressed evidence package for IDE agents. Its ID is a SHA-256-derived identifier over a canonical key-sorted serialization.

The full on-disk bundle contains source/runtime provenance, screenshot handles, the region and visible-text inventories, sanitized assets, trusted subtrees, unresolved evidence, a curated contract palette, package exports, evidence completeness and area-based coverage. A compact MCP response returns summaries and artifact handles rather than the complete Source IR or all ComponentContracts.

Screenshot evidence is always `evidenceOnly: true`, `embeddable: false`, and `assetId: null`. Screenshot and crop hashes are forbidden from the application asset manifest.

Assets are materialized under SHA-256 filenames. Signed/transient URLs, unsupported MIME types, path traversal and screenshot/crop content are rejected. Missing assets retain dimensions and an explicit neutral-placeholder policy; a screenshot crop is never substituted.

Only trusted-subtree contracts, common composition primitives, and explicitly eligible contracts are inlined. Other contracts remain available through an artifact handle. For foreign composition, plain React structure is the default; a OneUI binding must cite an allowed contract ID.

Coverage recommendation uses trusted resolved visible area divided by relevant visible root area. It never counts familiar names as recognition, and automatic routing remains false.
