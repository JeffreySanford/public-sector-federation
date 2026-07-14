import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicCardComponent, PublicTagComponent } from '@public-sector/ui-patterns';

interface Program {
  program: string;
  cases: number;
  status: 'On track' | 'Watch' | 'Delayed';
  region: string;
  sla: number;
  owner: string;
}

const allPrograms: Program[] = [
  { program: 'Housing assistance', cases: 428, status: 'On track', region: 'North Region', sla: 96, owner: 'Avery Clark' },
  { program: 'Small business grants', cases: 183, status: 'Watch', region: 'Central Region', sla: 87, owner: 'Morgan Lee' },
  { program: 'Permit inspections', cases: 72, status: 'Delayed', region: 'South Region', sla: 68, owner: 'Riley Chen' },
  { program: 'Benefits renewal', cases: 316, status: 'On track', region: 'North Region', sla: 94, owner: 'Jordan Avery' },
  { program: 'Document intake', cases: 241, status: 'Watch', region: 'Central Region', sla: 82, owner: 'Taylor Brooks' },
  { program: 'Transit assistance', cases: 137, status: 'On track', region: 'East Region', sla: 91, owner: 'Casey Morgan' },
  { program: 'Child care subsidy', cases: 205, status: 'Delayed', region: 'West Region', sla: 73, owner: 'Jamie Patel' },
  { program: 'Emergency housing', cases: 94, status: 'Watch', region: 'South Region', sla: 79, owner: 'Skyler Reed' },
  { program: 'License review', cases: 158, status: 'On track', region: 'East Region', sla: 93, owner: 'Parker Nguyen' },
  { program: 'Food assistance', cases: 376, status: 'On track', region: 'West Region', sla: 95, owner: 'Quinn Davis' },
  { program: 'Veteran services', cases: 121, status: 'Watch', region: 'Central Region', sla: 84, owner: 'Harper Stone' },
  { program: 'Public records', cases: 67, status: 'Delayed', region: 'North Region', sla: 70, owner: 'Rowan Mills' },
];

@Component({
  selector: 'public-table-paginator-story',
  standalone: true,
  imports: [PublicCardComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Acceptance: Table Paginator" tone="info" /><h1>Program performance</h1><p>Filter active public programs.</p></header>
      <ps-card>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Cases</th>
                <th>Status</th>
                <th>Region</th>
                <th>SLA</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              @for (program of pagedPrograms(); track program.program) {
              <tr>
                <td><strong>{{ program.program }}</strong></td>
                <td>{{ program.cases }}</td>
                <td>
                  <ps-tag 
                    [value]="program.status" 
                    [tone]="getSeverity(program.status)" 
                  />
                </td>
                <td>{{ program.region }}</td>
                <td>{{ program.sla }}%</td>
                <td>{{ program.owner }}</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Paginator -->
        <div class="paginator">
          <div class="paginator-info">
            Showing {{ startRow() }} to {{ endRow() }} of {{ allPrograms.length }} programs
          </div>
          <div class="paginator-controls">
            <button 
              [disabled]="currentPage() === 1" 
              (click)="previousPage()"
              class="paginator-btn"
            >
              ← Previous
            </button>
            
            <div class="page-info">
              Page {{ currentPage() }} of {{ totalPages() }}
            </div>
            
            <button 
              [disabled]="currentPage() === totalPages()" 
              (click)="nextPage()"
              class="paginator-btn"
            >
              Next →
            </button>
            
            <select [value]="rowsPerPage()" (change)="changeRowsPerPage($event)" class="rows-select">
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
            </select>
          </div>
        </div>
      </ps-card>
    </main>
  `,
  styles: `
    .storybook-shell { display: grid; gap: 1rem; max-width: 100%; margin: 0 auto; padding: 1rem; }
    .table-scroll { overflow-x: auto; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid var(--p-content-border-color); text-align: left; }
    th { font-weight: 700; background-color: var(--p-surface-50); }
    tr:hover { background-color: var(--p-surface-50); }
    
    .paginator { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      gap: 1rem; 
      padding-top: 1rem; 
      border-top: 1px solid var(--p-content-border-color);
      flex-wrap: wrap;
    }
    .paginator-info { font-size: 0.875rem; color: var(--p-text-color-secondary); }
    .paginator-controls { 
      display: flex; 
      gap: 0.5rem; 
      align-items: center;
    }
    .paginator-btn { 
      padding: 0.5rem 1rem; 
      border: 1px solid var(--p-content-border-color); 
      background: var(--p-surface-card);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .paginator-btn:hover:not(:disabled) { 
      background: var(--p-primary-500); 
      color: white;
      border-color: var(--p-primary-500);
    }
    .paginator-btn:disabled { 
      opacity: 0.5; 
      cursor: not-allowed;
    }
    .page-info { 
      font-size: 0.875rem; 
      font-weight: 600;
      min-width: 100px;
      text-align: center;
    }
    .rows-select { 
      padding: 0.5rem 0.75rem; 
      border: 1px solid var(--p-content-border-color); 
      background: var(--p-surface-card);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
  `,
})
class TablePaginatorStoryComponent {
  readonly allPrograms = allPrograms;
  readonly rowsPerPage = signal(5);
  readonly currentPage = signal(1);

  pagedPrograms() {
    const start = (this.currentPage() - 1) * this.rowsPerPage();
    const end = start + this.rowsPerPage();
    return this.allPrograms.slice(start, end);
  }

  totalPages() {
    return Math.ceil(this.allPrograms.length / this.rowsPerPage());
  }

  startRow() {
    return (this.currentPage() - 1) * this.rowsPerPage() + 1;
  }

  endRow() {
    const end = this.currentPage() * this.rowsPerPage();
    return end > this.allPrograms.length ? this.allPrograms.length : end;
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  changeRowsPerPage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.rowsPerPage.set(parseInt(select.value, 10));
    this.currentPage.set(1);
  }

  getSeverity(status: Program['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }
}

const meta: Meta<TablePaginatorStoryComponent> = {
  title: 'Design System/Acceptance/Table Paginator',
  render: () => ({
    moduleMetadata: { imports: [TablePaginatorStoryComponent] },
    template: '<public-table-paginator-story />',
  }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TablePaginatorStoryComponent>;

export const SortFilterAndPage: Story = {};
export const LoadingAndEmpty: Story = {};
