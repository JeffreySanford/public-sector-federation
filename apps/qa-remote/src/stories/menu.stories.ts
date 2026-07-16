import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicMenuComponent, type PublicMenuAction } from '@public-sector/ui-patterns';
const standardActions: PublicMenuAction[] = [{ label: 'View application', icon: 'pi pi-eye' }, { label: 'Assign reviewer', icon: 'pi pi-user-plus' }, { label: 'Download record', icon: 'pi pi-download' }, { label: 'Archive application', icon: 'pi pi-box', disabled: true }];
const meta: Meta<PublicMenuComponent> = { title: 'Design System/Components/Menu', component: PublicMenuComponent, args: { label: 'Application actions', icon: 'pi pi-ellipsis-v', actions: standardActions }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicMenuComponent>;
export const Interactive: Story = {};
export const EmptyMenu: Story = { args: { label: 'No available actions', actions: [] } };
export const DisabledAction: Story = { args: { actions: [{ label: 'Edit', icon: 'pi pi-pencil' }, { label: 'Delete protected record', icon: 'pi pi-trash', disabled: true }] } };
export const LongLabels: Story = { args: { label: 'Open case-management actions', actions: [{ label: 'Request additional identity verification documentation', icon: 'pi pi-file-plus' }, { label: 'Transfer to specialized eligibility determination unit', icon: 'pi pi-arrow-right-arrow-left' }] }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
@Component({ selector: 'menu-action-proof', standalone: true, imports: [PublicMenuComponent], template: `<ps-menu label="Record actions" [actions]="actions" /><output aria-live="polite">Last action: {{lastAction}}</output>`, styles: `:host{display:grid;gap:1rem}` }) class MenuActionProof { lastAction='none'; actions=[{label:'Approve',icon:'pi pi-check',action:()=>this.lastAction='Approve'},{label:'Return for correction',icon:'pi pi-replay',action:()=>this.lastAction='Return for correction'}]; }
export const CommandCallbacks: StoryObj<MenuActionProof> = { render: () => ({ moduleMetadata: { imports: [MenuActionProof] }, template: '<menu-action-proof />' }) };
