# UP Button Developer Experience Candidate

## Direction

We are not changing the existing `ps-button` implementation in place yet.

The current `ps-button` remains the existing PrimeNG-backed wrapper used across
the repo. The new work is a separate up-design-system Button candidate:

- component: `PublicUpButtonComponent`
- selector: `ps-up-button`
- source: `packages/ui-patterns/src/public-up-button.component.ts`
- Storybook story: `apps/qa-remote/src/stories/up-button.stories.ts`
- Storybook title: `Design System / Experiments / Button UP`
- Storybook navigation: `Experiments` is ordered above `Acceptance` under `Design System`
- Component Lab proof: included in the `/qa` acceptance checkpoint

This is the safer path. It lets us prove the up-design-system token styling,
cleaner API, Storybook developer experience, Zeroheight evidence model, and
Figma mapping without breaking existing consumers of `ps-button`. Once the
candidate is accepted, the team can either promote this implementation into the
canonical `ps-button` or keep it as a migration target while older usage is
retired.

I do not think using up-design-system tokens for the `ps-*` wrapper model is a
bad idea. It is the right idea if the token source, normalization rules, and API
boundary are treated as product decisions rather than one-off component CSS.
The wrapper should consume design-system intent and tokens; application teams
should not consume PrimeNG button APIs directly.

## Status

Lifecycle status: Candidate

The candidate must stay Candidate until these are done:

- Figma Button component set uses the same up-design-system token decisions.
- Storybook renders all candidate Button variants.
- `/qa` shows the candidate next to existing wrapper evidence.
- Static Storybook e2e validates the primary story iframe.
- Accessibility checks are blocking for the candidate story.
- Zeroheight has curated guidance and evidence links.
- The team decides whether `ps-up-button` replaces the current `ps-button`.

## Source Material

The up-design-system material in this repo is intentionally sanitized prototype
guidance. It is useful for the sample, but should not be presented as proof of a
real enterprise export until the real Figma export is checked.

Relevant files:

| File | Role |
| --- | --- |
| `docs/design-system/architecture/up-design-system/README.md` | Explains that the notes are sanitized prototype guidance. |
| `docs/design-system/architecture/up-design-system/token-export-validation.md` | Defines the expected Figma DTCG source shape and normalization rules. |
| `docs/design-system/architecture/up-design-system/primeng-binding-audit.md` | Defines the desired path from tokens to PrimeNG preset to wrappers. |
| `docs/design-system/architecture/up-design-system/wrapper-pattern-validation.md` | Defines the wrapper-first API boundary. |
| `docs/design-system/architecture/up-design-system/critical-design-decisions.md` | Tracks unresolved API, token, and validation decisions. |
| `packages/tokens/src/tokens/figma-dtcg.sample.json` | Sample DTCG-compatible token source. |
| `packages/tokens/src/tokens/themes.json` | Current runtime CSS variable source for neutral, vibrant, pastel, light, and dark. |
| `packages/tokens/src/tokens/zeroheight-metadata.json` | Documentation metadata for token export. |
| `packages/tokens/src/zeroheight-tokens.json` | Generated Zeroheight-friendly token export. |

## Token Source Shape

The up-design-system notes expect Figma to export DTCG-compatible JSON. The
sample source in `figma-dtcg.sample.json` models these tiers:

- primitive
- semantic
- component
- provider or PrimeNG mapping

The important idea is that Figma variables do not map straight to component CSS
by hand. They are normalized, resolved, emitted as token artifacts, mapped into
the UI provider layer, and then consumed by wrappers.

Expected source flow:

```text
Figma DTCG export
  -> normalize naming and precedence
  -> resolve aliases
  -> emit runtime CSS variables
  -> emit documentation token JSON
  -> emit typed token data if needed
  -> map into provider/component tokens
  -> render through governed ps-* wrappers
```

Required normalization rules from the up-design-system notes:

| Source issue | Normalized value | Why |
| --- | --- | --- |
| `forground` | `foreground` | Correct known source typo before public artifacts are emitted. |
| `minus-4` | `900` | Converts nonstandard ramp naming into a predictable scale step. |
| `danger` | `error` | Aligns provider severity with public design-system status language. |

Open token decisions:

- whether `danger -> error` is permanent or only a compatibility shim;
- whether deprecated typography groups are still consumed;
- whether missing ramp endpoints are aliased, generated, or fixed in Figma;
- whether the PrimeNG preset should emit resolved values or `var(...)`
  references.

## Runtime Token Values To Capture

The candidate Button currently uses the token values already present in
`packages/tokens/src/tokens/themes.json`. These are the concrete values that
should be represented in Figma variables and Zeroheight token tables.

Validation note from July 15, 2026: these runtime values are the current
public-sector candidate values, not exact copies of the generated local
`D:\repos\up-design-system` token export. The local UP repository provides
semantic tokens such as `semantic.primary.background -> #1C6FA3`,
`semantic.primary.foreground -> #FFFFFF`, and
`semantic.primary.border-focus -> rgba(28, 111, 163, 0.25)`, then maps them
through the UP PrimeNG preset. The current `ps-up-button` wrapper uses a
public-sector `--ps-up-button-*` namespace and maps most values to this
repository's existing public-sector and PrimeNG tokens. Treat the current
values as candidate implementation evidence until the team decides whether the
Button should exactly adopt UP generated values or remain a public-sector theme
adaptation.

### Neutral Light

Selector: `:root`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#f8fafc` |
| `--ps-surface-card` | `#ffffff` |
| `--ps-surface-border` | `#e2e8f0` |
| `--ps-text-primary` | `#0f172a` |
| `--ps-text-secondary` | `#475569` |
| `--ps-primary-background` | `#1d4ed8` |
| `--ps-primary-foreground` | `#ffffff` |
| `--ps-focus-ring-color` | `#2563eb` |
| `--ps-danger-color` | `#dc2626` |
| `--ps-danger-text` | `#991b1b` |
| `--ps-success-color` | `#16a34a` |
| `--ps-success-text` | `#166534` |
| `--ps-warn-text` | `#92400e` |
| `--ps-action-text` | `#1d4ed8` |
| `--ps-button-background` | `#1d4ed8` |
| `--ps-button-text` | `#ffffff` |
| `--ps-radius-md` | `0.5rem` |
| `--ps-space-2` | `0.5rem` |
| `--ps-font-family` | `"Inter", "Segoe UI", Arial, sans-serif` |

### Vibrant Light

Selector: `:root.ps-theme-vibrant`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#f0f7ff` |
| `--ps-surface-card` | `#ffffff` |
| `--ps-surface-border` | `#bfdbfe` |
| `--ps-text-primary` | `#172554` |
| `--ps-text-secondary` | `#1e40af` |
| `--ps-primary-background` | `#7c3aed` |
| `--ps-primary-foreground` | `#ffffff` |
| `--ps-focus-ring-color` | `#06b6d4` |
| `--ps-danger-color` | `#e11d48` |
| `--ps-success-color` | `#059669` |
| `--ps-action-text` | `#5b21b6` |
| `--ps-button-background` | `#5b21b6` |
| `--ps-button-text` | `#ffffff` |

### Pastel Light

Selector: `:root.ps-theme-pastel`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#fff7ed` |
| `--ps-surface-card` | `#fffbf5` |
| `--ps-surface-border` | `#fed7aa` |
| `--ps-text-primary` | `#431407` |
| `--ps-text-secondary` | `#9a3412` |
| `--ps-primary-background` | `#fb7185` |
| `--ps-primary-foreground` | `#431407` |
| `--ps-focus-ring-color` | `#f9a8d4` |
| `--ps-danger-color` | `#f43f5e` |
| `--ps-success-color` | `#34d399` |
| `--ps-action-text` | `#9f1239` |
| `--ps-button-background` | `#be123c` |
| `--ps-button-text` | `#ffffff` |

### Neutral Dark

Selector: `:root.p-dark`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#020617` |
| `--ps-surface-card` | `#0f172a` |
| `--ps-surface-border` | `#334155` |
| `--ps-text-primary` | `#f8fafc` |
| `--ps-text-secondary` | `#cbd5e1` |
| `--ps-primary-background` | `#60a5fa` |
| `--ps-primary-foreground` | `#020617` |
| `--ps-focus-ring-color` | `#93c5fd` |
| `--ps-danger-color` | `#f87171` |
| `--ps-success-color` | `#4ade80` |
| `--ps-action-text` | `#93c5fd` |
| `--ps-button-background` | `#93c5fd` |
| `--ps-button-text` | `#020617` |

### Vibrant Dark

Selector: `:root.p-dark.ps-theme-vibrant`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#07031a` |
| `--ps-surface-card` | `#120a2e` |
| `--ps-surface-border` | `#4338ca` |
| `--ps-text-primary` | `#f5f3ff` |
| `--ps-text-secondary` | `#c4b5fd` |
| `--ps-primary-background` | `#22d3ee` |
| `--ps-primary-foreground` | `#07031a` |
| `--ps-focus-ring-color` | `#a78bfa` |
| `--ps-action-text` | `#67e8f9` |
| `--ps-button-background` | `#67e8f9` |
| `--ps-button-text` | `#07031a` |

### Pastel Dark

Selector: `:root.p-dark.ps-theme-pastel`

| Token | Value |
| --- | --- |
| `--ps-surface-background` | `#1f1a2e` |
| `--ps-surface-card` | `#2a2238` |
| `--ps-surface-border` | `#8b5cf6` |
| `--ps-text-primary` | `#fff7ed` |
| `--ps-text-secondary` | `#fbcfe8` |
| `--ps-primary-background` | `#f9a8d4` |
| `--ps-primary-foreground` | `#1f1a2e` |
| `--ps-focus-ring-color` | `#f0abfc` |
| `--ps-action-text` | `#fbcfe8` |
| `--ps-button-background` | `#fbcfe8` |
| `--ps-button-text` | `#1f1a2e` |

## Button Component Tokens

These PrimeNG-compatible component variables are currently defined in the
neutral light source and should be documented as the Button component token
contract:

| Token | Value |
| --- | --- |
| `--p-button-transition-duration` | `140ms` |
| `--p-button-border-radius` | `var(--ps-radius-md)` |
| `--p-button-padding-y` | `0.65rem` |
| `--p-button-padding-x` | `0.9rem` |
| `--p-button-gap` | `0.5rem` |
| `--p-button-label-font-weight` | `700` |
| `--p-button-primary-background` | `var(--p-primary-color)` |
| `--p-button-primary-hover-background` | `var(--p-primary-hover-color)` |
| `--p-button-primary-active-background` | `var(--p-primary-active-color)` |
| `--p-button-primary-border-color` | `var(--p-primary-color)` |
| `--p-button-primary-hover-border-color` | `var(--p-primary-hover-color)` |
| `--p-button-primary-active-border-color` | `var(--p-primary-active-color)` |
| `--p-button-primary-color` | `var(--p-primary-inverse-color)` |
| `--p-button-primary-hover-color` | `var(--p-primary-inverse-color)` |
| `--p-button-primary-active-color` | `var(--p-primary-inverse-color)` |
| `--p-button-primary-focus-ring-shadow` | `var(--p-focus-ring-shadow)` |
| `--p-button-outlined-primary-border-color` | `color-mix(in srgb, var(--p-primary-color) 70%, var(--p-content-border-color))` |
| `--p-button-outlined-primary-color` | `var(--ps-action-text)` |
| `--p-button-outlined-primary-hover-background` | `color-mix(in srgb, var(--p-primary-color) 10%, transparent)` |
| `--p-button-outlined-primary-active-background` | `color-mix(in srgb, var(--p-primary-color) 16%, transparent)` |
| `--p-button-text-primary-color` | `var(--ps-action-text)` |
| `--p-button-text-primary-hover-background` | `color-mix(in srgb, var(--p-primary-color) 10%, transparent)` |
| `--p-button-text-primary-active-background` | `color-mix(in srgb, var(--p-primary-color) 16%, transparent)` |
| `--p-button-secondary-background` | `var(--p-content-background)` |
| `--p-button-secondary-border-color` | `var(--p-content-border-color)` |
| `--p-button-secondary-color` | `var(--p-text-color)` |
| `--p-button-icon-only-width` | `2.5rem` |
| `--p-button-rounded-border-radius` | `999rem` |

The candidate `ps-up-button` consumes these variables directly where practical.
It still contains fallback values for resilience in isolated render contexts.
Those fallbacks are not intended to become the design source of truth.

## Candidate API

Import:

```ts
import { PublicUpButtonComponent } from '@public-sector/ui-patterns';
```

Usage:

```html
<ps-up-button
  label="Submit"
  tone="primary"
  appearance="solid"
  icon="check"
  (buttonClick)="save()"
/>
```

Inputs:

| Input | Type | Purpose |
| --- | --- | --- |
| `label` | `string` | Visible action label. |
| `icon` | `PublicUpButtonIcon \| undefined` | Provider-neutral icon name mapped internally to the current icon provider. |
| `tone` | `PublicUpButtonTone` | Provider-neutral action/status tone. |
| `appearance` | `'solid' \| 'outlined' \| 'text'` | Single controlled appearance API. |
| `disabled` | `boolean` | Prevents activation. |
| `loading` | `boolean` | Shows progress and prevents duplicate activation. |

Output:

| Output | Type | Purpose |
| --- | --- | --- |
| `buttonClick` | `MouseEvent` | Emits only when enabled and not loading. |

Approved tones:

- `primary`
- `secondary`
- `success`
- `info`
- `warning`
- `error`
- `help`
- `contrast`

The candidate intentionally avoids `warn` and `danger` in the public API.

## Storybook Steps

1. Open Storybook:

```bash
pnpm storybook:qa
```

2. Navigate to:

```text
Design System / Candidates / Button UP
```

3. Review these stories:

- `Primary`
- `Secondary`
- `Success`
- `Info`
- `Warning`
- `Error`
- `Help`
- `Contrast`
- `Outlined`
- `Text`
- `Loading`
- `Disabled`
- `LongLabel`
- `ToneMatrix`
- `AppearanceMatrix`

4. Use toolbar globals to review:

- neutral light;
- neutral dark;
- vibrant light;
- vibrant dark;
- pastel light;
- pastel dark.

5. Validate the static Storybook build and iframe checks:

```bash
pnpm nx run qa-remote:e2e
```

The e2e script validates:

```text
design-system-candidates-button-up--primary
```

## Figma Steps

Create a Button component set that mirrors the candidate API, not the legacy
`outlined` and `text` booleans.

Figma properties:

| Figma property | Candidate API |
| --- | --- |
| `Label` | `label` |
| `Tone` | `tone` |
| `Appearance` | `appearance` |
| `State: Disabled` | `disabled` |
| `State: Loading` | `loading` |
| `Icon` | `icon` |
| `Theme` | Storybook globals and token selectors |

Figma variable groups should include:

- primitives for color, radius, spacing, and typography;
- semantic color variables such as primary, action text, surface, text, success,
  warning, and error;
- component Button variables for background, foreground, border, hover, active,
  focus, radius, padding, gap, and label weight;
- theme modes for neutral, vibrant, pastel, light, and dark.

Figma component variants:

- tone: primary, secondary, success, info, warning, error, help, contrast;
- appearance: solid, outlined, text;
- state: default, hover, active, focus, disabled, loading;
- icon: none, leading icon;
- label: normal and long-label stress.

## Zeroheight Steps

Create:

```text
Candidates / Button UP
```

Recommended page sections:

1. Overview
   - status: Candidate;
   - component: `PublicUpButtonComponent`;
   - selector: `ps-up-button`;
   - eventual promotion target: `ps-button`.
2. Usage
   - when to use;
   - when not to use;
   - content guidance;
   - accessible name requirements.
3. Design
   - embedded Figma component set;
   - anatomy;
   - tone matrix;
   - appearance matrix;
   - state matrix.
4. Tokens
   - token source shape;
   - normalization rules;
   - theme token tables;
   - Button component token table.
5. Live implementation
   - embedded Storybook primary story;
   - links to tone matrix, appearance matrix, loading, disabled, and long label.
6. Developer API
   - import;
   - selector;
   - inputs;
   - output;
   - examples.
7. Testing evidence
   - Storybook static build;
   - static iframe e2e;
   - axe result;
   - future interaction tests.
8. Promotion decision
   - whether `ps-up-button` replaces `ps-button`;
   - migration path for current `outlined` and `text` usages;
   - icon API decision.

Suggested iframe URLs:

```text
/iframe.html?id=design-system-candidates-button-up--primary&viewMode=story&shortcuts=false&singleStory=true
/iframe.html?id=design-system-candidates-button-up--tone-matrix&viewMode=story&shortcuts=false&singleStory=true
/iframe.html?id=design-system-candidates-button-up--appearance-matrix&viewMode=story&shortcuts=false&singleStory=true
/iframe.html?id=design-system-candidates-button-up--loading&viewMode=story&shortcuts=false&singleStory=true
/iframe.html?id=design-system-candidates-button-up--disabled&viewMode=story&shortcuts=false&singleStory=true
/iframe.html?id=design-system-candidates-button-up--long-label&viewMode=story&shortcuts=false&singleStory=true
```

## Testing Steps

Current checks:

```bash
pnpm nx run ui-patterns:typecheck
pnpm nx run qa-remote:test
pnpm nx run qa-remote:build-storybook
pnpm nx run qa-remote:e2e
```

Next checks to add:

1. Storybook interaction test package.
2. `play` tests for click, disabled, loading, Enter, and Space activation.
3. Focus-visible assertion in light and dark modes.
4. Token resolution assertion for primary background and text color.
5. Contrast checks for every tone across every theme mode.
6. Visual regression after the Figma variables are considered stable.

## Promotion Criteria

Promote from Candidate only when:

- Figma component set is complete and reviewed;
- token values above are either aligned to the real up-design-system source or explicitly approved as a public-sector theme adaptation;
- normalization rules are accepted;
- `appearance` is accepted as the clean public API;
- `warning` and `error` are accepted as public tone names;
- Storybook and `/qa` both show the candidate;
- static Storybook e2e passes;
- accessibility checks are blocking;
- Zeroheight links Figma, Storybook, GitHub source, and test results;
- migration from existing `ps-button` is documented.

