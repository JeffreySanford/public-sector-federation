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

## Current release gate

The repository already validates linting, links, type checking, unit tests, manifest drift, production builds, Storybook accessibility, and browser behavior. The next implementation slice will add Starlight-specific responsive, accessibility, visual, and polish checks after this foundation is proven stable.

[Open the live Storybook](https://6a57d5b6de2da2591d3236aa-zpjdyybmmw.chromatic.com/)
