# Design Decisions For Neil

## Scope

Based on the candidate repo analysis and runtime architecture evidence, these
are the remaining decisions that unlock implementation. This is not a request to
reconsider the federated Web Component architecture. That runtime is assumed.

<span style="color: #b00020"><strong>Red note:</strong></span>
This file is written in sanitized terms for the public-sector sample repo. It
should be reconciled with the actual enterprise screenshots and source before it
is treated as implementation proof.

## Decision 1: Wrapper API Shape

PrimeNG is always wrapped because the component provider may be swapped later.
The remaining question is what wrapper surface the registry exposes.

### 1.1 First Proof Set Scope

What is the minimal wrapper proof set to validate the pattern?

- Button alone.
- Button plus one overlay component, such as Dialog or Select.
- Button plus Card plus Input.
- Full component set from the start.

### 1.2 Public API Shape

What contract do wrappers expose?

- Strict design-system API: wrappers normalize inputs and events, re-export only
  design-system types, and never expose PrimeNG types.
- Thin normalized pass-through: wrappers accept PrimeNG inputs and outputs
  largely as-is, while providing a stable registry import path.
- Tiered model: core components use strict design-system APIs, while advanced
  utilities use thinner normalized pass-through APIs.

### 1.3 PrimeNG Type And Event Leakage

Are wrappers allowed to expose PrimeNG types at all?

- Never: normalize every public input, output, return type, and event payload.
- Selectively: allow PrimeNG types for complex configuration objects.
- Freely: wrappers are thin shells and consumers work with PrimeNG patterns.

### 1.4 Concrete Boundary Example

Avoid direct PrimeNG imports in applications and remotes:

```ts
import { ButtonModule } from 'primeng/button';
```

```html
<p-button severity="danger" label="Save"></p-button>
```

Prefer the governed registry package:

```ts
import { PsButtonComponent } from '@public-sector/ui-patterns';
```

```html
<ps-button tone="danger" label="Save"></ps-button>
```

In a real implementation, `ps-button` maps to the organization's registry
naming. The architectural boundary is the same: applications consume registry
wrappers, while PrimeNG remains internal to the wrapper implementation.

## Decision 2: Token Normalization

The candidate repo includes normalization decisions in the token build. The
question is whether these are approved semantic choices or compatibility shims.

### 2.1 Semantic Status Naming

Current behavior normalizes `danger` to `error`.

- Is `error` the approved status name going forward?
- Is `danger` the source-of-truth name with build-time normalization only?
- Should both exist as supported aliases?

### 2.2 Deprecated Typography Tokens

The source includes typography groups that appear to be deprecated or superseded.

- Should deprecated typography tokens be removed from the source?
- Should they be ignored by the build?
- Should they be promoted as the current semantic type scale and documented as
  active?

### 2.3 Compatibility Corrections

The build applies corrections that do not originate directly from source tokens,
such as ramp endpoint aliases.

- Should compatibility corrections stay in the build pipeline?
- Should they move back to Figma or the authoritative token source?
- Are they permanent architectural decisions or debt to clean up?

## Runtime Architecture: Answered By Evidence

The reviewed runtime evidence answers the runtime architecture questions.

| Question | Answer |
| --- | --- |
| Injector per remote? | Yes. Each remote loads separately with its own Angular injector. |
| PrimeNG provider per remote? | Yes. Each remote bootstraps independently and needs approved PrimeNG setup. |
| Where is `.p-dark`? | At the global document level, such as `html` or `body`. |
| DOM strategy? | Light DOM. Web Components inherit `:root` CSS variables naturally. |
| Overlay append target? | `body`, using the default PrimeNG overlay behavior. |
| CSS variable inheritance? | Automatic through the document cascade. |

See [Runtime Architecture Answered](./runtime-architecture-answered.md) for the
detailed summary.

## Decision 3: Validation Acceptance Criteria

What proof is enough before review?

### 3.1 Minimum Proof Bar

Which of these must pass before review?

- Package build and typecheck.
- Wrapper unit tests.
- Playground demo.
- Shell-mounted remote proof.
- Storybook examples.
- Playwright integration tests.
- Visual regression tests.

### 3.2 Overlay Inclusion

Should the first proof include an overlay component?

- Yes: Button plus Dialog or Select.
- No: Button only; defer overlays to a second pass.
- Conditional: include overlays only if the runtime evidence is confirmed in
  source.

## Summary

| Decision | Blocks | Status |
| --- | --- | --- |
| Wrapper API shape | Wrapper implementation, tests, and docs. | Needs Neil. |
| Token normalization | Token build approval and documentation stability. | Needs Neil or Dan. |
| Runtime architecture | Shell and remote integration strategy. | Answered by runtime evidence. |
| Validation acceptance | Review readiness and evidence scope. | Needs Neil or Dan. |

## Quick Ask

The runtime architecture appears answered. The two decisions that most directly
unlock implementation are:

1. What wrapper API shape should the registry use?
2. Are the current token normalizations approved semantic decisions?

After that, define the minimum validation bar so the implementation proof does
not become broader than needed.
