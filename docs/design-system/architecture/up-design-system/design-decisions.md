# Design-System Decision Record

## Scope

This document records the decisions that govern the sample token pipeline, PrimeNG integration boundary, federated runtime, and component-evidence model. It does not attempt to choose an adopting organization's final names, owners, or design approvals.

## Decision 1: Wrapper API shape

New and target-state applications consume provider-neutral APIs from `@public-sector/ui-patterns`.

- Core components use strict, opinionated APIs.
- PrimeNG types, events, selectors, modules, and CSS internals do not leak into application code.
- Advanced provider configuration requires an explicit registry decision rather than a generic pass-through.
- Simple layout and semantic markup use native Angular and HTML with shared tokens.
- Legacy direct PrimeNG use may be temporarily allowlisted during a tracked migration.

## Decision 2: First proof set

The repository uses Button plus overlay components as the minimum architecture proof. This validates both ordinary component styling and the more difficult `body`-appended overlay boundary.

The proof set includes Storybook evidence, shell-mounted behavior, keyboard interaction, accessibility checks, and light/dark theme coverage.

## Decision 3: Token normalization

Normalization rules are explicit build inputs rather than undocumented code behavior.

Current sample rules include:

- provider terminology translation such as `danger` to `error`;
- documented precedence when token inputs overlap;
- compatibility aliases for missing ramp endpoints;
- semantic and component tiers separated from primitive values.

An adopting organization must mark each rule as approved design language or temporary compatibility debt.

## Decision 4: Token delivery

Use a combined model:

- a versioned token package owns generated artifacts;
- the shell owns integrated theme context;
- remotes import tokens and the approved PrimeNG provider for isolated execution;
- federation aligns package versions;
- overlays inherit variables and theme state from `html` or `:root`.

## Decision 5: Validation acceptance

A candidate component requires evidence proportional to its risk:

- build and type checking;
- public API and provider-boundary validation;
- Storybook state and variant coverage;
- behavior tests for meaningful interaction;
- keyboard and automated accessibility checks;
- shell integration for cross-runtime or overlay behavior;
- design and manual accessibility review before final promotion where required.

## Decision 6: Registry readiness is evidence-based

Exported does not automatically mean production-approved. The generated manifest may report active, candidate, partial, blocked, or deprecated states.

This lets reviewers distinguish:

- repository completeness;
- external design binding;
- automated behavior evidence;
- manual review requirements;
- organization-specific ownership and approval.

## Production adoption questions

An adopting organization must decide:

1. Which DTCG-compatible export is authoritative?
2. Which normalization rules are approved?
3. Who owns token, registry, and product-team boundaries?
4. Which legacy paths require temporary provider exceptions?
5. What evidence is mandatory for each component risk tier?
6. Which package versions and theme contract are supported together?
