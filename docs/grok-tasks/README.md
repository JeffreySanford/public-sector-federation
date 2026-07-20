# Grok Tasks Directory

This directory contains expanded, actionable checklists created with Grok assistance for the **documentation-upgrade** plan.

## Available Checklists

- [STEP10-MIGRATION-CHECKLIST.md](./STEP10-MIGRATION-CHECKLIST.md)
- [STEP18-COMPONENT-ESTATE-AUDIT-CHECKLIST.md](./STEP18-COMPONENT-ESTATE-AUDIT-CHECKLIST.md)
- [BROADER-GAPS.md](./BROADER-GAPS.md) — Overall gaps and recommendations
- [STEP19-ACCESSIBILITY-CHECKLIST.md](./STEP19-ACCESSIBILITY-CHECKLIST.md)
- [STEP20-CONSOLIDATION-CHECKLIST.md](./STEP20-CONSOLIDATION-CHECKLIST.md)
- (More will be added as needed)

**Broader Context & Gaps** (from Grok analysis):

**Broader Gaps / What's Missing in the Repo Overall**

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

**Overall Assessment**: The repo is in excellent shape — this upgrade is polishing an already strong reference into a clearer, more focused **Public Sector Design System**.

Generated to accelerate the documentation upgrade.
