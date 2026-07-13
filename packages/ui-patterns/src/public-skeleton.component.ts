import { Component, input } from '@angular/core';

@Component({
  selector: 'ps-skeleton',
  standalone: true,
  template: `<span class="ps-skeleton" aria-hidden="true" [style.height]="height()"></span>`,
  styles: `
    :host,
    .ps-skeleton {
      display: block;
      width: 100%;
    }

    .ps-skeleton {
      min-height: 1rem;
      border-radius: 0.5rem;
      background: linear-gradient(
        90deg,
        var(--p-content-border-color),
        color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-content-background)),
        var(--p-content-border-color)
      );
      background-size: 200% 100%;
      animation: ps-skeleton-pulse 1.4s ease-in-out infinite;
    }

    @keyframes ps-skeleton-pulse {
      from {
        background-position: 100% 0;
      }
      to {
        background-position: -100% 0;
      }
    }
  `,
})
export class PublicSkeletonComponent {
  readonly height = input('1rem');
}
