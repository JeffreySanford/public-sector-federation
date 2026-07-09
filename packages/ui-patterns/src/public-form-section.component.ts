import { Component, input } from '@angular/core';

@Component({
  selector: 'public-form-section',
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
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 7%, transparent);
    }

    h3 {
      margin: 0 0 0.35rem;
      color: var(--p-text-color);
    }

    p {
      margin: 0 0 1rem;
      color: var(--p-text-muted-color);
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
