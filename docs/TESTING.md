# Testing and Release Guide

**Release status:** Portfolio reference `1.0.0`

## Counting convention

Use the collected Playwright output as the authoritative current count:

```bash
pnpm test:e2e:list
```

The verified July 17, 2026 release run completed **360 browser executions with 360 passing** across Chromium, Firefox, and WebKit. Counts can change as projects and test definitions evolve, so documentation should describe the verified run and point to the collection command rather than maintain a manually calculated total.

## Primary commands

```bash
# Complete release gate
pnpm verify:release

# Running-platform federation and accessibility smoke check
pnpm verify:smoke

# Current Playwright collection
pnpm test:e2e:list

# Individual quality stages
pnpm lint
pnpm lint:links
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm test:e2e
```

`verify:release` runs linting, link validation, type checking, unit tests, manifest drift validation, production builds, the Starlight quality gate, and the full Playwright suite.

`verify:smoke` expects the integrated frontend platform to be running. It checks development ports and performs the cross-application accessibility scan.

## Test suites

### Repository and documentation validation

`pnpm lint:links` validates Markdown links.

`pnpm manifest:check` regenerates component metadata in check mode and fails when the committed manifest has drifted from its TypeScript source.

### Unit tests

```bash
pnpm test
```

Unit-test breadth is intentionally smaller than the E2E evidence in this architecture sample. Add focused component and transformation tests when behavior expands or a regression can be isolated below the browser layer.

### Playwright E2E

```bash
pnpm test:e2e
```

The Playwright suite starts its configured web servers and validates:

- shell and remote federation;
- custom-element mounting and navigation;
- token inheritance and light/dark theme propagation;
- dialog, menu, select, popover, and tooltip overlays;
- manifest-driven workbench behavior and responsive rendering;
- Storybook component states and variants;
- keyboard interaction and automated accessibility checks;
- documentation examples and architecture boundaries;
- generated component-registry presentation.

The primary browser projects are Chromium, Firefox, and WebKit.

### Focused Storybook checks

```bash
pnpm test:storybook:qa
pnpm test:storybook:qa:chromium
pnpm test:storybook:up-button
pnpm test:storybook:up-button:chromium
pnpm test:storybook:registry
pnpm test:storybook:registry:chromium
```

Use the Chromium variants for quicker local iteration. Run the complete E2E suite before a release.

### Chromatic

```bash
pnpm chromatic
```

Chromatic builds the QA Storybook and publishes visual evidence. Visual changes should be reviewed in Chromatic before the associated component is promoted.

## Evidence expectations by risk

| Change | Minimum evidence |
| --- | --- |
| Documentation only | Markdown lint and link validation |
| Token mapping | Token build, token tests, manifest check, theme evidence |
| Native presentational pattern | Build, typecheck, Storybook, automated accessibility |
| Interactive wrapper | Storybook, behavior tests, keyboard coverage, accessibility |
| Overlay wrapper | Interactive-wrapper evidence plus integrated theme and focus validation |
| Federation or bootstrap | Build plus shell and remote E2E coverage |
| Candidate promotion | All declared manifest promotion requirements resolved |

## Debugging Playwright

```bash
# Interactive debugger
pnpm playwright test --debug

# Visible browser
pnpm playwright test --headed

# One file
pnpm playwright test apps/shell/e2e/federation.spec.ts

# One named test
pnpm playwright test -g "should load shell application"

# Open the last HTML report
pnpm playwright show-report
```

When a test times out, first confirm that the configured frontend, Starlight, and Storybook ports are available and that each web-server process reached its ready condition. Prefer waiting for a stable application condition over adding arbitrary sleeps.

## Accessibility failures

1. Re-run the focused test in headed mode.
2. Inspect the axe violation details in the Playwright output.
3. Review semantic HTML, accessible names, focus order, and keyboard behavior.
4. Confirm that overlays inherit theme variables and remain reachable after opening.
5. Update Storybook and shell integration evidence with the fix.

Automated checks do not replace manual screen-reader review. The component manifest records manual-review status separately.

## Runtime timing

Development-machine timings are diagnostic rather than CI service-level objectives. The retired database-backed performance dashboard and manually maintained baseline pages were removed in PR #18 because release decisions now come from the current Playwright, Lighthouse, visual-regression, accessibility, typecheck, and build gates.

Investigate repeatable increases through current CI logs and artifacts. Record a new benchmark only when its environment, collection method, owner, and decision threshold are explicit and maintained.

## Pull-request checklist

- [ ] `pnpm lint` passes.
- [ ] `pnpm lint:links` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm manifest:check` passes.
- [ ] `pnpm build` passes.
- [ ] Focused browser tests cover the changed behavior.
- [ ] The full E2E suite is run before release.
- [ ] Documentation and component evidence are updated.
- [ ] Accessibility and theme behavior are preserved.
- [ ] No new console errors or unexplained timing regressions appear.

## Coverage status

Code-coverage instrumentation and enforced percentage thresholds are not currently part of the committed release command. Do not document or invoke a coverage script until instrumentation and a corresponding package script are added.

Current coverage priorities are federation loading, token inheritance, workbench behavior, provider-boundary failures, modal and overlay interaction, documentation integrity, and accessibility regressions.
