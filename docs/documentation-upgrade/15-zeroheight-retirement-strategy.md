# Zeroheight Retirement — Complete

_Completed: July 20, 2026._

This document originally laid out a staged strategy for retiring a third-party
documentation platform as this repository's canonical public documentation
surface, in favor of the repository-owned Starlight site. That retirement is
now complete: the platform is no longer a dependency anywhere in this
repository.

## What was removed

- The publish/export scripts and their `package.json` entries.
- The environment variables that configured publication (`.env.sample`,
  `.env.example`).
- The `zeroheight` field on the component manifest schema
  (`packages/ui-patterns/src/manifest/component-meta.types.ts` and
  `component-registry.ts`) — lifecycle, evidence, and design-reference status
  now live entirely on the manifest itself, with no external-platform
  projection field.
- The generated token export that fed the platform
  (`packages/tokens/src/build-tokens.mjs` no longer produces it; the shared
  token-description metadata that also feeds `design-tokens.json` was kept and
  renamed to `token-metadata.json`).
- The platform-specific governance and tooling docs
  (`docs/design-system/tooling/zeroheight.md`,
  `docs/design-system/governance/zeroheight-governance-model.md`) and the
  archived point-in-time export snapshots that used to live under
  `docs/reports/zeroheight/`.
- Every other prose mention across the `docs/` tree, retargeted to describe
  the actual current publication surface (Starlight) or the actual current
  data owner (the component manifest) instead.

## What superseded it

| Zeroheight-era responsibility | Current owner |
| --- | --- |
| Public component guidance | Starlight component pages |
| Lifecycle and evidence status | Component manifest (`packages/ui-patterns/generated/component-manifest.json`) |
| Live component behavior | Storybook |
| Design references | Manifest Figma fields plus the Starlight component page |

## Why this matters going forward

`scripts/validate-starlight-quality.mjs` still runs a public-wording check
that bans the word "Zeroheight" (among other retired terms) from published
Starlight content, so this platform cannot silently reappear in public docs
without the release gate catching it.

The rest of this repository's documentation and tooling architecture was
already designed tool-neutral: nothing about the manifest, Starlight, or
Storybook assumes any specific external documentation platform. If an
organization wants to project the governed manifest data into an enterprise
documentation platform later, that remains an additive integration, not a
restoration of a removed dependency.
