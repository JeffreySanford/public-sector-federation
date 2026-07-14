# Token Pipeline Hardening

## Purpose

This document tracks what can be hardened in the sample repo now and what must
wait for the real enterprise Figma/DTCG-compatible token export.

## Current Status

The real enterprise token export is not present in this repository. Until that
file is available, the repo uses `figma-dtcg.sample.json` as an input fixture to
validate the expected tier shape and key provider mappings.

Current source split:

| File | Role |
| --- | --- |
| `tokens/primitives.json` | Current full primitive source. |
| `tokens/themes.json` | Current full runtime CSS variable source. |
| `tokens/figma-dtcg.sample.json` | Sample Figma/DTCG input fixture. |
| `tokens/mapping-rules.json` | Shared tier, precedence, and normalization rules. |
| `tokens/component-overrides.css` | Stable provider override layer. |

## Ingestion Plan

When the real export is available:

1. Add it under `packages/tokens/src/tokens`.
2. Name it clearly, for example `enterprise-dtcg.json`, unless the enterprise
   export process requires split files.
3. Validate that it contains primitive, semantic, component, and provider
   mapping tiers or enough metadata to derive those tiers.
4. Replace the sample-only validation path with real export validation.
5. Keep `figma-dtcg.sample.json` only as a small fixture if it remains useful
   for tests.
6. Run `pnpm build:tokens`, `pnpm --dir packages/tokens test`, and `pnpm lint`.

## Adequacy Criteria

The enterprise export is adequate only if these questions can be answered from
the file without guessing:

| Question | Adequate when |
| --- | --- |
| Does it identify primitives? | Raw color, radius, spacing, and typography values are clear. |
| Does it identify semantic intent? | Platform roles such as primary, surface, text, status exist. |
| Does it support component intent? | Component-level aliases can be represented or derived. |
| Does it avoid provider leakage? | PrimeNG names are optional bridge output, not source API. |
| Does it carry enough metadata? | Deprecated, alias, mode, and theme status can be determined. |
| Can it produce current artifacts? | `tokens.css`, JSON metadata, TS exports, and preset can be generated. |

If any answer is no, the recommendation should state which metadata or naming
gap blocks full ingestion.

## Naming Alignment

`pnpm build:tokens` should preserve the public runtime contract:

- semantic platform variables use `--ps-*` in this sample repo;
- PrimeNG bridge variables use `--p-*`;
- generated DTCG JSON keeps source metadata in `$extensions.public-sector`;
- normalization rules come from `tokens/mapping-rules.json`;
- Zeroheight receives generated metadata, not hand-maintained token values.

In the real implementation, replace `--ps-*` with the approved enterprise
prefix if needed, but keep the tier separation intact.

## PrimeNG Preset Parity

The PrimeNG preset must map from the same values generated into `tokens.css`.

Current automated proof:

- `packages/tokens/src/build-tokens.test.mjs` resolves core `--p-*` bridge
  variables back to their `--ps-*` source values.
- The same test checks that `packages/primeng-preset/src/preset.ts` imports
  from `@public-sector/tokens` and references semantic token exports for light
  and dark primary/content values.

This proves the sample repo does not maintain a separate PrimeNG theme source.

## Version Alignment Notes

Keep these packages aligned across shell and remotes:

- `@public-sector/tokens`
- `@public-sector/primeng-preset`
- `@public-sector/ui-patterns`
- PrimeNG provider setup
- theme class or attribute

Federation should share token-related packages consistently so shell and
remotes do not resolve different token contracts.

## Current Answer For Neil

The enterprise export adequacy answer is not final because the real export is
not in this repo. The current defensible answer is:

```text
The pipeline is ready to validate a Figma/DTCG-compatible enterprise export.
The sample fixture proves the expected tier and provider mapping shape. Final
adequacy depends on whether the real export contains enough metadata to identify
primitive, semantic, component, alias/deprecated, theme, and mode intent.
```
