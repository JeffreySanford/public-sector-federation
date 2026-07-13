# Critical Design Decisions

## Scope

This is the short version of the remaining decision list. It is based on the
candidate repo analysis and runtime architecture evidence.

The runtime architecture is already answered at a useful level. See
[Runtime Architecture Answered](./runtime-architecture-answered.md).

## 1. Wrapper API Shape

Given that PrimeNG is always wrapped, what surface do wrappers expose?

Options:

- Strict design-system API: public wrapper types only; PrimeNG types and events
  do not leak.
- Thin normalized pass-through: wrappers accept PrimeNG inputs largely as-is,
  while still providing a stable registry import path.
- Tiered model: core components are strict; advanced utilities are thinner.

First proof set scope:

- Button only.
- Button plus Dialog or another overlay.
- Button plus Card plus Input.

PrimeNG type leakage:

- Never: normalize everything.
- Selectively: allow complex config objects.
- Freely: thin shells expose PrimeNG patterns.

What this means in application code:

```ts
// Avoid in applications and remotes.
import { ButtonModule } from 'primeng/button';
```

```html
<!-- Avoid in applications and remotes. -->
<p-button severity="danger" label="Save"></p-button>
```

```ts
// Preferred: import from the governed registry package.
import { PsButtonComponent } from '@public-sector/ui-patterns';
```

```html
<!-- Preferred: consume the registry wrapper. -->
<ps-button tone="danger" label="Save"></ps-button>
```

In a real implementation, `ps-button` maps to the organization's registry
naming. The boundary stays the same: applications consume registry wrappers, and
PrimeNG remains internal to the wrapper implementation.

## 2. Token Normalization

Are the current normalization decisions approved semantic choices or temporary
compatibility shims?

Current decisions:

- `danger` to `error`;
- deprecated typography handling;
- ramp aliases for missing steps such as `50 -> 100` and `950 -> 900`.

Questions:

- Is `danger` to `error` permanent or temporary?
- Should deprecated typography be removed, ignored, or promoted?
- Should hard-coded corrections move back to Figma or the authoritative token
  source?

## 3. Runtime Architecture

The runtime architecture is answered by the observed federation pattern:

- each remote is a Web Component custom element;
- remotes mount in light DOM;
- `:root` CSS variables inherit automatically;
- `.p-dark` applies at the global document level;
- overlays append to `body` and inherit root token context;
- each remote bootstraps its own Angular app and needs approved PrimeNG setup.

No architecture decision is needed here. The remaining work is validation in
source and tests.

## Decision Impact Matrix

| Decision | Status | Unlocks | Blocks |
| --- | --- | --- | --- |
| Wrapper API shape | Needs Neil. | Package structure, component list, unit test scope. | Wrapper implementation. |
| Token normalization | Needs Neil or Dan. | Build pipeline sign-off and docs stability. | Token export validation. |
| Runtime architecture | Answered. | Integration test strategy. | Nothing architectural. |
| Validation acceptance | Needs Neil or Dan. | Review readiness and evidence scope. | Final proof scope. |

## Why These Still Matter

The candidate repo establishes the token and PrimeNG mapping layer. The runtime
evidence establishes the Web Component and CSS cascade model.

The remaining decisions are practical:

1. What should the wrapper API look like?
2. Are token normalizations approved design-system decisions?
3. What proof is enough before review?
