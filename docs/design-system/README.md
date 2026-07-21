# Design System Engineering Reference

This folder contains engineering architecture, governance, validation, component, and tooling records for the Public Sector Design System reference implementation.

## Documentation hierarchy

The canonical public guidance surface is the Astro Starlight application in `apps/starlight`.

Use the documentation surfaces according to these boundaries:

1. **Starlight** — public guidance, navigation, component pages, quality explanations, and architecture summaries.
2. **Storybook** — live isolated component behavior and supported states.
3. **Angular source** — runtime contracts and public APIs.
4. **Generated component manifest** — lifecycle, relationships, evidence, alignment status, and explicit missing states.
5. **`docs/documentation-upgrade`** — target architecture, roadmap, backlog, and current implementation status.
6. **This folder** — detailed engineering references and historical operating-model decisions.

Start with:

- [Documentation Upgrade Current Status](../documentation-upgrade/00-current-status.md)
- [Design-System Release Status and TODO](./TODO.md)
- [Prioritized Backlog](../documentation-upgrade/11-prioritized-backlog.md)

## Current status

Implemented:

- versioned token generation and shared semantic CSS variables;
- PrimeNG preset and provider bridge;
- governed Angular wrapper patterns and component manifest;
- shell and independently bootstrapped remotes;
- Storybook, Playwright, accessibility, and integration evidence;
- Astro Starlight as a real Nx application at `/docs/`;
- shared Starlight token theme, public navigation, search, responsive behavior, and Angular Documentation link;
- content, relationship, accessibility, visual, responsive, Lighthouse, and human-polish release gates.

Active next slice:

- reusable `StoryFrame`;
- first complete flagship page at `/docs/components/button/`.

Still target-state work:

- Select and Dialog flagship pages;
- generated component catalog and health views;
- Component Inventory, Quality & Remediation, and Design Alignment Lab;
- complete Figma alignment records;
- broader Storybook/Chromatic reorganization.

## Engineering reference path

1. [Focus](./focus.md)
2. [Operating model](./architecture/operating-model.md)
3. [Token pipeline](./architecture/token-pipeline.md)
4. [Token consumption strategy](./architecture/token-consumption-strategy.md)
5. [Component registry](./architecture/component-registry.md)
6. [Shell interaction](./architecture/shell-interaction.md)
7. [Federated Web Components decision](./architecture/federated-web-components-decision.md)
8. [Implementation options](./architecture/implementation-options.md)
9. [Governance overview](./governance/overview.md)
10. [Developer journey](./governance/developer-journey.md)
11. [Component promotion](./governance/component-promotion.md)
12. [Contribution process](./governance/contribution-process.md)
13. [InnerSource contribution model](./governance/innersource-contribution-model.md)
14. [Adoption and team buy-in](./governance/adoption-and-team-buy-in.md)
15. [Rollout implementation](./governance/rollout-implementation.md)
16. [Repository review checklist](./validation/repository-review-checklist.md)
17. [NVDA manual accessibility review](./validation/nvda-manual-accessibility-review.md)

## Tool and surface responsibilities

| Tool or surface | Primary role |
| --- | --- |
| Figma | Approved or draft design intent, anatomy, states, and handoff references |
| Token source files | Authoritative design values for generated build outputs |
| PrimeNG preset | Semantic and component token mapping into the provider |
| Angular component source | Runtime behavior and public API contracts |
| Component manifest | Relationships, lifecycle, evidence, status, blockers, and explicit gaps |
| Storybook | Live isolated component behavior, examples, and interaction evidence |
| Angular workbench and shell | Integrated adoption and federation proof |
| Playwright and axe | Repeatable browser and automated accessibility evidence |
| Astro Starlight | Canonical public guidance and component documentation |
| Chromatic | Storybook visual review and regression workflow |
| Shell configuration | Remote locations and runtime integration |

## Supporting diagrams

The diagrams in [diagrams](./diagrams/) describe the engineering operating model. Some were created before Starlight became canonical, so read tool-specific labels through the hierarchy above.

- [Token delivery decision diagram](./diagrams/token-delivery-decision-diagram.png)
- [Runtime architecture](./diagrams/shared-design-system-implementation-runtime-architecture.png)
- [Shell interaction model](./diagrams/shell-interaction-model.svg)
- [Federated Web Components decision](./diagrams/federated-web-components-decision.svg)
