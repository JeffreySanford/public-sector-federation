# Design System Questions

These are targeted questions for Neil and Dan to resolve the token-consumption
and wrapper implementation path. The goal is not to reopen the architecture
choice. The federated Web Component runtime is assumed.

## Already Answered Guidance

These points are treated as settled guidance from Neil and should not be asked
again as open architecture questions:

- Federated Web Components are the required runtime architecture.
- The observed runtime uses remote modules registered as Web Components.
- The observed remotes mount in light DOM rather than Shadow DOM.
- The observed theme context uses `.p-dark` on `html`, allowing CSS variables
  from `:root` to cascade into remotes.
- The observed overlays append to `body`, where they can inherit root-level
  token context.
- Each observed remote bootstraps its own Angular app and therefore needs its
  own PrimeNG provider setup.
- PrimeNG is always wrapped because the component provider may be swapped later.
- The work is about how design tokens are consumed inside the existing runtime,
  not whether the runtime is the right choice.
- The useful deliverable is practical application: token mapping, wrapper
  consumption, runtime validation, and evidence.
- Token export and runtime information already exist in prior guidance; the
  remaining questions should target precise gaps after rereading those inputs.

## Decision Tracker

Use this section to track what is settled, what is partially answered, and what
still needs a decision before implementation.

- [x] Architecture choice: federated Web Components are required.
  Owner: Neil. Track: do not reopen.
- [x] PrimeNG wrapping policy: PrimeNG is always wrapped.
  Owner: Neil. Track: do not ask if direct PrimeNG usage is acceptable.
- [x] Runtime DOM model: remotes mount in light DOM.
  Owner: runtime evidence. Track: validate in source and tests.
- [x] Theme context: `.p-dark` is applied on `html`; `:root` variables cascade.
  Owner: runtime evidence. Track: add integration proof.
- [x] Overlay append target: overlays append to `body` and inherit root context.
  Owner: runtime evidence. Track: add one overlay proof if in scope.
- [x] Remote provider setup: each remote bootstraps independently and needs
  approved PrimeNG setup.
  Owner: runtime evidence. Track: confirm shared bootstrap helper if one exists.
- [ ] Wrapper API shape: strict, thin, or tiered wrapper API is not decided.
  Owner: Neil. Track: blocks wrapper implementation.
- [ ] First wrapper proof set: Button only, Button plus overlay, or broader set
  is not decided.
  Owner: Neil. Track: blocks proof scope.
- [ ] Token normalization: `danger -> error`, deprecated typography, and
  hard-coded corrections need approval.
  Owner: Neil or Dan. Track: blocks token pipeline sign-off.
- [ ] Preset value strategy: resolved values versus `var(...)` references needs
  confirmation.
  Owner: Dan. Track: affects theme mechanics and tests.
- [ ] Validation acceptance: minimum evidence package is not defined.
  Owner: Neil or Dan. Track: blocks review readiness.
- [ ] Canonical integration remote: runtime pattern is known, but target remote
  is not named.
  Owner: Dan. Track: blocks exact E2E target.

## Critical Path

### 1. Wrapper Rollout And API

Target: Neil

- Given Neil's guidance that PrimeNG is always wrapped, which wrappers should be
  implemented first for proof of direction?
  <br><span style="color: #0645ad"><strong>Answered guidance:</strong></span>
  PrimeNG should be wrapped. The remaining question is rollout order, not
  whether direct PrimeNG consumption is allowed.
- Should wrappers expose a thin pass-through API, an opinionated design-system
  API, or a mixed model depending on component complexity?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  Package metadata points toward stable APIs that hide PrimeNG, but it does not
  define whether wrappers should be thin, opinionated, or mixed.
- Should the registry completely hide PrimeNG types from application teams, or
  are some PrimeNG types acceptable in public wrapper APIs?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  Neil's provider-swap guidance implies PrimeNG should not leak through the
  public wrapper contract. The remaining question is how strict that rule should
  be for event payloads, option types, and edge-case component APIs.
- What is the expected first wrapper set for proof of direction: Button only,
  Button plus form controls, or Button plus one overlay component?
  <br><span style="color: #b00020"><strong>Not answered:</strong></span>
  The candidate repo does not define the first wrapper proof scope.

Why this matters: this determines the package structure, public API conventions,
test scope, Storybook scope, and how much PrimeNG remains visible to consumers.

### 2. Token Mapping And PrimeNG Preset Strategy

Target: Dan and Neil

- Should the PrimeNG preset emit resolved values, such as `#1c6fa3`, or CSS
  variable references, such as `var(--semantic-primary-background)`?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo appears to map from generated token artifacts into the
  PrimeNG preset. It still needs a precise confirmation of whether the preset
  emits resolved values or `var(...)` references.
- Should missing PrimeNG ramp steps, such as `50` and `950`, be aliases to the
  nearest available source token, generated values, or added back in Figma?
  <br><span style="color: #0645ad"><strong>Full candidate answer:</strong></span>
  The candidate repo documents aliasing missing ramp endpoints, such as
  `50 -> 100` and `950 -> 900`.
- Should source names such as `danger` normalize to `error`, should both coexist
  as supported semantic aliases, or should the source be corrected?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo normalizes `danger` to `error`, but it does not confirm
  whether that is the desired semantic model or only a compatibility shim.
- Which token tiers are public for application and wrapper use: primitive,
  semantic, component, or only semantic?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo emphasizes generated token artifacts and semantic mapping,
  but the public-use boundary between primitive, semantic, and component tokens
  still needs confirmation.

Why this matters: this determines whether wrappers can stay token-agnostic and
whether theme switching depends on generated preset output or live CSS variable
resolution.

### 3. Runtime Bootstrap And Provider Setup

Target: Dan

- Does each federated Web Component bootstrap its own Angular application and
  injector?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  Yes. The observed runtime indicates each remote Web Component bootstraps its
  own Angular application and therefore has its own injector boundary.
- Does each remote call `providePrimeNG()` itself, or does the platform runtime
  provide PrimeNG configuration?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  Each observed remote owns its Angular bootstrap, so each remote should register
  the approved `providePrimeNG()` preset in its own app setup unless a shared
  bootstrap helper centralizes that registration.
- Is there shared bootstrap code that remotes are expected to use?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The runtime pattern implies shared bootstrap guidance would be useful, but the
  candidate repo does not show whether a shared helper already exists.
- Do remotes render in light DOM, Shadow DOM, or a mix?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  The observed remotes render in light DOM, not Shadow DOM. That means root CSS
  variables cascade naturally into mounted remote content.

Why this matters: this determines whether the shell's provider setup reaches
remotes or whether every remote must register the approved PrimeNG preset itself.

### 4. Validation Acceptance

Target: Neil and Dan

- What minimum proof is useful before review: build/typecheck, unit tests,
  Storybook examples, Playwright shell mount, visual regression, or all of these?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo has buildable packages and a playground, but it does not
  define the accepted proof level for design-system review. Neil has said the
  priority is a deliverable that is understood and solid, not speed.
- Is there a canonical remote that should be used for integration testing?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The runtime screenshots identify the relevant remote pattern, but the team
  still needs to name which remote should become the canonical validation target.
- Should the first proof validate only a non-overlay component like Button, or
  should it include an overlay component like Dialog or Select?
  <br><span style="color: #b00020"><strong>Not answered:</strong></span>
  The candidate repo does not define whether overlay validation belongs in the
  first proof.
- What evidence should be captured for Zeroheight or design-system governance?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo has documentation and generated token references, but it
  does not define the evidence package expected for Zeroheight or governance.

Why this matters: this prevents overbuilding and defines what "done enough to
review" means.

## Architecture Validation

### 5. Token Source And Export

Target: Dan

- Are the current Figma DTCG exports the intended long-term source format?
  <br><span style="color: #0645ad"><strong>Full candidate answer:</strong></span>
  The candidate repo documents Figma DTCG exports as the current token source.
  The remaining confirmation is whether this is the long-term enterprise source
  format.
- Which exported files are authoritative when duplicate token paths exist?
  <br><span style="color: #0645ad"><strong>Full candidate answer:</strong></span>
  The candidate repo documents precedence rules, including newer mode files
  winning over older mode files.
- Are deprecated typography tokens intentionally still used, or should they be
  removed from the active token model?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo flags deprecated typography tokens, but it does not confirm
  whether they remain intentional active tokens.
- Should hard-coded compatibility corrections remain in the build, or should
  they be fixed at the token source?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The candidate repo documents compatibility corrections, but ownership is still
  unclear: build shim, source cleanup, or both.

Why this matters: this determines whether the current token export is adequate
or only temporarily usable.

### 6. Theming And Theme Context

Target: Dan

- Where is the active theme class or attribute applied: `html`, `body`, shell
  root, Web Component host, or another platform-owned element?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  The observed runtime applies `.p-dark` on `html`. That aligns with the PrimeNG
  `darkModeSelector: '.p-dark'` configuration and allows theme variables to
  cascade from `:root`.
- Can a remote run independently and still resolve the same token contract and
  theme?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The autonomous Web Component bootstrap supports remote independence, but each
  remote still needs the token CSS and PrimeNG preset registered in standalone
  development and test modes.
- How should theme changes propagate to already-mounted remotes?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  With light DOM remotes and `.p-dark` on `html`, theme changes should propagate
  through normal CSS cascade to already-mounted remote content.
- Is the theme context expected to be CSS-only, event-driven, attribute-driven,
  or a combination?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  Runtime theming appears to be CSS-class-driven for token and PrimeNG styling.
  Events may still be useful for non-CSS behavior, but token inheritance does
  not require event propagation in the observed light DOM model.

Why this matters: this determines how token inheritance and theme switching are
validated across the shell and remotes.

### 7. Overlay Behavior

Target: Dan

- Where do PrimeNG overlays append: `body`, a shell overlay root, a remote host,
  or a configurable overlay container?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  The observed overlays append to `body`.
- Do overlays inherit token and theme context from the component that opened
  them?
  <br><span style="color: #0645ad"><strong>Answered by runtime evidence:</strong></span>
  Because overlays append to `body` and token context is rooted at `:root` with
  `.p-dark` on `html`, overlays should inherit the same token and theme context.
  This should still be covered by an integration test.
- Are overlays part of the first validation target or a second validation pass?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  Runtime behavior is now clear enough to include one overlay component in
  validation if time allows. The remaining decision is whether Neil wants that
  in the first proof or a second pass.
- Are there existing platform rules for dialogs, menus, selects, tooltips, and
  popovers in federated remotes?
  <br><span style="color: #0645ad"><strong>Partial answer:</strong></span>
  The append target and inheritance model are clearer, but formal platform rules
  for each overlay type still need documentation.

Why this matters: overlays are the most likely place for token inheritance and
theme context to drift from the shell and remote content.

## Suggested Order

Ask in this order if time is limited:

1. Wrapper rollout and API.
2. Token normalization and source cleanup.
3. Validation acceptance.
4. Token mapping and PrimeNG preset value strategy.
5. Runtime bootstrap implementation details.
6. Overlay behavior validation scope.

## What These Answers Unlock

| Answer area | Unlocks |
| --- | --- |
| Wrapper rollout and API | Registry package design, wrapper conventions, public API rules. |
| Token mapping strategy | PrimeNG preset implementation and theme-switching model. |
| Runtime bootstrap | Shell and remote validation strategy. |
| Validation acceptance | Minimum proof before review. |
| Token source | Final export validation and cleanup plan. |
| Theming | CSS variable inheritance and theme propagation tests. |
| Overlays | Dialog/select/menu validation strategy. |
