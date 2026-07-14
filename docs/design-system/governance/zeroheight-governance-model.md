# Zeroheight Governance Model

## Purpose

Zeroheight should be the visible governance layer for the design system. It
answers what teams should use, when they should use it, who owns it, and what
evidence proves it is ready.

It should not be the runtime source of tokens, component code, shell routing, or
remote loading. Those stay in source-controlled repositories and deployment
configuration.

## Recommended Flow

Zeroheight can sit between design and engineering as a human governance and
handoff layer. That is different from putting Zeroheight in the runtime token
pipeline.

Human governance flow:

```text
Figma design intent
  -> owner approval and Zeroheight guidance, status, and handoff
  -> developer implementation in registry, shell, or subapp
  -> Storybook, source, and validation evidence linked back to Zeroheight
```

Runtime delivery flow:

```text
approved token source
  -> source-controlled token build
  -> CSS variables, JSON metadata, TypeScript exports, and PrimeNG preset
  -> registry, shell, remotes, Storybook, and tests
```

Design, engineering, platform, and accessibility owners approve. Zeroheight
documents and communicates the decision. It should not compile production
tokens or serve runtime assets.

The component governance flow is:

```text
Figma design intent
  -> component or token candidate
  -> registry implementation and token build
  -> Storybook isolated evidence
  -> shell, remote, Playwright, and accessibility validation
  -> Zeroheight approved guidance
```

Zeroheight is the front door for approved usage. The repository remains the
source of implementation truth.

Use this source-of-truth split:

| Surface | Authoritative For |
| --- | --- |
| Figma | Design assets, anatomy, states, and interaction intent. |
| Token repository | Runtime token source, generated artifacts, and build validation. |
| Code repository | Component implementation, APIs, tests, and releases. |
| Storybook | Live implementation behavior, examples, and states. |
| Zeroheight | Published guidance, approved usage, lifecycle status, owners, decisions, and evidence links. |

## What Zeroheight Owns

Zeroheight should own the governed presentation of:

- contribution decisions and rationale where useful;
- component and pattern status;
- usage guidance and anti-patterns;
- approved variants and states;
- accessibility expectations;
- ownership and support contacts;
- migration and deprecation guidance;
- release notes or change summaries;
- links to Figma, Storybook, source, and validation evidence.

## What Zeroheight Does Not Own

Zeroheight should not own:

- runtime token delivery;
- token creation or normalization rules;
- `remoteEntry` URLs;
- shell mounting or routing;
- component implementation;
- PrimeNG preset generation;
- automatic promotion decisions.

Automation can publish or sync documentation later, but promotion should remain
a governance decision backed by evidence.

Zeroheight can also record why a proposal was kept local, deferred, or routed
to research. That history helps teams avoid repeating the same debate and makes
the design system feel like an actively managed product rather than a static
component catalog.

## Lifecycle Statuses

| Status | Meaning | Use Guidance |
| --- | --- | --- |
| Idea | Identified need that has not been accepted for discovery. | Track only; do not use in app work. |
| Proposed | Accepted for discovery and triage, but not yet implemented. | Do not use in app work. |
| Experimental | Implementation under development; API and guidance may change. | Use only with owner approval. |
| Candidate | Evidence complete enough for promotion review. | Pilot in limited scope. |
| Active | Approved, versioned, tested, documented, and supported. | Preferred path for new work. |
| Deprecated | Still available temporarily with migration guidance. | Do not use for new work. |
| Retired | No longer supported or distributed. | Use the replacement. |

Technical qualifiers such as `Storybook verified`, `shell verified`,
`accessibility risk`, or `legacy migration` can be tracked alongside lifecycle
status.

## Promotion Gates

A component, token group, or reusable pattern should not move to `Approved`
until these questions have clear evidence:

| Gate | Required Evidence |
| --- | --- |
| Design intent | Figma reference or design approval. |
| Implementation | Registry source link or token source link. |
| Token alignment | Uses approved semantic tokens or generated PrimeNG mapping. |
| Variants and states | Storybook examples for supported states. |
| Accessibility | Keyboard, semantics, contrast, and disabled/loading behavior checked. |
| Theme behavior | Light, dark, and approved theme variants checked where applicable. |
| Integration | Shell or remote validation when runtime context matters. |
| Automation | Playwright or repeatable validation for high-risk behavior. |
| Ownership | Named owner or owning team. |
| Change notes | Release, migration, or deprecation notes where needed. |

Overlays, toasts, dialogs, tables, and forms should require integration
evidence because they can fail differently in federated remotes.

## Component Page Model

Each Zeroheight component page should include:

- purpose;
- lifecycle status;
- owner;
- package and import path;
- selector or public API;
- when to use it;
- when not to use it;
- approved variants and states;
- anatomy;
- behavior;
- accessibility notes;
- responsive behavior;
- content guidance;
- token usage notes;
- examples;
- migration guidance from direct PrimeNG where relevant;
- known limitations;
- Storybook link;
- Figma link;
- source link;
- shell, remote, or Playwright evidence link;
- release history;
- release or deprecation notes.

Example page outline:

```text
Button

Status: Approved
Owner: Design System Team
Implementation: @public-sector/ui-patterns / ps-button
Storybook: [link]
Source: [link]
Validation: [Playwright or shell evidence link]

Use for:
- primary actions
- secondary actions
- text actions
- loading actions

Do not use for:
- custom colors
- app-level PrimeNG button styling
- direct p-button usage in new subapps
```

## Token Page Model

Token pages should be generated or reviewed from source-controlled artifacts,
not hand-maintained runtime values.

Each token page should explain:

- token purpose;
- semantic usage;
- light and dark values;
- theme variants where applicable;
- deprecated or alias status;
- source artifact or package;
- build or validation evidence;
- known migration notes from older bootstrap artifacts.

The preferred documentation input is a generated artifact such as
`zeroheight-tokens.json`, backed by the token build.

## Owner Responsibilities

| Boundary | Owner | Responsibility |
| --- | --- | --- |
| Design | Design owner | Intent, anatomy, variants, states, accessibility notes. |
| Tokens | Token pipeline owner | Source ingestion, normalization, generated artifacts. |
| Registry | Registry owner | Wrapper API, lifecycle status, implementation evidence. |
| Platform | Platform owner | Shell integration, theme context, remote loading evidence. |
| Subapps | Subapp owner | Adoption, local exceptions, migration debt. |
| Validation | QA or platform validation owner | Storybook, Playwright, accessibility evidence. |
| Zeroheight | Governance owner | Published guidance, status, owners, evidence links. |

Named accountable owners should replace these role owners when the enterprise
repository and operating model are available.

## Change Process

1. A designer, platform engineer, or subapp team proposes a token, component, or
   pattern.
2. The registry owner checks whether an existing pattern already covers it.
3. Design confirms anatomy, variants, states, and content expectations.
4. Engineering implements or updates the token build, wrapper, or pattern.
5. Storybook captures isolated behavior.
6. Playwright, accessibility, shell, or remote validation captures runtime
   evidence where needed.
7. The governance owner updates the Zeroheight page with status, owner,
   evidence, and usage guidance.
8. The component or token moves to the next lifecycle status only when the
   required evidence is linked.

## Legacy PrimeNG Policy

New and target-state subapps should use registry wrappers. Migrated legacy
subapps may keep direct PrimeNG temporarily when the usage is owned,
inventoried, and tracked as migration debt.

Zeroheight should make that distinction visible:

- approved registry path for new work;
- temporary legacy exception where applicable;
- migration guidance from direct PrimeNG to the governed wrapper.

## Immediate Next Steps

1. Create the initial Zeroheight information architecture:
   foundations, tokens, components, patterns, accessibility, release notes, and
   governance.
2. Define the lifecycle status labels and approval gates in Zeroheight.
3. Publish one complete component page, such as Button, as the reference model.
4. Link that page to Figma, Storybook, source, and validation evidence.
5. Repeat for the first high-risk families: dialog, select, menu, toast, table,
   and form controls.
