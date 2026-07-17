# Performance Baseline and Tracking

**Status:** Established  
**Verified:** July 17, 2026

## Current release baseline

The reference measurement was captured on a Windows 11 development machine with 16 GB RAM and an SSD.

| Stage | Reference result | Guidance |
| --- | ---: | --- |
| Workspace lint | about 5 seconds | Investigate repeatable runs above 10 seconds. |
| Unit tests | about 10 seconds | Investigate repeatable runs above 20 seconds. |
| Shell startup | about 40 seconds | Includes Angular and federation startup. |
| Storybook startup | about 60 seconds | First startup is slower than cached runs. |
| Full Playwright suite | 360 passing executions in 6.1 minutes | Chromium, Firefox, and WebKit with four local workers. |

Use the collected Playwright list rather than maintaining a manual test total:

```bash
pnpm test:e2e:list
```

The complete measured release command is:

```bash
pnpm verify:release
```

## Interpreting results

Development-machine measurements vary with cache state, browser installation, background processes, and available CPU and memory. Treat these values as regression guidance rather than service-level objectives.

- **Pass:** within roughly 120% of the reference duration.
- **Review:** repeatedly above 120% of the reference duration.
- **Release concern:** repeatedly above 150% without an explained increase in coverage.

For the current full E2E baseline:

- review repeatable runs above about 7.5 minutes;
- treat repeatable runs above about 9 minutes as a release concern.

## Regression investigation

When a meaningful slowdown appears:

1. Confirm that ports `4200` through `4204` and `4400` are free before startup.
2. Compare clean and cached runs.
3. Inspect Playwright traces and browser-specific failures.
4. Review new network requests, component-tree growth, and server startup logs.
5. Confirm that worker-count changes have not created resource contention.
6. Update this baseline only when the performance or coverage change is intentional.

Useful commands:

```bash
# Run the complete browser suite
pnpm test:e2e

# Use a single browser while investigating
pnpm exec playwright test --project=chromium --workers=1

# Run visibly
pnpm exec playwright test --headed

# Open the interactive debugger
pnpm exec playwright test --debug

# Open the last report
pnpm exec playwright show-report
```

## Continuous integration evidence

The release-quality workflow records and uploads:

- typecheck output;
- unit-test output;
- production-build output;
- built-Storybook validation output;
- Playwright logs;
- the Playwright HTML report;
- test result artifacts.

Pull requests use Chromium for faster feedback. Pushes to `master`, scheduled runs, and manual runs execute the complete Chromium, Firefox, and WebKit matrix.

## Applied optimizations

- Existing local servers may be reused outside CI.
- Local Playwright execution is capped at four workers to avoid browser contention.
- CI uses one worker for repeatability.
- Screenshots and videos are retained only for failures.
- Traces are captured on the first retry.
- Nx caching accelerates unchanged build, typecheck, and unit-test targets.

## Performance goals

- Keep the full cross-browser suite dependable before optimizing for minimum duration.
- Preserve deterministic startup and teardown behavior.
- Investigate unexplained regressions before raising timeouts.
- Prefer focused Chromium checks during development and the complete browser matrix for releases.

## See also

- [Testing and Release Guide](../TESTING.md)
- [Performance Tracking](./tracking.md)
- [Performance Next Steps](./next-steps.md)
- [Playwright parallelism](https://playwright.dev/docs/test-parallel)
