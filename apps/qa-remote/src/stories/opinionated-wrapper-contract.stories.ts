import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  PublicUpButtonComponent,
  type PublicUpButtonAppearance,
  type PublicUpButtonIntent,
} from '@public-sector/ui-patterns';

const intents: PublicUpButtonIntent[] = ['primary', 'secondary', 'destructive'];
const appearances: PublicUpButtonAppearance[] = ['solid', 'outlined', 'text'];

const pageStyles = `
  .contract-page {
    display: grid;
    gap: 1.5rem;
    min-height: 100vh;
    padding: clamp(1rem, 4vw, 3rem);
    background: var(--p-content-background);
    color: var(--p-text-color);
  }
  header { max-width: 70rem; }
  header p { margin: 0 0 0.35rem; color: var(--p-text-color); font-weight: 800; text-transform: uppercase; }
  header h1 { margin: 0 0 0.5rem; font-size: clamp(2rem, 5vw, 3.5rem); }
  header span { color: var(--p-text-color); }
  .contract-grid, .matrix { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem; }
  article, .live-proof { display: grid; gap: 0.8rem; align-content: start; padding: 1.25rem; border: 1px solid var(--p-content-border-color); border-radius: var(--p-border-radius-md); }
  article h2 { margin: 0; }
  ul { margin: 0; padding-left: 1.2rem; }
  .matrix article ps-up-button { margin-right: 0.5rem; margin-bottom: 0.5rem; }
  .live-proof { grid-template-columns: max-content 1fr; align-items: center; }
  output { font-weight: 800; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.8rem; border: 1px solid var(--p-content-border-color); text-align: left; vertical-align: top; }
  th { background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color)); }
`;

const meta: Meta = {
  title: 'Design System/Architecture/Opinionated Wrapper Contract',
  decorators: [moduleMetadata({ imports: [PublicUpButtonComponent] })],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Shows the consumer-driven wrapper contract: a small design-system API, private PrimeNG translation, governed compatibility aliases, and explicit human approval points.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ApprovedApi: Story = {
  render: () => ({
    props: { activations: 0 },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="contract-page" aria-labelledby="approvedApiTitle">
        <header>
          <p>Neil and Dan wrapper direction</p>
          <h1 id="approvedApiTitle">Approved high-level API</h1>
          <span>Consumer need → design-system contract → private PrimeNG mapping</span>
        </header>

        <section class="contract-grid">
          <article>
            <h2>Public contract</h2>
            <ul>
              <li><code>label</code></li>
              <li><code>icon</code></li>
              <li><code>intent</code></li>
              <li><code>appearance</code></li>
              <li><code>disabled</code></li>
              <li><code>loading</code></li>
              <li><code>activated</code></li>
            </ul>
          </article>
          <article>
            <h2>Private provider controls</h2>
            <ul>
              <li><code>severity</code></li>
              <li><code>variant</code></li>
              <li><code>styleClass</code></li>
              <li><code>pt</code></li>
              <li><code>unstyled</code></li>
              <li><code>buttonProps</code></li>
            </ul>
          </article>
        </section>

        <section class="live-proof" aria-label="Preferred API interaction proof">
          <ps-up-button
            label="Delete draft"
            icon="times-circle"
            intent="destructive"
            appearance="solid"
            (activated)="activations = activations + 1"
          />
          <output aria-live="polite">Activations: {{ activations }}</output>
        </section>
      </main>
    `,
    styles: [pageStyles],
  }),
};

export const SupportedIntentMatrix: Story = {
  render: () => ({
    props: { intents, appearances },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="contract-page" aria-labelledby="intentMatrixTitle">
        <header>
          <p>Generated baseline candidate</p>
          <h1 id="intentMatrixTitle">Supported intent matrix</h1>
          <span>The wrapper exposes product purpose, not the PrimeNG severity inventory.</span>
        </header>
        <section class="matrix" aria-label="Intent and appearance combinations">
          @for (intent of intents; track intent) {
            <article>
              <h2>{{ intent }}</h2>
              @for (appearance of appearances; track appearance) {
                <ps-up-button
                  [label]="intent + ' ' + appearance"
                  [intent]="intent"
                  [appearance]="appearance"
                  icon="check"
                />
              }
            </article>
          }
        </section>
      </main>
    `,
    styles: [pageStyles],
  }),
};

export const ProviderTranslation: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="contract-page" aria-labelledby="translationTitle">
        <header>
          <p>Implementation boundary</p>
          <h1 id="translationTitle">Provider translation stays private</h1>
        </header>
        <table>
          <thead>
            <tr><th>Public request</th><th>Private mapping</th><th>Public promise</th></tr>
          </thead>
          <tbody>
            <tr><td><code>intent="primary"</code></td><td>UP primary tokens → PrimeNG button variables</td><td>Primary action treatment</td></tr>
            <tr><td><code>intent="secondary"</code></td><td>UP secondary tokens → PrimeNG button variables</td><td>Supporting action treatment</td></tr>
            <tr><td><code>intent="destructive"</code></td><td>UP error tokens → PrimeNG button variables</td><td>Destructive action treatment</td></tr>
            <tr><td><code>appearance="outlined"</code></td><td>PrimeNG variant mapping</td><td>Outlined emphasis</td></tr>
            <tr><td><code>icon="save"</code></td><td>Private PrimeIcons class mapping</td><td>Approved save icon</td></tr>
            <tr><td><code>(activated)</code></td><td>PrimeNG onClick normalized to void</td><td>Action occurred</td></tr>
          </tbody>
        </table>
      </main>
    `,
    styles: [pageStyles],
  }),
};

export const CompatibilityWindow: Story = {
  render: () => ({
    props: { preferred: 0, legacy: 0 },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: `
      <main class="contract-page" aria-labelledby="compatibilityTitle">
        <header>
          <p>Candidate migration</p>
          <h1 id="compatibilityTitle">Compatibility aliases are temporary</h1>
          <span>New work uses intent and activated. Existing QA evidence may migrate through tone and buttonClick.</span>
        </header>
        <section class="contract-grid">
          <article>
            <h2>Preferred</h2>
            <ps-up-button label="Remove item" intent="destructive" (activated)="preferred = preferred + 1" />
            <output>Activations: {{ preferred }}</output>
          </article>
          <article>
            <h2>Compatibility alias</h2>
            <ps-up-button label="Resolve error" tone="error" (buttonClick)="legacy = legacy + 1" />
            <output>Activations: {{ legacy }}</output>
          </article>
        </section>
      </main>
    `,
    styles: [pageStyles],
  }),
};
