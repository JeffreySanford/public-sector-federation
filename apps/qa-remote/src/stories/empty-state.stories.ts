import type { Meta, StoryObj } from '@storybook/angular';
import { PublicEmptyStateComponent } from '@public-sector/ui-patterns';

const meta: Meta<PublicEmptyStateComponent> = {
  title: 'Design System/Components/Empty State', component: PublicEmptyStateComponent,
  args: { title: 'No applications found', message: 'Try changing the filters or create a new application.', icon: 'pi pi-inbox', actionLabel: 'Create application' },
  argTypes: { title: { control: 'text' }, message: { control: 'text' }, icon: { control: 'text' }, actionLabel: { control: 'text' } },
  parameters: { layout: 'centered', a11y: { test: 'error' } },
};
export default meta;
type Story = StoryObj<PublicEmptyStateComponent>;
export const Default: Story = {};
export const WithoutAction: Story = { args: { title: 'Nothing to review', message: 'Completed reviews will appear here.', actionLabel: '' } };
export const SearchResults: Story = { args: { title: 'No matching results', message: 'No programs match “regional housing verification”. Clear one or more filters and try again.', icon: 'pi pi-search', actionLabel: 'Clear filters' } };
export const LongContent: Story = { args: { title: 'No eligibility determinations are ready for supervisory review', message: 'Applications remain here until identity verification, supporting documentation, and program-specific validation have all completed successfully.', actionLabel: 'Review processing guidance' }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
