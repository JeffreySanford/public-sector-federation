import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, booleanAttribute, Component, computed, ElementRef, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface PublicSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

let selectId = 0;

@Component({
  selector: 'ps-select',
  standalone: true,
  imports: [FormsModule, SelectModule],
  template: `
    <div class="ps-select-field">
      <label [for]="fieldId()">
        {{ label() }}
        @if (required()) { <span class="ps-select-field__required" aria-hidden="true">*</span> }
      </label>
      <p-select
        #selectHost
        [inputId]="fieldId()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        [options]="options()"
        optionLabel="label"
        optionValue="value"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [invalid]="invalid()"
        [ariaLabel]="label()"
        appendTo="body"
        (onShow)="scheduleDisabledOptionSemantics()"
      />
      @if (helpText()) {
        <p class="ps-select-field__help" [id]="helpId()">{{ helpText() }}</p>
      }
      @if (invalid() && errorText()) {
        <p class="ps-select-field__error" [id]="errorId()">{{ errorText() }}</p>
      }
    </div>
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

    .ps-select-field__required,
    .ps-select-field__error {
      color: var(--p-red-600, var(--p-primary-color));
    }

    .ps-select-field__help,
    .ps-select-field__error {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
    }

    .ps-select-field__help {
      color: var(--p-text-muted-color);
    }
  `,
})
export class PublicSelectComponent implements AfterViewChecked {
  private readonly document = inject(DOCUMENT);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  readonly fieldId = input(`ps-select-${++selectId}`);
  readonly label = input('Select');
  readonly options = input<PublicSelectOption[]>([]);
  readonly placeholder = input('Choose an option');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly helpText = input('');
  readonly errorText = input('');
  readonly value = model<string | null>(null);

  readonly helpId = computed(() => `${this.fieldId()}-help`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);

  ngAfterViewChecked(): void {
    const combobox = this.host.nativeElement.querySelector<HTMLElement>('[role="combobox"]');
    if (!combobox) return;

    this.syncAttribute(combobox, 'aria-required', this.required() ? 'true' : null);
    this.syncAttribute(combobox, 'aria-invalid', this.invalid() ? 'true' : null);
    const descriptions = [
      this.helpText() ? this.helpId() : null,
      this.invalid() && this.errorText() ? this.errorId() : null,
    ].filter((id): id is string => Boolean(id));
    this.syncAttribute(combobox, 'aria-describedby', descriptions.length ? descriptions.join(' ') : null);
    this.syncDisabledOptionSemantics(combobox);
  }

  scheduleDisabledOptionSemantics(): void {
    queueMicrotask(() => {
      const combobox = this.host.nativeElement.querySelector<HTMLElement>('[role="combobox"]');
      if (combobox) this.syncDisabledOptionSemantics(combobox);
    });
  }

  private syncDisabledOptionSemantics(combobox: HTMLElement): void {
    const listboxId = combobox.getAttribute('aria-controls') ?? combobox.getAttribute('aria-owns');
    if (!listboxId) return;

    const listbox = this.document.getElementById(listboxId);
    for (const option of listbox?.querySelectorAll<HTMLElement>('[role="option"]') ?? []) {
      this.syncAttribute(option, 'aria-disabled', option.getAttribute('data-p-disabled') === 'true' ? 'true' : null);
    }
  }

  private syncAttribute(element: HTMLElement, name: string, value: string | null): void {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }
}
