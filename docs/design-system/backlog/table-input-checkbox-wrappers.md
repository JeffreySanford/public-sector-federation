# Table, Input, And Checkbox Wrapper Backlog

The remote realignment pass intentionally leaves native table, text input, and
checkbox or switch controls in place where `@public-sector/ui-patterns` does not
yet expose a provider-neutral wrapper.

## Current Gaps

- `ps-table`: sortable, responsive data display with status content, empty state,
  row actions, and keyboard-friendly overflow behavior.
- `ps-input`: text, search, password, date, help text, invalid state, required
  state, and `aria-describedby` relationships.
- `ps-checkbox`: checkbox and switch variants with label, help text, disabled,
  invalid, and required states.

## Tracking Rule

Every remaining native usage in product remotes should include a nearby
`// GAP:` comment that references this file. The comments keep wrapper debt
greppable without forcing premature wrappers for components that do not yet have
an accepted public contract.

## Acceptance Notes

- Add wrappers only after the public API is documented in the component manifest.
- Include Storybook acceptance coverage for default, disabled, invalid, required,
  long-label, mobile reflow, and forced-colors states.
- Replace remote-native implementations only after `lint:wrappers`, unit tests,
  and E2E evidence pass for the new wrapper.
