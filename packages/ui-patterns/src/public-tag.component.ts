import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

export type PublicTagTone = 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'error' | 'secondary' | 'contrast';

type PrimeTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'ps-tag',
  standalone: true,
  imports: [TagModule],
  template: `<p-tag [value]="value()" [severity]="mappedSeverity()" />`,
})
export class PublicTagComponent {
  readonly value = input.required<string>();
  readonly tone = input<PublicTagTone>('info');

  mappedSeverity(): PrimeTagSeverity {
    switch (this.tone()) {
      case 'warning':
        return 'warn';
      case 'error':
        return 'danger';
      default:
        return this.tone() as PrimeTagSeverity;
    }
  }
}
