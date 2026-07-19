# Historical Zeroheight Governance Model

## Status

This document records the governance model explored during the Zeroheight experiment. It is retained because the source-of-truth boundaries, lifecycle vocabulary, evidence expectations, and owner responsibilities remain useful.

Zeroheight itself is superseded by:

- Astro Starlight as the canonical public guidance surface;
- the generated component manifest as the relationship, lifecycle, evidence, and gap layer;
- Storybook as the live isolated implementation surface;
- Angular source as runtime truth;
- repository tests and release gates as verification evidence.

Zeroheight must not be required for supported development, CI, release, promotion, or public documentation workflows.

See [Documentation Upgrade Current Status](../../documentation-upgrade/00-current-status.md) and [Zeroheight Retirement Strategy](../../documentation-upgrade/15-zeroheight-retirement-strategy.md).

## Preserved governance flow

The useful governance relationship is tool-neutral:

```text
Figma design intent
  -> human design and accessibility review
  -> Angular implementation and token mapping
  -> Storybook isolated behavior
  -> integration, Playwright, axe, and visual evidence
  -> component manifest lifecycle and relationship record
  -> Starlight usage guidance and known-gap explanation
```

Runtime delivery remains separate:

```text
approved token source
  -> source-controlled token build
  -> CSS variables, JSON metadata, TypeScript exports, and PrimeNG preset
  -> Angular wrappers, shell, remotes, Storybook, and tests
```

The documentation surface communicates decisions. It does not compile tokens, implement components, route remotes, or promote components automatically.

## Source-of-truth split

| Surface | Authoritative for |
| --- | --- |
| Figma | Approved or draft design intent, anatomy, states, and interaction intent |
| Token source | Runtime design values, generated artifacts, and build validation |
| Angular source | Component implementation, public APIs, behavior, and releases |
| Storybook | Live isolated examples, supported states, and interaction behavior |
| Component manifest | Identity, lifecycle, relationships, evidence, alignment, ownership, blockers, and explicit gaps |
| Starlight | Public usage guidance, architecture explanations, decisions, and links to evidence |
| Playwright, axe, visual, and Lighthouse gates | Repeatable automated verification evidence |
| Human review | Design polish, manual accessibility review, and promotion decisions |
| Zeroheight | Historical documentation-platform experiment only |

## Lifecycle vocabulary

| Status | Meaning | Use guidance |
| --- | --- | --- |
| Idea | Identified need not yet accepted for discovery | Track only |
| Proposed | Accepted for discovery but not implemented | Do not use in application work |
| Experimental | Implementation under development; API and guidance may change | Use only with explicit owner approval |
| Candidate | Evidence is sufficient for a bounded promotion review | Pilot in limited scope |
| Active | Versioned, tested, documented, and supported for its declared scope | Preferred path for new work |
| Deprecated | Available temporarily with migration guidance | Do not use for new work |
| Retired | No longer supported or distributed | Use the named replacement |

Technical qualifiers—such as Storybook verified, automated accessibility pass, manual review pending, Figma partial, provider warning, or legacy migration—must remain separate from lifecycle status.

## Promotion evidence

A component, token group, or reusable pattern should not be promoted until the applicable evidence is explicit:

| Dimension | Expected evidence |
| --- | --- |
| Design intent | Figma reference, design decision, or an honest missing/draft state |
| Implementation | Angular source and package/public API reference |
| Token alignment | Approved semantic-token chain or a documented exception |
| Variants and states | Canonical Storybook behavior for supported combinations |
| Accessibility | Semantics, keyboard behavior, focus, contrast, disabled/loading behavior, automated checks, and manual status |
| Theme behavior | Light and dark behavior where applicable |
| Integration | Shell or remote validation when runtime context matters |
| Automation | Repeatable Playwright or unit coverage for high-risk behavior |
| Documentation | Starlight route with purpose, usage, behavior, and known gaps |
| Ownership | Named owner or an explicit unowned state |
| Change guidance | Release, migration, replacement, or deprecation notes where needed |

Overlays, dialogs, menus, toasts, tables, and forms require integration evidence because their behavior may differ inside federated remotes.

## Canonical component-page model

Each Starlight component page should include:

- purpose;
- when to use and when not to use;
- canonical live Storybook behavior near the top;
- lifecycle and evidence summary;
- anatomy;
- supported variants and states;
- interaction and responsive behavior;
- accessibility contract and manual-review status;
- content guidance;
- semantic and component token relationships;
- public Angular API and provider boundary;
- Figma identity or explicit missing/draft status;
- known limitations and decisions;
- source, test, Storybook, and design references;
- migration or deprecation guidance where applicable.

The page must guide a user before presenting large evidence tables. The manifest supplies relationship facts; the page explains how and why to use the component.

## Owner responsibilities

| Boundary | Owner role | Responsibility |
| --- | --- | --- |
| Design | Design owner | Intent, anatomy, variants, states, content, and accessibility intent |
| Tokens | Token owner | Source ingestion, normalization, aliases, and generated artifacts |
| Components | Registry/component owner | Wrapper API, lifecycle, implementation, and remediation |
| Platform | Platform owner | Shell integration, theme context, remote loading, and provider boundaries |
| Applications | Application owner | Adoption, exceptions, migration debt, and integration evidence |
| Validation | Quality/accessibility owner | Storybook, Playwright, automated accessibility, visual, and manual-review evidence |
| Documentation | Documentation owner | Starlight guidance, content quality, decisions, and evidence links |
| Governance | Product/governance owner | Promotion, deprecation, support, ownership, and prioritization decisions |

Named accountable owners should replace role placeholders when an adopting organization defines its operating model.

## Change process

1. A need is proposed with an owner and user problem.
2. The component owner checks for an existing pattern before creating a duplicate.
3. Design records intent, anatomy, variants, states, and content expectations.
4. Engineering implements or remediates the token, wrapper, or pattern.
5. Storybook captures isolated behavior and supported controls.
6. Tests capture unit, interaction, accessibility, visual, and integration evidence.
7. The manifest records lifecycle, references, gaps, blockers, and ownership.
8. Starlight publishes purpose, usage, behavior, accessibility expectations, and decisions.
9. Human reviewers approve, defer, block, deprecate, or reject the change.
10. Lifecycle changes only when the required evidence and decision are recorded.

## Legacy PrimeNG policy

New and target-state applications should use governed wrapper APIs. Migrated applications may retain direct PrimeNG temporarily only when the usage is inventoried, owned, time-bounded, and tracked as migration debt.

Starlight and the manifest should distinguish:

- the approved wrapper path for new work;
- temporary provider-specific exceptions;
- the evidence and deadline for remediation;
- migration guidance from direct PrimeNG to the governed API.

## Current application

The first implementation of this preserved governance model is the Button + `StoryFrame` slice. It will prove the component-page structure, live behavior boundary, manifest relationship, accessibility contract, visual review, decisions, and explicit Figma/manual-review gaps before the model expands to Select and Dialog.
