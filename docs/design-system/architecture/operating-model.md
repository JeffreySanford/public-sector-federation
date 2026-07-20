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
  -> Starlight guidance and governance
```

The important separation is that runtime assets come from source-controlled
packages and build outputs. Starlight documents the system and links to
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

Runtime evidence indicates remotes are Web Components mounted in light DOM,
`.p-dark` is applied at the document level, overlays append to `body`, and each
remote bootstraps independently. Each remote therefore needs the approved
PrimeNG setup unless shared bootstrap code provides it.

## Working Assumptions

| Topic | Status | Notes |
| --- | --- | --- |
| Token source | Needs validation | Identify source and generated outputs. |
| Component registry | Required boundary | Wrap PrimeNG so the provider can be swapped later. |
| Shell mounting | Answered | Use federated Web Components. |
| DOM model | Answered | Observed remotes mount in light DOM. |
| CSS variables | Proposed contract | Custom properties inherit through hosts/shadows. |
| Overlays | Answered, validate | Observed overlays append to `body` and inherit root context. |
| Starlight | Proposed governance | Document status, usage, evidence, ownership. |

## Review Goal

This document should help reviewers answer two questions:

- Does the proposed responsibility model match how the real repositories work?
- Which assumptions need to be verified before the team treats this as the
  operating model?
