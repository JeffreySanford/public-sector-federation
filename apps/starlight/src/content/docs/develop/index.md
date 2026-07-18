---
title: Develop
description: Local commands and source-of-truth boundaries for contributing to the documentation application.
---

The Starlight application is an independently built Nx project inside the existing pnpm workspace.

## Local commands

```bash
pnpm nx serve starlight
pnpm nx run starlight:check
pnpm nx build starlight
pnpm nx run starlight:preview
```

The development server uses port `4321`. The preview server uses port `4322` and serves the production build from the `/docs/` base path.

## Contribution boundaries

- authored guidance lives in `apps/starlight/src/content/docs`;
- Starlight presentation styles live in `apps/starlight/src/styles`;
- semantic token values remain owned by `packages/tokens`;
- component runtime behavior remains owned by Angular source;
- live isolated examples remain owned by Storybook;
- lifecycle and evidence metadata remain owned by the component manifest.

Documentation should project these sources clearly rather than copying their data into multiple authored pages.
