import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicPaginatorComponent, PublicTagComponent } from '@public-sector/ui-patterns';

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

@Component({
  selector: 'public-table-paginator-acceptance-story',
  standalone: true,
  imports: [PublicPaginatorComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header class="story-header">
        <ps-tag value="Acceptance: Table / Paginator" tone="info" />
        <div>
          <h1>Filter and page through active programs</h1>
          <p>Search narrows the dataset before pagination, and the paginator exposes 5, 10, and 15 rows per page.</p>
        </div>
      </header>

      <div class="toolbar">
        <div>
          <strong>Program performance</strong>
          <span>Filter by program name, status, region, cases, or SLA.</span>
        </div>
        <input
          type="search"
          placeholder="Search programs"
          aria-label="Search programs"
          [value]="query"
          (input)="onQueryChange(($any($event.target).value ?? '').toString())"
        />
      </div>

      <div class="table-shell">
        <table class="story-table">
          <thead>
          <tr>
            <th>Program</th>
            <th>Cases</th>
            <th>Status</th>
            <th>Region</th>
            <th>SLA</th>
          </tr>
          </thead>
          <tbody>
            @if (pagedRows.length > 0) {
              @for (row of pagedRows; track row.program) {
                <tr>
                  <td><strong>{{ row.program }}</strong></td>
                  <td>{{ row.cases }}</td>
                  <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
                  <td>{{ row.region }}</td>
                  <td>{{ row.sla }}%</td>
                </tr>
              }
            } @else {
              <tr>
                <td colspan="5">No programs match the current filters.</td>
              </tr>
            }
          </tbody>
        </table>
        <ps-paginator
          ariaLabel="Story program pagination"
          itemLabel="programs"
          [totalRecords]="filteredRows.length"
          [(currentPage)]="currentPage"
          [(rowsPerPage)]="rowsPerPage"
          [rowsPerPageOptions]="[5, 10, 15]"
        />
      </div>
    </main>
  `,
  styles: `
    .storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}
    .story-header{display:grid;gap:.5rem}
    .toolbar{display:flex;flex-wrap:wrap;gap:1rem;align-items:end;justify-content:space-between}
    .toolbar div{display:grid;gap:.25rem}
    input{min-height:2.5rem;min-width:min(100%,20rem);padding:.6rem .75rem;border:1px solid var(--p-content-border-color);border-radius:.5rem;background:var(--p-content-background);color:var(--p-text-color)}
    .table-shell{display:grid;gap:1rem}
    .story-table{width:100%;border-collapse:collapse}
    .story-table th,.story-table td{padding:.8rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}
    .story-table th{background:color-mix(in srgb,var(--p-content-background) 86%,var(--p-primary-color));font-size:.8rem;text-transform:uppercase}
  `,
})
class TablePaginatorAcceptanceStoryComponent {
  readonly rows = rows;
  query = '';
  currentPage = 1;
  rowsPerPage = 5;

  get filteredRows(): Row[] {
    const query = this.query.trim().toLowerCase();
    if (!query) {
      return this.rows;
    }

    return this.rows.filter((row) =>
      [row.program, row.status, row.region, String(row.cases), String(row.sla)].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }

  get pagedRows(): Row[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredRows.slice(start, start + this.rowsPerPage);
  }

  onQueryChange(query: string): void {
    this.query = query;
    this.currentPage = 1;
  }

  severity(status: Row['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }
}

@Component({
  selector: 'public-table-paginator-stress-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicPaginatorComponent, PublicTagComponent],
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
          (buttonClick)="toggleLoading()"
        />
        <ps-button
          [label]="showEmpty ? 'Restore dataset' : 'Show empty dataset'"
          icon="pi pi-inbox"
          [outlined]="true"
          (buttonClick)="toggleEmpty()"
        />
      </div>

      <div class="table-shell" [attr.aria-busy]="loading">
        @if (loading) {
          <div class="loading-banner" aria-live="polite">
            <strong>Loading table rows...</strong>
            <span>Stress state is active so the table stays in a visible loading mode.</span>
          </div>
        }
        <table class="story-table">
          <thead>
          <tr>
            <th>Program</th>
            <th>Cases</th>
            <th>Status</th>
            <th>Region</th>
            <th>SLA</th>
          </tr>
          </thead>
          <tbody>
            @if (loading) {
              @for (row of loadingRows; track row) {
                <tr>
                  <td colspan="5" class="loading-cell">Loading table rows...</td>
                </tr>
              }
            } @else if (activePagedRows.length > 0) {
              @for (row of activePagedRows; track row.program) {
                <tr>
                  <td><strong>{{ row.program }}</strong></td>
                  <td>{{ row.cases }}</td>
                  <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
                  <td>{{ row.region }}</td>
                  <td>{{ row.sla }}%</td>
                </tr>
              }
            } @else {
              <tr>
                <td colspan="5">No programs are available for the selected reporting period.</td>
              </tr>
            }
          </tbody>
        </table>
        <ps-paginator
          ariaLabel="Stress story pagination"
          itemLabel="programs"
          [totalRecords]="activeRows.length"
          [(currentPage)]="currentPage"
          [(rowsPerPage)]="rowsPerPage"
          [rowsPerPageOptions]="[5, 10, 15]"
        />
      </div>
    </main>
  `,
  styles: `
    .storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}
    .story-header{display:grid;gap:.5rem}
    .toolbar{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}
    .toolbar--actions{justify-content:flex-start}
    .table-shell{display:grid;gap:1rem}
    .story-table{width:100%;border-collapse:collapse}
    .story-table th,.story-table td{padding:.8rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}
    .story-table th{background:color-mix(in srgb,var(--p-content-background) 86%,var(--p-primary-color));font-size:.8rem;text-transform:uppercase}
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

    return this.showEmpty ? [] : this.rows;
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
  title: 'Design System/Acceptance/Table Paginator',
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
