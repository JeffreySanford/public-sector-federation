# STEP 10: Migration and Cleanup Plan - Expanded Checklist

**Goal**: Fully implement the public-facing rename and cleanup to establish the repo as a **Public Sector Design System** reference.

**Reference**: `docs/documentation-upgrade/10-migration-and-cleanup-plan.md`

## Recommendations for Step 10 (Immediate Next Actions)

- [x] Run full audits: `pnpm verify:release`, link checks, and manual Storybook review — run repeatedly through the rename and scrub passes.
- [x] Prioritize remaining renames + Storybook hierarchy — the `Acceptance Stories → Interaction Stories` rename and the Button candidate rename are both complete.
- [x] Zeroheight-related items have been systematically removed (retirement complete).
- [x] Update README + Starlight navigation as the "source of truth" shift — README opening/links already match the target framing.
- [x] Document decisions in the relevant upgrade docs (e.g., Button strategy) — `ps-button` now carries `intent`/`appearance`/`iconName`/`activated`, `ps-up-button` was renamed to `ps-button-candidate` throughout, and its long-term disposition (retire as a documented case study, not merge further or promote to a second permanent Button) is recorded in [button-api-migration.md](../design-system/components/button-api-migration.md).
- [x] Proprietary-content scrub complete (SitePen/UP/up-design-system/mortgage-domain terms/local paths) — see [POST-SCRUB-CHECKLIST.md](./POST-SCRUB-CHECKLIST.md).
- [ ] Test migration incrementally; use archives for rollback.

## Phase 1: Rename Implementation

- [ ] Audit current state with targeted searches...

  ```bash
  grep -r "QA Remote" . --include="*.md" --include="*.ts" --include="*.html"
  grep -r "Candidate" . --include="*.md" --include="*.ts"
  grep -r "Acceptance Story" .
  grep -r "Button Candidate" .
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
