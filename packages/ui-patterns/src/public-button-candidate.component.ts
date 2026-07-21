import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/** Product-facing action purpose. PrimeNG severity names are intentionally private. */
export type PublicButtonCandidateIntent = 'primary' | 'secondary' | 'destructive';

export type PublicButtonCandidateAppearance = 'solid' | 'outlined' | 'text';

export type PublicButtonCandidateIcon =
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

const intentTone: Record<PublicButtonCandidateIntent, InternalButtonTone> = {
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'error',
};

const iconClassByName: Record<PublicButtonCandidateIcon, string> = {
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
  selector: 'ps-button-candidate',
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
      styleClass="ps-button-candidate__control"
      (onClick)="handleActivate()"
    />
  `,
  styles: `
    :host {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-primary-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-primary-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-primary-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-primary-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-primary-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-primary-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-primary-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-primary-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-primary-active-border-color);

      --ps-button-candidate-background: var(--ps-button-candidate-tone-background);
      --ps-button-candidate-foreground: var(--ps-button-candidate-tone-foreground);
      --ps-button-candidate-border-color: var(--ps-button-candidate-tone-border-color);
      --ps-button-candidate-hover-background: var(--ps-button-candidate-tone-hover-background);
      --ps-button-candidate-hover-foreground: var(--ps-button-candidate-tone-hover-foreground);
      --ps-button-candidate-hover-border-color: var(--ps-button-candidate-tone-hover-border-color);
      --ps-button-candidate-active-background: var(--ps-button-candidate-tone-active-background);
      --ps-button-candidate-active-foreground: var(--ps-button-candidate-tone-active-foreground);
      --ps-button-candidate-active-border-color: var(--ps-button-candidate-tone-active-border-color);

      --p-button-transition-duration: var(--ps-button-candidate-transition-duration);
      --p-button-border-radius: var(--ps-button-candidate-border-radius);
      --p-button-padding-y: var(--ps-button-candidate-padding-block);
      --p-button-padding-x: var(--ps-button-candidate-padding-inline);
      --p-button-gap: var(--ps-button-candidate-content-gap);
      --p-button-label-font-weight: var(--ps-button-candidate-font-weight);
      --p-button-primary-background: var(--ps-button-candidate-background);
      --p-button-primary-color: var(--ps-button-candidate-foreground);
      --p-button-primary-border-color: var(--ps-button-candidate-border-color);
      --p-button-primary-hover-background: var(--ps-button-candidate-hover-background);
      --p-button-primary-hover-color: var(--ps-button-candidate-hover-foreground);
      --p-button-primary-hover-border-color: var(--ps-button-candidate-hover-border-color);
      --p-button-primary-active-background: var(--ps-button-candidate-active-background);
      --p-button-primary-active-color: var(--ps-button-candidate-active-foreground);
      --p-button-primary-active-border-color: var(--ps-button-candidate-active-border-color);
      --p-button-primary-focus-ring-shadow: var(--ps-button-candidate-focus-shadow);
      --p-button-outlined-primary-border-color: var(--ps-button-candidate-tone-border-color);
      --p-button-outlined-primary-color: var(--ps-button-candidate-tone-background);
      --p-button-outlined-primary-hover-background: var(--ps-button-candidate-outlined-hover-background);
      --p-button-outlined-primary-active-background: var(--ps-button-candidate-outlined-active-background);
      --p-button-text-primary-color: var(--ps-button-candidate-tone-background);
      --p-button-text-primary-hover-background: var(--ps-button-candidate-text-hover-background);
      --p-button-text-primary-active-background: var(--ps-button-candidate-text-active-background);

      display: inline-flex;
      max-width: 100%;
    }

    :host([data-resolved-tone='secondary']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-secondary-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-secondary-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-secondary-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-secondary-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-secondary-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-secondary-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-secondary-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-secondary-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-secondary-active-border-color);
    }

    :host([data-resolved-tone='success']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-success-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-success-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-success-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-success-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-success-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-success-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-success-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-success-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-success-active-border-color);
    }

    :host([data-resolved-tone='info']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-info-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-info-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-info-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-info-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-info-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-info-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-info-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-info-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-info-active-border-color);
    }

    :host([data-resolved-tone='warning']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-warning-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-warning-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-warning-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-warning-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-warning-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-warning-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-warning-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-warning-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-warning-active-border-color);
    }

    :host([data-resolved-tone='error']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-error-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-error-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-error-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-error-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-error-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-error-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-error-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-error-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-error-active-border-color);
    }

    :host([data-resolved-tone='help']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-help-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-help-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-help-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-help-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-help-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-help-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-help-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-help-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-help-active-border-color);
    }

    :host([data-resolved-tone='contrast']) {
      --ps-button-candidate-tone-background: var(--ps-button-candidate-contrast-background);
      --ps-button-candidate-tone-foreground: var(--ps-button-candidate-contrast-foreground);
      --ps-button-candidate-tone-border-color: var(--ps-button-candidate-contrast-border-color);
      --ps-button-candidate-tone-hover-background: var(--ps-button-candidate-contrast-hover-background);
      --ps-button-candidate-tone-hover-foreground: var(--ps-button-candidate-contrast-hover-foreground);
      --ps-button-candidate-tone-hover-border-color: var(--ps-button-candidate-contrast-hover-border-color);
      --ps-button-candidate-tone-active-background: var(--ps-button-candidate-contrast-active-background);
      --ps-button-candidate-tone-active-foreground: var(--ps-button-candidate-contrast-active-foreground);
      --ps-button-candidate-tone-active-border-color: var(--ps-button-candidate-contrast-active-border-color);
    }

    :host([data-appearance='solid']) ::ng-deep .ps-button-candidate__control {
      border-color: var(--ps-button-candidate-border-color);
      background: var(--ps-button-candidate-background);
      color: var(--ps-button-candidate-foreground);
      font-weight: var(--ps-button-candidate-font-weight);
    }

    :host([data-appearance='solid']) ::ng-deep .ps-button-candidate__control:not(:disabled):hover {
      border-color: var(--ps-button-candidate-hover-border-color) !important;
      background: var(--ps-button-candidate-hover-background) !important;
      color: var(--ps-button-candidate-hover-foreground) !important;
    }

    :host([data-appearance='solid']) ::ng-deep .ps-button-candidate__control:not(:disabled):active {
      border-color: var(--ps-button-candidate-active-border-color) !important;
      background: var(--ps-button-candidate-active-background) !important;
      color: var(--ps-button-candidate-active-foreground) !important;
    }
  `,
})
export class PublicButtonCandidateComponent {
  readonly label = input('Button');
  readonly icon = input<PublicButtonCandidateIcon | undefined>();
  readonly intent = input<PublicButtonCandidateIntent>('primary');
  readonly appearance = input<PublicButtonCandidateAppearance>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly activated = output<void>();

  protected readonly providerStyle = {
    maxWidth: '100%',
    minHeight: 'var(--ps-button-candidate-min-height)',
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
