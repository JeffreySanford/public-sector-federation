# Component Catalog

## Purpose

Use this catalog as the first stop when choosing a design-system wrapper or
pattern. Application and remote developers should check this page before
reaching for PrimeNG directly.

The current source of truth for importable APIs is still
`packages/ui-patterns/src/index.ts`. This catalog makes those exports easier to
scan and links each component to its implementation and evidence.

## Current Components

### Actions

- Use `PublicButtonComponent` / `ps-button` for primary, secondary, text,
  outlined, disabled, or loading actions.
- Source: `packages/ui-patterns/src/public-button.component.ts`.
- Evidence: `apps/qa-remote/src/stories/button-tag.acceptance.stories.ts`.

### Content Surfaces

- Use `PublicCardComponent` / `ps-card` for content surfaces and panels.
- Source: `packages/ui-patterns/src/public-card.component.ts`.
- Evidence: `apps/qa-remote/src/stories/card.acceptance.stories.ts`.

### Dialogs

- Use `PublicDialogComponent` / `ps-dialog` for modal interaction.
- Source: `packages/ui-patterns/src/public-dialog.component.ts`.
- Evidence: `apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts`.

### Empty States

- Use `PublicEmptyStateComponent` / `ps-empty-state` for empty or no-results
  states.
- Source: `packages/ui-patterns/src/public-empty-state.component.ts`.
- Evidence: source-level component proof.

### Forms

- Use `PublicFormSectionComponent` / `public-form-section` for form grouping.
- Source: `packages/ui-patterns/src/public-form-section.component.ts`.
- Evidence: source-level component proof.

### Page Headers

- Use `PublicPageHeaderComponent` / `public-page-header` for page heading and
  actions.
- Source: `packages/ui-patterns/src/public-page-header.component.ts`.
- Evidence: source-level component proof.

### Progress

- Use `PublicProgressComponent` / `ps-progress` for progress status.
- Source: `packages/ui-patterns/src/public-progress.component.ts`.
- Evidence: source-level component proof.

### Skeletons

- Use `PublicSkeletonComponent` / `ps-skeleton` for loading placeholders.
- Source: `packages/ui-patterns/src/public-skeleton.component.ts`.
- Evidence: source-level component proof.

### Status Summaries

- Use `PublicStatusCardComponent` / `public-status-card` for metric or status
  summaries.
- Source: `packages/ui-patterns/src/public-status-card.component.ts`.
- Evidence: source-level component proof.

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

Do not import PrimeNG directly in app or remote code.

Use this decision path:

| Situation | Action |
| --- | --- |
| Simple layout or markup | Use native Angular/HTML with token variables. |
| Existing wrapper is close enough | Use the wrapper and stay within its public API. |
| PrimeNG behavior is needed | Add or request a wrapper in `packages/ui-patterns`. |
| API shape is unclear | Mark the wrapper experimental and keep usage local. |
| Pattern should be shared | Add Storybook or shell evidence before promotion. |

## Future Improvement

The next lighter-weight improvement is a generated registry manifest or catalog
from wrapper metadata. That would let developers search by use case, selector,
status, evidence, and owner without reading source files.
