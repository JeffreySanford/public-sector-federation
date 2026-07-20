# Token Mapping Specification

## Purpose

This specification defines how design-token values move from a DTCG-compatible source into the shared runtime contract, PrimeNG bridge, governed component wrappers, Storybook evidence, and documentation outputs.

## Input contract

The preferred input is one approved Figma-backed DTCG-compatible export, or a small set of exports split by real ownership or domain boundaries.

Starlight is not a token-creation source. It consumes generated metadata and evidence after the runtime artifacts have been built and validated.

The sample repository currently uses:

- `packages/tokens/src/tokens/primitives.json` for primitive values;
- `packages/tokens/src/tokens/themes.json` for semantic theme and mode values;
- `packages/tokens/src/tokens/figma-dtcg.sample.json` as a representative input fixture;
- `packages/tokens/src/tokens/mapping-rules.json` for precedence and normalization;
- `packages/tokens/src/tokens/token-metadata.json` for documentation metadata;
- `packages/tokens/src/tokens/component-overrides.css` for stable provider gaps.

## Tier model

| Tier | Example | Responsibility |
| --- | --- | --- |
| Primitive | `blue.600`, `radius.md` | Reusable raw values without product intent. |
| Semantic | `--ps-primary-background`, `--ps-surface-card` | Platform meaning independent of PrimeNG. |
| Component intent | `--ps-button-background` | Registry-owned component behavior and presentation. |
| Provider bridge | `--p-primary-color` | PrimeNG-specific translation kept internal. |

Applications should consume semantic or component intent. Provider bridge names are implementation details.

## Mapping flow

```text
DTCG-compatible source
  -> primitive model
  -> semantic --ps-* variables
  -> component intent
  -> PrimeNG --p-* bridge and preset
  -> generated runtime artifacts
  -> wrappers, shell, remotes, Storybook, and documentation
```

Generated artifacts include:

- `packages/tokens/src/tokens.css`;
- `packages/tokens/src/design-tokens.json`;
- `packages/tokens/src/index.ts`;
- `packages/primeng-preset/src/preset.ts`.

## Worked example: primary action

| Step | Example |
| --- | --- |
| Primitive | `blue.600 = #1d4ed8` |
| Semantic | `--ps-primary-background: #1d4ed8` |
| Provider semantic bridge | `--p-primary-color: var(--ps-primary-background)` |
| Provider component bridge | `--p-button-primary-background: var(--p-primary-color)` |
| Wrapper contract | `intent="primary"` |
| Evidence | Token build, tests, Storybook, shell integration, manifest metadata |

The application requests product intent. The wrapper and preset translate that intent to provider internals.

## Worked example: surface and typography

A card surface combines semantic background, text, border, radius, and inherited typography values. The registry component uses semantic or provider-bridge variables without exposing provider token names through its public API.

Typography aliases should only be generated when the authoritative export identifies the alias or an approved mapping rule creates it.

## Worked example: danger and error terminology

The sample uses `danger` as public design-system language and maps it to PrimeNG `error` terminology internally where required.

This rule is valid only when it is:

- declared in `mapping-rules.json`;
- visible in generated metadata;
- covered by token tests;
- approved as design language or labeled as compatibility debt.

## Normalization rules

| Rule | Sample status | Requirement |
| --- | --- | --- |
| `danger` to provider `error` | Proposed design normalization | Approve or mark temporary before production adoption. |
| Typography aliases | Conditional | Generate only from authoritative metadata or approved rules. |
| Missing ramp aliases | Conditional | Use the nearest approved primitive only with explicit approval. |
| PrimeNG `--p-*` bridge | Active | Generate from the same semantic source as `--ps-*`. |
| Component override CSS | Active | Reserve for stable provider gaps not expressible through the preset. |

No mapping rule should exist only in prose.

## Precedence

When inputs overlap, apply this order:

1. approved authoritative source values;
2. approved semantic normalization rules;
3. registry-owned component intent;
4. generated provider mappings;
5. temporary sample or migration fallbacks.

Provider terminology must not override semantic meaning.

## Registry consumption

Applications and remotes import governed APIs from `@public-sector/ui-patterns`.

Wrappers consume the token contract through:

- semantic `--ps-*` variables for registry-owned markup;
- the PrimeNG preset and generated `--p-*` bridge when PrimeNG owns internal structure.

Application code should not import PrimeNG modules, pass provider-specific configuration objects, render `<p-*>` selectors, or style `.p-*` internals directly.

## Adequacy review

An adopting token export is adequate when reviewers can answer:

- Which source path produced the primitive value?
- Which semantic token represents the intended platform role?
- Which normalization rule, if any, was applied?
- Which component intent consumes the value?
- Which provider key receives the internal bridge?
- Which generated artifact and automated evidence prove the mapping?

If any answer requires guessing, the export or mapping metadata is incomplete.

## Starlight output

Starlight should receive generated token metadata plus links to Storybook, Playwright, source, and lifecycle evidence. It should not own runtime values or federation configuration.

## Production adoption checks

- Confirm the authoritative export and precedence policy.
- Approve or reject every proposed normalization rule.
- Confirm public prefixes and package names.
- Verify preset parity with generated CSS variables.
- Validate shell, standalone remotes, and overlays in each supported theme.
- Align token, preset, registry, and theme-contract versions.
