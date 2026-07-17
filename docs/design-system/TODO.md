# Design-System Release Status

## Purpose

This document separates what the public reference implementation proves from decisions that belong to an adopting production organization.

The reference architecture is complete for portfolio and technical-review purposes. Open items below are either optional evidence improvements or external adoption decisions; they are not hidden blockers to the sample repository.

## Runtime contract

```text
DTCG-compatible token source
  -> normalization and generation
  -> semantic CSS variables, JSON, and TypeScript
  -> PrimeNG preset and provider bridge
  -> governed component wrappers
  -> shell and independently bootstrapped remotes
  -> Storybook, Playwright, and documentation evidence
```

Zeroheight consumes generated documentation and evidence. It is not a runtime token source, remote-entry registry, or shell configuration mechanism.

## Complete in this repository

- [x] Angular shell with four federated custom-element remotes.
- [x] Independently bootstrapped remote applications.
- [x] Shared token package with CSS, JSON, TypeScript, and documentation exports.
- [x] PrimeNG preset derived from the shared token contract.
- [x] Governed UI wrapper package and generated component manifest.
- [x] Direct PrimeNG boundary enforcement outside approved integration packages.
- [x] Legacy allowlist format for tracked migration exceptions.
- [x] Light and dark theme propagation through shell and remotes.
- [x] Dialog, menu, select, popover, and tooltip overlay validation.
- [x] Storybook evidence for the current component catalog.
- [x] Candidate UP Button behavior, keyboard, theme, and automated accessibility evidence.
- [x] Shell-mounted integration and token-consumption tests.
- [x] Token mapping, delivery, registry-consumption, and governance documentation.
- [x] Zeroheight-oriented export and publish bridge scripts.
- [x] Repository release, smoke, report, and manifest-check commands.

## Reference component states

The registry intentionally demonstrates more than one lifecycle and evidence state.

| State | Meaning in this sample |
| --- | --- |
| `active` | Exported for current sample use. It may still have partial governance metadata. |
| `candidate` | Implementation and evidence exist, but promotion requirements remain visible. |
| `partial` | Some public API, token, documentation, test, or accessibility evidence is incomplete. |
| `blocked` | A declared requirement prevents promotion. |
| `deprecated` | Retained temporarily with a replacement path. |
| `ready` | Repository evidence is complete for the declared scope. |

These states are part of the governance demonstration. The sample does not claim that every active export has completed external design review, Figma binding, ownership assignment, or manual screen-reader review.

## Optional repository improvements

These would deepen the evidence but are not required for the `1.0.0` portfolio release:

- [ ] Add complete public API extraction for remaining partial components.
- [ ] Record dedicated behavior tests for components currently relying on shared integration evidence.
- [ ] Add manual screen-reader review records for promoted interactive components.
- [ ] Populate semantic and provider-bridge token references for every manifest entry.
- [ ] Add named sample owners and stewards if role-based governance needs a demonstration.
- [ ] Remove compatibility redirect files after all internal links use neutral paths.
- [ ] Pin the remaining package specifiers currently declared as `latest` together with a regenerated lockfile.

## Production adoption decisions

An adopting organization must validate or decide:

- authoritative Figma or DTCG-compatible token export;
- approved token naming and normalization rules;
- package names, release cadence, and supported version matrix;
- shell token-loading and remote standalone-import policy;
- accountable design, platform, registry, and application owners;
- temporary legacy PrimeNG allowlist entries and migration deadlines;
- design review and manual assistive-technology acceptance criteria;
- Zeroheight acquisition, publishing, page ownership, and evidence-linking process;
- production deployment, security, observability, and operational controls.

These are external implementation choices, not unfinished architectural work in this sample.

## Authoritative documents

- [Reference Architecture Recommendation](./architecture/reference-architecture-recommendation.md)
- [Token Mapping Spec](./architecture/token-mapping-spec.md)
- [Token Delivery Decision](./architecture/token-delivery-decision.md)
- [Registry Consumption Spec](./architecture/registry-consumption-spec.md)
- [Component Registry](./architecture/component-registry.md)
- [Component Catalog](./components/catalog.md)
- [Governance Overview](./governance/overview.md)
- [Testing Guide](../TESTING.md)

## Verification

```bash
pnpm build:tokens
pnpm lint
pnpm lint:links
pnpm typecheck
pnpm test
pnpm manifest:check
pnpm build
pnpm test:e2e
```

The complete command is:

```bash
pnpm verify:release
```
