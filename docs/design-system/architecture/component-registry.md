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
