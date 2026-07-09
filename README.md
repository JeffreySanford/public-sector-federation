# Public Sector Federation

Angular module federation sample using web components, Nx, PrimeNG styled theming, and token-driven design-system packages.

## Architecture

- `packages/tokens` contains public-sector design tokens and CSS variable output.
- `packages/primeng-preset` maps tokens into PrimeNG styled mode and exports `providePublicSectorPrimeNG()`.
- `apps/shell` loads remote web components through module federation.
- `apps/services-remote` exposes `<public-services-root>`.
- `apps/reporting-remote` exposes `<public-reporting-root>`.
- `apps/admin-remote` exposes `<public-admin-root>`.

## Install

```bash
pnpm install
```

## Nx Commands

```bash
pnpm run nx show projects
pnpm run graph
pnpm run typecheck
pnpm run build
pnpm run guard:scss
```

## Local Federation

Run the shell and remotes on separate ports:

```bash
pnpm run serve:services
pnpm run serve:reporting
pnpm run serve:admin
pnpm run serve:shell
```

Open `http://localhost:4200`.

## PrimeNG Provider Contract

Every app must import the shared provider from the preset package:

```ts
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
```

Do not configure `providePrimeNG()` directly in shell or remotes.

## Current Note

This workspace was scaffolded manually because the terminal bridge did not execute the interactive Nx generator in this Windows environment. The file layout, package names, and Nx project metadata are set up for Nx hydration with `pnpm install`.
