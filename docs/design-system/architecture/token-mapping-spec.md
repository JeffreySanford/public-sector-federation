# Token Mapping Spec

## Purpose

This spec describes how token values should move from the enterprise token
source into the platform runtime contract, PrimeNG preset, registry wrappers,
Storybook evidence, and Zeroheight documentation.

## Authoritative Input Format

Expected enterprise input:

- Figma is a known initial token input.
- Figma should export or feed a DTCG-compatible JSON token artifact.
- Token groups that can be normalized into primitive, semantic, component, and
  provider-specific tiers

Not input sources:

- Zeroheight is not a token creation source.
- Zeroheight should not be described as a Figma-to-token input step unless the
  team later establishes an active Figma -> Zeroheight -> token workflow.
- `up-design-system` is outdated reference material only.

Current full token source:

- `packages/tokens/src/tokens/primitives.json`
  Current full primitive source for color, radius, spacing, and typography
  values used by the build.
- `packages/tokens/src/tokens/themes.json`
  Current full runtime source for theme and mode selectors. This file emits the
  semantic `--ps-*` variables and mapped PrimeNG `--p-*` variables used by
  `tokens.css`, `design-tokens.json`, and `zeroheight-tokens.json`.
- `packages/tokens/src/tokens/zeroheight-metadata.json`
  Documentation metadata, token categories, and PrimeNG family metadata.
- `packages/tokens/src/tokens/component-overrides.css`
  Stable CSS override layer for PrimeNG component gaps not covered by preset
  tokens.
- `packages/tokens/src/tokens/mapping-rules.json`
  Shared mapping tiers, precedence, input-source assumptions, and
  normalization rules consumed by the token build and tests.

Current Figma/DTCG sample input:

- `packages/tokens/src/tokens/figma-dtcg.sample.json`
  Sample Figma-backed DTCG-compatible input fixture used to validate tier and
  provider mapping assumptions before real enterprise ingestion is wired.

The sample file is intentionally not the full token source yet. The build reads
it as an input fixture, validates representative mappings against the current
full source, and stamps generated artifacts with a `figmaDtcgInput.validated`
record. This proves the Figma/DTCG shape is being honored without pretending
the sample already contains the complete enterprise token inventory.

Expected future source model:

- A real enterprise Figma/DTCG-compatible token export becomes the approved
  source for primitive and semantic token values.
- The registry continues to own component-intent mappings where component
  behavior is a code contract, not just a design value.
- PrimeNG provider mappings remain generated from semantic and component
  intent; they are not public token API.
- `primitives.json` and `themes.json` either become generated intermediates or
  are replaced by direct generation from the approved DTCG source.

Component file model:

Not every component should need its own `figma-dtcg` file. The preferred model
is one approved enterprise DTCG-compatible export, or a small set of exports by
token domain, containing primitive, semantic, component, and provider-mapping
tiers. Per-component files should be used only if the Figma export tooling
forces that shape or if a component has a genuinely separate ownership and
release boundary.

Expected production shape:

```text
Figma libraries
  -> approved DTCG-compatible token export
  -> token build package
      -> normalized primitive and semantic model
      -> registry-owned component intent model
      -> generated PrimeNG provider mapping
      -> generated runtime artifacts
          -> tokens.css
          -> design-tokens.json
          -> zeroheight-tokens.json
          -> TypeScript token metadata/helpers
          -> PrimeNG preset
```

In production, the repository should not rely on the sample fixture as the
source of truth. It should either consume a checked-in enterprise export or pull
the approved export during a controlled build step. The important production
contract is not the exact file count; it is that one approved token input path
feeds the generated CSS variables, documentation JSON, TypeScript metadata, and
PrimeNG preset.

A likely production file layout is:

```text
packages/tokens/src/tokens/
  enterprise-dtcg.json
  mapping-rules.json
  zeroheight-metadata.json
  component-overrides.css
```

Or, if the export is split by ownership:

```text
packages/tokens/src/tokens/
  figma-primitives.dtcg.json
  figma-semantic.dtcg.json
  registry-components.dtcg.json
  mapping-rules.json
  zeroheight-metadata.json
  component-overrides.css
```

Both shapes are acceptable if they produce the same generated runtime contract.
The split-file model is useful only when it matches real ownership or export
constraints. It should not become one DTCG file per wrapper by default.

The current learning repo is intentionally one step before that production
shape: `primitives.json` and `themes.json` are still the full token source,
while `figma-dtcg.sample.json` validates the expected enterprise input shape.

Adequacy position:

The provided token export format is adequate if it can produce the same four
tiers listed below and if normalization rules are explicit, versioned, and
tested. The open enterprise validation is whether the Figma/DTCG-compatible
JSON export contains enough metadata to distinguish semantic intent from
provider-specific aliases.

## Tier Model

Tokens should be mapped through these tiers:

| Tier | Example | Purpose |
| --- | --- | --- |
| Primitive | `blue.600`, `radius.md`, `typography.fontFamily` | Raw reusable design values. |
| Semantic | `--ps-primary-background`, `--ps-surface-card` | Platform intent, independent of PrimeNG. |
| Component | `--ps-button-background`, `--ps-action-text` | Design-system component intent. |
| PrimeNG mapping | `--p-primary-color` | Provider-specific bridge consumed by PrimeNG. |

The public design-system API should use semantic or component intent. PrimeNG
mapping tokens are internal bridge values and should not be app-team API.

## Mapping Flow

```text
enterprise token export
  -> primitive token set
  -> semantic platform tokens
  -> component intent tokens
  -> PrimeNG semantic/component preset keys and --p-* variables
  -> generated runtime artifacts
```

Generated runtime artifacts:

- `packages/tokens/src/tokens.css`
- `packages/tokens/src/design-tokens.json`
- `packages/tokens/src/zeroheight-tokens.json`
- `packages/tokens/src/index.ts`
- `packages/primeng-preset/src/preset.ts`

## Current Worked Example

| Step | Value |
| --- | --- |
| Primitive | `blue.600` = `#1d4ed8` |
| Semantic token | `--ps-primary-background: #1d4ed8` |
| PrimeNG semantic bridge | `--p-primary-color: var(--ps-primary-background)` |
| PrimeNG component bridge | `--p-button-primary-background: var(--p-primary-color)` |
| Preset semantic value | `semantic.light.primaryBackground` used as `primary.color` |
| Wrapper usage | `PublicButtonComponent` exposes design-system inputs. |

The wrapper exposes `tone`, `outlined`, `text`, and `label`. It does not expose
PrimeNG token names.

This lets the app consume `<ps-button tone="primary" />` while the wrapper and
PrimeNG preset resolve the visual result through the shared token contract.

## Approval Table

Use this table as the review surface for Neil. Each row should be approved,
changed, or blocked by missing enterprise token metadata.

| Example | Complexity | Review decision needed |
| --- | --- | --- |
| Primary action color | Simple | Confirm the source path and token name are acceptable. |
| Card surface and typography | Complex | Confirm whether inherited typography is enough for card usage. |
| Danger status to PrimeNG error | Complex | Approve or reject `danger` to `error` provider normalization. |

Primary action color:

- Source token:
  sample path `semantic.color.primary.background`; current source
  `themes.json` `--ps-primary-background`.
- Runtime token:
  `--ps-primary-background: #1d4ed8`.
- Normalization:
  none.
- Registry usage:
  `ps-button` exposes `tone="primary"` through `PublicButtonComponent`.
- PrimeNG mapping:
  `--p-primary-color: var(--ps-primary-background)` and
  `--p-button-primary-background: var(--p-primary-color)`.
- Evidence:
  `pnpm build:tokens`, token tests, generated `tokens.css`, and
  `figmaDtcgInput.validated`.

Card surface and typography:

- Source token:
  current source `themes.json` `--ps-surface-card` and `--ps-font-family`;
  sample paths `semantic.color.surface.background` and
  `semantic.typography.body.fontFamily`.
- Runtime token:
  `--ps-surface-card`, `--ps-font-family`, `--p-content-background`, and
  `--p-text-color`.
- Normalization:
  PrimeNG bridge is active. Typography aliases are proposed only; no old alias
  should be mapped unless the enterprise export confirms it.
- Registry usage:
  `ps-card` consumes `--p-content-background`, `--p-text-color`, and inherited
  font context through `PublicCardComponent`.
- PrimeNG mapping:
  preset `semantic.colorScheme.light.content.background` maps from
  `semantic.light.surfaceCard`; `semantic.typography.fontFamily` maps from
  `typography.fontFamily`; `--p-card-background` bridges through content
  background.
- Evidence:
  generated CSS, `packages/primeng-preset/src/preset.ts`, and wrapper CSS.

Danger status to PrimeNG error:

- Source token:
  sample paths `semantic.color.danger.background` and
  `component.toast.danger.background`; current source `themes.json`
  `--ps-danger-color`.
- Runtime token:
  `--ps-danger-color`, `--p-toast-message-error-background`, and related error
  bridge variables.
- Normalization:
  `danger` to PrimeNG `error` is proposed. This keeps design-system language as
  danger while mapping to provider terminology internally.
- Registry usage:
  `PublicToastService` exposes `severity: 'danger'`; wrappers keep provider
  terminology out of app code.
- PrimeNG mapping:
  PrimeNG toast uses `error` token names, including
  `--p-toast-message-error-background`; sample provider path maps
  `toast.error.background` from `component.toast.danger.background`.
- Evidence:
  sample validation, generated CSS, and token tests.

## Normalization Rules

These rules must be tracked as approved or proposed before enterprise adoption.

| Rule | Status | Mapping behavior |
| --- | --- | --- |
| `danger` to PrimeNG `error` | Proposed | Wrappers translate design-system intent to provider terminology. |
| Typography aliases | Proposed | Map only when the active token source confirms aliases. |
| Missing ramp aliases | Proposed | Map to nearest approved primitive only with design approval. |
| PrimeNG `--p-*` bridge | Active in sample | Generate from the same theme selector source as `--ps-*`. |
| Component override CSS | Active in sample | Use for stable provider gaps not expressible through the preset. |

No normalization should exist only in documentation. Rules are defined in
`packages/tokens/src/tokens/mapping-rules.json`, emitted into generated token
artifacts, and covered by token build tests. If a proposed rule is approved, it
must be represented in the token build or wrapper implementation.

## Precedence Rules

When multiple source files overlap, use this precedence:

1. Approved enterprise source tokens.
2. Approved semantic normalization rules.
3. Component-intent tokens owned by the registry.
4. PrimeNG provider mapping derived from semantic/component tokens.
5. Temporary sample or bootstrap fallback values.

Provider-specific names should not override semantic token meaning. If a
PrimeNG key needs a value that does not exist in the source, create an explicit
proposed alias and track it until approved.

## Registry Consumption

The component registry consumes the contract in two ways:

- Wrappers use design-system inputs and CSS variables for public behavior.
- Internal PrimeNG components receive the approved provider preset and mapped
  `--p-*` variables.

Application teams should not import PrimeNG modules, pass PrimeNG-specific
configuration objects, or style `.p-*` selectors directly.

## Zeroheight Output

Zeroheight should document generated token metadata and evidence after that
publishing workflow is active. It should not own runtime values or participate
in token creation.

The future Zeroheight documentation artifact is the generated
`zeroheight-tokens.json` file from the token build, plus links to Storybook and
Playwright evidence.

## Open Validation

- Confirm the enterprise token export contains enough metadata to identify
  primitive, semantic, component, and provider-specific tiers.
- Confirm which normalization rules are approved design-system decisions.
- Confirm whether the PrimeNG preset should prefer resolved values or CSS
  variable references for each token family.
- Promote proposed normalization rules to approved only after design-system
  confirmation.
