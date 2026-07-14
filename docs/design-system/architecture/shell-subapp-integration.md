# Shell And Subapp Integration

This records how the learning repo currently wires the shell to its mounted
subapplications. Use it as the sample shape to compare against the enterprise
repository.

## Current Sample Shape

| Category | Projects |
| --- | --- |
| Shell-composed remotes | services, reporting, admin, QA |
| Non-remotes | shell, agile-api, playground |

Do not add a synthetic legacy app to this repo yet. The current value is proving
the target-state path with the four existing remotes. Real migrated legacy apps
should be validated when the enterprise repository has a concrete path to
allowlist and migrate.

## Remote Entry Configuration Path

The active shell path is:

```text
module-federation.manifest.json
  -> copied into the shell build by apps/shell/project.json assets
  -> fetched at /module-federation.manifest.json by apps/shell/src/app/remote-manifest.ts
  -> remoteEntry loaded as a module script
  -> elementName rendered by apps/shell/src/app/remote-host.component.ts
```

Current manifest entries:

| Remote key | Dev URL | Custom element |
| --- | --- | --- |
| services | `http://localhost:4201/main.js` | `public-services-root` |
| reporting | `http://localhost:4202/main.js` | `public-reporting-root` |
| admin | `http://localhost:4203/main.js` | `public-admin-root` |
| qa | `http://localhost:4204/main.js` | `public-qa-root` |

Routes in `apps/shell/src/app/app.routes.ts` map `/services`, `/reporting`,
`/admin`, and `/qa` to `RemoteHostComponent`. The host reads the route remote
key, asks `remote-manifest.ts` to load the entry, and appends the configured
custom element into the shell.

There is also an older `apps/shell/src/shell/remote-registry.ts` path with
three hard-coded remotes and `remoteEntry.js` URLs. It is not the current
four-remote route path. Treat it as cleanup risk unless the enterprise repo uses
that implementation style intentionally.

## Token CSS Load Path

The shell imports runtime token CSS from:

```css
@import "../../../packages/tokens/src/tokens.css";
```

Current imports:

| Project | Token CSS load path |
| --- | --- |
| shell | `apps/shell/src/styles.css` |
| services-remote | `apps/services-remote/src/styles.css` |
| reporting-remote | `apps/reporting-remote/src/styles.css` |
| admin-remote | `apps/admin-remote/src/styles.css` |
| qa-remote | `apps/qa-remote/src/styles.css` |
| playground | `apps/playground/src/styles.css` |

The shell still owns the composed theme context by registering
`providePublicSectorPrimeNG()` and toggling theme state on `html`. Remote style
imports keep isolated remote development and Storybook aligned with the same
runtime contract.

## PrimeNG Provider Registration

Every shell-composed remote registers the approved provider in its independent
Angular bootstrap:

| Project | Bootstrap file | Provider |
| --- | --- | --- |
| services-remote | `apps/services-remote/src/main.ts` | `providePublicSectorPrimeNG()` |
| reporting-remote | `apps/reporting-remote/src/main.ts` | `providePublicSectorPrimeNG()` |
| admin-remote | `apps/admin-remote/src/main.ts` | `providePublicSectorPrimeNG()` |
| qa-remote | `apps/qa-remote/src/main.ts` | `providePublicSectorPrimeNG()` |
| shell | `apps/shell/src/app/app.config.ts` | `providePublicSectorPrimeNG()` |

The remote apps create custom elements with Angular Elements. The mounted custom
elements are light-DOM hosts, so CSS variables from `html` and `:root` remain
the runtime styling contract for remotes and body-appended overlays.

## Version Alignment

This learning repo uses workspace packages and path mappings:

| Package | Current version | Alignment mechanism |
| --- | --- | --- |
| `@public-sector/tokens` | `0.1.0` | workspace package plus `tsconfig.base.json` path |
| `@public-sector/primeng-preset` | `0.1.0` | workspace package plus `tsconfig.base.json` path |
| `@public-sector/ui-patterns` | `0.1.0` | workspace package plus `tsconfig.base.json` path |

Production validation still needs explicit checks for package publishing,
dependency ranges, lockfile behavior, and federation sharing so shell and
remotes cannot silently drift across token, preset, and registry versions.
