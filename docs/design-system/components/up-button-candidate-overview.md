# Overview

## Purpose

Use this tab to understand why the UP Button Candidate exists, how it differs from the stable Button, where it may be used, and what still blocks promotion.

This is a Candidate comparison and evidence page. It is not criticism of the current Button. The current implementation is the stable production baseline against which the Candidate is reviewed.

## Lifecycle status

**Candidate**

The Candidate may be used for the QA comparison, Storybook evidence, accessibility and interaction validation, limited demonstrations, and explicitly approved pilot work. It is not yet the preferred production Button.

## Current Button vs UP Button Candidate

The existing `ps-button` remains the stable public-sector Button wrapper. It uses PrimeNG internally and exposes a provider-neutral public API for tone, outlined and text treatments, disabled behavior, loading behavior, navigation, and activation events. Final styling comes through the shared PrimeNG preset and public-sector theme tokens.

The `ps-up-button` is a Candidate implementation for evaluating a more design-system-owned Button model. It renders native Button markup, replaces separate `outlined` and `text` booleans with a single `appearance` API, applies Candidate UP-style token mappings, and directly owns hover, active, focus, disabled, and loading treatments.

The Candidate is intended to prove whether the UP Button API, token treatment, visual model, and governance workflow should eventually be promoted into the stable `ps-button` implementation.

## Key differences

| Area | Current `ps-button` | Candidate `ps-up-button` |
| --- | --- | --- |
| Lifecycle | Stable | Candidate |
| API shape | Uses `outlined` and `text` booleans | Uses one `appearance` input |
| Rendering | Wraps PrimeNG `p-button` | Renders native `<button>` markup |
| Styling ownership | Uses the shared PrimeNG preset | Owns Candidate Button CSS and token mappings |
| Token direction | Uses current public-sector theme tokens | Evaluates UP-style Button token mappings |
| Behavior | Delegates provider behavior through the wrapper | Normalizes activation and suppresses disabled or loading clicks |
| Accessibility | Combines PrimeNG semantics with wrapper behavior | Explicitly controls disabled, loading, focus, and `aria-busy` behavior |
| Visual treatment | Current public-sector styling | Candidate UP-inspired styling |
| Production guidance | Supported for application use | Limited pilot and evaluation only |

## Why this Candidate exists

The current public-sector themes already appear directionally aligned with portions of the UP Design System color language. The most meaningful difference may therefore be the implementation and governance model rather than a completely different palette.

The Candidate evaluates:

- a cleaner Button API;
- Button-specific semantic and component tokens;
- explicit hover, pressed, focus, disabled, and loading styling;
- native Button rendering;
- accessibility ownership;
- shared Figma, Storybook, Zeroheight, and Angular vocabulary;
- QA and federated-shell behavior;
- promotion evidence and governance.

The outcome may be full promotion, partial adoption of selected ideas, continued Candidate work, or retention of the current implementation.

## When to use

Use `ps-up-button` only for:

- the QA Candidates view;
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

Before promotion, every Button-specific token assumption used by `ps-up-button` must be verified against the approved UP Design System Button source. This requirement applies only to the Button Candidate and does not imply migration of the rest of the public-sector design system.

Until design, token, accessibility, Storybook, QA, shell-integration, and governance evidence is complete:

- `ps-button` remains the stable production wrapper;
- `ps-up-button` remains a Candidate;
- application adoption requires explicit approval.

## Known limitations

- Final UP Button source tokens have not been verified against the approved enterprise source.
- Figma Button component and variable links are still pending.
- Storybook currently runs locally until a stable HTTPS deployment is published.
- The Candidate icon input still uses icon CSS classes and should eventually use an approved provider-neutral icon contract.
- Size variants are not yet part of the public Candidate API.
- The Candidate has not been promoted into the canonical `ps-button` selector.

## Live documentation

[Open the UP Button Candidate page in Zeroheight](https://jeffreysanford.zeroheight.com/styleguide/s/143938/p/238541-up-button-Candidate)
