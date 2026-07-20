# PR Plan: Scrub PrimeNG-Proving Components & Copy Across All Four Remotes

**Branch:** `agent/remote-realignment-scrub`
**Type:** Single large PR (per direction)
**Scope:** `apps/services-remote`, `apps/reporting-remote`, `apps/admin-remote`, `apps/qa-remote`
**Explicit non-goal:** No new table/tile patterns in this PR. This PR removes proof-of-concept
components and copy and routes everything through the *existing* `@public-sector/ui-patterns`
registry. New business patterns (tables, tiles) are a tracked fast-follow, not part of this change.

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
right call to scrub it now that the wrapper registry (17 components, all `active` except the
`candidate` `ps-up-button`) is solid enough to carry real screens.

## 2. Current registry gap (why some raw HTML has to stay, for now)

`packages/ui-patterns` does **not** currently export a table, text input, or checkbox/switch
wrapper. Only `ps-select` exists for form controls. That means:

- Raw `<table>` in `services-remote` (`case-table`) and `reporting-remote` (`report-table`) has no
  governed replacement yet.
- Raw `<input>` / `<input type="checkbox" role="switch">` in `services-remote` and `admin-remote`
  has no governed replacement yet.

Per direction, **this PR does not build those wrappers.** Where a governed replacement exists
(`ps-button`, `ps-card`, `ps-tag`, `ps-progress`, `ps-dialog`, `ps-toast`, `ps-menu`), we migrate to
it and delete the local CSS that reinvented it. Where no wrapper exists, we leave the native
element in place **but tag it explicitly** (see §5) so the manifest/backlog carries the gap forward
instead of hiding it — consistent with how this repo already treats `ps-up-button` as `candidate`
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

**Status as of this writing: nothing in this plan has been committed yet — all items below are
open.** Check items off in this file as commits land on `agent/remote-realignment-scrub`, and
reference the commit SHA next to each so this stays an honest log, not just a plan.

### Copy pass
- [ ] `services-remote` header copy rewritten (no "proving" language)
- [ ] `reporting-remote` header copy rewritten (no "to prove" language)
- [ ] `admin-remote` header copy rewritten (no "validates" language)
- [ ] `qa-remote` workbench components audited for leftover "proving" language

### `services-remote` component migration
- [ ] 3× `metric-card` → `ps-card`
- [ ] Action buttons (Create case, Send notice, Request document, Add note) → `ps-button`
- [ ] Status chips → `ps-tag`
- [ ] `<progress>` → `ps-progress`
- [ ] `serviceType` select → `ps-select`
- [ ] `// GAP:` comments added for `caseId`, `applicantName`, `appointmentDate` inputs
- [ ] `// GAP:` comment added for `expediteReview` checkbox
- [ ] `// GAP:` comment added for `case-table`
- [ ] `services-remote.component.css` trimmed to layout-only rules

### `reporting-remote` migration
- [ ] `// GAP:` comment added for `report-table`
- [ ] `reporting-remote.component.css` audited/trimmed

### `admin-remote` component migration
- [ ] `admin-button` instances (Open dialog, Save settings, action-menu buttons) → `ps-button`
- [ ] `// GAP:` comments added for audit logging / maintenance mode switches
- [ ] `// GAP:` comment added for temporary-password input
- [ ] `admin-remote.component.css` trimmed to layout-only rules

### `qa-remote` story cleanup
- [ ] Coverage overlap confirmed between `primeng-playground.stories.ts` and the acceptance
      story files (button-tag, dialog-toast)
- [ ] `primeng-playground.stories.ts` deleted
- [ ] `problem-areas.stories.ts` renamed to `edge-case-states.stories.ts` with reframed copy
- [ ] `opinionated-wrapper-contract.stories.ts` copy confirmed clean (no action expected)

### Backlog / gap tracking
- [ ] `docs/design-system/backlog/table-input-checkbox-wrappers.md` created
- [ ] All `// GAP:` comments reference that backlog doc consistently
- [ ] `grep -rn "// GAP:" apps/` run and result count sanity-checked against the list above

### Validation gate (run once all of the above is checked off)
- [ ] `pnpm lint`
- [ ] `pnpm lint:links`
- [ ] `pnpm lint:wrappers`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm manifest:check`
- [ ] `pnpm build`
- [ ] `pnpm test:e2e`
- [ ] `pnpm chromatic` (visual review of services-remote, reporting-remote, admin-remote)
- [ ] Manual copy check: no remote's on-screen text says "proving," "validates," or "to prove"
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
  canonical-contract page (this is the `ps-up-button` candidate contract surface). No action
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
