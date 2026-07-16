import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ComponentRegistryDashboardComponent } from './component-registry-dashboard.component';

const meta: Meta<ComponentRegistryDashboardComponent> = {
  title: 'Design System/Registry/Component Manifest',
  component: ComponentRegistryDashboardComponent,
  decorators: [moduleMetadata({ imports: [ComponentRegistryDashboardComponent] })],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ComponentRegistryDashboardComponent] },
    template: `
      <ps-component-registry-dashboard
        [mode]="mode"
        [focusId]="focusId"
      />
    `,
  }),
  args: {
    mode: 'overview',
    focusId: 'ps-up-button',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['overview', 'health', 'lifecycle', 'providers', 'accessibility', 'documentation', 'detail', 'promotion'],
      description: 'Selects the manifest projection shown by the dashboard.',
    },
    focusId: {
      control: 'select',
      options: [
        'ps-button',
        'ps-up-button',
        'ps-card',
        'ps-dialog',
        'ps-empty-state',
        'ps-form-section',
        'ps-menu',
        'ps-paginator',
        'ps-page-header',
        'ps-popover',
        'ps-progress',
        'ps-select',
        'ps-skeleton',
        'ps-status-card',
        'ps-tag',
        'ps-toast',
        'ps-tooltip',
        'public-toast-service',
      ],
      description: 'Selects the entry rendered by the Component Detail projection.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
    },
    docs: {
      description: {
        component:
          'Manifest-driven operational view of the public ui-patterns registry. The stories render the shared metadata source; they do not maintain lifecycle or evidence status independently.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ComponentRegistryDashboardComponent>;

export const Overview: Story = {};

export const ManifestHealth: Story = {
  args: { mode: 'health' },
};

export const LifecycleStatus: Story = {
  args: { mode: 'lifecycle' },
};

export const ProviderBoundaries: Story = {
  args: { mode: 'providers' },
};

export const AccessibilityCoverage: Story = {
  args: { mode: 'accessibility' },
};

export const DocumentationReadiness: Story = {
  args: { mode: 'documentation' },
};

export const ComponentDetail: Story = {
  args: { mode: 'detail', focusId: 'ps-up-button' },
};

export const UpButtonPromotionReadiness: Story = {
  args: { mode: 'promotion', focusId: 'ps-up-button' },
};
