# STEP 18: Component Estate Audit - Expanded Checklist

**Goal**: Comprehensive inventory of all components, duplications, quality gaps, and evidence.

**Reference**: Original step in documentation-upgrade plan.

_Status update, July 21, 2026: this generic checklist duplicated the real, more detailed audit at
[18-component-estate-audit.md](../documentation-upgrade/18-component-estate-audit.md). Checked
against that doc and the live manifest rather than left stale._

## Preparation

- [x] Review current manifest
- [x] Run `pnpm manifest:check`
- [x] List all components in Storybook and code — 21 entries, all with `storybookStatus: complete`

## Audit Categories

### 1. Component Inventory

- [x] Catalog all wrappers (Button, Select, Dialog, etc.) — 21 manifest entries
- [x] Document variants, states, and props — flagship components complete; `ps-card`/`ps-tag`/`ps-toast`/
      `public-toast-service` API extraction completed July 21 (finding `API-PARTIAL-001` resolved)
- [ ] Map to design tokens — semantic and provider-bridge token references remain unpopulated
      (doc 18's own open item)

### 2. Duplication & Consolidation Opportunities

- [x] Identify duplicate candidates vs stable implementations — `ps-button` vs `ps-button-candidate`
      is the one active cluster
- [x] Flag Button Candidate vs main Button — tracked as `duplicationCluster: 'button-contract'`
- [x] Propose consolidation paths — decision recorded in
      [button-api-migration.md](../design-system/components/button-api-migration.md): retire
      `ps-button-candidate` as a case study, don't merge further

### 3. Quality & Evidence Review

- [x] Accessibility audit status — automated evidence complete for Button/Select/Dialog; manual
      NVDA review has a workflow ready ([nvda-manual-accessibility-review.md](./POST-SCRUB-CHECKLIST.md))
      but no completed review records yet
- [ ] Test coverage (unit + E2E) — `qa-remote`'s `test` target is typecheck-only, not real unit
      tests (a known, undocumented-until-now gap; see doc 20 acceptance criteria)
- [ ] Chromatic visual regression status — not reviewed in this pass
- [x] Playwright results — `verify:release`'s e2e suite passes (479-480/480 across every run this
      session; the 1-2 occasional failures were confirmed transient WebKit/Select timing flakes)

### 4. Gaps & Remediation

- [ ] Missing components from Figma/reference — Figma access remains pending for all entries
- [ ] Token boundary issues — native components still consume PrimeNG `--p-*` directly in places;
      not remediated
- [x] Documentation completeness — proprietary-content scrub and Button/Interaction-Stories renames
      landed; Starlight scope decided (designer-level only, no engineering-docs mirror)

## Deliverables

- [x] Updated component inventory page in Starlight — `ComponentStatusTable.astro` now renders all
      21 manifest entries live at build time
- [ ] Remediation backlog — no single consolidated backlog artifact exists yet (findings are
      tracked individually in the manifest and docs 18-20)
- [x] Updated manifest entries — API extraction, Button-candidate rename, selector/escape-hatch
      review all landed

**Verification**:

- Run full test suite — done repeatedly via `pnpm verify:release`
- Update Step 10 checklist as needed — done
