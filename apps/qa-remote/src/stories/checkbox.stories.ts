import type { Meta, StoryObj } from '@storybook/angular';
import { PublicCheckboxComponent } from '@public-sector/ui-patterns';

const meta: Meta<PublicCheckboxComponent> = {
  title: 'Design System/Components/Checkbox',
  component: PublicCheckboxComponent,
  args: {
    label: 'Expedite review',
    variant: 'checkbox',
    checked: false,
    disabled: false,
    required: false,
    invalid: false,
    helpText: '',
    errorText: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label and accessible name for the control.',
    },
    variant: {
      control: 'select',
      options: ['checkbox', 'switch'],
      description: 'Renders a checkbox or a switch-role toggle.',
    },
    checked: {
      control: 'boolean',
      description: 'Two-way boolean value model.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents focus and toggling when the control is unavailable.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the control as required in both visible and programmatic form guidance.',
    },
    invalid: {
      control: 'boolean',
      description: 'Exposes the invalid state on the native control.',
    },
    helpText: {
      control: 'text',
      description: 'Persistent guidance associated with the control.',
    },
    errorText: {
      control: 'text',
      description: 'Validation guidance associated with the control when invalid is true.',
    },
    fieldId: {
      control: 'text',
      description: 'Stable identifier used for label and description relationships.',
    },
  },
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Native governed checkbox and switch wrapper. It exposes a compact boolean value contract shared across product remotes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicCheckboxComponent>;

export const Default: Story = {};

export const Switch: Story = {
  args: {
    label: 'Audit logging',
    variant: 'switch',
  },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

export const RequiredWithHelp: Story = {
  args: {
    fieldId: 'required-acknowledgement',
    required: true,
    helpText: 'Confirm you have reviewed the applicant disclosure before submitting.',
  },
};

export const InvalidWithError: Story = {
  args: {
    fieldId: 'invalid-acknowledgement',
    required: true,
    invalid: true,
    helpText: 'Confirm you have reviewed the applicant disclosure before submitting.',
    errorText: 'Acknowledgement is required before continuing.',
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'I confirm that all required documents have been verified against the applicant file and match the current benefit period.',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
