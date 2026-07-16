import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicStatusCardComponent } from '@public-sector/ui-patterns';
const meta: Meta<PublicStatusCardComponent> = { title: 'Design System/Components/Status Card', component: PublicStatusCardComponent, args: { label: 'Applications reviewed', value: 1248, detail: 'Up 8% from the previous reporting period', status: 'On track', tone: 'success' }, argTypes: { tone: { control: 'select', options: ['neutral','info','success','warning','error','contrast'] } }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicStatusCardComponent>;
export const Default: Story = {};
export const WithoutStatus: Story = { args: { label: 'Open cases', value: 317, detail: 'Across all regional processing offices', status: '' } };
export const Warning: Story = { args: { label: 'Approaching deadline', value: 42, detail: 'Response required within two business days', status: 'Needs attention', tone: 'warning' } };
export const Critical: Story = { args: { label: 'Overdue determinations', value: 9, detail: 'Escalation and documented resolution required', status: 'Action required', tone: 'error' } };
export const LongContent: Story = { args: { label: 'Applications awaiting cross-agency identity verification', value: '1,024', detail: 'Includes cases paused for matching with authoritative records across participating state and federal services.', status: 'Monitoring', tone: 'info' }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
@Component({ selector: 'status-card-matrix', standalone: true, imports: [PublicStatusCardComponent], template: `<main>@for(card of cards;track card.label){<public-status-card [label]="card.label" [value]="card.value" [detail]="card.detail" [status]="card.status" [tone]="$any(card.tone)" />}</main>`, styles: `main{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:1rem;max-width:72rem}` }) class StatusCardMatrix { cards=[{label:'Received',value:812,detail:'This month',status:'Normal',tone:'neutral'},{label:'Approved',value:694,detail:'85.5% approval rate',status:'On track',tone:'success'},{label:'Exceptions',value:37,detail:'Manual review required',status:'Watch',tone:'warning'},{label:'Overdue',value:9,detail:'Outside target',status:'Action',tone:'error'}]; }
export const OperationalDashboard: StoryObj<StatusCardMatrix> = { render: () => ({ moduleMetadata: { imports: [StatusCardMatrix] }, template: '<status-card-matrix />' }), parameters: { layout: 'fullscreen' } };
