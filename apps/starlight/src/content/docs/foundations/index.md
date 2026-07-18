---
title: Foundations
description: Semantic tokens and shared visual decisions that keep Angular, Storybook, and documentation aligned.
---

Foundations define the visual language shared by documentation, component stories, the Angular workbench, and reference applications.

## Source of truth

The `@public-sector/tokens` package owns authored token data and generated outputs. Starlight consumes the generated CSS package directly rather than maintaining a separate documentation palette.

## Foundation areas

- semantic color roles for surfaces, text, borders, actions, focus, status, and navigation;
- typography, spacing, shape, elevation, and motion decisions;
- light and dark modes resolved through the same token contract;
- PrimeNG mappings kept behind the provider boundary;
- generated CSS, JSON, and TypeScript artifacts.

## Current scope

This foundation slice proves shared token consumption and theme synchronization. Detailed visual reference pages will be added after the Button documentation establishes the standard page model.
