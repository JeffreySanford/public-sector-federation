# Table, Input, And Checkbox Wrapper Backlog

The remote realignment pass intentionally left native table, text input, and
checkbox or switch controls in place while `@public-sector/ui-patterns` did not
yet expose a provider-neutral wrapper. Phase 2 of the UI refresh closed this
gap: `ps-table`, `ps-input`, and `ps-checkbox` are implemented, documented in
the component manifest, and have replaced every native usage that carried a
`// GAP:` comment in `services-remote`, `admin-remote`, and `reporting-remote`.
For the originating story and historical context, see
[the remote realignment plan](../../archive/internal-process/remote-realignment-scrub-plan.md).

## Resolved Gaps

- `ps-table` (`packages/ui-patterns/src/public-table.component.ts`): sortable,
  responsive data display with a keyboard-focusable overflow region and a
  built-in empty state. Row content, status tags, and row actions remain
  consumer-authored via content projection.
- `ps-input` (`packages/ui-patterns/src/public-input.component.ts`): text,
  search, password, and date types with help text, invalid state, required
  state, and `aria-describedby` relationships.
- `ps-checkbox` (`packages/ui-patterns/src/public-checkbox.component.ts`):
  checkbox and switch variants with label, help text, disabled, invalid, and
  required states.

## Open follow-up

The original remote-realignment plan's "tiles" non-goal was never separately
scoped. This backlog tracks `ps-table`, `ps-input`, and `ps-checkbox` only; if a
shared tile or card-grid pattern is still needed, it should be captured as a
separate follow-up rather than assumed to be covered by existing `ps-card` or
`ps-status-card` usage.

## Tracking Rule

No `// GAP:` comments referencing this file remain in `apps/`. If a future
remote needs a native table, input, or checkbox control that these wrappers
cannot support, add a new `// GAP:` comment describing the specific
limitation rather than reopening this file's original scope.

## Acceptance Notes

- Storybook acceptance coverage: `apps/qa-remote/src/stories/table.stories.ts`,
  `input.stories.ts`, and `checkbox.stories.ts` cover default, disabled,
  invalid, required, long-label/long-content, and mobile-overflow states.
- Behavior evidence: `apps/qa-remote/e2e/table.storybook.spec.ts`,
  `input.storybook.spec.ts`, and `checkbox.storybook.spec.ts`.
- `lint:wrappers` (manifest validation and usage report) passes with all three
  components registered in `packages/ui-patterns/src/manifest/component-registry.ts`.
- Remaining known limitations: Figma property mapping and manual
  screen-reader review are still pending for all three components, matching
  the rest of the non-flagship component set.
