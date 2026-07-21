# InnerSource Contribution Model

## Purpose

The design system should be governed as a shared platform capability, not as a
closed handoff from one central team to every application team.

This model explains how design, product, platform, accessibility, and
application teams can contribute improvements without creating unsupported
forks or unreviewed variants.

The model starts with evidence. Teams are not only requesting work from a
central design-system team; they are proposing improvements to a shared
platform capability and helping prove why those improvements should become
shared.

## Operating Principle

Contribution should be open. Approval should be controlled.

That means:

- product and application teams can propose needs and contribute code;
- design and UX teams can propose patterns, variants, and interaction changes;
- platform teams can contribute runtime integration requirements;
- maintainers control shared APIs, token changes, accessibility rules, and
  breaking changes.

The goal is to avoid both extremes:

| Extreme | Failure Mode |
| --- | --- |
| Too centralized | Teams wait, create local workarounds, or cannot ship. |
| Too decentralized | Every app creates its own button, table, header, form, or theme. |

## Contribution Flow

Use [Contribution Process](./contribution-process.md) for the detailed intake,
evidence, triage, validation, and promotion steps.

```text
Request or opportunity
  -> evidence-backed contribution proposal
  -> triage and prioritization
  -> design proposal
  -> design review gate
  -> development proposal
  -> code review and InnerSource gate
  -> Storybook contract
  -> runtime validation
  -> component registry promotion
  -> Starlight governance publication
  -> enterprise adoption
```

## Stage 0: Contribution Proposal

A team identifies a need.

Example:

```text
Case queue needs a new status visualization.
```

Before creating a new shared asset, answer:

- What problem are we solving?
- Who experiences the problem?
- What evidence shows the problem is reusable?
- Does this already exist?
- Is this domain-specific?
- Will another application need it?
- Is this a component, a pattern, or a feature?
- Does it require new tokens?
- Does it affect accessibility, content, or interaction standards?

Output:

- short evidence-backed component, pattern, token, or preset/theme proposal;
- expected consumers;
- initial owner;
- recommendation to reuse, extend, or create.

## Stage 1: Design Proposal

Design creates or updates the Figma artifact.

Required design inputs:

- user problem;
- component anatomy;
- states;
- variants;
- responsive behavior;
- interaction behavior;
- accessibility expectations;
- token requirements;
- content guidance where relevant.

Design review decides whether the proposal is:

| Decision | Meaning |
| --- | --- |
| Existing pattern | Use or extend what already exists. |
| New shared component | Candidate for registry contribution. |
| Composite pattern | Reusable workflow made from multiple pieces. |
| Product-specific feature | Keep in the application, not the registry. |

Reviewers:

- design-system design owner;
- UX leadership or delegated design reviewer;
- accessibility reviewer when behavior or semantics are affected.

Output:

- approved design specification or rejection with rationale.

## Stage 2: Development Proposal

Developers create or update the implementation.

Expected delivery:

- Angular implementation;
- PrimeNG wrapper or provider mapping when needed;
- public API in design-system language;
- token usage;
- unit tests where useful;
- Storybook stories;
- accessibility notes;
- migration notes if replacing direct PrimeNG or an older pattern.

Implementation should live in the registry package when it is shared. Product
specific workflows should stay in the application and consume lower-level
design-system primitives.

## Stage 3: Code Review And InnerSource Gate

Contributions are reviewed like shared platform code.

Reviewers:

- component owner;
- design-system maintainer;
- platform engineer when shell, remotes, overlays, or theme behavior are
  affected;
- accessibility reviewer for keyboard, semantics, contrast, or focus changes;
- security or product reviewer when enterprise standards require it.

Review criteria:

- API consistency;
- accessibility;
- token alignment;
- PrimeNG encapsulation;
- performance;
- maintainability;
- test coverage;
- migration impact;
- versioning and release impact.

Protected areas require maintainer approval:

- token source files and normalization rules;
- core component APIs;
- accessibility rules;
- breaking API changes;
- PrimeNG preset/provider changes;
- shell/runtime integration behavior.

## Stage 4: Storybook Contract

Storybook proves isolated behavior before broad adoption.

Required stories should cover applicable states:

- default;
- disabled;
- loading;
- error or validation state;
- empty state;
- long content;
- dark theme;
- responsive layout;
- keyboard behavior;
- accessibility expectations.

When Storybook coverage is sufficient, the component can move to `Candidate`.

## Stage 5: Runtime Validation

Runtime validation proves the component works in the delivery model.

Validation surfaces:

- direct subapplication route;
- shell-mounted route;
- `/qa` route or equivalent integration environment;
- Playwright regression tests;
- accessibility checks.

Runtime validation should specifically cover:

- theme inheritance;
- Web Component boundary behavior;
- PrimeNG provider compatibility;
- overlay behavior when applicable;
- shell and remote compatibility;
- responsive layout inside realistic page chrome.

When runtime validation is sufficient, the component can move from `Candidate`
to `Active`.

## Stage 6: Registry Promotion

The component registry records the implementation contract.

Registry metadata should include:

- status;
- owner;
- source path;
- package and import path;
- public API;
- token dependencies;
- PrimeNG dependencies hidden behind the wrapper;
- Storybook evidence;
- shell or remote validation evidence;
- accessibility notes;
- migration notes.

Lifecycle:

```text
Idea
  -> Proposed
  -> Experimental
  -> Candidate
  -> Active
  -> Deprecated
```

Lifecycle status definitions are maintained in
[Component Promotion](./component-promotion.md). Use those definitions when
recording registry metadata or publishing Starlight status.

## Stage 7: Starlight Publication

Starlight publishes the governed adoption guidance.

Starlight should show:

- when to use the component;
- when not to use it;
- approved variants;
- lifecycle status;
- owner;
- supported versions;
- accessibility rules;
- Storybook link;
- source link;
- validation evidence;
- migration or deprecation guidance.

Starlight is the adoption front door. It does not replace the source
repository, token build, component registry, or validation suite.

## Roles And Responsibilities

| Role | Responsibility |
| --- | --- |
| Design system team | Maintains standards and approves shared patterns. |
| Product teams | Contribute domain needs and business priority. |
| Developers | Implement and maintain code contributions. |
| UX team | Owns visual consistency and interaction behavior. |
| Accessibility team | Validates compliance and accessible interaction. |
| Platform team | Owns shell, runtime integration, and federation constraints. |
| Product owners | Confirm business priority and adoption need. |
| Maintainers | Approve protected areas and shared API changes. |

## Contribution Rules

Anyone can contribute:

- propose improvements;
- submit pull requests;
- add Storybook examples;
- report gaps;
- improve documentation;
- suggest migration paths.

Only authorized maintainers and named decision owners may approve changes to
protected shared contracts, including:

- shared token changes;
- core component APIs;
- accessibility rules;
- breaking changes;
- PrimeNG provider mapping;
- runtime integration behavior.

Approval authority may differ by surface, such as design, accessibility,
tokens, code, PrimeNG preset/theme mapping, and runtime integration.

## Governance Outcome

The InnerSource model should make shared contribution easier without weakening
quality gates.

The expected result:

- teams can move without waiting for one central team to build everything;
- reusable improvements flow back into the shared system;
- application-specific features stay in applications;
- approved shared components have clear owners, evidence, and lifecycle status;
- Starlight shows teams what is approved and how to adopt it.
