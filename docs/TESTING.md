# Testing and Release Guide

**Release status:** Portfolio reference `1.0.0`

## Counting convention

The verified July 17, 2026 release run completed **360 Playwright test executions with 360 passing** across the configured Chromium, Firefox, and WebKit projects.

Playwright expands applicable test definitions through browser projects, so collected execution counts change as files, projects, and browser coverage evolve. Use the repository command rather than maintaining a hand-counted total:

```bash
pnpm test:e2e:list
```

## Primary commands

```bash
# Complete release gate
pnpm verify:release

# Running-platform federation and accessibility smoke check
pnpm verify:smoke

# Individual quality stages
pnpm lint
pnpm lint:links
pnpm lint:public
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm test:e2e
pnpm test:e2e:list
```

`verify:release` runs workspace linting, link and public-reference validation, type checking, unit tests, manifest drift validation, production builds, and the full Playwright suite.

`verify:smoke` expects the integrated platform to be running. It checks development ports and performs the cross-application accessibility scan.

## Test suites

### Repository and documentation validation

`pnpm lint` validates workspace JSON, Prisma configuration, Markdown formatting, SCSS conventions, and PrimeNG wrapper boundaries through the repository lint scripts.

`pnpm lint:links` validates Markdown links.

`pnpm lint:public` scans public filenames and text files for prohibited former internal references. It is part of the release gate and continuous integration workflow.

`pnpm manifest:check` regenerates component metadata in check mode and fails when the committed manifest has drifted from its TypeScript source.

### Unit tests

```bash
pnpm test
```

The current API unit baseline covers dashboard work-item totals and status-grouped reporting in `apps/agile-api/test/agile.service.test.ts`.

Unit-test breadth is intentionally smaller than the E2E evidence in this architecture sample. Additional service-level coverage should be added when business logic expands.

### Playwright E2E

```bash
pnpm test:e2e
```

The Playwright suite starts its configured web servers and validates:

- shell and remote federation;
- custom-element mounting and navigation;
- token inheritance and light/dark theme propagation;
- PrimeNG dialog, menu, select, popover, and tooltip overlays;
- QA remote behavior and responsive rendering;
- Storybook component states and variants;
- keyboard interaction and automated accessibility checks;
- documentation examples and architecture boundaries;
- generated component-registry presentation.

The primary browser projects are Chromium, Firefox, and WebKit.

### Focused Storybook checks

```bash
pnpm test:storybook:qa
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

## Continuous integration

The release-quality workflow uses two levels of browser validation:

- pull requests run all static gates, production builds, built-Storybook validation, and the Chromium Playwright project;
- pushes to `master`, scheduled runs, and manual runs execute the complete Chromium, Firefox, and WebKit suite.

Playwright reports, test results, and diagnostic logs are uploaded even when a browser gate fails.

## Evidence expectations by risk

| Change | Minimum evidence |
| --- | --- |
| Documentation only | Markdown lint, link validation, and public-reference guard |
| Token mapping | Token build, token tests, manifest check, theme evidence |
| Native presentational pattern | Build, typecheck, Storybook, automated accessibility |
| Interactive wrapper | Storybook, behavior tests, keyboard coverage, accessibility |
| Overlay wrapper | Interactive-wrapper evidence plus shell-mounted theme and append-target validation |
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

When a test times out, first confirm that the configured ports are available and that Docker-backed services are healthy. Prefer waiting for a stable application condition over adding arbitrary sleeps.

## Accessibility failures

1. Re-run the focused test in headed mode.
2. Inspect the axe violation details in the Playwright output.
3. Review semantic HTML, accessible names, focus order, and keyboard behavior.
4. Confirm that overlays inherit theme variables and remain reachable after opening.
5. Update Storybook and shell integration evidence with the fix.

Automated checks do not replace manual screen-reader review. The component manifest records manual-review status separately.

## Performance baseline

Development-machine measurements vary, so timings are regression guidance rather than CI service-level objectives.

| Stage | Reference duration |
| --- | ---: |
| Workspace lint | about 5 seconds |
| Unit tests | about 10 seconds |
| Shell startup | about 40 seconds |
| Storybook startup | about 60 seconds |
| Full E2E suite | about 4–7 minutes |

Investigate a repeatable increase above roughly 120% of the local baseline. Treat a repeatable increase above 150% as a release concern.

## Pull-request checklist

- [ ] `pnpm lint` passes.
- [ ] `pnpm lint:links` passes.
- [ ] `pnpm lint:public` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm manifest:check` passes.
- [ ] `pnpm build` passes.
- [ ] Focused browser tests cover the changed behavior.
- [ ] The full E2E suite is run before release.
- [ ] Documentation and component evidence are updated.
- [ ] Accessibility and theme behavior are preserved.
- [ ] No new console errors or unexplained performance regressions appear.

## Coverage status

Code-coverage instrumentation and enforced percentage thresholds are not currently part of the committed release command. Do not document or invoke a coverage script until instrumentation and a corresponding package script are added.

Current coverage priorities are federation loading, token inheritance, remote communication, provider-boundary failures, and backend error paths.
