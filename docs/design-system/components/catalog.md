# Component Catalog

## Purpose

Use this catalog as the first stop when choosing a design-system wrapper or
pattern. New application and remote developers should check this page before
reaching for PrimeNG directly.

The current source of truth for importable APIs is
`packages/ui-patterns/src/index.ts`. The machine-readable registry is maintained in
`packages/ui-patterns/src/manifest/component-registry.ts`, validated by
`pnpm manifest:check`, and displayed in Storybook under
`Design System/Registry/Component Manifest`.

This catalog remains the concise human-readable discovery page. Lifecycle,
provider, accessibility, Figma, Zeroheight, ownership, and evidence status should
be updated in the registry rather than duplicated here. Starlight owns the full
public usage guidance for flagship components.

## Current Components

### Actions

- Use `PublicButtonComponent` / `ps-button` for primary, secondary, text,
  outlined, disabled, or loading actions.
- Source: `packages/ui-patterns/src/public-button.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/button.stories.ts`.
- Guidance: `apps/starlight/src/content/docs/components/button/index.mdx`.

- `PublicUpButtonComponent` / `ps-up-button` is a candidate action API and is not
  yet the stable replacement for `ps-button`.
- Source: `packages/ui-patterns/src/public-up-button.component.ts`.
- Evidence: `apps/qa-remote/src/stories/up-button.stories.ts`.

### Content Surfaces

- Use `PublicCardComponent` / `ps-card` for content surfaces and panels.
- Source: `packages/ui-patterns/src/public-card.component.ts`.
- Evidence: `apps/qa-remote/src/stories/card.acceptance.stories.ts`.

### Dialogs

- Use `PublicDialogComponent` / `ps-dialog` for a focused modal decision or compact task.
- The wrapper owns labelled modal semantics, initial focus, focus containment,
  Escape dismissal, and focus restoration; applications own meaningful content,
  validation, asynchronous operation status, and the decision outcome.
- Source: `packages/ui-patterns/src/public-dialog.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/dialog.stories.ts`.
- Behavior tests: `apps/qa-remote/e2e/dialog.storybook.spec.ts`.
- Guidance: `apps/starlight/src/content/docs/components/dialog/index.mdx`.

### Empty States

- Use `PublicEmptyStateComponent` / `ps-empty-state` for empty or no-results
  states.
- Source: `packages/ui-patterns/src/public-empty-state.component.ts`.
- Evidence: source-level component proof.

### Forms

- Use `PublicFormSectionComponent` / `ps-form-section` for form grouping.
- Source: `packages/ui-patterns/src/public-form-section.component.ts`.
- Evidence: source-level component proof.

- Use `PublicSelectComponent` / `ps-select` for one value from a known collection
  whose popup needs the shared body token context.
- Source: `packages/ui-patterns/src/public-select.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/select.stories.ts`.
- Behavior tests: `apps/qa-remote/e2e/select.storybook.spec.ts`.
- Guidance: `apps/starlight/src/content/docs/components/select/index.mdx`.

- Use `PublicInputComponent` / `ps-input` for text, search, password, and date
  entry with help text, invalid, and required states.
- Source: `packages/ui-patterns/src/public-input.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/input.stories.ts`.
- Behavior tests: `apps/qa-remote/e2e/input.storybook.spec.ts`.

- Use `PublicCheckboxComponent` / `ps-checkbox` for a checkbox or switch with
  help text, invalid, and required states.
- Source: `packages/ui-patterns/src/public-checkbox.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/checkbox.stories.ts`.
- Behavior tests: `apps/qa-remote/e2e/checkbox.storybook.spec.ts`.

### Menus And Popovers

- Use `PublicMenuComponent` / `ps-menu` for menu actions.
- Use `PublicPopoverComponent` / `ps-popover` for short contextual content.
- Use `PublicTooltipComponent` / `ps-tooltip` for help text.
- Source: `packages/ui-patterns/src/public-menu.component.ts`.
- Source: `packages/ui-patterns/src/public-popover.component.ts`.
- Source: `packages/ui-patterns/src/public-tooltip.component.ts`.
- Evidence: `apps/shell/e2e/token-consumption.spec.ts`.

### Page Headers

- Use `PublicPageHeaderComponent` / `ps-page-header` for page heading and
actions.
- Source: `packages/ui-patterns/src/public-page-header.component.ts`.
- Evidence: source-level component proof.

### Pagination

- Use `PublicPaginatorComponent` / `ps-paginator` for previous/next paging,
  current-page state, and rows-per-page selection.
- Source: `packages/ui-patterns/src/public-paginator.component.ts`.
- Evidence: source-level component proof; dedicated Storybook evidence is still
  tracked as missing in the manifest.

### Progress

- Use `PublicProgressComponent` / `ps-progress` for progress status.
- Source: `packages/ui-patterns/src/public-progress.component.ts`.
- Evidence: source-level component proof.

### Skeletons

- Use `PublicSkeletonComponent` / `ps-skeleton` for loading placeholders.
- Source: `packages/ui-patterns/src/public-skeleton.component.ts`.
- Evidence: source-level component proof.

### Status Summaries

- Use `PublicStatusCardComponent` / `ps-status-card` for metric or status
  summaries.
- Source: `packages/ui-patterns/src/public-status-card.component.ts`.
- Evidence: source-level component proof.

### Tables

- Use `PublicTableComponent` / `ps-table` for sortable, responsive data
  display. Row content, status tags, and row actions remain consumer-authored
  via content projection; the wrapper provides sortable headers, a
  keyboard-focusable overflow region, and a built-in empty state.
- Source: `packages/ui-patterns/src/public-table.component.ts`.
- Canonical evidence: `apps/qa-remote/src/stories/table.stories.ts`.
- Behavior tests: `apps/qa-remote/e2e/table.storybook.spec.ts`.

### Tags

- Use `PublicTagComponent` / `ps-tag` for status labels, badges, or tags.
- Source: `packages/ui-patterns/src/public-tag.component.ts`.
- Evidence: `apps/qa-remote/src/stories/button-tag.acceptance.stories.ts`.

### Toasts

- Use `PublicToastComponent` / `ps-toast` for the toast region.
- Use `PublicToastService` for toast messages.
- Source: `packages/ui-patterns/src/public-toast.component.ts`.
- Source: `packages/ui-patterns/src/public-toast.service.ts`.
- Evidence: `apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts`.

## If Nothing Fits

Do not import PrimeNG directly in new app or remote code.

Use this decision path:

| Situation | Action |
| --- | --- |
| Simple layout or markup | Use native Angular/HTML with token variables. |
| Existing wrapper is close enough | Use the wrapper and stay within its public API. |
| PrimeNG behavior is needed | Add or request a wrapper in `packages/ui-patterns`. |
| API shape is unclear | Mark the wrapper experimental and keep usage local. |
| Pattern should be shared | Add Storybook or shell evidence before promotion. |
| Migrated legacy app already uses PrimeNG | Keep it working, track the exception, migrate deliberately. |

Legacy compatibility is not the same as the target state. Existing PrimeNG in a
migrated app may continue temporarily, but new shared work should still move
toward a wrapper.

## Manifest Workflow

Run the following commands after adding or changing a public component:

```bash
pnpm manifest:check
pnpm manifest:build
pnpm build-storybook:qa
```

The registry deliberately records missing Storybook stories, incomplete public API
extraction, unassigned ownership, pending accessibility audits, pending Figma
bindings, and historical Zeroheight evidence. Missing information should be made
visible, not replaced with invented completion.

See `docs/design-system/architecture/component-manifest-prototype.md` for the
prototype architecture and update path.
