import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { PublicButtonComponent, PublicTagComponent } from '@public-sector/ui-patterns';

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
  imports: [TableModule, PublicTagComponent],
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

      <p-table
        [value]="filteredRows"
        [paginator]="true"
        [rows]="rowsPerPage"
        [first]="first"
        [rowsPerPageOptions]="[5, 10, 15]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        [tableStyleClass]="'story-table'"
        (firstChange)="first = $event"
        (rowsChange)="rowsPerPage = $event"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Program</th>
            <th>Cases</th>
            <th>Status</th>
            <th>Region</th>
            <th>SLA</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td><strong>{{ row.program }}</strong></td>
            <td>{{ row.cases }}</td>
            <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
            <td>{{ row.region }}</td>
            <td>{{ row.sla }}%</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5">No programs match the current filters.</td>
          </tr>
        </ng-template>
      </p-table>
    </main>
  `,
  styles: `
    .storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}
    .story-header{display:grid;gap:.5rem}
    .toolbar{display:flex;flex-wrap:wrap;gap:1rem;align-items:end;justify-content:space-between}
    .toolbar div{display:grid;gap:.25rem}
    input{min-height:2.5rem;min-width:min(100%,20rem);padding:.6rem .75rem;border:1px solid var(--p-content-border-color);border-radius:.5rem;background:var(--p-content-background);color:var(--p-text-color)}
  `,
})
class TablePaginatorAcceptanceStoryComponent {
  readonly rows = rows;
  query = '';
  first = 0;
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

  onQueryChange(query: string): void {
    this.query = query;
    this.first = 0;
  }

  severity(status: Row['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }
}

@Component({
  selector: 'public-table-paginator-stress-story',
  standalone: true,
  imports: [TableModule, PublicButtonComponent, PublicTagComponent],
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

      <p-table
        [value]="activeRows"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 15]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        [loading]="loading"
        [showLoader]="true"
        [tableStyleClass]="'story-table'"
      >
        <ng-template pTemplate="caption">
          @if (loading) {
            <div class="loading-banner" aria-live="polite">
              <strong>Loading table rows...</strong>
              <span>Stress state is active so the table stays in a visible loading mode.</span>
            </div>
          }
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>Program</th>
            <th>Cases</th>
            <th>Status</th>
            <th>Region</th>
            <th>SLA</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="loadingbody">
          @for (row of loadingRows; track row) {
            <tr>
              <td colspan="5" class="loading-cell">Loading table rows...</td>
            </tr>
          }
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td><strong>{{ row.program }}</strong></td>
            <td>{{ row.cases }}</td>
            <td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td>
            <td>{{ row.region }}</td>
            <td>{{ row.sla }}%</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5">No programs are available for the selected reporting period.</td>
          </tr>
        </ng-template>
      </p-table>
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

    return this.showEmpty ? [] : this.rows;
  }

  toggleEmpty(): void {
    this.showEmpty = !this.showEmpty;
    this.first = 0;
  }

  toggleLoading(): void {
    this.loading = !this.loading;
    this.first = 0;
  }
}

const meta: Meta<TablePaginatorAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Table Paginator',
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
