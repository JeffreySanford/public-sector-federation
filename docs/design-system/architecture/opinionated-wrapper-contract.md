# Opinionated Wrapper Contract

## Decision

Public wrappers expose the smallest useful design-system contract required by the
shell and subapps. PrimeNG remains a private rendering and behavior provider.

The team does not mirror every PrimeNG parameter, callback, template, or styling
escape hatch simply because the provider makes it available.

```text
consumer need
    -> approved design-system concept
    -> typed public wrapper contract
    -> private PrimeNG translation
    -> tested runtime behavior
```

## Public versus private API

The UP Button Candidate now demonstrates the preferred boundary.

### Public contract

- `label`
- provider-neutral `icon`
- `intent`: `primary`, `secondary`, or `destructive`
- `appearance`: `solid`, `outlined`, or `text`
- `disabled`
- `loading`
- `activated`

### Private PrimeNG implementation

The wrapper may use PrimeNG `variant`, `styleClass`, loading behavior, provider CSS
variables, event payloads, and icon classes internally. Applications do not receive
those controls as part of the supported design-system contract.

## Why intent replaces provider inventory

PrimeNG offers a broad severity vocabulary. The Candidate does not publish that
inventory as the preferred application API. It starts with product-facing action
purposes that the shell and subapps can justify:

| Public intent | Design-system meaning | Private token mapping |
| --- | --- | --- |
| `primary` | Main action for the current task | UP primary Button tokens |
| `secondary` | Supporting or alternative action | UP secondary Button tokens |
| `destructive` | Action with destructive consequences | UP error Button tokens |

New intents require a validated consumer need, design review, Storybook evidence,
accessibility review, and a reviewed manifest change.

## Normalized events

The preferred `activated` output emits `void`. Consumers receive the information
that the governed action occurred without depending on PrimeNG's `onClick` callback
or a browser `MouseEvent` payload.

A lower-level event should be added only when a real application requirement cannot
be met through the high-level action contract.

## Compatibility window

The Candidate previously published `tone` and `buttonClick`. They remain temporary
compatibility aliases so existing QA and Storybook evidence does not break during
the refactor.

- New work uses `intent` and `activated`.
- The manifest records the aliases as known limitations.
- Storybook shows preferred and compatibility usage side by side.
- Promotion must remove the aliases or define an explicit deprecation window.

Compatibility is not permission to add more mirrored PrimeNG controls.

## Enforcement

`pnpm manifest:check` checks provider-specific public member names. A wrapper that
keeps PrimeNG internal must either remove a provider-specific member or record it as
an explicit escape hatch.

Known escape hatches remain advisory warnings. For example, the stable `ps-button`
still records `styleClass` while the Candidate exposes no equivalent consumer
styling hook.

## Storybook evidence

Open:

```text
Design System / Architecture / Opinionated Wrapper Contract
```

The stories cover:

- the approved public API;
- the hidden PrimeNG controls;
- the supported intent matrix;
- provider translation;
- the temporary compatibility window.

Storybook is evidence and explanation. The component manifest remains the
machine-readable contract.

## Human decision points

Automation can extract source facts, generate matrices, detect provider leaks, and
prepare review artifacts. Humans still approve:

- whether a consumer need justifies a new input or event;
- semantic vocabulary;
- supported combinations;
- accessibility behavior;
- breaking changes and deprecation windows;
- Figma mappings;
- Candidate promotion.
