# Governance Intake Process

## Purpose

The intake process ensures every design-system request is evaluated consistently,
prioritized appropriately, and planned into the roadmap. This process applies to:

- New components
- Component enhancements
- Design patterns
- Design tokens
- Accessibility improvements
- Documentation updates
- Any change impacting Figma, Storybook, or Zeroheight

---

## The Five-Step Process

### Step 1: Submit Request

**Who**: Anyone from Product, Engineering, UX, Architecture, or Leadership

**How**: Create a request (Jira issue, GitHub discussion, or pull request) that includes:

- **Problem**: Clear business problem being solved
- **Impact**: Which products or applications are affected
- **Evidence**: User research, customer feedback, or duplicate implementations
- **Visual**: Mockups or screenshots if available
- **Deadline**: Known business drivers or urgency
- **Consumers**: Expected reuse across teams

**Deliverable**: Completed intake request assigned to Design System Product Owner

**SLA**: Acknowledge receipt within 2 business days

---

### Step 2: Initial Review

**Who**: Design System Product Owner

**Decision**: Does this request belong in the design system?

**Criteria**:
- ✅ Is the problem clear and specific?
- ✅ Is there sufficient evidence to evaluate?
- ✅ Does this belong in shared systems (vs. domain-specific feature)?

**Outcomes**:
- **Accept for evaluation**: Move to Step 3
- **Return for clarification**: Request more information
- **Reject as out of scope**: Explain why and recommend alternative

**Deliverable**: Request accepted or returned for more information

**SLA**: Review within 3 business days

---

### Step 3: Search for Existing Solutions

**Who**: Design System Product Owner (with support from UX/Engineering)

**How**: Determine whether existing capability already satisfies the request

**Search locations**:
- Figma component library
- Storybook component catalog
- Zeroheight documentation
- Active backlog or in-progress work

**Outcomes**:

| Outcome | Action | Next Step |
| --- | --- | --- |
| **Existing match found** | Document and link to existing solution | Requester adopts existing component |
| **Similar component exists** | Propose extension instead of new component | Return to requester: "This can be extended" |
| **No existing match** | Proceed to Step 4 | Continue evaluation |

**Deliverable**: Duplicate analysis and documentation

**SLA**: Complete within 3 business days

---

### Step 4: Assess Business Value & Priority

**Who**: Design System Product Owner + Product Leadership + UX Leadership

**Evaluate**:

| Factor | Questions | Weight |
| --- | --- | --- |
| **Reuse Potential** | How many teams/apps need this? Expected across >3 teams? | High |
| **Impact** | Affects adoption, accessibility, compliance, or consistency? | High |
| **Strategic Alignment** | Aligns with product roadmap or governance direction? | High |
| **Effort** | Estimated scope (small, medium, large)? | Medium |
| **Maintenance** | Who will own it long-term? Is it sustainable? | Medium |
| **Timeline** | Critical deadline or can wait? | Low-Medium |

**Scoring**:
- **P0 (Critical)**: High reuse + strategic + accessibility gap
- **P1 (High)**: Multiple teams affected + clear business value
- **P2 (Medium)**: Useful reuse + tactical need
- **P3 (Low)**: Nice to have + single team usage

**Outcomes**:
- **Approved for roadmap**: Assigned to upcoming quarter
- **Deferred**: Add to future roadmap, check back in 6 months
- **Rejected**: Recommend local or alternative approach

**Deliverable**: Business value assessment, priority, and roadmap placement

**SLA**: Complete within 5 business days

---

### Step 5: Technical Assessment

**Who**: Engineering Lead (with support from Architecture/Platform)

**Evaluate**:

| Area | Questions |
| --- | --- |
| **Implementation Complexity** | Estimated effort and complexity level? |
| **Architecture** | Any architectural decisions or dependencies? |
| **Performance** | Performance impact or concerns? |
| **Testing** | Unit tests, visual regression, accessibility required? |
| **Framework** | Works across all frameworks and remotes? |
| **Risks** | Known risks or challenges? |

**Output**: Technical assessment documenting:
- Estimated effort (hours/days)
- Implementation approach
- Required testing
- Any architectural recommendations
- Identified risks

**Deliverable**: Technical assessment recorded in request

**SLA**: Complete within 5 business days

---

## From Intake to Roadmap

Once all five steps are complete, the request is:

1. **Documented** in one place with all assessments
2. **Prioritized** on the roadmap
3. **Assigned** to a quarter or sprint
4. **Communicated** to the requester
5. **Scheduled** for design exploration or implementation

---

## Decision Matrix

| Situation | Decision | Next Step |
| --- | --- | --- |
| **Existing component matches exactly** | Reuse | Point to Zeroheight page |
| **Existing component can be extended** | Extend | Minor change approval process |
| **New component, high priority, clear need** | Create | Move to Design Exploration |
| **New component, lower priority** | Defer | Add to Q2/Q3 roadmap, revisit quarterly |
| **Domain-specific feature, not reusable** | Keep Local | Recommend component composition approach |
| **Insufficient evidence or unclear problem** | Clarify | Return to requester for more information |
| **Out of scope for design system** | Reject | Recommend alternative approach, offer support |

---

## Intake Request Template

Use this template for all intake requests:

```
## Problem
What is the business problem this solves?
Who experiences this problem?

## Evidence
- [ ] User research or feedback
- [ ] Duplicate implementations (list them)
- [ ] Accessibility or compliance gap
- [ ] Customer support tickets
- [ ] Other evidence

## Expected Consumers
Which products or teams will use this?
How many teams? Expected reuse?

## Visual Reference
Attach mockups, screenshots, or Figma link

## Alternatives Reviewed
Have you reviewed existing components?
Why don't they solve this?

## Timeline
Any business drivers or deadlines?

## Proposed Owner
Who will maintain this long-term?
```

---

## Escalation Path

| Situation | Escalate To | Timeline |
| --- | --- | --- |
| Disagreement on priority | Design System Council | Monthly meeting |
| Accessibility concern | Accessibility Lead | Immediately |
| Architecture decision needed | Architecture Board | As needed |
| Executive decision required | Executive Sponsor | As needed |

---

## Success Measures

- ✅ Intake requests answered within SLA (2-5 business days per step)
- ✅ > 90% of requests have clear decision (not "pending indefinitely")
- ✅ Duplicate requests identified and merged
- ✅ Roadmap transparent and communicated
- ✅ Product teams satisfied with feedback

---

## Related Documents

- [Governance Overview](./overview.md) - Strategic governance model
- [Quality Gates](./governance-quality-gates.md) - Requirements before release
- [Release Process](./governance-release-process.md) - Steps to publish
- [Component Promotion](./component-promotion.md) - Lifecycle and evidence gates
