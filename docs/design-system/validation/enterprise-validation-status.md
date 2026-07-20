# Enterprise Validation Prep

This records what the learning repo already proves and what still requires
access to the real enterprise repository, screenshots, package names,
environment config, and ownership data.

## Current Answer

The current repo confirms the target-state mechanics. It does not confirm the
enterprise production implementation.

Use this as the evidence package to take into enterprise validation, not as a
claim that production paths have already been inspected.

Status: pending until enterprise machine access is available next Tuesday.

## Validation Items

Shell token CSS load path:

- Sample status: confirmed in sample only.
- Evidence: `apps/shell/src/styles.css` imports
  `packages/tokens/src/tokens.css`.
- Enterprise status: pending production shell access.

Remote token strategy:

- Sample status: confirmed as both direct import and inheritance.
- Evidence: each remote imports `tokens.css`; shell-mounted remotes also
  inherit root CSS variables.
- Enterprise status: pending production remote access.

Theme propagation contract:

- Sample status: confirmed in sample.
- Evidence: `PublicSectorThemeService` toggles `.p-dark` and `ps-theme-*`
  classes on `document.documentElement`.
- Enterprise status: pending production theme implementation review.

Per-remote PrimeNG provider setup:

- Sample status: confirmed in sample.
- Evidence: shell and each remote register `providePublicSectorPrimeNG()`.
- Enterprise status: pending production bootstrap review.

Token package version alignment:

- Sample status: confirmed in sample workspace only.
- Evidence: `tokens`, `primeng-preset`, and `ui-patterns` are workspace
  packages at `0.1.0`.
- Enterprise status: pending production package, lockfile, and federation
  sharing review.

Sanitized `up-design-system` reconciliation:

- Sample status: partially confirmed.
- Evidence: docs mark it as outdated, sanitized, prototype guidance only.
- Enterprise status: pending real screenshots, names, package paths, and
  component prefix review.

## Confirmed Sample Details

Shell token CSS:

```text
apps/shell/src/styles.css
  -> @import "../../../packages/tokens/src/tokens.css";
```

Remote token CSS:

```text
apps/services-remote/src/styles.css
apps/reporting-remote/src/styles.css
apps/admin-remote/src/styles.css
apps/qa-remote/src/styles.css
  -> @import "../../../packages/tokens/src/tokens.css";
```

Provider setup:

```text
apps/shell/src/app/app.config.ts
apps/services-remote/src/main.ts
apps/reporting-remote/src/main.ts
apps/admin-remote/src/main.ts
apps/qa-remote/src/main.ts
apps/qa-remote/.storybook/preview.ts
  -> providePublicSectorPrimeNG()
```

Theme propagation:

```text
packages/primeng-preset/src/provider.ts
  -> PrimeNG darkModeSelector: ".p-dark"

packages/primeng-preset/src/theme.ts
  -> toggles .p-dark on document.documentElement
  -> toggles ps-theme-vibrant and ps-theme-pastel on document.documentElement
```

Token build output:

```text
pnpm build:tokens
  -> packages generated tokens.css, token-metadata.json, design-tokens.json,
     primitives, themes, metadata, and component override artifacts
```

## Enterprise Evidence Still Needed

- Production shell token CSS load path.
- Production remote token strategy: direct import, inheritance, or both.
- Production theme propagation contract and class or attribute names.
- Production per-remote provider setup or approved shared bootstrap helper.
- Published package names, versions, dependency ranges, lockfile behavior, and
  federation sharing rules for tokens, preset, and registry packages.
- Real screenshots, product names, component prefixes, package paths, and
  implementation names to reconcile the sanitized `up-design-system` notes.

## Recommendation

Treat these items as ready for enterprise review, not fully closed. The current
repo proves the desired shape and supplies concrete checks to run against the
production implementation.
