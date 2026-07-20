# Design-System Execution Status

_Last aligned: July 19, 2026 · mission realignment branch_

## Purpose

This is the short execution dashboard. It does not duplicate detailed acceptance criteria.

- [Current status](../documentation-upgrade/00-current-status.md) owns what is true now.
- [Prioritized backlog](../documentation-upgrade/11-prioritized-backlog.md) owns detailed outstanding tasks.
- [Delivery roadmap](../documentation-upgrade/12-delivery-roadmap.md) owns sequence.
- [Component estate audit](../documentation-upgrade/18-component-estate-audit.md) owns discovery findings.
- [Accessibility findings](../documentation-upgrade/19-accessibility-findings-and-remediation.md) owns accessibility risk and verification.
- [Consolidation proposal](../documentation-upgrade/20-component-consolidation-proposal.md) owns canonical and migration recommendations.

## Complete

- [x] Angular/Nx token, provider-boundary, wrapper, manifest, and federation foundation.
- [x] Astro Starlight public documentation application.
- [x] Designer-grade documentation quality gate.
- [x] Canonical flagship documentation for Button, Select, and Dialog.
- [x] Flagship responsive, reflow, axe, accessibility-tree, visual, and Lighthouse evidence.
- [x] Dedicated Select overlay and keyboard evidence.
- [x] Dialog focus entry, containment, Escape dismissal, and opener restoration.
- [x] Manifest-driven Component Inventory, Quality & Remediation, and Design Alignment Lab.
- [x] Release and dependency hardening through PR #21.

## Now — forensic audit

- [x] Generate usage counts and consuming paths for all public entries.
- [x] Assign duplication clusters and preliminary dispositions.
- [x] Complete API-pattern and token-boundary findings.
- [x] Link audit entries to API, token, and accessibility findings with validated evidence paths.
- [ ] Reconcile public `ps-*` naming with legacy `public-*` selectors.

## Now — accessibility remediation

- [x] Reproduce and classify provisional accessibility findings.
- [x] Add stable Button keyboard, loading, and activation evidence.
- [ ] Record NVDA and Chrome reviews for Button, Select, and Dialog.
- [x] Record automated forced-colors and zoom/reflow reviews; retain manual environment review separately.
- [ ] Add Select required, invalid, help, and error relationships.
- [ ] Decide and implement Dialog inertness, scroll-lock, and description behavior.

## Next — consolidation and design reference

- [ ] Finalize the canonical Button contract and compatibility window.
- [x] Record retain, merge, replace, deprecate, or investigate for every public entry.
- [ ] Document provider-wrapper versus native/Angular CDK tradeoffs.
- [ ] Move native components from direct PrimeNG `--p-*` variables to public `--ps-*` tokens.
- [ ] Replace placeholder UI-library test targets with real component contract tests.
- [ ] Produce the Button, Select, and Dialog Figma reconstruction reference.

## Next — Storybook and Chromatic

- [ ] Complete the product-facing hierarchy.
- [ ] Add appropriate flagship `play` functions.
- [ ] Separate canonical, experimental, deprecated, and system-health stories.
- [ ] Add Starlight backlinks and Chromatic review evidence.
- [ ] Retire remaining acceptance and candidate naming after link migration.

## Deferred or external

- [ ] Record real Figma component identities when access and approved design artifacts exist.
- [ ] Assign accountable production owners and stewards.
- [ ] Establish production hosting and release topology.
- [ ] Add hosted documentation preview URLs.
- [ ] Retire remaining Zeroheight publishing scripts after useful evidence is migrated.
- [ ] Expand flagship-level documentation and manual review to the remaining catalog.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm lint:links
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm quality:starlight
pnpm test:e2e
pnpm verify:release
```
