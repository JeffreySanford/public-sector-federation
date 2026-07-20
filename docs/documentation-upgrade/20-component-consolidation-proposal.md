# Component Consolidation Proposal

_Status: Button decision approved; remaining recommendations working · Last aligned: July 20, 2026_

## Purpose

Recommend which components should become canonical, which contracts should be remediated or merged, which compatibility surfaces should be deprecated, and what designers should treat as the code-informed reference set when rebuilding Figma.

This proposal is grounded in [18 — Component estate audit](./18-component-estate-audit.md) and [19 — Accessibility findings and remediation](./19-accessibility-findings-and-remediation.md). It does not promote components automatically or fabricate design approval.

## Decision principles

1. Begin with shipped behavior and actual application use.
2. Prefer one intentional public contract per user problem.
3. Keep provider-specific types, events, selectors, and styling private.
4. Wrap a provider when it supplies valuable behavior without controlling the public API.
5. Prefer native or Angular CDK primitives when accessibility, composition, or migration control requires ownership.
6. Deprecate through an observable compatibility window rather than silent removal.
7. Give Figma the supported public contract, not every provider option.
8. Keep automated evidence, manual review, and design approval separate.

## Flagship recommendations

### Button

**Approved decision:** Keep `ps-button` as the canonical selector and merge the stronger
`ps-up-button` contract into it. Do not maintain two permanent Button components.

Preferred contract:

- `intent: primary | secondary | destructive`;
- `appearance: solid | outlined | text`;
- `disabled`;
- `loading`;
- provider-neutral governed icon identifier;
- `activated: void`.

Deprecation candidates:

- `tone`;
- `styleClass`;
- `outlined`;
- `text`;
- `buttonClick: MouseEvent`;
- PrimeIcons class strings;
- `routerLink` on the action component.

Navigation should use a separate Link or link-button presentation contract so semantics do not depend on a Button input.

Compatibility aliases remain supported until the next major release. During that window they are
deprecated, documented with replacements, and covered against regression. Removal requires usage
evidence, migration notes, and an intentional major-version change. See the
[Button API migration contract](../design-system/components/button-api-migration.md).

### Select

**Decision:** Retain the PrimeNG-backed implementation because its overlay, option navigation, and model behavior provide material value. Preserve the compact provider-neutral public option model.

Required remediation before treating the contract as complete:

- required and invalid states;
- help and error description relationships;
- disabled-option semantics;
- richer content decision;
- manual assistive-technology review;
- public `--ps-*` token relationships.

### Dialog

**Decision:** Retain the native Dialog as the current canonical implementation while comparing its next remediation against Angular CDK overlay and accessibility primitives.

Required remediation:

- background inertness;
- body scroll lock;
- accessible description;
- configurable initial-focus policy;
- stacked-dialog policy;
- manual assistive-technology review;
- public semantic overlay tokens.

The existing focus containment and restoration implementation remains valuable evidence, but the project should document why it owns this behavior instead of assuming custom code is always preferable.

## Estate-wide recommendations

### Provider boundary

PrimeNG may remain behind governed wrappers for components where it supplies complex, tested behavior. Direct provider imports remain prohibited in product applications except recorded migration exceptions.

### Token boundary

Native components should consume public `--ps-*` semantic and component tokens. PrimeNG `--p-*` tokens belong in the provider preset or adapter boundary. Direct `--p-*` consumption in native components is remediation debt.

### Selector naming

`ps-*` is the approved canonical selector prefix. `ps-empty-state`, `ps-form-section`,
`ps-page-header`, and `ps-status-card` replace the corresponding `public-*` names in new code.
The legacy selectors remain compatibility aliases until the next major release. Removal requires
usage evidence, migration notes, and the intentional major boundary recorded in the
[selector-prefix migration](../design-system/components/selector-prefix-migration.md).

### Testing boundary

- Unit tests own input/output mapping and state transitions.
- Storybook `play` functions own portable isolated interactions.
- Axe owns automated rule evidence for declared states.
- Playwright owns overlays, focus, reflow, themes, cross-browser behavior, and integrated flows.
- Chromatic owns human-reviewed visual baselines and regressions.
- Manual reviews own assistive-technology evidence.

A package test target that exits successfully without executing tests should be replaced with real component tests.

### Primitive-selection boundary

The [component primitive strategy](../design-system/architecture/component-primitive-strategy.md)
records the provider-wrapper, native, and Angular CDK decision criteria and applies them to Button,
Select, and Dialog. It preserves the current implementations while defining evidence-based triggers
for reconsideration; it does not present the current Dialog implementation as permanently exempt
from CDK evaluation.

## Preliminary disposition model

| Disposition | Meaning |
| --- | --- |
| Canonical | Recommended implementation and public contract |
| Retain | Continue using while completing named remediation |
| Merge | Move decisions into the canonical implementation |
| Replace | Migrate to a different implementation |
| Deprecate | Supported temporarily with a replacement path |
| Investigate | Evidence is insufficient for a final decision |

Every manifest entry should receive one of these dispositions after usage discovery.

## Figma reference set

Designers rebuilding the component library should begin with Button, Select, and Dialog because they expose three different consolidation cases:

| Component | Figma should represent | Figma should not inherit |
| --- | --- | --- |
| Button | Intent, appearance, supported states, anatomy, focus, loading, semantic tokens | PrimeNG severity names, class strings, compatibility aliases |
| Select | Label, option model, states, popup anatomy, keyboard intent, validation relationships, tokens | PrimeNG inputs, internal overlay configuration, provider DOM |
| Dialog | Modal anatomy, title/description, action hierarchy, size constraints, focus intent, destructive flow, overlay tokens | Private focus-trap selectors or implementation timing |

Figma status remains draft or pending until actual component identifiers and design review are recorded. Code-informed reconstruction is a reference input, not automatic design approval.

## Migration sequence

1. Complete usage discovery and duplication clusters.
2. Record accessibility findings and manual flagship reviews.
3. Implement the approved Button consolidation and next-major compatibility window.
4. Add Select validation semantics.
5. Choose and implement the Dialog primitive strategy.
6. Move native components from direct `--p-*` consumption to `--ps-*` tokens.
7. Record canonical selector and API decisions in the manifest.
8. Produce the Figma reconstruction packet.
9. Reorganize Storybook around canonical, experimental, and deprecated contracts.
10. Remove compatibility surfaces only after adoption evidence supports it.

## Proposal acceptance criteria

- [ ] Every public entry has a documented disposition.
- [ ] Usage evidence supports removal or migration decisions.
- [x] Button has one approved target contract.
- [x] Provider-backed versus native/CDK decisions include explicit tradeoffs.
- [ ] Accessibility findings influence promotion and consolidation.
- [ ] Figma references supported public behavior rather than provider internals.
- [x] Button deprecations include replacement guidance and a compatibility window; other component deprecations remain pending.
- [ ] Decisions and unresolved questions are visible in Starlight and the manifest.
