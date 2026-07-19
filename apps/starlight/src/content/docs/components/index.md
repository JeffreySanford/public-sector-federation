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

- **Documentation:** The second complete flagship page is published in PR #16.
- **Lifecycle:** Active.
- **Storybook:** A canonical story, complete state set, model harness, and overlay-boundary harness are recorded.
- **Accessibility:** Dedicated automated keyboard, popup, axe, and accessibility-tree evidence is complete for the declared scope; manual assistive-technology review and the provider's missing disabled-option `aria-disabled` state remain open.
- **Figma:** Pending access and alignment review.

[Read the Select guidance](/docs/components/select/)

### Dialog

- **Documentation:** The third flagship page is published in PR #18.
- **Lifecycle:** Active.
- **Storybook:** Dedicated canonical, destructive-confirmation, long-content, and focus-sequence stories are recorded.
- **Accessibility:** Labelled modal semantics, predictable initial focus, Tab containment, Escape dismissal, and opener restoration have dedicated automated evidence; manual assistive-technology review, background inertness, and explicit body scroll lock remain open.
- **Figma:** Pending access and alignment review.

[Read the Dialog guidance](/docs/components/dialog/)

The quality gate cross-checks these relationships against `packages/ui-patterns/generated/component-manifest.json`, recorded source and Storybook files, Starlight routes, canonical story IDs when declared, and Figma status values.

## Flagship sequence

1. **Button** establishes action hierarchy, public API decisions, interaction states, token mapping, live-story presentation, and the stable-versus-candidate remediation story.
2. **Select** proves body-appended overlay behavior, keyboard navigation, accessible naming, provider abstraction, and theme propagation.
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

Button, Select, and Dialog now demonstrate the complete flagship page model. Additional catalog pages should reuse the proven structure while remaining grounded in the evidence each component actually owns.
