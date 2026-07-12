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

## Runtime Considerations

CSS custom properties are a strong cross-boundary styling contract because they
can be inherited by descendants, including descendants inside a shadow tree when
the variable is defined on the host or an ancestor.

Selector-based rules are different. A custom element rendered in light DOM does
not block selector styles, while Shadow DOM does. The implementation needs to
confirm whether subapplications use Shadow DOM and where token variables are
attached.

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
