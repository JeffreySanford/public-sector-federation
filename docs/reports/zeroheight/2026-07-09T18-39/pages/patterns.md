# App Inventory

This is the starting point for design-system documentation. It records what each
federated app owns, which PrimeNG/component patterns it exercises, and where
design-system changes should be validated.

## Where This Lives

Keep the inventory in this repo at:

```text
docs/design-system/app-inventory.md
```

Zeroheight can publish a user-friendly version of this inventory, but this file
is the working source because it stays close to the shell, remotes, tokens, and
verification scripts.

## Local Runtime Inventory

| App | Port | Route | Element | Status | Owner | Role |
| --- | --- | --- | --- | --- | --- | --- |
| Shell | `4200` | `/` | Angular app | Active | Platform | Composes remotes, owns navigation, theme switching, and runtime manifest loading. |
| Citizen Services | `4201` | `/services` | `public-services-root` | Active | Services team | Proves service intake, eligibility review, forms, guidance, queue, and timeline patterns. |
| Reporting | `4202` | `/reporting` | `public-reporting-root` | Active | Reporting team | Proves cards, metrics, progress indicators, paginated/sortable/filterable tables, and report notes. |
| Administration | `4203` | `/admin` | `public-admin-root` | Active | Admin team | Proves administrative actions, password input, toggle settings, dialogs, overlays, and toasts. |
| QA Components | `4204` | `/qa` | `public-qa-root` | Active | Design system | Visual contract route for theme, component family, and PrimeNG smoke-test coverage. |

Use `Owner` as the team responsible for keeping the route representative. It
does not need to be a person until this sample becomes a real delivery model.

## Design-System Coverage

### Shell

- Source path: `apps/shell`.
- Runtime check: `http://localhost:4200`.
- Owns neutral, vibrant, and pastel theme selection.
- Owns light/dark mode switching through `.p-dark`.
- Loads remotes from `module-federation.manifest.json`.
- Validates that independently deployed remotes share one visual language.
- Current gaps: no route-level inventory page in the UI and no visual indicator
  for stale remote bundles.
- Validate before release:
  - Navigation links route to all active remotes.
  - Theme variant changes affect shell and mounted remotes.
  - Dark mode toggles `.p-dark` and preserves contrast.
  - `pnpm check:dev-ports` reports shell and all remotes as healthy.

### Citizen Services

- Source path: `apps/services-remote`.
- Runtime checks: `http://localhost:4201` and `http://localhost:4200/services`.
- Primary coverage: service workflow patterns.
- Design-system focus: labels, form spacing, validation-like messaging, status
  chips, eligibility evidence, and stable route-critical content.
- Current guidance: use token-styled native markup for critical content and
  reintroduce PrimeNG components only after direct remote and shell checks pass.
- Current component coverage:
  - Native/token-styled form controls.
  - Native/token-styled case table.
  - Native/token-styled timeline.
  - Status chips and action buttons using semantic tokens.
- Current gaps:
  - PrimeNG form controls are not yet reintroduced for route-critical content.
  - Needs Storybook examples for service intake and eligibility review patterns.
  - Needs Zeroheight guidance for evidence cards and case-review status language.
- Validate before release:
  - Eligibility review content renders beyond the route header.
  - Form labels and helper text remain visible in all themes.
  - Status chip colors pass contrast in neutral, vibrant, and pastel modes.
  - Direct remote and shell-composed route both render the same content.

### Reporting

- Source path: `apps/reporting-remote`.
- Runtime checks: `http://localhost:4202` and `http://localhost:4200/reporting`.
- Primary coverage: operational dashboards.
- Design-system focus: metrics, progress bars, datatables, sorting, filtering,
  pagination, current-page report, status tags, and accordions.
- Current PrimeNG coverage: `p-card`, `p-progressbar`, `p-table`, `p-tag`, and
  `p-accordion`.
- Current component coverage:
  - Metric cards.
  - Progress indicators with accessible labels.
  - Paginated, sortable, filterable data table.
  - Rows-per-page selector with `5`, `10`, and `25` options.
  - Report notes accordion.
- Current gaps:
  - Needs Storybook stories for datatable density, empty state, and filter state.
  - Needs Zeroheight guidance for table pagination, sorting, and status wording.
  - Export action is visual only in the sample.
- Validate before release:
  - Table sorts by program, cases, status, region, SLA, and owner.
  - Global search and column filters narrow visible rows.
  - Paginator shows current range and rows-per-page options.
  - Progress bars do not expose invalid ARIA attributes.

### Administration

- Source path: `apps/admin-remote`.
- Runtime checks: `http://localhost:4203` and `http://localhost:4200/admin`.
- Primary coverage: administrative settings and actions.
- Design-system focus: icon/label spacing, form controls, password input,
  dialogs, toast feedback, z-index behavior, and overlay contrast.
- Current PrimeNG coverage: password, toggle switch, dialog, toast, and related
  action controls.
- Current component coverage:
  - Password input with icon spacing.
  - Toggle settings.
  - Dialog overlay appended above shell content.
  - Toast feedback with token-styled message surfaces.
  - Administrative action buttons.
- Current gaps:
  - Needs Storybook stories for dialog, toast, password, and toggle states.
  - Needs Zeroheight guidance for destructive/admin actions.
  - Needs a clearer distinction between saved, pending, and risky settings.
- Validate before release:
  - Dialog opens as an overlay, not inline content.
  - Toast appears styled and readable in all themes.
  - Password input does not clip placeholder text or icon controls.
  - Icon and label spacing is consistent across action buttons.

### QA Components

- Source path: `apps/qa-remote`.
- Runtime checks: `http://localhost:4204` and `http://localhost:4200/qa`.
- Primary coverage: visual regression and component readiness.
- Design-system focus: theme matrix, form controls, data display, feedback,
  overlays, navigation patterns, empty states, and PrimeNG smoke tests.
- Current rule: `/qa` should stay useful even when individual PrimeNG experiments
  are being added or removed.
- Current component coverage:
  - Token-styled forms, tables, steps, timeline, progress, meter, messages, and
    empty states.
  - PrimeNG acceptance checkpoints for Button/Tag, Card, Table/Paginator, and
    Dialog/Toast.
  - Theme coverage for neutral, vibrant, and pastel modes.
  - API-backed Agile reporting with static fallback when Docker is offline.
- Current gaps:
  - Needs a visual section for each PrimeNG family as it is reintroduced.
  - Needs form-control acceptance stories before Citizen Services reintroduction.
  - Needs executive screenshots regenerated before review sessions.
- Validate before release:
  - `/qa` renders useful content even if a PrimeNG experiment fails.
  - Theme variants and dark mode keep visible contrast.
  - PrimeNG smoke-test components render internal DOM, not raw host shells.
  - Agile report shows whether data comes from Postgres or static fallback.
  - `pnpm test:a11y` passes across all configured routes and themes.

## Component Coverage Matrix

See [Component Coverage Matrix](./component-coverage-matrix.md) for the detailed
PrimeNG family-by-family reintroduction guide.

| Pattern | Shell | Services | Reporting | Admin | QA | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Theme switching | Active | Consumes | Consumes | Consumes | Consumes | Proven |
| Native/token-styled forms | - | Active | - | - | Active | Proven |
| PrimeNG buttons/tags | Smoke | Limited | Active | Active | Smoke | Watch |
| PrimeNG cards | Smoke | Avoid critical wrapper | Active | - | Smoke | Watch |
| PrimeNG datatable | - | - | Active | - | Smoke | Proven in reporting |
| PrimeNG overlays/dialogs | - | - | - | Active | Smoke | Proven with native trigger |
| Toast feedback | - | - | - | Active | - | Proven in admin |
| Progress indicators | - | Native/progress | Active | - | Native/progress | Proven with ARIA check |
| Accordion/disclosure | - | Native details | Active | - | Native details | Proven |

Status meanings:

- `Proven`: implemented and verified in shell-composed routes.
- `Watch`: usable, but should be checked carefully before becoming a shared
  wrapper or route-critical dependency.
- `Avoid critical wrapper`: do not make this component the only visible route
  content until direct remote and shell-composed checks pass.

## Tool Publishing Targets

This inventory should publish outward as follows:

- Zeroheight: publish a reader-friendly app inventory, coverage summary, release
  status, and generated Agile progress reports from `pnpm zeroheight:export`.
- Storybook: create stories for each active pattern and each gap promoted to
  implementation work.
- Figma: mirror app-level patterns as design review frames and handoff specs.
- Platform Reporting: run `pnpm report:all` to generate Markdown, HTML, JSON,
  screenshots, and a Zeroheight upload package for executive and lead developer
  review.

## Inventory Update Rules

Update this file when:

- A new shell route or remote app is added.
- A remote changes its design-system responsibility.
- A PrimeNG component family is reintroduced or removed.
- A new visual contract route or QA checkpoint is created.
- Runtime ports, custom element names, or route paths change.

After app inventory changes that reflect runtime behavior, run:

```bash
pnpm report:all
```

