import { Component, computed, effect, input, model } from '@angular/core';

@Component({
  selector: 'ps-paginator',
  standalone: true,
  template: `
    <nav class="paginator" [attr.aria-label]="ariaLabel()">
      <div class="paginator-info">
        Showing {{ startRow() }} to {{ endRow() }} of {{ totalRecords() }} {{ itemLabel() }}
      </div>

      <div class="paginator-controls">
        <button type="button" class="paginator-btn" [disabled]="effectivePage() === 1" (click)="previousPage()">
          Previous
        </button>

        <div class="page-info" aria-live="polite">Page {{ effectivePage() }} of {{ totalPages() }}</div>

        <button type="button" class="paginator-btn" [disabled]="effectivePage() === totalPages()" (click)="nextPage()">
          Next
        </button>

        <select
          class="rows-select"
          [attr.aria-label]="rowsPerPageLabel()"
          [value]="rowsPerPage()"
          (change)="changeRowsPerPage($event)"
        >
          @for (option of rowsPerPageOptions(); track option) {
            <option [value]="option">{{ option }} per page</option>
          }
        </select>
      </div>
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }

    .paginator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--ps-surface-border);
      flex-wrap: wrap;
    }

    .paginator-info {
      font-size: 0.875rem;
      color: var(--ps-text-secondary);
    }

    .paginator-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .paginator-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 7.25rem;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--ps-surface-border);
      background: var(--ps-surface-card);
      color: var(--ps-text-primary);
      border-radius: var(--ps-radius-md);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.1;
      text-align: center;
      white-space: nowrap;
      transition:
        background-color 140ms ease,
        border-color 140ms ease,
        color 140ms ease;
    }

    .paginator-btn:hover:not(:disabled) {
      background: var(--p-paginator-nav-button-hover-background);
      color: var(--p-paginator-nav-button-hover-color);
      border-color: color-mix(in srgb, var(--ps-primary-background) 28%, var(--ps-surface-border));
    }

    .paginator-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: color-mix(in srgb, var(--ps-surface-card) 92%, var(--ps-surface-border));
      color: var(--ps-text-secondary);
    }

    .page-info {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      min-width: 100px;
      text-align: center;
      color: var(--ps-text-primary);
    }

    .rows-select {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--ps-surface-border);
      background: var(--ps-surface-card);
      color: var(--ps-text-primary);
      border-radius: var(--ps-radius-md);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
    }

    @media (max-width: 40rem) {
      .paginator {
        flex-direction: column;
        align-items: flex-start;
      }

      .paginator-controls {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
      }

      .page-info,
      .paginator-btn,
      .rows-select {
        width: 100%;
      }
    }
  `,
})
export class PublicPaginatorComponent {
  readonly totalRecords = input(0);
  readonly rowsPerPageOptions = input<number[]>([5, 10, 15]);
  readonly itemLabel = input('items');
  readonly ariaLabel = input('Pagination');
  readonly rowsPerPageLabel = input('Rows per page');

  readonly currentPage = model(1);
  readonly rowsPerPage = model(5);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalRecords() / this.rowsPerPage())));
  readonly effectivePage = computed(() => Math.min(this.totalPages(), Math.max(1, this.currentPage())));
  readonly startRow = computed(() => (this.totalRecords() === 0 ? 0 : (this.effectivePage() - 1) * this.rowsPerPage() + 1));
  readonly endRow = computed(() => Math.min(this.effectivePage() * this.rowsPerPage(), this.totalRecords()));

  private readonly synchronizeCurrentPage = effect(() => {
    const effectivePage = this.effectivePage();

    if (effectivePage !== this.currentPage()) {
      this.currentPage.set(effectivePage);
    }
  });

  previousPage(): void {
    this.currentPage.set(Math.max(1, this.effectivePage() - 1));
  }

  nextPage(): void {
    this.currentPage.set(Math.min(this.totalPages(), this.effectivePage() + 1));
  }

  changeRowsPerPage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.rowsPerPage.set(Number.parseInt(select.value, 10));
    this.currentPage.set(1);
  }
}
