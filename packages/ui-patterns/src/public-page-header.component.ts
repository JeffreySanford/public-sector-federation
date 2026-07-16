import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'public-page-header',
  standalone: true,
  imports: [TagModule],
  template: `
    <header class="page-header">
      <div class="page-header__content">
        @if (eyebrow()) {
          <p-tag [value]="eyebrow()" severity="info" />
        }
        <h2>{{ title() }}</h2>
        @if (description()) {
          <p>{{ description() }}</p>
        }
      </div>
      <div class="page-header__actions"><ng-content select="[public-page-header-actions]" /></div>
    </header>
  `,
  styles: `
    .page-header {
      position: relative;
      overflow: hidden;
      padding: 1.5rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--p-primary-color) 22%, transparent), transparent 34rem),
        linear-gradient(135deg, var(--p-content-background), color-mix(in srgb, var(--p-content-background) 82%, var(--p-primary-color)));
      box-shadow: 0 1.25rem 3rem color-mix(in srgb, var(--ps-text-primary) 10%, transparent);
    }

    .page-header::before {
      position: absolute;
      inset: auto -4rem -6rem auto;
      width: 14rem;
      height: 14rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--p-primary-color) 18%, transparent);
      content: '';
    }

    .page-header__content {
      position: relative;
      z-index: 1;
    }

    .page-header__actions {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin-top: 1rem;
    }

    h2 {
      max-width: 58rem;
      margin: 0.75rem 0 0.25rem;
      font-size: clamp(1.75rem, 3vw, 2.75rem);
      letter-spacing: -0.04em;
    }

    p {
      max-width: 56rem;
      margin: 0;
      color: var(--p-text-muted-color);
    }
  `,
})
export class PublicPageHeaderComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
