# Up Design System Change Log

## Purpose

This file captures lightweight decisions and cleanup notes that come from design
system implementation conversations. Keep entries sanitized, dated, and tied to
an implementation impact so they can be reconciled later with source control,
Zeroheight, or the authoritative token source.

## 2026-07-13: PrimeNG Wrapper Boundary

Apps and remotes should no longer consume PrimeNG directly. PrimeNG remains an
internal implementation detail of the shared wrapper package and preset package.

Implementation impact:

- Application code imports shared wrappers from the governed UI package.
- Direct `primeng/*` imports are blocked outside approved integration packages.
- Direct `<p-*>` templates, PrimeNG template directives, and app-level `.p-*`
  styling are blocked by lint.
- Feedback services use a shared toast abstraction rather than PrimeNG
  `MessageService` in apps and remotes.

Approved integration boundaries:

- `packages/ui-patterns`
- `packages/primeng-preset`
- token package output where global theme selectors are generated

## 2026-07-13: Deprecated Token Artifacts

Old bootstrap artifacts that appeared to reference deprecated token material
were confirmed as no longer needed. Treat these as pre-PrimeNG bootstrap output,
not current token source-of-truth.

Implementation impact:

- Do not document old bootstrap artifacts as active token inputs.
- If a scan finds `deprecated` in generated or mapping output, verify whether it
  comes from old bootstrap scripts before treating it as live design guidance.
- Current token decisions should be traced to the active token source and token
  build pipeline.

Open follow-up:

- Add a token audit note when the authoritative source confirms which typography
  or status tokens are active, aliases, or retired.

## 2026-07-13: Zeroheight Onboarding Status

The Zeroheight TSP request was expected to complete by the next SLA date, with
contract completion following after that.

Implementation impact:

- Keep Zeroheight documentation content ready, but avoid treating publish steps
  as unblocked until access and contract setup are complete.
- Continue using local markdown and Storybook evidence as the working source
  until Zeroheight publishing is available.

## 2026-07-13: Component And Token Prefix

The preferred component and CSS variable prefix is `cmds`, not `fm`.

Rationale:

- `cmds` aligns with the design-system/repository naming direction.
- The `fm` prefix was incidental and should not drive new API names.

Implementation impact:

- New component selectors should use the approved `cmds` naming in the real
  implementation.
- New CSS variables should use the same prefix for consistency.
- Existing `fm` names should be treated as migration candidates unless a
  compatibility requirement says otherwise.

For this sanitized sample repo, the equivalent concept is the `ps` prefix used
by public-sector wrapper examples.
