import { readFile, writeFile } from 'node:fs/promises';

async function read(path) {
  return readFile(path, 'utf8');
}

async function write(path, content) {
  await writeFile(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to update ${label}: expected source text was not found.`);
  }
  return source.replace(search, replacement);
}

const component = String.raw`import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/** Product-facing action purpose. PrimeNG severity names are intentionally private. */
export type PublicUpButtonIntent = 'primary' | 'secondary' | 'destructive';

/**
 * @deprecated Use PublicUpButtonIntent and the intent input for new work.
 * This compatibility vocabulary remains only while existing candidate evidence migrates.
 */
export type PublicUpButtonTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'help'
  | 'contrast';

export type PublicUpButtonAppearance = 'solid' | 'outlined' | 'text';

export type PublicUpButtonIcon =
  | 'arrow-right'
  | 'bolt'
  | 'check'
  | 'download'
  | 'exclamation-triangle'
  | 'info-circle'
  | 'lock'
  | 'question-circle'
  | 'save'
  | 'send'
  | 'times-circle';

type PrimeButtonVariant = 'outlined' | 'text' | undefined;

const intentTone: Record<PublicUpButtonIntent, PublicUpButtonTone> = {
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'error',
};

const iconClassByName: Record<PublicUpButtonIcon, string> = {
  'arrow-right': 'pi pi-arrow-right',
  bolt: 'pi pi-bolt',
  check: 'pi pi-check',
  download: 'pi pi-download',
  'exclamation-triangle': 'pi pi-exclamation-triangle',
  'info-circle': 'pi pi-info-circle',
  lock: 'pi pi-lock',
  'question-circle': 'pi pi-question-circle',
  save: 'pi pi-save',
  send: 'pi pi-send',
  'times-circle': 'pi pi-times-circle',
};

@Component({
  selector: 'ps-up-button',
  standalone: true,
  imports: [ButtonModule],
  host: {
    '[attr.data-intent]': 'intent()',
    '[attr.data-resolved-tone]': 'resolvedTone()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    'data-provider': 'primeng',
  },
  template: ` + "`" + `
    <p-button
      [label]="label()"
      [icon]="iconClass()"
      [variant]="providerVariant()"
      [disabled]="disabled() || loading()"
      [loading]="loading()"
      [style]="providerStyle"
      styleClass="ps-up-button__control"
      (onClick)="handleActivate()"
    />
  ` + "`" + `,
  styles: ` + "`" + `
    :host {
      --ps-up-button-tone-background: var(--ps-up-button-primary-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-primary-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-primary-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-primary-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-primary-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-primary-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-primary-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-primary-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-primary-active-border-color);

      --ps-up-button-background: var(--ps-up-button-tone-background);
      --ps-up-button-foreground: var(--ps-up-button-tone-foreground);
      --ps-up-button-border-color: var(--ps-up-button-tone-border-color);
      --ps-up-button-hover-background: var(--ps-up-button-tone-hover-background);
      --ps-up-button-hover-foreground: var(--ps-up-button-tone-hover-foreground);
      --ps-up-button-hover-border-color: var(--ps-up-button-tone-hover-border-color);
      --ps-up-button-active-background: var(--ps-up-button-tone-active-background);
      --ps-up-button-active-foreground: var(--ps-up-button-tone-active-foreground);
      --ps-up-button-active-border-color: var(--ps-up-button-tone-active-border-color);

      --p-button-transition-duration: var(--ps-up-button-transition-duration);
      --p-button-border-radius: var(--ps-up-button-border-radius);
      --p-button-padding-y: var(--ps-up-button-padding-block);
      --p-button-padding-x: var(--ps-up-button-padding-inline);
      --p-button-gap: var(--ps-up-button-content-gap);
      --p-button-label-font-weight: var(--ps-up-button-font-weight);
      --p-button-primary-background: var(--ps-up-button-background);
      --p-button-primary-color: var(--ps-up-button-foreground);
      --p-button-primary-border-color: var(--ps-up-button-border-color);
      --p-button-primary-hover-background: var(--ps-up-button-hover-background);
      --p-button-primary-hover-color: var(--ps-up-button-hover-foreground);
      --p-button-primary-hover-border-color: var(--ps-up-button-hover-border-color);
      --p-button-primary-active-background: var(--ps-up-button-active-background);
      --p-button-primary-active-color: var(--ps-up-button-active-foreground);
      --p-button-primary-active-border-color: var(--ps-up-button-active-border-color);
      --p-button-primary-focus-ring-shadow: var(--ps-up-button-focus-shadow);
      --p-button-outlined-primary-border-color: var(--ps-up-button-tone-border-color);
      --p-button-outlined-primary-color: var(--ps-up-button-tone-background);
      --p-button-outlined-primary-hover-background: var(--ps-up-button-outlined-hover-background);
      --p-button-outlined-primary-active-background: var(--ps-up-button-outlined-active-background);
      --p-button-text-primary-color: var(--ps-up-button-tone-background);
      --p-button-text-primary-hover-background: var(--ps-up-button-text-hover-background);
      --p-button-text-primary-active-background: var(--ps-up-button-text-active-background);

      display: inline-flex;
      max-width: 100%;
    }

    :host([data-resolved-tone='secondary']) {
      --ps-up-button-tone-background: var(--ps-up-button-secondary-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-secondary-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-secondary-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-secondary-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-secondary-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-secondary-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-secondary-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-secondary-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-secondary-active-border-color);
    }

    :host([data-resolved-tone='success']) {
      --ps-up-button-tone-background: var(--ps-up-button-success-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-success-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-success-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-success-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-success-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-success-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-success-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-success-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-success-active-border-color);
    }

    :host([data-resolved-tone='info']) {
      --ps-up-button-tone-background: var(--ps-up-button-info-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-info-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-info-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-info-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-info-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-info-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-info-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-info-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-info-active-border-color);
    }

    :host([data-resolved-tone='warning']) {
      --ps-up-button-tone-background: var(--ps-up-button-warning-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-warning-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-warning-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-warning-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-warning-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-warning-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-warning-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-warning-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-warning-active-border-color);
    }

    :host([data-resolved-tone='error']) {
      --ps-up-button-tone-background: var(--ps-up-button-error-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-error-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-error-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-error-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-error-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-error-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-error-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-error-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-error-active-border-color);
    }

    :host([data-resolved-tone='help']) {
      --ps-up-button-tone-background: var(--ps-up-button-help-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-help-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-help-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-help-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-help-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-help-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-help-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-help-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-help-active-border-color);
    }

    :host([data-resolved-tone='contrast']) {
      --ps-up-button-tone-background: var(--ps-up-button-contrast-background);
      --ps-up-button-tone-foreground: var(--ps-up-button-contrast-foreground);
      --ps-up-button-tone-border-color: var(--ps-up-button-contrast-border-color);
      --ps-up-button-tone-hover-background: var(--ps-up-button-contrast-hover-background);
      --ps-up-button-tone-hover-foreground: var(--ps-up-button-contrast-hover-foreground);
      --ps-up-button-tone-hover-border-color: var(--ps-up-button-contrast-hover-border-color);
      --ps-up-button-tone-active-background: var(--ps-up-button-contrast-active-background);
      --ps-up-button-tone-active-foreground: var(--ps-up-button-contrast-active-foreground);
      --ps-up-button-tone-active-border-color: var(--ps-up-button-contrast-active-border-color);
    }
  ` + "`" + `,
})
export class PublicUpButtonComponent {
  readonly label = input('Button');
  readonly icon = input<PublicUpButtonIcon | undefined>();
  readonly intent = input<PublicUpButtonIntent>('primary');
  readonly appearance = input<PublicUpButtonAppearance>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  /** @deprecated Use intent for new consumers. */
  readonly tone = input<PublicUpButtonTone | undefined>(undefined);

  readonly activated = output<void>();

  /** @deprecated Use activated for new consumers. */
  readonly buttonClick = output<void>();

  protected readonly providerStyle = {
    maxWidth: '100%',
    minHeight: 'var(--ps-up-button-min-height)',
    whiteSpace: 'normal',
  } as const;

  protected readonly resolvedTone = computed<PublicUpButtonTone>(() => this.tone() ?? intentTone[this.intent()]);
  protected readonly providerVariant = computed<PrimeButtonVariant>(() => {
    const appearance = this.appearance();
    return appearance === 'solid' ? undefined : appearance;
  });
  protected readonly iconClass = computed(() => {
    const icon = this.icon() as string | undefined;
    if (!icon) {
      return undefined;
    }

    // Temporary runtime compatibility for existing Candidate QA markup.
    // Provider class strings are not part of the typed public contract.
    if (icon.startsWith('pi ')) {
      return icon;
    }

    return iconClassByName[icon as PublicUpButtonIcon];
  });

  handleActivate(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.activated.emit();
    this.buttonClick.emit();
  }
}
`;

await write('packages/ui-patterns/src/public-up-button.component.ts', component);

let index = await read('packages/ui-patterns/src/index.ts');
index = replaceRequired(
  index,
  "  type PublicUpButtonIcon,\n  type PublicUpButtonTone,",
  "  type PublicUpButtonIcon,\n  type PublicUpButtonIntent,\n  type PublicUpButtonTone,",
  'ui-patterns exports',
);
await write('packages/ui-patterns/src/index.ts', index);

let registry = await read('packages/ui-patterns/src/manifest/component-registry.ts');
const upButtonEntry = String.raw`  entry({
    id: 'ps-up-button',
    name: 'UP Button Candidate',
    exportName: 'PublicUpButtonComponent',
    selector: 'ps-up-button',
    source: 'packages/ui-patterns/src/public-up-button.component.ts',
    description: 'Opinionated PrimeNG facade exposing product intent while keeping provider controls private.',
    status: 'candidate',
    productionUse: false,
    replacementFor: 'ps-button',
    provider: 'primeng',
    providerModules: ['primeng/button'],
    knownLimitations: [
      'Legacy tone and buttonClick aliases remain during the Candidate compatibility window.',
      'Figma property mapping and manual screen-reader review remain pending.',
    ],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Button' },
      { name: 'icon', type: 'PublicUpButtonIcon | undefined' },
      { name: 'intent', type: 'PublicUpButtonIntent', defaultValue: 'primary', description: 'Preferred consumer-driven action purpose.' },
      { name: 'appearance', type: 'PublicUpButtonAppearance', defaultValue: 'solid' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
      { name: 'tone', type: 'PublicUpButtonTone | undefined', description: 'Deprecated Candidate compatibility alias; use intent.' },
    ],
    outputs: [
      { name: 'activated', type: 'void', description: 'Preferred high-level action event.' },
      { name: 'buttonClick', type: 'void', description: 'Deprecated Candidate compatibility alias; use activated.' },
    ],
    publicTypes: ['PublicUpButtonIntent', 'PublicUpButtonTone', 'PublicUpButtonAppearance', 'PublicUpButtonIcon'],
    variants: [
      { name: 'intent', values: ['primary', 'secondary', 'destructive'] },
      { name: 'appearance', values: ['solid', 'outlined', 'text'] },
    ],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Candidates/Button UP',
    storybookFiles: [
      'apps/qa-remote/src/stories/up-button.stories.ts',
      'apps/qa-remote/src/stories/opinionated-wrapper-contract.stories.ts',
    ],
    stories: [
      'Primary',
      'ToneMatrix',
      'AppearanceMatrix',
      'InteractionStateReference',
      'LightDarkModeMatrix',
      'CurrentVsCandidate',
      'ApprovedApi',
      'SupportedIntentMatrix',
      'ProviderTranslation',
    ],
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts'],
    behaviors: ['pointer activation', 'keyboard activation', 'disabled suppression', 'loading state', 'visible focus', 'light and dark mode'],
    documentationStatus: 'complete',
    documentationFiles: [
      'docs/design-system/architecture/opinionated-wrapper-contract.md',
      'docs/design-system/components/up-button-candidate-overview.md',
      'docs/design-system/components/up-button-candidate-integration-plan.md',
      'docs/design-system/components/up-button-candidate-developer.md',
    ],
    accessibilityPattern: 'button',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    zeroheightStatus: 'draft',
    zeroheightTemplate: 'component-candidate',
    governanceTier: 'candidate',
    designReview: 'pending',
    promotionRequirements: [
      'Approve the opinionated intent API.',
      'Remove or time-box legacy Candidate aliases.',
      'Validate the Figma property mapping.',
      'Complete manual accessibility review.',
      'Record the final promotion decision.',
    ],
    blockers: ['Design review is pending.', 'Manual screen-reader audit is pending.'],
    warnings: ['Legacy Candidate aliases remain visible until current QA examples migrate.'],
  }),`;
registry = registry.replace(
  /  entry\(\{\n    id: 'ps-up-button',[\s\S]*?\n  \}\),\n  entry\(\{\n    id: 'ps-card'/,
  `${upButtonEntry}\n  entry({\n    id: 'ps-card'`,
);
if (!registry.includes("provider: 'primeng',\n    providerModules: ['primeng/button'],\n    knownLimitations")) {
  throw new Error('UP Button manifest entry was not replaced.');
}
await write('packages/ui-patterns/src/manifest/component-registry.ts', registry);

let validator = await read('scripts/build-component-manifest.mjs');
validator = replaceRequired(
  validator,
  "    if (implementation.providerModules.length > 0) {\n      const missing = implementation.providerModules.filter((moduleName) => !detectedPrimeNgImports.includes(moduleName));\n      if (missing.length > 0) {\n        addProblem(problems, `${identity.id}: declared provider modules were not detected: ${missing.join(', ')}`);\n      }\n    }\n",
  "    if (implementation.providerModules.length > 0) {\n      const missing = implementation.providerModules.filter((moduleName) => !detectedPrimeNgImports.includes(moduleName));\n      if (missing.length > 0) {\n        addProblem(problems, `${identity.id}: declared provider modules were not detected: ${missing.join(', ')}`);\n      }\n    }\n\n    const providerSpecificMembers = new Set([\n      'severity',\n      'styleClass',\n      'pt',\n      'unstyled',\n      'buttonProps',\n      'badgeClass',\n      'loadingIcon',\n      'raised',\n      'rounded',\n      'plain',\n      'fluid',\n    ]);\n    const publicMemberNames = [\n      ...entry.publicApi.inputs,\n      ...entry.publicApi.outputs,\n      ...entry.publicApi.models,\n    ].map((member) => member.name);\n    const undeclaredProviderLeaks = publicMemberNames.filter(\n      (name) => providerSpecificMembers.has(name) && !implementation.providerEscapeHatches.includes(name),\n    );\n    if (implementation.providerInternalOnly && undeclaredProviderLeaks.length > 0) {\n      addProblem(\n        problems,\n        `${identity.id}: provider-specific public members must be removed or declared as escape hatches: ${undeclaredProviderLeaks.join(', ')}`,\n      );\n    }\n",
  'manifest provider leak validation',
);
validator = replaceRequired(
  validator,
  "    if (entry.ownership.owner === null) {\n      warnings.push(`${identity.id}: owner is not assigned.`);\n    }\n",
  "    if (entry.ownership.owner === null) {\n      warnings.push(`${identity.id}: owner is not assigned.`);\n    }\n    for (const escapeHatch of implementation.providerEscapeHatches) {\n      warnings.push(`${identity.id}: provider escape hatch remains public: ${escapeHatch}.`);\n    }\n",
  'manifest escape-hatch warnings',
);
await write('scripts/build-component-manifest.mjs', validator);

const story = String.raw`import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  PublicUpButtonComponent,
  type PublicUpButtonAppearance,
  type PublicUpButtonIntent,
} from '@public-sector/ui-patterns';

const intents: PublicUpButtonIntent[] = ['primary', 'secondary', 'destructive'];
const appearances: PublicUpButtonAppearance[] = ['solid', 'outlined', 'text'];

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
    template: ` + "`" + `
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
            appearance="outlined"
            (activated)="activations = activations + 1"
          />
          <output aria-live="polite">Activations: {{ activations }}</output>
        </section>
      </main>
    ` + "`" + `,
    styles: [pageStyles],
  }),
};

export const SupportedIntentMatrix: Story = {
  render: () => ({
    props: { intents, appearances },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: ` + "`" + `
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
    ` + "`" + `,
    styles: [pageStyles],
  }),
};

export const ProviderTranslation: Story = {
  render: () => ({
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: ` + "`" + `
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
    ` + "`" + `,
    styles: [pageStyles],
  }),
};

export const CompatibilityWindow: Story = {
  render: () => ({
    props: { preferred: 0, legacy: 0 },
    moduleMetadata: { imports: [PublicUpButtonComponent] },
    template: ` + "`" + `
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
    ` + "`" + `,
    styles: [pageStyles],
  }),
};

const pageStyles = ` + "`" + `
  .contract-page {
    display: grid;
    gap: 1.5rem;
    min-height: 100vh;
    padding: clamp(1rem, 4vw, 3rem);
    background: var(--p-content-background);
    color: var(--p-text-color);
  }
  header { max-width: 70rem; }
  header p { margin: 0 0 0.35rem; color: var(--p-primary-color); font-weight: 800; text-transform: uppercase; }
  header h1 { margin: 0 0 0.5rem; font-size: clamp(2rem, 5vw, 3.5rem); }
  header span { color: var(--p-text-muted-color); }
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
` + "`" + `;
`;
await write('apps/qa-remote/src/stories/opinionated-wrapper-contract.stories.ts', story);

let e2e = await read('scripts/storybook-e2e.mjs');
e2e = replaceRequired(
  e2e,
  "    'design-system-registry-component-manifest--overview',\n",
  "    'design-system-registry-component-manifest--overview',\n    'design-system-architecture-opinionated-wrapper-contract--approved-api',\n",
  'Storybook representative story list',
);
e2e = replaceRequired(
  e2e,
  "    if (storyId.includes('component-manifest')) {\n      await waitForStory(page.getByRole('heading', { name: 'Component Registry' }), storyId, 'the Component Registry heading');\n      await waitForStory(page.getByRole('row', { name: /Paginator/ }), storyId, 'the Paginator registry row');\n      await waitForStory(page.getByRole('row', { name: /Toast Service/ }), storyId, 'the Toast Service registry row');\n    }\n",
  "    if (storyId.includes('component-manifest')) {\n      await waitForStory(page.getByRole('heading', { name: 'Component Registry' }), storyId, 'the Component Registry heading');\n      await waitForStory(page.getByRole('row', { name: /Paginator/ }), storyId, 'the Paginator registry row');\n      await waitForStory(page.getByRole('row', { name: /Toast Service/ }), storyId, 'the Toast Service registry row');\n    }\n    if (storyId.includes('opinionated-wrapper-contract')) {\n      await waitForStory(page.getByRole('heading', { name: 'Approved high-level API' }), storyId, 'the approved API heading');\n      await waitForStory(page.getByText('Private provider controls'), storyId, 'the private provider controls section');\n      const destructiveButton = page.getByRole('button', { name: 'Delete draft' });\n      await waitForStory(destructiveButton, storyId, 'the destructive intent button');\n      await destructiveButton.click();\n      await waitForStory(page.getByText('Activations: 1'), storyId, 'the normalized activated output');\n    }\n",
  'Storybook wrapper contract assertion',
);
await write('scripts/storybook-e2e.mjs', e2e);

const architectureDoc = String.raw`# Opinionated Wrapper Contract

## Decision

Public wrappers expose the smallest useful design-system contract required by the
shell and subapps. PrimeNG remains a private rendering and behavior provider.

The team does not mirror every PrimeNG parameter, callback, template, or styling
escape hatch simply because the provider makes it available.

```text
consumer need
    -> approved design-system concept
    -> typed public wrapper contract
    -> private PrimeNG translation
    -> tested runtime behavior
```

## Public versus private API

The UP Button Candidate now demonstrates the preferred boundary.

### Public contract

- `label`
- provider-neutral `icon`
- `intent`: `primary`, `secondary`, or `destructive`
- `appearance`: `solid`, `outlined`, or `text`
- `disabled`
- `loading`
- `activated`

### Private PrimeNG implementation

The wrapper may use PrimeNG `variant`, `styleClass`, loading behavior, provider CSS
variables, event payloads, and icon classes internally. Applications do not receive
those controls as part of the supported design-system contract.

## Why intent replaces provider inventory

PrimeNG offers a broad severity vocabulary. The Candidate does not publish that
inventory as the preferred application API. It starts with product-facing action
purposes that the shell and subapps can justify:

| Public intent | Design-system meaning | Private token mapping |
| --- | --- | --- |
| `primary` | Main action for the current task | UP primary Button tokens |
| `secondary` | Supporting or alternative action | UP secondary Button tokens |
| `destructive` | Action with destructive consequences | UP error Button tokens |

New intents require a validated consumer need, design review, Storybook evidence,
accessibility review, and a reviewed manifest change.

## Normalized events

The preferred `activated` output emits `void`. Consumers receive the information
that the governed action occurred without depending on PrimeNG's `onClick` callback
or a browser `MouseEvent` payload.

A lower-level event should be added only when a real application requirement cannot
be met through the high-level action contract.

## Compatibility window

The Candidate previously published `tone` and `buttonClick`. They remain temporary
compatibility aliases so existing QA and Storybook evidence does not break during
the refactor.

- New work uses `intent` and `activated`.
- The manifest records the aliases as known limitations.
- Storybook shows preferred and compatibility usage side by side.
- Promotion must remove the aliases or define an explicit deprecation window.

Compatibility is not permission to add more mirrored PrimeNG controls.

## Enforcement

`pnpm manifest:check` now checks provider-specific public member names. A wrapper
that keeps PrimeNG internal must either remove a provider-specific member or record
it as an explicit escape hatch.

Known escape hatches remain advisory warnings. For example, the stable `ps-button`
still records `styleClass` while the Candidate exposes no equivalent consumer
styling hook.

## Storybook evidence

Open:

```text
Design System / Architecture / Opinionated Wrapper Contract
```

The stories cover:

- the approved public API;
- the hidden PrimeNG controls;
- the supported intent matrix;
- provider translation;
- the temporary compatibility window.

Storybook is evidence and explanation. The component manifest remains the
machine-readable contract.

## Human decision points

Automation can extract source facts, generate matrices, detect provider leaks, and
prepare review artifacts. Humans still approve:

- whether a consumer need justifies a new input or event;
- semantic vocabulary;
- supported combinations;
- accessibility behavior;
- breaking changes and deprecation windows;
- Figma mappings;
- Candidate promotion.
`;
await write('docs/design-system/architecture/opinionated-wrapper-contract.md', architectureDoc);

const developerDoc = String.raw`# Developer

## Preferred usage

```typescript
import { PublicUpButtonComponent } from '@public-sector/ui-patterns';
```

```typescript
@Component({
  standalone: true,
  imports: [PublicUpButtonComponent],
  template: ` + "`" + `
    <ps-up-button
      label="Submit application"
      icon="check"
      intent="primary"
      appearance="solid"
      (activated)="submitApplication()"
    />
  ` + "`" + `,
})
export class ApplicationActionsComponent {
  submitApplication(): void {
    // Application behavior.
  }
}
```

## Preferred public API

| Member | Type | Default | Purpose |
| --- | --- | --- | --- |
| `label` | `string` | `Button` | Visible action label. |
| `icon` | `PublicUpButtonIcon \| undefined` | `undefined` | Provider-neutral approved icon name. |
| `intent` | `primary \| secondary \| destructive` | `primary` | Product-facing action purpose. |
| `appearance` | `solid \| outlined \| text` | `solid` | Visual emphasis model. |
| `disabled` | `boolean` | `false` | Prevents activation. |
| `loading` | `boolean` | `false` | Shows progress and prevents duplicate activation. |
| `activated` | `void` output | — | Signals that the governed action occurred. |

PrimeNG severity names, variant flags, `styleClass`, PassThrough configuration,
unstyled mode, and provider callback payloads are not public Candidate controls.

## Intent

```typescript
export type PublicUpButtonIntent =
  | 'primary'
  | 'secondary'
  | 'destructive';
```

Use intent to describe the role of the action, not its provider color name.

```html
<ps-up-button label="Save changes" icon="save" intent="primary" />
<ps-up-button label="Save draft" icon="save" intent="secondary" appearance="outlined" />
<ps-up-button label="Delete draft" icon="times-circle" intent="destructive" />
```

## Provider boundary

`ps-up-button` renders PrimeNG internally. The wrapper translates:

- `intent` into UP Button token mappings;
- `appearance` into the private PrimeNG variant;
- provider-neutral icon names into PrimeIcons classes;
- PrimeNG `onClick` into the `activated` output;
- loading and disabled inputs into provider behavior.

Applications continue to import only `@public-sector/ui-patterns`.

## Compatibility aliases

The Candidate temporarily retains:

| Alias | Replacement | Status |
| --- | --- | --- |
| `tone` | `intent` | Deprecated Candidate compatibility alias |
| `buttonClick` | `activated` | Deprecated Candidate compatibility alias |

Do not use the aliases in new application examples. They remain only so existing QA
and Storybook evidence can migrate without an unrelated breaking change.

## Behavior

- PrimeNG is the private rendering engine.
- `loading` and `disabled` suppress activation.
- `activated` emits no provider or browser event payload.
- The public icon vocabulary remains provider-neutral.
- Component tokens map into PrimeNG Button variables at the wrapper boundary.
- The Candidate does not expose arbitrary application styling hooks.

## Storybook

Use these Storybook areas:

```text
Design System / Candidates / Button UP
Design System / Architecture / Opinionated Wrapper Contract
```

The architecture stories explain the API boundary. Candidate stories provide
visual, interaction, theme, and compatibility evidence.

## Promotion guidance

The stable `ps-button` remains the production component. Candidate promotion still
requires approved Figma mappings, manual accessibility review, a compatibility
plan, and a human promotion decision.

See:

- [Opinionated wrapper contract](../architecture/opinionated-wrapper-contract.md)
- [Candidate overview](./up-button-candidate-overview.md)
- [Candidate integration plan](./up-button-candidate-integration-plan.md)
- [Candidate validation](./up-button-candidate-validation.md)
`;
await write('docs/design-system/components/up-button-candidate-developer.md', developerDoc);

let overview = await read('docs/design-system/components/up-button-candidate-overview.md');
overview = overview
  .replace(
    'It renders native Button markup, replaces separate `outlined` and `text` booleans with a single `appearance` API, applies Candidate UP-style token mappings, and directly owns hover, active, focus, disabled, and loading treatments.',
    'It now acts as an opinionated PrimeNG facade: it exposes product-facing `intent`, a single `appearance` API, provider-neutral icons, and `activated`, while translating those concepts into private PrimeNG behavior and UP-style token mappings.',
  )
  .replace('| Rendering | Wraps PrimeNG `p-button` | Renders native `<button>` markup |', '| Rendering | Wraps PrimeNG `p-button` | Wraps PrimeNG through a smaller Candidate-owned facade |')
  .replace('| Styling ownership | Uses the shared PrimeNG preset | Owns Candidate Button CSS and token mappings |', '| Styling ownership | Uses the shared PrimeNG preset | Maps Candidate Button tokens into private PrimeNG variables |')
  .replace('| Behavior | Delegates provider behavior through the wrapper | Normalizes activation and suppresses disabled or loading clicks |', '| Behavior | Delegates provider behavior through the wrapper | Normalizes PrimeNG activation to `activated` and suppresses disabled or loading actions |')
  .replace('| Accessibility | Combines PrimeNG semantics with wrapper behavior | Explicitly controls disabled, loading, focus, and `aria-busy` behavior |', '| Accessibility | Combines PrimeNG semantics with wrapper behavior | Uses PrimeNG semantics while retaining Candidate loading, focus, and activation requirements |')
  .replace('- native Button rendering;', '- an opinionated PrimeNG facade rather than a mirrored provider API;')
  .replace('the current `ps-up-button` namespace and native rendering model are public-sector Candidate decisions', 'the current `ps-up-button` namespace and opinionated wrapper contract are public-sector Candidate decisions');
await write('docs/design-system/components/up-button-candidate-overview.md', overview);

let candidate = await read('docs/design-system/components/up-button-candidate.md');
candidate = candidate.replace(
  'a more design-system-owned Button API, native rendering model, token mapping, state styling, accessibility ownership, and promotion process.',
  'a more design-system-owned Button API, opinionated PrimeNG facade, token mapping, normalized events, accessibility ownership, and promotion process.',
);
await write('docs/design-system/components/up-button-candidate.md', candidate);

let integration = await read('docs/design-system/components/up-button-candidate-integration-plan.md');
integration = integration
  .replace('- [x] Candidate is intended to appear in the QA remote for side-by-side and federated-runtime validation.', '- [x] Candidate is intended to appear in the QA remote for side-by-side and federated-runtime validation.\n- [x] Candidate refactored into an opinionated PrimeNG facade with preferred `intent` and `activated` APIs.')
  .replace('- [ ] Decide whether destructive styling is a tone or a separate intent.', '- [x] Destructive behavior is represented as the product-facing `destructive` intent.')
  .replace('### Tone\n\n- [ ] Confirm the UP Design System tone vocabulary.\n- [x] Candidate currently implements:', '### Intent and compatibility tone\n\n- [x] Preferred Candidate intent vocabulary is `primary`, `secondary`, and `destructive`.\n- [ ] Confirm that vocabulary against the approved UP Design System source.\n- [x] The temporary compatibility `tone` alias still accepts:')
  .replace('- [x] `buttonClick` remains the normalized wrapper event.', '- [x] `activated` is the preferred normalized wrapper event and emits no provider payload.\n- [x] `buttonClick` remains a deprecated Candidate compatibility alias.');
await write('docs/design-system/components/up-button-candidate-integration-plan.md', integration);

let test = await read('apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts');
test = replaceRequired(
  test,
  "    await expect(button).toHaveAttribute('aria-busy', 'true');",
  "    await expect(page.locator('ps-up-button')).toHaveAttribute('aria-busy', 'true');",
  'UP Button loading accessibility assertion',
);
await write('apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts', test);

console.log('Opinionated wrapper refactor applied.');
