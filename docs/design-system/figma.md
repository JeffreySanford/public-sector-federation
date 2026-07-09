# Figma

Figma should be the design authoring and review surface for the public-sector
design system. It is where visual intent is explored before implementation, but
implemented tokens in this repo remain the runnable source of truth.

## How We Will Use Figma

Use Figma for:

- Visual exploration of new theme variants and component treatments.
- Design review for PrimeNG component usage before engineering builds wrappers.
- Token review with design, accessibility, and product stakeholders.
- Handoff notes for forms, dashboards, overlays, data tables, and service flows.
- Accessibility annotations such as focus order, visible labels, required fields,
  contrast expectations, and error messaging.

## Library Structure

Recommended Figma library sections:

- Foundations: colors, typography, spacing, radius, elevation, and focus.
- Theme Modes: neutral, vibrant, and pastel across light and dark.
- Components: PrimeNG-backed components and token-styled fallback patterns.
- Patterns: service intake, eligibility review, reporting dashboards, admin
  settings, dialogs, toasts, and empty states.
- Accessibility: focus, contrast, keyboard behavior, labels, and validation.

## Initial File Plan

The detailed manual build sheet lives in
[Figma File Blueprint](./figma-file-blueprint.md). Start there when creating the
actual Figma file.

| Figma page | Purpose | Status |
| --- | --- | --- |
| `00 Cover` | Name, status, owner, and links to Storybook, Zeroheight, and repo docs. | Build now |
| `01 Foundations` | Semantic color variables, type scale, spacing, radius, shadow, and focus. | Build now |
| `02 Tokens / Variables` | Light/dark modes plus neutral, vibrant, and pastel variable modes. | Build now |
| `03 Components` | Proven PrimeNG families: Button/Tag, Card, Table/Paginator, Dialog/Toast. | Build now |
| `04 Patterns` | Service intake, reporting table, admin settings, empty state, and error patterns. | Sprint 2 |
| `05 App Examples` | Screenshots or frames based on shell, services, reporting, admin, and QA. | Sprint 2 |

## Token Alignment

Figma variables should mirror the semantic token names used by
`packages/tokens`. Avoid naming variables after PrimeNG internals unless the
variable exists only to document a library mapping.

Preferred naming direction:

```text
primitive -> semantic -> component -> PrimeNG mapping
```

Figma may contain exploratory values, but only shipped values should be published
to Zeroheight or copied into code.

## Handoff Checklist

Before engineering implementation starts, Figma should identify:

- The target component or pattern.
- The intended token names.
- Light and dark behavior.
- Theme variant behavior.
- Required accessibility states.
- Any PrimeNG component dependency.
- Any fallback behavior if a federated remote fails to initialize.

