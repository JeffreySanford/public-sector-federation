# Component Primitive Strategy

## Purpose

Choose implementation primitives from shipped behavior and ownership needs rather than applying
one library to every component. The public API and semantic token contract remain provider-neutral
regardless of the implementation choice.

## Decision criteria

| Approach | Prefer when | Cost and risk | Required boundary |
| --- | --- | --- | --- |
| Governed provider wrapper | A library supplies valuable interaction, overlay, state, or browser behavior | Provider DOM and upgrade changes require adapter tests | Provider inputs, events, types, selectors, and tokens stay private |
| Native Angular and HTML | Semantics are stable and behavior is small enough to own and verify | The team owns accessibility behavior, edge cases, and maintenance | Public `--ps-*` tokens and explicit keyboard/accessibility tests |
| Angular CDK primitive | Overlay, focus, portals, positioning, or composition needs shared infrastructure without a styled public API | Adds dependency and integration complexity; still requires product semantics and styling | Wrap CDK behavior behind the same public component contract |
| Build from scratch | No provider or CDK primitive meets a proven requirement | Highest accessibility and maintenance burden | Written rationale, focused tests, and review before promotion |

Visual preference alone is not a reason to replace a proven behavioral primitive. Conversely,
existing provider use is not sufficient reason to expose provider concepts publicly.

## Flagship application

### Button — governed PrimeNG wrapper

Retain the provider internally while consolidating on the approved `ps-button` contract. Button
behavior is comparatively small, but the existing provider mapping is proven and replacement adds
little immediate value. Reconsider native implementation only if provider constraints block the
approved API, accessibility, tokens, or bundle goals.

### Select — governed PrimeNG wrapper

Retain PrimeNG because popup positioning, option navigation, selection state, and body-appended
overlay behavior provide material value. The wrapper owns validation relationships and compatibility
semantics such as disabled-option `aria-disabled`. Reconsider when provider DOM changes repeatedly
break the adapter, required accessibility behavior cannot be supplied safely, or a CDK-based option
has equivalent evidence at acceptable cost.

### Dialog — native today, CDK evaluation trigger recorded

Retain the current native Dialog for its declared single-modal scope because focus containment,
restoration, inert background behavior, scroll locking, and description relationships have focused
browser evidence. This is not a permanent rejection of Angular CDK.

Evaluate a CDK-backed implementation before adding any of the following:

- stacked or nested dialogs;
- portal-based or cross-container rendering;
- configurable initial-focus targets and focus restoration policies;
- shared overlay stacking, positioning, or scroll strategies;
- repeated defects in the wrapper-owned focus or isolation lifecycle.

Adoption requires parity tests against the public contract; consumers must not receive CDK types or
configuration objects merely because the implementation changes.

## Promotion evidence

Every choice must record:

1. the user behavior that justifies the primitive;
2. the public API and token boundary;
3. keyboard, accessibility, and responsive evidence;
4. provider or CDK escape hatches, if any;
5. upgrade and replacement triggers;
6. unresolved manual review and design approval separately.

This record verifies that the tradeoff was made explicitly. It does not complete pending NVDA,
Chrome, Figma, token-remediation, or stacked-dialog work.
