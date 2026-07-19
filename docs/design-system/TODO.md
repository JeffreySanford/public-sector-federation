# Design-System Release Status and TODO

_Last aligned: July 18, 2026_

## Purpose

This document separates what the repository currently proves, the active implementation slice, optional evidence improvements, and decisions that belong to an adopting production organization.

The authoritative upgrade snapshot is [Documentation Upgrade Current Status](../documentation-upgrade/00-current-status.md). The detailed delivery queue is [Prioritized Backlog](../documentation-upgrade/11-prioritized-backlog.md).

## Canonical documentation model

```text
DTCG-compatible token source
  -> normalization and generation
  -> semantic CSS variables, JSON, and TypeScript
  -> PrimeNG preset and provider bridge
  -> governed component wrappers
  -> shell and independently bootstrapped remotes
  -> Storybook live behavior and interaction evidence
  -> generated component manifest relationships and status
  -> Astro Starlight public guidance
  -> Playwright, axe, visual, Lighthouse, and release verification
```

`apps/starlight` is the canonical public documentation application. Zeroheight documentation and publishing scripts are historical experiment evidence only; they are not required for runtime delivery, release verification, or public guidance.

## Complete in this repository

### Runtime and component foundation

- [x] Angular shell with four federated custom-element remotes.
- [x] Independently bootstrapped remote applications.
- [x] Shared token package with CSS, JSON, TypeScript, and documentation exports.
- [x] PrimeNG preset derived from the shared token contract.
- [x] Governed UI wrapper package and generated component manifest.
- [x] Direct PrimeNG boundary enforcement outside approved integration packages.
- [x] Legacy allowlist format for tracked migration exceptions.
- [x] Light and dark theme propagation through shell and remotes.
- [x] Dialog, menu, select, popover, and tooltip overlay validation.
- [x] Storybook evidence for the current component catalog.
- [x] Candidate Button behavior, keyboard, theme, and automated accessibility evidence.
- [x] Shell-mounted integration and token-consumption tests.
- [x] Repository release, smoke, report, and manifest-check commands.

### Documentation foundation

- [x] Real Astro Starlight application inside the Nx workspace.
- [x] `/docs/` production base path, public navigation, search, Mermaid, responsive behavior, and light/dark appearance.
- [x] Shared semantic-token consumption in Starlight.
- [x] Normal Documentation navigation from the Angular shell.
- [x] Component-status entry point for Button, Select, and Dialog.
- [x] Pull-request Starlight build artifact.
- [x] Content, heading, wording, local-path, link, route, source, Storybook, manifest, and Figma-status validation.
- [x] Shared-token and style-discipline validation with explicit exceptions.
- [x] Built-site responsive checks at 360, 768, 1024, 1280, and 1440 pixels.
- [x] 320 CSS-pixel reflow coverage as the 200% zoom equivalent.
- [x] Page-level axe checks and initial accessibility-tree snapshots.
- [x] Reviewed light desktop, dark desktop, and light mobile visual baselines.
- [x] Lighthouse category, Core Web Vitals, and resource budgets.
- [x] Human polish-review status and policy preventing automatic baseline acceptance.
- [x] Starlight quality gate included in `verify:release`.
- [x] Separate Starlight and Angular/Storybook Playwright configurations.

## Active slice — Button page and StoryFrame

- [ ] Create a reusable `StoryFrame` component for canonical live Storybook behavior.
- [ ] Give every embedded frame a meaningful accessible title and visible full-story link.
- [ ] Handle loading, failure, clipping, height, responsive, and light/dark presentation states.
- [ ] Add StoryFrame-specific Playwright, axe, accessibility-tree, and visual coverage.
- [ ] Publish `/docs/components/button/` as the first complete flagship component page.
- [ ] Write purpose, usage, and anti-pattern guidance before evidence details.
- [ ] Identify and link the canonical stable Button story.
- [ ] Document anatomy, variants, interaction states, loading, disabled, keyboard, and focus behavior.
- [ ] Document the current public Angular API and provider boundary honestly.
- [ ] Show light and dark token relationships without duplicating token ownership.
- [ ] Add quality evidence, Figma status, decisions, and known gaps.
- [ ] Add the Button route and relationship to documentation-integrity validation.
- [ ] Extend accessibility-tree and visual coverage to the flagship component page.
- [ ] Pass the Starlight designer-grade quality gate and human polish review.

## Next slices

- [ ] Complete Select and Dialog flagship component pages.
- [ ] Add hosted pull-request preview URLs rather than build artifacts only.
- [ ] Add reusable `StatusBadge`, `ComponentHeader`, `EvidencePanel`, `TokenTable`, `AccessibilityStatus`, `FindingCard`, `DecisionRecord`, and `LightDarkPreview` components as page needs prove them.
- [ ] Add Storybook and Chromatic review coverage for reusable Starlight presentation components.
- [ ] Finalize manifest lifecycle, documentation, accessibility, provider-boundary, Figma, ownership, and blocker projections.
- [ ] Generate the public component catalog and health/gap views.
- [ ] Replace sample-heavy Angular views with Component Inventory, Quality & Remediation, and Design Alignment Lab.
- [ ] Add complete Figma identity and alignment records for Button, Select, and Dialog.
- [ ] Reorganize Storybook hierarchy and canonical story IDs.
- [ ] Migrate useful Zeroheight-era guidance and archive or remove obsolete publishing scripts.

## Optional evidence improvements

These deepen the demonstration but are not hidden runtime blockers:

- [ ] Add complete public API extraction for remaining partial components.
- [ ] Record dedicated behavior tests for components currently relying on shared integration evidence.
- [ ] Add manual screen-reader review records for promoted interactive components.
- [ ] Populate semantic and provider-bridge token references for every manifest entry.
- [ ] Add named sample owners and stewards where role-based governance needs a demonstration.
- [ ] Remove compatibility redirect files after all internal links use neutral paths.
- [ ] Pin remaining package specifiers declared as `latest` with a regenerated lockfile.
- [ ] Track Lighthouse, accessibility, and visual-regression trends over time.

## Reference component states

The registry intentionally demonstrates more than one lifecycle and evidence state.

| State | Meaning in this reference system |
| --- | --- |
| `active` | Exported for current use. It may still have partial governance metadata. |
| `candidate` | Implementation and evidence exist, but promotion requirements remain visible. |
| `partial` | Some API, token, documentation, test, accessibility, or design evidence is incomplete. |
| `blocked` | A declared requirement prevents promotion. |
| `deprecated` | Retained temporarily with a replacement path. |
| `ready` | Repository evidence is complete for the declared scope. |

These states do not claim that every active export has completed external design approval, Figma binding, ownership assignment, or manual assistive-technology review.

## Production adoption decisions

An adopting organization must validate or decide:

- authoritative Figma or DTCG-compatible token export;
- approved token naming and normalization rules;
- package names, release cadence, and supported version matrix;
- shell token-loading and remote standalone-import policy;
- accountable design, platform, registry, documentation, and application owners;
- temporary legacy PrimeNG allowlist entries and migration deadlines;
- design review and manual assistive-technology acceptance criteria;
- production hosting topology for Starlight, Storybook, Angular, and source links;
- production deployment, security, observability, and operational controls.

An organization may choose a hosted documentation platform, but that is an optional channel decision rather than an architectural dependency.

## Authoritative documents

- [Documentation Upgrade Current Status](../documentation-upgrade/00-current-status.md)
- [Prioritized Backlog](../documentation-upgrade/11-prioritized-backlog.md)
- [Delivery Roadmap](../documentation-upgrade/12-delivery-roadmap.md)
- [Reference Architecture Recommendation](./architecture/reference-architecture-recommendation.md)
- [Token Mapping Spec](./architecture/token-mapping-spec.md)
- [Token Delivery Decision](./architecture/token-delivery-decision.md)
- [Registry Consumption Spec](./architecture/registry-consumption-spec.md)
- [Component Registry](./architecture/component-registry.md)
- [Component Catalog](./components/catalog.md)
- [Governance Overview](./governance/overview.md)
- [Testing Guide](../TESTING.md)

## Verification

```bash
pnpm build:tokens
pnpm lint
pnpm lint:links
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm validate:starlight
pnpm check:starlight
pnpm test:starlight
pnpm lighthouse:starlight
pnpm quality:starlight
pnpm test:e2e
pnpm verify:release
```
