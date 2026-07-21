# Component Manifest Prototype

## Purpose

This prototype introduces a machine-readable registry for the public
`@public-sector/ui-patterns` surface. It turns information that was previously
spread across source files, Storybook stories, tests, architecture notes, and
Starlight drafts into one reviewable contract.

The manifest is not a replacement for component source, Storybook, tests, Figma,
or Starlight. It is the spine that identifies those surfaces and records their
current relationship.

```text
component source + governed metadata
                |
                v
       component manifest
                |
        +-------+-------+
        |               |
        v               v
 Storybook registry   CI validation
        |
        v
 future Starlight and Figma projections
```

## Prototype boundaries

This work records the current repository. It does not change existing selectors,
public component APIs, provider implementations, token architecture, or lifecycle
decisions.

The prototype deliberately does not:

- invent Figma component or component-set keys;
- claim that a pending design binding is complete;
- publish or update Starlight pages;
- treat automated accessibility checks as WCAG conformance;
- promote the Button candidate;
- remove existing PrimeNG escape hatches;
- replace current wrappers with different implementations.

## Source files

The primary authored sources are:

- `packages/ui-patterns/src/manifest/component-meta.types.ts`
- `packages/ui-patterns/src/manifest/component-registry.ts`

The registry is exported through `@public-sector/ui-patterns` so Storybook and
future tools consume the same data rather than duplicating status fields.

Run the following command to produce a portable JSON projection:

```bash
pnpm manifest:build
```

The generated artifact is written to:

```text
packages/ui-patterns/generated/component-manifest.json
```

The JSON artifact is generated output and should never be hand-edited. Change the
registry source and regenerate it.

## What is recorded

Each registry entry includes:

- stable identity, export name, selector, and source path;
- component, pattern, or service classification;
- lifecycle status and production-use intent;
- ownership and stewardship placeholders;
- current public API inventory status;
- provider classification and known escape hatches;
- variants that have been explicitly recorded;
- token evidence status;
- automated, keyboard, and manual accessibility evidence;
- Storybook, test, and documentation paths;
- Figma binding status;
- design review and promotion requirements;
- computed blockers and advisory warnings.

Unknown information remains explicitly unknown. For example, components use
`figma.status: pending-access` until an actual Enterprise binding can be verified.

## Derived facts and declared decisions

The long-term architecture separates two categories.

### Derived facts

These can be extracted or validated from code:

- barrel exports;
- source paths;
- component selectors;
- PrimeNG imports;
- Angular inputs, outputs, and models;
- Storybook and test file existence.

The first prototype validates the public export inventory, selectors, source
classes, provider imports, and evidence paths. Public API extraction is complete
for selected reference components and remains visibly partial elsewhere.

### Declared decisions

These require accountable human judgment:

- lifecycle status;
- production readiness;
- owner and steward;
- approved variants and supported combinations;
- provider escape-hatch acceptance;
- accessibility audit verdicts;
- Figma property mappings;
- design approval;
- promotion and deprecation decisions.

Automation may draft changes to these fields, but humans approve them through the
normal reviewed-revision workflow.

## Validation

Run:

```bash
pnpm manifest:check
```

The validator checks that:

- every public component or service export has one manifest entry;
- every manifest entry still exists in the public package barrel;
- manifest ids and selectors are unique;
- source files and exported classes exist;
- selectors match component source;
- declared PrimeNG and native classifications are consistent with imports;
- Storybook, test, and documentation evidence paths exist.

The workspace lint runs this validator directly, without recursively invoking
`pnpm lint`.

Pending Figma access, ownership, and manual accessibility
audits are advisory states. They are intentionally visible but are not treated as
false build failures.

## Storybook as the operational view

The manifest powers the following Storybook projections:

- Registry Overview
- Manifest Health
- Lifecycle Status
- Provider Boundaries
- Accessibility Coverage
- Documentation Readiness
- Component Detail
- Button Candidate Promotion Readiness

Storybook is a view over the contract. It is not another place to manually maintain
status. A lifecycle or evidence change belongs in the registry and appears in every
projection automatically.

The dashboard is intentionally useful before Figma Enterprise access
exists. It exposes what is known, what is pending, and which decisions still require
human review.

## Updating a component entry

1. Update the relevant entry in
   `packages/ui-patterns/src/manifest/component-registry.ts`.
2. Keep unverified vendor fields `null`, `pending-access`, `planned`, or `draft`.
3. Add evidence paths only after the files exist.
4. Run `pnpm manifest:check`.
5. Run `pnpm manifest:build` when a JSON projection is needed.
6. Review the Storybook Registry stories.
7. Submit the change through the normal reviewed pull-request process.

This is the prototype update path. A later enterprise implementation may replace
the central file with colocated typed `.meta.ts` declarations and a governed editor,
but it should preserve the same reviewable contract.

## Adding a component or service

A new public entry is not complete until:

1. it is exported from `packages/ui-patterns/src/index.ts`;
2. it has exactly one registry entry;
3. its source path, export name, and selector validate;
4. its provider boundary is recorded honestly;
5. its lifecycle and production-use policy are explicit;
6. evidence status is recorded, including missing evidence;
7. Figma fields reflect the real integration state;
8. `pnpm manifest:check` passes.

## Lifecycle promotion

Promotion is evidence-backed and human-approved. The manifest can report readiness,
but it does not promote a component automatically.

For a candidate such as `ps-up-button`, promotion should include:

- approved public API;
- approved design and Figma property mapping;
- Storybook behavioral and visual evidence;
- automated accessibility evidence;
- recorded manual keyboard and screen-reader review;
- an explicit final promotion decision.

## Future enrichment

### Figma

Figma can later provide verified component keys, component-set keys, property
mappings, variables, and design revision provenance. Those values should enrich the
existing manifest fields rather than create a separate component inventory.

### Source extraction

A later iteration can expand TypeScript compiler-based extraction so every input,
output, model, public type, and provider module is derived from source. Until then,
`publicApi.status` makes incomplete extraction visible instead of implying false
completeness.

## Current limitations

- Metadata is centralized for the prototype rather than colocated per component.
- Public API extraction is complete only for selected reference components.
- Ownership is unassigned.
- Manual screen-reader audits are pending.
- Figma bindings require Enterprise access and real design assets.
- The dashboard reports readiness but does not edit the manifest.

These are visible design constraints, not hidden failures. The prototype exists to
make the update path and the machine-readable-spine idea concrete before the full
enterprise integrations are available.
