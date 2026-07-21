# PR Plan: Scrub PrimeNG-Proving Components & Copy Across All Four Remotes

> **Archived.** This is a completed internal PR-planning record, moved here per
> [10 — Migration and cleanup plan](../../documentation-upgrade/10-migration-and-cleanup-plan.md)'s
> documentation archive convention. It is kept for historical accuracy, not as an active plan —
> [the component catalog](../../design-system/components/catalog.md) and
> [the backlog record](../../design-system/backlog/table-input-checkbox-wrappers.md) are the current
> reference for what actually shipped.

**Status: ✅ Shipped (Phase 1), plus a completed Phase 2 fast-follow.** The scrub landed on
`master` (squashed history culminating in `6cea200`), and the table/input/checkbox wrapper
backlog it deliberately deferred was subsequently built out and merged. See §10 for the Phase 2
record and §11 for the proposed Phase 3 follow-up. The sections below are left as the original
plan for historical accuracy; §4's tracker is updated to reflect what actually landed.

**Phase 1/2 completion review (verified from the current repo state):** the remote copy cleanup is
in place in the three business remotes, the remotes now use the expected `ps-*` wrappers
(`ps-card`, `ps-button`, `ps-tag`, `ps-progress`, `ps-select`, `ps-input`, `ps-checkbox`,
`ps-table`), the old `// GAP:` markers are gone from `apps/`, and the old QA playground story has
been removed in favor of the current `edge-case-states` story. The remaining follow-up is the
Phase 3 work for tiles and the manual accessibility/Figma pass.

**Branch:** `agent/remote-realignment-scrub`
**Type:** Single large PR (per direction)
**Scope:** `apps/services-remote`, `apps/reporting-remote`, `apps/admin-remote`, `apps/qa-remote`
**Explicit non-goal:** No new table/tile patterns in this PR. This PR removes proof-of-concept
components and copy and routes everything through the *existing* `@public-sector/ui-patterns`
registry. New business patterns (tables, tiles) are a tracked fast-follow, not part of this change.
*(Tables and inputs/checkboxes were built in Phase 2 — see §10. "Tiles" was never separately
scoped; see §11.)*

Related docs: [the backlog stub](../../design-system/backlog/table-input-checkbox-wrappers.md) for the
follow-up wrapper work, and [the component catalog](../../design-system/components/catalog.md) for the
current component guidance and status.

---

## 1. Why this PR exists

Each of the three business remotes currently describes itself, in its own on-screen copy, as an
experiment that exists to *prove* something about the PrimeNG preset rather than as a piece of
product UI:

| Remote | Current header copy | Problem |
|---|---|---|
| `services-remote` | "A web component remote proving shared form, focus, validation, and card styling from the PrimeNG preset." | Doesn't even use the `ps-*` registry — raw `<button>`, `<input>`, `<table>` styled by 472 lines of local CSS |
| `reporting-remote` | "PrimeNG data tables and cards are loaded only from this remote to prove token distribution across the web component boundary." | Uses `ps-*` correctly, but the data table itself is raw HTML (no `ps-table` exists yet) |
| `admin-remote` | "Dialog, menu, toast, and switch components validate overlay policy and component tokens from a remote web component." | Mixes governed (`ps-card`, `ps-dialog`, `ps-toast`, `ps-button`) with raw leftovers (`admin-button`, `role="switch"` checkboxes) |
| `qa-remote` | N/A (Storybook) | `primeng-playground.stories.ts` and `problem-areas.stories.ts` are named and written as internal test rigs, not evidence surfaces a reviewer should read as "the product" |

This reads exactly like what it is — scaffolding used to stand the design system up — and it's the
right call to scrub it now that the wrapper registry had enough coverage to carry real screens
without relying on the old proof-of-concept markup.

## 2. Current registry gap (why some raw HTML has to stay, for now)

`packages/ui-patterns` did **not** yet export a table, text input, or checkbox/switch wrapper
when the original PR landed. At that point, only `ps-select` existed for form controls. That
meant:

- Raw `<table>` in `services-remote` (`case-table`) and `reporting-remote` (`report-table`) has no
  governed replacement yet.
- Raw `<input>` / `<input type="checkbox" role="switch">` in `services-remote` and `admin-remote`
  has no governed replacement yet.

Per direction, **this PR does not build those wrappers.** Where a governed replacement exists
(`ps-button`, `ps-card`, `ps-tag`, `ps-progress`, `ps-dialog`, `ps-toast`, `ps-menu`), we migrate to
it and delete the local CSS that reinvented it. Where no wrapper exists, we leave the native
element in place **but tag it explicitly** (see §5) so the manifest/backlog carries the gap forward
instead of hiding it — consistent with how this repo already treats `ps-button-candidate` as `candidate`
rather than pretending it's done.

## 3. What "scrub" means, concretely

For all four remotes:

1. **Copy rewrite** — replace every "proving/validates/loaded only to prove" sentence with copy
   that describes the actual business surface (citizen case management, program reporting,
   administrative console, internal QA/evidence console). No remote's on-screen text should
   describe itself as a test rig.
2. **Component migration** — replace raw HTML with the governed equivalent wherever one exists.
3. **Local CSS deletion** — delete component-level `.css` rules that duplicate what the token
   system / `ps-*` wrappers already provide. Local CSS should shrink to layout only (grid/flex
   arrangement), not color, border, focus, or typography.
4. **Story cleanup in `qa-remote`** — retire or rename story files whose name/content frames them
   as a "playground" or "problem area" rather than a canonical contract or acceptance surface.
5. **Manifest honesty** — anywhere a raw element remains because no wrapper exists, add a
   `// GAP:` comment referencing the tracked backlog item (see §6), so `lint:wrappers` and the
   manifest build can eventually pick it up as a known, not hidden, gap.

## 4. Progress tracker (update as work lands)

**Status: all items below have landed.** `master`'s history was squashed/rewritten during this
work, so individual commit SHAs for the original Phase 1 copy/migration pass no longer exist as
discrete commits — the squashed tip is `6cea200` ("Scrub remote provider proving copy"). Every
`// GAP:` comment this plan called for was later resolved in Phase 2 (§10); a repo-wide search
confirms zero `// GAP:` comments remain in `apps/` today.

### Copy pass
- [x] `services-remote` header copy rewritten (no "proving" language)
- [x] `reporting-remote` header copy rewritten (no "to prove" language)
- [x] `admin-remote` header copy rewritten (no "validates" language)
- [x] `qa-remote` workbench components audited for leftover "proving" language

### `services-remote` component migration
- [x] 3× `metric-card` → `ps-card`
- [x] Action buttons (Create case, Send notice, Request document, Add note) → `ps-button`
- [x] Status chips → `ps-tag`
- [x] `<progress>` → `ps-progress`
- [x] `serviceType` select → `ps-select`
- [x] `caseId` / `applicantName` / `appointmentDate` inputs — `// GAP:` comments added in Phase 1,
      then resolved in Phase 2: migrated to `ps-input` (`c4a7807`)
- [x] `expediteReview` checkbox — `// GAP:` comment added in Phase 1, then resolved in Phase 2:
      migrated to `ps-checkbox` (`c4a7807`)
- [x] `case-table` — `// GAP:` comment added in Phase 1, then resolved in Phase 2: migrated to
      `ps-table` (`c4a7807`)
- [x] `services-remote.component.css` trimmed to layout-only rules (further dead-CSS pass after
      Phase 2's migration: 396 → 308 lines, `cec9497`)

### `reporting-remote` migration
- [x] `report-table` — `// GAP:` comment added in Phase 1, then resolved in Phase 2: migrated to
      `ps-table` with a projected-row content model (`c4a7807`)
- [x] `reporting-remote.component.css` audited/trimmed (168 → 115 lines, `cec9497`)

### `admin-remote` component migration
- [x] `admin-button` instances (Open dialog, Save settings, action-menu buttons) → `ps-button`
- [x] Audit logging / maintenance mode switches — `// GAP:` comments added in Phase 1, then
      resolved in Phase 2: migrated to `ps-checkbox` with `variant="switch"` (`c4a7807`)
- [x] Temporary-password input — `// GAP:` comment added in Phase 1, then resolved in Phase 2:
      migrated to `ps-input type="password"` (`c4a7807`)
- [x] `admin-remote.component.css` trimmed to layout-only rules (93 → 63 lines, `cec9497`)

### `qa-remote` story cleanup
- [x] Coverage overlap confirmed between `primeng-playground.stories.ts` and the acceptance
      story files (button-tag, dialog-toast)
- [x] `primeng-playground.stories.ts` deleted
- [x] `problem-areas.stories.ts` renamed to `edge-case-states.stories.ts` with reframed copy
- [x] `opinionated-wrapper-contract.stories.ts` copy confirmed clean (no action needed)

### Backlog / gap tracking
- [x] `docs/design-system/backlog/table-input-checkbox-wrappers.md` created
- [x] All `// GAP:` comments referenced that backlog doc consistently while they existed
- [x] `grep -rn "// GAP:" apps/` now returns zero results — the backlog doc has been updated
      (§10) to record that the gaps are resolved rather than open

### Validation gate
- [x] `pnpm lint`
- [x] `pnpm lint:links`
- [x] `pnpm lint:wrappers`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm manifest:check`
- [x] `pnpm build`
- [x] `pnpm test:e2e`
- [x] `pnpm chromatic` (Chromatic auto-publishes on every push to `master` as of `3b3b7e7`/`556c7bd`)
- [x] Manual copy check: no remote's on-screen text says "proving," "validates," or "to prove"
      in reference to PrimeNG

---

## 5. File-by-file change list

### `apps/services-remote`
- `src/remote/services-remote.component.html`
  - Header copy: replace the "proving shared form..." sentence with a plain description of the
    citizen-services case workspace.
  - `metric-card` × 3 → `ps-card` (matches the pattern already used correctly in
    `reporting-remote`).
  - `action-button` / `action-button--primary` buttons (Create case, Send notice, Request
    document, Add note) → `ps-button` with `intent`/`appearance` per the approved Button contract
    from PR #33.
  - `status-chip--*` spans → `ps-tag` with the matching `tone`.
  - `<progress>` → `ps-progress`.
  - `caseId` / `applicantName` / `appointmentDate` inputs, `serviceType` select, `expediteReview`
    checkbox → **leave native**, add `// GAP: ps-input not yet available` /
    `// GAP: ps-checkbox not yet available` comments. `serviceType` select → migrate to
    `ps-select` now (wrapper already exists, no reason to leave it raw).
  - `case-table` → **leave native**, add `// GAP: ps-table not yet available` comment.
- `src/remote/services-remote.component.css`
  - Delete the rules now superseded by `ps-card`/`ps-button`/`ps-tag`/`ps-progress` (expect this
    472-line file to drop to roughly layout-only rules for the panel grid).

### `apps/reporting-remote`
- `src/remote/reporting-remote.component.html`
  - Header copy: replace "PrimeNG data tables and cards are loaded only from this remote to prove
    token distribution..." with a description of the reporting/analytics surface for program
    performance.
  - Table stays raw (`// GAP: ps-table not yet available`) — this remote is already otherwise
    fully on the registry, so it's the cleanest of the three and mostly a copy fix.
- `src/remote/reporting-remote.component.css`
  - Audit for any rules duplicating token/preset values; trim to layout only.

### `apps/admin-remote`
- `src/remote/admin-remote.component.html`
  - Header copy: replace "Dialog, menu, toast, and switch components validate overlay policy..."
    with a description of the administrative settings console.
  - `admin-button` (Open dialog, Save settings, action-menu buttons) → `ps-button`.
  - Audit logging / maintenance mode switches, temporary-password input → leave native,
    `// GAP: ps-checkbox` / `// GAP: ps-input` comments.
- `src/remote/admin-remote.component.css`
  - Delete rules superseded by `ps-button`; keep only the settings-row layout rules.

### `apps/qa-remote`
- `src/stories/primeng-playground.stories.ts` — **retire.** Its useful assertions (button/tag/
  toast/dialog states) are already covered by the dedicated acceptance stories
  (`button-tag.acceptance.stories.ts`, `dialog-toast.acceptance.stories.ts`). Confirm coverage
  overlap, then delete the file rather than rename it — "playground" framing shouldn't survive in
  any form.
- `src/stories/problem-areas.stories.ts` — **rename and reframe**, not delete. Its parameterized
  story (title/description/tone inputs) is structurally useful for exercising edge cases, but
  "problem area" is internal-diagnostic language that shouldn't be the public name. Rename to
  something like `edge-case-states.stories.ts` and adjust copy so it reads as intentional
  state-coverage, not a leftover scratchpad.
- `src/stories/opinionated-wrapper-contract.stories.ts` — **keep**, it's a legitimate
  canonical-contract page (this is the `ps-button-candidate` candidate contract surface). No action
  beyond confirming its copy doesn't slip into "prove PrimeNG" language.
- `src/app/components/workbench/*` — audit `design-alignment-lab.component.ts` and
  `quality-remediation-view.component.ts` for the same "proving" language pattern; these are
  QA-internal tools so they can keep diagnostic framing, but confirm they're not the parts a
  reviewer or design-team consumer would land on first.

## 6. Sequenced steps (within the one PR)

1. Branch: `agent/remote-realignment-scrub` off `master`.
2. Copy pass first, across all four remotes/qa — get every "proving/validates/to prove" sentence
   rewritten before touching markup. This is the fastest win and de-risks the rest.
3. `services-remote` component migration (largest diff — do it first while context is freshest).
4. `admin-remote` component migration.
5. `reporting-remote` — copy-only + gap comments (smallest diff).
6. `qa-remote` story retirement/rename.
7. CSS trim pass across all three remote `.css` files, after markup migration is done (so you're
   deleting rules you can confirm are dead, not guessing).
8. Add `// GAP:` comments everywhere a native element remains, each referencing a single tracked
   backlog doc (§6) so they're greppable later (`grep -rn "// GAP:" apps/`).
9. Run the full release gate.

## 7. Backlog this PR should create (not build)

Add a `docs/design-system/backlog/table-input-checkbox-wrappers.md` stub (a few lines, not a
design doc) recording:

- `ps-table` — needed by `services-remote` (case queue) and `reporting-remote` (program
  performance) — currently raw HTML in both.
- `ps-input` — needed by `services-remote` and `admin-remote` — currently raw `<input>`.
- `ps-checkbox` / switch wrapper — needed by `services-remote` (expedite review, eligibility
  checks) and `admin-remote` (audit logging, maintenance mode) — currently raw
  `role="switch"` checkboxes.

This gives the manifest/backlog system somewhere to point when `lint:wrappers` or a future audit
finds the `// GAP:` comments, and is the natural seed for the "new business" table/tile work once
that's scoped.

## 8. Validation before merge

```
pnpm lint
pnpm lint:links
pnpm lint:wrappers
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm test:e2e
pnpm chromatic
```
Equivalent to `pnpm verify:release`, plus a manual visual pass in Chromatic since this touches
visible markup in three remotes and Storybook.

## 9. Risk / rollback

- **Risk:** deleting CSS that isn't actually fully superseded by the wrapper components could
  cause visual regressions in the three remotes not currently under Chromatic baseline for their
  full page (only `qa-remote` is the dedicated visual-QA surface). Mitigate by adding
  Chromatic snapshots for the three remote root views if they don't already exist, *before*
  merging the CSS trim commit.
- **Rollback:** since this is one PR, rollback is a single revert. No migrations, no data changes,
  no API surface changes — purely template/copy/CSS/story changes, so revert risk is low.

---

## PR description (paste into GitHub)

```markdown
## Summary
- Remove "proving PrimeNG" framing from services-remote, reporting-remote, admin-remote, and
  qa-remote copy — replace with descriptions of the actual business surface each remote
  represents.
- Migrate services-remote and admin-remote off raw HTML onto the existing `ps-*` wrapper registry
  (button, card, tag, progress, select) wherever a wrapper already exists.
- Delete local CSS superseded by the wrapper/token system across all three remote stylesheets.
- Retire `primeng-playground.stories.ts`; rename `problem-areas.stories.ts` to
  `edge-case-states.stories.ts` with reframed copy.
- Tag every remaining raw element (table, text input, checkbox/switch) with a `// GAP:` comment
  pointing at a new backlog stub, since no `ps-table` / `ps-input` / `ps-checkbox` wrapper exists
  yet — those are explicitly out of scope for this PR.

## Non-goals
- No new table or tile components. That work is tracked in
  `docs/design-system/backlog/table-input-checkbox-wrappers.md` as a fast-follow.

## Validation
- [ ] `pnpm verify:release`
- [ ] Chromatic visual review for services-remote, reporting-remote, admin-remote
- [ ] Manual check that no remote's on-screen copy still says "proving," "validates," or
      "to prove" in reference to PrimeNG
```

---

## 10. Phase 2 (completed): table, input, and checkbox wrapper build-out

The backlog stub this plan created (§7) was picked up and closed. `ps-checkbox`, `ps-input`, and
`ps-table` now exist in `@public-sector/ui-patterns`, every `// GAP:` comment this plan introduced
has been replaced with the real component, and the backlog doc has been rewritten to record
resolution rather than an open gap.

### What shipped

- **New components** — `packages/ui-patterns/src/public-checkbox.component.ts`,
  `public-input.component.ts`, `public-table.component.ts`, each with a unit spec, a Storybook
  stories file (`apps/qa-remote/src/stories/{checkbox,input,table}.stories.ts`), and a Playwright
  e2e spec (`apps/qa-remote/e2e/{checkbox,input,table}.storybook.spec.ts`) — `c4a7807`, `881583e`.
- **Manifest registration** — all three registered in
  `packages/ui-patterns/src/manifest/component-registry.ts` (18 → 21 entries) — `881583e`,
  `ab1fc26`.
- **Remote wiring** — every native `<input>`, `<table>`, and `role="switch"` checkbox in
  `services-remote`, `admin-remote`, and `reporting-remote` replaced with the governed wrapper —
  `c4a7807`.
- **Second dead-CSS pass** — after the markup swap, the CSS rules that used to style the native
  elements (`.field-control`, `.case-table`, `.report-table`, `.password-field`, `.eligibility-check`,
  etc.) were now-dead code; removed across all three remotes (396→308, 93→63, 168→115 lines) —
  `cec9497`.
- **`ps-checkbox` token-boundary alignment** — the one `--ps-*`/`--p-*` mix (an `accent-color`
  fallback) was normalized to the pure `--p-*` pattern `ps-input`/`ps-table` use, so all three
  siblings are now consistently `provider-coupled` rather than one being `mixed`.
- **Starlight documentation** — three new guidance pages
  (`apps/starlight/src/content/docs/components/{checkbox,input,table}/index.mdx`) following the
  same blueprint as Button/Select/Dialog, added to the sidebar, and referenced from the manifest's
  `documentationFiles` (`documentationStatus` bumped `partial` → `complete` for all three) —
  `053f355`, `9c4df05`.
- **Live-example infrastructure fix** — Starlight's `<StoryFrame>` embeds were pointing at a
  build-specific Chromatic URL that goes stale on every republish (Chromatic assigns a new random
  subdomain per build). Repointed all 9 hardcoded references to Chromatic's stable
  `<branch>--<appId>` alias, which always resolves to the latest published build — `3b3b7e7`.
- **CI automation** — added an automatic `pnpm chromatic` publish step on every push to `master`
  (`3b3b7e7`, fixed after an initial `secrets`-in-`if:` conditional broke workflow parsing entirely
  — `556c7bd`), and closed two real gaps in `verify:release` versus what CI actually checks:
  it never ran `manifest:build` + a drift check (the exact bug that broke CI twice), and never ran
  the built-Storybook accessibility gate locally.

### What's still open (carried forward, not unique to this component set)

- Manual assistive-technology review and Figma property mapping remain pending for
  `ps-checkbox`, `ps-input`, and `ps-table` — the same open item every non-flagship component in
  the manifest carries (`ps-progress`, `ps-paginator`, `ps-menu`, etc.), not something specific to
  this backlog.

## 11. Phase 3 (proposed)

A proposed Phase 3 for this story should cover three missing items:

1. **Tile-pattern confirmation**
   The "tiles" pattern mentioned in the original non-goal line was never separately scoped. The
   backlog stub created in §7 only recorded `ps-table`, `ps-input`, and `ps-checkbox`; "tiles"
   never made it into `docs/design-system/backlog/table-input-checkbox-wrappers.md` or anywhere
   else. This should be confirmed explicitly: either validate that existing patterns such as
   `ps-card` and `ps-status-card` already cover the need, or document a genuine gap and decide
   whether a dedicated tile wrapper should be built.

2. **Manual accessibility and design-alignment pass**
   The manifest still carries open quality work for components such as `ps-checkbox`, `ps-input`,
   and `ps-table`, including manual assistive-technology review and Figma property mapping. A
   dedicated Phase 3 should schedule that review so it is not left as an implicit follow-up.

3. **Quality-gate tooling and ownership**
   For the accessibility portion of the work, a practical free option is NVDA on Windows
   (open-source, free, and widely used for accessibility testing). It is a reasonable substitute
   for JAWS for many browser-based checks, while VoiceOver (macOS/iOS) and Narrator (Windows)
   are useful for quick cross-checks. This phase should also assign an owner, define the review
   scope for `ps-checkbox`, `ps-input`, and `ps-table`, and use a lightweight acceptance checklist
   (keyboard behavior, naming/help text, focus order, and any notable screen-reader findings) so
   the review is completed rather than deferred.

A separate, unrelated "Phase 3: Tooling retirement" exists in
`docs/documentation-upgrade/10-migration-and-cleanup-plan.md` (third-party documentation
platform and report-script retirement). That is not part of this story and should not be conflated with the proposed Phase 3
above.

---

## Phase summary

### Completed
- [x] Phase 1 copy and component scrub across the four remotes
- [x] Phase 2 wrapper build-out for `ps-table`, `ps-input`, and `ps-checkbox`
- [x] Remote markup migrated to the new wrappers where applicable
- [x] Backlog and catalog documentation updated to reflect the resolved work

### Remaining
- [ ] Add the different tile states, styles, and variants needed for the pattern and document them
- [ ] Schedule the manual accessibility review and Figma alignment pass
- [ ] Assign owners and acceptance criteria for the Phase 3 quality gate
