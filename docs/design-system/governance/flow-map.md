# Governance Flow Map

This map shows how design-system decisions, token artifacts, runtime packages,
validation evidence, and documentation should move through the platform.

## End-To-End Flow

```text
Figma design intent
  -> Starlight governance and handoff
      -> approved usage, status, owners, evidence links
  -> approved DTCG-compatible token export
  -> source-controlled token build
      -> tokens.css
      -> design-tokens.json
      -> TypeScript token exports
      -> token-metadata.json
  -> packages/primeng-preset
  -> packages/ui-patterns registry wrappers
  -> shell, subapps, Storybook, and Playwright
  -> promotion lifecycle evidence
  -> Starlight guidance and governance pages
```

Starlight can sit between design and engineering as the human governance and
handoff layer. The repository and generated artifacts remain the implementation
source of truth. Starlight receives documentation-ready outputs and evidence
links; it does not compile runtime tokens or configure applications.

## Figma And DTCG Input

Design intent:

- Should happen: Figma captures anatomy, variants, states, accessibility notes,
  and token intent.
- Should not happen: screenshots alone become runtime values.

Token input:

- Should happen: the token repo consumes a Figma-backed DTCG-compatible JSON
  artifact.
- Should happen: Starlight records the approved decision and links the source
  artifact, if the team uses it for handoff.
- Should not happen: Starlight becomes the token compiler or the only source
  of production token values.

Validation:

- Should happen: the token build validates naming, aliases, and required
  metadata.
- Should not happen: ad hoc CSS values bypass token mapping.

Feedback:

- Should happen: implementation gaps go back to design for token or component
  decisions.
- Should not happen: shipped differences become undocumented overrides.

## Token Repo Outputs

| Output | Consumer | Purpose |
| --- | --- | --- |
| `tokens.css` | Shell, remotes, Storybook, tests | Runtime CSS custom properties and theme variables. |
| `design-tokens.json` | Tooling, docs, tests | Machine-readable token metadata. |
| TypeScript exports | PrimeNG preset, tests, tooling | Shared values without duplicating token data. |
| `token-metadata.json` | Starlight content build process | Documentation-ready token data. |
| PrimeNG preset mapping | `packages/primeng-preset` | Maps tokens into PrimeNG semantic and component tokens. |

The same resolved values should feed runtime CSS, PrimeNG preset values, wrapper
behavior, and validation tests.

## Runtime Consumption

| Boundary | What Flows In | What Flows Out |
| --- | --- | --- |
| Shell | Token CSS, approved provider, remote manifest, wrappers | Theme context, mounted remotes, shell e2e evidence |
| Subapps | Token CSS, approved provider, wrappers | Bootstrapped Web Components and isolated evidence |
| Registry | CSS variables, token helpers, preset | Wrapper APIs, lifecycle metadata, Storybook examples |
| PrimeNG preset | Token values and mapping rules | PrimeNG configuration and bridge variables |

New and target-state subapps consume `@public-sector/ui-patterns`, not PrimeNG
directly. Migrated legacy subapps may keep direct PrimeNG temporarily when the
path is allowlisted, owned, and tracked as migration debt.

## Starlight Flow

| Flows Into Starlight | Does Not Flow Into Starlight |
| --- | --- |
| Generated token documentation artifacts such as `token-metadata.json` | Runtime token delivery |
| Component usage guidance | `remoteEntry` URLs |
| Lifecycle status and ownership | Shell mounting configuration |
| Storybook, Playwright, source, and Figma links | Application routing |
| Migration guidance from direct PrimeNG to wrappers | Component implementation source of truth |
| Release notes and deprecation notes | PrimeNG preset generation |

Starlight is a governed communication surface. It should explain approved
usage and link evidence, not become a runtime dependency.

## Evidence And Promotion Flow

```text
Wrapper or token change
  -> rebuild artifacts
  -> Storybook isolated component proof
  -> shell-mounted or remote Playwright proof
  -> accessibility and theme checks
  -> registry lifecycle update
  -> Starlight guidance update
```

| Stage | Evidence |
| --- | --- |
| Experimental | Local implementation or initial Storybook proof. |
| Candidate | Storybook states, token alignment, and direct remote or shell-mounted proof. |
| Active | Versioned wrapper, accessibility checks, Playwright evidence, owner, notes, and guidance. |
| Deprecated | Migration path, replacement guidance, owner, and removal plan. |

Storybook proves isolated component behavior. Playwright proves repeatable
runtime behavior in shell-mounted and remote contexts. Promotion remains a
governance decision backed by evidence, not an automatic build result.

## Boundary Owners

Named owners still need to be confirmed in the enterprise repository. Until
then, use these role owners for accountability:

| Boundary | Role Owner | Owns |
| --- | --- | --- |
| Design | Design system design owner | Figma intent, anatomy, variants, states, accessibility notes, token intent. |
| Platform | Platform/runtime owner | Shell composition, theme context, token delivery, remotes, provider setup. |
| Token pipeline | Design system engineering owner | DTCG ingestion, mapping rules, artifacts, versioning. |
| Registry | Component registry owner | Wrapper API, PrimeNG encapsulation, lifecycle, Storybook, migration guidance. |
| Subapps | Subapp team owner | Wrapper use, local bootstrap, route behavior, legacy PrimeNG allowlist entries. |
| Quality evidence | QA or platform validation owner | Playwright, accessibility, overlay proof, evidence links. |
| Starlight | Design system governance owner | Guidance, owners, evidence, lifecycle, deprecation notes. |

Enterprise validation should replace role owners with named accountable owners
or team aliases before the platform documentation is treated as final.
