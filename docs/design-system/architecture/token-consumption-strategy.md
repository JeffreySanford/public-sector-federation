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
Registry components should wrap PrimeNG because the component provider may be
swapped later. The remaining decision is how strict the wrapper API should be:
strict design-system API, thin normalized pass-through, or a tiered model.

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

Runtime evidence indicates remotes are federated Web Components rendered in
light DOM. The active theme class is applied on `html`, and root CSS variables
cascade naturally into mounted remote content.

Each remote bootstraps independently, so each remote needs the approved PrimeNG
provider and preset setup unless shared bootstrap code centralizes that setup.

PrimeNG overlays append to `body` in the observed runtime. Because token context
is rooted at `:root` and the theme class is on `html`, overlays should inherit
the same token and theme context. This should still be covered by integration
tests.

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
- Confirm the observed light DOM runtime in source and tests.
- Confirm how PrimeNG providers are registered per remote or shared bootstrap.
- Confirm overlays append to `body` and inherit root token context.
- Confirm each remote renders correctly both inside and outside the shell.
