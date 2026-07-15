import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  PublicButtonComponent,
  PublicUpButtonComponent,
  type PublicUpButtonAppearance,
  type PublicUpButtonTone,
} from '@public-sector/ui-patterns';

const tones: PublicUpButtonTone[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'help', 'contrast'];
const appearances: PublicUpButtonAppearance[] = ['solid', 'outlined', 'text'];

const meta: Meta<PublicUpButtonComponent> = {
  title: 'Design System/Components/UP Button Candidate',
  decorators: [moduleMetadata({ imports: [PublicUpButtonComponent] })],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="up-button-story" aria-labelledby="upButtonStoryTitle">
        <h1 id="upButtonStoryTitle">UP Button candidate</h1>
        <ps-up-button
          [label]="label"
          [icon]="icon"
          [tone]="tone"
          [appearance]="appearance"
          [disabled]="disabled"
          [loading]="loading"
          (buttonClick)="buttonClick?.($event)"
        />
      </main>
    `,
    styles: [
      `
        .up-button-story {
          display: grid;
          min-height: 8rem;
          place-items: center;
        }

        .up-button-story h1 {
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
  args: {
    label: 'Primary action',
    icon: 'pi pi-check',
    tone: 'primary',
    appearance: 'solid',
    disabled: false,
    loading: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible action label. Use concise, action-oriented copy.',
    },
    icon: {
      control: 'text',
      description: 'Optional icon class for the candidate proof. The final wrapper should define a provider-neutral icon contract.',
    },
    tone: {
      control: 'select',
      options: tones,
      description: 'Provider-neutral design-system tone.',
    },
    appearance: {
      control: 'select',
      options: appearances,
      description: 'Single appearance property replacing separate outlined/text booleans.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents activation.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows progress and prevents duplicate activation.',
    },
    buttonClick: {
      action: 'buttonClick',
      description: 'Emitted only when the candidate Button is enabled and not loading.',
    },
  },
  parameters: {
    layout: 'centered',
    a11y: {
      test: 'error',
    },
    docs: {
      description: {
        component:
          'Candidate up-design-system Button wrapper using the repo token contract directly. This is separate from the existing ps-button until the API and token mapping are accepted.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicUpButtonComponent>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Secondary action',
    icon: 'pi pi-arrow-right',
    tone: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: 'Approve',
    icon: 'pi pi-check',
    tone: 'success',
  },
};

export const Info: Story = {
  args: {
    label: 'View details',
    icon: 'pi pi-info-circle',
    tone: 'info',
  },
};

export const Warning: Story = {
  args: {
    label: 'Review warning',
    icon: 'pi pi-exclamation-triangle',
    tone: 'warning',
  },
};

export const Error: Story = {
  args: {
    label: 'Resolve error',
    icon: 'pi pi-times-circle',
    tone: 'error',
  },
};

export const Help: Story = {
  args: {
    label: 'Get help',
    icon: 'pi pi-question-circle',
    tone: 'help',
  },
};

export const Contrast: Story = {
  args: {
    label: 'High emphasis',
    icon: 'pi pi-bolt',
    tone: 'contrast',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined action',
    icon: 'pi pi-download',
    appearance: 'outlined',
  },
};

export const Text: Story = {
  args: {
    label: 'Text action',
    icon: 'pi pi-info-circle',
    appearance: 'text',
  },
};

export const Loading: Story = {
  args: {
    label: 'Submitting',
    icon: 'pi pi-send',
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

export const InteractionHarness: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Observable interaction story used by isolated Playwright checks.',
      },
    },
  },
  render: () => ({
    props: {
      clickCount: 0,
    },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="up-button-story" aria-labelledby="upButtonInteractionTitle">
        <h1 id="upButtonInteractionTitle">UP Button interaction harness</h1>
        <ps-up-button
          label="Submit application"
          icon="pi pi-check"
          (buttonClick)="clickCount = clickCount + 1"
        />
        <output aria-live="polite">Activations: {{ clickCount }}</output>
      </main>
    `,
    styles: [
      `
        .up-button-story {
          display: grid;
          gap: 1rem;
          min-height: 10rem;
          place-items: center;
        }

        .up-button-story h1 {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        output {
          color: var(--p-text-color);
          font-weight: 700;
        }
      `,
    ],
  }),
};

export const LongLabel: Story = {
  args: {
    label: 'Submit housing assistance eligibility review for North Region queue',
    icon: 'pi pi-check',
    appearance: 'outlined',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="button-story-shell">
        <ps-up-button
          [label]="label"
          [icon]="icon"
          [tone]="tone"
          [appearance]="appearance"
          [disabled]="disabled"
          [loading]="loading"
        />
      </main>
    `,
    styles: [
      `
        .button-story-shell {
          display: flex;
          min-height: 16rem;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
      `,
    ],
  }),
};

export const ToneMatrix: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Shows each approved public tone using the candidate up-design-system Button.',
      },
    },
  },
  render: () => ({
    props: { tones },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="button-story-shell">
        <section class="button-matrix" aria-label="UP Button tone matrix">
          @for (tone of tones; track tone) {
            <div class="button-cell">
              <span>{{ tone }}</span>
              <ps-up-button [label]="tone + ' action'" [tone]="tone" icon="pi pi-check" />
            </div>
          }
        </section>
      </main>
    `,
    styles: [
      `
        .button-story-shell {
          padding: 2rem;
        }

        .button-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          gap: 1rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        .button-cell {
          display: grid;
          gap: 0.65rem;
          align-content: start;
          min-height: 6rem;
          padding: 1rem;
          border: 1px solid var(--p-content-border-color);
          border-radius: var(--p-content-border-radius, 0.5rem);
          background: var(--p-content-background);
          color: var(--p-text-color);
        }

        .button-cell span {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }
      `,
    ],
  }),
};

export const AppearanceMatrix: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Shows the candidate solid, outlined, and text appearances using a single appearance property.',
      },
    },
  },
  render: () => ({
    props: { appearances },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="button-story-shell">
        <section class="appearance-matrix" aria-label="UP Button appearance matrix">
          @for (appearance of appearances; track appearance) {
            <div class="button-cell">
              <span>{{ appearance }}</span>
              <ps-up-button label="Primary action" tone="primary" [appearance]="appearance" icon="pi pi-check" />
              <ps-up-button label="Secondary action" tone="secondary" [appearance]="appearance" icon="pi pi-arrow-right" />
              <ps-up-button label="Error action" tone="error" [appearance]="appearance" icon="pi pi-times-circle" />
            </div>
          }
        </section>
      </main>
    `,
    styles: [
      `
        .button-story-shell {
          padding: 2rem;
        }

        .appearance-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
          gap: 1rem;
          max-width: 72rem;
          margin: 0 auto;
        }

        .button-cell {
          display: grid;
          gap: 0.75rem;
          align-content: start;
          padding: 1rem;
          border: 1px solid var(--p-content-border-color);
          border-radius: var(--p-content-border-radius, 0.5rem);
          background: var(--p-content-background);
          color: var(--p-text-color);
        }

        .button-cell span {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }
      `,
    ],
  }),
};

export const CurrentVsCandidate: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Side-by-side comparison of the stable public-sector ps-button wrapper and the UP Design System candidate ps-up-button. Use this story to review visual deltas before promotion.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [PublicButtonComponent, PublicUpButtonComponent] },
    template: `
      <main class="comparison-shell" aria-labelledby="buttonComparisonTitle">
        <header class="comparison-header">
          <p>Candidate comparison</p>
          <h1 id="buttonComparisonTitle">Current Button vs UP Button candidate</h1>
        </header>

        <section class="comparison-grid" aria-label="Button styling comparison">
          <div class="comparison-heading" aria-hidden="true">Scenario</div>
          <div class="comparison-heading" aria-hidden="true">Current design system</div>
          <div class="comparison-heading" aria-hidden="true">UP Design System candidate</div>

          <div class="scenario">Primary solid</div>
          <div class="sample"><ps-button label="Primary action" icon="pi pi-check" /></div>
          <div class="sample"><ps-up-button label="Primary action" icon="pi pi-check" /></div>

          <div class="scenario">Secondary solid</div>
          <div class="sample"><ps-button label="Secondary action" icon="pi pi-arrow-right" tone="secondary" /></div>
          <div class="sample"><ps-up-button label="Secondary action" icon="pi pi-arrow-right" tone="secondary" /></div>

          <div class="scenario">Outlined</div>
          <div class="sample"><ps-button label="Outlined action" icon="pi pi-download" [outlined]="true" /></div>
          <div class="sample"><ps-up-button label="Outlined action" icon="pi pi-download" appearance="outlined" /></div>

          <div class="scenario">Text</div>
          <div class="sample"><ps-button label="Text action" icon="pi pi-info-circle" [text]="true" /></div>
          <div class="sample"><ps-up-button label="Text action" icon="pi pi-info-circle" appearance="text" /></div>

          <div class="scenario">Disabled</div>
          <div class="sample"><ps-button label="Unavailable action" icon="pi pi-lock" [disabled]="true" /></div>
          <div class="sample"><ps-up-button label="Unavailable action" icon="pi pi-lock" [disabled]="true" /></div>

          <div class="scenario">Loading</div>
          <div class="sample"><ps-button label="Submitting" icon="pi pi-send" [loading]="true" /></div>
          <div class="sample"><ps-up-button label="Submitting" icon="pi pi-send" [loading]="true" /></div>

          <div class="scenario">Long label</div>
          <div class="sample">
            <ps-button label="Submit housing assistance eligibility review for North Region queue" icon="pi pi-check" [outlined]="true" />
          </div>
          <div class="sample">
            <ps-up-button label="Submit housing assistance eligibility review for North Region queue" icon="pi pi-check" appearance="outlined" />
          </div>
        </section>
      </main>
    `,
    styles: [
      `
        .comparison-shell {
          display: grid;
          gap: 1.25rem;
          min-height: 100vh;
          padding: 2rem;
          background: var(--p-content-background);
          color: var(--p-text-color);
        }

        .comparison-header {
          display: grid;
          gap: 0.25rem;
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
        }

        .comparison-header p {
          margin: 0;
          color: var(--p-text-muted-color);
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .comparison-header h1 {
          margin: 0;
          font-size: 1.375rem;
          line-height: 1.25;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: minmax(8rem, 0.75fr) repeat(2, minmax(16rem, 1fr));
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--p-content-border-color);
          border-radius: var(--p-content-border-radius, 0.5rem);
          background: var(--p-content-background);
        }

        .comparison-heading,
        .scenario,
        .sample {
          min-width: 0;
          padding: 1rem;
          border-right: 1px solid var(--p-content-border-color);
          border-bottom: 1px solid var(--p-content-border-color);
        }

        .comparison-heading:nth-child(3n),
        .sample:nth-child(3n) {
          border-right: 0;
        }

        .comparison-heading {
          background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color));
          font-size: 0.8125rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .scenario {
          color: var(--p-text-muted-color);
          font-size: 0.875rem;
          font-weight: 700;
        }

        .sample {
          display: flex;
          min-height: 4.75rem;
          align-items: center;
        }

        @media (max-width: 760px) {
          .comparison-shell {
            padding: 1rem;
          }

          .comparison-grid {
            display: block;
            border: 0;
            background: transparent;
          }

          .comparison-heading {
            display: none;
          }

          .scenario {
            margin-top: 1rem;
            border: 1px solid var(--p-content-border-color);
            border-bottom: 0;
            border-radius: var(--p-content-border-radius, 0.5rem) var(--p-content-border-radius, 0.5rem) 0 0;
            background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color));
          }

          .sample {
            border: 1px solid var(--p-content-border-color);
            border-bottom: 0;
            background: var(--p-content-background);
          }

          .sample + .sample {
            border-bottom: 1px solid var(--p-content-border-color);
            border-radius: 0 0 var(--p-content-border-radius, 0.5rem) var(--p-content-border-radius, 0.5rem);
          }

          .sample::before {
            content: 'Current';
            width: 5.5rem;
            flex: 0 0 auto;
            color: var(--p-text-muted-color);
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
          }

          .sample + .sample::before {
            content: 'UP candidate';
          }
        }
      `,
    ],
  }),
};
