# Agile Workflow

The POC uses `/qa` as a lightweight Agile planning surface for the design-system
workbench. The goal is to break PrimeNG reintroduction, token work, and docs into
sprint-sized increments with visible blockers and done criteria.

## Persistence Workflow

Sprint stories, blockers, acceptance checks, and time entries are persisted in
Postgres through the Dockerized Agile API. See
[Platform Reporting](./platform-reporting.md) for the full operating model.

| Surface | Purpose | Location |
| --- | --- | --- |
| Postgres | Stores sprint stories, blockers, acceptance checks, and time entries. | `docker-compose.yml` |
| NestJS API | Exposes DTO-backed CRUD, dashboard, Kanban, health, and OpenAPI endpoints. | `apps/agile-api` |
| Prisma | Owns the database schema, migration, and seed script. | `apps/agile-api/prisma` |
| `/qa` Agile view | Reads `GET /api/agile/dashboard` when available and falls back to static data. | `apps/qa-remote` |
| Reports | Exports executive/lead Markdown, HTML, JSON, and screenshots. | `docs/reports/agile-progress` |

Local commands:

```bash
pnpm start:all
pnpm check:platform
pnpm report:all
pnpm agile:report
pnpm screenshots:progress
pnpm zeroheight:export
```

`pnpm start:all` starts/checks Docker API and DB first, then starts shell and
remotes locally. When using Docker Compose, the `agile-api` service runs
migration and seed before starting the API. OpenAPI is available at:

```text
http://localhost:3333/api/docs
http://localhost:3333/api/docs-json
```

The database can be recreated from
`apps/agile-api/prisma/seed-data/agile-workflow.seed.json`. API writes keep that
seed artifact current; `GET /api/agile/export/status` reports whether the
database and seed file match. Treat volume deletion as destructive; use it only
when you intentionally want a clean local workflow state.

## Review Exports

Before executive or lead developer review, run:

```bash
pnpm report:all
```

Or run the steps individually:

```bash
pnpm verify:fed
pnpm screenshots:progress
pnpm agile:report
pnpm zeroheight:export
```

Open:

```text
docs/reports/agile-progress/latest/agile-progress.html
docs/reports/zeroheight/latest/
```

The export includes completed work, current status, work left, blockers, time
spent, next stories, recommendations, Playwright screenshots, and a Zeroheight
upload package.

## How We Will Use It

- Track design-system work by workstream, sprint, level of effort, blockers, and
  definition of done.
- Track time spent by work item so sprint planning can compare estimated LOE with
  actual effort.
- Track next stories through Kanban statuses: backlog, next, in progress,
  blocked, review, and done.
- Keep Storybook stories, `/qa` visual checks, and `pnpm verify:fed` as acceptance
  gates.
- Use the component coverage matrix to decide what enters a sprint.
- Keep route-critical PrimeNG adoption behind direct-remote and shell-composed
  validation.

## Initial Sprint Shape

| Sprint | Focus | Done when |
| --- | --- | --- |
| Sprint 1 | Harden proven PrimeNG families and token mappings | Storybook, `/qa`, and `pnpm verify:fed` pass for selected families. |
| Sprint 2 | Reintroduce simple PrimeNG form controls into Citizen Services | Direct remote and shell-composed `/services` route both render stable content. |
| Sprint 3 | Generate Style Dictionary token artifacts | CSS variables and Zeroheight export JSON come from the same token source. |

## Retrofit Roadmap

| Day | Focus | Output |
| --- | --- | --- |
| Day 1 | Inventory current app | Foundations, components, patterns, states, inconsistencies. |
| Day 2 | Token map v1 | Semantic token list and PrimeNG mapping candidates. |
| Day 3 | Figma foundations | Variables, modes, and first component frames. |
| Day 4 | Storybook proof | PrimeNG stories for core component families. |
| Day 5 | Zeroheight skeleton | Portal structure with Storybook/Figma/token references. |
| Day 6 | Developer onboarding | How to consume preset, tokens, stories, and verification checks. |
| Day 7 | Demo and next plan | Working demo plus Sprint 2 backlog and blockers. |

## Sprint 1 Scope

| Item | Includes | LOE | Acceptance |
| --- | --- | --- | --- |
| Harden proven PrimeNG families | Button, Tag, Card, Table, Paginator, Dialog, Toast | Medium | Storybook acceptance checks exist and `/qa` remains green. |
| Create Storybook acceptance checks | Default, theme, a11y, stress, federation, and promotion checks | Small | Acceptance table is visible in Storybook guidance and `/qa`. |
| Track blockers in the matrix | Blank hosts, overlay clipping, token generation, route-critical fallback risk | Small | Each blocker has owner, affected family, mitigation, and next action. |
| Prepare Style Dictionary source | Token tier model and initial semantic-to-PrimeNG mappings | Medium | Token browser displays source-backed token rows. |

## Storybook Acceptance Checks

| Check | Evidence | Gate |
| --- | --- | --- |
| Default state | Component renders with real PrimeNG internals and public-sector tokens. | Storybook story visible and no raw/blank host. |
| Theme matrix | Neutral, vibrant, pastel, light, and dark are exercised. | Visual check plus `pnpm verify:fed` after promotion to `/qa`. |
| Accessibility | Labels, keyboard focus, and contrast are explicit. | A11y addon review and route-level axe pass. |
| Stress state | Long text, empty data, loading state, or invalid state exists. | Story includes at least one non-happy-path state. |
| Federation readiness | Candidate is verified directly and through shell composition. | Direct remote and shell route both render stable content. |
| Promotion decision | Component matrix status is updated after validation. | Status moves to `Active` or `Proven` with notes. |

## Blocker Tracking

| Blocker | Affected | Mitigation | Owner |
| --- | --- | --- | --- |
| Blank/raw PrimeNG hosts | Card, forms, route-critical wrappers | Use stable native content first; promote only after direct and shell checks. | Design system |
| Overlay clipping and z-index | Dialog, Select, DatePicker, MultiSelect, Menu | Prefer `appendTo="body"` and verify in shell-composed routes. | Platform |
| Manual token source | Style Dictionary and Zeroheight export | Create token JSON and generate CSS plus docs artifacts from one source. | Tokens |
| Form controls not reintroduced | Citizen Services | Reintroduce InputText and Select in `/qa`, then direct remote, then shell route. | Services team |

## LOE Scale

- `Small`: documentation, styling, or one isolated component state.
- `Medium`: a component family with Storybook and `/qa` coverage.
- `Large`: a real remote route change with PrimeNG reintroduction and federation
  verification.

