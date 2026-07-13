# Wrapper Pattern Validation

## Scope

This document validates the proposed component-registry wrapper pattern for the
sanitized public-sector architecture.

The relevant enterprise constraint is modeled as:

> Registry components wrap PrimeNG so application teams consume a governed
> design-system API instead of directly depending on PrimeNG APIs.

<span style="color: #b00020"><strong>Red note:</strong></span>
This is stricter than some earlier public-sector docs that allowed direct
PrimeNG usage. Keep this note scoped to the wrapper-first design-system model
unless the broader docs are updated to match that same constraint.

## Current State: Direct PrimeNG Usage

The simplest Angular usage imports PrimeNG directly:

```ts
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  imports: [ButtonModule, CardModule, DialogModule],
  template: `
    <p-button label="Submit" />
    <p-card>Content</p-card>
    <p-dialog [(visible)]="dialogVisible">...</p-dialog>
  `,
})
export class DashboardComponent {}
```

That proves the PrimeNG preset can work, but it exposes PrimeNG as the
application contract.

Risks:

- application teams bind directly to PrimeNG component names;
- application teams bind directly to PrimeNG input and output names;
- a future component-provider swap requires application changes;
- shared accessibility, telemetry, defaults, and usage constraints are harder to
  enforce consistently.

## Target State: Registry Wrapper Usage

Applications and remotes import registry wrappers:

```ts
import { PsButtonComponent } from '@public-sector/ui-patterns';

@Component({
  imports: [PsButtonComponent],
  template: `
    <ps-button
      label="Submit"
      tone="primary"
      (buttonClick)="handleSubmit()"
    />
  `,
})
export class DashboardComponent {
  handleSubmit() {}
}
```

The wrapper imports PrimeNG internally:

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent as PrimeNgButton } from 'primeng/button';

type ButtonTone = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

@Component({
  selector: 'ps-button',
  standalone: true,
  imports: [PrimeNgButton],
  template: `
    <p-button
      [label]="label"
      [severity]="mappedSeverity"
      [disabled]="disabled"
      [loading]="loading"
      (onClick)="buttonClick.emit()"
    />
  `,
})
export class PsButtonComponent {
  @Input() label = '';
  @Input() tone: ButtonTone = 'primary';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() buttonClick = new EventEmitter<void>();

  get mappedSeverity(): ButtonTone {
    return this.tone;
  }
}
```

## Public API Boundary

The registry package should export design-system components and types:

```ts
export { PsButtonComponent } from './button/button.component';
export type { ButtonTone } from './button/button.types';
```

It should not re-export PrimeNG implementation details:

```ts
// Do not expose these from the registry package.
export { ButtonComponent } from 'primeng/button';
export { ButtonModule } from 'primeng/button';
export type { ButtonProps } from 'primeng/button';
```

The wrapper API should describe design-system intent, not PrimeNG mechanics.

| Public wrapper API | Avoid leaking |
| --- | --- |
| `tone` | PrimeNG-specific severity type. |
| `disabled` | PrimeNG-specific config object. |
| `loading` | PrimeNG-specific event type. |
| `buttonClick` | PrimeNG `onClick` event object unless intentionally normalized. |

<span style="color: #b00020"><strong>Red note:</strong></span>
Avoid naming an Angular output `click` unless the team intentionally wants to
shadow the native DOM click event. A wrapper-specific output such as
`buttonClick` is less ambiguous.

## Token Consumption

Wrappers should consume the token contract indirectly:

```text
@public-sector/tokens
  -> @public-sector/primeng-preset
  -> PrimeNG provider setup
  -> internal PrimeNG component
  -> registry wrapper public API
```

Wrapper CSS can use semantic CSS variables for wrapper-owned layout or spacing:

```css
:host {
  display: inline-block;
}

.button-label {
  gap: var(--ps-space-2);
}
```

Wrappers should not define independent visual values that duplicate token values.

## Provider And Runtime Responsibilities

The wrapper package does not own the entire runtime setup. The shell, platform
runtime, or independently bootstrapped remote must ensure the approved PrimeNG
preset is registered.

Responsibilities:

| Layer | Responsibility |
| --- | --- |
| Token package | Owns source values and generated artifacts. |
| PrimeNG preset package | Maps tokens into PrimeNG semantic/component tokens. |
| Registry wrapper package | Hides PrimeNG behind stable design-system APIs. |
| Shell/platform runtime | Establishes active theme context and provider setup. |
| Remote app | Consumes wrappers and resolves the same token contract inside and outside the shell. |

<span style="color: #b00020"><strong>Red note:</strong></span>
Do not say "no extra setup is needed in remotes" until the actual federated
runtime proves provider sharing, token CSS loading, theme propagation, and
overlay behavior.

## Swap Scenario

If PrimeNG is replaced later, the public wrapper API should remain stable:

```text
Before:
  app -> <ps-button> -> internal PrimeNG button

After:
  app -> <ps-button> -> internal replacement button
```

Application teams should not need to change imports, selectors, inputs, or
outputs if the wrapper API was designed correctly.

## Validation Checklist

- Wrapper package builds successfully.
- Wrapper package typechecks successfully.
- Public exports do not re-export PrimeNG components, modules, or types.
- Wrapper inputs and outputs use design-system naming.
- Input mapping is covered by unit tests.
- Events are normalized and covered by unit tests.
- Wrapper renders with the approved PrimeNG preset.
- Wrapper renders in isolated development outside the shell.
- Wrapper renders when mounted through the shell.
- Theme changes propagate to the wrapper and internal PrimeNG component.
- PrimeNG overlays opened by wrapper components inherit the expected theme.
- Shadow DOM behavior is validated if a remote uses Shadow DOM.

<span style="color: #b00020"><strong>Red note:</strong></span>
Draft unit tests are not evidence until they are wired into the repo's test
runner and executed in CI or locally with recorded output.
