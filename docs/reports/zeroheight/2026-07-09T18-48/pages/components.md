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
| Button | Smoke with outlined `p-button` | Shell samples, admin/reporting actions | Active | Low | Continue using for non-critical actions. Validate filled contrast before broad use. |
| Tag | Smoke with `p-tag` | Reporting status tags and remote labels | Active | Low | Safe for status labels when semantic severity colors pass contrast. |
| Card | Isolated smoke only | Reporting metric/content cards | Active | Medium | Use inside stable route content. Do not make `p-card` the only visible route wrapper. |
| Table | Smoke plus reporting table | Reporting program performance table | Proven in reporting | Medium | Good next candidate for Storybook states: empty, loading, filtered, dense, long text. |
| Paginator | Covered through reporting table | Reporting rows-per-page and page links | Proven in reporting | Low | Keep current-page report and visible rows selector. Validate dropdown overlay after theme changes. |
| Column filter | Covered through reporting table | Reporting text and numeric filters | Active | Medium | Add Storybook examples before using in additional remotes. |
| Sort icons | Covered through reporting table | Reporting sortable columns | Active | Low | Safe with table usage. Verify keyboard and screen-reader behavior as coverage expands. |
| ProgressBar | Native/progress in `/qa`; PrimeNG in reporting | Reporting operational indicators | Active | Medium | Keep ARIA cleanup check. Do not add unlabeled progress bars. |
| Accordion | Native disclosure in `/qa`; PrimeNG in reporting | Reporting report notes | Active | Low | Safe for supporting content. Avoid excessive borders and validate focus style. |
| Dialog | Smoke overlay in `/qa` | Admin settings dialog | Proven with native trigger | Medium | Use native or stable triggers. Keep `appendTo="body"` and z-index guidance. |
| Toast | Not currently central in `/qa` | Admin save feedback | Active | Medium | Add `/qa` or Storybook coverage for severity variants before expanding. |
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

1. Finish low-risk table family hardening: table empty state, loading state,
   dense rows, long labels, and filter reset.
2. Add Storybook coverage for buttons, tags, cards, table, dialog, and toast.
3. Reintroduce simple form controls in `/qa`: `InputText`, `Select`, checkbox,
   and radio.
4. Move proven form controls into Citizen Services direct remote.
5. Confirm the same controls through the shell `/services` route.
6. Revisit higher-risk overlay/form components: `DatePicker`, `MultiSelect`,
   menus, and advanced filters.

## Decision Rules

- A component is not `Proven` just because the Angular build passes.
- A component must render meaningful internal DOM, not only a raw PrimeNG host.
- Route-critical content needs a stable native/token-styled fallback until the
  PrimeNG family is proven in direct and shell-composed routes.
- Shared wrappers should come after direct component use is proven, not before.
- Run `pnpm verify:fed` after changing any component family, token mapping, or
  remote route that participates in this matrix.

## Sprint 1 Blockers

Track blockers here before promoting a family:

| Blocker | Families | Matrix action |
| --- | --- | --- |
| Blank/raw hosts | Card, forms, route-critical wrappers | Keep status at `Watch` or `Risky` until direct and shell checks pass. |
| Overlay clipping | Dialog, Select, DatePicker, MultiSelect, Menu | Require `appendTo="body"` evidence and shell-composed validation. |
| Missing stress states | Table, forms, toast, dialog | Add Storybook acceptance stories before reuse. |
| Manual token source | All tokenized families | Do not call tokens generated until Style Dictionary source exists. |

