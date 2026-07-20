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
          [attr.aria-describedby]="description() ? descriptionId : null"
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
            @if (description()) {
              <p [id]="descriptionId">{{ description() }}</p>
            }
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
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly dialogElement = viewChild<ElementRef<HTMLElement>>('dialogElement');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private wasVisible = false;
  private focusRequest = 0;
  private userNavigatedFocus = false;
  private lastFocusedElement: HTMLElement | null = null;
  private restoreFocusTarget: HTMLElement | null = null;
  private readonly inertState = new Map<HTMLElement, boolean>();
  private previousBodyOverflow: string | null = null;
  private readonly handleDocumentFocusIn = (event: FocusEvent) => {
    if (this.visible()) return;
    const target = event.target;
    if (this.isHTMLElement(target) && target !== this.document.body) {
      this.lastFocusedElement = target;
    }
  };
  private readonly handleDocumentPointerDown = (event: PointerEvent) => {
    if (this.visible()) return;
    const target = event.target;
    if (!this.isHTMLElement(target) || target === this.document.body) return;
    this.lastFocusedElement = target.closest<HTMLElement>(focusableSelector) ?? target;
  };

  readonly titleId = `ps-dialog-title-${++dialogInstance}`;
  readonly descriptionId = `ps-dialog-description-${dialogInstance}`;
  readonly header = input('');
  readonly description = input('');
  readonly width = input('32rem');
  readonly visible = model(false);

  constructor() {
    this.document.addEventListener('focusin', this.handleDocumentFocusIn, true);
    this.document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
  }

  ngAfterViewChecked(): void {
    const isVisible = this.visible();

    if (isVisible && !this.wasVisible) {
      const activeElement = this.document.activeElement;
      const activeTarget = this.isHTMLElement(activeElement) && activeElement !== this.document.body
        ? activeElement
        : null;
      this.restoreFocusTarget = activeTarget ?? this.lastFocusedElement;
      this.userNavigatedFocus = false;
      this.applyModalIsolation();
      const request = ++this.focusRequest;
      this.scheduleInitialFocus(request);
    }

    if (!isVisible && this.wasVisible) {
      this.releaseModalIsolation();
      this.restoreFocus();
    }

    this.wasVisible = isVisible;
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('focusin', this.handleDocumentFocusIn, true);
    this.document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
    if (this.wasVisible) {
      this.releaseModalIsolation();
      this.restoreFocus();
    }
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
    const activeIndex = focusableElements.indexOf(activeElement as HTMLElement);

    event.preventDefault();
    this.userNavigatedFocus = true;

    if (event.shiftKey) {
      const previousIndex = activeIndex <= 0 ? focusableElements.length - 1 : activeIndex - 1;
      focusableElements[previousIndex].focus({ preventScroll: true });
      return;
    }

    const nextIndex = activeIndex === -1 || activeElement === last ? 0 : activeIndex + 1;
    focusableElements[nextIndex].focus({ preventScroll: true });
  }

  private focusInitialElement(): void {
    const dialog = this.dialogElement()?.nativeElement;
    if (!dialog) return;

    const initialTarget = this.closeButton()?.nativeElement
      ?? this.getFocusableElements(dialog)[0]
      ?? dialog;
    initialTarget.focus({ preventScroll: true });
  }

  private scheduleInitialFocus(request: number): void {
    const focusIfNeeded = () => {
      if (request !== this.focusRequest || !this.visible() || this.userNavigatedFocus) return;
      this.focusInitialElement();
    };

    queueMicrotask(focusIfNeeded);

    const win = this.document.defaultView;
    if (!win) return;

    win.requestAnimationFrame(() => {
      focusIfNeeded();
      win.setTimeout(focusIfNeeded, 0);
    });
  }

  private getFocusableElements(dialog: HTMLElement): HTMLElement[] {
    return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
      return !element.hasAttribute('disabled')
        && element.getAttribute('aria-hidden') !== 'true'
        && element.tabIndex >= 0;
    });
  }

  private isHTMLElement(value: unknown): value is HTMLElement {
    const HTMLElementCtor = this.document.defaultView?.HTMLElement;
    return !!HTMLElementCtor && value instanceof HTMLElementCtor;
  }

  private applyModalIsolation(): void {
    let dialogBranch = this.host.nativeElement;
    let parent = dialogBranch.parentElement;

    while (parent) {
      for (const sibling of Array.from(parent.children)) {
        if (sibling === dialogBranch || !this.isHTMLElement(sibling)) continue;
        if (!this.inertState.has(sibling)) this.inertState.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      if (parent === this.document.body) break;
      dialogBranch = parent;
      parent = parent.parentElement;
    }

    if (this.previousBodyOverflow === null) {
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
    }
  }

  private releaseModalIsolation(): void {
    for (const [element, wasInert] of this.inertState) {
      if (element.isConnected) element.inert = wasInert;
    }
    this.inertState.clear();

    if (this.previousBodyOverflow !== null) {
      this.document.body.style.overflow = this.previousBodyOverflow;
      this.previousBodyOverflow = null;
    }
  }

  private restoreFocus(): void {
    ++this.focusRequest;
    const target = this.restoreFocusTarget;
    this.restoreFocusTarget = null;

    const focusTarget = () => {
      if (target?.isConnected) target.focus({ preventScroll: true });
    };

    queueMicrotask(focusTarget);

    const win = this.document.defaultView;
    if (!win) return;

    win.requestAnimationFrame(() => {
      focusTarget();
      win.setTimeout(focusTarget, 0);
      win.setTimeout(focusTarget, 50);
    });
  }
}
