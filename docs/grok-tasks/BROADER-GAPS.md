# Broader Gaps & Recommendations

**Analysis Date**: July 20, 2026
**Focus**: Public Sector Design System Documentation Upgrade

## Broader Gaps / What's Missing in the Repo Overall

1. **Documentation Consistency & Drift Prevention**
   - Manifest is strong but ensure all new/updated pages fully sync (e.g., via `pnpm manifest:check`).
   - More cross-links between Starlight, Storybook, manifest, and code.
   - Complete component estate audit (18-), accessibility findings/remediation (19-), consolidation proposal (20-).

2. **Public Polish for Design System Identity**
   - First-time visitor experience: Ensure ~30-second north star clarity on homepage/Starlight (design system focus, not federation-first).
   - Figma reconstruction reference (mentioned as next).
   - More explicit contributor/onboarding guidance (e.g., full NVDA/manual accessibility workflow in docs).

3. **Cleanup Risks**
   - Don't remove tests, manifest fields, or stable APIs prematurely.
   - Preserve federation/remotes as adoption evidence.
   - Versioning/CHANGELOG alignment with new narrative.

4. **Other Potential Improvements** (lower priority)
   - Selector standardization progress tracking.
   - Real component contract unit tests (beyond E2E).
   - Token-boundary remediation (native styling to `--ps-*`).
   - Long-term: Release 1.0.0 tagging/publishing if not done.
   - License/ownership clarity (visible but restrictive).

## Recommendations for Step 10 (Immediate Next Actions)

- Run full audits: `pnpm verify:release`, `pnpm test:e2e:list`, `pnpm manifest:check`, link checks, and manual Starlight/Storybook review.
- Prioritize remaining renames + Storybook hierarchy (low-risk, high-impact for public story).
- Zeroheight-related items have been systematically removed (retirement complete).
- Update README + Starlight navigation as the "source of truth" shift.
- Document decisions in the relevant upgrade docs (e.g., Button strategy).
- Test migration incrementally; use archives for rollback.

**Overall Assessment**:
The repo is in **excellent shape** overall — this upgrade is polishing an already strong reference into a clearer, more focused product. Focus on completing the renames, archives, and alignments in Step 10 to enable the unified public release.
