# STEP 20: Component Consolidation Proposal - Expanded Checklist

**Goal**: Propose and plan consolidation of duplicate / candidate components.

**Reference**: Original documentation-upgrade plan.

_Status update, July 21, 2026: cross-checked against the real
[20-component-consolidation-proposal.md](../documentation-upgrade/20-component-consolidation-proposal.md)._

## Analysis

- [x] Review Step 18 estate audit results
- [x] Compare stable vs candidate implementations (especially Button) — `ps-button` vs
      `ps-button-candidate`, decision: retire the candidate as a case study
- [ ] Evaluate technical debt vs governance value — done for Button only; Select/Dialog
      provider-vs-native/CDK tradeoffs are documented but not all 21 entries have this analysis

## Proposal Elements

- [x] Consolidation strategy per component — Button decided; Select/Dialog retained-with-remediation
- [x] Deprecation plan and compatibility aliases — Button's compatibility window documented in
      [button-api-migration.md](../design-system/components/button-api-migration.md); selector
      aliases (`public-*` → `ps-*`) tracked the same way
- [ ] Timeline and risk assessment — no explicit dated timeline exists; "next major release" is
      the only stated gate
- [x] Impact on federation remotes and consumers — a repo-wide consumer search was done before
      every rename/removal decision this session (zero live consumers of removed surfaces)

## Next Actions

- [x] Draft proposal document — doc 20 is the live proposal, actively maintained
- [ ] Get feedback via GitHub discussion or PR — not applicable in this workflow; decisions were
      recorded directly by you and reflected in the docs
- [x] Implement approved changes — Button contract absorption (`iconName`, etc.) and the
      `ps-button-candidate` rename both landed
- [x] Update manifest, Storybook, and Starlight docs — all three updated for the Button work

**Cross-Reference**: Link back to Step 10 cleanup and Step 18 audit — both current.
