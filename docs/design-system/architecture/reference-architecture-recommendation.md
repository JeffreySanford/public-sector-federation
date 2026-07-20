# Reference Architecture Recommendation

## Summary

Treat design tokens as a versioned runtime contract shared by the shell, independently bootstrapped remotes, the PrimeNG preset, and the governed component registry.

The recommended model is:

- use Figma as a design input and DTCG-compatible JSON as the expected exchange format;
- generate semantic CSS variables, metadata, TypeScript helpers, and provider mappings from one token build;
- keep PrimeNG behind provider-neutral wrapper APIs for new and target-state work;
- let the shell establish the integrated theme context while remotes import the token package for isolated development and tests;
- use Storybook, Playwright, accessibility checks, and manifest evidence before promoting a component;
- use Starlight as documentation, governance, status, and evidence output—not as runtime delivery.

## Token mapping

```text
Figma or DTCG-compatible source
  -> primitive values
  -> semantic --ps-* variables
  -> component intent tokens
  -> PrimeNG --p-* bridge and preset values
  -> governed wrappers and runtime CSS
```

The sample repository proves this shape with generated artifacts, mapping rules, automated token tests, and runtime theme evidence. An adopting organization must still validate its authoritative export, terminology, and naming conventions.

See [Token Mapping Spec](./token-mapping-spec.md).

## Component registry

```text
applications and remotes
  -> @public-sector/ui-patterns
      -> @public-sector/primeng-preset
          -> @public-sector/tokens
      -> provider internals
```

Applications and remotes should not import `primeng/*`, render `<p-*>` selectors, expose PrimeNG event or option types, or style provider internals directly. Wrappers expose product and design-system language while the integration package owns provider translation.

Simple semantic markup and layout do not require a provider wrapper. Use native Angular and HTML with shared tokens where no PrimeNG behavior is needed.

See [Registry Consumption Spec](./registry-consumption-spec.md) and the [Component Catalog](../components/catalog.md).

## Token delivery

The delivery model combines four responsibilities:

1. A versioned token package is the source of generated runtime artifacts.
2. The shell loads token CSS and owns the integrated theme class or attribute.
3. Remotes import tokens and the approved provider setup so they work independently.
4. Federation aligns shared package versions to reduce drift.

Shell-only CSS is insufficient because remotes need isolated development. Remote-only CSS is insufficient because the shell owns the integrated user experience. The combined model supports both.

See [Token Delivery Decision](./token-delivery-decision.md).

## DOM and overlay boundaries

The reference implementation uses light DOM, so root semantic variables and fonts cascade through mounted remotes. Selector-based styles are not the cross-application contract; semantic CSS variables are.

PrimeNG overlays may append to `body`. Theme state and token variables therefore live on `html` or `:root`, and integration tests cover dialogs, menus, selects, popovers, and tooltips across theme changes.

## Evidence and lifecycle

A component registry entry may be active, candidate, deprecated, partial, blocked, or ready. The manifest records:

- public API completeness;
- provider boundaries;
- token mappings;
- Storybook and test evidence;
- keyboard and accessibility status;
- Figma and documentation bindings;
- ownership and promotion requirements.

Partial states are intentional and useful. They make missing evidence visible rather than implying that every exported component is fully approved.

## What this repository proves

- generated token artifacts and provider mappings share one contract;
- direct PrimeNG use is enforceably contained;
- the shell and remotes share theme state through CSS variables;
- body-appended overlays inherit the active theme;
- wrapper candidates can carry Storybook, automated behavior, accessibility, and governance evidence;
- the component manifest can be generated and checked for drift;
- the architecture works as a public reference without depending on Starlight at runtime.

## What production adoption must decide

- authoritative token export and approved normalization rules;
- package naming, release cadence, and version support policy;
- accountable owners and stewards;
- legacy migration allowlists and deadlines;
- final component design approvals and manual assistive-technology review;
- deployment, security, monitoring, and operational controls.
