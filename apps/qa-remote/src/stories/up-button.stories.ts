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
  title: 'Design System/Candidates/Button UP',
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

export const InteractionStateReference: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Reference harness for default, disabled, loading, and keyboard-focus states. Hover and pressed states are validated through Playwright interaction.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="button-story-shell">
        <section class="state-matrix" aria-label="UP Button interaction state reference">
          <div class="button-cell">
            <span>Default</span>
            <ps-up-button label="Default" icon="pi pi-check" />
          </div>
          <div class="button-cell">
            <span>Disabled</span>
            <ps-up-button label="Disabled" icon="pi pi-lock" disabled />
          </div>
          <div class="button-cell">
            <span>Loading</span>
            <ps-up-button label="Loading" icon="pi pi-send" loading />
          </div>
          <div class="button-cell">
            <span>Focus target</span>
            <ps-up-button label="Focus target" icon="pi pi-arrow-right" />
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
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Token-scoped size reference for the candidate contract. These are not public component inputs.',
      },
    },
  },
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="button-story-shell">
        <section class="size-matrix" aria-label="UP Button size token matrix">
          <div class="button-cell size-compact">
            <span>Compact tokens</span>
            <ps-up-button label="Compact" icon="pi pi-check" />
            <ps-up-button label="Compact outline" icon="pi pi-download" appearance="outlined" />
          </div>
          <div class="button-cell">
            <span>Default tokens</span>
            <ps-up-button label="Default" icon="pi pi-check" />
            <ps-up-button label="Default outline" icon="pi pi-download" appearance="outlined" />
          </div>
          <div class="button-cell size-spacious">
            <span>Spacious tokens</span>
            <ps-up-button label="Spacious" icon="pi pi-check" />
            <ps-up-button label="Spacious outline" icon="pi pi-download" appearance="outlined" />
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
          --ps-up-button-min-height: 2.25rem;
          --ps-up-button-padding-block: 0.45rem;
          --ps-up-button-padding-inline: 0.75rem;
          --ps-up-button-font-size: 0.875rem;
          --ps-up-button-icon-size: 0.9rem;
        }

        .size-spacious {
          --ps-up-button-min-height: 3rem;
          --ps-up-button-padding-block: 0.8rem;
          --ps-up-button-padding-inline: 1.1rem;
          --ps-up-button-font-size: 1rem;
          --ps-up-button-icon-size: 1.1rem;
        }
      `,
    ],
  }),
};

export const FocusReference: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="focus-reference" aria-label="UP Button focus reference">
        <ps-up-button label="Focus reference" icon="pi pi-arrow-right" />
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
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    props: { tones: ['primary', 'secondary', 'error', 'contrast'] satisfies PublicUpButtonTone[] },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="mode-matrix" aria-label="UP Button light and dark mode matrix">
        <section class="mode-panel light-panel">
          <span>Light</span>
          @for (tone of tones; track tone) {
            <ps-up-button [label]="tone" [tone]="tone" icon="pi pi-check" />
          }
        </section>
        <section class="mode-panel dark-panel">
          <span>Dark</span>
          @for (tone of tones; track tone) {
            <ps-up-button [label]="tone" [tone]="tone" icon="pi pi-check" />
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
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="variant-matrix" aria-label="UP Button theme variant matrix">
        <section class="variant-panel neutral">
          <span>Neutral</span>
          <ps-up-button label="Primary" icon="pi pi-check" />
          <ps-up-button label="Outlined" icon="pi pi-download" appearance="outlined" />
          <ps-up-button label="Text" icon="pi pi-info-circle" appearance="text" />
        </section>
        <section class="variant-panel vibrant">
          <span>Vibrant</span>
          <ps-up-button label="Primary" icon="pi pi-check" />
          <ps-up-button label="Outlined" icon="pi pi-download" appearance="outlined" />
          <ps-up-button label="Text" icon="pi pi-info-circle" appearance="text" />
        </section>
        <section class="variant-panel pastel">
          <span>Pastel</span>
          <ps-up-button label="Primary" icon="pi pi-check" />
          <ps-up-button label="Outlined" icon="pi pi-download" appearance="outlined" />
          <ps-up-button label="Text" icon="pi pi-info-circle" appearance="text" />
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
