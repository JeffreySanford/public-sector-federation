import { Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'ps-progress',
  standalone: true,
  template: `<progress [value]="value()" max="100" [attr.aria-label]="ariaLabel()"></progress>`,
  styles: `
    :host,
    progress {
      display: block;
      width: 100%;
    }

    progress {
      height: 0.75rem;
      accent-color: var(--ps-button-background, var(--p-primary-color));
    }
  `,
})
export class PublicProgressComponent {
  readonly value = input(0, { transform: numberAttribute });
  readonly ariaLabel = input('Progress');
}
