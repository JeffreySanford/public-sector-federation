# Design System TODO

## Purpose

Align the platform design-system documentation with Neil's actual ask: not why
federated Web Components are being used, but how tokens are mapped, delivered,
and consumed inside that required runtime, and how the component registry
consumes the same contract while always wrapping PrimeNG.

Companion docs:

- [Focus](./focus.md)
- [Token Consumption Strategy](./architecture/token-consumption-strategy.md)
- [Token Pipeline](./architecture/token-pipeline.md)
- [Component Registry](./architecture/component-registry.md)
- [Design Decisions For Neil](./architecture/up-design-system/design-decisions-for-neil.md)

## Narrative Neil Needs

Neil is asking for an applied delivery model inside fixed constraints.

Fixed constraints:

| Constraint | Meaning |
| --- | --- |
| Federated Web Components | Shell mounts each subapp as a Web Component. Do not re-litigate this. |
| `remoteEntry` | Comes from subapp configuration, not Zeroheight. |
| PrimeNG always wrapped | New and target-state work uses the registry surface so PrimeNG can be swapped later. |
| Zeroheight | Documents tokens, registry status, evidence, and guidance. It is not runtime delivery. |
| Token source | Figma is known input; use a Figma-backed DTCG-compatible JSON artifact. |

The five parts connect like this:

```text
Token source (Figma / DTCG-compatible JSON)
  -> build pipeline (normalize + generate)
  -> runtime contract (CSS vars, JSON, TS, PrimeNG preset)
      -> shell loads tokens, sets theme, mounts subapps
      -> component registry wraps PrimeNG and consumes same contract
      -> new subapps bootstrap independently and import registry wrappers
      -> migrated legacy subapps may keep tracked PrimeNG usage temporarily
```

The cleaned-up answer should be:

- Tokens are a versioned runtime contract.
- One package or enterprise artifact generates CSS variables, metadata,
  TypeScript helpers, and the PrimeNG preset from the same values.
- The shell loads tokens, sets the active theme on `html`, and mounts subapps.
- New subapps bootstrap independently, use registry wrappers, and resolve
  tokens through package import and inherited CSS variables.
- Migrated legacy subapps may keep existing PrimeNG usage temporarily while
  wrappers are added ad hoc.
- The registry maps design-system API to PrimeNG internals using the same token
  contract.
- Zeroheight documents the contract and links Storybook/Playwright evidence.

## DOM And Overlay Boundaries

Observed runtime uses light DOM. CSS variables and fonts cascade into mounted
remotes, but selector-based styles do not cross Web Component boundaries in the
same way. Variables are the delivery mechanism.

PrimeNG overlays append to `body`. Theme state and token variables must live on
`html` or `:root` so dialogs, menus, selects, popovers, and tooltips inherit the
active theme. One dialog test is not enough.

## Working Loop

```text
Change tokens or wrapper
  -> rebuild artifacts
  -> Storybook isolated proof
  -> shell-mounted route integration proof
  -> Playwright repeatable evidence
  -> Zeroheight export or documentation update
  -> short recommendation to Neil focused on HOW, not WHY
```

## Current State

Done in this learning repo:

- [x] Federated Web Component sample with shell and remotes.
- [x] Token package shape in `packages/tokens` with CSS, JSON, TypeScript, and
      Zeroheight-oriented exports.
- [x] PrimeNG preset from the same token source in `packages/primeng-preset`.
- [x] Strict registry wrappers in `packages/ui-patterns`.
- [x] Direct PrimeNG app/remotes conversion completed for the current sample.
- [x] PrimeNG boundary enforcement in `scripts/check-primeng-boundaries.mjs`.
- [x] Legacy PrimeNG boundary allowlist shape added in
      `scripts/primeng-boundary-allowlist.json`.
- [x] Shell Playwright proof for token/theme behavior and dialog overlay.
- [x] QA Storybook e2e proof for wrapper stories and accessibility.
- [x] Zeroheight governance notes updated in
      [Zeroheight](./tooling/zeroheight.md).
- [x] Notes shifted from architecture justification toward applied token and
      wrapper delivery.

Still open from Neil's explicit asks:

- [ ] Explain how token mapping works:
      source -> semantic -> CSS variable -> PrimeNG preset.
- [ ] Explain how the component registry consumes the contract, not only that it
      wraps PrimeNG.
- [ ] Confirm whether the Figma/DTCG-compatible enterprise token export is
      adequate.
- [x] Compare token delivery methods and state one recommendation.
- [x] Write a short manual recommendation for Neil that applies the research.

## Phase 1: Lock The Recommendation

Neil needs a short, applied answer before more implementation scope expands.

### 1.1 Token Mapping HOW

- [x] Create `docs/design-system/architecture/token-mapping-spec.md`.
- [x] Include the authoritative input format from Figma/DTCG-compatible JSON.
- [x] Include a normalization rules table such as `danger` to `error`,
      typography aliases, and ramp aliases. Mark each rule as approved or
      proposed.
- [x] Define the tier model:
      primitive -> semantic -> component -> PrimeNG preset key.
- [x] Include one worked example from source token through CSS variable, preset,
      and wrapper usage.
- [x] Define precedence rules when multiple source files overlap.
- [x] Update `packages/tokens/src/build-tokens.mjs` so implementation and docs
      share the same rules.
- [x] Add unit coverage for each normalization rule in token build tests.

Review table Neil should be able to approve or reject:

| Review question | Evidence needed |
| --- | --- |
| What is the source token? | Figma/DTCG path or current fallback file path. |
| What semantic token does it become? | `--ps-*` token name and value/reference. |
| Is any normalization applied? | Explicit rule from `mapping-rules.json`, marked approved or proposed. |
| What component intent consumes it? | Registry-owned component token or wrapper input/state. |
| What PrimeNG key receives it? | PrimeNG preset key and/or generated `--p-*` bridge. |
| How is it proven? | Build output, unit test, Storybook story, or shell e2e evidence. |

Verification steps:

- [x] Run `pnpm build:tokens` and confirm it validates the Figma/DTCG sample
      input.
- [x] Run `pnpm --dir packages/tokens test` and confirm mapping rules are
      covered by token build tests.
- [x] Run `pnpm lint` and confirm workspace docs plus PrimeNG wrapper
      boundaries pass.
- [x] Add the approval table to
      `docs/design-system/architecture/token-mapping-spec.md`.
- [x] Fill the table with one simple example and two complex examples:
      primary action color, surface/card background with typography, and
      danger/error status.

Value:

This gives you a concrete plan to submit instead of an abstract architecture
summary. The table shows how a source token becomes a semantic token, a runtime
CSS variable, a PrimeNG bridge, and a wrapper behavior. That makes the proposal
reviewable without asking Neil to reconstruct the mapping from prose.

Done when you can submit the plan with clear decision points: which mappings
are proposed, which parts are already proven in this repo, and which parts need
confirmation from the real enterprise Figma/DTCG export.

### 1.2 Registry Contract Consumption HOW

- [x] Create `docs/design-system/architecture/registry-consumption-spec.md`.
- [x] Include the import boundary:
      apps -> `ui-patterns` -> `primeng-preset` plus `tokens`.
- [x] Document wrapper anatomy:
      public inputs/events/types versus PrimeNG-internal implementation.
- [x] Explain how each wrapper resolves tokens through CSS variables, the
      PrimeNG preset, or both.
- [x] Walk through `PublicButtonComponent` or `ps-button` end-to-end.
- [x] Extend the registry manifest example in
      [Component Registry](./architecture/component-registry.md), or add a
      package manifest if useful.
- [x] Link wrapper promotion status to experimental, active, and deprecated
      lifecycle states.

How a developer uses this:

1. Start with
   [Registry Consumption Spec](./architecture/registry-consumption-spec.md)
   before adding or consuming a UI component.
2. In an app or remote, import from `@public-sector/ui-patterns` only. Do not
   import `primeng/*`, render `<p-*>`, use PrimeNG directives, or style `.p-*`
   internals from app code.
3. Check [Component Catalog](./components/catalog.md) first, then
   `packages/ui-patterns/src/index.ts` and `apps/qa-remote/src/stories`, to see
   which wrappers are already exported and demonstrated.
4. If a wrapper already exists, use its public selector, inputs, outputs, and
   public types. Treat PrimeNG inputs, severities, events, and CSS class names
   as implementation details.
5. If a wrapper does not exist, add it inside `packages/ui-patterns`, import the
   needed PrimeNG module there, and expose a design-system API that can survive
   a future provider swap.
6. If the need is simple markup or layout, use native Angular/HTML with token
   variables instead of creating a PrimeNG dependency.
7. If the API shape is uncertain, keep the wrapper experimental and local until
   Storybook or shell-mounted evidence exists.
8. Resolve visual behavior through the shared token contract:
   use `--ps-*` semantic variables for registry-owned markup and use the
   PrimeNG preset or `--p-*` bridge variables when PrimeNG owns the internal
   component structure.
9. Add or update Storybook/shell evidence for the wrapper, then run the proof
   commands in the verification steps.
10. Record the wrapper lifecycle status and evidence using the registry entry
   shape from the spec. For now this is documentation; a real metadata file can
   be added after the storage format is selected.

Review table:

| Review question | Evidence needed |
| --- | --- |
| Where may apps import from? | Import boundary table and PrimeNG boundary lint. |
| What is public wrapper API? | Inputs, outputs, public types, and selector. |
| What stays provider-internal? | PrimeNG modules, severity mapping, and `--p-*` bridge. |
| How does the wrapper resolve tokens? | CSS variable path and/or PrimeNG preset path. |
| How is one wrapper implemented end to end? | `PublicButtonComponent` walk-through. |
| How does adoption status work? | Experimental, candidate, active, deprecated lifecycle. |

Verification steps:

- [x] Run `pnpm lint` and confirm PrimeNG wrapper boundaries pass.
- [x] Run `pnpm --dir packages/ui-patterns typecheck` and confirm wrapper APIs
      compile.
- [x] Confirm the button wrapper is represented in Storybook or a shell-mounted
      route. Evidence:
      `apps/qa-remote/src/stories/button-tag.acceptance.stories.ts` and
      `apps/shell/src/shell/shell.component.html`.
- [x] Add registry entry metadata when the final storage format is selected.
      For this planning pass, the registry entry shape is documented in
      `docs/design-system/architecture/registry-consumption-spec.md`; a real
      metadata file can be added after the storage format is selected.

Value:

This gives you a concrete plan for explaining how the registry consumes the
contract. Apps use governed wrappers; wrappers own the PrimeNG mapping; the
PrimeNG preset consumes the same token package; and lint verifies that apps do
not bypass the registry.

Done when you can submit the wrapper consumption model with the import
boundary, one end-to-end wrapper example, lifecycle statuses, and proof commands
that show apps can use registry components without importing PrimeNG.

### 1.3 Token Delivery Decision

- [x] Create `docs/design-system/architecture/token-delivery-decision.md`.
- [x] Compare these delivery methods in a one-page decision matrix:
      shell-only global CSS, remote token package import, federation shared
      singleton, and shell runtime theme context.
- [x] Recommend:
      shared versioned package, shell establishes theme context, remotes may
      import directly for isolated dev and Storybook.
- [x] List what must stay aligned:
      token package version, preset version, registry version, and theme class.

Value:

This gives you a defensible token delivery decision instead of a survey of
options. The recommendation is the combined model: shared versioned token
package, shell-owned theme context, remote imports for isolated operation, and
federation sharing for version alignment.

Done when [Token Delivery Decision](./architecture/token-delivery-decision.md)
can be linked from the Neil recommendation as the delivery model.

### 1.4 Recommendation For Neil

- [x] Create `docs/design-system/architecture/recommendation-for-neil.md`.
- [x] Keep it to two to four pages.
- [x] Include token mapping HOW with a link to the mapping spec.
- [x] Include registry consumption HOW with a link to the registry spec.
- [x] Include the token delivery model recommendation.
- [x] Include DOM and overlay caveats:
      light DOM, CSS variables, `body` overlays, and theme-on-`html`.
- [x] State what the sample repo proves versus what still needs enterprise repo
      validation.
- [x] Remove "why federated Web Components" framing.
- [x] Read and edit manually before sharing. The output should sound like a
      practical recommendation, not an AI research dump.

Value:

This is the only document to send Neil. It summarizes the locked working
decisions and links to the supporting specs for token mapping, registry
consumption, token delivery, and component discovery.

## Phase 2: Prove It In Code

### 2.1 Wrapper And Legacy Migration Pattern

- [x] Convert current direct PrimeNG app/remotes usage to registry wrappers.
- [x] Add lint boundary checks for direct `primeng/*`, `<p-*>`, PrimeNG
      directives, `MessageService`, and app-level `.p-*` styling.
- [x] Decide final wrapper API shape:
      strict for new subapps, with ad hoc wrapper adoption for migrated legacy subapps.
- [x] Document the chosen API and migration compatibility model in
      `registry-consumption-spec.md`.
- [x] Confirm no Cursor or local agent rules still recommend direct `p-*`
      smoke-test usage in apps/remotes.
      Proof: `.cursor/rules/primeng-federation.mdc` now requires wrapper demos
      and tests for new PrimeNG-backed work, and the repo has no other local
      agent rule directory.
- [ ] In the enterprise repo, populate `scripts/primeng-boundary-allowlist.json`
      only for migrated legacy paths that need temporary direct PrimeNG
      compatibility.

### 2.2 Token Pipeline Hardening

- [ ] Ingest the real enterprise Figma/DTCG-compatible token export into
      `packages/tokens/src`.
- [ ] Validate export format adequacy and answer yes/no for Neil with specifics.
- [ ] Ensure `pnpm build:tokens` output matches enterprise naming where needed.
- [x] Verify the PrimeNG preset uses the same resolved values as `tokens.css`.
- [x] Add version or changelog notes for federation alignment.

Current hardening status:

- [x] Document ingestion path, adequacy criteria, naming alignment, preset
      parity, and version alignment in
      [Token Pipeline Hardening](./architecture/token-pipeline-hardening.md).
- [x] Add automated token test coverage that resolves key `--p-*` bridge values
      back to their `--ps-*` source values.

Blocked until the real enterprise export is available:

- Ingest the real export.
- Give a final yes/no adequacy answer.
- Confirm whether output names must change to match enterprise naming.

### 2.3 Overlay And DOM Validation

- [x] Dialog overlay inherits root tokens in current shell e2e proof.
- [x] Add Playwright coverage for menu.
- [x] Add Playwright coverage for select.
- [x] Add Playwright coverage for popover.
- [x] Add Playwright coverage for tooltip.
- [x] Add theme-toggle proof across shell and mounted remote for each overlay
      family.
- [x] Document failure modes when overlay append targets are misconfigured.

Evidence:

- [Overlay DOM Validation](./architecture/overlay-dom-validation.md)
- `apps/shell/e2e/token-consumption.spec.ts`
- `apps/qa-remote/src/remote/qa-remote.component.html`

### 2.4 Shell And Subapp Integration

Current sample shape:

- Shell-composed remotes: services, reporting, admin, and QA.
- Non-remotes: shell, agile-api, and playground.
- Recommendation: do not add a synthetic legacy app yet. Prove the target-state
  path with the four current remotes, and use the PrimeNG boundary allowlist for
  real migrated legacy paths when the enterprise repo has one to validate.

- [x] Trace and document the sample `remoteEntry` configuration path.
- [x] Confirm shell token CSS load path and mirror it in the docs.
- [x] Confirm each remote bootstrap registers the approved PrimeNG provider or
      consumes a proven shared bootstrap helper.
- [x] Add federation version-alignment checks to
      [Repository Review Checklist](./validation/repository-review-checklist.md).

Evidence:

- [Shell And Subapp Integration](./architecture/shell-subapp-integration.md)
- [Repository Review Checklist](./validation/repository-review-checklist.md)

## Phase 3: Governance, Docs, And Enterprise Handoff

### 3.1 Zeroheight

- [x] Create
      [Zeroheight Governance Model](./governance/zeroheight-governance-model.md)
      as the focused governance-through-Zeroheight proposal.
- [x] Document that Zeroheight is guidance and governance only.
- [x] Document current procurement status:
      approved in principle, pending registry/compliance/final acquisition.
- [x] Document that Zeroheight is not a token creation source.
- [x] Document that Figma -> Zeroheight -> token input is not assumed unless
      that workflow is explicitly established later.
- [ ] Confirm generated Zeroheight token artifacts come from the repo token
      build, not manual values.
- [ ] Document manual upload versus publish bridge workflow.
- [ ] Link Storybook, Playwright, source, and token artifacts as evidence per
      component or token page.
- [ ] Keep Zeroheight pages as linked guidance areas, not runtime configuration.

### 3.2 Governance Flow Map

- [x] Create `docs/design-system/governance/flow-map.md`.
- [x] Show what flows from Figma and DTCG-compatible JSON into the token repo.
- [x] Show what flows from tokens to preset, registry, shell, and subapps.
- [x] Show what flows into Zeroheight and what does not.
- [x] Show what flows into Storybook, Playwright, and promotion lifecycle.
- [x] Identify owners for design, platform, registry, and subapp boundaries.

Evidence:

- [Governance Flow Map](./governance/flow-map.md)

Follow-up for enterprise validation:

- Replace role owners with named accountable owners or team aliases.

### 3.3 Governance Overview Final Shape

- [ ] Keep [Governance Overview](./governance/overview.md) as the full concept
      document for now while the governance model is being reviewed.
- [ ] After supporting docs are accepted, shorten the overview to summarize:
      contribution proposal, InnerSource model, evidence gates, Zeroheight
      role, lifecycle, ownership, and exceptions.
- [ ] Move detailed change classification, metrics, and operating cadence into
      dedicated supporting documents or an operating-model appendix.
- [ ] Keep the overview focused on Neil's immediate governance-through-
      Zeroheight question and link to supporting detail instead of repeating it.
- [x] Create
      [Adoption And Team Buy-In](./governance/adoption-and-team-buy-in.md)
      for participation, support, and adoption measures.
- [x] Create [Rollout Implementation](./governance/rollout-implementation.md)
      for gradual rollout, pilots, and risk-based approval.

### 3.4 Enterprise Repo Validation

Status: pending until enterprise machine access is available next Tuesday. Do
not mark these complete from the learning repo alone.

Work through [Repository Review Checklist](./validation/repository-review-checklist.md):

- [ ] Confirm shell token CSS load path in production.
- [ ] Confirm remote token strategy:
      direct import, inheritance, or both.
- [ ] Confirm theme propagation contract.
- [ ] Confirm per-remote PrimeNG provider setup.
- [ ] Confirm token package version alignment across shell/remotes.
- [ ] Confirm Zeroheight ingestion path for generated artifacts.
- [ ] Reconcile sanitized `up-design-system` notes as outdated reference
      material against real screenshots, names, and package paths.

Prep:

- [x] Create
      [Enterprise Validation Status](./validation/enterprise-validation-status.md)
      to separate sample evidence from production evidence still needed.

## Diagrams

- [ ] Rework diagrams in a separate task.

Known diagram updates needed:

- Token delivery should show the mapping steps, not only tool responsibilities.
- Component registry should show app/remotes consuming wrappers, wrappers
  consuming the token contract, and PrimeNG remaining internal.
- Runtime diagram should show independently bootstrapped remotes, shared token
  CSS, approved PrimeNG provider setup, and overlays appended to `body`.
- Zeroheight should be shown as documentation and governance only, not runtime
  delivery.

## Decisions To Track

Track answers in
[Design Decisions For Neil](./architecture/up-design-system/design-decisions-for-neil.md).

| Decision | Recommendation |
| --- | --- |
| Wrapper API shape | Strict for new subapps; legacy migration can be ad hoc. |
| PrimeNG type leakage | Never in app/remotes public API. |
| First proof set | Button plus overlays, then broader wrapper families. |
| `danger` versus `error` | Ask Neil whether normalization is approved. |
| Preset values | Document resolved values versus `var(...)`; match runtime CSS. |
| Validation bar | Lint, unit where useful, Storybook, shell e2e, and accessibility. |

## Decisions Already Captured

- PrimeNG is always wrapped for new and target-state work. Apps and remotes in
  that lane should not import `primeng/*`, render `<p-*>` components directly,
  use PrimeNG template directives directly, or style app-level `.p-*`
  selectors.
- Migrated legacy apps may continue existing direct PrimeNG usage temporarily
  when the path is allowlisted, owned, and tracked for ad hoc wrapper
  migration.
- Strict wrappers are preferred over thin PrimeNG pass-through wrappers because
  the component provider may be swapped later.
- PrimeNG remains allowed inside approved integration packages such as the UI
  wrapper package and PrimeNG preset package.
- Each independently bootstrapped remote needs the approved PrimeNG setup unless
  a shared bootstrap layer proves it supplies the provider.
- PrimeNG overlays append to `body`; token context and theme switching must be
  validated there.
- Zeroheight is guidance, governance, status, and evidence. It is not the source
  of runtime tokens, `remoteEntry` URLs, shell mounting, or implementation.
- Zeroheight procurement was reported as approved in principle, but registry,
  compliance, and final acquisition steps still gate operational publishing.
- `up-design-system` is outdated and should not be treated as the active token
  source. Use it only as historical reference material.
- Figma is the known design input. The expected token input is a Figma-backed
  DTCG-compatible JSON artifact.
- Zeroheight is documentation output and governance. It is not a token creation
  source, and it is not currently part of a Figma -> Zeroheight -> token input
  workflow.
- Deprecated token references found in old bootstrap artifacts should not be
  treated as active token guidance without confirming they come from the current
  token source.
- The preferred real design-system prefix is `cmds`; `fm` was incidental. The
  sanitized sample repo uses `ps`.
- Desktop Underwriter and pricing architecture review should affect the design
  system only if it introduces new UI-facing states, workflows, components, or
  governance requirements.

## What Not To Do

- Do not write more "why federated Web Components" content.
- Do not treat Zeroheight as runtime delivery.
- Do not put `remoteEntry` URLs in Zeroheight.
- Do not import PrimeNG directly in apps/remotes.
- Do not treat `up-design-system` as current source of truth unless Neil or the
  team explicitly confirms it is current again.
- Do not send Neil large AI-generated drafts. Send applied HOW specs and short
  recommendations.
- Do not wait until the ask is unclear. Restate the constraint and ask early.

## Quick Commands

```bash
pnpm build:tokens
pnpm lint
pnpm nx run-many -t typecheck
pnpm nx run-many -t test
pnpm nx run-many -t build
pnpm nx run-many -t e2e
pnpm zeroheight:export
pnpm report:all
node scripts/check-primeng-boundaries.mjs
```

## Success Criteria

Neil should be able to answer these from the docs without a meeting:

1. How are tokens mapped from source to CSS variables and PrimeNG preset?
2. How does the registry consume the token contract while wrapping PrimeNG?
3. How do tokens reach the shell and a mounted federated Web Component?
4. What happens at DOM and overlay boundaries, and how is it proven?
5. Is the enterprise token export adequate: yes or no, with specifics?

## Related Files

| File | Role |
| --- | --- |
| [Focus](./focus.md) | Active problem statement. |
| [Governance Overview](./governance/overview.md) | Governance entry point and document map. |
| [Token Consumption Strategy](./architecture/token-consumption-strategy.md) | Current token consumption recommendation. |
| [Token Pipeline](./architecture/token-pipeline.md) | Pipeline constraints and token artifacts. |
| [Component Registry](./architecture/component-registry.md) | Registry expectations. |
| [Contribution Process](./governance/contribution-process.md) | Intake, evidence, triage, validation, and promotion process. |
| [InnerSource Contribution Model](./governance/innersource-contribution-model.md) | Team contribution and maintainer governance. |
| [Adoption And Team Buy-In](./governance/adoption-and-team-buy-in.md) | Product-team participation, support, and buy-in measures. |
| [Rollout Implementation](./governance/rollout-implementation.md) | Gradual implementation sequence and risk-based approval. |
| [PrimeNG Binding Audit](./architecture/up-design-system/primeng-binding-audit.md) | PrimeNG preset and wrapper binding notes. |
| [Wrapper Pattern Validation](./architecture/up-design-system/wrapper-pattern-validation.md) | Wrapper model and validation guidance. |
| [Zeroheight](./tooling/zeroheight.md) | Zeroheight governance and evidence expectations. |
| `packages/tokens` | Token build and exports. |
| `packages/primeng-preset` | PrimeNG preset and provider. |
| `packages/ui-patterns` | Registry wrappers. |
| `apps/shell/e2e/token-consumption.spec.ts` | Runtime token proof. |
| `scripts/check-primeng-boundaries.mjs` | Wrap-only enforcement. |
