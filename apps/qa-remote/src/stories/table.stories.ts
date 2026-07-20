import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicTableColumn, PublicTableComponent, PublicTagComponent } from '@public-sector/ui-patterns';

const caseColumns: PublicTableColumn[] = [
  { key: 'case', header: 'Case', sortable: true },
  { key: 'applicant', header: 'Applicant', sortable: true },
  { key: 'program', header: 'Program' },
  { key: 'status', header: 'Status' },
  { key: 'due', header: 'Due', align: 'end' },
];

const meta: Meta<PublicTableComponent> = {
  title: 'Design System/Components/Table',
  component: PublicTableComponent,
  args: {
    columns: caseColumns,
    ariaLabel: 'Case queue',
    caption: '',
    empty: false,
    emptyMessage: 'No results found.',
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Column key, header text, sortability, and alignment.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the keyboard-scrollable overflow region.',
    },
    caption: {
      control: 'text',
      description: 'Optional visible table caption.',
    },
    empty: {
      control: 'boolean',
      description: 'Renders the built-in empty-state row instead of projected content.',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message shown by the built-in empty-state row.',
    },
  },
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Native governed table shell with sortable headers, a keyboard-focusable overflow region, and a built-in empty state. Row content, including status tags and row actions, remains consumer-authored via content projection.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicTableComponent>;

@Component({
  selector: 'table-default-proof',
  standalone: true,
  imports: [PublicTableComponent, PublicTagComponent],
  template: `
    <ps-table [columns]="columns" ariaLabel="Case queue">
      <tr>
        <td>PS-2026-1042</td>
        <td>Jordan Avery</td>
        <td>Benefits renewal</td>
        <td><ps-tag value="Review" tone="warn" /></td>
        <td>Today</td>
      </tr>
      <tr>
        <td>PS-2026-1043</td>
        <td>Sam Rivera</td>
        <td>Housing assistance</td>
        <td><ps-tag value="Ready" tone="success" /></td>
        <td>Tomorrow</td>
      </tr>
    </ps-table>
  `,
})
class TableDefaultProof {
  readonly columns = caseColumns;
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableDefaultProof] },
    template: '<table-default-proof />',
  }),
};

@Component({
  selector: 'table-sortable-proof',
  standalone: true,
  imports: [PublicTableComponent],
  template: `
    <main aria-labelledby="sortableTableTitle">
      <h1 id="sortableTableTitle">Sortable case queue</h1>
      <ps-table [columns]="columns" ariaLabel="Case queue" [(sortKey)]="sortKey" [(sortDirection)]="sortDirection">
        <tr>
          <td>PS-2026-1042</td>
          <td>Jordan Avery</td>
        </tr>
      </ps-table>
      <output aria-live="polite">Sort: {{ sortKey ?? 'none' }} {{ sortDirection }}</output>
    </main>
  `,
  styles: `
    h1 {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
})
class TableSortableProof {
  readonly columns: PublicTableColumn[] = [
    { key: 'case', header: 'Case', sortable: true },
    { key: 'applicant', header: 'Applicant', sortable: true },
  ];
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
}

export const Sortable: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableSortableProof] },
    template: '<table-sortable-proof />',
  }),
};

@Component({
  selector: 'table-row-actions-proof',
  standalone: true,
  imports: [PublicTableComponent, PublicTagComponent, PublicButtonComponent],
  template: `
    <ps-table
      [columns]="[{ key: 'case', header: 'Case' }, { key: 'status', header: 'Status' }, { key: 'actions', header: 'Actions', align: 'end' }]"
      ariaLabel="Case queue with actions"
    >
      <tr>
        <td>PS-2026-1042</td>
        <td><ps-tag value="Review" tone="warn" /></td>
        <td><ps-button label="Open" appearance="text" /></td>
      </tr>
    </ps-table>
  `,
})
class TableRowActionsProof {}

export const WithRowActions: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableRowActionsProof] },
    template: '<table-row-actions-proof />',
  }),
};

export const Empty: Story = {
  args: { empty: true },
  render: (args) => ({
    props: { ...args, columns: caseColumns },
    moduleMetadata: { imports: [PublicTableComponent] },
    template: `<ps-table [columns]="columns" [empty]="empty" [emptyMessage]="emptyMessage" ariaLabel="Case queue" />`,
  }),
};

export const LongContent: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicTableComponent] },
    template: `
      <ps-table
        [columns]="[{ key: 'program', header: 'Regional processing and service-delivery office' }, { key: 'owner', header: 'Owner' }]"
        ariaLabel="Long-content table"
      >
        <tr>
          <td>Northwest multi-county eligibility and document-verification center</td>
          <td>Jordan Avery</td>
        </tr>
      </ps-table>
    `,
  }),
};

export const MobileOverflow: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => ({
    moduleMetadata: { imports: [TableDefaultProof] },
    template: '<table-default-proof />',
  }),
};
