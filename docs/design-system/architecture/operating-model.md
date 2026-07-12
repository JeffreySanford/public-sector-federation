# Operating Model

This document describes how design intent, tokens, component implementation,
runtime validation, and documentation should work together.

## Development Flow

```text
Figma design intent
  -> version-controlled design tokens
  -> generated CSS, JSON, and TypeScript outputs
  -> PrimeNG semantic token mapping
  -> component registry wrappers and composite components
  -> Storybook isolated validation
  -> direct subapplication validation
  -> shell-mounted validation
  -> Playwright verification
  -> Zeroheight guidance and governance
```

The important separation is that runtime assets come from source-controlled
packages and build outputs. Zeroheight documents the system and links to
evidence; it does not supply runtime tokens, components, or remote URLs.

## Runtime Flow

![Runtime architecture](../diagrams/shared-design-system-implementation-runtime-architecture.png)

```text
Shell loads global foundations and remote configuration
  -> shell mounts or routes to a subapplication
  -> subapplication consumes tokens and registry components
  -> shared styling and behavior are validated in the composed runtime
```

The shell definitely consumes the token contract. Whether it also consumes
registry components should be confirmed with the shell owners. If it does, those
components should follow the same versioning and promotion rules as remote
consumers.

## Working Assumptions

| Topic | Status | Notes |
| --- | --- | --- |
| Token source | Needs validation | Identify authoritative source and generated outputs. |
| Component registry | Proposed | Wrap PrimeNG only where shared behavior, accessibility, defaults, or API stability are needed. |
| Shell mounting | Open decision | Web Components, federated Angular routes, ESM lifecycle functions, and other options need comparison. |
| Shadow DOM | Open decision | Custom elements do not imply Shadow DOM. Selector isolation only applies at an actual shadow boundary. |
| CSS variables | Proposed contract | Custom properties can be inherited through hosts and into shadow trees when defined on an ancestor or host. |
| Overlays | Needs validation | Portal-based overlays may inherit from a different DOM ancestor than the triggering component. |
| Zeroheight | Proposed governance surface | Document status, usage, evidence, and ownership. |

## Review Goal

This document should help reviewers answer two questions:

- Does the proposed responsibility model match how the real repositories work?
- Which assumptions need to be verified before the team treats this as the
  operating model?
