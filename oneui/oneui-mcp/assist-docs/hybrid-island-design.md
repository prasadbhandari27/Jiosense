# Trusted island protocol groundwork

`assist/hybrid` is not product behavior in v1. The protection primitive is nevertheless specified and tested synthetically:

- each deterministic island is a separate generated module with a canonical content hash;
- consumers import only its public module; importing island internals is forbidden;
- the rendered root carries `data-island="<hash>"`;
- verification re-hashes source and requires the DOM marker;
- deletion, non-rendering, prop mutation or hash disagreement fails;
- visual feedback inside an island is returned as `ISLAND_FEEDBACK` to the deterministic pipeline, not repaired by AI.

The current campaign does not expose hybrid generation or the Commerce pilot.
