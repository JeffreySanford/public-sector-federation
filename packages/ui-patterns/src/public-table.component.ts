import { Component, input, model } from '@angular/core';

export interface PublicTableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'start' | 'end';
}

export type PublicTableSortDirection = 'asc' | 'desc';

@Component({
  selector: 'ps-table',
  standalone: true,
  template: `
    <div class="ps-table-scroll" role="region" [attr.aria-label]="ariaLabel()" tabindex="0">
      <table class="ps-table">
        @if (caption()) {
          <caption class="ps-table__caption">{{ caption() }}</caption>
        }
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              @if (column.sortable) {
                <th [class.ps-table__cell--end]="column.align === 'end'" aria-sort="none" [attr.aria-sort]="sortAttribute(column.key)">
                  <button
                    type="button"
                    class="ps-table__sort-button"
                    (click)="toggleSort(column.key)"
                  >
                    {{ column.header }}
                    <span aria-hidden="true">{{ sortIndicator(column.key) }}</span>
                  </button>
                </th>
              } @else {
                <th [class.ps-table__cell--end]="column.align === 'end'">{{ column.header }}</th>
              }
            }
          </tr>
        </thead>
        <tbody>
          @if (empty()) {
            <tr>
              <td class="ps-table__empty" [attr.colspan]="columns().length">{{ emptyMessage() }}</td>
            </tr>
          } @else {
            <ng-content></ng-content>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .ps-table-scroll {
      overflow-x: auto;
      border-radius: var(--p-border-radius-md, 6px);
    }

    .ps-table-scroll:focus-visible {
      outline: 2px solid var(--p-primary-color);
      outline-offset: 2px;
    }

    .ps-table {
      width: 100%;
      border-collapse: collapse;
      color: var(--p-text-color);
    }

    .ps-table__caption {
      text-align: left;
      font-weight: 700;
      padding-bottom: 0.5rem;
    }

    .ps-table th,
    .ps-table td {
      text-align: left;
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid var(--p-content-border-color, currentColor);
      white-space: nowrap;
    }

    .ps-table__cell--end {
      text-align: end;
    }

    .ps-table__sort-button {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font: inherit;
      font-weight: 700;
      background: none;
      border: none;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }

    .ps-table__sort-button:focus-visible {
      outline: 2px solid var(--p-primary-color);
      outline-offset: 2px;
    }

    .ps-table__empty {
      text-align: center;
      color: var(--p-text-muted-color);
      white-space: normal;
    }
  `,
})
export class PublicTableComponent {
  readonly columns = input<PublicTableColumn[]>([]);
  readonly ariaLabel = input('Data table');
  readonly caption = input('');
  readonly empty = input(false);
  readonly emptyMessage = input('No results found.');
  readonly sortKey = model<string | null>(null);
  readonly sortDirection = model<PublicTableSortDirection>('asc');

  toggleSort(key: string): void {
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
      return;
    }
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  sortAttribute(key: string): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  sortIndicator(key: string): string {
    if (this.sortKey() !== key) return '';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
