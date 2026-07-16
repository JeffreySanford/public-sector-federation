import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/** Product-facing action purpose. PrimeNG severity names are intentionally private. */
export type PublicUpButtonIntent = 'primary' | 'secondary' | 'destructive';

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

type PrimeButtonVariant = 'outlined' | 'text' | undefined;

type InternalButtonTone = 'primary' | 'secondary' | 'error';

const intentTone: Record<PublicUpButtonIntent, InternalButtonTone> = {
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'error',
};

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
  imports: [ButtonModule],
  host: {
    '[attr.data-intent]': 'intent()',
    '[attr.data-resolved-tone]': 'resolvedTone()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    'data-provider': 'primeng',
  },
  template: `
    <p-button
      [label]="label()"
      [icon]="iconClass()"
      [variant]="providerVariant()"
      [disabled]="disabled() || loading()"
      [loading]="loading()"
      [style]="providerStyle"
      styleClass="ps-up-button__control"
      (onClick)="handleActivate()"
    />
  `,
  styles: `
    :host {
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

      --p-button-transition-duration: var(--ps-up-button-transition-duration);
      --p-button-border-radius: var(--ps-up-button-border-radius);
      --p-button-padding-y: var(--ps-up-button-padding-block);
      --p-button-padding-x: var(--ps-up-button-padding-inline);
      --p-button-gap: var(--ps-up-button-content-gap);
      --p-button-label-font-weight: var(--ps-up-button-font-weight);
      --p-button-primary-background: var(--ps-up-button-background);
      --p-button-primary-color: var(--ps-up-button-foreground);
      --p-button-primary-border-color: var(--ps-up-button-border-color);
      --p-button-primary-hover-background: var(--ps-up-button-hover-background);
      --p-button-primary-hover-color: var(--ps-up-button-hover-foreground);
      --p-button-primary-hover-border-color: var(--ps-up-button-hover-border-color);
      --p-button-primary-active-background: var(--ps-up-button-active-background);
      --p-button-primary-active-color: var(--ps-up-button-active-foreground);
      --p-button-primary-active-border-color: var(--ps-up-button-active-border-color);
      --p-button-primary-focus-ring-shadow: var(--ps-up-button-focus-shadow);
      --p-button-outlined-primary-border-color: var(--ps-up-button-tone-border-color);
      --p-button-outlined-primary-color: var(--ps-up-button-tone-background);
      --p-button-outlined-primary-hover-background: var(--ps-up-button-outlined-hover-background);
      --p-button-outlined-primary-active-background: var(--ps-up-button-outlined-active-background);
      --p-button-text-primary-color: var(--ps-up-button-tone-background);
      --p-button-text-primary-hover-background: var(--ps-up-button-text-hover-background);
      --p-button-text-primary-active-background: var(--ps-up-button-text-active-background);

      display: inline-flex;
      max-width: 100%;
    }

    :host([data-resolved-tone='secondary']) {
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

    :host([data-resolved-tone='success']) {
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

    :host([data-resolved-tone='info']) {
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

    :host([data-resolved-tone='warning']) {
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

    :host([data-resolved-tone='error']) {
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

    :host([data-resolved-tone='help']) {
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

    :host([data-resolved-tone='contrast']) {
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

    :host([data-appearance='solid']) ::ng-deep .ps-up-button__control {
      border-color: var(--ps-up-button-border-color);
      background: var(--ps-up-button-background);
      color: var(--ps-up-button-foreground);
      font-weight: var(--ps-up-button-font-weight);
    }

    :host([data-appearance='solid']) ::ng-deep .ps-up-button__control:not(:disabled):hover {
      border-color: var(--ps-up-button-hover-border-color) !important;
      background: var(--ps-up-button-hover-background) !important;
      color: var(--ps-up-button-hover-foreground) !important;
    }

    :host([data-appearance='solid']) ::ng-deep .ps-up-button__control:not(:disabled):active {
      border-color: var(--ps-up-button-active-border-color) !important;
      background: var(--ps-up-button-active-background) !important;
      color: var(--ps-up-button-active-foreground) !important;
    }
  `,
})
export class PublicUpButtonComponent {
  readonly label = input('Button');
  readonly icon = input<PublicUpButtonIcon | undefined>();
  readonly intent = input<PublicUpButtonIntent>('primary');
  readonly appearance = input<PublicUpButtonAppearance>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly activated = output<void>();

  protected readonly providerStyle = {
    maxWidth: '100%',
    minHeight: 'var(--ps-up-button-min-height)',
    whiteSpace: 'normal',
  } as const;

  protected readonly resolvedTone = computed<InternalButtonTone>(() => intentTone[this.intent()]);
  protected readonly providerVariant = computed<PrimeButtonVariant>(() => {
    const appearance = this.appearance();
    return appearance === 'solid' ? undefined : appearance;
  });
  protected readonly iconClass = computed(() => {
    const icon = this.icon();
    if (!icon) {
      return undefined;
    }

    return iconClassByName[icon];
  });

  handleActivate(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.activated.emit();
  }
}
