# Registry Consumption Spec

## Purpose

This spec explains how application and remote teams consume the component
registry while PrimeNG remains an internal provider behind wrappers.

The goal is not to justify wrapping. The goal is to show how a wrapper consumes
the shared token contract, maps public design-system API to provider internals,
and proves that apps do not need direct PrimeNG access.

## Import Boundary

New applications and target-state remotes should consume registry wrappers
only. Migrated legacy applications may keep existing PrimeNG usage temporarily
when that usage is inventoried, owned, and tracked as migration debt.

```text
apps and remotes
  -> @public-sector/ui-patterns
      -> @public-sector/primeng-preset
          -> @public-sector/tokens
      -> PrimeNG internals
```

Allowed responsibilities:

| Layer | May import | Responsibility |
| --- | --- | --- |
| Apps and remotes | `@public-sector/ui-patterns` | Render governed components and patterns. |
| `ui-patterns` | PrimeNG modules, token CSS variables | Own public wrapper APIs and provider mapping. |
| `primeng-preset` | `@public-sector/tokens`, PrimeNG theme APIs | Map token values into PrimeNG preset shape. |
| `tokens` | Token source files | Generate CSS variables, JSON, and TS metadata. |

Disallowed behavior for new subapps and target-state code:

- Importing `primeng/*` directly.
- Rendering `<p-*>` components directly.
- Using PrimeNG template directives directly.
- Styling app-level `.p-*` selectors.
- Passing PrimeNG-specific configuration objects through app contracts.

The boundary is enforced by `scripts/check-primeng-boundaries.mjs`, which is
part of `pnpm lint`. Legacy migrated paths can be listed in
`scripts/primeng-boundary-allowlist.json`; that should be a temporary
compatibility mechanism, not the default development path.

## Migration Compatibility

The target state is that shared component usage goes through
`@public-sector/ui-patterns`. The migration path is more flexible:

| App type | PrimeNG policy | Expected action |
| --- | --- | --- |
| New subapp | Use wrappers only. | Add or request wrappers before using PrimeNG behavior. |
| Active migrated legacy subapp | Existing direct PrimeNG may continue temporarily. | Track usage and migrate ad hoc. |
| Shared/platform code | Use wrappers only. | Keep the provider replacement boundary intact. |
| New feature inside legacy app | Prefer wrappers. | Use direct PrimeNG only as accepted migration debt. |

This means missing wrappers do not block a legacy app from functioning. They do
block promotion to the target state.

## Discovering Available Wrappers

Today, developers should discover available `ui-patterns` wrappers from four
places:

1. `docs/design-system/components/catalog.md`
   The component catalog is the easiest human-readable entry point. Start here
   when choosing a wrapper by use case.
2. `packages/ui-patterns/src/index.ts`
   The package barrel export is the current source of truth for what app and
   remote code may import.
3. `apps/qa-remote/src/stories`
   Storybook stories show available wrapper states and acceptance examples.
4. `docs/design-system/architecture/component-registry.md`
   Registry documentation explains lifecycle and evidence expectations.

Current exported wrappers and services:

| Export | Selector or usage | Notes |
| --- | --- | --- |
| `PublicButtonComponent` | `ps-button` | Strict PrimeNG button wrapper. |
| `PublicCardComponent` | `ps-card` | Card wrapper using content/card tokens. |
| `PublicDialogComponent` | `ps-dialog` | Dialog wrapper for modal content. |
| `PublicEmptyStateComponent` | `ps-empty-state` | Composite empty-state pattern. |
| `PublicFormSectionComponent` | `ps-form-section` | Form section/card pattern. |
| `PublicMenuComponent` | `ps-menu` | Menu overlay wrapper with body append policy. |
| `PublicPageHeaderComponent` | `ps-page-header` | Page title and action header. |
| `PublicPopoverComponent` | `ps-popover` | Popover overlay wrapper with projected content. |
| `PublicProgressComponent` | `ps-progress` | Progress indicator wrapper. |
| `PublicSkeletonComponent` | `ps-skeleton` | Loading skeleton wrapper. |
| `PublicSelectComponent` | `ps-select` | Select overlay wrapper with token inheritance proof. |
| `PublicStatusCardComponent` | `ps-status-card` | Status summary pattern. |
| `PublicTagComponent` | `ps-tag` | Status/tag wrapper. |
| `PublicTooltipComponent` | `ps-tooltip` | Tooltip wrapper with body append policy. |
| `PublicToastComponent` | `ps-toast` | Toast region component. |
| `PublicToastService` | injectable service | Toast message API. |

The future registry metadata file should make this list machine-readable, but
until that storage format is selected, the package barrel export plus Storybook
is the practical discovery path.

## Missing Pattern Path

If no available wrapper or pattern fits a new subapp need, the developer should
not drop directly to PrimeNG in app or remote code. The fallback path is:

1. Check whether native Angular/HTML plus existing tokens is sufficient.
   Simple layout, text, and one-off content composition may not need a PrimeNG
   wrapper.
2. If PrimeNG behavior is needed, create or request a wrapper inside
   `packages/ui-patterns`.
3. Keep the wrapper API in design-system language. Do not expose PrimeNG
   modules, event payloads, severity names, or `.p-*` selectors as app API.
4. Use semantic `--ps-*` variables or approved `--p-*` bridge variables rather
   than hardcoded visual values.
5. Add Storybook or shell-mounted evidence before treating the wrapper as
   broadly usable.
6. Run `pnpm lint` to prove target-state app/remotes still have no direct
   PrimeNG usage.

Decision guide:

| Need | Developer action |
| --- | --- |
| Simple markup or layout | Use native Angular/HTML with token variables. |
| Existing design-system component fits | Import from `@public-sector/ui-patterns`. |
| PrimeNG capability needed but not wrapped | Add a wrapper in `packages/ui-patterns`. |
| API shape is uncertain | Mark wrapper experimental and keep usage local. |
| Pattern is reusable across teams | Add Storybook evidence and lifecycle metadata. |
| Migrated legacy app already uses PrimeNG | Track exception and migrate ad hoc. |

This keeps delivery moving without weakening the provider boundary.

## Wrapper Anatomy

Each registry wrapper should make the provider boundary visible.

| Wrapper part | Public or internal | Example |
| --- | --- | --- |
| Selector | Public | `ps-button` |
| Inputs | Public | `label`, `tone`, `outlined`, `disabled`, `routerLink` |
| Outputs | Public | `buttonClick: MouseEvent` |
| Public types | Public | `PublicButtonTone` |
| PrimeNG module import | Internal | `ButtonModule` from `primeng/button` |
| PrimeNG input mapping | Internal | `tone="warning"` maps to PrimeNG `warn` |
| Token consumption | Internal | Uses PrimeNG preset and generated `--p-*` variables |
| Provider escape hatches | Avoid by default | Only add when governance approves a stable need |

Wrapper APIs should use design-system language. PrimeNG names can exist inside
the wrapper implementation, but they should not become application API.

## Token Resolution Model

Wrappers consume the token contract in two ways.

```text
tokens.css
  -> --ps-* semantic variables
  -> --p-* PrimeNG bridge variables
  -> wrapper CSS and PrimeNG styled mode

@public-sector/tokens
  -> @public-sector/primeng-preset
  -> PrimeNG provider setup
  -> PrimeNG component internals
```

Use CSS variables when the wrapper owns markup, layout, or composition. Use the
PrimeNG preset when the wrapped PrimeNG component owns internal structure,
states, or styled-mode token lookup.

Examples:

| Wrapper | Token path |
| --- | --- |
| `ps-button` | PrimeNG preset and `--p-button-*` variables. |
| `ps-card` | Wrapper CSS uses `--p-content-*`, `--p-text-*`, and card bridge tokens. |
| `ps-toast` | Wrapper CSS uses content variables and severity-specific status tokens. |

The registry should not duplicate token values. It should reference semantic
`--ps-*` variables or generated PrimeNG `--p-*` bridge variables.

## Button Walk-Through

`PublicButtonComponent` is the reference wrapper for the current strict model.

Application usage:

```html
<ps-button
  label="Submit"
  tone="primary"
  [loading]="isSaving"
  (buttonClick)="save()"
/>
```

Public wrapper contract:

- `label` controls visible button text.
- `tone` uses design-system language through `PublicButtonTone`.
- `outlined`, `text`, `disabled`, and `loading` expose approved button states.
- `routerLink` supports navigation without requiring app teams to handle
  PrimeNG click behavior.
- `buttonClick` emits a standard `MouseEvent`.

Internal provider mapping:

```text
PublicButtonTone.primary
  -> PrimeNG severity undefined
  -> --p-primary-color
  -> --p-button-primary-background
```

```text
PublicButtonTone.warning
  -> PrimeNG severity warn
```

```text
PublicButtonTone.error
  -> PrimeNG severity danger
```

The app sees `tone`, not PrimeNG severity rules. The wrapper owns the mapping,
so a future provider swap changes wrapper internals instead of app templates.

Evidence in this repo:

- Source:
  `packages/ui-patterns/src/public-button.component.ts`.
- Token bridge:
  `packages/tokens/src/tokens.css`.
- Preset:
  `packages/primeng-preset/src/preset.ts`.
- Boundary lint:
  `scripts/check-primeng-boundaries.mjs`.

## Registry Entry Shape

The registry entry should record contract and evidence, not token values.

```json
{
  "id": "ps-button",
  "package": "@public-sector/ui-patterns",
  "status": "active",
  "selector": "ps-button",
  "source": "packages/ui-patterns/src/public-button.component.ts",
  "publicApi": {
    "inputs": ["label", "tone", "outlined", "text", "disabled", "loading"],
    "outputs": ["buttonClick"],
    "types": ["PublicButtonTone"]
  },
  "provider": {
    "name": "PrimeNG",
    "modules": ["ButtonModule"],
    "internalOnly": true
  },
  "tokens": {
    "semantic": ["--ps-primary-background", "--ps-action-text"],
    "providerBridge": ["--p-primary-color", "--p-button-primary-background"]
  },
  "validation": {
    "lint": "pnpm lint",
    "typecheck": "pnpm --dir packages/ui-patterns typecheck",
    "storybook": "apps/qa-remote/e2e/storybook-stories.spec.ts"
  }
}
```

## Promotion Lifecycle

Lifecycle status should describe how much evidence exists and whether app teams
can depend on the wrapper.

| Status | Meaning | Required evidence |
| --- | --- | --- |
| Experimental | API may change. Use only for proof work. | Storybook state or local route proof. |
| Candidate | API shape is proposed. Ready for review. | Unit/typecheck plus token usage documented. |
| Active | Approved for app/remotes. | Lint, typecheck, Storybook, and shell proof. |
| Deprecated | Supported only for migration. | Replacement, migration note, and removal window. |

Promotion should be evidence-backed, not automatic. Starlight can document the
status after publishing is available, but it does not decide promotion by
itself.

## Verification Steps

- Run `pnpm lint` and confirm new or target-state app/remotes have no direct
  PrimeNG imports, `<p-*>` usage, PrimeNG directives, or app-level `.p-*`
  styling.
- For legacy migration paths, confirm direct PrimeNG usage appears only in
  `scripts/primeng-boundary-allowlist.json` paths and has a migration note.
- Run `pnpm --dir packages/ui-patterns typecheck` and confirm wrapper public
  APIs compile.
- Run `pnpm build:tokens` and confirm the token contract regenerates before
  wrapper evidence is captured.
- Confirm wrapper examples render in Storybook or the shell-mounted route.
- Record the wrapper status, token dependencies, and evidence links in the
  registry entry.

## Value

This gives you a plan for explaining how the registry consumes the contract:
new apps import wrappers, wrappers own provider mapping, the preset consumes
the same token package, and lint enforces the target-state boundary while still
allowing explicit legacy compatibility. That is the practical answer to "we
wrap PrimeNG always" because it shows how future replacement is contained
without pretending every legacy app can migrate in one pass.

Done when you can submit the wrapper consumption model with the import
boundary, one end-to-end wrapper example, lifecycle statuses, and proof commands
that show apps can use registry components without importing PrimeNG.
