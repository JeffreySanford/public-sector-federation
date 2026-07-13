# Token Consumption Strategy

Given the required federated Web Component architecture, design tokens should be
treated as a versioned runtime contract shared by the shell and each remote.
They should not be owned by Zeroheight, and they should not be treated as
shell-only styling.

## Recommendation

The source of truth should be a token package, or equivalent enterprise
artifact, in the design-system repository. That contract should generate runtime
CSS custom properties, documentation and tooling metadata, optional TypeScript
exports, and the PrimeNG preset mapping from the same values.

The shell or platform runtime should establish active theme context. Each
federated Web Component should be able to resolve the same token contract,
either through direct dependency for isolated development or through
shell-provided runtime context when mounted. That keeps the shell from becoming
the design-system owner while still giving remotes a reliable contract.

The component registry should consume the token contract and PrimeNG preset.
Registry components should wrap PrimeNG only when they add shared behavior,
accessibility, API consistency, or a reusable pattern. If the PrimeNG component
already works with the approved preset, direct PrimeNG usage is acceptable.

## Runtime Contract

```text
tokens package
  -> generated CSS variables
  -> PrimeNG preset
  -> component registry
  -> shell and federated Web Components
  -> Storybook / shell validation / Playwright evidence
  -> Zeroheight documentation
```

The shell and each remote should resolve the same semantic token names. Remotes
may inherit variables from the shell at runtime, but they should also be able to
load the token package directly for isolated development, Storybook, and remote
smoke testing.

## Validation Priorities

The main implementation risk is not federation itself. The risk is whether the
tokens actually resolve across the DOM boundaries used by the current Web
Components.

If remotes render in light DOM, global CSS variables and PrimeNG styles should
work naturally. If any remote uses Shadow DOM, CSS custom properties can still
inherit through the host, but selector-based styles and PrimeNG internals need
explicit validation.

PrimeNG overlays need separate validation because dialogs, dropdowns, menus, and
tooltips may render under `body` or another overlay container instead of inside
the remote host. Those overlays must receive the same token context or they can
visually drift from the shell and remote.

Zeroheight should document the token contract and evidence, but it should not
own runtime styling or subapplication configuration. `remoteEntry` remains
subapplication configuration.

## Evidence Model

Storybook should prove isolated behavior. Shell-mounted routes should prove
integrated behavior. Playwright should make the evidence repeatable. Zeroheight
should document approved usage, lifecycle status, token guidance, and evidence
links, but it should not be the runtime source of truth.

## Immediate Checks

- Confirm where token CSS is loaded today.
- Confirm whether each remote uses light DOM or Shadow DOM.
- Confirm how PrimeNG providers are registered per remote.
- Confirm where overlays are appended.
- Confirm each remote renders correctly both inside and outside the shell.
