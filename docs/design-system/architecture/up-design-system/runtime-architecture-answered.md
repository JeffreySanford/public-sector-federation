# Runtime Architecture Answered

## Scope

This note records runtime behavior inferred from the reviewed architecture
screenshots. It narrows the remaining design-system questions to token mapping,
wrapper API shape, normalization, and validation acceptance.

<span style="color: #b00020"><strong>Red note:</strong></span>
These conclusions should be confirmed against the actual source repo before
being treated as implementation proof.

## Runtime Findings

| Runtime area | Answer |
| --- | --- |
| Remote shape | Each remote module is exposed as a Web Component custom element. |
| DOM model | Remotes mount in light DOM, not Shadow DOM. |
| Token inheritance | Root CSS variables cascade into remotes automatically. |
| Theme selector | `.p-dark` is applied on `html`. |
| Overlay target | PrimeNG overlays append to `body`. |
| Angular bootstrap | Each remote bootstraps its own Angular application. |
| PrimeNG provider | Each remote needs approved PrimeNG setup unless shared bootstrap code handles it. |

## What This Answers

- Theme switching can work through normal CSS cascade from `html`.
- Light DOM remotes can inherit `:root` token variables without host-level
  Shadow DOM injection.
- Overlays appended to `body` can inherit root-level token and theme context.
- Remote apps should be able to run independently if they load the same token
  CSS and register the same PrimeNG preset.
- The provider boundary is per remote because each remote owns an Angular
  bootstrap.

## What Still Needs A Decision

### Wrapper API Shape

PrimeNG is always wrapped. The remaining question is how wrapper APIs should be
designed:

- strict design-system API;
- thin normalized pass-through;
- tiered model depending on component complexity.

### Token Normalization

The token build can normalize export issues, but the team still needs to decide
which normalizations are permanent design-system decisions:

- `danger` to `error`;
- deprecated typography cleanup;
- hard-coded compatibility corrections;
- missing ramp endpoint aliases.

### Validation Acceptance

The runtime model is clear enough to test, but the acceptance bar still needs to
be set:

- build and typecheck only;
- wrapper unit tests;
- playground or Storybook examples;
- shell-mounted remote validation;
- Playwright checks;
- one overlay component in the first proof or later.

## Practical Next Step

The next useful proof should be small:

1. Implement one wrapper, such as Button, using the approved API direction.
2. Confirm the wrapper does not expose PrimeNG types publicly.
3. Register the approved PrimeNG preset in the remote bootstrap.
4. Validate light and dark token resolution through `html.p-dark`.
5. Add one overlay wrapper, such as Dialog or Select, only if first-pass
   validation includes overlays.
