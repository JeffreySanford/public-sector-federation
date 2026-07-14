import { Component, input, viewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { PublicButtonComponent } from './public-button.component';

@Component({
  selector: 'ps-popover',
  standalone: true,
  imports: [PopoverModule, PublicButtonComponent],
  template: `
    <ps-button [label]="label()" [icon]="icon()" [outlined]="true" (buttonClick)="toggle($event)" />
    <p-popover #popover appendTo="body">
      <div class="ps-popover-content">
        <ng-content />
      </div>
    </p-popover>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .ps-popover-content {
      display: grid;
      max-width: 18rem;
      gap: 0.5rem;
      color: var(--p-text-color);
      line-height: 1.45;
    }
  `,
})
export class PublicPopoverComponent {
  private readonly popover = viewChild<Popover>('popover');

  readonly label = input('Open details');
  readonly icon = input('pi pi-info-circle');

  toggle(event: MouseEvent): void {
    this.popover()?.toggle(event);
  }
}
