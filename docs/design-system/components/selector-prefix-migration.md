# Selector-Prefix Migration

## Decision

`ps-*` is the canonical selector family for public-sector design-system components. Existing
`public-*` selectors remain supported as compatibility aliases until the next major release.

| Canonical selector | Compatibility alias |
| --- | --- |
| `ps-empty-state` | `public-empty-state` |
| `ps-form-section` | `public-form-section` |
| `ps-page-header` | `public-page-header` |
| `ps-status-card` | `public-status-card` |

Component class and TypeScript export names do not change in this migration. The selector change
is independent from any future export-naming decision.

## Consumer guidance

1. Use only `ps-*` selectors in new application code, stories, tests, and documentation.
2. Replace legacy selectors without changing inputs, outputs, content, or component imports.
3. Treat `public-*` support as temporary compatibility, not an alternate naming convention.
4. Inventory remaining alias consumers before the next major release.
5. Publish removal notes and remove aliases only at the intentional major boundary.

## Evidence and enforcement

The component manifest records the canonical selector separately from compatibility aliases.
Component Inventory presents both values and the compatibility window. Manifest generation checks
that source selectors match this ordering, preventing an alias from silently becoming canonical.

`API-NAMING-001` remains implemented rather than resolved until repository usage evidence confirms
the aliases can be removed. This decision does not imply Figma approval or change the public token
contract.
