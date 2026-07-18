---
title: System architecture
description: How Starlight, Angular, Storybook, tokens, and the component manifest form one product without sharing one runtime.
---

The documentation, workbench, Storybook, and reference applications are sibling outputs. They share governed data and visual foundations while retaining clear framework responsibilities.

```mermaid
flowchart LR
  Tokens[Semantic token package] --> Docs[Astro Starlight]
  Tokens --> Stories[Storybook]
  Tokens --> Workbench[Angular workbench]
  Tokens --> Apps[Reference applications]

  Source[Angular component source] --> Manifest[Component manifest]
  Stories --> Manifest
  Tests[Tests and accessibility evidence] --> Manifest
  Design[Figma design intent] --> Manifest

  Manifest --> Docs
  Manifest --> Workbench
  Stories --> Docs
  Workbench --> DocsLink[Documentation link]
  DocsLink --> Docs
```

## Runtime boundary

- Starlight owns public guidance, search, navigation, and generated documentation views.
- Angular owns component runtime behavior and integrated workbench workflows.
- Storybook owns isolated component behavior and supported controls.
- Chromatic owns visual review and regression evidence.
- The component manifest owns identity, lifecycle, evidence references, alignment status, and blockers.
- Figma owns approved design intent, not runtime implementation.

The preferred public topology mounts Starlight at `/docs/`, the Angular workbench at `/workbench/`, and Storybook at `/storybook/` or its coordinated hosted URL.
