# Validation

## QA comparison view

The QA workspace contains a dedicated **Candidates** view after **QA Components** and **Performance Tracking**.

The view provides:

- shared label, tone, appearance, disabled, and loading controls;
- stable `ps-button` and Candidate `ps-up-button` examples;
- activation counters;
- a side-by-side scenario matrix;
- neutral, vibrant, and pastel theme controls;
- light and dark validation;
- Storybook integration;
- Zeroheight, Figma, source, story, test, and plan links;
- lifecycle and promotion-blocker information.

Validation surfaces:

```text
Direct QA remote: http://localhost:4204
Shell-composed QA route: http://localhost:4200/qa
Workspace view: Candidates
```

## Storybook evidence

The Candidate Storybook surface includes:

- primary, secondary, success, information, warning, error, help, and contrast tones;
- solid, outlined, and text appearances;
- disabled and loading states;
- long-label behavior;
- tone and appearance matrices;
- an interaction harness;
- current-versus-candidate comparison;
- strict accessibility configuration for Candidate stories.

Primary comparison story ID:

```text
design-system-candidates-button-up--current-vs-candidate
```

## Accessibility requirements

Before promotion, verify:

- native Button role and accessible name;
- Enter and Space activation;
- visible focus in every supported theme and mode;
- text and non-text contrast;
- minimum target size;
- disabled semantics;
- loading and busy-state behavior;
- duplicate activation suppression;
- long labels and localization;
- zoom and text resizing;
- reduced-motion behavior;
- accessible naming for any future icon-only variant.

## Automated evidence

- [Candidate Storybook tests](https://github.com/JeffreySanford/public-sector-federation/blob/master/apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts)
- [Candidate QA and federation tests](https://github.com/JeffreySanford/public-sector-federation/blob/master/apps/qa-remote/e2e/candidates-view.spec.ts)
- [Static Storybook validation script](https://github.com/JeffreySanford/public-sector-federation/blob/master/scripts/storybook-e2e.mjs)

Recommended validation commands:

```bash
pnpm nx run ui-patterns:typecheck
pnpm nx run qa-remote:typecheck
pnpm nx run qa-remote:test
pnpm nx run qa-remote:build
pnpm nx run qa-remote:build-storybook
pnpm nx run qa-remote:e2e
pnpm playwright test apps/qa-remote/e2e/candidates-view.spec.ts --project=chromium --workers=1
pnpm lint
```

## Evidence status

| Evidence area | Current state | Status |
| --- | --- | --- |
| Candidate wrapper | Native Angular wrapper exists | Available |
| Storybook variants | Candidate story set exists | Available |
| Current-versus-candidate story | Comparison story exists | Available |
| QA Candidates view | Direct and shell-composed comparison view exists | Available |
| Unit and Playwright coverage | Candidate-focused specifications exist | Available |
| UP source-token verification | Approved Button source still required | Pending |
| Figma Button component | Link and variable references still required | Pending |
| Stable Storybook deployment | Local Storybook currently used | Pending |
| Accessibility approval | Automated and human review required | Pending |
| Promotion decision | Governance review required | Pending |

## Promotion requirements

The Candidate must remain Candidate until:

- the approved UP Button design source is linked;
- Button-specific source tokens and aliases are verified;
- public API terminology is approved;
- all required appearances, tones, states, themes, and modes are represented;
- Storybook interactions pass;
- accessibility checks pass;
- the direct QA remote and shell-composed route pass;
- no Candidate styles leak into stable or unrelated components;
- Zeroheight guidance and evidence are complete;
- design, engineering, accessibility, platform, and governance owners record the promotion decision.

## Decision outcomes

The review may result in:

1. promoting approved Candidate decisions into `ps-button`;
2. adopting only selected API, token, or state-model improvements;
3. continuing Candidate research;
4. rejecting the Candidate and retaining the stable implementation.

## Release history

| Date | Status | Change |
| --- | --- | --- |
| 2026-07 | Candidate | Initial native Button wrapper, Storybook stories, QA comparison workspace, governance plan, and Zeroheight page created. |

## Ownership

| Responsibility | Owner |
| --- | --- |
| Design intent and Figma source | To be assigned |
| UP Button token verification | To be assigned |
| Angular wrapper and registry API | Public Sector Design System engineering |
| Storybook and QA validation | Public Sector Design System engineering |
| Accessibility review | To be assigned |
| Zeroheight publication and status | Public Sector Design System governance |

## Live documentation

[Open the UP Button Candidate page in Zeroheight](https://jeffreysanford.zeroheight.com/styleguide/s/143938/p/238541-up-button-canidate)
