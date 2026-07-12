# Component Promotion

The promotion model keeps shared UI from becoming an uncontrolled fork of
PrimeNG or a collection of undocumented one-off wrappers.

## Lifecycle

| Status | Meaning |
| --- | --- |
| Experimental | Team-owned, unsupported, and not approved for broad reuse. |
| Candidate | Being evaluated for shared use. |
| Active | Approved, versioned, tested, documented, and supported. |
| Deprecated | Still available temporarily with migration guidance. |

Technical qualifiers such as `Storybook verified`, `shell verified`, or
`accessibility risk` can be tracked separately from lifecycle status.

## Promotion Evidence

A component or pattern should not become `Active` until it has enough evidence
for other teams to trust it:

- Token alignment
- Approved PrimeNG usage or wrapper rationale
- Supported states and variants
- Storybook stories
- Accessibility checks
- Theme checks
- Direct subapplication validation
- Shell-mounted validation
- Playwright evidence where appropriate
- Zeroheight guidance
- Named owner
- Release notes or migration notes

## Decision Rules

Search before creating a new shared component. If PrimeNG directly satisfies the
need with the approved token preset, use PrimeNG directly.

Create a registry wrapper when the system needs to enforce behavior, defaults,
accessibility, telemetry, API consistency, or release control.

Create a composite component or pattern when multiple UI pieces form a repeated
workflow that teams should not rebuild independently.
