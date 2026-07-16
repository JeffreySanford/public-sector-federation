import type { Meta, StoryObj } from '@storybook/angular';
import { PublicPageHeaderComponent } from '@public-sector/ui-patterns';
const meta: Meta<PublicPageHeaderComponent> = { title: 'Design System/Components/Page Header', component: PublicPageHeaderComponent, args: { eyebrow: 'Benefits administration', title: 'Application review queue', description: 'Review eligibility evidence, resolve exceptions, and record final determinations.' }, parameters: { layout: 'fullscreen', a11y: { test: 'error' } } };
export default meta;
type Story = StoryObj<PublicPageHeaderComponent>;
export const Default: Story = {};
export const TitleOnly: Story = { args: { eyebrow: '', title: 'Program settings', description: '' } };
export const WithoutEyebrow: Story = { args: { eyebrow: '', title: 'Quarterly service delivery report', description: 'Operational performance across participating agencies and delivery channels.' } };
export const LongResponsiveHeading: Story = { args: { eyebrow: 'Cross-agency eligibility operations', title: 'Applications requiring additional identity and supporting-document verification', description: 'Prioritize cases approaching their statutory response deadline while preserving an accessible and auditable review trail.' }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
