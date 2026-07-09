# Platform Reporting

This document defines the current local operating model for platform startup,
Agile workflow persistence, seed synchronization, and executive/lead developer
progress evidence.

## Current Operating Model

| Area | Owner | Runtime |
| --- | --- | --- |
| Frontend shell and remotes | Local Nx dev servers | `4200-4204` |
| Agile API | Docker container | `3333` |
| Postgres | Docker container | `5432` |
| Agile seed artifact | Repo file mounted into API container | `apps/agile-api/prisma/seed-data/agile-workflow.seed.json` |
| Progress reports | Generated repo artifacts | `docs/reports/agile-progress` |

`pnpm start:all` owns the local platform startup flow:

1. Run Docker/API/DB preflight through `scripts/ensure-platform.mjs`.
2. Start or rebuild `postgres` and `agile-api` only when needed.
3. Verify `http://localhost:3333/api/health`.
4. Start the frontend shell and remotes locally.

Use lower-level scripts when needed:

```bash
pnpm start:backend
pnpm start:frontend
pnpm check:platform
pnpm docker:logs
pnpm docker:down
```

## Docker Dirty Checks

The preflight checks:

- Docker CLI is available.
- Docker Compose config is valid.
- `public-sector-agile-postgres` is running and healthy.
- `public-sector-agile-api` is running.
- The API image is not stale compared with API, Compose, Prisma, package, and
  lockfile sources.
- `GET /api/health` returns API and database OK.

The script may rebuild/restart backend containers when source changed or health
checks fail. It does not delete Postgres volumes.

## Agile Data Contract

Agile workflow data is stored in Postgres and exposed through the NestJS API.
The portable seed artifact is kept current by API writes.

Key endpoints:

```text
GET  /api/agile/dashboard
GET  /api/agile/kanban
GET  /api/agile/report
GET  /api/agile/export
GET  /api/agile/export/status
POST /api/agile/export/seed-file
```

OpenAPI:

```text
http://localhost:3333/api/docs
http://localhost:3333/api/docs-json
```

Seed sync rules:

- The database is the live source while the API is running.
- API create/update/delete operations rewrite
  `apps/agile-api/prisma/seed-data/agile-workflow.seed.json`.
- The seed file is mounted into Docker so writes persist to the host workspace.
- `GET /api/agile/export/status` reports whether database and seed artifact
  match.
- `POST /api/agile/export/seed-file` forces a seed file rewrite.

## Executive And Lead Developer Reports

Generate progress artifacts with:

```bash
pnpm agile:report
```

Outputs:

```text
docs/reports/agile-progress/latest/agile-progress.json
docs/reports/agile-progress/latest/agile-progress.md
docs/reports/agile-progress/latest/agile-progress.html
docs/reports/agile-progress/<timestamp>/
```

The report includes:

- Completed work.
- Current status.
- Work left.
- Blockers and mitigations.
- Time spent by story and workstream.
- Next stories through Kanban grouping.
- Acceptance gates and recommendations.

## Playwright Screenshots

Playwright is the preferred screenshot path because it makes progress evidence
repeatable: same routes, viewport, theme modes, and filenames.

Generate screenshots with:

```bash
pnpm screenshots:progress
```

Outputs:

```text
docs/reports/agile-progress/latest/screenshots/
```

Captured views:

- Shell home.
- Citizen Services.
- Reporting.
- Admin.
- QA workbench.
- QA Agile report.
- QA Agile report across neutral, vibrant, and pastel in light/dark modes.

Run `pnpm agile:report` after screenshots if you want the HTML/Markdown report to
link to the latest images.

## Zeroheight Export Package

Package tokens, page markdown, Agile reports, and screenshots for Zeroheight
upload or an API publish bridge:

```bash
pnpm zeroheight:export
```

Outputs:

```text
docs/reports/zeroheight/latest/
docs/reports/zeroheight/<timestamp>/
```

Package contents:

- `pages/` — Markdown mapped to Zeroheight sections (Home, Foundations,
  Components, Patterns, Developer Guide, Governance).
- `tokens/` — Generated Style Dictionary exports (`zeroheight-tokens.json`,
  `tokens.css`, source JSON, component overrides).
- `reports/agile-progress/` — Latest Agile JSON, Markdown, HTML, and screenshots.
- `manifest.json` — Upload metadata for manual import or API bridge publishing.

The export runs `pnpm build:tokens` first so token artifacts are current.

## Full Review And Publish Workflow

Run the full evidence and packaging pipeline before executive review or Zeroheight
upload:

```bash
pnpm report:all
```

This runs, in order:

1. `pnpm verify:fed`
2. `pnpm screenshots:progress`
3. `pnpm agile:report`
4. `pnpm zeroheight:export`

When a Zeroheight publish bridge is configured, publish after packaging:

```bash
pnpm report:publish
```

Or publish an existing package only:

```bash
pnpm zeroheight:publish
```

Publish bridge environment variables:

```bash
ZEROHEIGHT_PUBLISH_ENDPOINT=...
ZEROHEIGHT_CLIENT_ID=...
ZEROHEIGHT_ACCESS_TOKEN=...
ZEROHEIGHT_DRY_RUN=false
```

When `ZEROHEIGHT_PUBLISH_ENDPOINT` is unset, `pnpm zeroheight:publish` completes
as a dry run and writes `docs/reports/zeroheight/latest/publish-result.json`.

## Review Workflow

Before executive or lead developer review:

```bash
pnpm start:all
pnpm verify:fed
pnpm screenshots:progress
pnpm agile:report
```

Then open:

```text
docs/reports/agile-progress/latest/agile-progress.html
```

This gives a single review artifact with the latest persisted Agile data and
visual evidence from the running federated application.
