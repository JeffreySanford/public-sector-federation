---
title: Components
description: Public component contracts, usage guidance, lifecycle status, and live implementation evidence.
---

Component documentation should help someone choose and use a component before presenting implementation evidence.

## Current catalog status

The first documentation slice tracks three flagship components against the generated component manifest. These statuses describe evidence that exists today; they do not imply completed design approval or manual accessibility review.

### Button

- **Lifecycle:** active and used in production examples.
- **Storybook:** canonical acceptance evidence is recorded.
- **Accessibility:** automated checks are partial; keyboard and screen-reader review remain incomplete.
- **Figma:** pending access and alignment review.

### Select

- **Lifecycle:** active.
- **Storybook:** canonical component stories are recorded.
- **Accessibility:** the combobox pattern is identified; broader integrated keyboard and overlay verification remains incomplete.
- **Figma:** pending access and alignment review.

### Dialog

- **Lifecycle:** active.
- **Storybook:** dialog and toast acceptance evidence is recorded.
- **Accessibility:** the dialog pattern is identified; focus containment, restoration, and manual review remain incomplete.
- **Figma:** pending access and alignment review.

The quality gate cross-checks these relationships against `packages/ui-patterns/generated/component-manifest.json`, the recorded source files, Storybook story files, Starlight routes, and Figma status values.

## Flagship sequence

1. **Button** establishes action hierarchy, public API decisions, interaction states, token mapping, and the stable-versus-candidate remediation story.
2. **Select** proves overlay behavior, keyboard navigation, accessible naming, provider abstraction, and theme propagation.
3. **Dialog** proves focus management, semantic structure, destructive-action patterns, and integrated application behavior.

## Page contract

Every completed component page will include:

- purpose and usage guidance;
- live canonical Storybook behavior;
- anatomy, variants, states, and content guidance;
- keyboard, focus, announcement, and visual accessibility expectations;
- semantic and component token relationships;
- public Angular API and provider-boundary notes;
- lifecycle, design alignment, evidence, findings, and next actions.

The catalog will expand only after these three pages demonstrate a complete and repeatable model.
