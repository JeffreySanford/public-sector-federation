# Documentation Upgrade Current Status

_Last aligned: July 18, 2026_

## Purpose

This page is the authoritative implementation snapshot for the documentation upgrade. The other files in this package define the target architecture, page model, governance rules, and long-term roadmap. When a planning document describes a future capability that conflicts with this page, this status page and the repository implementation take precedence.

## Canonical source hierarchy

1. `apps/starlight` owns public design-system guidance and documentation navigation.
2. Storybook owns live isolated component behavior and supported examples.
3. Angular source owns runtime component behavior and public APIs.
4. The generated component manifest owns relationships, lifecycle, evidence, and explicit missing states.
5. `docs/documentation-upgrade` owns target-state architecture and the prioritized delivery plan.
6. `docs/design-system` contains engineering reference material and historical operating-model records.
7. Zeroheight material is historical evidence only; it is not the canonical documentation surface or a supported publication dependency.

## Completed checkpoints

### PR #13 — Astro Starlight foundation

- created `apps/starlight` as a real Nx workspace application;
- configured `/docs/`, search, responsive navigation, light and dark appearance, Mermaid, and shared token consumption;
- added Overview, Foundations, Components, Patterns, Accessibility, Develop, Quality, Architecture, and Exploration routes;
- connected the public documentation shell to source, Storybook, and the Angular workbench.

### PR #14 — Designer-grade documentation quality gate

- added `starlight:quality-gate` and integrated it into `verify:release`;
- added content, hierarchy, wording, link, route, manifest, Storybook, source, and Figma-status validation;
- added shared-token and style-discipline validation with documented exceptions;
- added built-site Playwright coverage at 360, 768, 1024, 1280, and 1440 pixels plus 320 CSS-pixel reflow coverage;
- added axe checks, initial accessibility-tree snapshots, light/dark/mobile visual baselines, and Lighthouse budgets;
- added explicit human-polish and baseline-acceptance policy metadata;
- added component-status entry points and a normal Documentation link from the Angular shell;
- added a pull-request build artifact for the Starlight output;
- kept the Starlight and Angular/Storybook Playwright suites isolated so each runs against the correct server.

Release Quality Gate run `29665993721` passed for the merged PR #14 state.

## Active slice

PR #15 implements **Button documentation plus the reusable `StoryFrame` foundation** and is in final release validation.

The slice should:

- create a reusable, accessible live-story presentation component;
- publish the first complete flagship component page at `/docs/components/button/`;
- place purpose and usage guidance before evidence;
- link or embed the canonical Button story without duplicating runtime behavior;
- document anatomy, variants, states, interaction behavior, accessibility expectations, token relationships, public Angular API, provider boundary, evidence, Figma status, decisions, and known gaps;
- extend route, accessibility-tree, visual, responsive, and clipping coverage for the new page and StoryFrame;
- update the manifest relationship and documentation backlog honestly;
- pass the existing designer-grade quality gate and human polish review.

## Deferred after the Button slice

- complete Select and Dialog flagship pages;
- add hosted pull-request preview URLs rather than build artifacts only;
- add broader reusable Starlight presentation components and their Storybook/Chromatic coverage;
- finalize manifest projections and generated catalog/health views;
- replace sample-heavy Angular workbench views with Component Inventory, Quality & Remediation, and Design Alignment Lab;
- add complete Figma identity and alignment records;
- reorganize the full Storybook hierarchy and Chromatic review workflow;
- retire remaining Zeroheight scripts and primary-language references after evidence is migrated.

## Tracking documents

- [Prioritized backlog](./11-prioritized-backlog.md)
- [Delivery roadmap](./12-delivery-roadmap.md)
- [Astro Starlight application and designer-grade quality gate](./17-astro-starlight-application-and-designer-quality-gate.md)
- [Zeroheight retirement strategy](./15-zeroheight-retirement-strategy.md)
- [Design-system release TODO](../design-system/TODO.md)

## Verification commands

```bash
pnpm install --frozen-lockfile
pnpm validate:starlight
pnpm check:starlight
pnpm build:starlight
pnpm test:starlight
pnpm lighthouse:starlight
pnpm quality:starlight
pnpm verify:release
```
