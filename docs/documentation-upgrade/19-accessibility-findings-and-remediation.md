# Accessibility Findings and Remediation

_Last aligned: July 19, 2026_

## Purpose

The typed `componentFindings` registry in `packages/ui-patterns/src/manifest/component-registry.ts` is the operational source for finding identifiers, category, severity, status, affected components, and evidence paths. This page provides the human-readable accessibility rationale and remediation detail.

This register turns accessibility coverage status into actionable findings. It distinguishes confirmed implementation gaps, code-review observations, verification tasks, automated results, and manual assistive-technology evidence.

An automated axe result is evidence for tested states; it is not a conformance claim.

## Severity vocabulary

| Severity | Meaning |
| --- | --- |
| Critical | Prevents completion of a core task for affected users. |
| Serious | Creates a major barrier that requires assistance or a substantial workaround. |
| Moderate | Causes meaningful difficulty but has a practical workaround. |
| Minor | Produces limited impact or usability degradation. |

Severity describes user impact in the tested context. WCAG relationships are recorded only when the evidence supports them.

## Finding lifecycle

`observed → reproduced → classified → planned → implemented → verified → resolved`

A finding cannot be marked resolved without linked verification. Manual review cannot be marked complete without an environment-specific review record.

## Initial findings register

| ID | Component | Finding | Severity | Evidence type | Status |
| --- | --- | --- | --- | --- | --- |
| A11Y-DLG-001 | Dialog | Background content becomes inert while the modal is open | Serious | Storybook Playwright verification | Verified |
| A11Y-DLG-002 | Dialog | Body scrolling is locked while the modal is open | Moderate | Storybook Playwright verification | Verified |
| A11Y-DLG-003 | Dialog | The description input supplies an `aria-describedby` relationship | Moderate | Storybook Playwright verification | Verified |
| A11Y-DLG-004 | Dialog | Stacked or nested dialog behavior is undefined | Moderate | Documented limitation | Investigate |
| A11Y-SEL-001 | Select | Disabled options suppress selection and expose `aria-disabled` | Serious | Storybook Playwright verification | Verified |
| A11Y-SEL-002 | Select | Required, invalid, help, and error relationships use a provider-neutral contract | Serious | Storybook Playwright verification | Verified |
| A11Y-BTN-001 | Button | Stable Button keyboard activation and focus behavior have dedicated automated evidence | Moderate evidence risk | Storybook Playwright verification | Verified |
| A11Y-BTN-002 | Button | Loading exposes busy semantics and suppresses repeated activation; manual announcement verification remains pending | Serious pending manual review | Storybook Playwright verification | Implemented |
| A11Y-SYS-001 | Flagship components | Manual screen-reader reviews are not recorded | Serious evidence gap | Manifest review | Open |
| A11Y-SYS-002 | Flagship components | Automated forced-colors checks preserve visible boundaries and focus | Moderate evidence risk | Storybook Playwright verification | Verified |

“Pending reproduction” means severity is provisional until behavior is observed in the declared browser and assistive-technology environment.

The initial provisional Select finding was reproduced and remediated. PrimeNG prevents a disabled
option from changing the model but exposes the state only through provider metadata. The governed
wrapper now mirrors that state to `aria-disabled`, with Storybook browser verification retaining
the provider behavior and public accessibility contract.

## Remediation records

### A11Y-DLG-001 — Background inertness

**Expected contract:** While a modal dialog is active, users should not navigate to or operate background content.

**Implemented condition:** The wrapper makes every sibling branch outside the active Dialog host
inert, preserving each branch's previous inert state. Closing or destroying the Dialog restores
those values and the opener's focus. The same lifecycle locks and restores body scrolling.

**Next action:**

1. Retain the isolated Storybook checks for inert background state, scroll lock, and restoration.
2. Keep nested Dialogs unsupported until a stack-aware isolation manager is intentionally designed.
3. Verify virtual-cursor isolation in the pending NVDA and Chrome review.
4. Reopen the finding if application integration exposes a sibling or portal boundary not covered by the host walk.

### A11Y-SEL-001 — Disabled-option semantics

**Expected contract:** A disabled option must remain unavailable for selection and expose that
state programmatically.

**Implemented condition:** The wrapper retains PrimeNG's selection suppression and mirrors its
rendered `data-p-disabled` state to `aria-disabled` on each listbox option. The provider-specific
DOM translation remains private to `ps-select`.

**Next action:**

1. Retain the disabled-option Storybook contract for state, selection suppression, and ARIA.
2. Verify disabled-option announcement in the pending NVDA and Chrome review.
3. Remove the compatibility synchronization if a future PrimeNG release supplies equivalent semantics.

### A11Y-SEL-002 — Validation relationships

**Expected contract:** Required and invalid states must be communicated programmatically, and help or error text must be associated with the control.

**Implemented condition:** The public Select API exposes `required`, `invalid`, `helpText`,
`errorText`, and `fieldId`. The wrapper maintains `aria-required`, `aria-invalid`, and ordered
`aria-describedby` references on the rendered provider combobox without exposing provider types.

**Next action:**

1. Keep the required-with-help and invalid-with-error stories in the canonical Select suite.
2. Retain automated relationship verification in the Storybook Playwright contract.
3. Verify announcements during the pending NVDA and Chrome review.
4. Reopen this finding if the provider changes its rendered combobox structure.

### A11Y-BTN-002 — Loading behavior

**Expected contract:** Loading prevents duplicate activation without erasing the meaningful accessible name or leaving the state unexplained.

**Automated evidence:** The stable Button interaction harness verifies pointer, Enter, and Space activation; one event per input; preserved accessible naming; visible focus; disabled state; `aria-busy`; and zero activation while loading.

**Remaining action:**

1. Perform the loading flow with NVDA and Chrome.
2. Record whether the busy-state change is announced sufficiently.
3. Add API or live-region remediation only if manual evidence identifies a gap.

## Manual review matrix

| Component | Keyboard-only | NVDA + Chrome | Zoom/reflow | Forced colors | Status |
| --- | --- | --- | --- | --- | --- |
| Button | Required | Required | Required | Required | Pending |
| Select | Required | Required | Required | Required | Pending |
| Dialog | Required | Required | Required | Required | Pending |

Automated evidence now covers 320 CSS-pixel reflow for all three flagship documentation pages
and forced-colors boundaries and focus indicators in their isolated Storybook contracts. These
checks reduce regression risk but do not satisfy the environment-specific manual review below.

The NVDA setup steps, direct Storybook story URLs, per-component checklists, and the fillable
review-record template live in
[nvda-manual-accessibility-review.md](../design-system/validation/nvda-manual-accessibility-review.md).
Completed review records are appended there; once a record exists for a component, update its
manifest `accessibility.screenReaderAudit` status from `pending` and update the matrix above.

Each review record must include:

- reviewer;
- date;
- operating system;
- browser and version;
- assistive technology and version;
- story ID or route;
- steps;
- expected and actual result;
- findings;
- follow-up links.

## Release and promotion rules

- Critical or serious regressions in supported states block promotion.
- Known exceptions require an identifier, owner or sample steward, rationale, and review date.
- Automated checks cannot satisfy manual-review requirements.
- A stable interactive component without a documented keyboard contract requires an explicit exception.
- A finding is not resolved merely because documentation describes it.

## Completion criteria

- [ ] Flagship manual reviews are recorded.
- [x] Provisional findings are reproduced and classified; stable Button automated findings are classified.
- [ ] Confirmed findings link to implementation or a documented decision.
- [x] Implemented and verified findings link to automated verification; manual verification remains separately identified where required.
- [x] The manifest references finding identifiers; last-review records remain pending.
- [ ] Starlight exposes open risks without presenting them as generic quality badges.
