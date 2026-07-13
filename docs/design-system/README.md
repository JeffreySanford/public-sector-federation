# Design System Architecture

This folder describes the proposed operating model for design tokens,
PrimeNG-based component reuse, shell integration, validation, and governance.

The intent is to keep the active documentation small enough to review and easy
to correct once the production repositories are available.

## Current Status

- Confirmed: tokens, component reuse, Storybook, shell validation, Playwright,
  Figma, and Zeroheight all need clear responsibilities.
- Proposed: a versioned token pipeline, a governed component registry, and a
  promotion model based on evidence from Storybook and shell validation.
- Needs validation: production token source location, PrimeNG preset mapping,
  router ownership details, Shadow DOM usage per remote, overlay behavior, and
  release/versioning process.

## Start Here

1. [Focus](./focus.md)
2. [Operating model](./architecture/operating-model.md)
3. [Token pipeline](./architecture/token-pipeline.md)
4. [Token consumption strategy](./architecture/token-consumption-strategy.md)
5. [Component registry](./architecture/component-registry.md)
6. [Shell interaction](./architecture/shell-interaction.md)
7. [Federated Web Components decision](./architecture/federated-web-components-decision.md)
8. [Implementation options](./architecture/implementation-options.md)
9. [Component promotion](./governance/component-promotion.md)
10. [Repository review checklist](./validation/repository-review-checklist.md)

## Tool Responsibilities

| Tool or surface | Primary role |
| --- | --- |
| Figma | Design intent, anatomy, states, and handoff references |
| Token source files | Authoritative design values for build outputs |
| PrimeNG preset | Semantic and component token mapping |
| Component registry | Supported Angular UI APIs and reusable patterns |
| Storybook | Live isolated component contract |
| `/qa` or shell validation | Integrated runtime proof |
| Playwright | Repeatable verification evidence |
| Zeroheight | Guidance, governance, status, and links to evidence |
| Shell configuration | Remote locations and runtime integration |

## Supporting Diagrams

The diagrams in [diagrams](./diagrams/) describe the proposed operating model.
They should be treated as review material until validated against the real
implementation repositories.

- [Design system architecture diagram](./diagrams/design-system-architecture-diagram.png)
- [Token delivery decision diagram](./diagrams/token-delivery-decision-diagram.png)
- [Implementation options](./diagrams/shared-design-system-implementation-options.png)
- [Runtime architecture](./diagrams/shared-design-system-implementation-runtime-architecture.png)
- [Repository validation map](./diagrams/repository-validation-map.png)
