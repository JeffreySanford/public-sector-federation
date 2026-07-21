import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  PublicButtonComponent,
  PublicInputComponent,
  PublicPaginatorComponent,
  type PublicTableColumn,
  PublicTableComponent,
  PublicTagComponent,
} from '@public-sector/ui-patterns';

interface Row {
  program: string;
  cases: number;
  status: 'On track' | 'Watch' | 'Delayed';
  region: string;
  sla: number;
}

const rows: Row[] = [
  { program: 'Housing assistance', cases: 428, status: 'On track', region: 'North', sla: 96 },
  { program: 'Small business grants', cases: 183, status: 'Watch', region: 'Central', sla: 87 },
  { program: 'Permit inspections', cases: 72, status: 'Delayed', region: 'South', sla: 68 },
  { program: 'Benefits renewal', cases: 316, status: 'On track', region: 'North', sla: 94 },
  { program: 'Document intake', cases: 241, status: 'Watch', region: 'Central', sla: 82 },
  { program: 'Transit assistance', cases: 137, status: 'On track', region: 'East', sla: 91 },
  { program: 'Child care subsidy', cases: 205, status: 'Delayed', region: 'West', sla: 73 },
  { program: 'Emergency housing', cases: 94, status: 'Watch', region: 'South', sla: 79 },
  { program: 'License review', cases: 158, status: 'On track', region: 'East', sla: 93 },
  { program: 'Food assistance', cases: 376, status: 'On track', region: 'West', sla: 95 },
];

const columns: PublicTableColumn[] = [
  { key: 'program', header: 'Program', sortable: true },
  { key: 'cases', header: 'Cases', align: 'end', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'sla', header: 'SLA', align: 'end', sortable: true },
];

function isRowKey(key: string): key is keyof Row {
  return key === 'program' || key === 'cases' || key === 'status' || key === 'region' || key === 'sla';
}

@Component({
  selector: 'public-table-paginator-acceptance-story',
  standalone: true,
  imports: [PublicInputComponent, PublicPaginatorComponent, PublicTableComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header class="story-header">
        <ps-tag value="Acceptance: Table / Input / Paginator" tone="info" />
        <div>
          <h1>Filter and page through active programs</h1>
          <p>Search narrows the dataset, every column is sortable, and the paginator exposes 5, 10, and 15 rows per page.</p>
        </div>
      </header>

      <ps-input fieldId="programSearch" label="Search programs" type="search" [(value)]="query" />

      <ps-table
        [columns]="columns"
        ariaLabel="Story program table"
        [(sortKey)]="sortKey"
        [(sortDirection)]="sortDirection"
        [empty]="filteredRows.length === 0"
        emptyMessage="No programs match the current filters."
      >
        @for (row of pagedRows; track row.program) {
          <tr>
            <td><strong>{{ row.program }}</strong></td>
            <td>{{ row.cases }}</td>
            <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
            <td>{{ row.region }}</td>
            <td>{{ row.sla }}%</td>
          </tr>
        }
      </ps-table>

      <ps-paginator
        ariaLabel="Story program pagination"
        itemLabel="programs"
        [totalRecords]="filteredRows.length"
        [(currentPage)]="currentPage"
        [(rowsPerPage)]="rowsPerPage"
      />
    </main>
  `,
  styles: `
    .storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}
    .story-header{display:grid;gap:.5rem}
  `,
})
class TablePaginatorAcceptanceStoryComponent {
  readonly columns = columns;
  query = '';
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  rowsPerPage = 5;

  get filteredRows(): Row[] {
    const query = this.query.trim().toLowerCase();
    const filtered = query
      ? rows.filter((row) =>
          [row.program, row.status, row.region, String(row.cases), String(row.sla)].some((value) =>
            value.toLowerCase().includes(query),
          ),
        )
      : rows;

    const sortKey = this.sortKey;
    if (!sortKey || !isRowKey(sortKey)) {
      return filtered;
    }

    const direction = this.sortDirection === 'asc' ? 1 : -1;
    return [...filtered].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return direction * (leftValue - rightValue);
      }
      return direction * String(leftValue).localeCompare(String(rightValue));
    });
  }

  get pagedRows(): Row[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRows.slice(start, start + this.rowsPerPage);
  }

  severity(status: Row['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }
}

@Component({
  selector: 'public-table-paginator-stress-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicPaginatorComponent, PublicTableComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header class="story-header">
        <ps-tag value="Stress: Table / Paginator" tone="warn" />
        <div>
          <h1>Loading and empty dataset states</h1>
          <p>This story makes the state changes explicit so the acceptance view proves loading and no-result behavior.</p>
        </div>
      </header>

      <div class="toolbar toolbar--actions">
        <ps-button
          [label]="loading ? 'Hide loading state' : 'Show loading state'"
          icon="pi pi-spinner"
          [outlined]="true"
          (activated)="toggleLoading()"
        />
        <ps-button
          [label]="showEmpty ? 'Restore dataset' : 'Show empty dataset'"
          icon="pi pi-inbox"
          [outlined]="true"
          (activated)="toggleEmpty()"
        />
      </div>

      <div [attr.aria-busy]="loading">
        @if (loading) {
          <div class="loading-banner" aria-live="polite">
            <strong>Loading table rows...</strong>
            <span>Stress state is active so the table stays in a visible loading mode.</span>
          </div>
        }
        <ps-table
          [columns]="columns"
          ariaLabel="Stress story program table"
          [empty]="!loading && activeRows.length === 0"
          emptyMessage="No programs are available for the selected reporting period."
        >
          @if (loading) {
            @for (row of loadingRows; track row) {
              <tr>
                <td colspan="5" class="loading-cell">Loading table rows...</td>
              </tr>
            }
          } @else {
            @for (row of activePagedRows; track row.program) {
              <tr>
                <td><strong>{{ row.program }}</strong></td>
                <td>{{ row.cases }}</td>
                <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
                <td>{{ row.region }}</td>
                <td>{{ row.sla }}%</td>
              </tr>
            }
          }
        </ps-table>
        <ps-paginator
          ariaLabel="Stress story pagination"
          itemLabel="programs"
          [totalRecords]="activeRows.length"
          [(currentPage)]="currentPage"
          [(rowsPerPage)]="rowsPerPage"
        />
      </div>
    </main>
  `,
  styles: `
    .storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}
    .story-header{display:grid;gap:.5rem}
    .toolbar{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}
    .toolbar--actions{justify-content:flex-start}
    .loading-banner{display:grid;gap:.25rem;padding:.85rem 1rem;border:1px solid var(--p-content-border-color);border-radius:.75rem;background:color-mix(in srgb,var(--p-primary-color) 8%,var(--p-content-background))}
    .loading-cell{color:var(--p-text-muted-color);font-style:italic}
  `,
})
class TablePaginatorStressStoryComponent extends TablePaginatorAcceptanceStoryComponent {
  loading = true;
  showEmpty = false;
  readonly loadingRows = [0, 1, 2];

  get activeRows(): Row[] {
    if (this.loading) {
      return [];
    }

    return this.showEmpty ? [] : rows;
  }

  get activePagedRows(): Row[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.activeRows.slice(start, start + this.rowsPerPage);
  }

  toggleEmpty(): void {
    this.showEmpty = !this.showEmpty;
    this.currentPage = 1;
  }

  toggleLoading(): void {
    this.loading = !this.loading;
    this.currentPage = 1;
  }
}

const meta: Meta<TablePaginatorAcceptanceStoryComponent> = {
  title: 'Design System/Interaction Stories/Table Paginator',
  component: TablePaginatorAcceptanceStoryComponent,
  render: () => ({
    moduleMetadata: { imports: [TablePaginatorAcceptanceStoryComponent] },
    template: '<public-table-paginator-acceptance-story />',
  }),
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<TablePaginatorAcceptanceStoryComponent>;

export const SortFilterAndPage: Story = {};

export const LoadingAndEmpty: StoryObj<TablePaginatorStressStoryComponent> = {
  render: () => ({
    moduleMetadata: { imports: [TablePaginatorStressStoryComponent] },
    template: '<public-table-paginator-stress-story />',
  }),
};
