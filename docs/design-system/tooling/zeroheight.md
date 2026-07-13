# Zeroheight

Zeroheight should be the governed design-system reference for guidance, status,
ownership, and evidence.

It is a communication and governance surface, not a runtime dependency.

## Current Status

Procurement has been reported as approved in principle. Before Zeroheight can be
treated as an operational publishing channel, it still needs to be registered in
the required asset registries and compliance tracking processes. Until that is
complete, local markdown and Storybook remain the working documentation and
validation surfaces.

Practical implication:

- Prepare Zeroheight-ready content now.
- Do not block code validation on Zeroheight publishing access.
- Do not describe Zeroheight as the source of truth for runtime behavior.
- Do not describe Zeroheight as a token creation source.
- Do not describe a Figma -> Zeroheight -> token input workflow unless that
  workflow is explicitly established later.
- Treat the repository, token build, Storybook, and shell e2e tests as the
  current evidence package.

## Zeroheight Should Contain

- When to use a component or pattern
- Approved variants
- Accessibility guidance
- Lifecycle status
- Ownership
- Migration guidance
- Release notes
- Links to Storybook, shell validation, source, and Figma references

## Zeroheight Should Document For Tokens

Zeroheight should receive generated token documentation artifacts from the repo,
not hand-maintained token values. Figma is the known design input, and the token
pipeline should consume a Figma-backed DTCG-compatible JSON artifact before
generating runtime CSS variables, PrimeNG preset values, and documentation
exports such as `zeroheight-tokens.json`.

Zeroheight token pages should explain:

- Token purpose and semantic usage
- Light and dark mode examples
- Alias or deprecated-token status when confirmed
- Which package or build artifact generated the token
- Links to the source token files and build validation
- Known migration notes from older bootstrap artifacts

If a scan finds references to deprecated token material, verify whether those
references come from old bootstrap or mapping artifacts before treating them as
active design guidance.

## Zeroheight Should Document For Components

Component documentation should describe the governed wrapper API, not the
underlying PrimeNG implementation. PrimeNG is an internal implementation detail
behind strict wrappers.

Component pages should include:

- Approved wrapper selector and inputs
- Usage guidance and anti-patterns
- Accessibility notes and keyboard behavior
- Variant/state examples
- Migration guidance from direct PrimeNG usage
- Storybook evidence links
- Shell or remote validation links when behavior depends on federation

For the sanitized sample repo, the examples use the `ps` prefix. In the real
implementation, use the approved design-system prefix, currently `cmds`.

## Zeroheight Should Not Own

- Runtime tokens
- `remoteEntry` URLs
- Shell mounting
- Application routing
- Component implementation
- PrimeNG preset generation
- Automatic governance promotion

Automation may be useful later, but promotion should remain a governance
decision backed by evidence, not only a build result.

## Evidence Before Publishing

Before a Zeroheight page is treated as approved guidance, it should point to
evidence that the pattern works in the actual delivery model:

- Storybook story for isolated behavior
- Shell or remote e2e coverage for federated behavior
- Token build output for token references
- Accessibility check for visible states
- Source link for the wrapper or token definition

This is especially important for overlay, toast, dialog, table, and form
patterns because they can fail differently when rendered inside a federated
custom-element remote.

## Related Architecture Reviews

External target-state architecture reviews, such as Desktop Underwriter
integration with pricing, should only affect Zeroheight content when they add
or change UI-facing patterns. Backend-only or data-orchestration changes do not
reopen the design-system runtime architecture.

If a target-state architecture introduces new loan-import, pricing, exception,
or pipeline states, those states should be captured as Storybook examples and
Zeroheight guidance candidates.
