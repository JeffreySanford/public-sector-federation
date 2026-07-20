# Component Registry

The component registry should provide supported Angular UI APIs and reusable
patterns built on top of PrimeNG and the shared token contract.

Current guidance is that PrimeNG is always wrapped for new and target-state
work so the underlying component provider can be swapped later. Migrated
legacy applications may keep existing direct PrimeNG usage temporarily while
wrappers are added ad hoc.

Application teams should consume the governed registry API for new work. Direct
PrimeNG in legacy apps should be treated as migration debt with an owner and
removal path.

## Usage Model

| Choice | Use when |
| --- | --- |
| Strict registry wrapper | Core components need stable design-system APIs and normalized events. |
| Thin normalized wrapper | Advanced components need broad PrimeNG capability behind a stable import path. |
| Composite component or pattern | Multiple pieces form a reusable business or UX workflow. |
| Legacy compatibility exception | Existing migrated app usage must keep working before a wrapper exists. |

## Registry Expectations

- Components consume system tokens and PrimeNG semantic mappings.
- Public APIs are typed and stable enough for multiple application teams.
- Supported states are demonstrated in Storybook.
- Accessibility expectations are explicit.
- Shell-mounted behavior is validated before broad promotion.
- PrimeNG and Angular compatibility are versioned and documented.
- Deprecated components include migration guidance.
- Legacy exceptions are inventoried and removed as wrappers become available.

## Example Registry Entry

A complex registry should track more than a component name. Each entry should
make ownership, maturity, token use, implementation dependencies, validation,
and documentation evidence visible.

```json
{
  "id": "ps-status-card",
  "name": "PublicStatusCard",
  "package": "@public-sector/ui-patterns",
  "status": "candidate",
  "owner": "Design System Team",
  "description": "Summarizes service health, progress, and next action.",
  "source": "packages/ui-patterns/src/status-card",
  "storybook": {
    "title": "Design System/Status Card",
    "url": "/?path=/story/design-system-status-card--states"
  },
  "zeroheight": {
    "page": "Components / Status Card",
    "documents": ["usage", "accessibility", "content guidance"]
  },
  "tokens": {
    "semantic": [
      "--ps-content-background",
      "--ps-content-border",
      "--ps-text",
      "--ps-status-success",
      "--ps-status-warning"
    ],
    "primeNg": ["content.background", "content.border.color"]
  },
  "dependencies": {
    "angular": "^21.0.0",
    "primeng": "^21.0.0",
    "usesPrimeNg": ["Tag", "Button"]
  },
  "api": {
    "inputs": ["title", "description", "severity", "actionLabel"],
    "outputs": ["action"]
  },
  "states": [
    "default",
    "success",
    "warning",
    "critical",
    "loading",
    "empty"
  ],
  "accessibility": {
    "keyboard": "Action is reachable by Tab and activates with Enter/Space.",
    "semantics": "Heading level is configurable by host context.",
    "contrast": "Severity color is not the only status indicator."
  },
  "validation": {
    "unit": "packages/ui-patterns/src/status-card/status-card.spec.ts",
    "storybook": "apps/qa-remote/e2e/storybook-stories.spec.ts",
    "shell": "apps/shell/e2e/federation.spec.ts"
  },
  "promotion": {
    "requiredEvidence": [
      "Storybook states render",
      "Token styles resolve in shell and remote",
      "Accessibility checks pass",
      "PrimeNG overlay behavior confirmed when applicable"
    ],
    "approvedBy": []
  }
}
```

The exact storage format can be JSON, TypeScript metadata, generated
documentation, or a registry service. The important point is that the registry
records the contract and evidence, while token values remain owned by
`packages/tokens`.

The companion
[Registry Consumption Spec](./registry-consumption-spec.md)
defines the wrapper import boundary, token consumption model, wrapper anatomy,
and promotion lifecycle in more detail.

## Lifecycle Statuses

| Status | Meaning |
| --- | --- |
| Experimental | API may change; use only for proof work. |
| Candidate | API shape is proposed and ready for design-system review. |
| Active | Approved for app and remote consumption. |
| Deprecated | Supported only while teams migrate to a replacement. |

Registry entries should include lifecycle status and evidence links so teams
can tell whether a wrapper is safe to adopt.

## Wrapper Boundary

Avoid wrappers that only rename a PrimeNG component without defining a useful
public contract. The wrapper can still be thin, but it should make the provider
boundary explicit and keep PrimeNG imports out of application code.

The remaining design decision is wrapper API shape:

- strict design-system APIs for all public inputs, outputs, and event payloads;
- thin normalized pass-through APIs for advanced or high-surface components;
- a tiered model where core components are strict and advanced utilities are
  thinner.

The migration decision is separate: new subapps should use the registry from
the start, while migrated legacy subapps can move one component family at a
time.

## Questions To Validate

- Is the registry a separate package, repository, or workspace library?
- Which PrimeNG version is pinned?
- Which components already exist?
- Are wrappers thin, broad, or mixed?
- Which wrappers form the first proof set?
- Is Storybook already available?
- How are registry releases published?
- Does the shell consume registry components or only tokens?
