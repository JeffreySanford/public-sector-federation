# Adoption And Team Buy-In

## Purpose

Governance should help teams deliver faster with less repeated work. It should
not feel like an added approval barrier, a central team blocking delivery, or a
documentation burden that developers maintain twice.

Adoption will fail if product teams experience governance as:

- another approval layer;
- a central team blocking delivery;
- duplicate documentation work;
- rules imposed without product-team representation;
- a mandate with no support or migration funding.

The client should build adoption through participation, visible value, and
incremental rollout.

## Principles

- Product teams help shape the standards they are expected to follow.
- Contribution should be easier than creating and maintaining a local fork.
- Review turnaround expectations should be published.
- Maintainers should provide office hours, examples, migration support, and
  clear escalation paths.
- Governance should begin with a small set of high-value components and expand
  based on demonstrated reuse.
- Teams should see how shared components reduce defects, accessibility risk,
  duplicated effort, and upgrade cost.
- Exceptions should be possible when legitimate domain or delivery constraints
  exist.

## Team Participation

Product teams should not only consume decisions. They should have a formal path
to:

- propose improvements;
- contribute implementation or documentation;
- review draft standards;
- challenge decisions with evidence;
- request exceptions;
- influence roadmap priority.

The design-system team should make that path visible in Zeroheight and in the
repository contribution docs.

## Maintainer Support

Maintainers should provide:

- contribution templates;
- starter code;
- Storybook examples;
- automated checks;
- named reviewers;
- review service-level expectations;
- office hours;
- migration guidance.

The practical goal is that following the governed path is easier than bypassing
it.

## Measures Of Buy-In

Track whether teams are adopting the model, not only whether governance exists.

- Number of product teams contributing.
- Percentage of requests resolved through reuse or extension.
- Review turnaround time.
- Reduction in duplicate components.
- Adoption of published components and tokens.
- Product-team satisfaction with the contribution process.
- Number and age of approved exceptions.

## Anti-Patterns

Governance should be adjusted when:

- teams repeatedly bypass the process;
- reviews take too long for ordinary additive changes;
- documentation diverges from source, Storybook, or tests;
- product teams cannot find owners or escalation paths;
- exceptions are approved but never revisited;
- the system expands without evidence of reuse.
