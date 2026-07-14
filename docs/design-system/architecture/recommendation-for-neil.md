# Recommendation For Neil

## Summary

I have locked down the working decisions for the design-system plan. The focus
is now applied delivery: how tokens map, how the registry consumes the contract,
and how the shell and remotes receive the same runtime values.

The recommendation is:

- Treat tokens as a versioned runtime contract.
- Use Figma as the known design input and DTCG-compatible JSON as the expected
  token artifact shape.
- Keep Zeroheight as documentation, governance, status, and evidence. It is not
  runtime delivery and is not a token creation source.
- Always wrap PrimeNG for target-state and new subapp development. Migrated
  legacy subapps may keep existing PrimeNG usage temporarily while wrappers are
  added ad hoc.
- Use a combined token delivery model: shared token package, shell-owned theme
  context, remote token imports for isolated development, and federation
  alignment for versions.

## Token Mapping

The proposed mapping is:

```text
Figma/DTCG-compatible source
  -> primitive values
  -> semantic --ps-* tokens
  -> component intent tokens
  -> PrimeNG --p-* bridge and preset values
  -> registry wrappers and runtime CSS
```

This is documented in
[Token Mapping Spec](./token-mapping-spec.md).

The current repo proves the shape with a sample Figma/DTCG fixture, generated
token artifacts, and unit coverage for mapping rules. The sample fixture is not
the full enterprise source of truth; it validates the expected input shape
until the real enterprise export is available.

The mapping spec includes concrete review examples for primary action color,
card surface/typography, and danger-to-error provider terminology.

## Component Registry

The registry decision is:

```text
apps/remotes
  -> @public-sector/ui-patterns
      -> @public-sector/primeng-preset
          -> @public-sector/tokens
      -> PrimeNG internals
```

New applications and target-state remotes should not import `primeng/*`,
render `<p-*>` components directly, use PrimeNG template directives directly,
or style app-level `.p-*` selectors.

Wrappers expose design-system language and keep PrimeNG terminology internal.
For example, `ps-button` exposes `tone`, `outlined`, `text`, `disabled`,
`loading`, `routerLink`, and `buttonClick`. It maps those to PrimeNG internals
inside `packages/ui-patterns`.

This is documented in
[Registry Consumption Spec](./registry-consumption-spec.md).

Developers should discover available wrappers through
[Component Catalog](../components/catalog.md), then Storybook evidence and the
`packages/ui-patterns/src/index.ts` barrel export. If no pattern exists, they
should use native Angular/HTML with token variables for simple markup, or add a
wrapper inside `packages/ui-patterns` when PrimeNG behavior is needed.

For migrated legacy subapps, missing wrappers should not break the app or block
the first migration pass. Existing PrimeNG usage can remain temporarily if it
is captured as migration debt. New work in those apps should still prefer the
registry wrapper path.

## Token Delivery

The delivery recommendation is a combined model:

```text
shared token package
  -> shell loads token CSS and owns theme context
  -> remotes import tokens for isolated development and tests
  -> federation shares package versions to reduce drift
  -> PrimeNG preset and registry wrappers consume the same values
```

Shell-only global CSS is not enough because remotes need to run in isolation.
Remote-only token CSS is not enough because the shell owns the integrated user
experience and active theme. The combined model keeps both requirements.

This is documented in
[Token Delivery Decision](./token-delivery-decision.md).

The pipeline hardening criteria are documented in
[Token Pipeline Hardening](./token-pipeline-hardening.md).

The token CSS and PrimeNG preset must work whether a component is consumed
through a registry wrapper or directly by a migrated legacy app. Wrappers govern
the public API and provider replacement path; they are not required for the
runtime token values to resolve.

The versions that must stay aligned are:

- `@public-sector/tokens`
- `@public-sector/primeng-preset`
- `@public-sector/ui-patterns`
- theme class or attribute, currently modeled as `html.p-dark`
- PrimeNG provider setup for independently bootstrapped runtimes

## DOM And Overlay Boundaries

The current runtime evidence indicates mounted remotes render in light DOM.
That means CSS variables and fonts can cascade into remotes through the normal
document tree.

Selector-based styles should not be the delivery contract. CSS variables are
the contract because they survive the shell/remote boundary more reliably and
can be validated at runtime.

PrimeNG overlays need separate proof because dialogs, menus, selects, popovers,
and tooltips may append to `body`. Theme state and token variables must live on
`html` or `:root` so overlays inherit the same context. The repo already has
dialog overlay proof; menu, select, popover, and tooltip should be added next.

## What Is Proven

The current repo proves:

- token build outputs are generated from the token package;
- the sample Figma/DTCG input shape is validated by `pnpm build:tokens`;
- mapping rules are covered by token tests;
- PrimeNG direct usage is blocked outside approved integration packages;
- legacy PrimeNG compatibility can be allowlisted explicitly for migrated apps;
- `ps-button` is represented in Storybook and shell-mounted routes;
- Storybook e2e passes for the current wrapper evidence set;
- lint, token tests, and `ui-patterns` typecheck pass.

## What Still Needs Enterprise Validation

The remaining checks are production-specific:

- confirm the real enterprise Figma/DTCG export shape;
- confirm production token CSS load path in the shell;
- confirm remote token import/inheritance strategy;
- confirm package version sharing across shell and remotes;
- decide which enterprise paths are legacy compatibility paths;
- decide whether wrapper API shape is strict for new subapps and tiered or
  ad hoc for legacy migration cases.

## Recommendation

Proceed with the applied model:

1. Use the token package as the runtime contract.
2. Map tokens through semantic `--ps-*`, component intent, and PrimeNG `--p-*`
   bridge values.
3. Keep PrimeNG behind registry wrappers for new and target-state work.
4. Use the component catalog as the developer discovery surface.
5. Deliver tokens through the combined shell/remote model.
6. Use Storybook and shell e2e as evidence before promoting components.
7. Treat direct PrimeNG in migrated legacy apps as tracked migration debt, not
   as the default pattern.

This gives the platform a provider-replaceable registry and a token model that
works in federated Web Components without making Zeroheight or the shell the
source of truth.
