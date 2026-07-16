import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicTooltipComponent, type PublicTooltipPosition } from '@public-sector/ui-patterns';
const meta: Meta<PublicTooltipComponent> = { title: 'Design System/Components/Tooltip', component: PublicTooltipComponent, args: { label: 'Eligibility help', text: 'Explains how verified income affects program eligibility.', position: 'top' }, argTypes: { position: { control: 'select', options: ['top','right','bottom','left'] satisfies PublicTooltipPosition[] } }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicTooltipComponent>;
export const HoverAndFocus: Story = {};
export const LongText: Story = { args: { label: 'Documentation requirements', text: 'Provide current documentation from an authoritative source. Files must be readable and include the applicant name, applicable dates, and issuing organization.' } };
export const EmptyText: Story = { args: { label: 'No supplemental guidance', text: '' } };
@Component({ selector: 'tooltip-position-matrix', standalone: true, imports: [PublicTooltipComponent], template: `<main>@for(position of positions;track position){<ps-tooltip [label]="position + ' tooltip'" [text]="'Tooltip positioned on the ' + position" [position]="position" />}</main>`, styles: `main{display:grid;grid-template-columns:repeat(2,max-content);gap:5rem;padding:5rem}` }) class TooltipPositionMatrix { positions: PublicTooltipPosition[]=['top','right','bottom','left']; }
export const PositionMatrix: StoryObj<TooltipPositionMatrix> = { render: () => ({ moduleMetadata: { imports: [TooltipPositionMatrix] }, template: '<tooltip-position-matrix />' }), parameters: { layout: 'fullscreen' } };
export const MobileFocus: Story = { args: { label: 'Tap or focus for help', text: 'Tooltip content supports both pointer and keyboard interaction.', position: 'bottom' }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const DisabledControlGuidance: Story = { render: () => ({ moduleMetadata: { imports: [PublicTooltipComponent] }, template: `<main><button disabled>Submit determination</button><ps-tooltip label="Why submission is unavailable" text="Complete identity verification before submitting. Essential guidance is also visible beside the disabled control." /><p>Complete identity verification before submitting.</p></main>` }) };
