# Component Estate Audit

_Last aligned: July 19, 2026_

## Mission

This audit records what is actually exported by `@public-sector/ui-patterns`, how each entry is implemented, what evidence exists, where contracts overlap, and what requires remediation or consolidation.

It complements the repository-presentation audit in [02 — Current-state audit](./02-current-state-audit.md). That document evaluates how the repository is presented; this document evaluates the component estate itself.

## Method

The initial inventory is generated from and checked against:

- Angular exports and selectors;
- the generated component manifest;
- Storybook source and canonical story identifiers;
- automated and interaction tests;
- Starlight and engineering documentation;
- provider-boundary metadata;
- accessibility and Figma status records.

`pnpm usage:build` now generates `artifacts/component-audit/component-usage-report.json`. It records distinct consuming files and selector/symbol references by application, library, Storybook, test, documentation, and tooling scope. Application and library scopes form the runtime-adoption count; evidence scopes remain separate so stories and documentation cannot inflate production use.

A component being exported or marked active does not by itself prove broad adoption, complete accessibility review, or design approval.

## Inventory summary

The current public surface contains 18 entries:

| Provider classification | Count |
| --- | ---: |
| PrimeNG-backed | 7 |
| Native Angular/CSS | 6 |
| Composite pattern | 4 |
| Service | 1 |

Lifecycle status currently records 17 active entries and one candidate entry. This describes export status, not full governance readiness.

## Flagship audit

| Component | Provider | Current evidence | Principal finding | Preliminary disposition |
| --- | --- | --- | --- | --- |
| `ps-button` | PrimeNG | Canonical Storybook and Starlight guidance; partial behavior and keyboard evidence | Preferred semantic API coexists with compatibility inputs, a style escape hatch, PrimeIcons strings, navigation behavior, and a DOM-event output | Retain as the temporary canonical implementation; migrate the stronger candidate contract into it |
| `ps-button-candidate` | PrimeNG | Candidate stories, tests, documentation, and automated accessibility evidence | Represents the cleaner API direction but duplicates the stable Button contract | Merge decisions into `ps-button`; do not promote a second permanent Button |
| `ps-select` | PrimeNG | Complete declared Storybook, test, keyboard, documentation, overlay, responsive, and automated evidence | Strong provider façade; invalid, required, help-text, disabled-option ARIA, and manual AT evidence remain incomplete | Retain and remediate |
| `ps-dialog` | Native | Complete declared Storybook, keyboard, focus, responsive, documentation, and automated evidence | Focus behavior is substantially remediated; background inertness, body scroll lock, description support, stacked dialogs, and manual AT review remain open | Retain and remediate; evaluate Angular CDK primitives before expanding scope |

## Duplication and inconsistency clusters

### Button contract cluster

The stable and candidate Button implementations express two API generations.

Observed stable compatibility surface:

- `tone`;
- `styleClass`;
- `outlined`;
- `text`;
- `routerLink`;
- `buttonClick: MouseEvent`;
- PrimeIcons class strings.

Preferred direction:

- `intent: primary | secondary | destructive`;
- `appearance: solid | outlined | text`;
- provider-neutral `activated: void`;
- governed icon identifiers;
- navigation represented by a Link contract.

The duplication should end through contract migration, not by retaining two canonical Buttons.

### Selector naming cluster

The public package mixes `ps-*` and `public-*` selectors. The inconsistency is a valid forensic finding and requires a staged compatibility plan rather than an untracked mass rename.

### Token-boundary cluster

Several native components and stories consume PrimeNG `--p-*` variables directly. This makes nominally native components visually dependent on the provider theme. Public `--ps-*` semantic and component tokens should become the native component contract, with PrimeNG mappings kept private.

### Machine-readable findings

The operational manifest now owns typed API, token, and accessibility findings. Each finding records:

- stable identifier;
- category;
- severity;
- status;
- affected component identifiers;
- summary;
- evidence paths.

Affected manifest entries link back through `audit.findingIds`. Validation fails for unknown identifiers, missing evidence, unknown components, or one-way relationships.

### Evidence-coverage cluster

The manifest records complete Storybook entries for the exported component catalog, but behavior tests, public API extraction, token references, manual screen-reader reviews, and public documentation remain uneven. Missing evidence must remain visible rather than being inferred from shared integration tests.

## Accessibility evidence summary

Button, Select, and Dialog have written accessibility expectations and automated evidence. Select and Dialog have dedicated keyboard coverage for their declared scope. Button keyboard evidence remains incomplete in the stable manifest entry. Manual screen-reader review remains pending for all three flagship components.

Actual defects and verification tasks are tracked in [19 — Accessibility findings and remediation](./19-accessibility-findings-and-remediation.md).

## Required follow-up discovery

- [x] Generate usage counts and consuming file locations for every public entry.
- [x] Report direct application PrimeNG imports separately from component consumption.
- [ ] Complete API extraction for partial entries.
- [ ] Populate semantic and provider-bridge token references.
- [x] Assign every component to a duplication cluster or explicitly mark it unique.
- [x] Record a preliminary canonical, retain, merge, or investigate disposition for every public entry.
- [x] Link open accessibility findings by identifier.
- [ ] Record manual review environments and results for flagship components.
- [ ] Validate which components designers should rebuild first in Figma.

## Audit completion criteria

The audit is complete for the declared repository scope when:

- every exported component has a verified identity and source;
- usage evidence distinguishes shipped adoption from package availability;
- duplicated and meaningfully different contracts are separated;
- API patterns and provider leakage are recorded consistently;
- accessibility findings are severity-ranked and linked to evidence;
- every entry has a canonical, retain, merge, replace, deprecate, or investigate disposition;
- the consolidation proposal and Figma reference set are traceable to these findings.
