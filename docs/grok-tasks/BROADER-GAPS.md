# Broader Gaps & Recommendations

**Analysis Date**: July 20, 2026
**Status update**: July 21, 2026 — see inline notes for what has since landed.
**Focus**: Public Sector Design System Documentation Upgrade

## Broader Gaps / What's Missing in the Repo Overall

1. **Documentation Consistency & Drift Prevention**
   - Manifest is strong but ensure all new/updated pages fully sync (e.g., via `pnpm manifest:check`). ✅ Enforced by `verify:release`'s manifest-drift gate on every push.
   - More cross-links between Starlight, Storybook, manifest, and code. ✅ `ComponentStatusTable.astro` now renders all 21 manifest entries live in Starlight.
   - Complete component estate audit (18-), accessibility findings/remediation (19-), consolidation proposal (20-). 🟡 Substantially progressed, not fully closed — see [STEP18](./STEP18-COMPONENT-ESTATE-AUDIT-CHECKLIST.md), [STEP19](./STEP19-ACCESSIBILITY-CHECKLIST.md), [STEP20](./STEP20-CONSOLIDATION-CHECKLIST.md) for current item-by-item status.

2. **Public Polish for Design System Identity**
   - First-time visitor experience: Ensure ~30-second north star clarity on homepage/Starlight (design system focus, not federation-first). ✅ Already true; confirmed when reviewing README/Starlight framing.
   - Figma reconstruction reference (mentioned as next). ❌ Not started — blocked on Figma access, an external/human dependency.
   - More explicit contributor/onboarding guidance (e.g., full NVDA/manual accessibility workflow in docs). ✅ [nvda-manual-accessibility-review.md](../design-system/validation/nvda-manual-accessibility-review.md) — setup, checklists, and a review-record template are ready; actual review sessions are the one remaining step, waiting on you.

3. **Cleanup Risks**
   - Don't remove tests, manifest fields, or stable APIs prematurely. ✅ Actively followed — a selector-alias removal was caught and reverted mid-session specifically because of this principle once a governed finding surfaced.
   - Preserve federation/remotes as adoption evidence. ✅ Confirmed explicitly for `admin-remote` (kept as-is; not built out further, not removed).
   - Versioning/CHANGELOG alignment with new narrative. 🟡 CHANGELOG.md was touched during the Zeroheight scrub but not comprehensively reviewed end-to-end against the current narrative.

4. **Other Potential Improvements** (lower priority)
   - Selector standardization progress tracking. ✅ Confirmed already complete and intentionally tracked (`selectorAliases`, finding `API-NAMING-001`, a dedicated migration doc, a live UI test).
   - Real component contract unit tests (beyond E2E). ❌ Still a real gap — `qa-remote`'s `test` target is typecheck-only, not actual unit tests.
   - Token-boundary remediation (native styling to `--ps-*`). ❌ Not started — native components still consume PrimeNG `--p-*` directly in places.
   - Long-term: Release 1.0.0 tagging/publishing if not done. ✅ Already done; README states release 1.0.0 is complete.
   - License/ownership clarity (visible but restrictive). ✅ `LICENSE.md` exists and is linked from the README.

## Recommendations for Step 10 (Immediate Next Actions)

- Run full audits: `pnpm verify:release`, `pnpm test:e2e:list`, `pnpm manifest:check`, link checks, and manual Starlight/Storybook review.
- Prioritize remaining renames + Storybook hierarchy (low-risk, high-impact for public story).
- Zeroheight-related items have been systematically removed (retirement complete).
- Update README + Starlight navigation as the "source of truth" shift.
- Document decisions in the relevant upgrade docs (e.g., Button strategy).
- Test migration incrementally; use archives for rollback.

**Overall Assessment**:
The repo is in **excellent shape** overall — this upgrade is polishing an already strong reference into a clearer, more focused product. Focus on completing the renames, archives, and alignments in Step 10 to enable the unified public release.
