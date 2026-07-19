import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  PublicButtonComponent,
  type PublicButtonAppearance,
  type PublicButtonIntent,
} from '@public-sector/ui-patterns';

const intents: PublicButtonIntent[] = ['primary', 'secondary', 'destructive'];
const appearances: PublicButtonAppearance[] = ['solid', 'outlined', 'text'];

const meta: Meta<PublicButtonComponent> = {
  title: 'Design System/Components/Button',
  component: PublicButtonComponent,
  decorators: [moduleMetadata({ imports: [PublicButtonComponent] })],
  args: {
    label: 'Save changes',
    icon: 'pi pi-check',
    intent: 'primary',
    appearance: 'solid',
    disabled: false,
    loading: false,
    routerLink: null,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible action label. Prefer concise, action-oriented copy.',
    },
    icon: {
      control: 'text',
      description: 'Current compatibility API accepts a PrimeIcons class string.',
    },
    intent: {
      control: 'select',
      options: intents,
      description: 'Provider-neutral purpose of the action.',
    },
    appearance: {
      control: 'select',
      options: appearances,
      description: 'Visual emphasis without exposing provider booleans.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents activation.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows progress through the provider-backed implementation.',
    },
    routerLink: {
      control: false,
      description: 'Compatibility navigation input. Prefer a link for navigation when possible.',
    },
    activated: {
      action: 'activated',
      description: 'Preferred provider-neutral activation event.',
    },
    tone: { table: { disable: true } },
    styleClass: { table: { disable: true } },
    outlined: { table: { disable: true } },
    text: { table: { disable: true } },
    buttonClick: { table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    docs: {
      extractArgTypes: () => ({}),
      description: {
        component:
          'Stable PrimeNG-backed Button wrapper. New usage should prefer intent, appearance, and activated while compatibility aliases remain during migration.',
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [PublicButtonComponent] },
    template: `
      <main class="button-story" aria-labelledby="buttonStoryTitle">
        <h1 id="buttonStoryTitle">Button</h1>
        <ps-button
          [label]="label"
          [icon]="icon"
          [intent]="intent"
          [appearance]="appearance"
          [disabled]="disabled"
          [loading]="loading"
          [routerLink]="routerLink"
          (activated)="activated?.()"
        />
      </main>
    `,
    styles: [
      `
        .button-story {
          display: grid;
          min-height: 12rem;
          place-items: center;
          padding: 2rem;
        }

        .button-story h1 {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      `,
    ],
  }),
};

export default meta;
type Story = StoryObj<PublicButtonComponent>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Cancel',
    icon: undefined,
    intent: 'secondary',
    appearance: 'outlined',
  },
};

export const Destructive: Story = {
  args: {
    label: 'Delete record',
    icon: 'pi pi-trash',
    intent: 'destructive',
    appearance: 'solid',
  },
};

export const Loading: Story = {
  args: {
    label: 'Saving changes',
    icon: undefined,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable action',
    icon: 'pi pi-lock',
    disabled: true,
  },
};

export const AppearanceReference: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: { intents, appearances },
    moduleMetadata: { imports: [PublicButtonComponent] },
    template: `
      <main class="button-reference" aria-labelledby="buttonReferenceTitle">
        <h1 id="buttonReferenceTitle">Button intent and appearance reference</h1>
        @for (intent of intents; track intent) {
          <section>
            <h2>{{ intent }}</h2>
            <div class="button-row">
              @for (appearance of appearances; track appearance) {
                <ps-button
                  [label]="appearance + ' action'"
                  [intent]="intent"
                  [appearance]="appearance"
                />
              }
            </div>
          </section>
        }
      </main>
    `,
    styles: [
      `
        .button-reference {
          display: grid;
          gap: 1.5rem;
          max-width: 64rem;
          margin: 0 auto;
          padding: 2rem;
        }

        .button-reference section {
          display: grid;
          gap: 0.75rem;
        }

        .button-reference h1,
        .button-reference h2 {
          margin: 0;
        }

        .button-reference h1 {
          font-size: 1.5rem;
        }

        .button-reference h2 {
          font-size: 1rem;
          text-transform: capitalize;
        }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
        }
      `,
    ],
  }),
};
