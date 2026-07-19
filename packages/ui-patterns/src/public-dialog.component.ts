import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';

let dialogInstance = 0;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
  selector: 'ps-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="ps-dialog__backdrop" role="presentation" (click)="close()">
        <section
          #dialogElement
          class="ps-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [style.max-width]="width()"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="handleKeydown($event)"
        >
          <header class="ps-dialog__header">
            <h2 [id]="titleId">{{ header() }}</h2>
            <button
              #closeButton
              type="button"
              aria-label="Close dialog"
              (click)="close()"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div class="ps-dialog__body">
            <ng-content />
          </div>
          <footer class="ps-dialog__footer">
            <ng-content select="[ps-dialog-footer]" />
          </footer>
        </section>
      </div>
    }
  `,
  styles: `
    .ps-dialog__backdrop {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: color-mix(in srgb, #000 42%, transparent);
    }

    .ps-dialog {
      display: grid;
      gap: 1rem;
      width: min(100%, 32rem);
      max-height: min(90vh, 42rem);
      overflow: auto;
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 0.5rem;
      background: var(--p-content-background);
      color: var(--p-text-color);
      box-shadow: var(--p-overlay-modal-shadow, 0 1rem 3rem color-mix(in srgb, #000 25%, transparent));
    }

    .ps-dialog:focus {
      outline: none;
    }

    .ps-dialog__header,
    .ps-dialog__footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ps-dialog__header {
      justify-content: space-between;
    }

    .ps-dialog__footer {
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .ps-dialog__footer:empty {
      display: none;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 1.25rem;
      line-height: 1.3;
    }

    button {
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      width: 2rem;
      height: 2rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 999px;
      background: transparent;
      color: var(--p-text-color);
      font: inherit;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 0.2rem solid var(--ps-focus-ring-color, var(--p-primary-color));
      outline-offset: 0.15rem;
    }

    .ps-dialog__body {
      display: grid;
      gap: 1rem;
      line-height: 1.55;
    }
  `,
})
export class PublicDialogComponent implements AfterViewChecked, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly dialogElement = viewChild<ElementRef<HTMLElement>>('dialogElement');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private wasVisible = false;
  private focusRequest = 0;
  private restoreFocusTarget: HTMLElement | null = null;

  readonly titleId = `ps-dialog-title-${++dialogInstance}`;
  readonly header = input('');
  readonly width = input('32rem');
  readonly visible = model(false);

  ngAfterViewChecked(): void {
    const isVisible = this.visible();

    if (isVisible && !this.wasVisible) {
      const activeElement = this.document.activeElement;
      this.restoreFocusTarget = activeElement && 'focus' in activeElement
        ? activeElement as HTMLElement
        : null;
      const request = ++this.focusRequest;
      queueMicrotask(() => {
        if (request !== this.focusRequest || !this.visible()) return;
        this.focusInitialElement();
      });
    }

    if (!isVisible && this.wasVisible) {
      this.restoreFocus();
    }

    this.wasVisible = isVisible;
  }

  ngOnDestroy(): void {
    if (this.wasVisible) this.restoreFocus();
  }

  close(): void {
    this.visible.set(false);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = this.dialogElement()?.nativeElement;
    if (!dialog) return;

    const focusableElements = this.getFocusableElements(dialog);
    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusInitialElement(): void {
    const dialog = this.dialogElement()?.nativeElement;
    if (!dialog) return;

    const initialTarget = this.closeButton()?.nativeElement
      ?? this.getFocusableElements(dialog)[0]
      ?? dialog;
    initialTarget.focus();
  }

  private getFocusableElements(dialog: HTMLElement): HTMLElement[] {
    return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
      return !element.hasAttribute('disabled')
        && element.getAttribute('aria-hidden') !== 'true'
        && element.tabIndex >= 0;
    });
  }

  private restoreFocus(): void {
    ++this.focusRequest;
    const target = this.restoreFocusTarget;
    this.restoreFocusTarget = null;

    queueMicrotask(() => {
      if (target?.isConnected) target.focus();
    });
  }
}
