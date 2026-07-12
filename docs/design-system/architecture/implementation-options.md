# Implementation Options

The shell and subapplication integration model should be chosen after comparing
the runtime, styling, routing, and deployment tradeoffs against the real code.

## Options To Compare

![Implementation options](../diagrams/shared-design-system-implementation-options.png)

| Option | Strengths | Risks or costs |
| --- | --- | --- |
| Federated Web Components | Framework boundary, explicit host element, useful for independently mounted remotes. | Does not automatically mean Shadow DOM; Angular routing, lifecycle, and dependency sharing still need design. |
| Federated Angular routes or modules | Natural Angular router integration and shared Angular conventions. | Tighter Angular version coordination and less framework isolation. |
| Native Federation or federated ES modules | Modern module loading with explicit shared dependency strategy. | Requires careful build and runtime configuration. |
| Explicit `mount()` / `unmount()` lifecycle | Clear runtime contract and framework flexibility. | More custom integration code and lifecycle responsibility. |
| Iframe adapter | Strong isolation for legacy or incompatible applications. | Styling, routing, accessibility, and cross-app communication are more expensive. |
| Build-time shared libraries | Simple where independent deployment is unnecessary. | Does not solve independent runtime composition. |

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

Do not treat one mounting model as final until the repository and shell behavior
are validated. The design-system contract should remain portable across viable
options:

- Tokens should be available as CSS custom properties and package artifacts.
- Registry components should work in normal Angular applications first.
- Storybook should prove isolated component behavior.
- Shell validation should prove integration behavior.
- Zeroheight should document approved usage and link to evidence.
