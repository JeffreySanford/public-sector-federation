# PrimeNG Federation Contract

This workspace demonstrates an Angular shell that composes independently bootstrapped
web-component remotes while keeping one public-sector visual language.

## Runtime Shape

The shell is the only application users open directly during local development:

- Shell: `http://localhost:4200`
- Citizen Services remote: `http://localhost:4201`
- Reporting remote: `http://localhost:4202`
- Admin remote: `http://localhost:4203`
- QA remote: `http://localhost:4204`

The shell reads `module-federation.manifest.JSON`, loads each remote bundle, and
mounts the registered custom element:

```JSON
{
  "services": {
    "remoteEntry": "http://localhost:4201/main.js",
    "elementName": "public-services-root"
  }
}
```

Use one owner for dev servers. Start all apps from one terminal with:

```bash
pnpm start:all
```

Then validate the running ports with:

```bash
pnpm check:dev-ports
```

Avoid starting duplicate shell or remote servers in separate terminals, because
stale bundles on `4201`-`4204` can make the shell appear blank or out of date.

## Design-System Contract

The design system has three layers:

- `packages/tokens` owns primitive, semantic, and fallback PrimeNG CSS variables.
- `packages/PrimeNG-preset` maps tokens into PrimeNG styled mode and exports
  `providePublicSectorPrimeNG()`.
- Shell and remotes import token CSS from their global styles and bootstrap the
  same PrimeNG provider.

Every independently bootstrapped Angular app must call:

```ts
import { providePublicSectorPrimeNG } from '@public-sector/PrimeNG-preset';

createApplication({
  providers: [providePublicSectorPrimeNG()],
});
```

Do not call raw `providePrimeNG()` in a shell or remote. The shared provider is
the contract for theme preset, dark-mode selector, PassThrough metadata, z-index,
overlay policy, and token fallbacks.

## PrimeNG Federation Guidance

PrimeNG does not publish a dedicated micro-frontend federation guide. In this
sample, the important operational rule is that PrimeNG configuration does not
cross Angular application boundaries. Every custom-element remote is its own
Angular application and must register the same provider.

Observed anti-patterns in this workspace:

- Rendering PrimeNG hosts before their styled token variables are available can
  leave components structurally present but visually empty.
- Depending on remote-only PrimeNG hosts or shared wrappers for route-critical
  content can make a route appear blank if that remote fails to initialize those
  components.
- Running stale dev servers can load an older remote bundle even when source files
  and builds are correct.

Current mitigation:

- Stable route shells use semantic token CSS and native controls where reliability
  matters.
- PrimeNG is reintroduced selectively after direct-remote and shell-composed
  checks pass.
- `packages/tokens/src/tokens.CSS` includes baseline `--p-*` fallbacks so
  component variables exist even if runtime theme generation is delayed.

## PrimeNG Reintroduction Plan

Bring PrimeNG components back one family at a time:

1. Add the component to the direct remote first, such as `http://localhost:4201`.
2. Confirm the component renders real internal DOM, not only a raw `<p-card>` or
   `<p-tag>` host.
3. Confirm the same route renders through the shell, such as
   `http://localhost:4200/services`.
4. Run `pnpm verify:fed`.
5. Move the pattern into a shared wrapper only after the direct and shell checks
   both pass.

Verified safe smoke tests in `/qa`:

- `p-tag`
- outlined `p-button`
- `p-table`
- `p-dialog` opened from a stable native trigger
- isolated `p-card`

Rules for the next reintroduction steps:

- Prefer outlined `p-button` first; filled PrimeNG buttons need explicit contrast
  validation across all theme modes.
- `p-card` can render successfully, but do not use it as the only route-critical
  page wrapper until the route has stable fallback content.
- Delay shared wrappers that import PrimeNG hosts until the raw component passes
  direct-remote and shell-composed checks.
- Run `pnpm verify:fed` after every family is reintroduced.

## QA Route

`/qa` is the visual contract route. It should stay useful even while PrimeNG
component experiments are in progress.

It covers:

- Theme matrix for neutral, vibrant, and pastel variants.
- Form controls, focus rings, and validation-like messaging.
- Navigation and timeline patterns.
- Data display tables, progress, meter, and feedback surfaces.
- Overlay/action stand-ins and empty states.

Before changing tokens, confirm `/qa` renders in both:

```bash
http://localhost:4204
http://localhost:4200/qa
```

## Verification Checklist

Run these checks after token, route, or remote-loading changes:

```bash
pnpm check:dev-ports
pnpm test:a11y
```

Or run both together:

```bash
pnpm verify:fed
```

Manual checks:

- Shell is running on `4200`.
- Services, reporting, admin, and QA remotes are running on `4201`-`4204`.
- `/services` shows eligibility, guidance notes, case queue, and timeline.
- `/admin` opens a centered dialog overlay and the password field does not clip.
- `/qa` shows the full component and token coverage dashboard.
- Neutral, vibrant, and pastel variants work in light and dark mode.
- Keyboard focus is visible on links, buttons, inputs, selects, and checkboxes.

