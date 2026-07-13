# Token Consumption Recommendation

## Scope

The federated Web Component framework is assumed. This recommendation is about
how applications should consume design tokens inside that framework.

## Recommendation

Treat design tokens as a versioned runtime contract shared by the shell and each
remote application. The token package, or equivalent enterprise artifact, should
be the source of truth, not the shell and not Zeroheight.

The token package should produce:

- generated CSS custom properties for runtime styling;
- generated JSON metadata for documentation, tooling, and validation;
- optional derived TypeScript exports for tooling, tests, and framework
  integrations;
- a PrimeNG preset mapped from the same token values.

The shell or platform runtime should establish active theme context. Theme state
should be represented as stable classes or attributes on a shared ancestor such
as `html`, `body`, the shell root, or the Web Component host.

Each remote should be able to resolve the same token contract, either through a
direct dependency for isolated development or through shell-provided runtime
context when mounted. Remotes may inherit token values from the shell at
runtime, but they should not become shell-only applications.

PrimeNG should consume the tokens through the shared preset. Registry components
and application components should use semantic CSS variables and PrimeNG mapped
tokens instead of defining independent visual values.

The component registry should consume the same token contract and PrimeNG
preset. It should wrap PrimeNG only when it adds shared API consistency,
accessibility behavior, composition, or reusable domain patterns.

## Validation Priorities

The main implementation risk is not federation itself. The risk is whether the
token contract resolves across the actual DOM boundaries and overlay behavior of
the current implementation.

Validate:

- where token CSS is loaded by the shell;
- where token CSS is loaded or inherited by each remote;
- whether each Web Component renders light DOM or Shadow DOM;
- whether token values resolve on the shell root, Web Component host, and
  mounted remote content;
- whether Shadow DOM requires host-level CSS variable injection;
- whether theme changes update both shell and mounted remote token values;
- whether PrimeNG providers and the preset are registered for independently
  bootstrapped remotes;
- whether PrimeNG overlays appended under `body` or another container still
  receive the expected `--ps-*` and `--p-*` values;
- whether package versions can drift between shell and remotes.

## Current Sample Evidence

The sample repository now models this direction:

- `packages/tokens` owns token source files and generated artifacts.
- `packages/tokens/src/tokens.css` provides runtime CSS custom properties.
- `packages/tokens/src/design-tokens.json` and
  `packages/tokens/src/zeroheight-tokens.json` provide generated metadata.
- `packages/tokens/src/index.ts` exports derived data from generated artifacts
  instead of duplicating hardcoded token values.
- `packages/primeng-preset` maps from `@public-sector/tokens`.
- The shell and remotes import the generated token CSS.
- The shell and remotes share `@public-sector/tokens` through federation
  configuration.
- A Playwright spec validates shell token resolution, mounted remote token
  resolution, Web Component host token resolution, theme propagation, and
  PrimeNG overlay token context.

## Zeroheight Role

Zeroheight should document the token contract, usage guidance, examples, and
validation evidence. It should receive generated token metadata from the
repository. It should not be the runtime source of truth for application styling.
`remoteEntry` remains subapplication configuration, not Zeroheight content.

## Summary

The best consumption model is a shared, versioned token contract that emits CSS
custom properties, metadata, optional TypeScript exports, and a PrimeNG preset.
The shell or platform runtime establishes active theme context. Each remote
resolves the same contract inside and outside the shell. DOM boundaries,
overlays, and version drift are the critical validation points.
