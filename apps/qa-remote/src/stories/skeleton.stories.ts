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
