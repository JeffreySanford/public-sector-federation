import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicSkeletonComponent } from '@public-sector/ui-patterns';
const meta: Meta<PublicSkeletonComponent> = { title: 'Design System/Components/Skeleton', component: PublicSkeletonComponent, args: { height: '1rem' }, argTypes: { height: { control: 'text' } }, parameters: { layout: 'centered', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicSkeletonComponent>;
export const TextLine: Story = { decorators: [(story) => ({ ...story(), styles: ['ps-skeleton{display:block;width:min(36rem,80vw)}'] })] };
export const Heading: Story = { args: { height: '2.5rem' } };
export const MediaBlock: Story = { args: { height: '14rem' } };
@Component({ selector: 'skeleton-card', standalone: true, imports: [PublicSkeletonComponent], template: `<article aria-label="Loading application summary"><ps-skeleton height="8rem" /><ps-skeleton height="2rem" /><ps-skeleton /><ps-skeleton /><ps-skeleton height="2.75rem" /></article>`, styles: `article{display:grid;gap:.75rem;width:min(28rem,85vw);padding:1rem;border:1px solid var(--p-content-border-color);border-radius:1rem}` }) class SkeletonCard {}
export const CompositeLoadingCard: StoryObj<SkeletonCard> = { render: () => ({ moduleMetadata: { imports: [SkeletonCard] }, template: '<skeleton-card />' }) };
export const RepeatedTableRows: Story = { render: () => ({ moduleMetadata: { imports: [PublicSkeletonComponent] }, template: `<main aria-label="Loading table rows">@for(row of [1,2,3,4,5];track row){<div><ps-skeleton height="1.25rem" /><ps-skeleton height="1.25rem" /><ps-skeleton height="1.25rem" /></div>}</main>`, styles: [`main{display:grid;gap:1rem;width:min(54rem,90vw)}div{display:grid;grid-template-columns:2fr 1fr 1fr;gap:1rem}`] }) };
