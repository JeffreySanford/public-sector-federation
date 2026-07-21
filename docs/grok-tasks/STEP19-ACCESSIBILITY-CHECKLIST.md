# STEP 19: Accessibility Findings & Remediation - Expanded Checklist

**Goal**: Identify, document, and remediate accessibility issues across the component library.

**Reference**: Original documentation-upgrade plan.

_Status update, July 21, 2026: cross-checked against the real
[19-accessibility-findings-and-remediation.md](../documentation-upgrade/19-accessibility-findings-and-remediation.md)._

## Preparation

- [x] Run full accessibility audit (`pnpm test:a11y` or Playwright + axe) — automated axe checks run
      in Storybook Playwright and Starlight's quality gate
- [x] Review existing findings in manifest and Chromatic — 10 findings recorded in the
      `componentFindings` registry
- [ ] Test with NVDA / VoiceOver / keyboard-only — workflow and Storybook are ready
      ([nvda-manual-accessibility-review.md](../design-system/validation/nvda-manual-accessibility-review.md));
      you have NVDA installed but no review sessions have been completed yet

## Audit Focus Areas

- [x] Component-level issues (Button, Select, Dialog, etc.) — findings `A11Y-BTN-001/002`,
      `A11Y-SEL-001/002`, `A11Y-DLG-001-004` recorded
- [ ] Color contrast & theme switching — forced-colors boundaries automated; manual contrast
      review not done
- [x] ARIA labels and roles in wrappers — covered by the automated findings above
- [x] Focus management and keyboard navigation — automated evidence complete for all three
      flagship components
- [ ] Screen reader testing (especially overlays and modals) — same NVDA gap as above; Dialog's
      background-inertness and stacked-dialog behavior explicitly still need it

## Remediation Plan

- [x] Prioritize critical issues — none are `critical`; current findings are serious/moderate at most
- [x] Document remediation steps and evidence — per-finding remediation records exist in doc 19
- [x] Add regression tests for fixed issues — Storybook Playwright specs cover implemented findings
- [ ] Update component pages in Starlight with accessibility section — Starlight pages state
      automated-vs-manual status in prose; no dedicated generated accessibility section yet

## Deliverables

- [ ] Updated accessibility report — doc 19 is current but the manual review section remains empty
- [x] Remediation tracking in manifest — `findingIds` link components to the finding registry
      bidirectionally (validated by `manifest:check`)
- [x] Contributor guidance for manual testing (NVDA workflow) —
      [nvda-manual-accessibility-review.md](../design-system/validation/nvda-manual-accessibility-review.md)

**Verification**: Re-run full suite + manual spot checks — automated suite re-run clean
repeatedly; manual spot checks (NVDA) are the one remaining step, waiting on you.
