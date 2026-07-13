# Component Registry

The component registry should provide supported Angular UI APIs and reusable
patterns built on top of PrimeNG and the shared token contract.

The registry should not become a wrapper around every PrimeNG component by
default. It should exist where the team needs consistency, validation,
Accessibility, behavior, or stable APIs across applications.

## Usage Model

| Choice | Use when |
| --- | --- |
| PrimeNG directly | Tokens and approved defaults are enough. |
| Thin registry wrapper | Shared defaults, Accessibility, telemetry, consistency, or control. |
| Composite component or pattern | Multiple pieces form a reusable business or UX workflow. |

## Registry Expectations

- Components consume system tokens and PrimeNG semantic mappings.
- Public APIs are typed and stable enough for multiple application teams.
- Supported states are demonstrated in Storybook.
- Accessibility expectations are explicit.
- Shell-mounted behavior is validated before broad promotion.
- PrimeNG and Angular compatibility are versioned and documented.
- Deprecated components include migration guidance.

## Example Registry Entry

A complex registry should track more than a component name. Each entry should
make ownership, maturity, token use, implementation dependencies, validation,
and documentation evidence visible.

```json
{
  "id": "public-status-card",
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

## When Not To Add A Wrapper

Avoid a wrapper when it only renames a PrimeNG component without adding a shared
contract. Direct PrimeNG usage is acceptable when the component already behaves
correctly with the token preset and the team does not need a governed API.

## Questions To Validate

- Is the registry a separate package, repository, or workspace library?
- Which PrimeNG version is pinned?
- Which components already exist?
- Are wrappers thin, broad, or mixed?
- Is Storybook already available?
- How are registry releases published?
- Does the shell consume registry components or only tokens?
