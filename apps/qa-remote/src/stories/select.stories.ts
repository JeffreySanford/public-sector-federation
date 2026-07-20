import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  PublicSelectComponent,
  type PublicSelectOption,
} from '@public-sector/ui-patterns';

const programOptions: PublicSelectOption[] = [
  { label: 'Housing assistance', value: 'housing' },
  { label: 'Food assistance', value: 'food' },
  { label: 'Child care subsidy', value: 'childcare' },
  { label: 'Archived pilot program', value: 'archive', disabled: true },
];

const meta: Meta<PublicSelectComponent> = {
  title: 'Design System/Components/Select',
  component: PublicSelectComponent,
  args: {
    label: 'Program',
    placeholder: 'Choose a program',
    options: programOptions,
    value: null,
    disabled: false,
    required: false,
    invalid: false,
    helpText: '',
    errorText: '',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label and accessible name forwarded to the provider combobox.',
    },
    options: {
      control: 'object',
      description: 'Provider-neutral label, value, and optional disabled-state records.',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt displayed before a value is selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents focus and selection when the complete field is unavailable.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the selection as required in both visible and programmatic form guidance.',
    },
    invalid: {
      control: 'boolean',
      description: 'Exposes the invalid state without coupling consumers to PrimeNG.',
    },
    helpText: {
      control: 'text',
      description: 'Persistent guidance associated with the rendered combobox.',
    },
    errorText: {
      control: 'text',
      description: 'Validation guidance associated with the combobox when invalid is true.',
    },
    fieldId: {
      control: 'text',
      description: 'Stable identifier used for label and description relationships.',
    },
    value: {
      control: 'select',
      options: [null, 'housing', 'food', 'childcare'],
      description: 'Two-way string value model exposed by the wrapper.',
    },
  },
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Stable governed Select wrapper. It exposes a compact option and value contract while keeping PrimeNG overlay behavior internal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicSelectComponent>;

export const Default: Story = {};

export const Selected: Story = {
  args: { value: 'housing' },
};

export const Disabled: Story = {
  args: { value: 'food', disabled: true },
};

export const DisabledOption: Story = {
  args: {
    label: 'Program with archived option',
    placeholder: 'Choose an active program',
  },
};

export const RequiredWithHelp: Story = {
  args: {
    fieldId: 'required-program',
    required: true,
    helpText: 'Choose the program used for this eligibility decision.',
  },
};

export const InvalidWithError: Story = {
  args: {
    fieldId: 'invalid-program',
    required: true,
    invalid: true,
    helpText: 'Choose the program used for this eligibility decision.',
    errorText: 'Select a program before continuing.',
  },
};

export const EmptyOptions: Story = {
  args: {
    label: 'Assigned reviewer',
    options: [],
    placeholder: 'No reviewers available',
  },
};

export const LongOptions: Story = {
  args: {
    label: 'Regional processing and service-delivery office',
    options: [
      {
        label: 'Northwest multi-county eligibility and document-verification center',
        value: 'northwest',
      },
      {
        label: 'Central metropolitan expedited-benefits processing office',
        value: 'central',
      },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

@Component({
  selector: 'select-model-proof',
  standalone: true,
  imports: [PublicSelectComponent],
  template: `
    <main class="select-proof" aria-labelledby="selectModelTitle">
      <h1 id="selectModelTitle">Select model binding</h1>
      <ps-select
        label="Communication preference"
        [options]="options"
        [(value)]="value"
      />
      <output aria-live="polite">Selected value: {{ value ?? 'none' }}</output>
    </main>
  `,
  styles: `
    .select-proof {
      display: grid;
      gap: 1rem;
      min-width: min(100%, 20rem);
    }

    .select-proof h1 {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
})
class SelectModelProof {
  value: string | null = null;
  readonly options: PublicSelectOption[] = [
    { label: 'Email', value: 'email' },
    { label: 'Postal mail', value: 'mail' },
    { label: 'Telephone', value: 'phone' },
  ];
}

export const ModelBinding: StoryObj<SelectModelProof> = {
  render: () => ({
    moduleMetadata: { imports: [SelectModelProof] },
    template: '<select-model-proof />',
  }),
};

@Component({
  selector: 'select-overlay-boundary-proof',
  standalone: true,
  imports: [PublicSelectComponent],
  template: `
    <main class="overlay-proof" aria-labelledby="overlayProofTitle">
      <h1 id="overlayProofTitle">Body-appended Select overlay</h1>
      <p>
        The field sits inside an overflow-hidden application panel. The popup is
        appended to the document body so it is not clipped by this boundary.
      </p>
      <section class="application-panel" aria-label="Clipping boundary demonstration">
        <ps-select
          label="Service region"
          placeholder="Choose a region"
          [options]="options"
          [(value)]="value"
        />
      </section>
      <output aria-live="polite">Selected region: {{ value ?? 'none' }}</output>
    </main>
  `,
  styles: `
    .overlay-proof {
      display: grid;
      gap: 1rem;
      width: min(100%, 38rem);
      padding: 1.5rem;
    }

    .overlay-proof h1 {
      margin: 0;
      color: var(--p-text-color);
    }

    .overlay-proof p,
    .overlay-proof output {
      margin: 0;
      color: var(--p-text-muted-color);
    }

    .application-panel {
      overflow: hidden;
      min-height: 7rem;
      padding: 1rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-border-radius-lg);
      background: var(--p-content-background);
    }
  `,
})
class SelectOverlayBoundaryProof {
  value: string | null = null;
  readonly options: PublicSelectOption[] = [
    { label: 'Northern region', value: 'north' },
    { label: 'Central region', value: 'central' },
    { label: 'Southern region', value: 'south' },
  ];
}

export const OverlayBoundary: StoryObj<SelectOverlayBoundaryProof> = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Integration harness for positioning, clipping, keyboard selection, and theme inheritance when the popup is appended to document.body.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [SelectOverlayBoundaryProof] },
    template: '<select-overlay-boundary-proof />',
  }),
};
