# Changelog

All notable changes to the public reference platform are documented here.

## Unreleased

### Added

- A governed `iconName` identifier on `ps-button`, absorbing the last piece of the target Button
  contract from the experimental candidate (see [button-api-migration.md](./docs/design-system/components/button-api-migration.md)).
- A manifest-generated component status table on the Starlight components page: all 21 public
  entries render live at build time directly from `component-manifest.json`, instead of relying
  only on hand-authored flagship prose.
- A manual NVDA accessibility review workflow and record template for Button, Select, and Dialog
  (see [nvda-manual-accessibility-review.md](./docs/design-system/validation/nvda-manual-accessibility-review.md)).
- `docs/archive/` for completed internal-process records that are historical rather than active
  reference material.
- Real unit-test execution for `qa-remote` and `ui-patterns` via `@angular/build:unit-test` with
  the Vitest runner, replacing a typecheck-only stub.

### Changed

- Renamed the experimental Button candidate's selector, class, exported types, and source/story
  file names from `ps-up-button` / `PublicUpButtonComponent` to `ps-button-candidate` /
  `PublicButtonCandidateComponent` throughout the manifest, Storybook, e2e suites, and docs, so the
  internal naming matches its public "Button Contract Exploration" label. Its long-term
  disposition is now recorded: retire it as a documented case study rather than merge it further.
- Renamed the remaining `Design System/Acceptance/*` Storybook categories (Card, Dialog Toast,
  Edge Case States, Table Paginator) to `Design System/Interaction Stories/*`, completing that
  rename across every story file.
- Migrated 6 PrimeNG `--p-*` CSS variables to their verified `--ps-*` semantic-token equivalents
  across 16 native/mixed components, after confirming each swap was an exact, value-identical
  alias via the PrimeNG preset source and live computed-style comparison in light and dark mode
  (see [token-boundary-remediation.md](./docs/design-system/backlog/token-boundary-remediation.md)
  for what remains open and why).
- Completed manifest public-API extraction for `ps-card`, `ps-tag`, `ps-toast`, and
  `public-toast-service`, which previously had empty `inputs`/`outputs` metadata despite real
  public APIs.
- Decided Starlight's scope explicitly: it stays a clean, designer-level documentation area and is
  not a mirror of the ~50 engineering reference docs under `docs/design-system/`, which remain
  GitHub-only reference material.

### Removed

- The third-party documentation platform referenced in the "Clarified" section below is now fully
  retired: its scripts, `package.json` entries, environment variables, generated token export, and
  all documentation prose have been removed from the repository (see
  [15 — Zeroheight retirement](./docs/documentation-upgrade/15-zeroheight-retirement-strategy.md)).
- Removed proprietary and confidential-adjacent content from documentation and source: internal
  local file paths, an internal design-system's naming and token comparisons, and mortgage-industry
  domain terminology used as illustrative examples, replaced with generic equivalents (see
  [POST-SCRUB-CHECKLIST.md](./docs/grok-tasks/POST-SCRUB-CHECKLIST.md) for the full record; a
  git-history rewrite to remove this material from prior commits has not been performed).
- Archived a completed internal PR-planning document
  (`docs/ui-refresh/remote-realignment-scrub-plan.md`) to `docs/archive/internal-process/`, since
  its content is historical rather than active reference material.

## 1.0.0 - 2026-07-17

### Added

- Recruiter- and reviewer-facing project entry points.
- A complete release verification command and a smaller running-platform smoke check.
- Public portfolio, architecture, test, and licensing guidance.
- Explicit documentation of component lifecycle and evidence states.
- Automated release-quality validation for pull requests and the default branch.

### Established

- Angular shell and independently bootstrapped federated Web Component remotes.
- Shared design-token, PrimeNG preset, and governed wrapper-package contracts.
- Storybook and Chromatic visual evidence.
- Playwright, accessibility, documentation, type, build, and manifest validation.
- NestJS, Prisma, and PostgreSQL backend reference implementation.

### Clarified

- Verified browser-execution results and performance baselines.
- The third-party documentation platform as documentation and governance output rather than runtime delivery (later fully retired; see [15 — Zeroheight retirement](./docs/documentation-upgrade/15-zeroheight-retirement-strategy.md)).
- Sample-repository evidence versus organization-specific production validation.

### Finalized

- Removed temporary documentation redirects and the duplicate compatibility story.
- Updated Storybook smoke tests to use canonical story identifiers and meaningful assertions.
- Aligned GitHub Actions with the verified release command and browser matrix.
