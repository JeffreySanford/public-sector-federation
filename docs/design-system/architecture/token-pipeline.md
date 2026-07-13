# Token Pipeline

The token pipeline should make design values reusable by the shell,
subapplications, registry components, PrimeNG, documentation, and tests.

## Proposed Flow

![Token delivery decision diagram](../diagrams/token-delivery-decision-diagram.png)

```text
Authoritative token source
  -> validation and transformation
  -> CSS custom properties
  -> JSON metadata
  -> TypeScript helpers or constants
  -> PrimeNG semantic token preset
  -> shell, subapplications, registry, Storybook, and documentation
```

## Responsibilities

- Token source files own the production values.
- Generated CSS exposes runtime custom properties.
- Generated JSON or TypeScript supports tooling, docs, and tests.
- The PrimeNG preset maps system tokens into PrimeNG semantic and component
  tokens.
- Storybook and shell validation prove that tokens work in isolated and
  integrated contexts.
- Zeroheight displays token guidance and examples; it does not serve production
  runtime tokens.

## Zeroheight Documentation Export

Zeroheight should receive token data from generated repo artifacts, not from
runtime application CSS. The repository remains the source of truth, and the
token package produces documentation-friendly outputs during its build.

```text
packages/tokens source files
  -> token build script
  -> tokens.css
  -> zeroheight-tokens.json
  -> design-tokens.json
  -> Zeroheight import or sync
```

`zeroheight-tokens.json` is the preferred documentation export for Zeroheight.
It should carry token names, values, descriptions, categories, and any metadata
needed for designers and engineers to understand approved usage. Production
applications should consume CSS variables, package exports, or PrimeNG preset
mapping instead of reading Zeroheight data at runtime.

The delivery mechanism should be explicit. Viable options include manual upload,
CI artifact review, API-based sync, or a scheduled publishing job. For governed
systems, prefer a CI-generated export with a review or release step so
Zeroheight reflects versioned repository state instead of hand-maintained token
values.

## Component Registry Token Consumption

Registry components should receive tokens from the repository through the same
versioned contract as applications. The component registry should not duplicate
token values or define a parallel theme source.

```text
packages/tokens
  -> generated CSS custom properties
  -> generated TypeScript or JSON helpers
  -> PrimeNG preset mapping
  -> packages/ui-patterns registry components
  -> Storybook, shell, remotes, and Zeroheight examples
```

Registry components should prefer semantic CSS variables and approved PrimeNG
semantic tokens over hardcoded values. When a registry component wraps or
composes PrimeNG, it should inherit the shared PrimeNG provider and preset so
button, input, overlay, focus, and status styles align with the same token
source.

The registry should document which tokens a component depends on, but the token
values should stay in `packages/tokens`. Storybook should render registry
components using the generated token CSS and PrimeNG preset, while tests should
verify that component styles still resolve when mounted inside the shell or a
remote application. If Zeroheight documents a registry component, it should link
to the component guidance and token names, not create independent token values.

## Runtime Considerations

CSS custom properties are a strong cross-boundary styling contract because they
can be inherited by descendants, including descendants inside a shadow tree when
the variable is defined on the host or an ancestor.

Selector-based rules are different. A custom element rendered in light DOM does
not block selector styles, while Shadow DOM does. The implementation needs to
confirm whether subapplications use Shadow DOM and where token variables are
attached.

### Light DOM And Shadow DOM

Angular components normally render into light DOM. Angular's default
`ViewEncapsulation.Emulated` scopes component styles with generated attributes,
but the rendered elements still live in the regular document tree. In this mode,
global token CSS, PrimeNG theme CSS, app-level typography, and selector-based
rules can reach the component markup. This is the safest default for
PrimeNG-based registry components because PrimeNG expects its styled mode theme,
CSS variables, and component classes to be available in the document.

Shadow DOM creates an isolated DOM tree inside a host element. Angular can opt
into this with `ViewEncapsulation.ShadowDom`, and a Web Component can choose to
attach a shadow root. Shadow DOM is useful when a component needs stronger style
isolation, but it changes the token contract. CSS custom properties can still be
inherited when they are defined on the host or an ancestor, but normal selector
rules and global theme CSS do not automatically cross the shadow boundary.

Web Components do not automatically imply Shadow DOM. A custom element can
render light DOM content, attach Shadow DOM, or mix host-level variables with
slotted content. The implementation must confirm the actual rendering model
before assuming how design tokens, selectors, and PrimeNG styles will behave.

PrimeNG needs extra scrutiny when Shadow DOM is used. Many PrimeNG components
depend on global theme CSS, semantic CSS variables, and overlay behavior.
Dialogs, menus, dropdowns, calendars, popovers, and tooltips may render overlays
under `body` or a shared overlay container rather than inside the component that
opened them. If a PrimeNG component is placed inside Shadow DOM, validate token
inheritance, overlay styling, focus management, accessibility relationships, and
lifecycle cleanup before treating the component as design-system ready.

Overlays need separate validation. If an overlay is appended to `body` or a
global overlay container, it may not inherit variables from a local component
host. The overlay strategy should be confirmed before token delivery is treated
as complete.

## Delivery Methods To Compare

| Method | Primary value | Main risk |
| --- | --- | --- |
| Shared token package | One versioned source for all. | Requires publishing management. |
| Shell-loaded global CSS | Central runtime theme contract. | Subapps depend on shell variables. |
| Subapp-bundled CSS | Self-contained subapps, fallback. | Risk of theme drift. |
| Web Component host variables | Good scoping for inherited variables. | Selectors don't cross Shadow DOM. |
| PrimeNG preset mapping | Align PrimeNG to system tokens. | Maintain through PrimeNG upgrades. |

## Questions To Validate

- Where is the authoritative token source?
- What outputs are generated?
- How is the PrimeNG preset created and versioned?
- Does the shell load tokens globally?
- Do remotes bundle tokens, inherit them from the shell, or both?
- How are runtime themes changed?
- How are fallback values handled when a remote version lags behind the shell?
- How does Zeroheight receive token data for documentation?
