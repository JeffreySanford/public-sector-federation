# Focus

## Primary Problem

The shell mounts a subapplication through a Web Component. Design tokens need to
be available to both the shell and the mounted subapplication. Some values, such
as fonts and CSS custom properties, can inherit through normal CSS inheritance.
Selector-based styles do not cross an actual Shadow DOM boundary.

Zeroheight is not part of runtime delivery. It can document tokens and link to
evidence, but `remoteEntry` belongs to subapplication configuration.

## System Diagram

![Design system architecture diagram](./diagrams/design-system-architecture-diagram.png)

The diagram shows five separate flows:

- Generated output flow from token source files into CSS variables, JSON,
  TypeScript helpers, the PrimeNG preset, shell, subapps, Storybook, and
  Zeroheight documentation.
- Runtime flow from the shell to subapp configuration, the Web Component host,
  and the mounted subapplication.
- Registry consumption showing that registry components may be used by the
  shell and subapps and should be validated in Storybook.
- Validation flow through `/qa` and Playwright before evidence is linked into
  Zeroheight.
- Documentation flow showing Zeroheight as guidance and governance, not runtime
  delivery.

## Methods To Compare

| Method | What to evaluate |
| --- | --- |
| Shell loads global token CSS | Does the Web Component and subapp inherit the needed CSS variables? |
| Subapp imports token CSS | Does this avoid shell dependency or create version drift? |
| Shared token package | Can shell, registry, and subapps consume the same versioned artifacts? |
| Host-level variable injection | Should the shell set variables on the Web Component host for theme scoping? |
| PrimeNG preset mapping | How do system tokens become PrimeNG semantic/component tokens? |
| Registry component consumption | Does the shell use registry components, or only subapps? |
| Overlay strategy | Do PrimeNG overlays inherit the same variables when rendered outside the subapp host? |

## Questions To Validate From Code

- Where does the shell get `remoteEntry` configuration?
- Is the mounted Web Component using Shadow DOM or light DOM?
- Where are token CSS variables attached?
- Does the subapp bundle token CSS, inherit shell CSS, or both?
- Where do PrimeNG overlays render?
- Does the shell consume registry components?
- How are token, registry, shell, and subapp versions aligned?
