import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'public-empty-state',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <section class="empty-state">
      <i [class]="icon()" aria-hidden="true"></i>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <p-button [label]="actionLabel()" [outlined]="true" />
      }
    </section>
  `,
  styles: `
    .empty-state {
      display: grid;
      gap: 0.75rem;
      justify-items: center;
      padding: 2rem;
      border: 1px dashed var(--p-content-border-color);
      border-radius: 1rem;
      background: var(--p-content-background);
      text-align: center;
    }

    i {
      color: var(--p-primary-color);
      font-size: 2rem;
    }

    h3,
    p {
      margin: 0;
    }

    p {
      color: var(--p-text-muted-color);
    }
  `,
})
export class PublicEmptyStateComponent {
  readonly icon = input('pi pi-inbox');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input('');
}
