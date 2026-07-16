import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicPaginatorComponent } from '@public-sector/ui-patterns';
const meta: Meta<PublicPaginatorComponent> = { title: 'Design System/Components/Paginator', component: PublicPaginatorComponent, args: { totalRecords: 127, currentPage: 1, rowsPerPage: 10, rowsPerPageOptions: [5,10,25,50], itemLabel: 'applications', ariaLabel: 'Application results pagination', rowsPerPageLabel: 'Applications per page' }, parameters: { layout: 'fullscreen', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicPaginatorComponent>;
export const FirstPage: Story = {};
export const MiddlePage: Story = { args: { currentPage: 6 } };
export const LastPage: Story = { args: { currentPage: 13 } };
export const EmptyDataset: Story = { args: { totalRecords: 0, currentPage: 1 } };
export const SinglePage: Story = { args: { totalRecords: 4, rowsPerPage: 10 } };
export const CustomLanguage: Story = { args: { totalRecords: 86, itemLabel: 'service requests', ariaLabel: 'Service request pages', rowsPerPageLabel: 'Requests shown per page' } };
export const MobileResponsive: Story = { args: { totalRecords: 9876, currentPage: 42, rowsPerPage: 25 }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
@Component({ selector: 'paginator-model-proof', standalone: true, imports: [PublicPaginatorComponent], template: `<ps-paginator [totalRecords]="83" [(currentPage)]="page" [(rowsPerPage)]="rows" itemLabel="cases" /><output aria-live="polite">Consumer model: page {{page}}, {{rows}} rows</output>`, styles: `:host{display:grid;gap:1rem;padding:1rem}` }) class PaginatorModelProof { page=1; rows=5; }
export const ModelInteraction: StoryObj<PaginatorModelProof> = { render: () => ({ moduleMetadata: { imports: [PaginatorModelProof] }, template: '<paginator-model-proof />' }) };
