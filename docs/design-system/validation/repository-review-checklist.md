# Repository Review Checklist

Use this checklist when production repository access is available. The goal is
to replace assumptions with verified implementation details.

![Repository validation map](../diagrams/repository-validation-map.png)

## Token Pipeline

- [ ] Identify the authoritative token package and source files.
- [ ] Identify generated runtime CSS, generated documentation JSON, and any
  derived TypeScript exports.
- [ ] Confirm generated artifacts are built from source files and not manually
  maintained copies.
- [ ] Confirm the PrimeNG preset maps from the same token source.
- [ ] Confirm publishing, package versioning, and dependency update process.
- [ ] Confirm how the shell loads generated token CSS.
- [ ] Confirm how remotes load or inherit the same token contract.
- [ ] Confirm runtime theme behavior and where theme state is represented.

## Component Registry

- [ ] Identify repository and package names.
- [ ] Confirm Angular and PrimeNG versions.
- [ ] Confirm wrapper strategy.
- [ ] Confirm existing component inventory.
- [ ] Confirm Storybook status.
- [ ] Confirm release pipeline.

## Shell And Subapplications

- [ ] Confirm remote-entry loading mechanism.
- [ ] Confirm Web Component mounting mechanism.
- [ ] Confirm router ownership.
- [ ] Confirm Angular dependency-sharing strategy.
- [ ] Confirm token package dependency-sharing strategy.
- [ ] Confirm failure and fallback behavior.
- [ ] Confirm whether custom elements are used.
- [ ] Confirm whether each custom element renders light DOM or Shadow DOM.

## Token Consumption Validation

### Evidence To Collect

- [ ] Record where `tokens.css` is imported by the shell.
- [ ] Record where `tokens.css` is imported by each remote.
- [ ] Record where the PrimeNG provider and preset are registered in the shell.
- [ ] Record where the PrimeNG provider and preset are registered in each
  independently bootstrapped remote.
- [ ] Record the federation sharing configuration for `@public-sector/tokens`
  and `@public-sector/primeng-preset`.
- [ ] Record whether each Web Component host has a shadow root at runtime.
- [ ] Record where PrimeNG overlays append, including dialogs, menus, selects,
  popovers, and tooltips.
- [ ] Record how Zeroheight receives generated token documentation artifacts.

### Pass Criteria

- [ ] The token package is the source of truth for runtime token values.
- [ ] TypeScript helpers are generated from or derived from generated token
  artifacts, not manually duplicated.
- [ ] Confirm where the shell loads generated token CSS.
- [ ] Confirm each remote imports the same token package or inherits the same
  token contract.
- [ ] Confirm each remote can render correctly inside the shell.
- [ ] Confirm each remote can render correctly outside the shell.
- [ ] Confirm token values resolve on `document.documentElement`.
- [ ] Confirm token values resolve inside a mounted remote.
- [ ] Confirm token values resolve on the Web Component host.
- [ ] Confirm token values resolve inside Shadow DOM if any remote uses Shadow
  DOM.
- [ ] Confirm PrimeNG provider registration for the shell and each
  independently bootstrapped remote.
- [ ] Confirm PrimeNG components resolve `--p-*` mapped variables from the same
  token source.
- [ ] Confirm PrimeNG overlay append targets and inherited token context.
- [ ] Confirm PrimeNG overlays render correctly in shell-mounted routes and
  isolated remote routes.
- [ ] Confirm theme switching updates shell and mounted remote token values.
- [ ] Confirm theme switching updates PrimeNG overlays.
- [ ] Confirm package versions cannot silently drift between shell and remotes.
- [ ] Confirm Zeroheight receives generated token/documentation artifacts, not
  runtime application CSS.

## Styling

- [ ] Locate global `.p-*` selectors.
- [ ] Locate `ViewEncapsulation.None` usage.
- [ ] Confirm overlay-container behavior.
- [ ] Confirm font-loading ownership.
- [ ] Confirm runtime theme behavior.
- [ ] Confirm CSS layer strategy if present.

## Governance

- [ ] Identify component owners.
- [ ] Confirm approval process.
- [ ] Confirm version visibility.
- [ ] Confirm deprecation policy.
- [ ] Confirm where release notes live.
- [ ] Confirm how documentation is kept aligned with implementation.
