import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

export type PublicStatusCardTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'contrast';

@Component({
  selector: 'ps-status-card, public-status-card',
  standalone: true,
  imports: [TagModule],
  template: `
    <article class="status-card">
      <div class="status-card__accent" aria-hidden="true"></div>
      <div class="status-card__body">
        <span class="status-card__label">{{ label() }}</span>
        <strong>{{ value() }}</strong>
        <span class="status-card__detail">{{ detail() }}</span>
        @if (status()) {
          <p-tag [value]="status()" [severity]="providerSeverity()" />
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .status-card {
      position: relative;
      overflow: hidden;
      min-height: 12rem;
      border: 1px solid var(--ps-surface-border);
      border-radius: 1.25rem;
      background:
        linear-gradient(160deg, color-mix(in srgb, var(--ps-surface-card) 94%, var(--ps-primary-background)), var(--ps-surface-card));
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 8%, transparent);
    }

    .status-card__accent {
      position: absolute;
      inset: 0 0 auto;
      height: 0.35rem;
      background: linear-gradient(90deg, var(--ps-primary-background), var(--ps-focus-ring-color));
    }

    .status-card__body {
      display: grid;
      gap: 0.5rem;
      padding: 1.25rem;
    }

    .status-card__label {
      color: var(--ps-text-secondary);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    strong {
      display: block;
      color: var(--ps-text-primary);
      font-size: clamp(2rem, 4vw, 3rem);
      letter-spacing: -0.06em;
    }

    .status-card__detail {
      display: block;
      margin-bottom: 0.75rem;
      color: var(--ps-text-secondary);
    }
  `,
})
export class PublicStatusCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly detail = input('');
  readonly status = input('');
  readonly tone = input<PublicStatusCardTone>('info');
  protected readonly providerSeverity = computed(() => {
    const tone = this.tone();
    if (tone === 'neutral') return 'secondary';
    if (tone === 'warning') return 'warn';
    if (tone === 'error') return 'danger';
    return tone;
  });
}
