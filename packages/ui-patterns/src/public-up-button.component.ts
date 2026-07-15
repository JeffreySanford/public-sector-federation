import { booleanAttribute, Component, input, output } from '@angular/core';

export type PublicUpButtonTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'help'
  | 'contrast';

export type PublicUpButtonAppearance = 'solid' | 'outlined' | 'text';

@Component({
  selector: 'ps-up-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="up-button"
      [attr.data-tone]="tone()"
      [attr.data-appearance]="appearance()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <span class="up-button__spinner" aria-hidden="true"></span>
      } @else if (icon()) {
        <span class="up-button__icon" [class]="icon()" aria-hidden="true"></span>
      }
      <span class="up-button__label">{{ label() }}</span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      max-width: 100%;
    }

    .up-button {
      --up-button-bg: var(--ps-button-background, var(--ps-primary-background, #1d4ed8));
      --up-button-fg: var(--ps-button-text, var(--ps-primary-foreground, #ffffff));
      --up-button-border: var(--up-button-bg);
      --up-button-hover-bg: var(--p-primary-hover-color, color-mix(in srgb, var(--up-button-bg) 88%, #000));
      --up-button-active-bg: var(--p-primary-active-color, color-mix(in srgb, var(--up-button-bg) 80%, #000));
      --up-button-focus: var(--p-focus-ring-shadow, 0 0 0 0.2rem color-mix(in srgb, var(--ps-focus-ring-color, #2563eb) 24%, transparent));

      display: inline-flex;
      min-height: 2.625rem;
      max-width: 100%;
      align-items: center;
      justify-content: center;
      gap: var(--p-button-gap, var(--ps-space-2, 0.5rem));
      padding: var(--p-button-padding-y, 0.65rem) var(--p-button-padding-x, 0.9rem);
      border: 1px solid var(--up-button-border);
      border-radius: var(--p-button-border-radius, var(--ps-radius-md, 0.5rem));
      background: var(--up-button-bg);
      color: var(--up-button-fg);
      font-family: var(--ps-font-family, "Inter", "Segoe UI", Arial, sans-serif);
      font-size: 0.95rem;
      font-weight: var(--p-button-label-font-weight, 700);
      line-height: 1.2;
      text-align: center;
      text-decoration: none;
      transition:
        background-color var(--p-button-transition-duration, 140ms),
        border-color var(--p-button-transition-duration, 140ms),
        color var(--p-button-transition-duration, 140ms),
        box-shadow var(--p-button-transition-duration, 140ms);
      cursor: pointer;
    }

    .up-button:hover:not(:disabled) {
      background: var(--up-button-hover-bg);
      border-color: var(--up-button-hover-bg);
    }

    .up-button:active:not(:disabled) {
      background: var(--up-button-active-bg);
      border-color: var(--up-button-active-bg);
    }

    .up-button:focus-visible {
      outline: var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, #2563eb);
      outline-offset: var(--p-focus-ring-offset, 2px);
      box-shadow: var(--up-button-focus);
    }

    .up-button:disabled {
      opacity: 0.58;
      cursor: not-allowed;
    }

    .up-button[data-appearance='outlined'] {
      background: transparent;
      color: var(--up-button-bg);
    }

    .up-button[data-appearance='outlined']:hover:not(:disabled) {
      background: color-mix(in srgb, var(--up-button-bg) 10%, transparent);
      color: var(--up-button-bg);
    }

    .up-button[data-appearance='outlined']:active:not(:disabled) {
      background: color-mix(in srgb, var(--up-button-bg) 16%, transparent);
      color: var(--up-button-bg);
    }

    .up-button[data-appearance='text'] {
      border-color: transparent;
      background: transparent;
      color: var(--up-button-bg);
    }

    .up-button[data-appearance='text']:hover:not(:disabled) {
      background: color-mix(in srgb, var(--up-button-bg) 10%, transparent);
      border-color: transparent;
    }

    .up-button[data-appearance='text']:active:not(:disabled) {
      background: color-mix(in srgb, var(--up-button-bg) 16%, transparent);
      border-color: transparent;
    }

    .up-button[data-tone='secondary'] {
      --up-button-bg: var(--p-content-background, #ffffff);
      --up-button-fg: var(--p-text-color, #0f172a);
      --up-button-border: var(--p-content-border-color, #e2e8f0);
      --up-button-hover-bg: color-mix(in srgb, var(--p-content-background, #ffffff) 84%, var(--ps-primary-background, #1d4ed8));
      --up-button-active-bg: color-mix(in srgb, var(--p-content-background, #ffffff) 76%, var(--ps-primary-background, #1d4ed8));
    }

    .up-button[data-tone='success'] {
      --up-button-bg: var(--ps-success-color, #16a34a);
      --up-button-fg: #ffffff;
    }

    .up-button[data-tone='info'] {
      --up-button-bg: var(--p-primary-color, var(--ps-primary-background, #1d4ed8));
      --up-button-fg: var(--p-primary-inverse-color, #ffffff);
    }

    .up-button[data-tone='warning'] {
      --up-button-bg: #f59e0b;
      --up-button-fg: #431407;
    }

    .up-button[data-tone='error'] {
      --up-button-bg: var(--ps-danger-color, #dc2626);
      --up-button-fg: #ffffff;
    }

    .up-button[data-tone='help'] {
      --up-button-bg: #7c3aed;
      --up-button-fg: #ffffff;
    }

    .up-button[data-tone='contrast'] {
      --up-button-bg: var(--ps-text-primary, #0f172a);
      --up-button-fg: var(--ps-surface-card, #ffffff);
    }

    .up-button__label {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .up-button__icon {
      flex: 0 0 auto;
      font-size: 1rem;
    }

    .up-button__spinner {
      width: 1rem;
      height: 1rem;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 999rem;
      animation: up-button-spin 700ms linear infinite;
    }

    @keyframes up-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .up-button,
      .up-button__spinner {
        transition: none;
        animation-duration: 1.5s;
      }
    }
  `,
})
export class PublicUpButtonComponent {
  readonly label = input('Button');
  readonly icon = input<string | undefined>();
  readonly tone = input<PublicUpButtonTone>('primary');
  readonly appearance = input<PublicUpButtonAppearance>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly buttonClick = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}

