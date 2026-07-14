import { Component, input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

export type PublicTooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'ps-tooltip',
  standalone: true,
  imports: [TooltipModule],
  template: `
    <button
      type="button"
      class="ps-tooltip-trigger"
      [attr.aria-label]="label()"
      [pTooltip]="text()"
      [tooltipPosition]="position()"
      tooltipEvent="both"
      appendTo="body"
    >
      <i class="pi pi-question-circle" aria-hidden="true"></i>
      <span>{{ label() }}</span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .ps-tooltip-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 2.5rem;
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-border-radius-md);
      background: var(--p-content-background);
      color: var(--ps-action-text);
      cursor: help;
      font: inherit;
      font-weight: 800;
    }

    .ps-tooltip-trigger:focus-visible {
      box-shadow: var(--p-focus-ring-shadow);
      outline: 0;
    }
  `,
})
export class PublicTooltipComponent {
  readonly label = input('More information');
  readonly text = input('');
  readonly position = input<PublicTooltipPosition>('top');
}
