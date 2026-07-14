# Governance Overview

## Purpose

The design system should be managed as a shared platform product. Teams should
be able to propose evidence-backed improvements, contribute implementation
work, and help maintain the system, while maintainers control what becomes an
approved shared capability.

This governance layer answers a different question than the runtime
architecture:

- Runtime architecture: how tokens, wrappers, shell, remotes, and validation
  technically work.
- Governance: how teams decide what belongs in the shared system, how evidence
  is reviewed, and how approved guidance is published.

## Core Principle

Make contribution easy. Make evidence expected. Make promotion controlled.

The design system should be governed as a product. Governance defines how
changes are proposed, reviewed, released, communicated, measured, and revisited.

That means the model is neither fully centralized nor fully open-ended:

| Model | Risk |
| --- | --- |
| Too centralized | Teams wait, create workarounds, or cannot ship. |
| Too decentralized | Apps create duplicate components, variants, and themes. |
| InnerSource governance | Teams contribute; maintainers approve shared contracts. |

## Zeroheight Recommendation

Zeroheight should be the governed front door for approved design-system
guidance, lifecycle status, ownership, migration information, and evidence. It
should record and communicate decisions made by the responsible design,
engineering, platform, and accessibility owners.

It should not create runtime tokens, compile packages, configure `remoteEntry`
URLs, or automatically approve promotion.

Use this compact operating model:

```text
People decide
Repositories implement
Tests provide evidence
Zeroheight publishes the governed result
```

## Governance Flow

```text
request or opportunity
  -> evidence-backed contribution proposal
  -> triage and prioritization
  -> design discovery
  -> design approval
  -> development contribution
  -> technical review
  -> Storybook and runtime validation
  -> promotion decision
  -> Zeroheight publication
  -> enterprise adoption
```

The important first step is intake. A design-system change should explain the
problem, impacted users, reuse evidence, business value, and why the solution
belongs in the shared system instead of one application.

The intake model should be treated as a contribution proposal, not as a ticket
queue where product teams ask a central group to build everything. A proposed
change is a product investment decision for the shared platform.

## Contribution Proposal

Before design or code starts, the proposing team should provide enough context
for maintainers to decide whether the work belongs in the design system.

Required information:

- problem statement;
- user impact;
- business impact;
- evidence or data;
- existing solutions reviewed;
- proposed scope;
- requesting team;
- expected consumers;
- proposed owner.

Useful evidence can come from user research, customer feedback, support
tickets, duplicate implementations, accessibility defects, repeated bugs,
compliance needs, or enterprise standardization requirements.

Example:

```text
Four applications implement separate status indicators, and two have known
accessibility defects because status is communicated by color alone.
```

That proposal is stronger than:

```text
We need a status chip component.
```

## Decision Questions

Before a new shared component, token, or pattern is promoted, governance should
answer:

- What problem are we solving?
- Who experiences the problem?
- How often does it occur?
- What evidence shows this should be shared?
- Does an existing pattern already solve it?
- Is this a component, pattern, token, or product feature?
- Does it improve accessibility, consistency, maintainability, or reuse?
- Which team owns it after publication?
- What evidence proves it works?

## Do Not Promote Gate

Not every useful UI belongs in the design system.

Keep work local when it is:

- single-application only;
- tightly coupled to one domain workflow;
- unsupported by reuse evidence;
- better built as application composition over existing primitives.

Promote work when it is reusable across domains, reduces duplication, improves
accessibility or consistency, and has enough evidence to support other teams.

## InnerSource Model

Anyone can propose:

- ideas;
- component improvements;
- Storybook examples;
- documentation;
- pull requests;
- migration paths.

Only authorized maintainers and named decision owners may approve changes to
protected shared contracts, including:

- token changes;
- breaking API changes;
- core component APIs;
- accessibility standards;
- PrimeNG provider mapping;
- PrimeNG preset and theme changes;
- runtime integration behavior.

This lets product teams contribute without allowing uncontrolled forks.

## Evidence Gates

Promotion should depend on evidence, not just completion of code.

| Gate | Evidence |
| --- | --- |
| Contribution proposal | Problem, impact, reuse case, requesting team, expected consumers, proposed owner. |
| Triage | Reuse, extend, create, keep local, or research decision. |
| Design approval | Figma proposal, states, accessibility, token requirements. |
| Technical review | API, token usage, PrimeNG mapping, maintainability, security. |
| Storybook contract | Supported states, variants, content, theme behavior. |
| Runtime validation | Shell, remote, Playwright, accessibility, overlay proof when needed. |
| Publication | Zeroheight page with owner, status, guidance, evidence, change notes. |

## Zeroheight Role

Zeroheight is the visible governance and adoption layer.

A useful source-of-truth split is:

| Tool | Source Of Truth For |
| --- | --- |
| Figma | Design assets, anatomy, interaction intent, and design exploration. |
| Source repository | Component implementation, token build, tests, and release artifacts. |
| Storybook | Live implementation examples, states, and component behavior. |
| Zeroheight | Published guidance, approved usage, lifecycle status, owners, decisions, and evidence links. |

It should show:

- what teams should use;
- when to use it;
- approved variants;
- lifecycle status;
- owner;
- accessibility guidance;
- links to Figma, Storybook, source, and validation evidence;
- migration and deprecation guidance;
- change history.

Zeroheight can be the human handoff bridge between Figma and engineering. It
records decisions and links evidence; people approve, repositories implement,
and tests prove behavior.

Proposed future policy: once the organization approves Zeroheight as the
governance channel, guidance that has not been published there should be
treated as experimental or not yet approved for broad product-team consumption.
Until then, agreed repository documentation should serve as the interim
governance record.

## Token Governance Path

Token changes need their own governance path because they affect registry
wrappers, direct legacy PrimeNG usage, overlays, shell-mounted remotes, and
application theming.

```text
token proposal
  -> design intent and source-token review
  -> semantic mapping approval
  -> source-controlled implementation
  -> generated CSS and PrimeNG adapter
  -> automated validation
  -> versioned release
  -> Zeroheight token guidance and change notice
```

Token review should answer:

- Is the source value approved?
- Is the semantic name provider-independent?
- Is the PrimeNG mapping internal to the preset or wrapper layer?
- Are light and dark modes covered?
- Is the change breaking?
- Which teams, components, or remotes are affected?

## Lifecycle

| Status | Meaning |
| --- | --- |
| Idea | Identified need that has not been accepted for discovery. |
| Proposed | Accepted for discovery and triage, but not yet implemented. |
| Experimental | Implementation under development; API and guidance may change. |
| Candidate | Evidence complete enough for promotion review. |
| Active | Approved, versioned, tested, documented, and supported. |
| Deprecated | Still available temporarily with migration guidance. |
| Retired | No longer supported or distributed. |

Lifecycle status should be visible in Zeroheight and backed by registry
metadata or source-controlled documentation. See
[Component Promotion](./component-promotion.md) for promotion evidence and
decision rules.

## Operational Processes

The governance model includes three core operational workflows:

### 1. Intake Process

How requests come in, are evaluated, and enter the roadmap.

**Five-step process**:
1. Submit request (with problem, impact, evidence)
2. Initial review (does this belong in the system?)
3. Search for existing solutions (reuse, extend, or create?)
4. Assess business value (priority and timeline)
5. Technical assessment (implementation feasibility)

See [Intake Process](./governance-intake-process.md) for detailed workflow, decision matrix, and SLAs.

### 2. Quality Gates

Seven required gates that every component must pass before publication.

**Gates**:
1. Design Review (visual consistency, variants, responsiveness)
2. Accessibility Review (WCAG 2.1 AA compliance)
3. Component Implementation (TypeScript, responsive, tested)
4. Unit Testing (≥80% coverage)
5. Storybook Documentation (all states, examples, controls)
6. Zeroheight Documentation (published guidance and standards)
7. Governance Approval (Design System Council sign-off)

See [Quality Gates](./governance-quality-gates.md) for detailed checklists and exceptions process.

### 3. Release Process

Steps to publish, communicate, and support adoption of new versions.

**Phases**:
1. Preparation (version assignment, release notes, QA)
2. Approval (Design System Council review)
3. Publication (NPM, GitHub, Zeroheight, Storybook)
4. Communication (Slack, email, office hours)
5. Adoption Support (2-week window for questions and hotfixes)

See [Release Process](./governance-release-process.md) for schedule, breaking changes policy, hotfix procedures, and metrics.

---

## Proposed Governance Structure

The roles, approval bodies, metrics, and operating cadence below are proposed
starting points. Existing enterprise teams and decision authorities should be
mapped onto them before adoption.

| Group | Responsibilities |
| --- | --- |
| Design system council | Strategy, roadmap, governance decisions, conflict resolution. |
| UX design team | Visual language, interaction patterns, design tokens, documentation. |
| Engineering team | Component implementation, Storybook, testing, releases. |
| Product teams | Proposals, adoption feedback, domain evidence, gap reporting. |
| Accessibility team | Compliance review, keyboard, focus, screen reader, contrast standards. |
| Platform team | Shell, remotes, runtime integration, provider setup. |
| Executive sponsor | Funding, organizational alignment, adoption expectations. |

## Ownership Split

UX owns:

- visual intent;
- interaction intent;
- content guidance;
- design documentation;
- token intent;
- variants and states.

Engineering owns:

- component library implementation;
- Storybook;
- tests and CI;
- versioning and release mechanics;
- framework implementations;
- performance;
- backwards compatibility;
- framework behavior.

Shared ownership:

- component APIs;
- breaking changes;
- semantic token contracts;
- accessibility requirements and proof;
- PrimeNG preset and theme changes;
- roadmap priorities;
- adoption metrics;
- deprecation plans.

Accessibility ownership is shared: design specifies accessible intent,
engineering proves implementation behavior, and accessibility specialists
review where available.

## Adoption And Rollout

Governance should be introduced as a way to help teams deliver faster with less
repeated work, not as another approval barrier. Product teams need
representation, support, review expectations, migration help, and a clear
exception path.

Start with a small set of high-value components or patterns, run the full
proposal-to-publication process, measure whether teams get value, and expand
from proven examples. See
[Adoption And Team Buy-In](./adoption-and-team-buy-in.md) and
[Rollout Implementation](./rollout-implementation.md) for the detailed model.

## Future Operating Model

The following change classification, adoption, metrics, and cadence sections are
proposed operating-model details. They should be confirmed against enterprise
governance before being treated as policy.

## Change Classification

Every change should be classified before release.

| Change | Examples | Governance |
| --- | --- | --- |
| Patch | Bug fixes, docs corrections, non-breaking test updates. | Design-system team review. |
| Minor | New variants, new components, additive APIs. | Council or maintainer review. |
| Major | Breaking API, visual language shift, provider theme change. | Migration guide and broad notice. |

## Adoption Standards

Product teams should:

- use existing components before requesting new ones;
- avoid local modifications of system components;
- submit enhancement requests instead of creating forks;
- follow published Zeroheight usage guidance;
- request exceptions when local needs conflict with shared standards.

Exceptions should be approved, owned, time-bound where possible, and documented.

## Metrics

Governance should track whether the system is working.

Adoption:

- percentage of applications using the design system;
- percentage of UI built from shared components;
- component reuse rate;
- Figma library adoption.

Quality:

- accessibility compliance;
- visual consistency;
- defect rate;
- regression rate.

Delivery:

- time from request to release;
- time to publish new components;
- development effort saved through reuse.

Documentation:

- Zeroheight coverage;
- Zeroheight page views;
- Storybook usage;
- documented owner coverage.

## Operating Cadence

| Meeting | Frequency | Purpose |
| --- | --- | --- |
| Design system working session | Weekly | Review requests, active work, bugs, and releases. |
| Design and engineering sync | Bi-weekly | Coordinate upcoming components and implementation. |
| Design system council | Monthly | Governance decisions, roadmap, standards, exceptions. |
| Design system health review | Quarterly | Metrics, adoption, deprecations, and strategic investments. |

## Document Map

### Strategic Documents

| Document | Role |
| --- | --- |
| [Governance Summary](./governance-summary.md) | **START HERE**: Concise overview for leadership and decision makers |
| [Developer Journey](./developer-journey.md) | What the design-system experience looks like to an external product-team developer. |
| [Governance Overview](./overview.md) | Complete governance framework with metrics, cadence, and adoption standards. |

### Operational Processes

| Document | Role |
| --- | --- |
| [Intake Process](./governance-intake-process.md) | How requests are submitted, evaluated, and prioritized. Five-step workflow. |
| [Quality Gates](./governance-quality-gates.md) | Seven required gates: Design, Accessibility, Implementation, Testing, Storybook, Documentation, Approval. |
| [Release Process](./governance-release-process.md) | Steps to publish: Preparation, Approval, Publication, Communication, Adoption Support. Hotfix procedures. |

### Supporting Documents

| Document | Role |
| --- | --- |
| [Contribution Process](./contribution-process.md) | Detailed intake, triage, evidence, and promotion process. |
| [InnerSource Contribution Model](./innersource-contribution-model.md) | Team participation and maintainer approval model. |
| [Component Promotion](./component-promotion.md) | Lifecycle statuses and promotion evidence. |
| [Zeroheight Governance Model](./zeroheight-governance-model.md) | Zeroheight page model, ownership, and publication guidance. |
| [Governance Flow Map](./flow-map.md) | End-to-end flow between design, tokens, registry, validation, and docs. |
| [Adoption And Team Buy-In](./adoption-and-team-buy-in.md) | Participation, support, and adoption measures. |
| [Rollout Implementation](./rollout-implementation.md) | Gradual rollout sequence and risk-based approval. |
