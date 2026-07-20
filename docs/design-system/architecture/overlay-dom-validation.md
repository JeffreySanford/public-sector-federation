# Overlay DOM Validation

## Purpose

PrimeNG overlays can leave the remote component tree and append to `body`.
Because the platform mounts remotes as Web Components, overlay validation must
prove that theme variables live high enough in the document for those overlays
to inherit the active token contract.

## Current Proof

The shell Playwright token spec validates:

- Shell and mounted remote resolve the same `--ps-*` and `--p-*` variables.
- Theme changes update the shell and mounted Component Lab.
- Dialog overlay surfaces resolve root PrimeNG variables.
- Menu, select, popover, and tooltip overlays append directly under `body`.
- Menu, select, popover, and tooltip overlays resolve root `--ps-*` and `--p-*`
  variables in both light and dark modes.

Primary evidence:

- `apps/qa-remote/src/remote/qa-remote.component.html`
- `apps/shell/e2e/token-consumption.spec.ts`

## Wrapper Coverage

The Component Lab route opens overlays through strict `@public-sector/ui-patterns`
wrappers:

| Wrapper | PrimeNG internal | App-facing contract |
| --- | --- | --- |
| `ps-menu` | `p-menu` with `appendTo="body"` | Design-system action list. |
| `ps-select` | `p-select` with `appendTo="body"` | Label, options, value, placeholder. |
| `ps-popover` | `p-popover` with `appendTo="body"` | Trigger label plus projected content. |
| `ps-tooltip` | `pTooltip` with `appendTo="body"` | Trigger label, help text, position. |

Apps and remotes should not set PrimeNG append targets directly. The wrapper
owns that detail so the registry can keep overlay behavior consistent if the
component provider changes.

## Failure Modes To Watch

| Failure mode | Risk | Proof that catches it |
| --- | --- | --- |
| Overlay appends inside a remote host. | Z-index and clipping differ by remote layout. | Parent tag assertion. |
| Theme class or root variables are missing. | Body overlays keep stale theme values. | Light/dark token comparison. |
| Wrapper exposes PrimeNG append APIs. | Apps fork provider behavior. | Boundary lint and API review. |
| Overlay relies on app selectors. | Styles fail across Web Component boundaries. | Computed token assertions. |

## Verification Command

```bash
pnpm nx run shell:e2e -- --project=chromium apps/shell/e2e/token-consumption.spec.ts
```

For the wider quality gate, run:

```bash
pnpm lint
pnpm nx run qa-remote:typecheck
pnpm nx run shell:e2e
```
