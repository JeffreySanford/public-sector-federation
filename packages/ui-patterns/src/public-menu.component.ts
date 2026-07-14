import { Component, computed, input, viewChild } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { PublicButtonComponent } from './public-button.component';

export interface PublicMenuAction {
  label: string;
  icon?: string;
  disabled?: boolean;
  action?: () => void;
}

@Component({
  selector: 'ps-menu',
  standalone: true,
  imports: [MenuModule, PublicButtonComponent],
  template: `
    <ps-button [label]="label()" [icon]="icon()" [outlined]="true" (buttonClick)="toggle($event)" />
    <p-menu #menu [model]="menuItems()" [popup]="true" appendTo="body" />
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class PublicMenuComponent {
  private readonly menu = viewChild<Menu>('menu');

  readonly label = input('Open menu');
  readonly icon = input('pi pi-bars');
  readonly actions = input<PublicMenuAction[]>([]);

  readonly menuItems = computed<MenuItem[]>(() =>
    this.actions().map((action) => ({
      label: action.label,
      icon: action.icon,
      disabled: action.disabled,
      command: () => action.action?.(),
    })),
  );

  toggle(event: MouseEvent): void {
    this.menu()?.toggle(event);
  }
}
