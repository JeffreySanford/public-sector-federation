# Design System Documentation

This folder captures how the public-sector design system should be documented,
tested, and shared across engineering, design, accessibility, and product teams.

## Start With App Inventory

- [App Inventory](./app-inventory.md) is the working source for what each shell
  route and remote owns, which design-system patterns it exercises, and where
  changes should be validated.
- [Component Coverage Matrix](./component-coverage-matrix.md) tracks which
  PrimeNG families are proven, active, experimental, or risky.

Start with inventory before documenting tools. The tools support the system; the
apps prove whether the system works.

## Supporting Documentation Surfaces

- [Zeroheight](./zeroheight.md) is the governed design-system reference for
  published app inventory, tokens, usage guidance, accessibility notes, and
  release decisions.
- [Zeroheight Skeleton](./zeroheight-skeleton.md) is the manual page build sheet
  for the first governed portal structure.
- [Storybook](./storybook.md) is the interactive engineering playground for
  component states, wrappers, PrimeNG smoke tests, and regression checks.
- [Figma](./figma.md) is the design authoring surface for visual exploration,
  token review, and handoff-ready component specs.
- [Figma File Blueprint](./figma-file-blueprint.md) is the manual page build
  sheet for `00 Cover`, `01 Foundations`, `02 Tokens / Variables`, and
  `03 Components`.
- [Zeroheight Style Dictionary](./zeroheight-style-dictionary.md) defines the
  token export shape that Zeroheight should publish and compare against code.
- [Agile Workflow](./agile-workflow.md) breaks the remaining POC work into
  sprint-sized increments with LOE, blockers, time entries, done criteria, and
  the Dockerized Postgres/NestJS persistence workflow.
- [Platform Reporting](./platform-reporting.md) defines `start:all`, Docker
  dirty checks, Agile seed sync, executive reports, and Playwright screenshots.

## Current Operating Model

- `pnpm start:all` starts/checks Docker API and DB first, then runs shell and
  remotes locally on ports `4200-4204`.
- API and DB run in Docker: NestJS on `3333`, Postgres on `5432`.
- Frontend apps run locally through Nx dev servers.
- `pnpm verify:fed` validates the shell-composed UI and accessibility matrix.
- `pnpm screenshots:progress` captures repeatable Playwright screenshots for
  executive and lead developer review.
- `pnpm agile:report` exports Markdown, HTML, and JSON progress artifacts.
- `pnpm zeroheight:export` packages tokens, page markdown, reports, and
  screenshots into `docs/reports/zeroheight/latest/`.
- `pnpm report:all` runs verification, screenshots, Agile report export, and
  Zeroheight packaging in one command.

## Local Developer Views

This POC includes developer-owned previews before formal tooling exists:

- `pnpm storybook:qa` starts the real Storybook component playground on port
  `4400`.
- `/qa` contains a Zeroheight preview that models published documentation.
- `/qa` contains a Style Dictionary preview that models token browsing and
  PrimeNG mapping documentation.
- `/qa` contains an Agile planning view that models sprint work, blockers, LOE,
  time spent, next stories, and acceptance gates. When `agile-api` is running,
  this view reads from Postgres through `http://localhost:3333/api/agile/dashboard`
  and shows seed sync/report status.

## Source Of Truth

Code remains the runnable source of truth for this sample:

- `packages/tokens/src/tokens/*.json` owns the token source model.
- `packages/tokens/src/tokens.css` is generated from token JSON and owns CSS
  variables plus PrimeNG fallback tokens.
- `packages/tokens/src/zeroheight-tokens.json` is generated for Zeroheight token
  publishing.
- `packages/primeng-preset` maps those tokens into PrimeNG styled mode.
- `/qa` is the visual checkpoint route for theme and component coverage.
- `apps/agile-api` exposes the persisted Agile workflow through OpenAPI.
- `apps/agile-api/prisma/seed-data/agile-workflow.seed.json` is the portable
  Agile seed artifact kept current by API writes.
- `pnpm verify:fed` checks dev ports and accessibility across shell-composed routes.

Documentation should explain and validate these contracts. It should not fork
token values or invent a second design system outside the repo.

