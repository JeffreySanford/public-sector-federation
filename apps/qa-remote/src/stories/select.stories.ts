import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicSelectComponent, type PublicSelectOption } from '@public-sector/ui-patterns';
const options: PublicSelectOption[] = [{ label: 'Housing assistance', value: 'housing' }, { label: 'Food assistance', value: 'food' }, { label: 'Child care subsidy', value: 'childcare' }, { label: 'Archived pilot program', value: 'archive', disabled: true }];
const meta: Meta<PublicSelectComponent> = { title: 'Design System/Components/Select', component: PublicSelectComponent, args: { label: 'Program', placeholder: 'Choose a program', options, value: null, disabled: false }, argTypes: { value: { control: 'select', options: [null, 'housing', 'food', 'childcare'] }, disabled: { control: 'boolean' } }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicSelectComponent>;
export const Interactive: Story = {};
export const Selected: Story = { args: { value: 'housing' } };
export const Disabled: Story = { args: { value: 'food', disabled: true } };
export const EmptyOptions: Story = { args: { label: 'Assigned reviewer', options: [], placeholder: 'No reviewers available' } };
export const LongOptions: Story = { args: { label: 'Regional processing and service-delivery office', options: [{ label: 'Northwest multi-county eligibility and document-verification center', value: 'nw' }, { label: 'Central metropolitan expedited-benefits processing office', value: 'central' }] }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
@Component({ selector: 'select-model-proof', standalone: true, imports: [PublicSelectComponent], template: `<ps-select label="Communication preference" [options]="options" [(value)]="value" /><output aria-live="polite">Selected value: {{value ?? 'none'}}</output>`, styles: `:host{display:grid;gap:1rem}` }) class SelectModelProof { value: string|null=null; options=[{label:'Email',value:'email'},{label:'Postal mail',value:'mail'},{label:'Telephone',value:'phone'}]; }
export const ModelBinding: StoryObj<SelectModelProof> = { render: () => ({ moduleMetadata: { imports: [SelectModelProof] }, template: '<select-model-proof />' }) };
