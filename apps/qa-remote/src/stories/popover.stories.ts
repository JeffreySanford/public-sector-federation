import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicPopoverComponent } from '@public-sector/ui-patterns';
@Component({ selector: 'popover-standard', standalone: true, imports: [PublicPopoverComponent], template: `<ps-popover [label]="label" [icon]="icon"><strong>{{heading}}</strong><p>{{content}}</p></ps-popover>` }) class PopoverStandard { label='View eligibility details'; icon='pi pi-info-circle'; heading='Eligibility calculation'; content='Household size and verified monthly income place this application within the program threshold.'; }
const meta: Meta<PopoverStandard> = { title: 'Design System/Components/Popover', component: PopoverStandard, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PopoverStandard>;
export const Interactive: Story = {};
export const ShortContent: Story = { render: () => ({ moduleMetadata: { imports: [PublicPopoverComponent] }, template: `<ps-popover label="Status definition"><strong>Pending</strong><span>Work has not started.</span></ps-popover>` }) };
export const StructuredContent: Story = { render: () => ({ moduleMetadata: { imports: [PublicPopoverComponent] }, template: `<ps-popover label="Review checklist" icon="pi pi-list-check"><strong>Before approval</strong><ul><li>Verify identity</li><li>Confirm household composition</li><li>Review income evidence</li></ul></ps-popover>` }) };
export const LongWrappingContent: Story = { render: () => ({ moduleMetadata: { imports: [PublicPopoverComponent] }, template: `<ps-popover label="Read full policy note"><strong>Cross-program verification note</strong><p>This determination uses authoritative information supplied by multiple participating agencies. Resolve conflicting records before completing the review and document the source used for the final decision.</p></ps-popover>` }), parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const KeyboardTrigger: Story = { render: () => ({ moduleMetadata: { imports: [PublicPopoverComponent] }, template: `<main><p>Tab to the trigger and press Enter or Space.</p><ps-popover label="Keyboard-accessible details"><span>Overlay content remains available from the keyboard.</span></ps-popover></main>` }) };
