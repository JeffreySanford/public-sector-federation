# Contribution Process

## Purpose

A design-system change is a product investment decision, not only a UI request.
This process explains how an evidence-backed proposal becomes a shared token,
component, pattern, PrimeNG preset/theme change, or documentation update.

The goal is:

- make contribution easy;
- make evidence expected;
- make promotion controlled.

## Governance Flow

```text
request or opportunity
  -> evidence-backed contribution proposal
  -> triage and prioritization
  -> design discovery
  -> design approval gate
  -> development contribution
  -> technical review gate
  -> validation evidence
  -> promotion decision
  -> Starlight publication
```

## Contribution Proposal

Before design or code begins, the requesting team should submit a short
contribution proposal. This is not a ticket asking a central team to build a
component. It is a case for why the shared platform should invest in a reusable
capability.

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

### Problem

Describe the user or developer problem.

Example:

```text
Case queue teams are implementing status indicators independently, creating
inconsistent accessibility behavior and duplicated logic.
```

### Evidence

Not every request needs a large analytics package, but stronger requests include
evidence from multiple angles.

User evidence:

- user research;
- customer feedback;
- usability testing;
- support tickets.

Example:

```text
Twelve usability sessions showed users missed status changes because color was
the only indicator.
```

Application evidence:

- number of applications needing the capability;
- existing duplicate implementations;
- maintenance burden;
- inconsistent behavior across products.

Example:

```text
Four applications currently implement separate status indicators.
```

Technical evidence:

- accessibility gaps;
- performance issues;
- security concerns;
- repeated defects;
- inconsistent keyboard or focus behavior.

Example:

```text
Three applications have different keyboard behavior for the same interaction.
```

Business evidence:

- regulatory requirement;
- compliance requirement;
- enterprise standardization need;
- product priority.

Example:

```text
WCAG remediation requires consistent focus behavior.
```

## Triage And Prioritization

Design-system maintainers triage the request before design exploration expands.

Questions:

- Is this already solved?
- Is this reusable?
- Is this a pattern, component, token, or product feature?
- Does it reduce duplication?
- Does it improve accessibility?
- Does it support multiple domains?
- Does it belong in the shared registry or inside one application?
- Does it require a token change?
- Does it create a breaking API or migration concern?

Possible outcomes:

| Outcome | Meaning |
| --- | --- |
| Reuse existing | Existing guidance or component covers the need. |
| Extend existing | Existing component needs a governed variant or behavior. |
| New shared asset | Candidate for design-system contribution. |
| Keep local | Useful, but domain-specific or not reusable enough. |
| Needs research | Problem is real, but the shared shape is not clear yet. |

The outcome should be recorded so teams understand whether the request became
shared-system work, stayed local, or needs more evidence.

## Do Not Promote Gate

Not every useful UI belongs in the design system.

Keep a request inside the application when it is:

- single-application only;
- a domain-specific workflow;
- unsupported by reuse evidence;
- tightly coupled to one product data model;
- better expressed as application composition over lower-level primitives.

Example local feature:

```text
Case Queue Escalation Risk Analyzer
```

Likely shared candidates:

- status badge;
- table;
- page header;
- form pattern;
- notification;
- navigation pattern.

## Design Discovery

If triage says the request may become shared, design discovery begins.

Participants:

- UX;
- product;
- design-system design owner;
- engineering;
- accessibility where relevant.

Deliverables:

- Figma proposal;
- user flows;
- states;
- variants;
- responsive behavior;
- accessibility requirements;
- token requirements;
- content guidance.

## Design Approval Gate

Design approval confirms the proposed shared behavior before implementation.

Approval criteria:

- user need is validated;
- pattern is defined;
- variants and states are explicit;
- accessibility has been reviewed;
- token needs are identified;
- product-specific behavior is separated from reusable behavior.

Output:

- approved design specification;
- decision to create, extend, or keep local;
- named owner for the next stage.

## Development Contribution

Development turns the approved design into a governed implementation.

Expected implementation evidence:

- Angular implementation;
- component API;
- PrimeNG wrapper or mapping when needed;
- token usage;
- unit tests where useful;
- Storybook stories;
- accessibility notes;
- migration guidance where relevant.

## Technical Review Gate

Technical review validates the contribution as shared platform code.

Review criteria:

- API consistency;
- performance;
- accessibility;
- maintainability;
- security;
- token alignment;
- PrimeNG encapsulation;
- release and migration impact.

Required reviewers depend on the affected surface:

| Surface | Reviewer |
| --- | --- |
| Core component API | Component owner or design-system maintainer. |
| Tokens | Token pipeline owner. |
| PrimeNG preset or theme mapping | Token pipeline owner and platform owner. |
| Accessibility behavior | Accessibility reviewer. |
| Shell or remote integration | Platform owner. |
| Breaking changes | Maintainers and affected product owners. |

## Validation Evidence

Validation proves the contribution works before promotion.

Required evidence should include:

- Storybook examples;
- `/qa` or shell-mounted route when runtime context matters;
- Playwright regression checks for high-risk behavior;
- accessibility checks;
- theme checks;
- source and package links.

High-risk areas require stronger validation:

- overlays;
- dialogs;
- toasts;
- tables;
- form controls;
- navigation;
- focus management.

## Promotion Decision

Promotion changes the lifecycle status.

```text
Idea
  -> Proposed
  -> Experimental
  -> Candidate
  -> Active
  -> Deprecated
```

Lifecycle status definitions are maintained in
[Component Promotion](./component-promotion.md). Use those definitions for
components, patterns, token groups, and preset/theme changes unless a more
specific status model is approved.

Promotion should be evidence-backed, not automatic. A successful build is not
the same as an approved shared component.

## Starlight Publication

Starlight publishes the governed adoption guidance after the required evidence
exists.

Starlight should show:

- usage guidance;
- approved variants;
- lifecycle status;
- owner;
- implementation link;
- Storybook link;
- validation evidence;
- accessibility notes;
- change history;
- migration guidance.

Starlight becomes the institutional memory for adoption decisions. It does not
replace source control, tests, the token build, or the component registry.

## InnerSource Rule

Anyone can propose:

- ideas;
- component improvements;
- documentation improvements;
- Storybook examples;
- code changes;
- migration paths.

Only authorized maintainers and named decision owners may approve changes to
protected shared contracts, including:

- token changes;
- breaking API changes;
- core components;
- accessibility standards;
- PrimeNG provider mapping;
- runtime integration behavior.
