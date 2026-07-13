# Token Pipeline

The token pipeline should make design values reusable by the shell,
subapplications, registry components, PrimeNG, documentation, and tests.

## Proposed Flow

![Token delivery decision diagram](../diagrams/token-delivery-decision-diagram.png)

```text
Figma or authoritative design-token source
  -> validation and transformation
  -> governed token package or enterprise artifact
  -> CSS custom properties
  -> JSON metadata
  -> TypeScript helpers or constants
  -> PrimeNG semantic token preset
  -> component registry, shell, and subapplications
  -> Storybook and Playwright validation evidence
  -> Zeroheight documentation and governance
```

Zeroheight documents the token contract and evidence. It does not provide
runtime token delivery or `remoteEntry` configuration.

## Responsibilities

- Figma, token source files, or the approved token artifact provide the design
  intent and governed values.
- Generated CSS exposes runtime custom properties.
- Generated JSON or TypeScript supports tooling, docs, and tests.
- The PrimeNG preset maps system tokens into PrimeNG semantic and component
  tokens.
- Storybook and shell validation prove that tokens work in isolated and
  integrated contexts.
- Zeroheight displays token guidance and examples; it does not serve production
  runtime tokens.

## Required Implementation Constraints

The architecture choice is assumed: the shell composes federated Web Components.
The token pipeline should fit that architecture instead of arguing for another
mounting model.

- The token source of truth should live in a versioned package or equivalent
  enterprise artifact, not in Zeroheight and not only in the shell.
- The shell or platform runtime should establish active theme context.
- Each remote should resolve the same token contract, either through direct
  dependency for isolated development or shell-provided runtime context when
  mounted.
- The PrimeNG preset should be generated from or mapped to the same token
  values used by CSS custom properties.
- Registry components should consume semantic tokens and PrimeNG preset values,
  wrap PrimeNG, and avoid independent visual values.
- Runtime evidence indicates remotes mount in light DOM, so root CSS variables
  and document-level theme classes should cascade into mounted content.
- Runtime evidence indicates PrimeNG overlays append to `body`, so they should
  inherit `:root` token values and `html.p-dark` theme context.
- Zeroheight should document token guidance and evidence links; it should not
  supply runtime tokens.

## Recommended Consumption Model

Applications should consume the tokens through a combination of runtime CSS and
package APIs:

```text
Figma or authoritative design-token source
  -> packages/tokens or equivalent enterprise artifact
  -> generated CSS custom properties for runtime styling
  -> generated JSON metadata for documentation and validation
  -> derived TypeScript exports for presets and tests
  -> PrimeNG preset mapped from the same values
```

The primary runtime contract is CSS custom properties. The shell or platform
runtime should load or provide the generated token CSS at the application
boundary and apply the active theme context. Remotes should be able to resolve
the same contract directly for local development, Storybook, and remote-specific
tests, while also inheriting shell-provided context when mounted. This creates a
deliberate overlap: the platform provides the integrated theme context, while
remotes keep enough token dependency to avoid being shell-only applications.

TypeScript exports should support tooling, tests, and the PrimeNG preset. They
should be generated from or derived from token build artifacts rather than
manually duplicating token values. The PrimeNG preset should map from those same
values into PrimeNG semantic and component tokens.

## Applied Repository Model

The sample repository is aligned to this model in these places:

- `packages/tokens` owns the source token files and generated artifacts.
- `packages/tokens/src/tokens.css` exposes runtime CSS custom properties.
- `packages/tokens/src/design-tokens.json` and
  `packages/tokens/src/zeroheight-tokens.json` provide tooling and
  documentation metadata.
- `packages/tokens/src/index.ts` exports derived token data from generated
  artifacts instead of maintaining a second hardcoded token copy.
- `packages/primeng-preset` consumes `@public-sector/tokens` and maps the
  values into the PrimeNG preset.
- The shell imports the generated token CSS and establishes the integrated
  runtime context.
- Each remote imports the generated token CSS so it can render inside the shell
  and in isolation.
- Federation configuration shares `@public-sector/tokens` as a singleton to
  reduce token-version drift between shell and remotes.

This is the practical answer to the consumption question: publish a versioned
token contract with generated CSS, generated metadata, and optional derived
package exports; let the shell or platform runtime establish active theme
context; require remotes to resolve the same token contract for independent
rendering; and use the same source to drive PrimeNG mapping.

## Theme Flow

The shell or platform runtime should establish the active theme decision because
it owns the integrated experience, navigation, route placement, and runtime
composition. Theme changes should be represented as stable classes or attributes
on a shared ancestor such as `html`, `body`, the shell root, or the Web
Component host.

Remotes should not define competing theme values. They should read the same CSS
custom property names and respond to the shell-provided theme context. For
isolated development, a remote may apply the same theme class locally, but the
token names and values should still come from the token package.

## DOM Boundary Requirements

The current recommendation assumes token delivery must be proven against the
actual Web Component implementation. Runtime evidence indicates remotes mount in
light DOM:

- Global CSS variables, PrimeNG theme CSS, typography, and selector-based
  component styles can reach the mounted content.
- `html.p-dark` can drive theme state through the normal document cascade.
- Source and integration tests should confirm no remote attaches a shadow root
  before the model is treated as final.

Web Components do not automatically mean Shadow DOM, but the observed runtime is
light DOM. If a future remote uses Shadow DOM, it must explicitly validate
host-level variables, PrimeNG component styling, overlays, focus behavior,
accessibility relationships, and lifecycle cleanup.

## PrimeNG Overlay Requirements

PrimeNG overlays require a separate token check because dialogs, menus, selects,
tooltips, and popovers render under `body` in the observed runtime. Because the
token context is rooted at `:root` and the theme class is on `html`, those
overlays should inherit the same token and theme context as shell and remote
content.

The overlay strategy should confirm:

- that overlays append to `body`;
- whether overlay elements can resolve `--ps-*` and `--p-*` variables;
- whether dark mode and alternate themes affect overlays consistently;
- whether z-index, focus management, and keyboard behavior remain stable in the
  shell-mounted route and the isolated remote.

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
not block selector styles, while Shadow DOM does. The observed implementation
uses light DOM with document-level token variables.

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
slotted content. The observed runtime uses light DOM, which is the expected path
for the current PrimeNG-based registry work.

PrimeNG needs extra scrutiny when Shadow DOM is used. Many PrimeNG components
depend on global theme CSS, semantic CSS variables, and overlay behavior.
Dialogs, menus, dropdowns, calendars, popovers, and tooltips may render overlays
under `body` or a shared overlay container rather than inside the component that
opened them. If a PrimeNG component is placed inside Shadow DOM, validate token
inheritance, overlay styling, focus management, accessibility relationships, and
lifecycle cleanup before treating the component as design-system ready.

Overlays need separate validation. In the observed runtime, overlays append to
`body` and should inherit `:root` variables and `html.p-dark` theme context. Add
integration coverage before token delivery is treated as complete.

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
