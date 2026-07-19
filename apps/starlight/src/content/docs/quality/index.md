---
title: Quality
description: The evidence and review model used to keep component guidance and implementation trustworthy.
---

Quality is represented as a set of distinct, traceable signals rather than one vague completion badge.

## Quality dimensions

- source and package-contract validity;
- canonical Storybook coverage;
- interaction and browser tests;
- automated accessibility checks;
- manual accessibility review;
- visual regression review in Chromatic;
- Figma alignment and known differences;
- documentation completeness and route integrity;
- provider-boundary compliance;
- ownership, blockers, and next action.

## Starlight release gate

The documentation application now has a dedicated Nx quality gate that validates:

- required frontmatter, heading hierarchy, placeholders, local paths, public wording, and local links;
- documentation routes, source files, Storybook records, Figma statuses, and generated manifest relationships;
- shared semantic-token and style-discipline rules with documented exceptions;
- every current Starlight route at desktop width;
- responsive navigation at 360, 768, 1024, 1280, and 1440 pixels;
- horizontal reflow at the 320 CSS-pixel equivalent of 200% zoom;
- light and dark token synchronization;
- axe results for representative overview, component, and architecture pages;
- critical accessibility-tree structure;
- human-reviewed visual baselines;
- Lighthouse category scores and resource budgets;
- explicit human polish status and a policy that forbids automatic visual-baseline acceptance.

The Starlight gate runs inside `verify:release` and the repository Release Quality Gate. Automated accessibility evidence remains separate from manual review, and Figma status remains explicit rather than inferred.

[Open the live Storybook](https://6a57d5b6de2da2591d3236aa-zpjdyybmmw.chromatic.com/)
