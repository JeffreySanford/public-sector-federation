import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface PublicSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'ps-select',
  standalone: true,
  imports: [FormsModule, SelectModule],
  template: `
    <label class="ps-select-field">
      <span>{{ label() }}</span>
      <p-select
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        [options]="options()"
        optionLabel="label"
        optionValue="value"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [ariaLabel]="label()"
        appendTo="body"
      />
    </label>
  `,
  styles: `
    :host {
      display: inline-grid;
      min-width: min(100%, 18rem);
    }

    .ps-select-field {
      display: grid;
      gap: 0.35rem;
      color: var(--p-text-color);
      font-weight: 700;
    }
  `,
})
export class PublicSelectComponent {
  readonly label = input('Select');
  readonly options = input<PublicSelectOption[]>([]);
  readonly placeholder = input('Choose an option');
  readonly disabled = input(false);
  readonly value = model<string | null>(null);
}
