import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface ProgramRow {
  program: string;
  cases: number;
  status: 'On track' | 'Watch' | 'Delayed';
  region: string;
  sla: number;
}

@Component({
  selector: 'public-table-paginator-acceptance-story',
  standalone: true,
  imports: [TableModule, TagModule],
  template: `
    <section class="acceptance-story">
      <header>
        <p-tag value="Acceptance: Table / Paginator" severity="info" />
        <h1>Table and paginator acceptance states</h1>
        <p>Proves sortable columns, column filters, current page report, and rows-per-page options.</p>
      </header>

      <p-table
        #programTable
        [value]="rows"
        styleClass="p-datatable-gridlines"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 25]"
        paginatorDropdownAppendTo="body"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first}-{last} of {totalRecords}"
        [globalFilterFields]="['program', 'status', 'region']"
        sortField="cases"
        [sortOrder]="-1"
      >
        <ng-template pTemplate="caption">
          <div class="table-toolbar">
            <div>
              <strong>Program performance</strong>
              <span>Sort, filter, and page through active public programs.</span>
            </div>
            <input
              type="search"
              placeholder="Search programs"
              aria-label="Search program performance"
              (input)="programTable.filterGlobal($any($event.target).value, 'contains')"
            />
          </div>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="program">Program <p-sortIcon field="program" /></th>
            <th pSortableColumn="cases">Cases <p-sortIcon field="cases" /></th>
            <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
            <th pSortableColumn="region">Region <p-sortIcon field="region" /></th>
            <th pSortableColumn="sla">SLA <p-sortIcon field="sla" /></th>
          </tr>
          <tr>
            <th><p-columnFilter field="program" type="text" matchMode="contains" placeholder="Filter program" [showMenu]="false" /></th>
            <th><p-columnFilter field="cases" type="numeric" matchMode="gte" placeholder="Min cases" [showMenu]="false" /></th>
            <th><p-columnFilter field="status" type="text" matchMode="contains" placeholder="Filter status" [showMenu]="false" /></th>
            <th><p-columnFilter field="region" type="text" matchMode="contains" placeholder="Filter region" [showMenu]="false" /></th>
            <th><p-columnFilter field="sla" type="numeric" matchMode="gte" placeholder="Min SLA" [showMenu]="false" /></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td><strong>{{ row.program }}</strong></td>
            <td>{{ row.cases }}</td>
            <td><p-tag [value]="row.status" [severity]="severity(row.status)" /></td>
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

      <article>
        <h2>Acceptance checks</h2>
        <ul>
          <li>Rows-per-page options expose 5, 10, and 25.</li>
          <li>Current page report explains the visible row range.</li>
          <li>Sortable headers and filters are visible and keyboard reachable.</li>
          <li>Empty message appears when filters remove all rows.</li>
        </ul>
      </article>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 76rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 7%, transparent);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p,
    li {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0 1rem;
    }

    .table-toolbar div {
      display: grid;
      gap: 0.25rem;
    }

    .table-toolbar span {
      color: var(--p-text-muted-color);
    }

    input {
      min-height: 2.5rem;
      padding: 0.6rem 0.8rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-border-radius-md);
      background: var(--p-content-background);
      color: var(--p-text-color);
      font: inherit;
    }

    @media (max-width: 900px) {
      .table-toolbar {
        align-items: stretch;
        flex-direction: column;
      }
    }
  `,
})
class TablePaginatorAcceptanceStoryComponent {
  readonly rows: ProgramRow[] = [
    { program: 'Housing assistance', cases: 428, status: 'On track', region: 'North Region', sla: 96 },
    { program: 'Small business grants', cases: 183, status: 'Watch', region: 'Central Region', sla: 87 },
    { program: 'Permit inspections', cases: 72, status: 'Delayed', region: 'South Region', sla: 68 },
    { program: 'Benefits renewal', cases: 316, status: 'On track', region: 'North Region', sla: 94 },
    { program: 'Document intake', cases: 241, status: 'Watch', region: 'Central Region', sla: 82 },
    { program: 'Transit assistance', cases: 137, status: 'On track', region: 'East Region', sla: 91 },
    { program: 'Child care subsidy', cases: 205, status: 'Delayed', region: 'West Region', sla: 73 },
    { program: 'Emergency housing', cases: 94, status: 'Watch', region: 'South Region', sla: 79 },
    { program: 'License review', cases: 158, status: 'On track', region: 'East Region', sla: 93 },
    { program: 'Food assistance', cases: 376, status: 'On track', region: 'West Region', sla: 95 },
    { program: 'Veteran services', cases: 121, status: 'Watch', region: 'Central Region', sla: 84 },
    { program: 'Public records', cases: 67, status: 'Delayed', region: 'North Region', sla: 70 },
  ];

  severity(status: ProgramRow['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }
}

const meta: Meta<TablePaginatorAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Table and Paginator',
  component: TablePaginatorAcceptanceStoryComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<TablePaginatorAcceptanceStoryComponent>;

export const SortFilterAndPage: Story = {};

@Component({
  selector: 'public-table-paginator-stress-story',
  standalone: true,
  imports: [TableModule, TagModule],
  template: `
    <section class="acceptance-story">
      <header>
        <p-tag value="Stress: Table / Paginator" severity="warn" />
        <h1>Loading and empty table states</h1>
        <p>Checks skeleton loading, empty dataset messaging, and long cell content wrapping.</p>
      </header>

      <div class="story-grid">
        <article>
          <h2>Loading state</h2>
          <p-table [value]="[]" [loading]="true" styleClass="p-datatable-gridlines">
            <ng-template pTemplate="header">
              <tr>
                <th>Program</th>
                <th>Cases</th>
                <th>Status</th>
              </tr>
            </ng-template>
          </p-table>
        </article>

        <article>
          <h2>Empty dataset</h2>
          <p-table [value]="[]" styleClass="p-datatable-gridlines">
            <ng-template pTemplate="header">
              <tr>
                <th>Program</th>
                <th>Cases</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="3">No programs are available for the selected reporting period.</td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      </div>

      <article>
        <h2>Long cell content</h2>
        <p-table [value]="longRows" styleClass="p-datatable-gridlines">
          <ng-template pTemplate="header">
            <tr>
              <th>Program</th>
              <th>Notes</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td><strong>{{ row.program }}</strong></td>
              <td>{{ row.notes }}</td>
            </tr>
          </ng-template>
        </p-table>
      </article>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 76rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .story-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
class TablePaginatorStressStoryComponent {
  readonly longRows = [
    {
      program: 'Emergency housing relocation assistance',
      notes:
        'This row intentionally includes long narrative content to verify wrapping, row height, and readable contrast when case notes exceed one line in a dense reporting table.',
    },
  ];
}

export const LoadingAndEmpty: StoryObj<TablePaginatorStressStoryComponent> = {
  render: () => ({
    template: '<public-table-paginator-stress-story />',
    moduleMetadata: {
      imports: [TablePaginatorStressStoryComponent],
    },
  }),
};

