import { Component, inject } from '@angular/core';
import { PublicToastService } from './public-toast.service';

@Component({
  selector: 'ps-toast',
  standalone: true,
  template: `
    <div class="ps-toast-region" aria-live="polite" aria-atomic="true">
      @for (message of toast.messages(); track message.id) {
        <article class="ps-toast" [attr.data-severity]="message.severity">
          <div>
            <strong>{{ message.summary }}</strong>
            @if (message.detail) {
              <p>{{ message.detail }}</p>
            }
          </div>
          <button type="button" aria-label="Dismiss notification" (click)="toast.remove(message.id)">x</button>
        </article>
      }
    </div>
  `,
  styles: `
    .ps-toast-region {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 2100;
      display: grid;
      gap: 0.75rem;
      width: min(24rem, calc(100vw - 2rem));
    }

    .ps-toast {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.75rem;
      align-items: start;
      padding: 1rem;
      border: 1px solid var(--p-content-border-color);
      border-left: 0.35rem solid var(--p-primary-color);
      border-radius: 0.5rem;
      background: var(--p-content-background);
      color: var(--p-text-color);
      box-shadow: var(--p-overlay-popover-shadow, 0 0.75rem 2rem color-mix(in srgb, #000 20%, transparent));
    }

    .ps-toast[data-severity='success'] {
      border-left-color: var(--p-green-500, #22c55e);
    }

    .ps-toast[data-severity='warn'] {
      border-left-color: var(--p-yellow-500, #f59e0b);
    }

    .ps-toast[data-severity='danger'] {
      border-left-color: var(--p-red-500, #ef4444);
    }

    strong,
    p {
      margin: 0;
    }

    p {
      margin-top: 0.25rem;
      color: var(--p-text-muted-color);
      line-height: 1.45;
    }

    button {
      border: 0;
      background: transparent;
      color: var(--p-text-muted-color);
      cursor: pointer;
      font: inherit;
    }
  `,
})
export class PublicToastComponent {
  readonly toast = inject(PublicToastService);
}
