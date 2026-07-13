import { Component, input, model } from '@angular/core';

@Component({
  selector: 'ps-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="ps-dialog__backdrop" (click)="close()">
        <section
          class="ps-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="header()"
          [style.max-width]="width()"
          (click)="$event.stopPropagation()"
        >
          <header class="ps-dialog__header">
            <h2>{{ header() }}</h2>
            <button type="button" aria-label="Close dialog" (click)="close()">x</button>
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
      width: 2rem;
      height: 2rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 999px;
      background: transparent;
      color: var(--p-text-color);
      cursor: pointer;
    }

    .ps-dialog__body {
      display: grid;
      gap: 1rem;
      line-height: 1.55;
    }
  `,
})
export class PublicDialogComponent {
  readonly header = input('');
  readonly width = input('32rem');
  readonly visible = model(false);

  close(): void {
    this.visible.set(false);
  }
}
