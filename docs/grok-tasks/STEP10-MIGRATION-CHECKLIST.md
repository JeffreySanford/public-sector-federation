# STEP 10: Migration and Cleanup Plan - Expanded Checklist

**Goal**: Fully implement the public-facing rename and cleanup to establish the repo as a **Public Sector Design System** reference.

**Reference**: `docs/documentation-upgrade/10-migration-and-cleanup-plan.md`

## Recommendations for Step 10 (Immediate Next Actions)

- [ ] Run full audits: `pnpm verify:release`, `pnpm test:e2e:list`, `pnpm manifest:check`, link checks, and manual Starlight/Storybook review.
- [ ] Prioritize remaining renames + Storybook hierarchy (low-risk, high-impact for public story).
- [x] Zeroheight-related items have been systematically removed (retirement complete).
- [ ] Update README + Starlight navigation as the "source of truth" shift.
- [ ] Document decisions in the relevant upgrade docs (e.g., Button strategy).
- [ ] Test migration incrementally; use archives for rollback.

## Phase 1: Rename Implementation

- [ ] Audit current state with targeted searches...

  ```bash
  grep -r "QA Remote" . --include="*.md" --include="*.ts" --include="*.html"
  grep -r "Candidate" . --include="*.md" --include="*.ts"
  grep -r "Acceptance Story" .
  grep -r "UP Button" .
  ```

- [ ] Complete rename map (Button Candidate → Button, QA Remote → Component Lab, etc.)
- [ ] Update Storybook category hierarchy and stories
- [ ] Update all manifest references and component pages
- [ ] Verify with `pnpm build:storybook` and `pnpm manifest:check`

## Phase 2–4 and Cross-Cutting Tasks

- (See original plan + previous version of this checklist)

## Progress Tracking

Update `00-current-status.md` after major batches.

The repo is in excellent shape overall — focus on completing the renames, archives, and alignments in Step 10 to enable the unified public release.
