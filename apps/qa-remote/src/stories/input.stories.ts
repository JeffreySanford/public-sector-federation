import type { Meta, StoryObj } from '@storybook/angular';
import { PublicInputComponent } from '@public-sector/ui-patterns';

const meta: Meta<PublicInputComponent> = {
  title: 'Design System/Components/Input',
  component: PublicInputComponent,
  args: {
    label: 'Case ID',
    type: 'text',
    placeholder: '',
    value: '',
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
    type: {
      control: 'select',
      options: ['text', 'search', 'password', 'date'],
      description: 'Native input type rendered by the wrapper.',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt displayed before a value is entered.',
    },
    value: {
      control: 'text',
      description: 'Two-way string value model.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents focus and entry when the field is unavailable.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required in both visible and programmatic form guidance.',
    },
    invalid: {
      control: 'boolean',
      description: 'Exposes the invalid state without coupling consumers to a provider.',
    },
    helpText: {
      control: 'text',
      description: 'Persistent guidance associated with the field.',
    },
    errorText: {
      control: 'text',
      description: 'Validation guidance associated with the field when invalid is true.',
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
          'Native governed text field wrapper. It exposes text, search, password, and date types behind a compact provider-neutral contract.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicInputComponent>;

export const Default: Story = {};

export const Search: Story = {
  args: {
    label: 'Search program performance',
    type: 'search',
    placeholder: 'Search programs',
  },
};

export const Password: Story = {
  args: {
    label: 'Temporary password',
    type: 'password',
    placeholder: 'Generate or enter password',
  },
};

export const Date: Story = {
  args: {
    label: 'Appointment date',
    type: 'date',
  },
};

export const Disabled: Story = {
  args: { value: 'PS-2026-1042', disabled: true },
};

export const RequiredWithHelp: Story = {
  args: {
    fieldId: 'required-case-id',
    required: true,
    helpText: 'Assigned by the intake system when a case is created.',
  },
};

export const InvalidWithError: Story = {
  args: {
    fieldId: 'invalid-case-id',
    required: true,
    invalid: true,
    helpText: 'Assigned by the intake system when a case is created.',
    errorText: 'Enter a valid case ID before continuing.',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Regional processing and service-delivery office reference number',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
