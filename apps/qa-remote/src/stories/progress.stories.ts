import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicProgressComponent } from '@public-sector/ui-patterns';
const meta: Meta<PublicProgressComponent> = { title: 'Design System/Components/Progress', component: PublicProgressComponent, args: { value: 42, ariaLabel: 'Application completion' }, argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } }, ariaLabel: { control: 'text' } }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicProgressComponent>;
export const Interactive: Story = { decorators: [(story) => ({ ...story(), styles: ['ps-progress{display:block;width:min(40rem,80vw)}'] })] };
export const Empty: Story = { args: { value: 0, ariaLabel: 'Not started' } };
export const Complete: Story = { args: { value: 100, ariaLabel: 'Complete' } };
@Component({ selector: 'progress-matrix', standalone: true, imports: [PublicProgressComponent], template: `<main>@for(item of items;track item.value){<label><span>{{item.label}} — {{item.value}}%</span><ps-progress [value]="item.value" [ariaLabel]="item.label" /></label>}</main>`, styles: `main{display:grid;gap:1.25rem;width:min(44rem,85vw)}label{display:grid;gap:.5rem;font-weight:700}` }) class ProgressMatrix { items=[{label:'Received',value:10},{label:'Verification',value:35},{label:'Supervisor review',value:72},{label:'Complete',value:100}]; }
export const LifecycleMatrix: StoryObj<ProgressMatrix> = { render: () => ({ moduleMetadata: { imports: [ProgressMatrix] }, template: '<progress-matrix />' }) };
