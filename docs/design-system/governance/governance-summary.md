# Design System Governance Summary

A concise overview for leadership and decision makers.

## Purpose

The design system should be governed as a shared platform product. Teams should
be able to propose evidence-backed improvements, contribute implementation work,
and help maintain the system, while maintainers control what becomes an approved
shared capability.

## Core Principle

**Make contribution easy. Make evidence expected. Make promotion controlled.**

This avoids two extremes:

- **Too centralized**: Teams wait, create workarounds, or cannot ship.
- **Too decentralized**: Every app creates duplicate components, variants, and themes.

The model: **InnerSource governance**—teams contribute; maintainers approve shared contracts.

---

## The Governance Model

### Zeroheight as the Front Door

Zeroheight is the visible governance layer that answers:

- What patterns are approved and ready to use?
- Which variants are allowed?
- What evidence proves it works?
- Who owns this pattern?
- Where are the Storybook examples?

Zeroheight **publishes decisions** but does not compile tokens or configure
applications. The repository remains the implementation source of truth.

### Three Key Roles

| Role | Responsibility |
| --- | --- |
| **Contributors** | Anyone can propose ideas, improvements, examples, docs, PRs |
| **Maintainers** | Approve protected contracts (tokens, APIs, accessibility, breaking changes) |
| **Governance Council** | Strategy, roadmap, conflict resolution, promotion decisions |

### Governance Flow

```
Contribution Proposal
  ↓ (evidence-backed)
Triage & Prioritization
  ↓
Design Discovery & Approval
  ↓
Development & Technical Review
  ↓
Validation (Storybook + Shell + Playwright)
  ↓
Promotion Decision
  ↓
Zeroheight Publication
  ↓
Enterprise Adoption
```

---

## Evidence Gates: What Must Be Proven

Before a component or pattern becomes **Active** (approved for broad adoption), it must pass these gates:

| Gate | Evidence Required |
| --- | --- |
| **Contribution proposal** | Problem statement, user impact, business value, existing solutions reviewed |
| **Triage** | Decision: reuse, extend, create, keep local, or research |
| **Design approval** | Figma proposal, states, accessibility notes, token requirements |
| **Technical review** | API design, token usage, PrimeNG mapping, maintainability, security |
| **Storybook contract** | Live isolated examples with supported states and variants |
| **Runtime validation** | Shell, remote, Playwright, accessibility, theme validation |
| **Publication** | Zeroheight page with owner, status, links to all evidence |

---

## InnerSource Contribution Model

### Who Can Propose

Anyone (product teams, designers, platform team):

- Ideas and improvements
- Component implementations
- Storybook examples
- Documentation
- Pull requests

### Who Approves

Only authorized maintainers and named decision owners can approve changes to
protected shared contracts:

- Token changes
- Breaking API changes
- Core component APIs
- Accessibility standards
- PrimeNG provider mapping
- PrimeNG preset and theme changes
- Runtime integration behavior

This balance lets product teams contribute without creating uncontrolled forks.

---

## Ownership Structure

**UX Design Owns:**
- Visual intent
- Interaction intent
- Content guidance
- Design tokens
- Variants and states

**Engineering Owns:**
- Component implementation
- Storybook and tests
- Versioning and releases
- Framework behavior
- Performance
- Backward compatibility

**Shared Ownership:**
- Component APIs
- Breaking changes
- Accessibility proof
- PrimeNG preset changes
- Roadmap priorities
- Adoption metrics

---

## Lifecycle Stages

| Status | Meaning |
| --- | --- |
| **Idea** | Identified need not yet accepted for discovery |
| **Proposed** | Accepted for discovery, not yet implemented |
| **Experimental** | Implementation underway; API and guidance may change |
| **Candidate** | Evidence complete; ready for promotion review |
| **Active** | Approved, tested, documented, supported |
| **Deprecated** | Available temporarily with migration guidance |
| **Retired** | No longer supported or distributed |

---

## Key Success Measures

### For Product Teams
- ✅ Find approved patterns in < 5 minutes
- ✅ Copy working Storybook examples without modification
- ✅ Build views without requesting exceptions
- ✅ Review focuses on business logic, not governance

### For the Design System
- ✅ > 80% of views built from approved patterns
- ✅ Contribution proposals submitted regularly (1-2 per quarter)
- ✅ Average review turnaround < 5 business days
- ✅ > 90% of requests resolved through reuse or extension
- ✅ Zero accessibility compliance failures

---

## Recommended Next Step

**Pilot the governance model with one reference component** (such as Button or
Status Chip).

Run it through the full process:

```
Contribution Proposal
  → Design & Implementation
  → Storybook Validation
  → Shell & Remote Validation
  → Promotion Decision
  → Zeroheight Publication
  → Measure Adoption
```

This pilot should demonstrate:
- Fewer duplicate implementations
- Consistent accessibility behavior
- Simpler PrimeNG upgrades
- Faster delivery for later adopters

Use this pilot as a template for the rest of the system.

---

## What Enables This Model

For the governance model to work, the organization must provide:

### Discovery
- Searchable, current Zeroheight documentation
- Clear guidance on when to use each pattern
- Links to Storybook examples and Figma reference
- Lifecycle status visible upfront

### Code
- Copyable Storybook examples
- Stable Angular packages with semantic versioning
- TypeScript types for all component APIs
- Example data shapes for common patterns

### Support
- Named maintainers for each component
- Published review SLAs (maximum wait time)
- Contribution templates
- Office hours or async support channel
- Documented exception paths

### Validation
- Automated linting and testing
- Storybook validation
- Shell and remote integration testing
- Accessibility compliance checking
- Performance regression detection

---

## Roles and Meetings

### Governance Groups

| Group | Responsibilities | Frequency |
| --- | --- | --- |
| Design system council | Strategy, roadmap, governance decisions, conflict resolution | Monthly |
| Working session | Review requests, active work, bugs, releases | Weekly |
| Design & engineering sync | Coordinate upcoming components and implementation | Bi-weekly |
| Health review | Metrics, adoption, deprecations, strategic investments | Quarterly |

### Named Decision Makers Needed

- Design system council chair
- UX design lead
- Engineering lead
- Accessibility lead
- Platform/shell lead
- Product team representative(s)
- Executive sponsor (funding, alignment)

---

## Core Operating Principle

**Following the governed path must be easier than creating a local fork.**

When this principle is upheld, governance is invisible during normal development.
It becomes visible only when teams need to extend or change the shared system.

The developer should think: "Oh, this example is perfect, I can copy it directly."

When that happens, the governance model is working.

---

## Related Documents

For implementation details, see:

- [Governance Overview](./overview.md) - Complete governance framework with metrics and cadence
- [Developer Journey](./developer-journey.md) - External product-team perspective
- [Contribution Process](./contribution-process.md) - Detailed intake and triage process
- [Component Promotion](./component-promotion.md) - Lifecycle and promotion evidence
- [InnerSource Contribution Model](./innersource-contribution-model.md) - Detailed roles and approval model
- [Rollout Implementation](./rollout-implementation.md) - Phased rollout strategy
- [Zeroheight Governance Model](./zeroheight-governance-model.md) - Zeroheight page structure and ownership
