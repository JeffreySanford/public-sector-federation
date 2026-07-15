# UP Design System Button Candidate Integration Plan

## Document status

- [x] Initial integration plan created.
- [x] Direction established: build a separate UP-styled Button candidate before changing the existing `ps-button`.
- [x] Existing `PublicButtonComponent` remains the current stable wrapper during candidate validation.
- [x] Candidate lifecycle status selected: **Candidate**.
- [x] Zeroheight documentation approach selected: curated guidance with links or embeds to Figma, Storybook, GitHub source, and test evidence.
- [x] Dedicated Storybook surface selected for the candidate Button.
- [x] Candidate is intended to appear in the QA remote for side-by-side and federated-runtime validation.
- [x] Isolated candidate Storybook Playwright coverage added at `apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts`.
- [x] Candidate-specific Storybook Playwright script added: `pnpm test:storybook:up-button:chromium`.
- [x] Static Storybook E2E run recorded: `pnpm nx run qa-remote:e2e` passed with 38 discovered stories and 3 rendered story iframes.
- [x] Isolated candidate Storybook Playwright run recorded: `pnpm test:storybook:up-button:chromium` passed 9 tests after adding current-versus-candidate comparison coverage.
- [ ] Confirm the local candidate implementation has been committed and pushed to the repository.
- [ ] Verify the UP Design System tokens required by `ps-up-button`, including Button color, typography, spacing, radius, size, state, focus, disabled, loading, and theme values. This requirement applies only to the Button candidate and does not imply migration of the entire public-sector design system.

## Purpose

This document is the build, validation, documentation, and promotion checklist for a Button candidate based on the UP Design System.

The candidate is intended to prove both sides of the design-system workflow:

1. **Developer experience**
   - discover the Button in Zeroheight;
   - inspect the design in Figma;
   - interact with the live Angular implementation in Storybook;
   - copy the governed `ps-*` wrapper API;
   - review source and tests in GitHub;
   - use the wrapper in an application or federated remote without importing PrimeNG directly.

2. **Visual styling system**
   - ingest or reproduce the approved UP Design System token information;
   - normalize tokens into primitive, semantic, component, and PrimeNG-provider tiers;
   - render the Button through the same token contract in Figma, Storybook, the QA remote, and the shell;
   - validate light, dark, theme, interaction, accessibility, and federation behavior;
   - promote the candidate only after the evidence is complete.

## Direction and non-goals

### Chosen direction

- [x] Create a separate UP Button candidate rather than silently rewriting the existing Button.
- [x] Keep PrimeNG internal to the wrapper package.
- [x] Expose design-system concepts from the public Angular API.
- [x] Use a dedicated Storybook story set for the candidate.
- [x] Include the candidate in the QA remote.
- [x] Use the QA remote to compare the existing and candidate Buttons.
- [x] Use Figma as design intent and token-input evidence.
- [x] Use Storybook as live component behavior and isolated validation evidence.
- [x] Use Zeroheight as the governed documentation and discovery surface.
- [x] Use GitHub as implementation, test, history, and release evidence.

### Non-goals for the candidate phase

- [x] Do not remove or break the existing `ps-button`.
- [x] Do not expose `primeng/button`, `ButtonModule`, PrimeNG severity types, or `.p-*` CSS selectors to application teams.
- [x] Do not make Zeroheight a runtime dependency.
- [x] Do not make Zeroheight the design-token source.
- [x] Do not claim that sanitized UP Design System notes are verified production values.
- [x] Do not globally change every existing PrimeNG Button before the candidate is approved.
- [x] Do not promote the component to Active solely because it compiles or visually resembles the design.

## Proposed architecture

```text
UP Design System Figma library or approved DTCG export
  -> source-token inventory
  -> normalization and mapping rules
  -> primitive tokens
  -> semantic tokens
  -> Button component-intent tokens
  -> PrimeNG preset and --p-button-* provider mapping
  -> ps-up-button Candidate wrapper
  -> Storybook stories and interaction/accessibility tests
  -> QA remote and shell integration tests
  -> Zeroheight curated guidance and evidence links
  -> approval decision
  -> optional promotion into the canonical ps-button implementation
```

## Source-of-truth boundaries

| System                   | Authoritative responsibility                                                                                              | Not authoritative for                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| UP Design System / Figma | Design intent, anatomy, variants, states, source token names, mode values, and approved visual decisions.                 | Angular implementation, CI status, runtime federation behavior.                        |
| Token package            | Versioned source inventory, normalization, generated CSS variables, JSON, TypeScript metadata, and provider mappings.     | Usage prose and component approval.                                                    |
| `ui-patterns`            | Public wrapper API, event normalization, provider isolation, component behavior, and exports.                             | Figma source values and Zeroheight page layout.                                        |
| Storybook                | Live isolated implementation, controls, examples, interaction evidence, accessibility evidence, and theme demonstrations. | Production runtime delivery and final governance approval.                             |
| QA remote / shell        | Runtime integration, token inheritance, theme propagation, Web Component behavior, and federation proof.                  | Token authorship and design approval.                                                  |
| GitHub and CI            | Source code, test execution, review history, releases, and deployable artifacts.                                          | Design intent and human governance decisions.                                          |
| Zeroheight               | Governed guidance, lifecycle status, ownership, usage rules, anti-patterns, migration guidance, and evidence links.       | Runtime token delivery, component compilation, shell routing, and automatic promotion. |

## Current implementation inventory

### Existing stable Button

- [x] Current wrapper source exists at `packages/ui-patterns/src/public-button.component.ts`.
- [x] Current selector is `ps-button`.
- [x] Current public inputs include `label`, `icon`, `tone`, `styleClass`, `outlined`, `text`, `disabled`, `loading`, and `routerLink`.
- [x] Current public output is `buttonClick`.
- [x] Current wrapper renders PrimeNG internally.
- [x] Existing consumers should continue to use the stable wrapper while the candidate is evaluated.

### Existing acceptance story

- [x] Existing combined Button and Tag acceptance story exists at `apps/qa-remote/src/stories/button-tag.acceptance.stories.ts`.
- [x] Existing acceptance coverage includes primary, outlined, text, disabled, and long-label examples.
- [x] Keep this story as regression coverage for the current wrapper.
- [ ] Do not use the combined Button/Tag story as the sole developer-documentation page for the candidate.

### Candidate implementation verified locally

The following items are verified in the local workspace. They still need to be committed, pushed, and validated from CI before they can be used as branch-level approval evidence.

- [x] Candidate wrapper created at `packages/ui-patterns/src/public-up-button.component.ts`.
- [x] Candidate selector is `ps-up-button`.
- [x] Candidate exported from `packages/ui-patterns/src/index.ts`.
- [x] Candidate Storybook file created at `apps/qa-remote/src/stories/up-button.stories.ts`.
- [x] Candidate included in the QA remote component.
- [x] Static Storybook validation script updated to reference the candidate primary story.
- [x] Isolated Storybook Playwright spec created at `apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts`.
- [x] Candidate test scripts added: `pnpm test:storybook:up-button` and `pnpm test:storybook:up-button:chromium`.
- [x] `ui-patterns` typecheck passed locally.
- [x] QA remote TypeScript test passed locally.
- [x] Storybook static build passed locally.
- [x] Static Storybook E2E passed locally: `pnpm nx run qa-remote:e2e` reported 38 stories and 3 rendered story iframes.
- [x] Broad Storybook Playwright Chromium suite passed locally after removing the intentional failing test: `pnpm test:storybook:qa:chromium` reported 28 passed tests.
- [x] Isolated candidate Storybook Playwright passed locally: `pnpm test:storybook:up-button:chromium` reported 9 passed tests after adding current-versus-candidate comparison coverage.
- [ ] Commit and push all candidate files.
- [ ] Verify these exact paths and APIs on the pushed branch.

## Candidate naming and promotion strategy

### Candidate phase

- [x] Use an obviously experimental selector such as `ps-up-button` while visual and API decisions are still under review.
- [x] Show lifecycle status as Candidate in Storybook and Zeroheight.
- [x] Keep the current `ps-button` as the stable comparison baseline.

### Promotion phase

Choose one promotion path after approval:

- [ ] **Preferred:** move the approved candidate internals, token mappings, and API decisions into the canonical `PublicButtonComponent` while preserving the stable `ps-button` selector.
- [ ] Alternatively, make `PublicButtonComponent` delegate internally to the approved candidate implementation.
- [ ] Avoid making application teams permanently choose between `ps-button` and `ps-up-button` unless governance intentionally defines two different component roles.
- [ ] Add migration notes for any current `ps-button` inputs that are removed or replaced.
- [ ] Add a deprecation window if `outlined` and `text` booleans are replaced by `appearance`.

## Recommended public wrapper API

The candidate public API should describe design-system intent and prevent invalid combinations.

### Appearance

- [x] Preferred API direction: one `appearance` input rather than independent `outlined` and `text` booleans.
- [x] Candidate currently implements:
  - [x] `solid`
  - [x] `outlined`
  - [x] `text`
- [ ] Confirm these values against the actual UP Design System source before promotion.
- [ ] Decide whether a link-like appearance is necessary or whether navigation remains a Button behavior through `routerLink`.
- [ ] Decide whether destructive styling is a tone or a separate intent.

### Tone

- [ ] Confirm the UP Design System tone vocabulary.
- [x] Candidate currently implements:
  - [x] `primary`
  - [x] `secondary`
  - [x] `success`
  - [x] `info`
  - [x] `warning`
  - [x] `error`
  - [x] `help`
  - [x] `contrast`
- [ ] Decide whether the final public tone set should include `neutral`, `danger`, or another UP-specific vocabulary instead of the current candidate labels.
- [ ] Keep provider terms such as PrimeNG `warn` and `danger` mapping internal.
- [ ] Decide whether public design-system terminology is `danger` or `error`.
- [ ] Document any normalization between the UP source terminology, public wrapper terminology, and PrimeNG terminology.

### Size

- [ ] Confirm UP Design System size names.
- [ ] Candidate values to evaluate:
  - [ ] `small`
  - [ ] `medium`
  - [ ] `large`
- [ ] Record height, padding, font size, icon size, and gap for every approved size.

### Content and icon API

- [x] `label` remains the visible text input.
- [x] Candidate currently supports an `icon` input for the leading icon path.
- [ ] Confirm whether the icon input format is provider-neutral enough for promotion.
- [x] Candidate currently supports leading icon behavior.
- [ ] Confirm trailing icon behavior.
- [ ] Confirm icon-only behavior.
- [ ] Require an accessible name for icon-only Buttons.
- [ ] Confirm full-width behavior.

### State and events

- [x] `disabled` is provider-neutral in the candidate API.
- [x] `loading` is provider-neutral in the candidate API.
- [x] `buttonClick` remains the normalized wrapper event.
- [x] Candidate Playwright coverage verifies that loading suppresses activation and exposes `aria-busy="true"`.
- [ ] Confirm whether disabled and loading are mutually exclusive or can coexist.
- [ ] Confirm router navigation behavior.
- [ ] Confirm native Button `type` support: `button`, `submit`, and `reset`.
- [ ] Confirm form integration requirements.

## UP Design System source information available in this repository

### Important qualification

The repository contains **sanitized UP Design System notes**. These notes are useful for modeling the workflow, but they are not proof that the actual enterprise UP Design System currently uses every value or file name shown below.

- [x] Treat the sanitized UP material as candidate/reference guidance.
- [ ] Obtain and review the actual enterprise UP Design System source before promotion.
- [ ] Record the source repository, package version, Figma library version, export date, and owning team in a private or approved location.
- [ ] Replace every `unverified`, `sample`, or `sanitized` designation with an approved source reference before Active status.

### Sanitized expected Figma/DTCG source files

The current UP notes describe an expected export shaped like:

```text
packages/tokens/tokens/
├── Light_Mode_tokens_1.json
├── Light_Mode_tokens_2.json
├── Dark_Mode_tokens_1.json
├── Dark_Mode_tokens_2.json
├── Typography.json
├── Mode_1_tokens_2.json
└── ComponentCommons.json
```

Checklist:

- [ ] Verify whether these files still exist in the actual UP source.
- [ ] Determine which light-mode file is older and which is authoritative.
- [ ] Determine which dark-mode file is older and which is authoritative.
- [ ] Determine the purpose of `Mode_1_tokens_2.json`.
- [ ] Determine whether `ComponentCommons.json` contains Button-specific tokens.
- [ ] Confirm whether typography values are separate or embedded in mode exports.
- [ ] Record Figma variable IDs and collection/mode metadata for traceability.

### Sanitized DTCG example

The UP notes contain this representative primitive:

```json
{
  "primitives": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.1098, 0.4353, 0.6392],
        "alpha": 1,
        "hex": "#1C6FA3"
      },
      "$extensions": {
        "com.figma.variableId": "VariableID:1:118",
        "com.figma.scopes": ["ALL_SCOPES"]
      }
    }
  }
}
```

- [x] Record the sanitized primary example value `#1C6FA3` as reference evidence only.
- [ ] Verify the actual UP primary token path.
- [ ] Verify the actual current value in every supported mode.
- [ ] Verify whether the Figma variable ID remains current.
- [ ] Do not replace current sample tokens with `#1C6FA3` until it is verified and approved.

### Sanitized normalization rules

The current UP notes identify these normalization examples:

| Source issue or term | Normalized term | Current status                                                                                                            |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `forground`          | `foreground`    | Sanitized compatibility rule; verify against actual export.                                                               |
| `minus-4`            | `900`           | Sanitized ramp normalization; verify the owning design decision.                                                          |
| `danger`             | `error`         | Sanitized semantic normalization; requires approval because public wrapper terminology may intentionally remain `danger`. |

Checklist:

- [ ] Confirm whether `forground` still exists in the real export.
- [ ] Correct the source in Figma when practical rather than preserving a typo forever.
- [ ] Confirm whether `minus-4` is a real source key and whether `900` is the approved replacement.
- [ ] Decide whether the public design-system status is `danger` or `error`.
- [ ] Keep PrimeNG provider normalization internal.
- [ ] Encode approved normalizations in the token build.
- [ ] Add unit tests for every normalization.
- [ ] Emit normalization metadata into generated documentation artifacts.
- [ ] Add release notes when normalization changes output values or names.

### Sanitized transformation requirements

- [ ] Load all approved Figma DTCG JSON files.
- [ ] Validate JSON schema and required DTCG properties.
- [ ] Normalize known source naming issues.
- [ ] Merge source files with deterministic precedence.
- [ ] Flatten nested token objects to dotted paths.
- [ ] Resolve aliases transitively.
- [ ] Fail on alias cycles.
- [ ] Convert color values to runtime-safe values.
- [ ] Convert dimension values to CSS-compatible values.
- [ ] Validate that no unresolved `{...}` aliases remain.
- [ ] Generate CSS, JSON, TypeScript, and Zeroheight documentation artifacts from the same resolved model.

## Current public-sector sample token information relevant to Button

The following values are confirmed in the current public sample repository. They demonstrate the mapping mechanism and provide a working fallback, but they must not be mislabeled as authoritative enterprise UP values.

### Primitive tokens

| Primitive               | Value                                    | Candidate relevance                         |
| ----------------------- | ---------------------------------------- | ------------------------------------------- |
| `blue.50`               | `#eff6ff`                                | Light primary tint.                         |
| `blue.100`              | `#dbeafe`                                | Light primary tint.                         |
| `blue.200`              | `#bfdbfe`                                | Border and surface mixing.                  |
| `blue.300`              | `#93c5fd`                                | Dark-mode action and focus values.          |
| `blue.400`              | `#60a5fa`                                | Dark-mode primary.                          |
| `blue.500`              | `#2563eb`                                | Neutral focus ring.                         |
| `blue.600`              | `#1d4ed8`                                | Neutral light primary Button background.    |
| `blue.700`              | `#1e40af`                                | Neutral light hover.                        |
| `blue.800`              | `#1e3a8a`                                | Neutral light active.                       |
| `blue.900`              | `#172554`                                | Dark navigation or vibrant text foundation. |
| `blue.950`              | `#0f172a`                                | Strong neutral text/navigation.             |
| `slate.50`              | `#f8fafc`                                | Light application surface.                  |
| `slate.200`             | `#e2e8f0`                                | Light border.                               |
| `slate.300`             | `#cbd5e1`                                | Muted dark-mode text/navigation.            |
| `slate.600`             | `#475569`                                | Secondary light text.                       |
| `slate.700`             | `#334155`                                | Dark border.                                |
| `slate.900`             | `#0f172a`                                | Primary light text.                         |
| `slate.950`             | `#020617`                                | Dark background and inverse foreground.     |
| `purple.600`            | `#7c3aed`                                | Vibrant primary.                            |
| `purple.700`            | `#6d28d9`                                | Vibrant hover.                              |
| `purple.800`            | `#5b21b6`                                | Vibrant active/action.                      |
| `cyan.300`              | `#67e8f9`                                | Vibrant dark Button/action.                 |
| `cyan.400`              | `#22d3ee`                                | Vibrant dark primary.                       |
| `cyan.500`              | `#06b6d4`                                | Vibrant focus ring.                         |
| `rose.400`              | `#fb7185`                                | Pastel primary source.                      |
| `rose.500`              | `#f43f5e`                                | Pastel hover/danger.                        |
| `rose.600`              | `#e11d48`                                | Pastel active/danger.                       |
| `rose.700`              | `#be123c`                                | Pastel Button/action background.            |
| `rose.800`              | `#9f1239`                                | Pastel action text.                         |
| `green.400`             | `#4ade80`                                | Dark success.                               |
| `green.500`             | `#16a34a`                                | Neutral success.                            |
| `green.600`             | `#059669`                                | Vibrant success.                            |
| `green.700`             | `#047857`                                | Strong success text.                        |
| `amber.400`             | `#f59e0b`                                | Warning foundation.                         |
| `amber.200`             | `#fde68a`                                | Dark warning text.                          |
| `radius.md`             | `0.5rem`                                 | Default Button radius.                      |
| `radius.lg`             | `0.75rem`                                | Larger component radius.                    |
| `space.2`               | `0.5rem`                                 | Button icon/label gap candidate.            |
| `space.4`               | `1rem`                                   | General spacing.                            |
| `space.6`               | `1.5rem`                                 | General spacing.                            |
| `typography.fontFamily` | `"Inter", "Segoe UI", Arial, sans-serif` | Current sample UI font stack.               |

### Neutral light semantic and component tokens

| Token                     | Value or mapping                         | Role                                        |
| ------------------------- | ---------------------------------------- | ------------------------------------------- |
| `--ps-primary-background` | `#1d4ed8`                                | Primary action semantic background.         |
| `--ps-primary-foreground` | `#ffffff`                                | Primary action foreground.                  |
| `--ps-focus-ring-color`   | `#2563eb`                                | Visible keyboard focus.                     |
| `--ps-action-text`        | `#1d4ed8`                                | Outlined and text action foreground.        |
| `--ps-button-background`  | `#1d4ed8`                                | Current filled Button component intent.     |
| `--ps-button-text`        | `#ffffff`                                | Current filled Button component foreground. |
| `--ps-danger-color`       | `#dc2626`                                | Danger foundation.                          |
| `--ps-danger-text`        | `#991b1b`                                | Danger readable text.                       |
| `--ps-success-color`      | `#16a34a`                                | Success foundation.                         |
| `--ps-success-text`       | `#166534`                                | Success readable text.                      |
| `--ps-warn-text`          | `#92400e`                                | Warning readable text.                      |
| `--ps-radius-md`          | `0.5rem`                                 | Default component radius.                   |
| `--ps-radius-lg`          | `0.75rem`                                | Large component radius.                     |
| `--ps-space-2`            | `0.5rem`                                 | Compact component gap.                      |
| `--ps-font-family`        | `"Inter", "Segoe UI", Arial, sans-serif` | Runtime font family.                        |

### Neutral light PrimeNG Button provider mapping

| Provider token                                    | Value or reference                                                              | Purpose                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------- |
| `--p-primary-color`                               | `var(--ps-primary-background)`                                                  | PrimeNG primary semantic bridge.  |
| `--p-primary-hover-color`                         | `#1e40af`                                                                       | Primary hover.                    |
| `--p-primary-active-color`                        | `#1e3a8a`                                                                       | Primary pressed/active.           |
| `--p-primary-inverse-color`                       | `var(--ps-primary-foreground)`                                                  | Primary foreground.               |
| `--p-focus-ring-width`                            | `2px`                                                                           | Focus indicator width.            |
| `--p-focus-ring-style`                            | `solid`                                                                         | Focus indicator style.            |
| `--p-focus-ring-color`                            | `var(--ps-focus-ring-color)`                                                    | Focus indicator color.            |
| `--p-focus-ring-offset`                           | `2px`                                                                           | Focus indicator separation.       |
| `--p-focus-ring-shadow`                           | `0 0 0 0.2rem color-mix(in srgb, var(--ps-focus-ring-color) 24%, transparent)`  | Focus halo.                       |
| `--p-button-transition-duration`                  | `140ms`                                                                         | Button transition timing.         |
| `--p-button-border-radius`                        | `var(--ps-radius-md)`                                                           | Button shape.                     |
| `--p-button-padding-y`                            | `0.65rem`                                                                       | Vertical padding.                 |
| `--p-button-padding-x`                            | `0.9rem`                                                                        | Horizontal padding.               |
| `--p-button-gap`                                  | `0.5rem`                                                                        | Icon/label gap.                   |
| `--p-button-label-font-weight`                    | `700`                                                                           | Label emphasis.                   |
| `--p-button-primary-background`                   | `var(--p-primary-color)`                                                        | Filled primary default.           |
| `--p-button-primary-hover-background`             | `var(--p-primary-hover-color)`                                                  | Filled primary hover.             |
| `--p-button-primary-active-background`            | `var(--p-primary-active-color)`                                                 | Filled primary active.            |
| `--p-button-primary-border-color`                 | `var(--p-primary-color)`                                                        | Filled primary border.            |
| `--p-button-primary-hover-border-color`           | `var(--p-primary-hover-color)`                                                  | Filled primary hover border.      |
| `--p-button-primary-active-border-color`          | `var(--p-primary-active-color)`                                                 | Filled primary active border.     |
| `--p-button-primary-color`                        | `var(--p-primary-inverse-color)`                                                | Filled primary foreground.        |
| `--p-button-primary-hover-color`                  | `var(--p-primary-inverse-color)`                                                | Filled primary hover foreground.  |
| `--p-button-primary-active-color`                 | `var(--p-primary-inverse-color)`                                                | Filled primary active foreground. |
| `--p-button-primary-focus-ring-shadow`            | `var(--p-focus-ring-shadow)`                                                    | Primary focus evidence.           |
| `--p-button-outlined-primary-border-color`        | `color-mix(in srgb, var(--p-primary-color) 70%, var(--p-content-border-color))` | Outlined primary border.          |
| `--p-button-outlined-primary-color`               | `var(--ps-action-text)`                                                         | Outlined primary text.            |
| `--p-button-outlined-primary-hover-background`    | `color-mix(in srgb, var(--p-primary-color) 10%, transparent)`                   | Outlined primary hover.           |
| `--p-button-outlined-primary-active-background`   | `color-mix(in srgb, var(--p-primary-color) 16%, transparent)`                   | Outlined primary active.          |
| `--p-button-text-primary-color`                   | `var(--ps-action-text)`                                                         | Text Button foreground.           |
| `--p-button-text-primary-hover-background`        | `color-mix(in srgb, var(--p-primary-color) 10%, transparent)`                   | Text Button hover.                |
| `--p-button-text-primary-active-background`       | `color-mix(in srgb, var(--p-primary-color) 16%, transparent)`                   | Text Button active.               |
| `--p-button-secondary-background`                 | `var(--p-content-background)`                                                   | Secondary default.                |
| `--p-button-secondary-border-color`               | `var(--p-content-border-color)`                                                 | Secondary border.                 |
| `--p-button-secondary-color`                      | `var(--p-text-color)`                                                           | Secondary foreground.             |
| `--p-button-secondary-hover-background`           | `color-mix(in srgb, var(--p-content-background) 84%, var(--p-primary-color))`   | Secondary hover.                  |
| `--p-button-secondary-hover-border-color`         | `var(--p-content-border-color)`                                                 | Secondary hover border.           |
| `--p-button-secondary-active-background`          | `color-mix(in srgb, var(--p-content-background) 76%, var(--p-primary-color))`   | Secondary active.                 |
| `--p-button-secondary-active-border-color`        | `var(--p-content-border-color)`                                                 | Secondary active border.          |
| `--p-button-secondary-focus-ring-shadow`          | `var(--p-focus-ring-shadow)`                                                    | Secondary focus evidence.         |
| `--p-button-outlined-secondary-border-color`      | `var(--p-content-border-color)`                                                 | Outlined secondary border.        |
| `--p-button-outlined-secondary-color`             | `var(--p-text-color)`                                                           | Outlined secondary text.          |
| `--p-button-outlined-secondary-hover-background`  | `color-mix(in srgb, var(--p-content-background) 84%, var(--p-primary-color))`   | Outlined secondary hover.         |
| `--p-button-outlined-secondary-active-background` | `color-mix(in srgb, var(--p-content-background) 76%, var(--p-primary-color))`   | Outlined secondary active.        |
| `--p-button-text-secondary-color`                 | `var(--p-text-color)`                                                           | Text secondary foreground.        |
| `--p-button-text-secondary-hover-background`      | `color-mix(in srgb, var(--p-content-background) 84%, var(--p-primary-color))`   | Text secondary hover.             |
| `--p-button-text-secondary-active-background`     | `color-mix(in srgb, var(--p-content-background) 76%, var(--p-primary-color))`   | Text secondary active.            |
| `--p-button-icon-only-width`                      | `2.5rem`                                                                        | Icon-only width.                  |
| `--p-button-rounded-border-radius`                | `999rem`                                                                        | Fully rounded option.             |

### Current theme and mode values used by Button

| Theme and mode | Primary                                                | Hover                                  | Active                                 | Foreground                 | Focus     | Action text | Button intent background | Button intent text |
| -------------- | ------------------------------------------------------ | -------------------------------------- | -------------------------------------- | -------------------------- | --------- | ----------- | ------------------------ | ------------------ |
| Neutral light  | `#1d4ed8`                                              | `#1e40af`                              | `#1e3a8a`                              | `#ffffff`                  | `#2563eb` | `#1d4ed8`   | `#1d4ed8`                | `#ffffff`          |
| Vibrant light  | `#7c3aed`                                              | `#6d28d9`                              | `#5b21b6`                              | `#ffffff`                  | `#06b6d4` | `#5b21b6`   | `#5b21b6`                | `#ffffff`          |
| Pastel light   | `#be123c` provider primary; `#fb7185` semantic primary | `#f43f5e`                              | `#e11d48`                              | `#ffffff` provider inverse | `#f9a8d4` | `#9f1239`   | `#be123c`                | `#ffffff`          |
| Neutral dark   | `#60a5fa` semantic primary                             | Confirm generated/provider inheritance | Confirm generated/provider inheritance | `#020617`                  | `#93c5fd` | `#93c5fd`   | `#93c5fd`                | `#020617`          |
| Vibrant dark   | `#22d3ee`                                              | `#67e8f9`                              | `#a5f3fc`                              | `#07031a`                  | `#a78bfa` | `#67e8f9`   | `#67e8f9`                | `#07031a`          |
| Pastel dark    | `#f9a8d4`                                              | `#fbcfe8`                              | `#fce7f3`                              | `#1f1a2e`                  | `#f0abfc` | `#fbcfe8`   | `#fbcfe8`                | `#1f1a2e`          |

### Token gaps that must be filled from the actual UP Design System

- [ ] Exact Button token names in the UP source.
- [ ] Exact primitive references for every Button value.
- [ ] Button dimensions for every approved size.
- [ ] Button border widths and styles.
- [ ] Button typography: family, size, weight, line height, and letter spacing.
- [ ] Button icon dimensions and placement rules.
- [ ] Button default, hover, active, focus, disabled, and loading tokens for every appearance.
- [ ] Button tone values for primary, secondary, neutral, success, warning, and danger/error.
- [ ] Light and dark values for every Button component token.
- [ ] High-contrast or accessibility mode values, if supported.
- [ ] Motion duration and easing tokens.
- [ ] Reduced-motion behavior.
- [ ] Minimum target size.
- [ ] Full-width and responsive behavior.
- [ ] Icon-only dimensions and focus behavior.
- [ ] Design guidance that is not represented as a token.

## Token files to create or confirm

Recommended candidate source layout:

```text
packages/tokens/src/tokens/up-design-system/button/
├── up-button-source-inventory.json
├── up-button.dtcg.json
├── up-button-mapping.json
└── up-button-candidate.css
```

Checklist:

- [ ] Create `up-button-source-inventory.json`.
- [ ] Preserve original UP token paths.
- [ ] Preserve Figma collection, mode, variable ID, and source-file metadata.
- [ ] Preserve aliases and resolved values.
- [ ] Mark every source item `verified`, `sanitized-reference`, `sample`, or `unverified`.
- [ ] Create `up-button.dtcg.json` only when the real approved UP export is available or when the candidate fixture is clearly labeled.
- [ ] Create `up-button-mapping.json`.
- [ ] Map source -> primitive -> semantic -> component -> PrimeNG provider token.
- [ ] Record normalization rules per mapping.
- [ ] Record owner and approval status per mapping.
- [ ] Generate candidate CSS from the mapping rather than duplicating values manually.
- [ ] Add token-build tests.
- [ ] Add unresolved-alias and cycle tests.
- [ ] Add light/dark completeness tests.
- [ ] Add documentation-export tests.

### Recommended mapping record

```json
{
  "source": "button.primary.solid.background.default",
  "sourceStatus": "unverified",
  "primitive": "color.brand.600",
  "semantic": "--ps-action-primary-background",
  "component": "--ps-up-button-primary-background",
  "provider": "--p-button-primary-background",
  "mode": "light",
  "normalization": null,
  "lifecycle": "candidate"
}
```

## Candidate token scoping

The candidate must not unintentionally restyle every existing `ps-button`.

- [ ] Confirm whether the candidate uses local CSS variables, a host class, a scoped preset, or a combination.
- [ ] Keep candidate-specific component tokens under a clear namespace such as `--ps-up-button-*` during evaluation.
- [ ] Map candidate component tokens to PrimeNG variables only inside the candidate scope when possible.
- [ ] Confirm that the existing `ps-button` remains visually unchanged.
- [ ] Add a regression screenshot or computed-style assertion for the existing Button.
- [ ] Confirm that global theme switching still updates both current and candidate Buttons.
- [ ] Confirm that locally scoped provider variables reach the internal PrimeNG Button element.
- [ ] Confirm no candidate styles leak into Tag, Card, Table, Dialog, Menu, Toast, or other wrappers.

Example direction:

```css
:host {
  --p-button-primary-background: var(--ps-up-button-primary-background);
  --p-button-primary-hover-background: var(
    --ps-up-button-primary-hover-background
  );
  --p-button-primary-active-background: var(
    --ps-up-button-primary-active-background
  );
  --p-button-primary-color: var(--ps-up-button-primary-foreground);
  --p-button-border-radius: var(--ps-up-button-border-radius);
  --p-button-padding-x: var(--ps-up-button-padding-inline);
  --p-button-padding-y: var(--ps-up-button-padding-block);
}
```

- [ ] Validate this approach against the generated DOM and PrimeNG styled mode.
- [ ] Do not assume host variables work until computed styles prove the internal element receives them.

## Figma checklist

### Source review

- [ ] Obtain access to the approved UP Design System Figma library.
- [ ] Identify the Button component set.
- [ ] Identify all Button component properties.
- [ ] Identify the variable collections and modes used by Button.
- [ ] Record the Figma library version or publication date.
- [ ] Record the Button component node URL.
- [ ] Record the token collection URLs or variable references where supported.
- [ ] Capture screenshots of every approved state for review evidence.

### Token inventory

- [ ] Export or capture every primitive referenced by Button.
- [ ] Export or capture every semantic token referenced by Button.
- [ ] Export or capture every Button-specific component token.
- [ ] Export or capture light-mode values.
- [ ] Export or capture dark-mode values.
- [ ] Export or capture additional brand/theme modes.
- [ ] Export or capture typography values.
- [ ] Export or capture spacing, radius, border, size, icon, and motion values.
- [ ] Preserve aliases instead of recording only resolved hex values.
- [ ] Preserve variable IDs for traceability.

### Button component set

- [ ] Build or verify `Appearance=Solid`.
- [ ] Build or verify `Appearance=Outlined`.
- [ ] Build or verify `Appearance=Text`.
- [ ] Build or verify every approved tone.
- [ ] Build or verify `Size=Small`.
- [ ] Build or verify `Size=Medium`.
- [ ] Build or verify `Size=Large`.
- [ ] Build or verify `State=Default`.
- [ ] Build or verify `State=Hover`.
- [ ] Build or verify `State=Pressed`.
- [ ] Build or verify `State=Focused`.
- [ ] Build or verify `State=Disabled`.
- [ ] Build or verify `State=Loading`.
- [ ] Build or verify leading icon.
- [ ] Build or verify trailing icon.
- [ ] Build or verify icon-only.
- [ ] Build or verify long-label behavior.
- [ ] Build or verify full-width behavior.

### Figma-to-code contract

- [ ] Match Figma property names to public wrapper names.
- [ ] Avoid PrimeNG severity terms in Figma.
- [ ] Align `Appearance`, `Tone`, `Size`, `State`, and icon-position vocabulary with Storybook Controls.
- [ ] Link the Figma component from Storybook docs.
- [ ] Link the Figma component from Zeroheight.
- [ ] Add a token-name annotation or Dev Mode notes for each visual property.
- [ ] Confirm the design owner has approved the code mapping.

## Angular wrapper checklist

### Component structure

- [x] A separate candidate wrapper was created locally.
- [ ] Verify the final file path and class name after commit.
- [ ] Keep the candidate standalone if that matches the current package architecture.
- [ ] Import PrimeNG only inside `ui-patterns`.
- [ ] Export only the design-system component and public types.
- [ ] Do not export PrimeNG modules or types.
- [ ] Keep the selector clearly marked as candidate until promotion.

### Public API

- [ ] Implement `appearance`.
- [ ] Implement `tone`.
- [ ] Implement `size`.
- [ ] Implement `label`.
- [ ] Implement leading/trailing/icon-only support.
- [ ] Implement `disabled`.
- [ ] Implement `loading`.
- [ ] Implement normalized `buttonClick`.
- [ ] Implement `routerLink` only if approved.
- [ ] Implement native Button type.
- [ ] Add required accessible-label support for icon-only mode.
- [ ] Reject or prevent invalid input combinations.

### Provider mapping

- [ ] Map public `warning` to the approved PrimeNG provider term internally.
- [ ] Map public `danger` or `error` to the approved PrimeNG provider term internally.
- [ ] Keep mapping logic unit tested.
- [ ] Keep token values out of the component TypeScript.
- [ ] Use the generated preset and scoped component tokens.
- [ ] Document any provider escape hatch.

### Existing Button protection

- [ ] Existing `PublicButtonComponent` compiles unchanged.
- [ ] Existing acceptance stories render unchanged.
- [ ] Existing current-wrapper tests remain green.
- [ ] Existing QA pages still function.
- [ ] Existing shell routes still function.
- [ ] No existing API is deprecated until the candidate promotion decision is approved.

## Storybook checklist

### Story organization

- [x] Dedicated candidate story created at `apps/qa-remote/src/stories/up-button.stories.ts`.
- [x] Current Storybook title is `Design System/Candidates/Button UP`.
- [x] Storybook sidebar order places `Design System / Candidates` above `Design System / Acceptance`.
- [ ] Keep current Button/Tag acceptance story in place.
- [ ] Set `component` to the candidate Angular component when Storybook signal input handling supports it cleanly for this wrapper.
- [x] Use explicit Angular render templates where necessary.
- [x] Do not rely on `component` metadata until Storybook signal extraction supports this candidate without argtype/rendering issues.
- [ ] Add `tags: ['autodocs']` when API documentation is accurate.
- [ ] Add component and story descriptions.
- [ ] Add links to Figma, source, QA route, and Zeroheight.

### Controls

- [x] Add label Control.
- [x] Add appearance radio/select Control.
- [x] Add tone radio/select Control.
- [ ] Add size radio/select Control.
- [x] Add disabled boolean Control.
- [x] Add loading boolean Control.
- [x] Add icon Control.
- [ ] Add icon-position Control.
- [ ] Add full-width Control.
- [x] Hide internal or unsupported provider inputs.

### Required stories

- [x] Primary solid.
- [x] Secondary solid.
- [ ] Neutral solid.
- [x] Success solid, if approved.
- [x] Info solid, if approved.
- [x] Warning solid, if approved.
- [x] Help solid, if approved.
- [x] Contrast solid, if approved.
- [x] Error solid, if approved.
- [x] Primary outlined.
- [x] Secondary outlined.
- [x] Danger/error outlined, if approved.
- [x] Primary text.
- [x] Secondary text.
- [ ] Small.
- [ ] Medium.
- [ ] Large.
- [x] Leading icon.
- [ ] Trailing icon.
- [ ] Icon-only.
- [x] Loading.
- [x] Disabled.
- [x] Long label.
- [ ] Full width.
- [x] Tone matrix.
- [x] Appearance matrix.
- [ ] Size matrix.
- [ ] State matrix.
- [x] Interaction harness with observable activation count.
- [x] Current-versus-candidate comparison.

### Theme stories

The QA Storybook already supports neutral, vibrant, and pastel theme variants plus light and dark modes.

- [x] Candidate renders in neutral light.
- [x] Candidate renders in neutral dark.
- [ ] Candidate renders in vibrant light.
- [x] Candidate renders in vibrant dark.
- [ ] Candidate renders in pastel light.
- [ ] Candidate renders in pastel dark.
- [x] Storybook toolbar globals update the candidate without reload errors in the isolated Playwright test path.
- [ ] Current and candidate Buttons both update so differences can be reviewed.

### Storybook interaction tests

- [x] Isolated Storybook Playwright spec exists at `apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts`.
- [x] Candidate-specific command exists: `pnpm test:storybook:up-button:chromium`.
- [x] Isolated tests use direct `iframe.html` URLs rather than depending on the Storybook manager UI.
- [x] Button is found by role and accessible name.
- [x] Click invokes the normalized action.
- [x] Enter activates the Button.
- [x] Space activates the Button.
- [x] Disabled prevents activation.
- [x] Loading prevents duplicate activation and exposes `aria-busy="true"`.
- [x] Focus-visible state is observable.
- [ ] Icon-only requires an accessible name.
- [x] Long label remains readable.
- [x] Tone and appearance matrix stories render.
- [x] Current wrapper versus UP candidate comparison story renders.
- [x] Theme globals resolve for dark/vibrant mode.
- [ ] Controls update the rendered component through Storybook manager controls.
- [ ] Add Storybook `play` functions or a compatible Storybook test-runner setup if Interactions-panel evidence is required.
- [ ] Tests appear in the Storybook Interactions panel.

### Storybook accessibility

- [ ] Set candidate stories to `a11y.test = 'error'`.
- [ ] Run axe for every high-value candidate story.
- [ ] Resolve all critical and serious violations.
- [ ] Review incomplete axe findings rather than silently ignoring them.
- [ ] Verify text contrast.
- [ ] Verify non-text contrast for boundaries and focus.
- [ ] Verify target size.
- [ ] Verify visible focus in every theme.
- [ ] Verify disabled and loading semantics.

## QA remote checklist

### Candidate display

- [x] Candidate was added locally to the QA remote.
- [ ] Verify the QA route after commit.
- [ ] Add a dedicated `UP Button Candidate` section.
- [ ] Show lifecycle badge: Candidate.
- [ ] Link to Storybook.
- [ ] Link to source.
- [ ] Link to the token mapping document.
- [ ] Explain that existing `ps-button` is not yet replaced.

### Side-by-side comparison

- [ ] Current primary beside candidate primary.
- [ ] Current outlined beside candidate outlined.
- [ ] Current text beside candidate text.
- [ ] Current disabled beside candidate disabled.
- [ ] Current loading beside candidate loading.
- [ ] Current long label beside candidate long label.
- [ ] Current icon Button beside candidate icon Button.
- [ ] Compare computed size, padding, radius, type, and focus ring.
- [ ] Compare all themes and modes.

### Runtime validation

- [ ] Candidate renders when QA remote runs independently.
- [ ] Candidate renders when QA remote is mounted through the shell.
- [ ] Root CSS variables inherit correctly.
- [ ] Candidate-scoped variables reach the internal PrimeNG Button.
- [ ] `.p-dark` updates the candidate.
- [ ] `ps-theme-vibrant` updates the candidate.
- [ ] `ps-theme-pastel` updates the candidate.
- [ ] No console errors.
- [ ] No hydration/bootstrap errors.
- [ ] No remote-entry loading regression.

## Testing checklist

### Token tests

- [ ] UP DTCG JSON parses.
- [ ] Required token types are present.
- [ ] Duplicate-path precedence is deterministic.
- [ ] `forground -> foreground` normalization is tested if still required.
- [ ] `minus-4 -> 900` normalization is tested if still required.
- [ ] `danger/error` normalization is tested.
- [ ] Multi-level aliases resolve.
- [ ] Alias cycles fail.
- [ ] No unresolved aliases remain.
- [ ] Light and dark Button token sets are complete.
- [ ] CSS, JSON, TypeScript, preset, and Zeroheight outputs agree.

### Wrapper unit tests

- [ ] Default inputs render the expected design-system intent.
- [ ] Every appearance maps correctly.
- [ ] Every tone maps correctly.
- [ ] Every size maps correctly.
- [ ] Disabled is forwarded correctly.
- [ ] Loading is forwarded correctly.
- [ ] Click event is normalized.
- [ ] Router navigation is tested if supported.
- [ ] Native Button type is tested.
- [ ] Invalid combinations are prevented or normalized.
- [ ] PrimeNG types do not appear in public exports.

### Storybook static E2E

- [x] Candidate story ID was added to `scripts/storybook-e2e.mjs`.
- [x] Storybook static build completed successfully.
- [x] Final static E2E pass recorded after the explicit render change and current-versus-candidate story addition: `pnpm nx run qa-remote:e2e` passed with 38 discovered stories and 3 rendered story iframes.
- [x] Candidate story content is validated in the generated iframe by the static Storybook E2E path.
- [x] Axe runs against rendered iframe stories in the static Storybook E2E path.
- [ ] Avoid using a story-count assertion that breaks every time a legitimate story is added unless the count is intentionally maintained.
- [x] Intentional failing demo test removed from the broad Storybook Playwright spec.

### Isolated Storybook Playwright E2E

These tests are the current candidate-specific Storybook evidence path. They run only the UP Button candidate iframe stories, including the current-versus-candidate comparison story.

- [x] Spec added at `apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts`.
- [x] Script added: `pnpm test:storybook:up-button`.
- [x] Chromium-only script added for fast candidate validation: `pnpm test:storybook:up-button:chromium`.
- [x] Tests load direct Storybook `iframe.html` URLs.
- [x] Primary story verifies role, accessible name, enabled state, and token-driven computed styles.
- [x] Interaction harness verifies pointer click increments the normalized `buttonClick` output count.
- [x] Interaction harness verifies Enter activation.
- [x] Interaction harness verifies Space activation.
- [x] Disabled story verifies the Button is disabled.
- [x] Loading story verifies disabled behavior and `aria-busy="true"`.
- [x] Focus test verifies a visible outline or focus treatment is present.
- [x] Long-label story verifies rendered text does not clip horizontally.
- [x] Tone matrix story verifies at least primary and error examples render.
- [x] Appearance matrix story verifies primary and error examples render.
- [x] Current-versus-candidate story verifies the current wrapper and UP candidate render side by side.
- [x] Theme globals test verifies dark/vibrant mode classes and Button token variables resolve.
- [x] Local result recorded: `pnpm test:storybook:up-button:chromium` passed 9 tests.
- [ ] Run the full cross-browser command `pnpm test:storybook:up-button` after the candidate API is less volatile.

### Playwright QA and federation E2E

- [ ] Open QA remote directly.
- [ ] Verify candidate label and role.
- [ ] Verify click behavior.
- [ ] Verify keyboard behavior.
- [ ] Verify disabled behavior.
- [ ] Verify loading behavior.
- [ ] Verify theme changes.
- [ ] Mount QA remote through shell.
- [ ] Repeat key interaction and theme assertions through federation.
- [ ] Verify no direct PrimeNG usage appears in application code.

### Visual regression

- [ ] Capture neutral light baseline.
- [ ] Capture neutral dark baseline.
- [ ] Capture vibrant light baseline.
- [ ] Capture vibrant dark baseline.
- [ ] Capture pastel light baseline.
- [ ] Capture pastel dark baseline.
- [ ] Capture focus state.
- [ ] Capture disabled state.
- [ ] Capture loading state.
- [ ] Capture long label and icon-only state.
- [ ] Review differences against Figma.
- [ ] Define acceptable visual tolerance.

### Accessibility review

- [ ] WCAG role and name.
- [ ] Keyboard activation.
- [ ] Focus visible.
- [ ] Focus not obscured.
- [ ] Minimum target size.
- [ ] Text contrast.
- [ ] Component boundary contrast.
- [ ] Disabled semantics.
- [ ] Loading announcement.
- [ ] Icon-only accessible name.
- [ ] Reduced-motion handling.
- [ ] High zoom and text resize.
- [ ] Long localized label.

## GitHub and CI checklist

- [ ] Commit the candidate wrapper.
- [ ] Commit candidate public types.
- [ ] Commit candidate token source and mappings.
- [ ] Commit the candidate Storybook stories.
- [ ] Commit QA remote changes.
- [ ] Commit Storybook static E2E changes.
- [ ] Commit isolated candidate Storybook Playwright spec.
- [ ] Commit candidate test scripts in `package.json`.
- [x] Commit this integration plan.
- [ ] Run `pnpm lint`.
- [ ] Run token build and token tests.
- [ ] Run `ui-patterns` typecheck/tests.
- [ ] Run QA remote typecheck/tests.
- [ ] Run Storybook build.
- [ ] Run Storybook static E2E.
- [ ] Run isolated candidate Storybook Playwright E2E.
- [ ] Run QA Playwright tests.
- [ ] Run shell/federation Playwright tests.
- [ ] Publish test reports or artifacts from CI.
- [ ] Deploy Storybook to a stable HTTPS URL.
- [ ] Add the deployed Storybook URL to Zeroheight.
- [ ] Add links from Storybook back to GitHub and Figma.
- [ ] Add a status badge or evidence link for the candidate test workflow.

## Zeroheight checklist

### Page structure

Create a curated page similar to:

```text
Components
└── Button
    └── UP Design System Candidate
```

- [ ] Title: Button.
- [ ] Lifecycle status: Candidate.
- [ ] Owner.
- [ ] Design owner.
- [ ] Engineering owner.
- [ ] Accessibility owner or reviewer.
- [ ] Package and import path.
- [ ] Candidate selector.
- [ ] Stable selector and migration relationship.
- [ ] Release/version information.

### Guidance

- [ ] Purpose.
- [ ] When to use.
- [ ] When not to use.
- [ ] Action hierarchy.
- [ ] Content guidance.
- [ ] Label-writing guidance.
- [ ] Icon guidance.
- [ ] Loading guidance.
- [ ] Disabled guidance.
- [ ] Destructive-action guidance.
- [ ] Full-width and responsive guidance.
- [ ] Accessibility requirements.
- [ ] Known limitations.

### Design information

- [ ] Embed or link the Figma component set.
- [ ] Show anatomy.
- [ ] Show appearance matrix.
- [ ] Show tone matrix.
- [ ] Show size matrix.
- [ ] Show state matrix.
- [ ] Show light/dark behavior.
- [ ] Show token names and aliases.
- [ ] Label sanitized or sample values clearly until verified.

### Developer information

- [ ] Import example.
- [ ] Angular template example.
- [ ] Public API table.
- [ ] Event behavior.
- [ ] Theme behavior.
- [ ] Migration guidance from direct PrimeNG.
- [ ] Migration guidance from current `ps-button`, if the candidate changes API.
- [ ] Link to live Storybook controls.
- [ ] Embed the Storybook iframe when allowed by hosting and Zeroheight security settings.

### Evidence links

- [ ] Figma Button component.
- [ ] Figma variables or token export reference.
- [ ] Candidate wrapper source.
- [ ] Token mapping source.
- [ ] Storybook primary story.
- [ ] Storybook matrix story.
- [ ] QA remote route.
- [ ] Shell/federation validation.
- [ ] Unit test results.
- [ ] Storybook interaction test results.
- [ ] Axe accessibility results.
- [ ] Visual regression review.
- [ ] CI workflow run.
- [ ] Release notes.

### Zeroheight token documentation

- [ ] Generate token documentation from the token build.
- [ ] Use `zeroheight-tokens.json` or an approved replacement as the documentation input.
- [ ] Do not hand-maintain runtime values only in Zeroheight.
- [ ] Explain primitive, semantic, component, and provider tiers.
- [ ] Show provider mappings as implementation evidence, not application API.
- [ ] Record normalization rules and statuses.
- [ ] Record deprecated token aliases.
- [ ] Record mode support.

## Developer-experience walkthrough

The final demonstration should be executable in this order:

- [ ] Open Zeroheight Button Candidate page.
- [ ] Read status, ownership, usage, and limitations.
- [ ] Open or inspect the embedded Figma component.
- [ ] Show that Figma properties match wrapper and Storybook names.
- [ ] Review token names and modes.
- [ ] Open embedded or linked Storybook.
- [ ] Change appearance.
- [ ] Change tone.
- [ ] Change size.
- [ ] Toggle disabled and loading.
- [ ] Add/remove an icon.
- [ ] Change neutral/vibrant/pastel theme.
- [ ] Change light/dark mode.
- [ ] Run Storybook interaction tests.
- [ ] Review Storybook accessibility results.
- [ ] Copy the Angular import and template example.
- [ ] Open the candidate source in GitHub.
- [ ] Open the token mapping in GitHub.
- [ ] Open the passing CI evidence.
- [ ] Open the QA remote comparison page.
- [ ] Show the current and candidate Buttons side by side.
- [ ] Mount through the shell and show federation/theme behavior.

## Promotion gates

The UP Button candidate must remain Candidate until all required gates are complete.

### Design gate

- [ ] Actual UP source reviewed.
- [ ] Figma component and properties approved.
- [ ] Token names and values verified.
- [ ] Appearance, tone, size, and state matrices approved.
- [ ] Content and icon guidance approved.

### Token gate

- [ ] DTCG export accepted.
- [ ] Precedence approved.
- [ ] Normalization approved.
- [ ] Generated artifacts agree.
- [ ] No unresolved aliases.
- [ ] Light/dark completeness proven.
- [ ] Candidate scoping proven.

### API gate

- [ ] Public wrapper API approved.
- [ ] PrimeNG details do not leak.
- [ ] Invalid combinations prevented.
- [ ] Events normalized.
- [ ] Forms and navigation behavior approved.
- [ ] Migration strategy approved.

### Storybook gate

- [ ] Required stories complete.
- [ ] Controls complete.
- [ ] Autodocs accurate.
- [ ] Interaction tests pass.
- [ ] Axe checks pass.
- [ ] All theme/mode combinations reviewed.

### Runtime gate

- [ ] Independent QA remote proof.
- [ ] Shell-mounted proof.
- [ ] Theme propagation proof.
- [ ] Existing Button regression proof.
- [ ] No style leakage.
- [ ] No console/runtime errors.

### Governance gate

- [ ] Zeroheight page complete.
- [ ] Owner named.
- [ ] Evidence linked.
- [ ] Known limitations recorded.
- [ ] Release/migration notes written.
- [ ] Promotion decision recorded.

## Promotion decision record

- [ ] Promote candidate internals into canonical `ps-button`.
- [ ] Keep candidate for further work.
- [ ] Reject candidate and retain the current implementation.
- [ ] Record decision date.
- [ ] Record decision owner.
- [ ] Record approved token version.
- [ ] Record approved Figma library version.
- [ ] Record package/release version.
- [ ] Record required migration steps.

## Immediate next actions

1. [ ] Commit and push the candidate wrapper, Storybook stories, QA page changes, static E2E changes, isolated Playwright spec, test scripts, and documentation updates.
2. [ ] Verify the pushed files against the `Current implementation inventory` section above.
3. [ ] Run `pnpm test:storybook:up-button` across all configured Playwright projects when the candidate is ready for broader browser evidence.
4. [x] Remove the intentional failing demo test before treating the broad Storybook Playwright suite as CI approval evidence.
5. [ ] Obtain the actual UP Design System Button component and token export.
6. [ ] Populate `up-button-source-inventory.json` with verified token paths, aliases, values, modes, and Figma IDs.
7. [ ] Create the explicit source-to-semantic-to-component-to-PrimeNG mapping.
8. [ ] Ensure candidate token overrides are scoped and do not restyle the existing `ps-button`.
9. [ ] Complete strict axe validation and any remaining Storybook matrix coverage.
10. [ ] Complete QA remote side-by-side and shell-mounted integration proof.
11. [ ] Publish Storybook to a stable HTTPS URL.
12. [ ] Create the Zeroheight Candidate page and connect Figma, Storybook, GitHub, QA, and CI evidence.
13. [ ] Review the promotion gates and decide whether to move the candidate into the canonical `ps-button`.

## Final recommendation

Using the UP Design System as the visual and token source for a governed `ps-*` wrapper is a strong approach. The wrapper protects application teams from PrimeNG, centralizes accessibility and behavior, and allows the provider to change later without rewriting application templates.

The important safeguards are:

- keep the current `ps-button` stable during the proof;
- use a separately named candidate wrapper while design and API decisions are unsettled;
- use real UP token exports rather than copying only visible CSS values;
- map tokens through primitive, semantic, component, and provider tiers;
- scope candidate provider variables so they do not globally restyle existing Buttons;
- prove behavior first with isolated Storybook iframe tests, then with QA remote and federated shell validation;
- publish curated guidance and evidence in Zeroheight;
- promote the candidate into the canonical `ps-button` only after design, token, API, accessibility, runtime, and governance gates are complete.
