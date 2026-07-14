# Rollout Implementation

## Purpose

The design-system governance model should not begin as an enterprise-wide
mandate. The safer rollout is to co-design the model with affected teams, prove
it with a real component, measure the value, and expand from working examples.

## Practical Sequence

1. Co-design the governance model.
2. Pilot it with a real component or pattern.
3. Show measurable value.
4. Make contribution easier than bypassing.
5. Give product teams representation.
6. Avoid turning governance into a bottleneck.
7. Roll out gradually.

## 1. Co-Design The Governance Model

Bring together representatives from:

- design system;
- UX;
- platform and shell;
- accessibility;
- product application teams;
- engineering maintainers.

Have those groups agree on decision rights, evidence expectations, approval
paths, exception handling, and review responsibilities. Teams support
governance more readily when they help design it.

## 2. Pilot With A Real Component

Use something visible and reusable, such as:

- button;
- status chip;
- page header;
- navigation pattern;
- data-table pattern.

Run the component through the full process:

```text
evidence-backed proposal
  -> design discovery
  -> implementation
  -> Storybook proof
  -> runtime validation
  -> promotion decision
  -> Zeroheight publication
  -> adoption feedback
```

## 3. Show Measurable Value

The pilot should demonstrate outcomes such as:

- fewer duplicate implementations;
- consistent accessibility behavior;
- less application-specific styling;
- faster delivery for later adopters;
- simpler PrimeNG upgrades;
- clearer ownership and support.

## 4. Make Contribution Easier Than Bypassing

Provide:

- contribution templates;
- starter code;
- Storybook examples;
- automated checks;
- named reviewers;
- review service-level expectations;
- office hours;
- migration guidance.

## 5. Give Product Teams Representation

Product teams need a formal path to:

- propose;
- contribute;
- review;
- challenge;
- request exceptions;
- influence roadmap priority.

## 6. Use Risk-Based Approval

Not every change needs council-level approval.

| Change Type | Review Path |
| --- | --- |
| Documentation correction | Lightweight maintainer review. |
| Additive component variant | Design and component maintainer review. |
| Token alias or semantic mapping | Token owner and affected component owner review. |
| Breaking token or API change | Broader governance review and migration plan. |
| PrimeNG preset or theme change | Token, platform, and registry owner review. |

Risk-based review keeps governance from becoming a bottleneck while preserving
control over protected shared contracts.

## 7. Roll Out Gradually

Start with willing product teams and high-value shared patterns. Turn early
adopters into advocates before stronger adoption expectations are introduced.

Each rollout wave should identify:

- participating teams;
- target components or patterns;
- migration support needed;
- expected evidence;
- success measures;
- exceptions and owners.
