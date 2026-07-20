# Button Contract Exploration

> **Lifecycle:** Candidate
> **Stable alternative:** `ps-button`
> **Candidate selector:** `ps-up-button`
> **Package:** `@public-sector/ui-patterns`
> **Scope:** Button only; this is not a migration of the broader public-sector design system.
> **Live documentation page:** Button Candidate (Starlight)

## Introduction

The Button Contract Exploration is the first component-level proof for connecting design intent, design tokens, an Angular wrapper, Storybook, the federated Component Lab workspace, automated validation, and governed documentation.

The existing `ps-button` remains the stable public-sector Button wrapper. The experimental `ps-up-button` exists to evaluate a more design-system-owned Button API, opinionated PrimeNG facade, token mapping, normalized events, accessibility ownership, and promotion process.

The Candidate is deliberately narrow. Only Button-related UP Design System information and shared foundations required by the Button are in scope. Card, Table, Dialog, Toast, navigation, form controls, and other wrappers continue to use the existing public-sector contract.

The live Starlight page is the governed documentation destination:

- Open the Button Candidate page on the Starlight documentation site.

The repository remains the implementation and validation source of truth. Starlight communicates status, approved guidance, ownership, limitations, and evidence.

## Recommended Starlight tabs

Use four tabs. Four provides enough separation for design, development, and governance audiences without forcing readers to click through many small fragments.

| Tab | Primary audience | Content source |
| --- | --- | --- |
| **Overview** | Everyone | [`button-candidate-overview.md`](./button-candidate-overview.md) |
| **Design & Tokens** | Design and token owners | [`button-candidate-design-tokens.md`](./button-candidate-design-tokens.md) |
| **Developer** | Application and platform engineers | [`button-candidate-developer.md`](./button-candidate-developer.md) |
| **Validation** | Governance, QA, accessibility, and platform owners | [`button-candidate-validation.md`](./button-candidate-validation.md) |

Do not create a separate tab for every short section. Keep related sections together so readers can scan one complete subject area.

If the Starlight workspace does not support the desired tab presentation, use the same four labels as major headings or child pages.

## Status tag

Use the custom **Candidate** status when it is available. If the workspace currently provides only the default statuses shown in Starlight, use **BETA** temporarily and display **Candidate** prominently in the page introduction. Replace the temporary tag after the governed lifecycle vocabulary is configured.

## Source-of-truth boundaries

| Surface | Authoritative for |
| --- | --- |
| Figma | Design intent, anatomy, variants, states, and source variables. |
| Token repository | Runtime source tokens, aliases, generated artifacts, and mapping validation. |
| Code repository | Wrapper API, implementation, tests, releases, and migration history. |
| Storybook | Live isolated behavior, variants, states, interactions, and accessibility evidence. |
| Component Lab and shell | Runtime integration, themes, modes, federation, and comparison evidence. |
| Starlight | Lifecycle, approved guidance, ownership, limitations, and evidence links. |

## Related documentation

- [Button Candidate integration plan](./button-candidate-integration-plan.md)
- [Experiments view checklist](./button-candidates-view-checklist.md)
