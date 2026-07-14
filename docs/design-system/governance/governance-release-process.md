# Governance Release Process

## Purpose

The release process ensures every published component is versioned correctly,
communicated clearly, and adopted smoothly across teams.

---

## Release Lifecycle

### Phase 1: Preparation

**When**: Component passes all quality gates and governance approval

**Steps**:

1. **Assign Version**
   - Determine version type: Patch, Minor, or Major
   - Apply semantic versioning: `MAJOR.MINOR.PATCH`
   - Document decision in release notes

   | Version | Trigger | Example |
   | --- | --- | --- |
   | Patch | Bug fixes, docs updates | 1.0.0 → 1.0.1 |
   | Minor | New components, additive features | 1.0.0 → 1.1.0 |
   | Major | Breaking changes, API changes | 1.0.0 → 2.0.0 |

2. **Prepare Release Notes**
   - New components: Description, links to Storybook and Figma
   - Breaking changes: Migration guide and deprecation path
   - Bug fixes: Brief description and affected version
   - Format template:
     ```
     ## Version 1.2.0 - July 14, 2026
     
     ### New
     - Status Chip component (PR #123, Zeroheight page)
     - Filter Panel pattern (replaces old FilterBar)
     
     ### Fixed
     - Button loading state animation (Issue #456)
     - Table pagination accessibility (Issue #789)
     
     ### Deprecated
     - FilterBar component (use Filter Panel instead, migration guide)
     
     ### Breaking
     - Button API: `buttonText` prop renamed to `label` (migration guide)
     
     ### Related
     - Upgrade guide: https://zeroheight.../upgrade-1.2.0
     - Breaking changes: https://zeroheight.../breaking-changes
     ```

3. **Update All Artifacts**
   - Figma library version
   - Storybook version/tag
   - Package.json version
   - NPM package version
   - GitHub release tag

4. **QA Final Checks**
   - All tests passing
   - No console warnings
   - Zeroheight page published and accurate
   - Links from Figma, Storybook, and docs are correct
   - Backward compatibility maintained (or migration path clear)

**Deliverable**: Release candidate ready for publication

**SLA**: 3 business days

---

### Phase 2: Approval

**Who**: Design System Council (or delegated release manager)

**Checklist**:

- [ ] Version number assigned correctly
- [ ] Release notes complete and accurate
- [ ] Migration guide provided (if breaking changes)
- [ ] All artifacts updated (Figma, Storybook, Zeroheight, NPM)
- [ ] No critical issues in current release
- [ ] Accessibility compliance 100%
- [ ] Documentation current in Zeroheight

**Approval Options**:
- ✅ **Approved**: Proceed to publication
- ⚠️ **Approved with conditions**: Fix specified issues before publication
- ❌ **Hold**: Do not publish until approved

**SLA**: 2 business days

---

### Phase 3: Publication

**Who**: Release Manager or Engineering Lead

**Steps**:

1. **Publish to NPM**
   ```bash
   npm publish --tag latest
   ```

2. **Tag GitHub Release**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

3. **Publish Zeroheight**
   - Ensure component page is marked as "Active"
   - Verify all links are correct
   - Confirm version number displayed

4. **Update Storybook**
   - Deploy Storybook to latest
   - Add version badge if applicable
   - Update any version-specific documentation

5. **Announce Release**
   - Post to #design-system Slack channel with:
     - Version number
     - What changed (link to release notes)
     - Migration guide (if breaking)
     - Link to Zeroheight page
     - Author/contributor credits

   **Template**:
   ```
   📦 Design System Release 1.2.0
   
   ✨ New:
   • Status Chip component
   • Filter Panel pattern
   
   🐛 Fixed:
   • Button loading animation
   • Table pagination a11y
   
   ⚠️ Breaking:
   • Button API: buttonText → label (migration guide)
   
   Links:
   📖 Zeroheight: https://...
   📚 Storybook: https://...
   🔗 Release Notes: https://...
   ```

**Deliverable**: Component published and announced

**SLA**: Same day as approval

---

### Phase 4: Communication

**Who**: Design System team

**Timeline**: Coordinated release announcement

**Channels**:

| Channel | Timing | Message |
| --- | --- | --- |
| Slack #design-system | Release day | Release summary + links |
| Weekly office hours | Following week | Demo, Q&A, adoption tips |
| Email newsletter | Monthly | Aggregate of recent releases |
| Zeroheight changelog | Release day | Auto-linked from page |
| GitHub releases page | Release day | Technical release notes |

**For Major Versions or Breaking Changes**:

- Send heads-up email 2 weeks before release
- Document migration path clearly
- Offer support during transition
- Plan deprecation timeline (e.g., "3 months support, then removed")

**Deliverable**: Multiple communication channels notified

**SLA**: Same day as publication

---

### Phase 5: Adoption Support

**Who**: Design System team + individual component maintainers

**Timeline**: 2 weeks post-release

**Activities**:

- Monitor for questions and issues
- Provide adoption support in office hours
- Track adoption metrics (which teams are using new version)
- Respond to bug reports within SLA
- For breaking changes: Monitor migration progress, extend support timeline if needed

**Deliverable**: Support window open and active

**Duration**: 2 weeks, extendable if adoption is slow

---

## Release Schedule

### Regular Release Cycle

| Cadence | Pattern | Examples |
| --- | --- | --- |
| **Patch Release** | As needed | Bug fixes, urgent a11y fixes |
| **Minor Release** | Bi-weekly | New components, additive features |
| **Major Release** | Quarterly | Breaking changes, significant API changes |

### Release Window

- **Release day**: Every other Thursday
- **Cutoff**: Tuesday end of business
- **Testing**: Wednesday
- **Publish**: Thursday morning

### Freeze Periods

No releases during:
- Company holidays or shutdowns
- End of quarter (final 2 weeks)
- Major product launches by consuming teams

---

## Breaking Changes

**Requires Major Version Release**

### Before Releasing Breaking Changes

1. **Communicate Early** (4 weeks before)
   - Email to all consuming teams
   - Explain why change is necessary
   - Show before/after examples
   - Provide migration guide

2. **Provide Migration Path**
   - Document step-by-step migration
   - Provide code examples
   - Test migration with 2-3 real teams
   - Offer office hours support

3. **Deprecation Timeline** (example)
   - Version 1.5: Mark as deprecated (still works)
   - Version 1.6-1.x: Maintain deprecated version (6 months)
   - Version 2.0: Remove deprecated code

4. **Get Approval** (Design System Council)
   - Review migration path
   - Assess impact on consuming teams
   - Confirm timeline is reasonable

### Publishing Breaking Changes

- [ ] 4-week advance notice sent
- [ ] Deprecation period clearly documented
- [ ] Migration guide comprehensive
- [ ] Zeroheight updated with warning banner
- [ ] Release notes include migration path

**SLA**: Breaking change release requires 4-week notice minimum

---

## Hotfix Process (Emergency)

**For critical bugs or accessibility issues**

### Fast-Track Release

**Trigger**: Critical defect affecting production, security issue, or accessibility compliance

**Process**:

1. **Report**: File urgent issue tagged `critical`
2. **Triage**: Engineering lead reviews within 4 hours
3. **Fix**: Implement and test
4. **Patch Release**: Publish as patch version immediately
5. **Announce**: Post to Slack and notify consuming teams
6. **Follow-up**: Full release notes in next regular cycle

**SLA**: Hotfix published within 24 hours

**Allowed hotfixes**: Bug fixes and accessibility issues only (no features)

---

## Release Checklist

Use this before publishing any release:

```
[ ] Version assigned and documented
[ ] All tests passing
[ ] Accessibility compliance 100%
[ ] Release notes complete
[ ] Figma library updated
[ ] Storybook version tagged
[ ] NPM package version updated
[ ] Zeroheight page finalized
[ ] All links verified working
[ ] Governance approval received
[ ] Migration guide complete (if breaking)
[ ] Slack announcement drafted
[ ] GitHub release prepared

Ready to publish: [ ] YES [ ] NO - Hold for fixes
```

---

## Version History Tracking

Every version published should be tracked:

| Version | Release Date | Components | Breaking? | Status |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-07-01 | Button, Card, Table | No | Active |
| 1.1.0 | 2026-07-15 | Status Chip, Badge | No | Active |
| 2.0.0 | 2026-10-01 | Multiple API changes | Yes | Active |
| 1.1.1 | 2026-07-16 | (Hotfix) | No | Active |

---

## Release Metrics

Track the health of your release process:

- ✅ Average time from approved to published
- ✅ % of releases on schedule
- ✅ % of releases with complete documentation
- ✅ Adoption rate (% of teams on latest version)
- ✅ Hotfix frequency (should be rare)
- ✅ Issue resolution time (how fast bugs are fixed)

---

## Related Documents

- [Governance Overview](./overview.md) - Strategic governance model
- [Intake Process](./governance-intake-process.md) - How requests come in
- [Quality Gates](./governance-quality-gates.md) - Requirements before release
- [Component Promotion](./component-promotion.md) - Lifecycle and evidence gates
