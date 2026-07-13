# Token Export Validation

## Scope

This document validates a sanitized Figma Design Token Community Group, or DTCG,
export shape and explains whether it is usable for runtime token consumption.

The conclusion is intentionally limited: the export format appears adequate if
the documented normalization rules, precedence rules, and known gaps are accepted
by the owning design-system team.

<span style="color: #b00020"><strong>Red note:</strong></span>
Do not present this as validation of a real enterprise export until the actual
Figma export files and screenshots have been reread and compared directly.

## Source Shape

The source is expected to be DTCG JSON exported from Figma:

```text
packages/tokens/tokens/
├── Light_Mode_tokens_1.json
├── Light_Mode_tokens_2.json
├── Dark_Mode_tokens_1.json
├── Dark_Mode_tokens_2.json
├── Typography.json
├── Mode_1_tokens_2.json
└── ComponentCommons.json
```

Example DTCG token:

```json
{
  "primitives": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.1098, 0.4353, 0.6392],
        "alpha": 1,
        "hex": "#1C6FA3"
      },
      "$extensions": {
        "com.figma.variableId": "VariableID:1:118",
        "com.figma.scopes": ["ALL_SCOPES"]
      }
    }
  }
}
```

Useful DTCG properties:

- `$type` identifies the token category, such as color, dimension, or typography.
- `$value` contains either a primitive value or an alias such as
  `{primitives.ramp.primary.100}`.
- `$extensions` carries Figma metadata for traceability.

## Required Normalization

The pipeline should normalize known export issues before resolving tokens:

| Export issue | Normalized value | Reason |
| --- | --- | --- |
| `forground` | `foreground` | Corrects source typo before public artifacts are emitted. |
| `minus-4` | `900` | Converts a nonstandard ramp key to a predictable scale step. |
| `danger` | `error` | Aligns source naming to the design-system status model. |

Precedence rules should also be explicit:

- newer color exports override older color exports;
- typography overrides are applied consistently;
- component commons are treated as their own source group.

<span style="color: #b00020"><strong>Red note:</strong></span>
Precedence cannot live as tribal knowledge. If two exported files overlap, the
winning rule must be documented in code and in release notes.

## Transformation Pipeline

The token build should perform these steps:

1. Load the Figma DTCG JSON files.
2. Normalize source naming issues.
3. Merge source files using documented precedence rules.
4. Flatten nested DTCG objects to dotted token paths.
5. Resolve aliases transitively.
6. Convert color and dimension values to runtime-safe values.
7. Validate that no unresolved aliases remain.
8. Emit runtime, tooling, and documentation artifacts.

Flattening example:

```text
semantic.primary.background
semantic.primary.foreground
semantic.surface.background
semantic.surface.border
```

Alias resolution must support multi-level references and must fail on cycles.

## Output Artifacts

The token package should emit more than one artifact because different consumers
need different forms of the same contract.

| Artifact | Purpose | Consumer |
| --- | --- | --- |
| `dist/tokens.css` | Runtime CSS custom properties. | Shell, remotes, Storybook, tests. |
| `dist/tokens.json` | Full resolved token model. | Documentation, validation, tooling. |
| `src/generated/tokens.ts` | Typed token exports. | PrimeNG preset, tests, framework glue. |

Example CSS output:

```css
:root {
  --semantic-primary-background: #1c6fa3;
  --semantic-primary-foreground: #ffffff;
  --semantic-surface-background: #ffffff;
}

.p-dark {
  --semantic-surface-background: #202122;
}
```

Example TypeScript output:

```ts
export const light: Record<string, string | number> = {
  'semantic.primary.background': '#1c6fa3',
  'semantic.primary.foreground': '#ffffff',
};
```

## Known Gaps

These gaps do not make the export unusable, but they must be owned explicitly:

- Deprecated typography groups may still be present in the export.
- PrimeNG color ramps may expect scale endpoints that the source ramp does not
  provide.
- Any hard-coded corrections should be documented and monitored.
- Component-specific tokens may be intentionally absent if the design system
  relies on semantic roles instead of per-component token tiers.

<span style="color: #b00020"><strong>Red note:</strong></span>
Hard-coded corrections are acceptable only as named compatibility shims. They
should not silently become the real source of truth.

## Validation Checklist

- DTCG JSON parses without error.
- Normalization handles known typo and naming corrections.
- Merge precedence is deterministic.
- Aliases resolve transitively.
- Alias cycles fail the build.
- Color values convert predictably.
- Dimension values convert predictably.
- Final artifacts contain no unresolved `{...}` aliases.
- CSS custom properties are emitted for light and dark modes.
- TypeScript exports are generated from the resolved model, not duplicated by
  hand.
- Deprecated typography roles are confirmed with design.
- Any hard-coded corrections are documented.

## Review Questions

- Does the actual Figma export match this DTCG shape?
- Which source files are authoritative when duplicate token paths exist?
- Are deprecated typography groups intentionally still consumed?
- Should missing ramp endpoints be aliased, generated, or added in Figma?
- Are component-specific tokens intentionally excluded?
