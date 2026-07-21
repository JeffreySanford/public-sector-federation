import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  PublicButtonComponent,
  PublicButtonCandidateComponent,
  type PublicButtonCandidateAppearance,
  type PublicButtonCandidateIcon,
  type PublicButtonCandidateIntent,
} from '@public-sector/ui-patterns';

const intents: PublicButtonCandidateIntent[] = ['primary', 'secondary', 'destructive'];
const appearances: PublicButtonCandidateAppearance[] = ['solid', 'outlined', 'text'];
const icons: PublicButtonCandidateIcon[] = [
  'check',
  'arrow-right',
  'download',
  'info-circle',
  'exclamation-triangle',
  'times-circle',
  'question-circle',
  'bolt',
  'save',
  'send',
  'lock',
];

const meta: Meta<PublicButtonCandidateComponent> = {
  title: 'Design System/Experiments/Button Contract Exploration',
  component: PublicButtonCandidateComponent,
  decorators: [moduleMetadata({ imports: [PublicButtonCandidateComponent] })],
  render: (args) => ({
    component: PublicButtonCandidateComponent,
    props: args,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-candidate-story" aria-labelledby="buttonCandidateStoryTitle">
        <h1 id="buttonCandidateStoryTitle">Button contract exploration</h1>
        <ps-button-candidate
          [label]="label"
          [icon]="icon"
          [intent]="intent"
          [appearance]="appearance"
          [disabled]="disabled"
          [loading]="loading"
          (activated)="activated?.()"
        />
      </main>
    `,
    styles: [
      `
        .button-candidate-story {
          display: grid;
          min-height: 8rem;
          place-items: center;
        }

        .button-candidate-story h1 {
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
    icon: 'check',
    intent: 'primary',
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
      control: 'select',
      options: icons,
      description: 'Provider-neutral icon name mapped internally to the current icon provider.',
    },
    intent: {
      control: 'select',
      options: intents,
      description: 'Product-facing action purpose.',
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
    activated: {
      action: 'activated',
      description: 'Emitted only when the candidate Button is enabled and not loading.',
    },
  },
  parameters: {
    layout: 'centered',
    a11y: {
      test: 'error',
    },
    docs: {
      extractArgTypes: () => ({}),
      description: {
        component:
          'Experimental candidate Button wrapper using the repo token contract directly. This is separate from the existing ps-button until the API and token mapping are accepted.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<PublicButtonCandidateComponent> & { component?: typeof PublicButtonCandidateComponent };

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Secondary action',
    icon: 'arrow-right',
    intent: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: 'Approve',
    icon: 'check',
    intent: 'primary',
  },
};

export const Info: Story = {
  args: {
    label: 'View details',
    icon: 'info-circle',
    intent: 'secondary',
  },
};

export const Warning: Story = {
  args: {
    label: 'Review warning',
    icon: 'exclamation-triangle',
    intent: 'secondary',
  },
};

export const Error: Story = {
  args: {
    label: 'Resolve error',
    icon: 'times-circle',
    intent: 'destructive',
  },
};

export const Help: Story = {
  args: {
    label: 'Get help',
    icon: 'question-circle',
    intent: 'secondary',
  },
};

export const Contrast: Story = {
  args: {
    label: 'High emphasis',
    icon: 'bolt',
    intent: 'primary',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined action',
    icon: 'download',
    appearance: 'outlined',
  },
};

export const Text: Story = {
  args: {
    label: 'Text action',
    icon: 'info-circle',
    appearance: 'text',
  },
};

export const Loading: Story = {
  args: {
    label: 'Submitting',
    icon: 'send',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable action',
    icon: 'lock',
    disabled: true,
  },
};

export const InteractionHarness: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Observable interaction story used by isolated Playwright checks.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    props: {
      clickCount: 0,
    },
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-candidate-story" aria-labelledby="buttonCandidateInteractionTitle">
        <h1 id="buttonCandidateInteractionTitle">Button Contract Exploration interaction harness</h1>
        <ps-button-candidate
          label="Submit application"
          icon="check"
          (activated)="clickCount = clickCount + 1"
        />
        <output aria-live="polite">Activations: {{ clickCount }}</output>
      </main>
    `,
    styles: [
      `
        .button-candidate-story {
          display: grid;
          gap: 1rem;
          min-height: 10rem;
          place-items: center;
        }

        .button-candidate-story h1 {
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
  component: PublicButtonCandidateComponent,
  args: {
    label: 'Submit housing assistance eligibility review for North Region queue',
    icon: 'check',
    appearance: 'outlined',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    component: PublicButtonCandidateComponent,
    props: args,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-story-shell">
        <ps-button-candidate
          [label]="label"
          [icon]="icon"
          [intent]="intent"
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
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Shows each proposed product intent using the candidate Button.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    props: { intents },
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-story-shell">
        <section class="button-matrix" aria-label="Button candidate intent matrix">
          @for (intent of intents; track intent) {
            <div class="button-cell">
              <span>{{ intent }}</span>
              <ps-button-candidate [label]="intent + ' action'" [intent]="intent" icon="check" />
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
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Shows the candidate solid, outlined, and text appearances using a single appearance property.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    props: { appearances },
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-story-shell">
        <section class="appearance-matrix" aria-label="Button candidate appearance matrix">
          @for (appearance of appearances; track appearance) {
            <div class="button-cell">
              <span>{{ appearance }}</span>
              <ps-button-candidate label="Primary action" intent="primary" [appearance]="appearance" icon="check" />
              <ps-button-candidate label="Secondary action" intent="secondary" [appearance]="appearance" icon="arrow-right" />
              <ps-button-candidate label="Destructive action" intent="destructive" [appearance]="appearance" icon="times-circle" />
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

export const InteractionStateReference: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Reference harness for default, disabled, loading, and keyboard-focus states. Hover and pressed states are validated through Playwright interaction.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-story-shell">
        <section class="state-matrix" aria-label="Button candidate interaction state reference">
          <div class="button-cell">
            <span>Default</span>
            <ps-button-candidate label="Default" icon="check" />
          </div>
          <div class="button-cell">
            <span>Disabled</span>
            <ps-button-candidate label="Disabled" icon="lock" disabled />
          </div>
          <div class="button-cell">
            <span>Loading</span>
            <ps-button-candidate label="Loading" icon="send" loading />
          </div>
          <div class="button-cell">
            <span>Focus target</span>
            <ps-button-candidate label="Focus target" icon="arrow-right" />
          </div>
        </section>
      </main>
    `,
    styles: [
      `
        .button-story-shell {
          padding: 2rem;
        }

        .state-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
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

export const SizeMatrix: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Token-scoped size reference for the candidate contract. These are not public component inputs.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="button-story-shell">
        <section class="size-matrix" aria-label="Button candidate size token matrix">
          <div class="button-cell size-compact">
            <span>Compact tokens</span>
            <ps-button-candidate label="Compact" icon="check" />
            <ps-button-candidate label="Compact outline" icon="download" appearance="outlined" />
          </div>
          <div class="button-cell">
            <span>Default tokens</span>
            <ps-button-candidate label="Default" icon="check" />
            <ps-button-candidate label="Default outline" icon="download" appearance="outlined" />
          </div>
          <div class="button-cell size-spacious">
            <span>Spacious tokens</span>
            <ps-button-candidate label="Spacious" icon="check" />
            <ps-button-candidate label="Spacious outline" icon="download" appearance="outlined" />
          </div>
        </section>
      </main>
    `,
    styles: [
      `
        .button-story-shell {
          padding: 2rem;
        }

        .size-matrix {
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

        .size-compact {
          --ps-button-candidate-min-height: 2.25rem;
          --ps-button-candidate-padding-block: 0.45rem;
          --ps-button-candidate-padding-inline: 0.75rem;
          --ps-button-candidate-font-size: 0.875rem;
          --ps-button-candidate-icon-size: 0.9rem;
        }

        .size-spacious {
          --ps-button-candidate-min-height: 3rem;
          --ps-button-candidate-padding-block: 0.8rem;
          --ps-button-candidate-padding-inline: 1.1rem;
          --ps-button-candidate-font-size: 1rem;
          --ps-button-candidate-icon-size: 1.1rem;
        }
      `,
    ],
  }),
};

export const FocusReference: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'centered',
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="focus-reference" aria-label="Button candidate focus reference">
        <ps-button-candidate label="Focus reference" icon="arrow-right" />
      </main>
    `,
    styles: [
      `
        .focus-reference {
          display: grid;
          min-width: min(24rem, calc(100vw - 2rem));
          min-height: 10rem;
          place-items: center;
          padding: 2rem;
        }
      `,
    ],
  }),
};

export const LightDarkModeMatrix: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    props: { intents },
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="mode-matrix" aria-label="Button candidate light and dark mode matrix">
        <section class="mode-panel light-panel">
          <span>Light</span>
          @for (intent of intents; track intent) {
            <ps-button-candidate [label]="intent" [intent]="intent" icon="check" />
          }
        </section>
        <section class="mode-panel dark-panel">
          <span>Dark</span>
          @for (intent of intents; track intent) {
            <ps-button-candidate [label]="intent" [intent]="intent" icon="check" />
          }
        </section>
      </main>
    `,
    styles: [
      `
        .mode-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          gap: 1rem;
          min-height: 100vh;
          padding: 2rem;
          background: var(--ps-surface-background);
        }

        .mode-panel {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-content: start;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--p-content-border-color);
          border-radius: var(--p-content-border-radius, 0.5rem);
          background: var(--p-content-background);
          color: var(--p-text-color);
        }

        .mode-panel > span {
          flex: 0 0 100%;
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .dark-panel {
          --ps-surface-background: #020617;
          --ps-surface-card: #0f172a;
          --ps-surface-border: #334155;
          --ps-text-primary: #f8fafc;
          --ps-text-secondary: #cbd5e1;
          --ps-primary-background: #60a5fa;
          --ps-primary-foreground: #020617;
          --ps-focus-ring-color: #93c5fd;
          --ps-danger-color: #f87171;
          --ps-success-color: #4ade80;
          --ps-action-text: #93c5fd;
          --ps-button-background: #93c5fd;
          --ps-button-text: #020617;
          --p-content-background: #0f172a;
          --p-content-border-color: #334155;
          --p-text-color: #f8fafc;
          --p-text-muted-color: #cbd5e1;
          --p-primary-color: #60a5fa;
          --p-primary-hover-color: #93c5fd;
          --p-primary-active-color: #bfdbfe;
          --p-primary-inverse-color: #020617;
        }
      `,
    ],
  }),
};

export const ThemeVariantMatrix: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    moduleMetadata: { imports: [PublicButtonCandidateComponent] },
    template: `
      <main class="variant-matrix" aria-label="Button candidate theme variant matrix">
        <section class="variant-panel neutral">
          <span>Neutral</span>
          <ps-button-candidate label="Primary" icon="check" />
          <ps-button-candidate label="Outlined" icon="download" appearance="outlined" />
          <ps-button-candidate label="Text" icon="info-circle" appearance="text" />
        </section>
        <section class="variant-panel vibrant">
          <span>Vibrant</span>
          <ps-button-candidate label="Primary" icon="check" />
          <ps-button-candidate label="Outlined" icon="download" appearance="outlined" />
          <ps-button-candidate label="Text" icon="info-circle" appearance="text" />
        </section>
        <section class="variant-panel pastel">
          <span>Pastel</span>
          <ps-button-candidate label="Primary" icon="check" />
          <ps-button-candidate label="Outlined" icon="download" appearance="outlined" />
          <ps-button-candidate label="Text" icon="info-circle" appearance="text" />
        </section>
      </main>
    `,
    styles: [
      `
        .variant-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          gap: 1rem;
          min-height: 100vh;
          padding: 2rem;
          background: var(--ps-surface-background);
        }

        .variant-panel {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-content: start;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--p-content-border-color);
          border-radius: var(--p-content-border-radius, 0.5rem);
          background: var(--p-content-background);
          color: var(--p-text-color);
        }

        .variant-panel > span {
          flex: 0 0 100%;
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .vibrant {
          --ps-surface-card: #ffffff;
          --ps-surface-border: #bfdbfe;
          --ps-text-primary: #172554;
          --ps-text-secondary: #1e40af;
          --ps-primary-background: #7c3aed;
          --ps-primary-foreground: #ffffff;
          --ps-focus-ring-color: #06b6d4;
          --ps-button-background: #5b21b6;
          --ps-button-text: #ffffff;
          --p-content-background: #ffffff;
          --p-content-border-color: #bfdbfe;
          --p-text-color: #172554;
          --p-primary-color: #7c3aed;
          --p-primary-hover-color: #6d28d9;
          --p-primary-active-color: #5b21b6;
          --p-primary-inverse-color: #ffffff;
        }

        .pastel {
          --ps-surface-card: #fffbf5;
          --ps-surface-border: #fed7aa;
          --ps-text-primary: #431407;
          --ps-text-secondary: #9a3412;
          --ps-primary-background: #fb7185;
          --ps-primary-foreground: #431407;
          --ps-focus-ring-color: #f9a8d4;
          --ps-button-background: #be123c;
          --ps-button-text: #ffffff;
          --p-content-background: #fffbf5;
          --p-content-border-color: #fed7aa;
          --p-text-color: #431407;
          --p-primary-color: #be123c;
          --p-primary-hover-color: #f43f5e;
          --p-primary-active-color: #e11d48;
          --p-primary-inverse-color: #ffffff;
        }
      `,
    ],
  }),
};

export const CurrentVsCandidate: Story = {
  component: PublicButtonCandidateComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Side-by-side comparison of the stable public-sector ps-button wrapper and the experimental ps-button-candidate candidate. Use this story to review visual deltas before promotion.',
      },
    },
  },
  render: () => ({
    component: PublicButtonCandidateComponent,
    moduleMetadata: { imports: [PublicButtonComponent, PublicButtonCandidateComponent] },
    template: `
      <main class="comparison-shell" aria-labelledby="buttonComparisonTitle">
        <header class="comparison-header">
          <p>Candidate comparison</p>
          <h1 id="buttonComparisonTitle">Current Button vs Button candidate</h1>
        </header>

        <section class="comparison-grid" aria-label="Button styling comparison">
          <div class="comparison-heading" aria-hidden="true">Scenario</div>
          <div class="comparison-heading" aria-hidden="true">Current design system</div>
          <div class="comparison-heading" aria-hidden="true">Experimental candidate</div>

          <div class="scenario">Primary solid</div>
          <div class="sample"><ps-button label="Primary action" icon="pi pi-check" /></div>
          <div class="sample"><ps-button-candidate label="Primary action" icon="check" /></div>

          <div class="scenario">Secondary solid</div>
          <div class="sample"><ps-button label="Secondary action" icon="pi pi-arrow-right" tone="secondary" /></div>
          <div class="sample"><ps-button-candidate label="Secondary action" icon="arrow-right" intent="secondary" /></div>

          <div class="scenario">Outlined</div>
          <div class="sample"><ps-button label="Outlined action" icon="pi pi-download" [outlined]="true" /></div>
          <div class="sample"><ps-button-candidate label="Outlined action" icon="download" appearance="outlined" /></div>

          <div class="scenario">Text</div>
          <div class="sample"><ps-button label="Text action" icon="pi pi-info-circle" [text]="true" /></div>
          <div class="sample"><ps-button-candidate label="Text action" icon="info-circle" appearance="text" /></div>

          <div class="scenario">Disabled</div>
          <div class="sample"><ps-button label="Unavailable action" icon="pi pi-lock" [disabled]="true" /></div>
          <div class="sample"><ps-button-candidate label="Unavailable action" icon="lock" [disabled]="true" /></div>

          <div class="scenario">Loading</div>
          <div class="sample"><ps-button label="Submitting" icon="pi pi-send" [loading]="true" /></div>
          <div class="sample"><ps-button-candidate label="Submitting" icon="send" [loading]="true" /></div>

          <div class="scenario">Long label</div>
          <div class="sample">
            <ps-button label="Submit housing assistance eligibility review for North Region queue" icon="pi pi-check" [outlined]="true" />
          </div>
          <div class="sample">
            <ps-button-candidate label="Submit housing assistance eligibility review for North Region queue" icon="check" appearance="outlined" />
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
            content: 'Candidate';
          }
        }
      `,
    ],
  }),
};
