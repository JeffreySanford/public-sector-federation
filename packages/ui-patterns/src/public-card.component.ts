import { Component, input } from '@angular/core';

@Component({
  selector: 'ps-card',
  standalone: true,
  template: `
    <section class="ps-card">
      @if (header() || subheader()) {
        <header class="ps-card__header">
          @if (header()) {
            <h2>{{ header() }}</h2>
          }
          @if (subheader()) {
            <p>{{ subheader() }}</p>
          }
        </header>
      }
      <div class="ps-card__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .ps-card {
      display: grid;
      gap: 1rem;
      height: 100%;
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 0.5rem;
      background: var(--p-content-background);
      color: var(--p-text-color);
      box-shadow: var(--p-card-shadow, none);
    }

    .ps-card__header {
      display: grid;
      gap: 0.25rem;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 1.125rem;
      line-height: 1.3;
    }

    p {
      color: var(--p-text-muted-color);
      line-height: 1.5;
    }

    .ps-card__body {
      display: grid;
      gap: 1rem;
    }
  `,
})
export class PublicCardComponent {
  readonly header = input('');
  readonly subheader = input('');
}
