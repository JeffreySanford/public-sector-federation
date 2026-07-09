# Zeroheight Style Dictionary

This document defines the Style Dictionary shape Zeroheight should consume for
published design tokens. The goal is to make Zeroheight a faithful view of the
tokens implemented in `packages/tokens`, not a separate token source.

## Purpose

Use a Style Dictionary export to:

- Publish token values into Zeroheight.
- Keep design documentation aligned with `packages/tokens/src/tokens.css`.
- Compare Figma variable names against code token names.
- Separate primitive, semantic, component, and PrimeNG mapping tokens.
- Document light, dark, neutral, vibrant, and pastel behavior.

## Local POC Preview

The `/qa` route now includes a `Style Dictionary preview` section. It is a local
token browser that shows semantic `--ps-*` tokens and PrimeNG `--p-*` mapping
tokens together.

This preview is intentionally static for now. The next implementation step is to
replace the static rows with generated token JSON from `packages/tokens`.

## Token Tiers

Use these tiers when exporting tokens:

- `primitive`: raw palette and scale values.
- `semantic`: intent-based values for text, surface, border, focus, action, and
  status.
- `component`: design-system component decisions such as card radius, table
  header color, toast background, and focus treatment.
- `library`: PrimeNG `--p-*` mapping tokens.

Application code should consume semantic tokens or PrimeNG components. Primitive
tokens are for design-system internals only.

## Recommended Export Shape

```json
{
  "semantic": {
    "color": {
      "action": {
        "text": {
          "$type": "color",
          "$value": "{primitive.blue.700}",
          "$description": "Accessible action text used by links and outlined buttons.",
          "$extensions": {
            "publicSector": {
              "tier": "semantic",
              "themes": ["neutral", "vibrant", "pastel"],
              "modes": ["light", "dark"],
              "zeroheightGroup": "Color / Action"
            }
          }
        }
      }
    }
  }
}
```

## Naming Rules

- Use lowercase dot notation in dictionary source files.
- Use CSS custom property names only at the output layer.
- Preserve the existing public CSS variable names in code, such as
  `--ps-action-text` and `--p-datatable-header-cell-background`.
- Do not publish exploratory Figma variables unless they are accepted for
  implementation.

## Initial Dictionary Groups

Start with these groups:

- `primitive.color`
- `semantic.color.text`
- `semantic.color.surface`
- `semantic.color.border`
- `semantic.color.action`
- `semantic.color.status`
- `semantic.focus`
- `component.card`
- `component.toast`
- `component.datatable`
- `library.primeng`

## Initial Token Audit

| Area | Tokens to capture | Current source |
| --- | --- | --- |
| Foundations | surface, text, border, radius, focus, font family | `tokens.css :root` |
| Theme variants | neutral, vibrant, pastel, light, dark | theme classes |
| Actions | action text, button background, button text, focus ring | `--ps-*` and `--p-button-*` |
| Feedback | success, warning, danger, toast severity surfaces | `--ps-*` and `--p-toast-*` |
| Data display | datatable header, rows, hover, paginator selected state | `--p-datatable-*` and `--p-paginator-*` |

## Zeroheight Fields

Each token record should expose:

- Name
- CSS variable
- Value
- Tier
- Theme variant support
- Light and dark values
- Usage guidance
- Accessibility notes
- Deprecated or experimental status

## Build Direction

The current sample has a placeholder token build script:

```bash
pnpm build:tokens
```

Next implementation step:

1. Add Style Dictionary source JSON under `packages/tokens`.
2. Generate CSS variables from the dictionary.
3. Generate a Zeroheight JSON export from the same source.
4. Keep `packages/tokens/src/tokens.css` as generated output or a thin import
   layer.
5. Run `pnpm verify:fed` after token generation changes.

