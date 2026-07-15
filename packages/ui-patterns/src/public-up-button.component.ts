import { booleanAttribute, Component, computed, input, output } from '@angular/core';

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

export type PublicUpButtonIcon =
  | 'arrow-right'
  | 'bolt'
  | 'check'
  | 'download'
  | 'exclamation-triangle'
  | 'info-circle'
  | 'lock'
  | 'question-circle'
  | 'save'
  | 'send'
  | 'times-circle';

const iconClassByName: Record<PublicUpButtonIcon, string> = {
  'arrow-right': 'pi pi-arrow-right',
  bolt: 'pi pi-bolt',
  check: 'pi pi-check',
  download: 'pi pi-download',
  'exclamation-triangle': 'pi pi-exclamation-triangle',
  'info-circle': 'pi pi-info-circle',
  lock: 'pi pi-lock',
  'question-circle': 'pi pi-question-circle',
  save: 'pi pi-save',
  send: 'pi pi-send',
  'times-circle': 'pi pi-times-circle',
};

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
      } @else if (iconClass()) {
        <span class="up-button__icon" [class]="iconClass()" aria-hidden="true"></span>
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
      --ps-up-button-tone-background: var(--ps-up-button-primary-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-primary-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-primary-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-primary-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-primary-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-primary-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-primary-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-primary-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-primary-active-border-color);

      --ps-up-button-background: var(--ps-up-button-tone-background);
      --ps-up-button-foreground: var(--ps-up-button-tone-foreground);
      --ps-up-button-border-color: var(--ps-up-button-tone-border-color);
      --ps-up-button-hover-background: var(--ps-up-button-tone-hover-background);
      --ps-up-button-hover-foreground: var(--ps-up-button-tone-hover-foreground);
      --ps-up-button-hover-border-color: var(--ps-up-button-tone-hover-border-color);
      --ps-up-button-active-background: var(--ps-up-button-tone-active-background);
      --ps-up-button-active-foreground: var(--ps-up-button-tone-active-foreground);
      --ps-up-button-active-border-color: var(--ps-up-button-tone-active-border-color);

      display: inline-flex;
      min-height: var(--ps-up-button-min-height);
      max-width: 100%;
      align-items: center;
      justify-content: center;
      gap: var(--ps-up-button-content-gap);
      padding-block: var(--ps-up-button-padding-block);
      padding-inline: var(--ps-up-button-padding-inline);
      border-width: var(--ps-up-button-border-width);
      border-style: var(--ps-up-button-border-style);
      border-color: var(--ps-up-button-border-color);
      border-radius: var(--ps-up-button-border-radius);
      background: var(--ps-up-button-background);
      color: var(--ps-up-button-foreground);
      font-family: var(--ps-font-family, "Inter", "Segoe UI", Arial, sans-serif);
      font-size: var(--ps-up-button-font-size);
      font-weight: var(--ps-up-button-font-weight);
      line-height: var(--ps-up-button-line-height);
      text-align: center;
      text-decoration: none;
      transition:
        background-color var(--ps-up-button-transition-duration),
        border-color var(--ps-up-button-transition-duration),
        color var(--ps-up-button-transition-duration),
        box-shadow var(--ps-up-button-transition-duration);
      cursor: pointer;
    }

    .up-button:hover:not(:disabled) {
      background: var(--ps-up-button-hover-background);
      color: var(--ps-up-button-hover-foreground);
      border-color: var(--ps-up-button-hover-border-color);
    }

    .up-button:active:not(:disabled) {
      background: var(--ps-up-button-active-background);
      color: var(--ps-up-button-active-foreground);
      border-color: var(--ps-up-button-active-border-color);
    }

    .up-button:focus-visible {
      outline: var(--ps-up-button-focus-width) var(--ps-up-button-focus-style) var(--ps-up-button-focus-color);
      outline-offset: var(--ps-up-button-focus-offset);
      box-shadow: var(--ps-up-button-focus-shadow);
    }

    .up-button:disabled {
      background: var(--ps-up-button-disabled-background);
      color: var(--ps-up-button-disabled-foreground);
      border-color: var(--ps-up-button-disabled-border-color);
      opacity: var(--ps-up-button-disabled-opacity);
      cursor: not-allowed;
    }

    .up-button[aria-busy='true'] {
      opacity: var(--ps-up-button-loading-opacity);
    }

    .up-button[data-appearance='outlined'] {
      --ps-up-button-background: var(--ps-up-button-outlined-background);
      --ps-up-button-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-border-color: var(--ps-up-button-tone-border-color);
      --ps-up-button-hover-background: var(--ps-up-button-outlined-hover-background);
      --ps-up-button-hover-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-hover-border-color: var(--ps-up-button-tone-hover-border-color);
      --ps-up-button-active-background: var(--ps-up-button-outlined-active-background);
      --ps-up-button-active-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-active-border-color: var(--ps-up-button-tone-active-border-color);
    }

    .up-button[data-appearance='text'] {
      --ps-up-button-background: var(--ps-up-button-text-background);
      --ps-up-button-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-border-color: var(--ps-up-button-text-border-color);
      --ps-up-button-hover-background: var(--ps-up-button-text-hover-background);
      --ps-up-button-hover-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-hover-border-color: var(--ps-up-button-text-border-color);
      --ps-up-button-active-background: var(--ps-up-button-text-active-background);
      --ps-up-button-active-foreground: var(--ps-up-button-tone-background);
      --ps-up-button-active-border-color: var(--ps-up-button-text-border-color);
    }

    .up-button[data-tone='secondary'] {
      --ps-up-button-tone-background: var(--ps-up-button-secondary-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-secondary-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-secondary-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-secondary-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-secondary-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-secondary-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-secondary-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-secondary-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-secondary-active-border-color);
    }

    .up-button[data-tone='success'] {
      --ps-up-button-tone-background: var(--ps-up-button-success-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-success-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-success-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-success-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-success-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-success-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-success-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-success-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-success-active-border-color);
    }

    .up-button[data-tone='info'] {
      --ps-up-button-tone-background: var(--ps-up-button-info-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-info-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-info-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-info-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-info-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-info-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-info-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-info-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-info-active-border-color);
    }

    .up-button[data-tone='warning'] {
      --ps-up-button-tone-background: var(--ps-up-button-warning-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-warning-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-warning-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-warning-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-warning-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-warning-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-warning-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-warning-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-warning-active-border-color);
    }

    .up-button[data-tone='error'] {
      --ps-up-button-tone-background: var(--ps-up-button-error-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-error-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-error-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-error-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-error-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-error-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-error-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-error-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-error-active-border-color);
    }

    .up-button[data-tone='help'] {
      --ps-up-button-tone-background: var(--ps-up-button-help-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-help-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-help-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-help-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-help-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-help-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-help-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-help-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-help-active-border-color);
    }

    .up-button[data-tone='contrast'] {
      --ps-up-button-tone-background: var(--ps-up-button-contrast-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-contrast-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-contrast-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-contrast-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-contrast-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-contrast-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-contrast-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-contrast-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-contrast-active-border-color);
    }

    .up-button__label {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .up-button__icon {
      flex: 0 0 auto;
      font-size: var(--ps-up-button-icon-size);
    }

    .up-button__spinner {
      width: var(--ps-up-button-spinner-size);
      height: var(--ps-up-button-spinner-size);
      flex: 0 0 auto;
      border: var(--ps-up-button-spinner-border-width) solid currentColor;
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
  readonly icon = input<PublicUpButtonIcon | undefined>();
  readonly tone = input<PublicUpButtonTone>('primary');
  readonly appearance = input<PublicUpButtonAppearance>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly buttonClick = output<MouseEvent>();
  protected readonly iconClass = computed(() => {
    const icon = this.icon();
    return icon ? iconClassByName[icon] : undefined;
  });

  handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}

