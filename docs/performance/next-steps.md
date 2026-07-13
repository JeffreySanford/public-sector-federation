# Performance Observability Next Steps

The current performance dashboard is useful for CI test execution health, but it
does not yet measure true end-user or runtime application performance. Treat the
existing database, API, dashboard, seed export, and Slack alert plumbing as the
foundation for richer observability.

## Current Scope

Current metrics are mostly test-run metrics:

- E2E suite duration
- Test pass and fail status
- Browser group duration
- Baseline variance for recorded test suites
- Regression alerts based on test duration thresholds

These values help identify slow or failing test suites, but they do not explain
whether the shell, remotes, bundles, or user workflows are performing well.

## Runtime Metrics To Add

Add browser-side collection for product performance:

- Real page load performance
- First Contentful Paint
- Largest Contentful Paint
- Cumulative Layout Shift
- Interaction to Next Paint, when available
- Time to First Byte
- Shell boot duration
- Route transition duration
- First meaningful remote render

Playwright can collect these with browser APIs such as
`performance.getEntriesByType('navigation')`,
`performance.getEntriesByType('resource')`, and
`performance.getEntriesByType('measure')`.

## Federation Metrics To Add

Remote loading should have explicit instrumentation because remote entries are a
critical platform boundary:

- Manifest fetch duration
- Remote entry download duration
- Remote entry evaluation duration
- Custom element registration duration
- Time from route click to remote element creation
- Time from remote element creation to first visible remote content

The shell can add `performance.mark()` and `performance.measure()` calls around
manifest fetch, remote-entry script injection, custom element registration, and
remote host rendering.

## Asset And Bundle Metrics To Add

Track asset-level regressions separately from test duration:

- JavaScript transfer size
- CSS transfer size
- Remote entry size
- Slowest resources by duration
- Resource count by route
- Bundle parse and execute cost where browser tooling exposes it
- Network waterfall changes for shell and remotes

This should let alerts say which asset regressed instead of only reporting that
a test or route became slower.

## PrimeNG And Token Metrics To Validate

The design system also needs runtime validation:

- PrimeNG theme CSS availability before component render
- Token CSS variable availability in shell and remotes
- Overlay render and style timing
- Theme switch timing
- Layout shift caused by late style or token loading

These checks should be captured in focused browser tests and summarized in the
dashboard separately from general E2E duration.

## Dashboard Direction

Split the dashboard into separate views:

- Runtime performance: web vitals, page load, route load, workflow timing
- Federation loading: manifest, remote entry, custom element, remote render
- Asset health: bundle size, resource timing, slowest assets
- CI test health: suite duration, failures, flakes, and test trend variance

Regression alerts should prioritize product-impacting metrics such as LCP, CLS,
INP, route render time, remote entry loading, and bundle growth. Test execution
alerts should remain available, but they should be labeled as CI health rather
than product performance.

## Implementation Sequence

1. Rename current dashboard labels to clarify CI test execution health.
2. Add browser metric capture helpers for Playwright.
3. Add shell performance marks around manifest and remote-entry loading.
4. Extend the API model or add a runtime metrics model.
5. Record runtime metrics in CI after E2E navigation completes.
6. Add dashboard sections for runtime, federation, asset, and CI health.
7. Add Slack alerts for product-impacting regressions.
