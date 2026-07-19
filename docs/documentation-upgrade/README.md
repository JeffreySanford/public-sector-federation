# Documentation Upgrade Package

This folder defines the transformation of **Public Sector Federation** into a focused **Public Sector Design System** documentation and workbench experience.

The plan keeps the repository's strongest engineering work—Angular, Nx, semantic tokens, provider-neutral component contracts, Storybook, Chromatic, Playwright, accessibility checks, the component manifest, Figma alignment, and federated adoption evidence—while changing the public story from a broad architecture and QA laboratory into a coherent design-system product.

## Current implementation status

Start with [00 — Current status](./00-current-status.md). It records what has actually shipped, which pull requests completed each checkpoint, the canonical source hierarchy, and the active implementation slice.

The remaining documents are target-state architecture, governance, page-model, and delivery references. They should not be read as claims that every proposed capability is already implemented.

Current position:

- the Astro Starlight foundation is merged;
- the designer-grade Starlight quality gate is merged and included in `verify:release`;
- Starlight is linked from the Angular shell and published as a pull-request build artifact;
- the next slice is the flagship Button page plus the reusable `StoryFrame` foundation;
- Zeroheight is historical evidence, not the canonical documentation surface.

## North star

A first-time visitor should understand this within approximately 30 seconds:

> Public Sector Design System is an Angular reference system for discovering, documenting, validating, and governing reusable components across complex applications. It combines semantic tokens, provider-neutral component APIs, Storybook, accessibility validation, Chromatic visual review, Figma design intent, and manifest-driven documentation.

## Why this upgrade exists

The repository began with several competing public narratives:

1. Angular module federation reference architecture;
2. public-sector application platform;
3. design-system component and token library;
4. QA and visual-validation laboratory;
5. Zeroheight documentation experiment;
6. personal portfolio walkthrough.

The upgraded documentation tells one primary story:

> This is a governed Angular design system that was discovered, documented, tested, remediated, and proven inside a complex application environment.

Federation and backend examples remain supporting evidence rather than the homepage identity.

## Documents in this package

| Document | Purpose |
| --- | --- |
| [00 — Current status](./00-current-status.md) | Authoritative implementation snapshot, completed checkpoints, current slice, and deferred work. |
| [01 — Vision and north star](./01-vision-and-north-star.md) | Defines the target product identity, audiences, principles, and success criteria. |
| [02 — Current-state audit](./02-current-state-audit.md) | Identifies what is strong, what is confusing, and what should be retained, reframed, or archived. |
| [03 — Target information architecture](./03-target-information-architecture.md) | Defines the site navigation and ownership of each documentation surface. |
| [04 — Target technical architecture](./04-target-technical-architecture.md) | Describes the recommended Starlight, Storybook, Angular, manifest, and token architecture. |
| [05 — Component page blueprint](./05-component-page-blueprint.md) | Establishes the standard structure for every component page. |
| [06 — Component manifest contract](./06-component-manifest-contract.md) | Defines the manifest's strict scope, schema domains, validations, generated views, and governance boundaries. |
| [07 — Figma component intent and manifest integration](./07-figma-component-intent-and-manifest-integration.md) | Defines what a Figma component represents and how alignment status fits into the manifest. |
| [08 — Storybook and Chromatic upgrade](./08-storybook-and-chromatic-upgrade.md) | Defines Storybook as the interactive component workbench and Chromatic as the visual review surface. |
| [09 — Accessibility and remediation plan](./09-accessibility-and-remediation-plan.md) | Defines accessibility contracts, automated and manual evidence, gap tracking, and remediation workflow. |
| [10 — Migration and cleanup plan](./10-migration-and-cleanup-plan.md) | Defines what to rename, archive, retain, and remove from public presentation. |
| [11 — Prioritized backlog](./11-prioritized-backlog.md) | Provides the actionable P0/P1/P2 implementation backlog. |
| [12 — Delivery roadmap](./12-delivery-roadmap.md) | Organizes the upgrade into reviewable checkpoints with acceptance criteria. |
| [13 — Role-proof matrix](./13-role-proof-matrix.md) | Maps repository evidence to forensic design-systems engineering responsibilities. |
| [14 — Wayfinder interview guide](./14-wayfinder-interview-guide.md) | Provides an interview-practice format for explaining the work clearly. |
| [15 — Zeroheight retirement strategy](./15-zeroheight-retirement-strategy.md) | Defines Zeroheight as historical evidence rather than the canonical documentation surface. |
| [16 — Main application three-view upgrade](./16-main-application-view-upgrade.md) | Defines Component Inventory, Quality & Remediation, and Design Alignment Lab. |
| [17 — Astro Starlight application and designer-grade quality gate](./17-astro-starlight-application-and-designer-quality-gate.md) | Defines `apps/starlight`, same-origin Angular integration, visual discipline, automated checks, and human polish review. |

## Core source-of-truth relationship

```mermaid
flowchart TD
  Figma[Figma: approved or draft design intent] --> Manifest[Manifest: identity, alignment, evidence, and lifecycle]
  Code[Angular source: runtime contract] --> Manifest
  Storybook[Storybook: live isolated behavior] --> Manifest
  Tests[Tests and accessibility evidence] --> Manifest
  Tokens[Token source and generated artifacts] --> Code
  Tokens --> Figma
  Manifest --> Starlight[Starlight: public guidance and status]
  Storybook --> Starlight
  Manifest --> Dashboard[Component health dashboard]
  Storybook --> Chromatic[Chromatic: visual review and regression]
  Code --> Apps[Reference applications: integrated adoption proof]
```

## Implementation sequence

```mermaid
flowchart TD
  A[Complete: Starlight application foundation] --> B[Complete: shared visual foundation]
  B --> C[Complete: Starlight quality gate and build artifact]
  C --> D[Complete: overview, status entry point, and Angular Documentation link]
  D --> E[Active: Button page and StoryFrame]
  E --> F[Next: Select and Dialog pages]
  F --> G[Manifest contract and projections]
  G --> H[Angular Inventory, Quality, and Alignment views]
  H --> I[Figma alignment records]
  I --> J[Storybook and Chromatic reorganization]
  J --> K[Accessibility and remediation evidence]
  K --> L[Forensic inventory and case studies]
  L --> M[Zeroheight and sample-UI retirement]
  M --> N[Unified public release]
```

## Definition of success

The upgrade succeeds when:

- `apps/starlight` remains a real, independently built documentation application;
- Starlight is mounted as a first-class route and linked directly from Angular;
- the documentation site, not the README or Zeroheight, is the primary public guidance surface;
- the first screen communicates a design-system product rather than a portfolio submission;
- flagship component pages place live behavior and usage guidance before evidence;
- the main application provides Component Inventory, Quality & Remediation, and Design Alignment Lab views;
- design tokens are shown in direct relationship to component decisions;
- Figma communicates design intent without becoming the runtime source of truth;
- the manifest records valid identifiers, alignment status, differences, and honest missing states;
- automated accessibility evidence remains distinct from manual review and conformance claims;
- visual, responsive, accessibility, content, performance, and cross-surface checks block regressions;
- substantial visual changes require explicit human polish approval rather than automatic baseline acceptance;
- federation is presented as adoption proof, not the main identity;
- Zeroheight remains optional historical evidence rather than a dependency;
- the component manifest visibly prevents documentation drift;
- a reviewer can see discovery, remediation, governance, design-to-code translation, and engineering depth in one coherent system.
