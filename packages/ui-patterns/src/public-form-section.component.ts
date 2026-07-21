import { Component, input } from '@angular/core';

@Component({
  selector: 'ps-form-section, public-form-section',
  standalone: true,
  template: `
    <section class="form-card">
      <header>
        <h3>{{ title() }}</h3>
      </header>
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <div class="form-section">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .form-card {
      padding: 1.25rem;
      border: 1px solid var(--ps-surface-border);
      border-radius: 1.25rem;
      background: var(--ps-surface-card);
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 7%, transparent);
    }

    h3 {
      margin: 0 0 0.35rem;
      color: var(--ps-text-primary);
    }

    p {
      margin: 0 0 1rem;
      color: var(--ps-text-secondary);
    }

    .form-section {
      display: grid;
      gap: 1rem;
    }
  `,
})
export class PublicFormSectionComponent {
  readonly title = input.required<string>();
  readonly description = input('');
}
