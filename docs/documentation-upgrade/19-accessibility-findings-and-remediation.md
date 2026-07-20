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
| A11Y-DLG-001 | Dialog | Background content is not made inert while the modal is open | Serious | Source review and documented limitation | Open |
| A11Y-DLG-002 | Dialog | Explicit body scroll locking is not implemented | Moderate | Source review and documented limitation | Open |
| A11Y-DLG-003 | Dialog | The public API has no accessible-description relationship such as `aria-describedby` | Moderate | Source/API review and documented limitation | Open |
| A11Y-DLG-004 | Dialog | Stacked or nested dialog behavior is undefined | Moderate | Documented limitation | Investigate |
| A11Y-SEL-001 | Select | Disabled options suppress selection but omit `aria-disabled` | Serious | Storybook Playwright reproduction | Open |
| A11Y-SEL-002 | Select | Required, invalid, error-message, and help-text relationships are absent from the public contract | Serious | API and documentation review | Open |
| A11Y-BTN-001 | Button | Stable Button keyboard activation and focus behavior have dedicated automated evidence | Moderate evidence risk | Storybook Playwright verification | Verified |
| A11Y-BTN-002 | Button | Loading exposes busy semantics and suppresses repeated activation; manual announcement verification remains pending | Serious pending manual review | Storybook Playwright verification | Implemented |
| A11Y-SYS-001 | Flagship components | Manual screen-reader reviews are not recorded | Serious evidence gap | Manifest review | Open |
| A11Y-SYS-002 | Flagship components | Automated forced-colors checks preserve visible boundaries and focus | Moderate evidence risk | Storybook Playwright verification | Verified |

“Pending reproduction” means severity is provisional until behavior is observed in the declared browser and assistive-technology environment.

The initial provisional Select finding is now reproduced and classified. PrimeNG prevents the
disabled option from changing the model, but its rendered `option` role exposes provider state
without `aria-disabled`. The finding remains open until the provider or wrapper exposes the
disabled state programmatically and the behavior is verified with assistive technology.

## Remediation records

### A11Y-DLG-001 — Background inertness

**Expected contract:** While a modal dialog is active, users should not navigate to or operate background content.

**Current condition:** Focus is contained within the dialog, but background inertness is not implemented.

**Next action:**

1. Compare native `inert`, Angular CDK overlay/a11y primitives, and a wrapper-owned implementation.
2. Verify pointer, keyboard, accessibility-tree, and restoration behavior.
3. Add Storybook and integrated tests.
4. Record browser and assistive-technology results.

### A11Y-SEL-002 — Validation relationships

**Expected contract:** Required and invalid states must be communicated programmatically, and help or error text must be associated with the control.

**Current condition:** The public Select API currently exposes label, options, placeholder, disabled, and value only.

**Next action:**

1. Define provider-neutral required, invalid, described-by, and error-message contracts.
2. Map them privately to the provider implementation.
3. Add normal, invalid, required, and error Storybook states.
4. Test keyboard, announcement, reflow, and theme behavior.

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
- [ ] Resolved findings link to automated and, where required, manual verification.
- [x] The manifest references finding identifiers; last-review records remain pending.
- [ ] Starlight exposes open risks without presenting them as generic quality badges.
