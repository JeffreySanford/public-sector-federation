# Token Pipeline Hardening

## Purpose

This document separates the hardened sample pipeline from validation that belongs to an adopting organization's authoritative Figma or DTCG-compatible export.

## Current sample sources

| File | Role |
| --- | --- |
| `packages/tokens/src/tokens/primitives.json` | Primitive color, radius, spacing, and typography source. |
| `packages/tokens/src/tokens/themes.json` | Theme selectors and semantic runtime variables. |
| `packages/tokens/src/tokens/figma-dtcg.sample.json` | Representative DTCG-compatible fixture. |
| `packages/tokens/src/tokens/mapping-rules.json` | Tier, precedence, and normalization rules. |
| `packages/tokens/src/tokens/token-metadata.json` | Documentation metadata. |
| `packages/tokens/src/tokens/component-overrides.css` | Stable provider-gap overrides. |

The fixture proves the expected input shape without pretending to be a complete external design source.

## Hardened in this repository

- The token build validates the representative DTCG input.
- Mapping and normalization rules are explicit data inputs.
- Generated CSS, JSON, TypeScript, and documentation artifacts come from the same build.
- PrimeNG bridge values resolve back to shared semantic values.
- The PrimeNG preset imports token-package outputs instead of maintaining a separate theme source.
- Shell, remote, Storybook, and overlay tests validate runtime token behavior.
- Package and theme-version alignment requirements are documented.

## Adequacy criteria for an adopting export

An external token export is adequate when it allows the build to determine, without guessing:

| Question | Adequate when |
| --- | --- |
| Which values are primitive? | Raw colors, spacing, radius, and typography are identifiable. |
| Which values express semantic intent? | Roles such as primary, surface, text, and status are explicit. |
| Can component intent be represented? | Component aliases exist or can be derived through approved rules. |
| Is provider leakage avoidable? | PrimeNG terminology is bridge output rather than the public source API. |
| Is lifecycle metadata available? | Alias, deprecation, theme, and mode information can be resolved. |
| Can all artifacts be generated? | CSS, JSON, TypeScript, documentation metadata, and the preset share one input path. |

If a criterion fails, the adoption report should identify the missing metadata or naming rule rather than silently hard-code a value.

## Adoption sequence

1. Place the approved export under `packages/tokens/src/tokens` or ingest it through a controlled build step.
2. Define source precedence when the export is split by theme, mode, or ownership.
3. Approve each normalization rule as permanent design language or temporary compatibility debt.
4. Run token generation and unit tests.
5. Compare generated `--ps-*` and `--p-*` values with the approved design source.
6. Run Storybook and shell integration evidence across light and dark themes.
7. Publish generated metadata and evidence links to the documentation system.

## Naming and version alignment

The sample uses:

- semantic variables prefixed with `--ps-*`;
- PrimeNG bridge variables prefixed with `--p-*`;
- generated DTCG metadata under `$extensions.public-sector`;
- aligned versions of `@public-sector/tokens`, `@public-sector/primeng-preset`, and `@public-sector/ui-patterns`.

An adopting organization may change public prefixes and package names while preserving the tier separation and generated contract.

## Current defensible conclusion

```text
The pipeline is ready to validate a DTCG-compatible production export.
The sample fixture proves the expected tier, normalization, generation, and
provider-mapping shape. Final adequacy depends on the external export carrying
enough metadata to identify primitive, semantic, component, alias, deprecation,
theme, and mode intent.
```
