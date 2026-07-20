import { AfterViewChecked, booleanAttribute, Component, computed, ElementRef, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type PublicInputType = 'text' | 'search' | 'password' | 'date';

let inputFieldId = 0;

@Component({
  selector: 'ps-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ps-input-field">
      <label [for]="fieldId()">
        {{ label() }}
        @if (required()) { <span class="ps-input-field__required" aria-hidden="true">*</span> }
      </label>
      <input
        #inputHost
        [id]="fieldId()"
        [type]="type()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
      />
      @if (helpText()) {
        <p class="ps-input-field__help" [id]="helpId()">{{ helpText() }}</p>
      }
      @if (invalid() && errorText()) {
        <p class="ps-input-field__error" [id]="errorId()">{{ errorText() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-grid;
      min-width: min(100%, 18rem);
    }

    .ps-input-field {
      display: grid;
      gap: 0.35rem;
      color: var(--p-text-color);
      font-weight: 700;
    }

    .ps-input-field input {
      font: inherit;
      font-weight: 400;
      padding: 0.5rem 0.75rem;
      border-radius: var(--p-border-radius-md, 6px);
      border: 1px solid var(--p-content-border-color, currentColor);
      background: var(--p-content-background, transparent);
      color: var(--p-text-color);
    }

    .ps-input-field input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .ps-input-field__required,
    .ps-input-field__error {
      color: var(--p-red-600, var(--p-primary-color));
    }

    .ps-input-field__help,
    .ps-input-field__error {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
    }

    .ps-input-field__help {
      color: var(--p-text-muted-color);
    }
  `,
})
export class PublicInputComponent implements AfterViewChecked {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  readonly fieldId = input(`ps-input-${++inputFieldId}`);
  readonly label = input.required<string>();
  readonly type = input<PublicInputType>('text');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly helpText = input('');
  readonly errorText = input('');
  readonly value = model('');

  readonly helpId = computed(() => `${this.fieldId()}-help`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);

  ngAfterViewChecked(): void {
    const control = this.host.nativeElement.querySelector<HTMLInputElement>('input');
    if (!control) return;

    this.syncAttribute(control, 'aria-required', this.required() ? 'true' : null);
    this.syncAttribute(control, 'aria-invalid', this.invalid() ? 'true' : null);
    const descriptions = [
      this.helpText() ? this.helpId() : null,
      this.invalid() && this.errorText() ? this.errorId() : null,
    ].filter((id): id is string => Boolean(id));
    this.syncAttribute(control, 'aria-describedby', descriptions.length ? descriptions.join(' ') : null);
  }

  private syncAttribute(element: HTMLElement, name: string, value: string | null): void {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
  }
}
