# STEP 19: Accessibility Findings & Remediation - Expanded Checklist

**Goal**: Identify, document, and remediate accessibility issues across the component library.

**Reference**: Original documentation-upgrade plan.

## Preparation

- [ ] Run full accessibility audit (`pnpm test:a11y` or Playwright + axe)
- [ ] Review existing findings in manifest and Chromatic
- [ ] Test with NVDA / VoiceOver / keyboard-only

## Audit Focus Areas

- [ ] Component-level issues (Button, Select, Dialog, etc.)
- [ ] Color contrast & theme switching
- [ ] ARIA labels and roles in wrappers
- [ ] Focus management and keyboard navigation
- [ ] Screen reader testing (especially overlays and modals)

## Remediation Plan

- [ ] Prioritize critical issues
- [ ] Document remediation steps and evidence
- [ ] Add regression tests for fixed issues
- [ ] Update component pages in Starlight with accessibility section

## Deliverables

- [ ] Updated accessibility report
- [ ] Remediation tracking in manifest
- [ ] Contributor guidance for manual testing (NVDA workflow)

**Verification**: Re-run full suite + manual spot checks.
