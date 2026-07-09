# Component Coverage Matrix

This matrix tracks which PrimeNG component families are proven in `/qa`, active
in real shell-composed remotes, or still risky in the federated Angular Elements
runtime. Use it to choose the next component family to reintroduce.

## Status Definitions

- `Proven`: renders correctly in `/qa`, direct remote, and shell-composed route,
  with `pnpm verify:fed` passing.
- `Active`: used in a real remote and verified, but still needs broader state or
  theme coverage before becoming a shared wrapper.
- `Smoke`: appears in `/qa` as an isolated test, but is not broadly adopted in
  route-critical content.
- `Native fallback`: represented by token-styled native markup because PrimeNG
  runtime behavior is not yet reliable for that route.
- `Risky`: previously rendered as raw or blank hosts, or depends on projection,
  overlay, or lifecycle behavior that needs isolation before adoption.

## PrimeNG Family Matrix

| PrimeNG family | `/qa` coverage | Real remote coverage | Current status | Risk | Reintroduction guidance |
| --- | --- | --- | --- | --- | --- |
| Button | Acceptance checkpoint with default and long-label stress states | Shell samples, admin/reporting actions | Proven | Low | Safe for action hierarchy across remotes. Validate filled contrast before broad use. |
| Tag | Acceptance checkpoint with severity and long-label stress states | Reporting status tags and remote labels | Proven | Low | Safe for status labels when semantic severity colors pass contrast. |
| Card | Acceptance checkpoint with metric, long-content, and empty states | Reporting metric/content cards | Proven | Medium | Use inside stable route content. Do not make `p-card` the only visible route wrapper. |
| Table | Acceptance checkpoint with sort, filter, paginate, loading, and empty states | Reporting program performance table | Proven | Medium | Good candidate for shared wrapper work after Sprint 2 form controls. |
| Paginator | Covered through acceptance and reporting tables | Reporting rows-per-page and page links | Proven | Low | Keep current-page report and visible rows selector. Validate dropdown overlay after theme changes. |
| Column filter | Covered through acceptance and reporting tables | Reporting text and numeric filters | Active | Medium | Proven with table family; add Storybook examples before using in additional remotes. |
| Sort icons | Covered through acceptance and reporting tables | Reporting sortable columns | Active | Low | Safe with table usage. Verify keyboard and screen-reader behavior as coverage expands. |
| ProgressBar | Native/progress in `/qa`; PrimeNG in reporting | Reporting operational indicators | Active | Medium | Keep ARIA cleanup check. Do not add unlabeled progress bars. |
| Accordion | Native disclosure in `/qa`; PrimeNG in reporting | Reporting report notes | Active | Low | Safe for supporting content. Avoid excessive borders and validate focus style. |
| Dialog | Acceptance checkpoint with appendTo body and long-content stress | Admin settings dialog | Proven | Medium | Use native or stable triggers. Keep `appendTo="body"` and z-index guidance. |
| Toast | Acceptance checkpoint with success, warn, and error severities | Admin save feedback | Proven | Medium | Safe for feedback surfaces after `/qa` and shell-composed validation. |
| Password | Not covered in `/qa` | Admin credential field | Active | Medium | Needs Storybook coverage for placeholder, reveal icon, disabled, invalid, and long labels. |
| ToggleSwitch | Not covered in `/qa` | Admin settings toggles | Active | Medium | Needs explicit label coverage and theme verification before reuse. |
| InputText | Native fallback in `/qa` and services | Not broadly reintroduced | Native fallback | Medium | Reintroduce in `/qa` first, then services direct remote, then shell route. |
| Select | Native fallback in `/qa` and services | Paginator dropdown only | Native fallback | Medium | Reintroduce as form control separately from paginator. Validate overlay clipping. |
| DatePicker | Removed from services | None | Risky | High | Reintroduce only after simpler form controls pass direct and shell checks. |
| Steps | Native fallback in `/qa` and services | None | Native fallback | Medium | Reintroduce after button/tag/table work is stable. Verify route-critical rendering. |
| Timeline | Native fallback in `/qa` and services | None | Native fallback | Medium | Reintroduce as supporting content, not the only visible route content. |
| Menu | Not currently central | None | Unproven | Medium | Add `/qa` smoke test first, then evaluate shell navigation needs. |
| Chart | Planned only | None | Unproven | Medium | Keep behind `/qa` or Storybook until Chart.js theme and contrast behavior is documented. |
| MeterGroup | Removed from `/qa` experiments | None | Unproven | Medium | Reintroduce only if it adds value beyond native meter/progress examples. |
| MultiSelect | Removed from `/qa` experiments | None | Risky | High | Wait until Select and overlay behavior are proven. |

## Recommended Reintroduction Order

1. Sprint 2 form controls in `/qa`: `InputText`, `Select`, checkbox, and radio.
2. Move proven form controls into Citizen Services direct remote.
3. Confirm the same controls through the shell `/services` route.
4. Revisit higher-risk overlay/form components: `DatePicker`, `MultiSelect`,
   menus, and advanced filters.
5. Promote passing families into shared wrappers only after direct and shell checks.

## Decision Rules

- A component is not `Proven` just because the Angular build passes.
- A component must render meaningful internal DOM, not only a raw PrimeNG host.
- Route-critical content needs a stable native/token-styled fallback until the
  PrimeNG family is proven in direct and shell-composed routes.
- Shared wrappers should come after direct component use is proven, not before.
- Run `pnpm verify:fed` after changing any component family, token mapping, or
  remote route that participates in this matrix.

## Sprint 1 Blockers

| Blocker | Owner | Affected families | Mitigation | Next action |
| --- | --- | --- | --- | --- |
| Blank/raw hosts | Design system | Card, forms, route-critical wrappers | Use stable native content first; promote only after direct and shell checks. | Start Sprint 2 form controls in `/qa` before Citizen Services promotion. |
| Overlay clipping | Platform | Dialog, Select, DatePicker, MultiSelect, Menu | Require `appendTo="body"` evidence and shell-composed validation. | Validate Select overlay in `/qa` during Sprint 2. |
| Missing stress states | Design system | Table, forms, toast, dialog | Add Storybook acceptance stories before reuse. | Complete for Sprint 1 proven families; extend to form controls in Sprint 2. |
| Manual token source | Tokens | All tokenized families | Generate CSS and docs artifacts from one JSON source. | Resolved. Keep `pnpm build:tokens` in report workflow. |
| Form controls not reintroduced | Services team | Citizen Services | Reintroduce InputText and Select in `/qa`, then direct remote, then shell route. | Begin Sprint 2 with `/qa` form-control acceptance stories. |

Last updated after Sprint 1 promotion of Button, Tag, Card, Table, Paginator, Dialog, and Toast.
