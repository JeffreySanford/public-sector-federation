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

The Candidate is deliberately narrow. Only Button-related design information and shared foundations required by the Button are in scope. Card, Table, Dialog, Toast, navigation, form controls, and other wrappers continue to use the existing public-sector contract.

The live Starlight page is the governed documentation destination:

- Open the Button Candidate page on the Starlight documentation site.

The repository remains the implementation and validation source of truth. Starlight communicates status, approved guidance, ownership, limitations, and evidence.

## Lifecycle status

**Candidate.** The experiment may be used for the Experiments comparison view, Storybook evidence, accessibility and interaction validation, and explicitly approved pilot work. It is not yet the preferred production Button.

## Key differences from the stable Button

| Area | Current `ps-button` | Candidate `ps-up-button` |
| --- | --- | --- |
| Lifecycle | Stable | Candidate |
| API shape | Uses `outlined` and `text` booleans (plus `appearance`) | Uses one `appearance` input |
| Rendering | Wraps PrimeNG `p-button` | Wraps PrimeNG through a smaller candidate-owned facade |
| Token direction | Uses current public-sector theme tokens | Evaluates a component-owned token mapping |
| Behavior | Delegates provider behavior through the wrapper | Normalizes PrimeNG activation to `activated` and suppresses disabled or loading actions |
| Production guidance | Supported for application use | Limited pilot and evaluation only |

## When to use

Use `ps-up-button` only for:

- the Experiments view;
- Storybook candidate stories;
- accessibility and interaction validation;
- token and visual comparison;
- approved proof-of-concept screens;
- design-system review and promotion evidence.

## When not to use

Do not use `ps-up-button` for:

- general production application work;
- replacing `ps-button` without an approved promotion decision;
- introducing custom application colors;
- bypassing the public wrapper package.

## Recommended Starlight tabs

Use three tabs. Three provides enough separation for design, development, and governance audiences without forcing readers to click through many small fragments.

| Tab | Primary audience | Content source |
| --- | --- | --- |
| **Design & Tokens** | Design and token owners | [`button-candidate-design-tokens.md`](./button-candidate-design-tokens.md) |
| **Developer** | Application and platform engineers | [`button-candidate-developer.md`](./button-candidate-developer.md) |
| **Validation** | Governance, QA, accessibility, and platform owners | [`button-candidate-validation.md`](./button-candidate-validation.md) |

Do not create a separate tab for every short section. Keep related sections together so readers can scan one complete subject area.

If the Starlight workspace does not support the desired tab presentation, use the same labels as major headings or child pages.

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

## Known limitations

- Authoritative Figma Button component links, variable references, and design approval remain pending.
- The candidate icon input uses provider-neutral icon names; the implementation maps those names to PrimeIcons internally.
- Size variants are not yet part of the public candidate API.
- The candidate remains separate from the canonical `ps-button` implementation and has not been promoted.
