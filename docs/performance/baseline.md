# Performance Baseline and Tracking

**Status:** Established | **Measured:** 2026-07-17

## Verified release run

The final local release validation completed on Windows 11 with 16 GB RAM and an SSD.

| Stage | Result | Reference duration |
| --- | --- | ---: |
| Workspace lint | Passed | about 5 seconds |
| Documentation links | Passed | under 10 seconds |
| Typecheck | Passed | about 2 seconds with cache |
| Unit tests | Passed | about 2 seconds with cache |
| Component manifest | Passed | under 5 seconds |
| Production builds | Passed | about 7 seconds with cache |
| Full Playwright browser matrix | 360/360 passed | 6.1 minutes |

The Playwright execution total represents the collected tests across Chromium, Firefox, and WebKit for that verified run. Use `pnpm test:e2e:list` for the authoritative current collection because the total changes as tests and projects evolve.

## Development-server startup

| Component | Typical startup | Notes |
| --- | ---: | --- |
| Federated frontend group | 40–60 seconds | First build is slower; Nx caching improves subsequent starts. |
| QA Storybook | about 60 seconds | Subsequent starts benefit from local caches. |

## Regression guidance

Development-machine timings are diagnostic guidance rather than service-level objectives.

- Investigate a repeatable increase above 120% of the local baseline.
- Treat a repeatable increase above 150% as a release concern.
- Compare runs from a clean port state and similar cache conditions.
- Distinguish application regressions from first-run browser installation or Storybook compilation.

For the full browser matrix, the July 17 reference is 6.1 minutes:

- 120% investigation threshold: approximately 7.3 minutes
- 150% release-concern threshold: approximately 9.2 minutes

## Investigation workflow

1. Confirm ports `4200` through `4204` and `4400` are not occupied by stale processes.
2. Re-run the affected file or browser project with one worker.
3. Use headed mode or the Playwright inspector for interaction failures.
4. Review `playwright-report/`, `test-results/`, videos, screenshots, and traces.
5. Compare build and startup logs before changing application code.
6. Update this baseline only after an intentional, verified change.

Useful commands:

```bash
pnpm test:e2e:list
pnpm exec playwright test --project=chromium --workers=1
pnpm exec playwright test --headed
pnpm exec playwright show-report
```

## Applied optimizations

- Four local Playwright workers to avoid machine contention
- One worker in pull-request CI for deterministic feedback
- Screenshots and video retained on failure
- Trace collection on retry
- Nx build and test caching
- Playwright-managed frontend and Storybook servers
- Separate focused Chromium commands for Storybook and candidate validation

## CI strategy

Pull requests run the static checks, production builds, Storybook validation, and Chromium E2E for practical feedback time.

Pushes to `master`, scheduled runs, and manual workflow dispatches execute the complete Chromium, Firefox, and WebKit release matrix. Logs, reports, screenshots, videos, and traces are uploaded when failures occur.

## Maintenance

Record a new entry only when one of these changes materially:

- browser matrix;
- worker configuration;
- CI operating system or machine class;
- number or type of federated applications;
- Storybook build strategy;
- a repeatable timing improvement or regression.

## See also

- [Testing and Release Guide](../TESTING.md)
- [Performance Tracking](./tracking.md)
- [Performance Next Steps](./next-steps.md)
