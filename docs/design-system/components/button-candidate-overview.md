# Overview

## Purpose

Use this tab to understand why the UP Button Candidate exists, how it differs from the stable Button, where it may be used, and what still blocks promotion.

This is a Candidate comparison and evidence page. It is not criticism of the current Button. The current implementation is the stable production baseline against which the Candidate is reviewed.

## Lifecycle status

**Candidate**

The Candidate may be used for the QA comparison, Storybook evidence, accessibility and interaction validation, limited demonstrations, and explicitly approved pilot work. It is not yet the preferred production Button.

## Current Button vs UP Button Candidate

The existing `ps-button` remains the stable public-sector Button wrapper. It uses PrimeNG internally and exposes a provider-neutral public API for tone, outlined and text treatments, disabled behavior, loading behavior, navigation, and activation events. Final styling comes through the shared PrimeNG preset and public-sector theme tokens.

The `ps-up-button` is a Candidate implementation for evaluating a more design-system-owned Button model. It now acts as an opinionated PrimeNG facade: it exposes product-facing `intent`, a single `appearance` API, provider-neutral icons, and `activated`, while translating those concepts into private PrimeNG behavior and UP-style token mappings.

The Candidate is intended to prove whether the UP Button API, token treatment, visual model, and governance workflow should eventually be promoted into the stable `ps-button` implementation.

## Key differences

| Area | Current `ps-button` | Candidate `ps-up-button` |
| --- | --- | --- |
| Lifecycle | Stable | Candidate |
| API shape | Uses `outlined` and `text` booleans | Uses one `appearance` input |
| Rendering | Wraps PrimeNG `p-button` | Wraps PrimeNG through a smaller Candidate-owned facade |
| Styling ownership | Uses the shared PrimeNG preset | Maps Candidate Button tokens into private PrimeNG variables |
| Token direction | Uses current public-sector theme tokens | Evaluates UP-style Button token mappings |
| Behavior | Delegates provider behavior through the wrapper | Normalizes PrimeNG activation to `activated` and suppresses disabled or loading actions |
| Accessibility | Combines PrimeNG semantics with wrapper behavior | Uses PrimeNG semantics while retaining Candidate loading, focus, and activation requirements |
| Visual treatment | Current public-sector styling | Candidate UP-inspired styling |
| Production guidance | Supported for application use | Limited pilot and evaluation only |

## Why this Candidate exists

The current public-sector themes already appear directionally aligned with portions of the UP Design System color language. The most meaningful difference may therefore be the implementation and governance model rather than a completely different palette.

The Candidate evaluates:

- a cleaner Button API;
- Button-specific semantic and component tokens;
- explicit hover, pressed, focus, disabled, and loading styling;
- an opinionated PrimeNG facade rather than a mirrored provider API;
- accessibility ownership;
- shared Figma, Storybook, Zeroheight, and Angular vocabulary;
- QA and federated-shell behavior;
- promotion evidence and governance.

The outcome may be full promotion, partial adoption of selected ideas, continued Candidate work, or retention of the current implementation.

## When to use

Use `ps-up-button` only for:

- the Experiments view;
- Storybook Candidate stories;
- accessibility and interaction validation;
- token and visual comparison;
- approved proof-of-concept screens;
- design-system review and promotion evidence.

## When not to use

Do not use `ps-up-button` for:

- general production application work;
- replacing `ps-button` without an approved promotion decision;
- introducing custom application colors;
- bypassing the public wrapper package;
- implying that the entire UP Design System is being migrated;
- direct application-level styling of internal implementation classes.

## Current status

The Candidate currently uses UP-inspired styling based on the design information available to the project and the existing public-sector theme foundations.

Local validation against `D:\repos\up-design-system` confirms the generated UP semantic token paths and values used for comparison. It also confirms that the current `ps-up-button` namespace and opinionated wrapper contract are public-sector Candidate decisions, not a direct copy of an existing UP Button component implementation.

Before promotion, every Button-specific token assumption used by `ps-up-button` must either be aligned to the approved UP Design System source or explicitly approved as a public-sector theme adaptation. This requirement applies only to the Button Candidate and does not imply migration of the rest of the public-sector design system.

Until design, token, accessibility, Storybook, QA, shell-integration, and governance evidence is complete:

- `ps-button` remains the stable production wrapper;
- `ps-up-button` remains a Candidate;
- application adoption requires explicit approval.

## Known limitations

- Authoritative Figma Button component links, variable references, and design approval remain pending.
- The Candidate is published through the Chromatic-hosted QA Storybook for interactive and visual validation.
- Visual styling is currently being reviewed across tones, appearances, interaction states, themes, and light and dark modes.
- The Candidate icon input now uses provider-neutral icon names; the current implementation maps those names to PrimeIcons internally.
- Size variants are not yet part of the public Candidate API.
- The Candidate remains separate from the canonical `ps-button` implementation and has not been promoted.

## Live documentation

[Open the Button Candidate page in Zeroheight](https://jeffreysanford.zeroheight.com/styleguide/s/143938/p/238541-up-button-Candidate)
