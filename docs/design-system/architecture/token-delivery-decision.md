# Token Delivery Decision

## Purpose

This decision records how tokens should reach the shell, federated remotes,
PrimeNG, and registry wrappers.

The architecture constraint is fixed: the shell mounts subapps as federated Web
Components. The decision here is how to deliver the token contract inside that
runtime.

## Recommendation

Use a shared, versioned token package as the source of runtime artifacts. The
shell establishes the active theme context, and remotes import the same token
package for isolated development, Storybook, and remote tests.

```text
Figma/DTCG-compatible token input
  -> token build package
  -> tokens.css, JSON metadata, TypeScript helpers, PrimeNG preset
  -> shell loads tokens and sets theme context
  -> remotes import tokens for isolated operation and inherit shell context
  -> registry wrappers consume the same CSS variables and PrimeNG preset
```

This is intentionally a combined model. Shell-only delivery is too brittle for
isolated remotes. Remote-only delivery risks drift in the integrated shell.

## Decision Matrix

| Delivery method | Recommendation | Why |
| --- | --- | --- |
| Shell-only global CSS | Do not use alone. | Remotes become dependent on shell runtime for local dev and Storybook. |
| Remote package import | Use as a required fallback. | Remotes can render and test independently. |
| Federation shared singleton | Use for version alignment. | Reduces token package drift. |
| Shell runtime theme context | Use for integrated theme state. | Shell owns route composition and theme choice. |

## Required Alignment

These versions and runtime settings must move together:

| Item | Why it must stay aligned |
| --- | --- |
| `@public-sector/tokens` version | Defines CSS variables, JSON metadata, and TS helpers. |
| `@public-sector/primeng-preset` version | Maps the same token values into PrimeNG styled mode. |
| `@public-sector/ui-patterns` version | Wraps PrimeNG and consumes the token contract. |
| Theme class or attribute | Drives active light/dark/theme mode across shell, remotes, and overlays. |
| PrimeNG provider setup | Ensures independently bootstrapped remotes use the approved preset. |

## Runtime Rules

- Load generated token CSS at the shell/platform boundary.
- Keep theme state on a shared ancestor such as `html`; current proof uses
  `html.p-dark`.
- Let remotes import the token package for isolated development and Storybook.
- Do not let remotes define competing token values.
- Register the approved PrimeNG provider/preset in every independently
  bootstrapped runtime unless a shared bootstrap layer proves it supplies one.
- Validate overlays separately because PrimeNG overlays append to `body`.

## What This Repo Proves

- `packages/tokens` generates `tokens.css`, `design-tokens.json`,
  `zeroheight-tokens.json`, and TypeScript token exports.
- `packages/primeng-preset` consumes `@public-sector/tokens`.
- `packages/ui-patterns` consumes the token contract through wrappers.
- Lint blocks direct PrimeNG usage from apps and remotes.
- Storybook e2e proves wrapper stories build and render.
- Shell e2e has existing token/theme and dialog overlay proof.

## Open Enterprise Checks

- Confirm the production Figma/DTCG-compatible export shape.
- Confirm production shell token CSS load path.
- Confirm whether remotes import tokens directly, inherit shell tokens, or both.
- Confirm package sharing/version strategy in production federation config.
- Expand overlay proof beyond dialog to menu, select, popover, and tooltip.

## Decision

Adopt the combined delivery model: a shared versioned token package, shell-owned
theme context, remote token imports for isolated operation, federation sharing
for alignment, and the same token contract feeding the PrimeNG preset and
registry wrappers.
