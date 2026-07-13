# Implementation Options

The shell and subapplication integration model should be chosen after comparing
the runtime, styling, routing, and deployment tradeoffs against the real code.

## Options To Compare

![Implementation options](../diagrams/shared-design-system-implementation-options.png)

| Option | Strengths | Risks/Costs |
| --- | --- | --- |
| Web Components | Boundary, explicit host, independent mount. | Confirm Shadow DOM; design routing, DI, lifecycle. |
| Federated Angular routes | Router integration, conventions. | Tighter version coordination. |
| Native Federation ES modules | Modern loading, explicit dependencies. | Build/runtime config needed. |
| `mount()`/`unmount()` | Clear contract, flexibility. | More custom lifecycle code. |
| Iframe adapter | Strong isolation for legacy. | Styling, routing, Accessibility cost. |
| Build-time libraries | Simple where deployment unnecessary. | No runtime composition. |

## Evaluation Criteria

- Routing ownership
- Styling inheritance and isolation
- Lifecycle and cleanup
- Angular dependency sharing
- PrimeNG and overlay behavior
- Independent deployment
- Failure and fallback behavior
- Design-token compatibility
- Migration cost for existing applications

## Current Recommendation

Use federated Web Components as the recommended default for the shell and
subapplication boundary. They provide a stable custom-element contract, preserve
independent subapplication bootstrapping, and keep the shell from depending on
subapplication Angular internals.

Keep the design-system contract portable across viable options:

- Tokens should be available as CSS custom properties and package artifacts.
- Registry components should work in normal Angular applications first.
- Storybook should prove isolated component behavior.
- Shell validation should prove integration behavior.
- Zeroheight should document approved usage and link to evidence.

Federated Angular routes or ES module remotes can still be appropriate when the
shell intentionally owns routing, providers, or a tighter Angular integration.
Those options should be treated as stronger coupling decisions, not as the
default shell boundary.

## Why Web Components Fit Best Here

The current architecture already points toward custom-element remotes:

- The shell loads remote configuration from `module-federation.manifest.json`.
- Remotes bootstrap independently and register custom elements.
- The shell can mount each subapplication without importing its Angular routes,
  providers, or components.
- The design system can remain separate from the shell while still proving
  tokens, registry components, PrimeNG behavior, and accessibility in the
  composed runtime.

This works well for a unified platform shell because the shell owns navigation,
authorization, app chrome, and remote loading, while subapplications own their
domain workflows and release timing.

The decision does not remove the need for explicit contracts. Web Components
still require clear rules for:

- Shadow DOM versus light DOM
- Inputs, attributes, events, and context passing
- Remote lifecycle and cleanup
- Route ownership between shell and subapplication
- PrimeNG provider registration in every independently bootstrapped app
- Token CSS inheritance and overlay behavior
