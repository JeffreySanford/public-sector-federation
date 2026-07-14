# Governance Quality Gates

## Purpose

Every component, pattern, or token must satisfy all quality gates before
publication. These gates ensure consistency, accessibility, performance,
and maintainability across the design system.

No exceptions—either the work passes all gates, or it is not published.

---

## The Seven Quality Gates

All gates must pass before a component moves from "Candidate" to "Active."

### Gate 1: Design Review

**Owner**: UX Lead + Senior Designers

**Checklist**:

- [ ] Problem statement and business value documented
- [ ] Figma component created with production-ready quality
- [ ] All approved variants included (primary, secondary, tertiary, etc.)
- [ ] All states defined (default, hover, active, disabled, loading, error)
- [ ] Responsive behavior validated (mobile, tablet, desktop)
- [ ] Visual consistency with design system language
- [ ] Token usage only (no hardcoded colors, spacing, or typography)
- [ ] Interaction specifications documented
- [ ] Content guidance provided (labels, placeholder text, error messages)
- [ ] Edge cases considered (empty states, overflow, long text)

**Outcome**: Approved ✅ or Return for Revisions ❌

**SLA**: Complete within 5 business days

---

### Gate 2: Accessibility Review

**Owner**: Accessibility Lead

**WCAG 2.1 AA Compliance Required**

**Checklist**:

- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Space, Arrows)
- [ ] Focus indicator is visible and meets contrast requirements
- [ ] Screen reader tested (NVDA, JAWS, or equivalent)
- [ ] ARIA labels and roles correct
- [ ] Color contrast ≥ 4.5:1 (normal text) or 3:1 (large text)
- [ ] No color-only communication (icons, states, errors)
- [ ] Responsive text scaling tested
- [ ] Motion/animation respects prefers-reduced-motion
- [ ] Form error messages clear and associated with inputs
- [ ] Semantic HTML structure used (buttons, links, headings, lists)

**Testing Tools**:
- Axe DevTools or similar
- Manual keyboard navigation
- Screen reader testing
- Contrast checker (WAVE, Lighthouse)

**Outcome**: Compliant ✅ or Require Changes ❌

**SLA**: Complete within 5 business days

---

### Gate 3: Component Implementation

**Owner**: Engineering Lead

**Checklist**:

- [ ] Component built in Angular (standalone component recommended)
- [ ] TypeScript types defined for all inputs/outputs
- [ ] Props API documented with examples
- [ ] Component follows naming convention (`public-[component-name]`)
- [ ] Accepts approved design tokens (no hardcoded values)
- [ ] Responsive without media queries (design system scales automatically)
- [ ] Tested in all three browsers (Chromium, Firefox, WebKit)
- [ ] No console warnings or errors
- [ ] Bundle size acceptable (< 50KB uncompressed)

**Outcome**: Approved ✅ or Revise ❌

**SLA**: Complete within 10 business days

---

### Gate 4: Unit Testing

**Owner**: Engineering Lead

**Checklist**:

- [ ] Unit tests cover all component states
- [ ] Tests cover user interactions (click, keyboard, form input)
- [ ] Tests verify accessibility attributes (aria-*, role, etc.)
- [ ] Tests verify token usage (spacing, colors, typography)
- [ ] Test coverage ≥ 80%
- [ ] All tests passing in CI/CD pipeline

**Coverage Targets**:
- Statements: ≥ 80%
- Branches: ≥ 75%
- Functions: ≥ 80%
- Lines: ≥ 80%

**Outcome**: Coverage met ✅ or Below threshold ❌

**SLA**: Complete before code review

---

### Gate 5: Storybook Documentation

**Owner**: Engineering Lead

**Checklist**:

- [ ] Story file created with all supported variants
- [ ] Stories include default, primary, secondary, tertiary variants
- [ ] All states documented (disabled, loading, error, success)
- [ ] Responsive behavior shown (mobile, tablet, desktop controls)
- [ ] Accessibility testing integrated (Axe addon in Storybook)
- [ ] Keyboard interactions documented
- [ ] Theme switching works (light/dark mode)
- [ ] Code examples included and copyable
- [ ] Args and controls configured
- [ ] Description and usage instructions provided

**Outcome**: Complete and validated ✅ or Incomplete ❌

**SLA**: Complete within 5 business days

---

### Gate 6: Zeroheight Documentation

**Owner**: Technical Writer + UX Lead

**Published Zeroheight page must include**:

- [ ] **Overview**: What is this component? When should you use it?
- [ ] **When to Use**: Clear guidance on when this component is appropriate
- [ ] **When NOT to Use**: Guidance on what to use instead
- [ ] **Anatomy**: Visual breakdown of component parts
- [ ] **Behavior**: How does it respond to user interaction?
- [ ] **Accessibility**: WCAG compliance, keyboard navigation, screen reader guidance
- [ ] **Responsive**: How does it adapt across breakpoints?
- [ ] **Content Guidelines**: Best practices for copy, labels, error messages
- [ ] **Examples**: 3-5 real-world usage examples
- [ ] **Variants**: Documentation of each variant with use case
- [ ] **Do's & Don'ts**: Visual do/don't examples
- [ ] **Code**: Link to Storybook, GitHub repository, NPM package
- [ ] **Links**: Figma, Storybook, source code, related components
- [ ] **Release History**: Version, date, what changed
- [ ] **Known Limitations**: Any known issues or planned improvements

**Outcome**: Published and indexed in Zeroheight ✅ or Incomplete ❌

**SLA**: Complete within 5 business days

---

### Gate 7: Governance Approval

**Owner**: Design System Council

**Checklist**:

- [ ] All six previous gates passed
- [ ] Component follows InnerSource contribution model (if external)
- [ ] Naming aligns with design system conventions
- [ ] Long-term maintenance plan documented
- [ ] Owner assigned and committed
- [ ] No breaking changes to existing components
- [ ] Semantic versioning applied
- [ ] Release notes prepared

**Council Decision**:
- ✅ **Approved**: Move to Active, publish, communicate
- ⚠️ **Conditional**: Approve pending minor fixes
- ❌ **Request Changes**: Specific feedback for revision
- 🔄 **Defer**: Revisit in next quarter

**SLA**: Council review at monthly meeting

---

## Gate Status Tracking

Use this checklist to track progress through all gates:

```
Component: [Name]
Target Release: [Quarter/Date]

Gate 1 - Design Review:      [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 2 - Accessibility:      [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 3 - Implementation:     [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 4 - Unit Testing:       [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 5 - Storybook Docs:     [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 6 - Zeroheight Docs:    [ ] ✅ | [ ] ⏳ | [ ] ❌
Gate 7 - Governance Approval: [ ] ✅ | [ ] ⏳ | [ ] ❌

Current Status: [Ready for next gate / Blocked on]
```

---

## When Gates Are Not Met

### Minor Issues (Can be fixed before release)

- [ ] Update component, re-run test, get approval
- [ ] SLA: 2 business days
- [ ] Document changes in release notes

### Major Issues (Require redesign)

- [ ] Return to previous stage
- [ ] Re-evaluate problem statement
- [ ] Consider alternative approach
- [ ] Discuss with Design System Council

### Accessibility Issues (Must be fixed)

- [ ] No exceptions for accessibility gates
- [ ] If WCAG 2.1 AA compliance cannot be met, component is not published
- [ ] Work with Accessibility Lead to find alternative approach

---

## Exception Process

**In rare cases, a component may proceed without passing all gates.**

**Who can approve exceptions**: Design System Council only

**Required documentation**:
- Why this exception is necessary
- What gate is being waived
- Time-bound remediation plan (e.g., "Fix by next release")
- Accessibility is **never** a candidate for exception

**Example**:
```
Exception Request: Status Chip
Gate: Zeroheight Documentation
Reason: Early adoption by 2 teams, can document in parallel
Remediation: Complete within 2 weeks
Owner: Jane Smith
Approval: Council vote - APPROVED
Timeline: Monitor and complete by [date]
```

**SLA for exception**: Decided at monthly Council meeting

---

## Quality Gate Metrics

Track whether quality gates are effective:

- ✅ % of components passing all gates on first attempt
- ✅ Average time from Candidate to Active
- ✅ Defect rate in newly published components
- ✅ Accessibility compliance score (should be 100%)
- ✅ Adoption rate (% of apps using newly published components)

---

## Related Documents

- [Governance Overview](./overview.md) - Strategic governance model
- [Intake Process](./governance-intake-process.md) - How requests come in
- [Release Process](./governance-release-process.md) - Steps to publish
- [Component Promotion](./component-promotion.md) - Lifecycle and evidence gates
