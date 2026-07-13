# PrimeNG Binding Audit

## Scope

This document explains how token values should reach PrimeNG components in the
sanitized public-sector architecture.

The intended contract is:

```text
Figma or token source
  -> normalized token package
  -> runtime CSS custom properties
  -> generated TypeScript token exports
  -> PrimeNG preset mapping
  -> registry wrappers
  -> shell and federated remotes
```

<span style="color: #b00020"><strong>Red note:</strong></span>
This document describes the desired binding model. It does not prove that a
separate enterprise shell, remote bootstrap, Shadow DOM host, or overlay
container already behaves this way.

## Token Source To Runtime Artifacts

The token package should emit both CSS and programmatic artifacts from the same
resolved token model.

Example generated CSS:

```css
:root {
  --semantic-primary-background: #1c6fa3;
  --semantic-primary-foreground: #ffffff;
  --semantic-surface-background: #ffffff;
}

.p-dark {
  --semantic-surface-background: #202122;
}
```

Example generated TypeScript:

```ts
export const light = {
  'semantic.primary.background': '#1c6fa3',
  'semantic.primary.foreground': '#ffffff',
};
```

The CSS artifact supports runtime inheritance. The TypeScript artifact supports
mapping into framework integrations such as the PrimeNG preset.

## PrimeNG Preset Mapping

PrimeNG should receive system tokens through an approved preset, not through
ad hoc component CSS.

Example mapping:

```ts
import { light } from '@public-sector/tokens';

export function primaryButtonRole() {
  return {
    background: light['semantic.primary.background'],
    color: light['semantic.primary.foreground'],
    borderColor: light['semantic.primary.background'],
  };
}
```

The preset is the translation layer from design-system token names into PrimeNG
semantic and component token names.

## CSS Variables Versus Resolved Values

There are two valid implementation choices:

- Resolved values: the preset contains concrete values such as `#1c6fa3`.
  This is simple and predictable, but dynamic theme changes depend on generated
  theme output.
- CSS variable references: the preset contains values such as
  `var(--semantic-primary-background)`. This gives better runtime theme
  flexibility, but requires careful validation with PrimeNG styled mode.

The public-sector sample should be explicit about which option it models.

<span style="color: #b00020"><strong>Red note:</strong></span>
Avoid claiming that PrimeNG reads CSS variables at runtime if the preset is
actually generated with resolved hex values. Both approaches can work, but they
are different mechanisms and should not be blurred.

## Shell And Remote Provider Setup

The shell or platform runtime should establish the active theme context, usually
through a class or attribute on a shared ancestor such as `html`, `body`, the
shell root, or the Web Component host.

Each independently bootstrapped Angular remote must also have access to the
approved PrimeNG configuration. That can happen through shared bootstrap code,
remote-local provider registration, or another platform-provided setup.

Example shell bootstrap:

```ts
import { providePrimeNG } from 'primeng/config';
import preset from '@public-sector/primeng-preset';

bootstrapApplication(AppComponent, {
  providers: [
    providePrimeNG({
      theme: {
        preset,
        options: { darkModeSelector: '.p-dark' },
      },
    }),
  ],
});
```

<span style="color: #b00020"><strong>Red note:</strong></span>
Do not assume the shell's Angular provider automatically configures a separately
bootstrapped remote Web Component. Confirm the actual runtime injector boundary.

## Wrapper Rendering Path

Registry wrappers should delegate rendering to PrimeNG internally while keeping
PrimeNG out of the public application API.

```text
Application or remote
  -> imports PsButtonComponent from @public-sector/ui-patterns
  -> wrapper renders internal PrimeNG button
  -> PrimeNG reads the approved preset
  -> styles resolve from generated token values and/or CSS variables
```

The wrapper should not hardcode token values:

```ts
// Avoid this pattern.
template: `
  <p-button
    [style.background]="'var(--semantic-primary-background)'"
    [label]="label"
  />
`
```

The wrapper should pass design-system intent to PrimeNG:

```ts
template: `
  <p-button
    [label]="label"
    [severity]="mappedSeverity"
    [disabled]="disabled"
  />
`
```

## Shadow DOM And Overlay Validation

CSS custom properties can inherit into Shadow DOM through the host, but global
selectors and PrimeNG styled-mode selectors do not cross the Shadow DOM boundary.
That makes DOM strategy a required validation item.

PrimeNG overlays need separate validation because dialogs, menus, tooltips, and
select panels may render under `body` or a global overlay container rather than
inside the remote host.

Validate:

- token variables resolve on `html` or `body`;
- token variables resolve on the Web Component host;
- token variables resolve inside light DOM remotes;
- token variables resolve inside Shadow DOM remotes, if used;
- PrimeNG overlay elements receive the expected theme values;
- dark mode changes update shell content, mounted remotes, and overlays.

<span style="color: #b00020"><strong>Red note:</strong></span>
If Shadow DOM is used, host-level CSS variable injection may be required. If
overlays are appended outside the remote host, overlay theming must be tested
from the actual rendered DOM, not assumed from local component behavior.

## Validation Checklist

- Token CSS is loaded before shell and remote UI render.
- PrimeNG preset is generated from the same token source.
- PrimeNG provider setup is confirmed for every independently bootstrapped app.
- A registry wrapper renders a PrimeNG component with the approved preset.
- Light and dark theme states are tested.
- Overlay theme inheritance is tested.
- Shadow DOM behavior is tested if any remote uses Shadow DOM.
- Tests distinguish runtime performance and styling behavior from E2E test
  runner overhead.
