import { Component, computed, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'ps-progress',
  standalone: true,
  template: `<progress [value]="boundedValue()" max="100" [attr.aria-label]="ariaLabel()"></progress>`,
  styles: `
    :host,
    progress {
      display: block;
      width: 100%;
    }

    progress {
      height: 0.75rem;
      accent-color: var(--ps-button-background, var(--ps-primary-background));
    }
  `,
})
export class PublicProgressComponent {
  readonly value = input(0, { transform: numberAttribute });
  readonly ariaLabel = input('Progress');
  protected readonly boundedValue = computed(() => Math.min(100, Math.max(0, this.value())));
}
