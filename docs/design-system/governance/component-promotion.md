# Component Promotion

The promotion model keeps shared UI from becoming an uncontrolled fork of
PrimeNG or a collection of undocumented one-off wrappers.

Promotion begins after intake and triage. A useful UI element does not become a
shared component just because it exists in one application; it needs evidence
that the capability is reusable, owned, documented, and safe for other teams to
adopt.

## Lifecycle

| Status | Meaning |
| --- | --- |
| Idea | Identified need that has not been accepted for discovery. |
| Proposed | Accepted for discovery and triage, but not yet implemented. |
| Experimental | Implementation under development; API and guidance may change. |
| Candidate | Evidence complete enough for promotion review. |
| Active | Approved, versioned, tested, documented, and supported. |
| Deprecated | Still available temporarily with migration guidance. |
| Retired | No longer supported or distributed. |

Technical qualifiers such as `Storybook verified`, `shell verified`, or
`Accessibility risk` can be tracked separately from lifecycle status.

## Promotion Evidence

A component or pattern should not become `Active` until it has enough evidence
for other teams to trust it:

- Token alignment
- Approved wrapper usage and PrimeNG provider compatibility
- Supported states and variants
- Storybook stories
- Accessibility checks
- Theme checks
- Direct subapplication validation
- Shell-mounted validation
- Playwright evidence where appropriate
- Starlight guidance
- Named owner
- Release notes or migration notes

PrimeNG preset and theme changes should follow the same evidence model because
they affect every wrapper, direct legacy PrimeNG usage, overlays, and
shell-mounted remotes.

## Decision Rules

Search before creating a new shared component. PrimeNG should remain behind a
registry wrapper so the component provider can be swapped later. A wrapper may
be thin when PrimeNG already satisfies the need with the approved token preset,
but application teams should still consume the registry API.

Use a stricter registry wrapper when the system needs to enforce behavior,
defaults, Accessibility, telemetry, API consistency, or release control.

Create a composite component or pattern when multiple UI pieces form a repeated
workflow that teams should not rebuild independently.
