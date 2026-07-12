# Token Naming Audit

This sample keeps token names intentionally small while proving the federation
architecture.

## Accepted Patterns

- Primitive palettes: `blue.500`, `slate.100`, `red.500`, `green.500`
- Semantic surfaces: `surfaceBackground`, `surfaceCard`, `surfaceBorder`
- Semantic text: `textPrimary`, `textSecondary`
- Semantic actions: `primaryBackground`, `primaryForeground`
- Semantic states: `dangerColor`, `successColor`, `focusRingColor`

## Rules

- Primitive tokens are private to the design-system packages.
- Semantic tokens describe role and purpose.
- Component tokens are added only for real component-specific needs.
- Token names should avoid PrimeNG-specific implementation details unless they
  live inside `@public-sector/PrimeNG-preset`.

## Follow-Up

As the sample grows, migrate the current TypeScript token source to DTCG JSON
inputs and regenerate CSS/TS artifacts from that source.
