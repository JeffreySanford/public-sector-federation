import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'ps-page-header, public-page-header',
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
      border: 1px solid var(--ps-surface-border);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--ps-primary-background) 22%, transparent), transparent 34rem),
        linear-gradient(135deg, var(--ps-surface-card), color-mix(in srgb, var(--ps-surface-card) 82%, var(--ps-primary-background)));
      box-shadow: 0 1.25rem 3rem color-mix(in srgb, var(--ps-text-primary) 10%, transparent);
    }

    .page-header::before {
      position: absolute;
      inset: auto -4rem -6rem auto;
      width: 14rem;
      height: 14rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--ps-primary-background) 18%, transparent);
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
      color: var(--ps-text-secondary);
    }
  `,
})
export class PublicPageHeaderComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
