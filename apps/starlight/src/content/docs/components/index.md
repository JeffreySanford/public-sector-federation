---
title: Components
description: Public component contracts, usage guidance, lifecycle status, and live implementation evidence.
---

Component documentation should help someone choose and use a component before presenting implementation evidence.

## Current catalog status

The first documentation sequence tracks three flagship components against the generated component manifest. These statuses describe evidence that exists today; they do not imply completed design approval or manual accessibility review.

### Button

- **Documentation:** The first complete flagship page is published.
- **Lifecycle:** Active and used in the reference applications.
- **Storybook:** A dedicated canonical stable story is recorded.
- **Accessibility:** Automated checks exist; dedicated keyboard breadth and manual assistive-technology review remain incomplete.
- **Figma:** Pending access and alignment review.

[Read the Button guidance](/docs/components/button/)

### Select

- **Documentation:** Flagship page is queued after Button.
- **Lifecycle:** Active.
- **Storybook:** Canonical component stories are recorded.
- **Accessibility:** The combobox pattern is identified; broader integrated keyboard and overlay verification remains incomplete.
- **Figma:** Pending access and alignment review.

### Dialog

- **Documentation:** Flagship page is queued after Button.
- **Lifecycle:** Active.
- **Storybook:** Dialog and toast acceptance evidence is recorded.
- **Accessibility:** The dialog pattern is identified; focus containment, restoration, and manual review remain incomplete.
- **Figma:** Pending access and alignment review.

The quality gate cross-checks these relationships against `packages/ui-patterns/generated/component-manifest.json`, recorded source and Storybook files, Starlight routes, canonical story IDs when declared, and Figma status values.

## Flagship sequence

1. **Button** establishes action hierarchy, public API decisions, interaction states, token mapping, live-story presentation, and the stable-versus-candidate remediation story.
2. **Select** proves overlay behavior, keyboard navigation, accessible naming, provider abstraction, and theme propagation.
3. **Dialog** proves focus management, semantic structure, destructive-action patterns, and integrated application behavior.

## Page contract

Every completed component page includes:

- purpose and usage guidance;
- live canonical Storybook behavior;
- anatomy, variants, states, and content guidance;
- keyboard, focus, announcement, and visual accessibility expectations;
- semantic and component token relationships;
- public Angular API and provider-boundary notes;
- lifecycle, design alignment, evidence, findings, and next actions.

The catalog will expand only after these three pages demonstrate a complete and repeatable model.
