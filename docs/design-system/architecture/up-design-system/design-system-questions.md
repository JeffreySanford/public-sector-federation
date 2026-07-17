# Design-System Adoption Questions

## Purpose

These questions help an adopting organization apply the reference token, wrapper, and federation model. They do not reopen the sample architecture; they identify organization-specific choices that cannot be answered by a sanitized public repository.

## Settled reference guidance

The sample assumes:

- federated Web Components are the runtime composition model;
- remotes bootstrap independent Angular applications and injector boundaries;
- light DOM permits semantic CSS variables to cascade through mounted remotes;
- the integrated theme state is applied at the document level;
- PrimeNG overlays append to `body` and inherit root token context;
- each independently running remote registers the approved provider setup;
- new and target-state work consumes governed wrappers rather than PrimeNG directly;
- Zeroheight documents status and evidence but does not deliver runtime configuration.

## 1. Authoritative token source

- Which Figma or DTCG-compatible export is authoritative?
- How are duplicate paths and mode precedence resolved?
- Which primitive, semantic, and component tiers are public?
- Which source values are deprecated?
- Who approves normalization and compatibility aliases?

## 2. Wrapper contract

- Which components require strict provider-neutral APIs?
- Are any advanced provider configuration types permitted in public APIs?
- Which semantic markup should remain native rather than wrapped?
- What is the legacy migration allowlist and its expiration policy?
- What naming and event conventions must every wrapper follow?

## 3. Release and version alignment

- Which versions of tokens, preset, wrappers, Angular, and PrimeNG are supported together?
- How are incompatible changes announced and migrated?
- Are shell and remote package versions enforced during federation startup?
- What is the rollback strategy when a shared design package causes a remote regression?

## 4. Theme and runtime behavior

- Where is the active theme class or attribute owned?
- How do standalone remotes load the same token and provider contract?
- How are already-mounted remotes notified of non-CSS theme behavior?
- Which overlay append targets are permitted?
- What E2E evidence is required for every overlay family?

## 5. Component evidence

- Which lifecycle states are available: experimental, candidate, active, deprecated, or blocked?
- What evidence is mandatory for each component risk tier?
- When is shell integration required in addition to Storybook?
- Which keyboard and automated accessibility checks are required?
- Who performs and records manual screen-reader review?
- What is required before a candidate becomes production-approved?

## 6. Ownership and governance

- Who owns design tokens, the wrapper registry, platform runtime, and application adoption?
- Who may approve provider escape hatches?
- How are contribution requests triaged?
- How are exceptions recorded, reviewed, and retired?
- Which registry metadata is required before a component may be consumed?

## 7. Documentation and Zeroheight

- Which generated repository artifacts are published to Zeroheight?
- Is publication manual, automated, or approval-gated?
- How are Storybook, source, token, and Playwright evidence linked?
- Who owns page quality and stale-content review?
- How is guidance kept separate from runtime configuration?

## 8. Production validation

- Does the production shell load the same token CSS path as the sample?
- Do production remotes import tokens directly, inherit them, or use both methods?
- Is every remote using the approved provider bootstrap?
- Are package versions aligned across all deployable applications?
- Do overlays inherit the active theme in the deployed topology?
- Are monitoring, security, and rollback controls defined for shared UI releases?

## Recommended decision sequence

1. Approve the authoritative token source and normalization rules.
2. Approve the public wrapper API conventions.
3. Define package and theme version alignment.
4. Assign owners and evidence requirements.
5. Validate the production shell, remotes, and overlays.
6. Establish documentation and Zeroheight publication workflow.
7. Pilot with a small component set before expanding adoption.
