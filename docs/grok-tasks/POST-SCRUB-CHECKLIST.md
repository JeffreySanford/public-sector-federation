# Post-Scrub Checklist

**Purpose**: Track the removal of SitePen / UP Design System / customer-specific
proprietary and confidential information from this public repository, and what
still needs review before certifying the repository clean.

**Last updated**: July 21, 2026.

## Completed in this pass

### Deleted entirely (too saturated with proprietary content to safely edit)

- [x] `docs/design-system/architecture/up-design-system/` (9 files: README,
      change-log, critical-design-decisions, design-decisions,
      design-system-questions, primeng-binding-audit,
      runtime-architecture-answered, token-export-validation,
      wrapper-pattern-validation).
- [x] `docs/design-system/validation/enterprise-validation-status.md` (recorded
      evidence explicitly pending "enterprise machine access").
- [x] `docs/design-system/components/button-candidate-integration-plan.md`
      (~1200 lines; contained exact `D:\repos\up-design-system` paths,
      `fm-button` internal naming, a Figma `VariableID`, and hex-value
      comparisons attributed to a "local UP source").
- [x] `docs/design-system/components/button-candidate-overview.md` and
      `button-developer-experience.md` (UP Design System framing and the same
      class of local-repository comparison content).
- [x] `docs/design-system/components/button-candidates-view-checklist.md`
      (625 lines, 31 "UP" mentions, ASCII mockups of a "UP Button" tile).
- [x] Three diagram PNGs with proprietary labels baked into pixels (no
      rasterizer was available in this environment to regenerate them from the
      cleaned SVG/text sources, so they were removed rather than edited):
      `shell-interaction-model.png`, `federated-web-components-decision.png`
      (both had "Point of Entry / Unified Pricing and Committing / Rates Sheet
      / Loan Pipeline / Committed Loans" navigation labels — the second also
      said "Zeroheight"), `design-system-architecture-diagram.png` and
      `shared-design-system-implementation-options.png` (both built entirely
      around the now-retired Zeroheight platform), and
      `repository-validation-map.png` ("real implementation once repository
      access is available", "Not from Zeroheight"). Markdown references were
      repointed to the equivalent clean SVG or to
      `shared-design-system-implementation-runtime-architecture.png`, which was
      verified clean and kept.

### Rewritten/consolidated (kept generic, useful content)

- [x] `docs/design-system/components/button-candidate.md` — rewritten as the
      single, self-contained overview (lifecycle, key differences, when to
      use/not use, source-of-truth boundaries) since the separate
      overview/integration-plan files were deleted.
- [x] `button-candidate-design-tokens.md`, `button-candidate-developer.md`,
      `button-candidate-validation.md` — kept, with every "UP Design
      System" / "UP Button" / "D:\repos" reference replaced by generic
      "external design source" or "Button candidate" language, and stale
      Storybook story IDs (`design-system-candidates-button-up--*`) updated to
      the current `design-system-experiments-button-contract-exploration--*`
      naming.

### Neutralized customer/product-domain terminology

Replaced throughout `shell-interaction.md` (including its `.svg` diagram),
`developer-journey.md`, `contribution-process.md`,
`innersource-contribution-model.md`: `Point of Entry` → `Case Intake`,
`Unified Pricing and Committing` → `Service Requests`, `Rates Sheet` →
`Reporting`, `Loan Pipeline` → `Case Queue`, `Committed Loans` →
`Administration`, `Capital Markets` → generic team names, `Desktop
Underwriter` / `Marketpoint` — not found outside the deleted files (already
gone).

Reworded `token-delivery-decision.md`'s "Open Enterprise Checks" section and
two "the enterprise repository" mentions (`flow-map.md`,
`shell-subapp-integration.md`) to remove the implication of a specific
external system that was inspected.

### "UP" / "UP Button" / "UP Design System" naming swept from source code

Every user-visible and source-level "UP" reference was replaced with generic
"Button candidate" / "Button Contract Exploration" language, including:

- `apps/qa-remote/src/app/components/candidates/candidate-links.ts` and
  `candidates-view.component.{ts,html,spec.ts}` (renamed exported constants
  `UP_BUTTON_STORY_ID` → `BUTTON_CANDIDATE_STORY_ID`, etc., per your explicit
  instruction to rename `up-button` references to `button-candidate`; fixed
  the Figma-link label, the promotion evidence link — which was repointed
  from the deleted integration-plan.md to the new button-candidate.md — and
  every rendered heading/label/aria-label).
- `apps/qa-remote/src/stories/up-button.stories.ts` and
  `opinionated-wrapper-contract.stories.ts` (aria-labels, headings, and a
  visible comparison-story heading).
- `apps/qa-remote/e2e/button-candidate.storybook.spec.ts` and
  `component-registry.storybook.spec.ts` (test names and assertions kept in
  sync with the renamed rendered text).
- `apps/qa-remote/src/stories/component-registry-dashboard.component.ts`
  (dashboard mode title).
- `packages/tokens/src/tokens/token-metadata.json` (source token
  descriptions) → rebuilt `packages/tokens/src/design-tokens.json` from the
  fixed source.
- `packages/ui-patterns/src/manifest/component-registry.ts` (manifest
  `documentationFiles` repointed away from the deleted docs).

### Verification run after the scrub

- `pnpm manifest:build` — clean.
- `node scripts/check-links.mjs` — all links valid, zero dangling references
  to deleted files.
- Full repo-wide grep sweep for `up-design-system`, `D:\repos`, `fm-button`,
  `Marketpoint`, `Desktop Underwriter`, `Capital Markets`, `Rates Sheet`,
  `Loan Pipeline`, `Committed Loans`, `Unified Pricing`, `Point of Entry`,
  `VariableID`, `#1C6FA3`, `#134A6D`, `enterprise machine`, `enterprise
  repository`, `UP Design System`, `UP Button`, and standalone `\bUP\b` across
  `docs/`, `apps/`, `packages/`, and `scripts/` — zero matches remaining.
- `pnpm verify:release` — run in progress at the time of writing; results to
  be confirmed before this batch is pushed.

## Explicitly NOT done in this pass (flagged for your review)

- [x] ~~The `ps-up-button` selector itself was not renamed.~~ **Done July 21,
      2026** in a follow-up pass: the selector (`ps-up-button` →
      `ps-button-candidate`), class name (`PublicUpButtonComponent` →
      `PublicButtonCandidateComponent`), exported types
      (`PublicUpButtonIntent`/`PublicUpButtonAppearance`/`PublicUpButtonIcon` →
      `PublicButtonCandidateIntent`/`PublicButtonCandidateAppearance`/
      `PublicButtonCandidateIcon`), source file
      (`public-up-button.component.ts` → `public-button-candidate.component.ts`),
      story file (`up-button.stories.ts` → `button-candidate.stories.ts`), the
      `chromatic-up-button.mjs` script, CSS custom properties
      (`--ps-up-button-*` → `--ps-button-candidate-*`), and every consumer
      (manifest registry, candidates-view component and its e2e/unit specs,
      `button-candidate.storybook.spec.ts`, `component-registry.storybook.spec.ts`,
      `package.json` script names, README/TESTING.md command references, and
      the button-candidate docs) were all renamed and verified with a full
      `pnpm verify:release` run.
- [ ] **Diagram regeneration.** Five PNGs were deleted rather than fixed
      because no SVG-to-PNG rasterizer was available in this environment.
      Two of the deleted diagrams have clean `.svg` sources already checked
      in and referenced instead; the other three
      (`design-system-architecture-diagram.png`,
      `shared-design-system-implementation-options.png`,
      `repository-validation-map.png`) have **no surviving replacement image**
      — the two remaining clean PNGs cover similar ground but are not
      full replacements. If you want new diagrams for those three, they'll
      need to be redrawn (e.g., in a design tool or re-authored as Mermaid/SVG
      so they stay text-diffable and scrubbable going forward).
- [ ] **CHANGELOG.md and commit messages.** This checklist covers file
      *content*. Historical commit messages and any release notes were not
      audited for the same terms.
- [ ] Re-run the full grep sweep after any future doc edits — a few of the
      terms above (e.g., "enterprise repository") are generic enough that
      they could reappear innocently in new writing without anyone intending
      to reference the same source.

## Git history — advisory, not yet acted on

**This is the most important open item.** Every file deleted in this pass (and
in your own `263c877` and prior commits) still exists in this repository's
git history and is retrievable from `origin/master`'s prior commits, from any
fork, and from GitHub's own object/PR caching, even after these deletion
commits are pushed. A normal `git rm` + commit does **not** remove data from
history.

To actually purge this material, you would need to, in order:

1. **Freeze new pushes** to `master` until the rewrite is done, so nobody
   builds on commits you're about to rewrite.
2. **Rewrite history** with [`git filter-repo`](https://github.com/newren/git-filter-repo)
   (the actively maintained tool; `git filter-branch` and the old BFG jar are
   both discouraged/unmaintained by comparison), targeting the exact paths
   deleted above — both in this session and in your own prior commits, e.g.:
   ```
   git filter-repo --path docs/design-system/architecture/up-design-system --invert-paths
   git filter-repo --path docs/design-system/validation/enterprise-validation-status.md --invert-paths
   git filter-repo --path docs/design-system/components/button-candidate-integration-plan.md --invert-paths
   git filter-repo --path docs/design-system/components/button-candidate-overview.md --invert-paths
   git filter-repo --path docs/design-system/components/button-developer-experience.md --invert-paths
   git filter-repo --path docs/design-system/components/button-candidates-view-checklist.md --invert-paths
   git filter-repo --path docs/design-system/diagrams/shell-interaction-model.png --invert-paths
   git filter-repo --path docs/design-system/diagrams/federated-web-components-decision.png --invert-paths
   git filter-repo --path docs/design-system/diagrams/design-system-architecture-diagram.png --invert-paths
   git filter-repo --path docs/design-system/diagrams/shared-design-system-implementation-options.png --invert-paths
   git filter-repo --path docs/design-system/diagrams/repository-validation-map.png --invert-paths
   ```
   (`filter-repo` can take all paths in one invocation via a paths file —
   worth doing that instead of five separate rewrites.) This rewrites every
   commit SHA from the first affected commit forward.
3. **Force-push** the rewritten history to `origin/master`
   (`git push --force`) — this is destructive to anyone else's clone or
   branch based on the old history and is exactly the kind of operation this
   assistant will not run without your explicit, separate confirmation at
   the time.
4. **Rewrite or delete any other branches** built on the old history, since
   they'll still reference the pre-rewrite commits.
5. **Check open pull requests.** A PR's diff and commits are cached by GitHub
   independently of the branch; closing/re-opening or re-creating any open
   PRs against the new history may be necessary.
6. **Check GitHub Actions artifacts and releases.** Build artifacts,
   release assets, and cached logs from prior CI runs can contain the same
   deleted files (e.g., a Storybook build artifact, a Lighthouse report
   artifact, a release tarball) and are not touched by a history rewrite —
   these need to be reviewed and deleted from the Actions/Releases UI or API
   separately.
7. **Contact GitHub Support** if the repository was ever forked or if you
   need cached views (e.g., a raw.githubusercontent.com URL someone
   bookmarked) purged from GitHub's own caches — a force-push alone does not
   guarantee those are gone immediately.
8. **Re-clone, don't pull**, on every other machine/checkout you or
   collaborators have of this repo after the force-push, since a `git pull`
   against rewritten history creates a confusing merge of old and new
   histories rather than cleanly adopting the rewrite.

None of this is reversible in the way a normal commit is. Do it only after
you're confident the *current* content is fully clean (this checklist's open
items above should be resolved first), since every additional round of
"oops, one more file" after a history rewrite means repeating the whole
force-push process.
