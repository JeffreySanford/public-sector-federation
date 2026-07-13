import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicTagComponent } from '@public-sector/ui-patterns';

interface Row { program: string; cases: number; status: 'On track' | 'Watch' | 'Delayed'; region: string; sla: number }

const rows: Row[] = [
  { program: 'Housing assistance', cases: 428, status: 'On track', region: 'North', sla: 96 },
  { program: 'Small business grants', cases: 183, status: 'Watch', region: 'Central', sla: 87 },
  { program: 'Permit inspections', cases: 72, status: 'Delayed', region: 'South', sla: 68 },
  { program: 'Benefits renewal', cases: 316, status: 'On track', region: 'North', sla: 94 },
];

@Component({
  selector: 'public-table-paginator-acceptance-story',
  standalone: true,
  imports: [PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Acceptance: Table / Paginator" tone="info" /><h1>Table evidence</h1></header>
      <table>
        <thead><tr><th>Program</th><th>Cases</th><th>Status</th><th>Region</th><th>SLA</th></tr></thead>
        <tbody>@for (row of rows; track row.program) { <tr><td>{{ row.program }}</td><td>{{ row.cases }}</td><td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td><td>{{ row.region }}</td><td>{{ row.sla }}%</td></tr> }</tbody>
      </table>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}`,
})
class TablePaginatorAcceptanceStoryComponent {
  readonly rows = rows;
  severity(status: Row['status']): 'success' | 'warn' | 'danger' { return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger'; }
}

@Component({
  selector: 'public-table-paginator-stress-story',
  standalone: true,
  imports: [PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Stress: Table / Paginator" tone="warn" /><h1>Loading, empty, and long rows</h1></header>
      <section class="grid"><article><strong>Loading</strong><p>Loading table rows...</p></article><article><strong>Empty</strong><p>No programs match the current filters.</p></article></section>
      <table><thead><tr><th>Program</th><th>Status</th></tr></thead><tbody>@for (row of rows; track row.program) { <tr><td>{{ row.program }}</td><td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td></tr> }</tbody></table>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}article{padding:1rem;border:1px solid var(--p-content-border-color);border-radius:.5rem}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}`,
})
class TablePaginatorStressStoryComponent extends TablePaginatorAcceptanceStoryComponent {}

const meta: Meta<TablePaginatorAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Table Paginator',
  render: () => ({ moduleMetadata: { imports: [TablePaginatorAcceptanceStoryComponent] }, template: '<public-table-paginator-acceptance-story />' }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<TablePaginatorAcceptanceStoryComponent>;
export const SortFilterAndPage: Story = {};
export const LoadingAndEmpty: StoryObj<TablePaginatorStressStoryComponent> = {
  render: () => ({ moduleMetadata: { imports: [TablePaginatorStressStoryComponent] }, template: '<public-table-paginator-stress-story />' }),
};
