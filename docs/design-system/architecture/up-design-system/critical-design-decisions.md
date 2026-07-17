# Critical Design Decisions

## Scope

This is the short decision list for adopting the reference design-system architecture. The sample runtime is already proven at a useful level; the remaining decisions are product, ownership, and production-policy choices.

## 1. Wrapper API shape

The sample recommends a strict provider-neutral API for core components:

- application teams import from the governed registry package;
- PrimeNG modules, selectors, events, and configuration types remain internal;
- advanced escape hatches require an explicit registry decision;
- simple semantic markup stays native and token-driven;
- legacy direct PrimeNG use is temporary, allowlisted, owned, and tracked.

An adopting organization must approve its exact naming, event, compatibility, and exception conventions.

## 2. Token normalization

Normalization rules must be visible and approved rather than hidden inside build code.

The sample demonstrates:

- provider terminology translation such as `danger` to `error`;
- deprecated-token handling;
- precedence when token sources overlap;
- compatibility aliases for missing ramp values.

The organization must decide whether each rule is permanent design language or temporary migration debt.

## 3. Runtime architecture

The sample demonstrates:

- independently bootstrapped custom-element remotes;
- light DOM and root CSS-variable inheritance;
- document-level light and dark theme state;
- body-appended overlays inheriting root token context;
- an approved PrimeNG provider registered for each independently running runtime.

Production adoption must validate the same assumptions against the real shell, remotes, deployment topology, and version-sharing policy.

## 4. Validation acceptance

Define the evidence bar before expanding the component catalog.

Recommended evidence for an interactive wrapper includes:

- build and type checking;
- provider-boundary validation;
- Storybook variants and interaction states;
- keyboard and automated accessibility coverage;
- dedicated behavior tests;
- shell integration for overlays or cross-runtime behavior;
- manual design and assistive-technology review before final promotion.

## Decision impact matrix

| Decision | Sample recommendation | Production owner must decide |
| --- | --- | --- |
| Wrapper API | Strict provider-neutral core wrappers | Naming, exceptions, and migration policy |
| Token normalization | Explicit, tested mapping rules | Which mappings are approved or temporary |
| Runtime delivery | Shared package plus shell theme context and remote imports | Exact loading, sharing, and rollback policy |
| Validation | Risk-based evidence and visible lifecycle states | Required evidence and approvers |
| Documentation | Repository-generated evidence with Zeroheight as output | Publishing workflow and page ownership |

## Recommended order

1. Approve token source and normalization.
2. Approve wrapper API and provider boundaries.
3. Define package and theme version alignment.
4. Define evidence requirements and ownership.
5. Validate the production shell, remotes, and overlay behavior.
6. Pilot adoption before broad rollout.
