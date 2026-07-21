import { Component, input, output } from '@angular/core';
import { PublicButtonComponent } from './public-button.component';

@Component({
  selector: 'ps-empty-state, public-empty-state',
  standalone: true,
  imports: [PublicButtonComponent],
  template: `
    <section class="empty-state">
      <i [class]="icon()" aria-hidden="true"></i>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <ps-button [label]="actionLabel()" appearance="outlined" (activated)="activated.emit()" />
      }
    </section>
  `,
  styles: `
    .empty-state {
      display: grid;
      gap: 0.75rem;
      justify-items: center;
      padding: 2rem;
      border: 1px dashed var(--ps-surface-border);
      border-radius: 1rem;
      background: var(--ps-surface-card);
      text-align: center;
    }

    i {
      color: var(--ps-primary-background);
      font-size: 2rem;
    }

    h3,
    p {
      margin: 0;
    }

    p {
      color: var(--ps-text-secondary);
    }
  `,
})
export class PublicEmptyStateComponent {
  readonly icon = input('pi pi-inbox');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input('');
  readonly activated = output<void>();
}
