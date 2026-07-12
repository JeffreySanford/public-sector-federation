# Public Sector Federation

Public Sector Federation is a reference Angular workspace demonstrating module federation with independently bootstrapped remote web components, a shared PrimeNG theming contract, and a token-driven design system.

## What this repository is for

This repo is intended to show how one public-sector frontend platform can be composed from:

- a shell app that loads federated custom-element remotes
- independently running Angular remote apps for services, reporting, admin, QA, and playground
- a shared token design system in `packages/tokens`
- a PrimeNG theme preset in `packages/primeng-preset`
- a backend API in `apps/agile-api` backed by Prisma/Postgres

The shell uses `module-federation.manifest.json` to discover and mount remote bundles at runtime.

## Repository layout

- `apps/shell` - application shell that composes remote custom elements
- `apps/services-remote` - services remote exposing `<public-services-root>`
- `apps/reporting-remote` - reporting remote exposing `<public-reporting-root>`
- `apps/admin-remote` - admin remote exposing `<public-admin-root>`
- `apps/qa-remote` - QA route and component contract app
- `apps/playground` - local component playground
- `apps/agile-api` - NestJS backend API with Prisma and Docker support
- `packages/tokens` - design token source, CSS variables, and token exports
- `packages/primeng-preset` - shared PrimeNG provider and theme mapping
- `docs/` - documentation, design-system guidance, reports, and governance notes
- `scripts/` - helper scripts for platform checks, reports, and exports

## Prerequisites

- Node.js and `pnpm`
- Docker Desktop for the backend API and Postgres support
- Git for source control
- Optional: GitHub CLI for repository management

## Install

```bash
pnpm install
```

## Local development

Start the complete platform locally:

```bash
pnpm start:all
```

This command starts:

- the backend API and Postgres via Docker
- shell and remote frontend apps through Nx on ports `4200` to `4204`

Alternatively, start parts individually:

```bash
pnpm start:frontend
pnpm start:backend
```

Run frontend apps manually:

```bash
pnpm serve:shell
pnpm serve:services
pnpm serve:reporting
pnpm serve:admin
pnpm serve:qa
pnpm serve:playground
```

Open the shell at `http://localhost:4200`.

## Backend and database commands

```bash
pnpm docker:up
pnpm docker:down
pnpm docker:logs
pnpm serve:api
pnpm api:prisma:generate
pnpm api:migrate
pnpm api:seed
```

## Verification and maintenance

Common workspace commands:

```bash
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm graph
pnpm guard:scss
pnpm test:a11y
pnpm check:dev-ports
pnpm verify:fed
```

Reporting and documentation commands:

```bash
pnpm screenshots:progress
pnpm agile:report
pnpm zeroheight:export
pnpm zeroheight:publish
pnpm report:all
pnpm report:publish
```

## Testing

This repository includes comprehensive test coverage:

- **Unit Tests**: Linting, Prisma validation, Markdown formatting, JSON validation
- **E2E Tests**: 189 tests across Chromium, Firefox, and WebKit
  - 22 federation tests (shell + 4 remotes)
  - 21 Storybook tests (accessibility, keyboard navigation, performance)
  - 20 code example validation tests
- **Code Quality**: TypeScript type checking, SCSS pattern guards
- **Link Validation**: Markdown link checking with `pnpm lint:links`

**Quick start**:

```bash
# All checks (lint + unit tests)
pnpm lint && pnpm test

# E2E tests (requires running servers)
pnpm test:e2e

# Full documentation
pnpm docs TESTING.md
```

For detailed testing guide, see [TESTING.md](./docs/TESTING.md) and [PERFORMANCE_BASELINE.md](./docs/PERFORMANCE_BASELINE.md).

---

## Module federation and design-system contract

- Each remote is an independently bootstrapped Angular app.
- The shell composes remotes as custom elements using `module-federation.manifest.json`.
- `packages/tokens` provides shared semantic tokens and CSS variable fallbacks.
- `packages/primeng-preset` exposes `providePublicSectorPrimeNG()`.
- Every app that renders PrimeNG components must use this shared provider.
- Do not call raw `providePrimeNG()` directly in the shell or a remote.

Example provider import:

```ts
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
```

## Notes

- The QA route and `qa-remote` are intended as a stable visual contract surface for theme and component coverage.
- `pnpm verify:fed` is the recommended smoke-check command for shell composition and accessibility.
- This workspace is built for local exploration of module federation, platform composition, and design-system alignment.
