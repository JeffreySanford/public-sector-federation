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

type PrimeButtonSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast' | undefined;

@Component({
  selector: 'ps-button',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="label()"
      [icon]="icon()"
      [severity]="mappedSeverity()"
      [outlined]="outlined()"
      [text]="text()"
      [disabled]="disabled()"
      [loading]="loading()"
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
  readonly icon = input<string | undefined>();
  readonly tone = input<PublicButtonTone>('primary');
  readonly styleClass = input<string | undefined>();
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly text = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly routerLink = input<string | unknown[] | null>(null);

  readonly buttonClick = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
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
    switch (this.tone()) {
      case 'primary':
        return undefined;
      case 'warning':
        return 'warn';
      case 'error':
        return 'danger';
      default:
        return this.tone() as PrimeButtonSeverity;
    }
  }
}
