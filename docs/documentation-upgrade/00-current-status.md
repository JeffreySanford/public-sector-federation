# Documentation Upgrade Current Status

_Last aligned: July 19, 2026 · mission realignment branch_

## Purpose

This page is the authoritative implementation snapshot for the documentation upgrade. The other files in this package define the target architecture, page model, governance rules, and long-term roadmap. When a planning document describes a future capability that conflicts with this page, this status page and the repository implementation take precedence.

## Canonical source hierarchy

1. `apps/starlight` owns public design-system guidance and documentation navigation.
2. Storybook owns live isolated component behavior and supported examples.
3. Angular source owns runtime component behavior and public APIs.
4. The generated component manifest owns relationships, lifecycle, evidence, and explicit missing states.
5. `docs/documentation-upgrade` owns target-state architecture and the prioritized delivery plan.
6. `docs/design-system` contains engineering reference material and historical operating-model records.
7. The retired third-party documentation platform is not a dependency anywhere in this repository.

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

### PR #16 — Select page and overlay evidence

- published `/docs/components/select/` using the flagship page model;
- recorded canonical, selected, disabled, disabled-option, empty, long-option, model-binding, and overlay-boundary stories;
- documented the compact provider-neutral option and value contract;
- added dedicated keyboard, model, disabled-state, focus-return, and popup behavior tests;
- proved body-appended overlay relationships, clipping escape, stacking, light/dark token inheritance, and mobile wrapping;
- added route, manifest, responsive, reflow, axe, accessibility-tree, visual, and Lighthouse evidence;
- retained invalid state, required state, help text, richer option content, the disabled-option ARIA omission, Figma alignment, and manual assistive-technology review as explicit gaps.

PR #16 merged to `master` at commit `2d8feb525c2ef92f54effaf702383bfb6a265e77` after its release validation and visual review completed successfully.

### PR #17 — Manifest-driven forensic workbench

- replaced the sample-first QA remote shell with **Component Inventory**, **Quality & Remediation**, and **Design Alignment Lab** views;
- made the generated component manifest the runtime source for discovery, evidence coverage, remediation priority, provider boundaries, Figma status, and blockers;
- added focused unit coverage for inventory filtering, remediation scoring, and alignment decisions;
- replaced obsolete QA, performance, and candidate-view browser assertions with workbench interaction, keyboard, theme, responsive, and federation coverage;
- retained useful Storybook and test fixtures while removing the retired application navigation model.

PR #17 merged to `master` at commit `6d743ad4d9fa0cbc91930b825763605cd24d6793` after the complete release gate passed.

### PR #18 — Platform simplification and Dialog

- removed the obsolete backend, database, performance dashboard, workflows, and supporting dependencies;
- published the flagship Dialog page and canonical stories;
- implemented labelled modal semantics, focus entry, containment, Escape dismissal, and opener restoration;
- recorded background inertness, body scroll locking, description support, stacked dialogs, Figma alignment, and manual assistive-technology review as open work;
- added responsive, reflow, StoryFrame, axe, accessibility-tree, visual, Lighthouse, and manifest evidence.

### PRs #19 and #21 — Release and dependency hardening

- resolved reported transitive dependency advisories;
- added Windows Starlight visual snapshots;
- stabilized the full-suite Dialog focus evidence;
- updated workflow actions and Starlight warning configuration;
- restored the complete release-quality path after the platform and documentation changes.

## Current mission gaps

The foundation and three flagship slices are complete. The next work is no longer another component page. It is the set of artifacts required to prove forensic discovery, accessibility remediation, and consolidation:

1. complete the remaining [component estate audit](./18-component-estate-audit.md) gaps after adding generated usage counts, duplication clusters, dispositions, token-boundary status, and typed findings;
2. reproduce, rank, remediate, and verify the [accessibility findings](./19-accessibility-findings-and-remediation.md);
3. perform named manual reviews for Button, Select, and Dialog;
4. finalize the [component consolidation proposal](./20-component-consolidation-proposal.md);
5. produce the code-informed Figma reconstruction reference;
6. finish Storybook hierarchy, `play` functions, documentation backlinks, and Chromatic review evidence;
7. move native component styling from direct PrimeNG `--p-*` consumption to public `--ps-*` tokens;
8. replace placeholder library test targets with real component contract tests.

## Following slices

1. Component usage discovery and duplication classification.
2. Accessibility finding reproduction and manual flagship reviews.
3. Canonical, merge, retain, deprecate, and investigate decisions for all manifest entries.
4. Figma reconstruction records for Button, Select, and Dialog.
5. Storybook and Chromatic final alignment.
6. Semantic token-boundary remediation and real library unit tests.
7. Obsolete compatibility cleanup.
8. Unified public release.

## Tracking documents

- [Prioritized backlog](./11-prioritized-backlog.md)
- [Delivery roadmap](./12-delivery-roadmap.md)
- [Astro Starlight application and designer-grade quality gate](./17-astro-starlight-application-and-designer-quality-gate.md)
- [Zeroheight retirement — complete](./15-zeroheight-retirement-strategy.md)
- [Design-system release TODO](../design-system/TODO.md)

## Verification commands

```bash
pnpm install --frozen-lockfile
pnpm start:all
pnpm validate:starlight
pnpm check:starlight
pnpm build:starlight
pnpm test:starlight
pnpm lighthouse:starlight
pnpm quality:starlight
pnpm verify:release
```
