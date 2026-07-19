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

### PR #15 — Button page and StoryFrame

- published the first complete flagship component page at `/docs/components/button/`;
- added the reusable, accessible `StoryFrame` boundary for opt-in live Storybook behavior;
- added a dedicated canonical stable Button story;
- documented purpose, usage, anatomy, states, accessibility expectations, tokens, Angular API, provider boundaries, decisions, and known gaps;
- recorded the Button page, source file, canonical story ID, and Storybook source in the integrity and manifest relationships;
- added responsive, 200%-zoom-equivalent, StoryFrame interaction, axe, accessibility-tree, visual, and Lighthouse coverage;
- retained Figma access, manual assistive-technology review, compatibility APIs, and provider-specific escape hatches as explicit open evidence or remediation items.

PR #15 merged to `master` at commit `ef4f201557204f71d17568e9b3f80d97cd0688ad`. Release Quality Gate run #120 (`29667746141`) passed on the final branch. A local post-merge review also confirmed that dependencies installed, the workspace started, and the served documentation rendered successfully.

## Active slice — Select documentation and overlay evidence

The next slice is **Select documentation plus canonical overlay and keyboard evidence**.

The slice should:

- publish `/docs/components/select/` using the proven Button page sequence;
- keep purpose, selection guidance, and alternatives ahead of implementation evidence;
- designate a normal canonical Select story and focused state stories;
- document the public `label`, `options`, `placeholder`, `disabled`, and `value` contract;
- document the provider-neutral option model and the private PrimeNG implementation boundary;
- document accessible naming, combobox semantics, keyboard navigation, selection, disabled options, empty options, and long-option behavior;
- prove body-appended overlay positioning, clipping, stacking, light/dark theme inheritance, and responsive behavior;
- add dedicated Storybook interaction and Playwright evidence rather than relying only on shared shell token checks;
- record current limitations honestly, including the absence of invalid-state, help-text, required-state, and richer option-content APIs;
- update the component registry, generated manifest, documentation-integrity relationships, TODO, and prioritized backlog in the same pull request;
- pass the existing designer-grade Starlight gate and human polish review.

## Following slices

1. Complete the Dialog flagship page and focus-management evidence.
2. Add hosted pull-request preview URLs rather than build artifacts only.
3. Add reusable Starlight presentation components only where Select and Dialog prove repeated page needs.
4. Finalize manifest projections and generated catalog or health views.
5. Replace sample-heavy Angular workbench views with Component Inventory, Quality & Remediation, and Design Alignment Lab.
6. Add complete Figma identity and alignment records.
7. Reorganize the broader Storybook hierarchy and Chromatic review workflow.
8. Retire remaining Zeroheight scripts and primary-language references after evidence is migrated.

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
