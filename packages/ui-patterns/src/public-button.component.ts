import { booleanAttribute, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

export type PublicButtonTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'warning'
  | 'danger'
  | 'error'
  | 'help'
  | 'contrast';

export type PublicButtonIntent = 'primary' | 'secondary' | 'destructive';
export type PublicButtonAppearance = 'solid' | 'outlined' | 'text';

/** Governed icon identifier. PrimeIcons class strings are a deprecated compatibility surface; see `icon`. */
export type PublicButtonIcon =
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

const iconClassByName: Record<PublicButtonIcon, string> = {
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

type PrimeButtonSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast' | undefined;

@Component({
  selector: 'ps-button',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="label()"
      [icon]="resolvedIcon()"
      [ariaLabel]="label()"
      [severity]="mappedSeverity()"
      [outlined]="resolvedAppearance() === 'outlined'"
      [text]="resolvedAppearance() === 'text'"
      [disabled]="disabled()"
      [loading]="loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
      [styleClass]="styleClass()"
      (onClick)="handleClick($event)"
    />
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class PublicButtonComponent {
  private readonly router = inject(Router, { optional: true });

  readonly label = input('');
  /** @deprecated Use iconName with a governed identifier instead of a PrimeIcons class string. */
  readonly icon = input<string | undefined>();
  readonly iconName = input<PublicButtonIcon | undefined>();
  readonly intent = input<PublicButtonIntent>('primary');
  readonly appearance = input<PublicButtonAppearance>('solid');
  /** @deprecated Use intent. */
  readonly tone = input<PublicButtonTone | undefined>(undefined);
  /** @deprecated Escape hatch retained for stable consumers during migration. */
  readonly styleClass = input<string | undefined>();
  /** @deprecated Use appearance="outlined". */
  readonly outlined = input(false, { transform: booleanAttribute });
  /** @deprecated Use appearance="text". */
  readonly text = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly routerLink = input<string | unknown[] | null>(null);

  readonly activated = output<void>();
  /** @deprecated Use activated. */
  readonly buttonClick = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    this.activated.emit();
    this.buttonClick.emit(event);

    const route = this.routerLink();
    if (!route) {
      return;
    }

    if (this.router) {
      void this.router.navigate(Array.isArray(route) ? route : [route]);
      return;
    }

    if (typeof location !== 'undefined' && typeof route === 'string') {
      location.href = route;
    }
  }

  mappedSeverity(): PrimeButtonSeverity {
    const tone = this.tone() ?? (this.intent() === 'destructive' ? 'danger' : this.intent());
    switch (tone) {
      case 'primary':
        return undefined;
      case 'warning':
        return 'warn';
      case 'error':
        return 'danger';
      default:
        return tone as PrimeButtonSeverity;
    }
  }

  resolvedAppearance(): PublicButtonAppearance {
    if (this.text()) return 'text';
    if (this.outlined()) return 'outlined';
    return this.appearance();
  }

  resolvedIcon(): string | undefined {
    const iconName = this.iconName();
    if (iconName) {
      return iconClassByName[iconName];
    }

    return this.icon();
  }
}
