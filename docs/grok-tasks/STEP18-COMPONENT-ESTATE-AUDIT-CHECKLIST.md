# STEP 18: Component Estate Audit - Expanded Checklist

**Goal**: Comprehensive inventory of all components, duplications, quality gaps, and evidence.

**Reference**: Original step in documentation-upgrade plan.

## Preparation

- [ ] Review current manifest
- [ ] Run `pnpm manifest:check`
- [ ] List all components in Storybook and code

## Audit Categories

### 1. Component Inventory

- [ ] Catalog all wrappers (Button, Select, Dialog, etc.)
- [ ] Document variants, states, and props
- [ ] Map to design tokens

### 2. Duplication & Consolidation Opportunities

- [ ] Identify duplicate candidates vs stable implementations
- [ ] Flag Button Candidate vs main Button
- [ ] Propose consolidation paths

### 3. Quality & Evidence Review

- [ ] Accessibility audit status
- [ ] Test coverage (unit + E2E)
- [ ] Chromatic visual regression status
- [ ] Playwright results

### 4. Gaps & Remediation

- [ ] Missing components from Figma/reference
- [ ] Token boundary issues
- [ ] Documentation completeness

## Deliverables

- [ ] Updated component inventory page in Starlight
- [ ] Remediation backlog
- [ ] Updated manifest entries

**Verification**:

- Run full test suite
- Update Step 10 checklist as needed
