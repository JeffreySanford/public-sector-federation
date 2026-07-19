# Zeroheight Historical Tooling Record

## Current status

Zeroheight is no longer the canonical documentation surface for this repository.

The supported documentation model is:

- Astro Starlight for public guidance;
- Storybook for live isolated component behavior;
- Angular source for runtime contracts;
- the generated component manifest for lifecycle, evidence, alignment, and explicit missing states;
- Playwright, axe, visual baselines, Lighthouse, and release workflows for verification.

Zeroheight-era files and scripts remain only as historical evidence of a documentation-platform experiment. They must not be required for local development, CI, release verification, component promotion, or public guidance.

See:

- [Documentation Upgrade Current Status](../../documentation-upgrade/00-current-status.md)
- [Zeroheight Retirement Strategy](../../documentation-upgrade/15-zeroheight-retirement-strategy.md)
- [Design-System Release Status and TODO](../TODO.md)

## What the experiment proved

The experiment established several useful principles that continue in Starlight:

- component documentation needs clear audience separation;
- usage guidance should appear before dense validation evidence;
- live Storybook behavior is more useful than screenshot-only examples;
- lifecycle and evidence status must be explicit;
- Figma, tokens, code, Storybook, tests, and guidance require clear source-of-truth boundaries;
- documentation quality is a product-design and accessibility responsibility;
- external documentation tools should consume generated artifacts rather than own runtime values.

## Historical responsibility model

Zeroheight was evaluated as a communication and governance bridge. Even in that model, it was never intended to own:

- runtime tokens;
- component implementation;
- PrimeNG preset generation;
- `remoteEntry` URLs;
- shell mounting or routing;
- automatic promotion decisions;
- production test evidence.

Those boundaries remain correct, but Starlight and the manifest now provide the repository-owned guidance and relationship layers.

## Migration map

| Zeroheight-era concept | Canonical destination |
| --- | --- |
| Component overview and usage | Starlight component page |
| Live variants and states | Storybook canonical story |
| Runtime API | Angular source with a Starlight summary |
| Token purpose and mapping | Token artifacts plus Starlight guidance |
| Lifecycle and evidence status | Generated component manifest |
| Accessibility evidence | Tests, manifest fields, and Starlight quality summary |
| Figma identity and alignment | Manifest design-reference fields and component page |
| Storybook embedding | Starlight `StoryFrame` |
| Promotion blockers and decisions | Manifest plus decision records |
| Page-assembly and publishing instructions | Archive |

## Archived artifacts

The following concepts may remain temporarily while their evidence is migrated:

- `zeroheight:export`;
- `zeroheight:publish`;
- `zeroheight-tokens.json`;
- Zeroheight page plans and publishing notes;
- environment variables used only by the publication bridge.

They should be removed or moved under an explicit archive only after no supported workflow depends on them.

## Optional future use

An adopting organization may choose a hosted documentation platform for enterprise workflow, permissions, or communications. Such a platform should consume the same source-controlled guidance and generated evidence. It must remain an optional publication channel, not a runtime or governance source of truth.
