# Zeroheight

Zeroheight should be the governed design-system portal for the public-sector
federation. It is the place where product, design, accessibility, and engineering
teams can read the current contract without needing to inspect Angular source.

## How We Will Use Zeroheight

Use Zeroheight to publish stable guidance:

- Token foundations: color, typography, spacing, radius, focus, elevation, and
  state tokens.
- Theme modes: neutral, vibrant, and pastel in light and dark.
- Component usage: when to use PrimeNG directly, when to use a shared wrapper,
  and when native token-styled markup is preferred for route-critical content.
- Accessibility guidance: contrast expectations, keyboard focus rules, labels,
  dialog behavior, and validation messaging.
- Federation guidance: each shell and remote must bootstrap
  `providePublicSectorPrimeNG()`.
- Release notes: token changes, component changes, known risks, and migration
  steps for remote teams.

## Local POC Preview

This repo does not integrate with real Zeroheight yet. Instead, `/qa` contains a
`Zeroheight preview` section that models the pages we would eventually publish:

- App inventory
- Component coverage
- Accessibility and QA guidance

Treat that section as a developer-authored preview, not the final governed
publishing surface.

## Automated Export Package

Use the repo export pipeline to prepare a clean upload folder before manual
Zeroheight import or an API publish bridge:

```bash
pnpm zeroheight:export
```

Or run the full evidence workflow:

```bash
pnpm report:all
```

The export package is written to:

```text
docs/reports/zeroheight/latest/
```

It includes:

- Markdown page sources mapped to Zeroheight sections.
- Generated token exports from `packages/tokens`.
- Latest Agile progress reports and Playwright screenshots.
- `manifest.json` upload metadata.

When a publish bridge is configured, run:

```bash
pnpm report:publish
```

Without `ZEROHEIGHT_PUBLISH_ENDPOINT`, publish completes as a dry run and leaves
the package ready for manual upload.

## Page Structure

The detailed manual build sheet lives in
[Zeroheight Skeleton](./zeroheight-skeleton.md). Use that file when creating the
first real Zeroheight space.

Recommended Zeroheight sections:

1. Home / Getting Started
2. Foundations
3. Components
4. Patterns
5. Developer Guide
6. Governance

## Retrofit Starting Point

Because this POC started as a working app, Zeroheight should begin from the app
inventory rather than a blank documentation site.

Track these sources:

| Zeroheight page | Content | Source |
| --- | --- | --- |
| Home and getting started | What this system is, who uses it, and how teams adopt it. | App inventory |
| Foundations | Color, typography, spacing, radius, elevation, focus, and dark mode. | Style Dictionary and Figma |
| Components | Usage, states, accessibility notes, and embedded Storybook examples. | Storybook |
| Patterns | Forms, search/filter, tables, empty states, loading, errors, confirmations. | `/qa` and remotes |
| Developer guide | Install preset, import tokens, bootstrap PrimeNG, and verify federated routes. | Repo docs |
| Governance | Contribution model, release readiness, blockers, and versioning notes. | Agile plan |

## Token Publishing

Zeroheight should consume a Style Dictionary export rather than hand-entered
token values. The export contract is described in
[Zeroheight Style Dictionary](./zeroheight-style-dictionary.md).

The Zeroheight token pages should identify each token by:

- Token name
- Token tier: primitive, semantic, component, or PrimeNG mapping
- Light value
- Dark value
- Variant support: neutral, vibrant, pastel
- Usage guidance
- Accessibility notes

## Governance Flow

1. Designers propose visual changes in Figma.
2. Engineering updates `packages/tokens` and the PrimeNG preset.
3. The team validates `/qa` and runs `pnpm verify:fed`.
4. Storybook examples are updated for component states.
5. Zeroheight is updated only after the implementation and checks pass.

Zeroheight should document shipped behavior, not speculative token ideas.

