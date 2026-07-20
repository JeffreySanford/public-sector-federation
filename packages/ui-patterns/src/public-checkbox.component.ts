import { AfterViewChecked, booleanAttribute, Component, computed, ElementRef, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type PublicCheckboxVariant = 'checkbox' | 'switch';

let checkboxId = 0;

@Component({
  selector: 'ps-checkbox',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="ps-checkbox-field">
      <label class="ps-checkbox-field__control" [class.ps-checkbox-field__control--switch]="variant() === 'switch'">
        <input
          #inputHost
          type="checkbox"
          [id]="fieldId()"
          [attr.role]="variant() === 'switch' ? 'switch' : null"
          [ngModel]="checked()"
          (ngModelChange)="checked.set($event)"
          [disabled]="disabled()"
        />
        <span>
          {{ label() }}
          @if (required()) { <span class="ps-checkbox-field__required" aria-hidden="true">*</span> }
        </span>
      </label>
      @if (helpText()) {
        <p class="ps-checkbox-field__help" [id]="helpId()">{{ helpText() }}</p>
      }
      @if (invalid() && errorText()) {
        <p class="ps-checkbox-field__error" [id]="errorId()">{{ errorText() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-grid;
    }

    .ps-checkbox-field {
      display: grid;
      gap: 0.35rem;
      color: var(--p-text-color);
    }

    .ps-checkbox-field__control {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      cursor: pointer;
    }

    .ps-checkbox-field__control input[type='checkbox'] {
      accent-color: var(--ps-button-background, var(--p-primary-color));
      width: 1.125rem;
      height: 1.125rem;
    }

    .ps-checkbox-field__control--switch input[type='checkbox'] {
      width: 2.25rem;
      height: 1.25rem;
    }

    .ps-checkbox-field__required,
    .ps-checkbox-field__error {
      color: var(--p-red-600, var(--p-primary-color));
    }

    .ps-checkbox-field__help,
    .ps-checkbox-field__error {
      margin: 0 0 0 1.625rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
    }

    .ps-checkbox-field__help {
      color: var(--p-text-muted-color);
    }
  `,
})
export class PublicCheckboxComponent implements AfterViewChecked {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  readonly fieldId = input(`ps-checkbox-${++checkboxId}`);
  readonly label = input.required<string>();
  readonly variant = input<PublicCheckboxVariant>('checkbox');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly helpText = input('');
  readonly errorText = input('');
  readonly checked = model(false);

  readonly helpId = computed(() => `${this.fieldId()}-help`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);

  ngAfterViewChecked(): void {
    const control = this.host.nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
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
