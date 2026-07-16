import type { Meta, StoryObj } from '@storybook/angular';
import {
  PublicEmptyStateComponent,
  PublicFormSectionComponent,
  PublicMenuComponent,
  PublicPageHeaderComponent,
  PublicPopoverComponent,
  PublicProgressComponent,
  PublicSelectComponent,
  PublicSkeletonComponent,
  PublicStatusCardComponent,
  PublicTooltipComponent,
  type PublicMenuAction,
  type PublicSelectOption,
} from '@public-sector/ui-patterns';

const storyShell = `
  <main style="display:grid;gap:1.5rem;max-width:48rem;margin:0 auto;padding:2rem;color:var(--p-text-color)">
    <header>
      <p style="margin:0 0 .35rem;color:var(--p-text-muted-color);font-weight:700">Public wrapper contract</p>
      <h1 style="margin:0">{{ heading }}</h1>
    </header>
    <ng-content />
  </main>
`;

const meta: Meta = {
  title: 'Design System/Components/Public Wrappers',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Focused stories for public ui-patterns wrappers. Each story exercises the governed public API without reaching into its provider implementation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const EmptyState: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicEmptyStateComponent] },
    template: storyShell.replace('<ng-content />', '<public-empty-state title="No applications found" message="Try changing the current filters." actionLabel="Clear filters" />'),
    props: { heading: 'Empty State' },
  }),
};

export const FormSection: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicFormSectionComponent] },
    template: storyShell.replace('<ng-content />', `<public-form-section title="Applicant details" description="Fields marked required must be completed.">
      <label style="display:grid;gap:.35rem">Full name<input style="padding:.65rem" value="Taylor Morgan" /></label>
      <label style="display:grid;gap:.35rem">Reference number<input style="padding:.65rem" value="PS-1042" /></label>
    </public-form-section>`),
    props: { heading: 'Form Section' },
  }),
};

const menuActions: PublicMenuAction[] = [
  { label: 'View details', icon: 'pi pi-eye' },
  { label: 'Download record', icon: 'pi pi-download' },
  { label: 'Archive', icon: 'pi pi-box', disabled: true },
];

export const Menu: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicMenuComponent] },
    template: storyShell.replace('<ng-content />', '<ps-menu label="Record actions" [actions]="actions" />'),
    props: { heading: 'Menu', actions: menuActions },
  }),
};

export const PageHeader: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicPageHeaderComponent] },
    template: storyShell.replace('<ng-content />', '<public-page-header eyebrow="Benefits" title="Application overview" description="Review eligibility, submitted documents, and the current decision status." />'),
    props: { heading: 'Page Header' },
  }),
};

export const Popover: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicPopoverComponent] },
    template: storyShell.replace('<ng-content />', '<ps-popover label="Eligibility details"><strong>Eligibility period</strong><span>January 1–December 31, 2026</span></ps-popover>'),
    props: { heading: 'Popover' },
  }),
};

export const Progress: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicProgressComponent] },
    template: storyShell.replace('<ng-content />', '<div style="display:grid;gap:.5rem"><strong>Application completion</strong><ps-progress [value]="68" ariaLabel="Application completion: 68 percent" /><span>68% complete</span></div>'),
    props: { heading: 'Progress' },
  }),
};

const selectOptions: PublicSelectOption[] = [
  { label: 'Housing assistance', value: 'housing' },
  { label: 'Food assistance', value: 'food' },
  { label: 'Transit support', value: 'transit' },
  { label: 'Archived program', value: 'archived', disabled: true },
];

export const Select: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicSelectComponent] },
    template: storyShell.replace('<ng-content />', '<ps-select label="Program" placeholder="Choose a program" [options]="options" />'),
    props: { heading: 'Select', options: selectOptions },
  }),
};

export const Skeleton: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicSkeletonComponent] },
    template: storyShell.replace('<ng-content />', '<section aria-label="Loading application summary" aria-busy="true" style="display:grid;gap:.75rem"><ps-skeleton height="2rem" /><ps-skeleton height="1rem" /><ps-skeleton height="1rem" /></section>'),
    props: { heading: 'Skeleton' },
  }),
};

export const StatusCard: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicStatusCardComponent] },
    template: storyShell.replace('<ng-content />', '<public-status-card label="Applications reviewed" [value]="1284" detail="During the current reporting period" status="On track" severity="success" />'),
    props: { heading: 'Status Card' },
  }),
};

export const Tooltip: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicTooltipComponent] },
    template: storyShell.replace('<ng-content />', '<ps-tooltip label="About eligibility" text="Eligibility is recalculated when household information changes." position="right" />'),
    props: { heading: 'Tooltip' },
  }),
};
