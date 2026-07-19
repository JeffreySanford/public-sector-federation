# Documentation Upgrade Current Status

_Last aligned: July 19, 2026_

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

## Active slice — PR #18 platform simplification and Dialog

PR #18 combines two tightly related changes: removing the backend platform that became obsolete when PR #17 retired the performance view, and completing the final flagship component page.

### Platform simplification implemented on the branch

- removed the unused NestJS `agile-api` application;
- removed Prisma, PostgreSQL schema, migrations, seed data, and backend-only dependencies;
- removed Docker Compose and backend startup, rebuild, migration, seed, log, and shutdown commands;
- removed the retired performance dashboard, performance data service, workflows, scripts, tests, and documentation;
- regenerated `pnpm-lock.yaml` from the simplified dependency graph;
- changed `pnpm start:all` to launch only the shell, four Angular remotes, and Starlight;
- removed Prisma generation and Docker-backed API lifecycle steps from the Release Quality Gate;
- aligned the README, testing guide, and portfolio description with the frontend/documentation reference architecture.

### Dialog flagship work implemented on the branch

- publishes `/docs/components/dialog/` with the established flagship sequence;
- upgrades the native `ps-dialog` wrapper with labelled modal semantics, predictable initial focus, forward and reverse focus containment, Escape dismissal, and opener restoration;
- records dedicated Default, Destructive Confirmation, Long Content, and Focus Sequence stories;
- adds isolated Storybook browser evidence for semantics, close naming, focus, dismissal, destructive actions, responsive scrolling, theme inheritance, and axe analysis;
- adds Starlight responsive, 320 CSS-pixel reflow, StoryFrame, axe, accessibility-tree, visual, and Lighthouse coverage;
- records the public API, native provider boundary, token relationships, destructive-action guidance, decisions, and limitations;
- keeps background inertness, explicit body scroll lock, configurable initial focus, `aria-describedby`, stacked dialogs, Figma alignment, and manual assistive-technology review visibly open.

The exact final PR state still needs generated manifest and visual-baseline commits, human visual review, and a complete Release Quality Gate pass before merge.

## Following slices

1. Extract reusable Starlight presentation components only where the three flagship pages prove repetition.
2. Generate public component catalog, lifecycle, evidence-health, and remediation views from the manifest.
3. Add hosted pull-request preview URLs rather than build artifacts only.
4. Add complete Figma identity, property, and token alignment records.
5. Reorganize the broader Storybook hierarchy and Chromatic review workflow.
6. Complete named manual screen-reader reviews for promoted interactive components.
7. Retire remaining Zeroheight scripts and primary-language references after useful evidence is migrated.

## Tracking documents

- [Prioritized backlog](./11-prioritized-backlog.md)
- [Delivery roadmap](./12-delivery-roadmap.md)
- [Astro Starlight application and designer-grade quality gate](./17-astro-starlight-application-and-designer-quality-gate.md)
- [Zeroheight retirement strategy](./15-zeroheight-retirement-strategy.md)
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
