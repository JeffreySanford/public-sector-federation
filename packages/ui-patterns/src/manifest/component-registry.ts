import type {
  ComponentManifest,
  ComponentFinding,
  ComponentManifestEntry,
  EvidenceStatus,
  ProviderKind,
  PublicApiMember,
  RegistryKind,
} from './component-meta.types';

interface EntrySeed {
  id: string;
  name: string;
  exportName: string;
  selector: string | null;
  selectorAliases?: string[];
  source: string;
  description: string;
  provider: ProviderKind;
  kind?: RegistryKind;
  status?: ComponentManifestEntry['lifecycle']['status'];
  productionUse?: boolean;
  replacementFor?: string;
  replacedBy?: string;
  providerModules?: string[];
  providerEscapeHatches?: string[];
  knownLimitations?: string[];
  publicApiStatus?: EvidenceStatus;
  inputs?: PublicApiMember[];
  outputs?: PublicApiMember[];
  models?: PublicApiMember[];
  publicTypes?: string[];
  variants?: Array<{ name: string; values: string[] }>;
  storybookStatus?: EvidenceStatus;
  storybookTitle?: string;
  storybookFiles?: string[];
  stories?: string[];
  testStatus?: EvidenceStatus;
  testFiles?: string[];
  behaviors?: string[];
  documentationStatus?: EvidenceStatus;
  documentationFiles?: string[];
  accessibilityPattern?: string;
  automatedChecks?: EvidenceStatus;
  keyboardCoverage?: EvidenceStatus;
  zeroheightStatus?: ComponentManifestEntry['zeroheight']['status'];
  zeroheightTemplate?: string;
  governanceTier?: ComponentManifestEntry['governance']['tier'];
  designReview?: ComponentManifestEntry['governance']['designReview'];
  promotionRequirements?: string[];
  blockers?: string[];
  warnings?: string[];
  duplicationCluster?: string;
  disposition?: ComponentManifestEntry['audit']['disposition'];
  tokenBoundary?: ComponentManifestEntry['audit']['tokenBoundary'];
  findingIds?: string[];
}

const genericDocumentation = [
  'docs/design-system/components/catalog.md',
  'docs/design-system/architecture/registry-consumption-spec.md',
];

function providerName(provider: ProviderKind): ComponentManifestEntry['implementation']['providerName'] {
  switch (provider) {
    case 'primeng':
      return 'PrimeNG';
    case 'native':
      return 'Native';
    case 'composite':
      return 'Mixed';
    case 'service':
      return 'None';
  }
}

function entry(seed: EntrySeed): ComponentManifestEntry {
  const isService = seed.kind === 'service' || seed.provider === 'service';
  const storybookStatus = seed.storybookStatus ?? 'missing';
  const testStatus = seed.testStatus ?? 'missing';
  const warnings = [
    ...(seed.warnings ?? []),
    ...(storybookStatus === 'missing' && !isService ? ['No dedicated Storybook evidence is recorded.'] : []),
    ...(testStatus === 'missing' && !isService ? ['No dedicated automated behavior evidence is recorded.'] : []),
    ...(seed.publicApiStatus !== 'complete' ? ['Public API inventory is not yet fully extracted from source.'] : []),
  ];

  return {
    schemaVersion: 1,
    identity: {
      id: seed.id,
      name: seed.name,
      kind: seed.kind ?? 'component',
      exportName: seed.exportName,
      selector: seed.selector,
      selectorAliases: seed.selectorAliases ?? [],
      package: '@public-sector/ui-patterns',
      source: seed.source,
      description: seed.description,
    },
    lifecycle: {
      status: seed.status ?? 'active',
      productionUse: seed.productionUse ?? true,
      ...(seed.replacementFor ? { replacementFor: seed.replacementFor } : {}),
      ...(seed.replacedBy ? { replacedBy: seed.replacedBy } : {}),
    },
    ownership: { owner: null, steward: null },
    publicApi: {
      status: seed.publicApiStatus ?? 'partial',
      inputs: seed.inputs ?? [],
      outputs: seed.outputs ?? [],
      models: seed.models ?? [],
      publicTypes: seed.publicTypes ?? [],
    },
    implementation: {
      provider: seed.provider,
      providerName: providerName(seed.provider),
      providerInternalOnly: true,
      providerModules: seed.providerModules ?? [],
      providerEscapeHatches: seed.providerEscapeHatches ?? [],
      knownLimitations: seed.knownLimitations ?? [],
    },
    variants: {
      properties: seed.variants ?? [],
      supportedCombinations: [],
    },
    tokens: { semantic: [], providerBridge: [], status: 'partial' },
    accessibility: {
      pattern: seed.accessibilityPattern ?? null,
      automatedChecks: seed.automatedChecks ?? (storybookStatus === 'complete' ? 'partial' : 'missing'),
      keyboardCoverage: seed.keyboardCoverage ?? 'missing',
      screenReaderAudit: isService ? 'not-applicable' : 'pending',
      knownResponsibilities: isService
        ? []
        : ['Consumers remain responsible for accessible page composition and meaningful content.'],
    },
    evidence: {
      storybook: {
        status: storybookStatus,
        title: seed.storybookTitle ?? null,
        files: seed.storybookFiles ?? [],
        stories: seed.stories ?? [],
      },
      tests: {
        status: testStatus,
        files: seed.testFiles ?? [],
        behaviors: seed.behaviors ?? [],
      },
      documentation: {
        status: seed.documentationStatus ?? 'partial',
        files: seed.documentationFiles ?? genericDocumentation,
      },
    },
    figma: {
      status: isService ? 'not-applicable' : 'pending-access',
      componentKey: null,
      componentSetKey: null,
      propertyMappings: [],
    },
    zeroheight: {
      status: seed.zeroheightStatus ?? (isService ? 'not-applicable' : 'planned'),
      pageId: null,
      template: seed.zeroheightTemplate ?? (isService ? null : 'component'),
    },
    governance: {
      tier: seed.governanceTier ?? (seed.status === 'candidate' ? 'candidate' : 'core'),
      designReview: seed.designReview ?? (seed.status === 'candidate' ? 'pending' : 'not-started'),
      promotionRequirements: seed.promotionRequirements ?? [],
    },
    audit: {
      duplicationCluster: seed.duplicationCluster ?? `unique:${seed.id}`,
      disposition: seed.disposition ?? 'investigate',
      tokenBoundary:
        seed.tokenBoundary
        ?? (isService ? 'not-applicable' : seed.provider === 'primeng' ? 'provider-managed' : 'provider-coupled'),
      findingIds: seed.findingIds ?? [],
    },
    health: {
      repositoryReadiness: seed.blockers?.length ? 'blocked' : warnings.length ? 'partial' : 'ready',
      externalDesignBinding: isService ? 'ready' : 'partial',
      blockers: seed.blockers ?? [],
      warnings,
    },
  };
}

const buttonStories = ['apps/qa-remote/src/stories/button.stories.ts'];
const dialogStories = ['apps/qa-remote/src/stories/dialog.stories.ts'];
const dialogToastStories = ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'];
const shellTokenEvidence = ['apps/shell/e2e/token-consumption.spec.ts'];

const flagshipComponents = ['ps-button', 'ps-select', 'ps-dialog'];

export const componentFindings: ComponentFinding[] = [
  {
    id: 'API-PRIMITIVE-001',
    category: 'api',
    severity: 'advisory',
    status: 'verified',
    componentIds: flagshipComponents,
    summary:
      'Provider-wrapper, native, and Angular CDK selection criteria are recorded for Button, Select, and Dialog.',
    evidence: [
      'docs/design-system/architecture/component-primitive-strategy.md',
      'docs/documentation-upgrade/20-component-consolidation-proposal.md',
    ],
  },
  {
    id: 'API-BTN-001',
    category: 'api',
    severity: 'moderate',
    status: 'planned',
    componentIds: ['ps-button', 'ps-up-button'],
    summary:
      'The approved ps-button target uses intent, appearance, disabled, loading, governed icons, and activated; compatibility aliases remain supported until the next major release.',
    evidence: [
      'packages/ui-patterns/src/public-button.component.ts',
      'packages/ui-patterns/src/public-up-button.component.ts',
      'docs/design-system/components/button-api-migration.md',
      'docs/documentation-upgrade/18-component-estate-audit.md',
      'docs/documentation-upgrade/20-component-consolidation-proposal.md',
    ],
  },
  {
    id: 'API-NAMING-001',
    category: 'api',
    severity: 'advisory',
    status: 'implemented',
    componentIds: ['ps-empty-state', 'ps-form-section', 'ps-page-header', 'ps-status-card'],
    summary:
      'The canonical selector family is ps-*; legacy public-* aliases remain supported until the next major release.',
    evidence: [
      'docs/design-system/components/selector-prefix-migration.md',
      'packages/ui-patterns/src/public-empty-state.component.ts',
      'packages/ui-patterns/src/public-form-section.component.ts',
      'packages/ui-patterns/src/public-page-header.component.ts',
      'packages/ui-patterns/src/public-status-card.component.ts',
      'docs/documentation-upgrade/18-component-estate-audit.md',
    ],
  },
  {
    id: 'API-PARTIAL-001',
    category: 'api',
    severity: 'advisory',
    status: 'open',
    componentIds: ['ps-card', 'ps-tag', 'ps-toast', 'public-toast-service'],
    summary:
      'Public API extraction remains partial for four exported entries.',
    evidence: [
      'packages/ui-patterns/src/manifest/component-registry.ts',
      'packages/ui-patterns/generated/component-manifest.json',
    ],
  },
  {
    id: 'TOKEN-NATIVE-001',
    category: 'token',
    severity: 'moderate',
    status: 'open',
    componentIds: [
      'ps-card',
      'ps-dialog',
      'ps-empty-state',
      'ps-form-section',
      'ps-page-header',
      'ps-paginator',
      'ps-progress',
      'ps-skeleton',
      'ps-status-card',
      'ps-toast',
    ],
    summary:
      'Native and composite components consume PrimeNG --p-* variables directly instead of depending only on the public --ps-* token contract.',
    evidence: [
      'packages/ui-patterns/src/public-card.component.ts',
      'packages/ui-patterns/src/public-dialog.component.ts',
      'packages/ui-patterns/src/public-empty-state.component.ts',
      'packages/ui-patterns/src/public-form-section.component.ts',
      'packages/ui-patterns/src/public-page-header.component.ts',
      'packages/ui-patterns/src/public-paginator.component.ts',
      'packages/ui-patterns/src/public-progress.component.ts',
      'packages/ui-patterns/src/public-skeleton.component.ts',
      'packages/ui-patterns/src/public-status-card.component.ts',
      'packages/ui-patterns/src/public-toast.component.ts',
      'docs/documentation-upgrade/18-component-estate-audit.md',
    ],
  },
  {
    id: 'A11Y-DLG-001',
    category: 'accessibility',
    severity: 'serious',
    status: 'verified',
    componentIds: ['ps-dialog'],
    summary: 'Background content is made inert while the modal is open and restored on close.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-DLG-002',
    category: 'accessibility',
    severity: 'moderate',
    status: 'verified',
    componentIds: ['ps-dialog'],
    summary: 'Body scrolling is locked while the modal is open and restored on close.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-DLG-003',
    category: 'accessibility',
    severity: 'moderate',
    status: 'verified',
    componentIds: ['ps-dialog'],
    summary: 'The public Dialog description input provides a verified aria-describedby relationship.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-DLG-004',
    category: 'accessibility',
    severity: 'moderate',
    status: 'investigate',
    componentIds: ['ps-dialog'],
    summary: 'Stacked or nested Dialog behavior is undefined.',
    evidence: ['docs/documentation-upgrade/19-accessibility-findings-and-remediation.md'],
  },
  {
    id: 'A11Y-SEL-001',
    category: 'accessibility',
    severity: 'serious',
    status: 'verified',
    componentIds: ['ps-select'],
    summary:
      'Disabled options suppress selection and expose aria-disabled through the governed wrapper.',
    evidence: [
      'packages/ui-patterns/src/public-select.component.ts',
      'apps/qa-remote/e2e/select.storybook.spec.ts',
      'apps/qa-remote/src/stories/select.stories.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-SEL-002',
    category: 'accessibility',
    severity: 'serious',
    status: 'verified',
    componentIds: ['ps-select'],
    summary:
      'Required, invalid, help, and error states use a provider-neutral API with verified combobox relationships.',
    evidence: [
      'packages/ui-patterns/src/public-select.component.ts',
      'apps/qa-remote/src/stories/select.stories.ts',
      'apps/qa-remote/e2e/select.storybook.spec.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-BTN-001',
    category: 'accessibility',
    severity: 'moderate',
    status: 'verified',
    componentIds: ['ps-button'],
    summary: 'Stable Button keyboard activation and focus behavior have dedicated automated evidence.',
    evidence: [
      'apps/qa-remote/e2e/button.storybook.spec.ts',
      'packages/ui-patterns/src/manifest/component-registry.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-BTN-002',
    category: 'accessibility',
    severity: 'serious',
    status: 'implemented',
    componentIds: ['ps-button'],
    summary:
      'Stable Button exposes loading semantics and suppresses repeated activation; manual announcement verification remains pending.',
    evidence: [
      'apps/qa-remote/e2e/button.storybook.spec.ts',
      'apps/qa-remote/src/stories/button.stories.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-SYS-001',
    category: 'accessibility',
    severity: 'serious',
    status: 'open',
    componentIds: flagshipComponents,
    summary: 'Manual screen-reader reviews are not recorded for the flagship components.',
    evidence: [
      'packages/ui-patterns/generated/component-manifest.json',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-SYS-002',
    category: 'accessibility',
    severity: 'moderate',
    status: 'verified',
    componentIds: flagshipComponents,
    summary: 'Automated forced-colors evidence verifies visible boundaries and focus for the flagship components.',
    evidence: [
      'apps/qa-remote/e2e/button.storybook.spec.ts',
      'apps/qa-remote/e2e/select.storybook.spec.ts',
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
];


export const componentRegistry = [
  entry({
    id: 'ps-button',
    tokenBoundary: 'provider-managed',
    findingIds: ['API-PRIMITIVE-001', 'API-BTN-001', 'A11Y-BTN-001', 'A11Y-BTN-002', 'A11Y-SYS-001', 'A11Y-SYS-002'],
    duplicationCluster: 'button-contract',
    disposition: 'canonical',
    name: 'Button',
    exportName: 'PublicButtonComponent',
    selector: 'ps-button',
    source: 'packages/ui-patterns/src/public-button.component.ts',
    description: 'Stable PrimeNG-backed action wrapper used by current applications and remotes.',
    provider: 'primeng',
    providerModules: ['primeng/button'],
    providerEscapeHatches: ['styleClass'],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: "''" },
      { name: 'icon', type: 'string | undefined' },
      { name: 'intent', type: 'PublicButtonIntent', defaultValue: 'primary' },
      { name: 'appearance', type: 'PublicButtonAppearance', defaultValue: 'solid' },
      { name: 'tone', type: 'PublicButtonTone | undefined', description: 'Deprecated compatibility alias; use intent.' },
      { name: 'styleClass', type: 'string | undefined' },
      { name: 'outlined', type: 'boolean', defaultValue: 'false' },
      { name: 'text', type: 'boolean', defaultValue: 'false' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
      { name: 'routerLink', type: 'string | unknown[] | null', defaultValue: 'null' },
    ],
    outputs: [
      { name: 'activated', type: 'void', description: 'Preferred provider-neutral activation event.' },
      { name: 'buttonClick', type: 'MouseEvent', description: 'Deprecated compatibility event; use activated.' },
    ],
    publicTypes: ['PublicButtonIntent', 'PublicButtonAppearance', 'PublicButtonTone'],
    variants: [
      {
        name: 'tone',
        values: ['primary', 'secondary', 'success', 'info', 'warn', 'warning', 'danger', 'error', 'help', 'contrast'],
      },
      { name: 'appearance', values: ['solid', 'outlined', 'text'] },
    ],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Button',
    storybookFiles: buttonStories,
    stories: [
      'design-system-components-button--default',
      'design-system-components-button--appearance-reference',
      'design-system-components-button--loading',
      'design-system-components-button--disabled',
      'design-system-components-button--interaction-harness',
    ],
    testStatus: 'complete',
    testFiles: [
      'apps/qa-remote/e2e/button.storybook.spec.ts',
      ...shellTokenEvidence,
    ],
    behaviors: [
      'pointer activation',
      'Enter and Space activation',
      'single activation per input',
      'loading activation suppression',
      'loading busy semantics',
      'visible keyboard focus',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/button/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    accessibilityPattern: 'button',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    warnings: ['Legacy tone, styleClass, outlined, text, routerLink, PrimeIcons strings, and buttonClick remain supported only until the next major release.'],
  }),
  entry({
    id: 'ps-up-button',
    tokenBoundary: 'public',
    findingIds: ['API-BTN-001'],
    duplicationCluster: 'button-contract',
    disposition: 'merge',
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
    knownLimitations: ['Figma property mapping and manual screen-reader review remain pending.'],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Button' },
      { name: 'icon', type: 'PublicUpButtonIcon | undefined' },
      { name: 'intent', type: 'PublicUpButtonIntent', defaultValue: 'primary', description: 'Preferred consumer-driven action purpose.' },
      { name: 'appearance', type: 'PublicUpButtonAppearance', defaultValue: 'solid' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
    ],
    outputs: [
      { name: 'activated', type: 'void', description: 'High-level action event.' },
    ],
    publicTypes: ['PublicUpButtonIntent', 'PublicUpButtonAppearance', 'PublicUpButtonIcon'],
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
      'PreferredCandidateApi',
      'SupportedIntentMatrix',
      'ProviderTranslation',
      'CandidateContractBoundary',
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
      'Validate the Figma property mapping.',
      'Complete manual accessibility review.',
      'Record the final promotion decision.',
    ],
    blockers: ['Design review is pending.', 'Manual screen-reader audit is pending.'],
    warnings: ['The contract is proposed and remains pending design-system approval.'],
  }),
  entry({
    id: 'ps-card',
    tokenBoundary: 'provider-coupled',
    findingIds: ['API-PARTIAL-001', 'TOKEN-NATIVE-001'], name: 'Card', exportName: 'PublicCardComponent', selector: 'ps-card',
    source: 'packages/ui-patterns/src/public-card.component.ts',
    description: 'Token-driven content surface with optional heading content.', provider: 'native',
    storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Card',
    storybookFiles: ['apps/qa-remote/src/stories/card.acceptance.stories.ts'], accessibilityPattern: 'region',
  }),
  entry({
    id: 'ps-checkbox',
    tokenBoundary: 'provider-coupled',
    findingIds: [],
    duplicationCluster: 'unique:ps-checkbox',
    disposition: 'canonical',
    name: 'Checkbox',
    exportName: 'PublicCheckboxComponent',
    selector: 'ps-checkbox',
    source: 'packages/ui-patterns/src/public-checkbox.component.ts',
    description: 'Native checkbox and switch wrapper with label, help text, disabled, invalid, and required states.',
    provider: 'native',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', required: true },
      { name: 'variant', type: 'PublicCheckboxVariant', defaultValue: 'checkbox' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'required', type: 'boolean', defaultValue: 'false' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false' },
      { name: 'helpText', type: 'string', defaultValue: "''" },
      { name: 'errorText', type: 'string', defaultValue: "''" },
      { name: 'fieldId', type: 'string', description: 'Stable label and description relationship identifier.' },
    ],
    models: [{ name: 'checked', type: 'boolean', defaultValue: 'false' }],
    publicTypes: ['PublicCheckboxVariant'],
    variants: [{ name: 'variant', values: ['checkbox', 'switch'] }],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Checkbox',
    storybookFiles: ['apps/qa-remote/src/stories/checkbox.stories.ts'],
    stories: [
      'design-system-components-checkbox--default',
      'design-system-components-checkbox--switch',
      'design-system-components-checkbox--checked',
      'design-system-components-checkbox--disabled',
      'design-system-components-checkbox--required-with-help',
      'design-system-components-checkbox--invalid-with-error',
      'design-system-components-checkbox--long-label',
    ],
    accessibilityPattern: 'checkbox',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/checkbox.storybook.spec.ts'],
    behaviors: [
      'keyboard toggling with Space',
      'switch role for the switch variant',
      'disabled suppression',
      'required, invalid, help, and error relationships',
      'long-label reflow',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/checkbox/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    knownLimitations: ['Figma property mapping and manual screen-reader review remain pending.'],
  }),
  entry({
    id: 'ps-dialog',
    tokenBoundary: 'mixed',
    findingIds: ['API-PRIMITIVE-001', 'TOKEN-NATIVE-001', 'A11Y-DLG-001', 'A11Y-DLG-002', 'A11Y-DLG-003', 'A11Y-DLG-004', 'A11Y-SYS-001', 'A11Y-SYS-002'],
    duplicationCluster: 'unique:ps-dialog',
    disposition: 'retain',
    name: 'Dialog',
    exportName: 'PublicDialogComponent',
    selector: 'ps-dialog',
    source: 'packages/ui-patterns/src/public-dialog.component.ts',
    description: 'Native governed modal with labelled semantics, contained focus, dismissal, and opener restoration.',
    provider: 'native',
    knownLimitations: [
      'Configurable initial focus, stacked dialogs, Figma alignment, and manual assistive-technology review remain pending.',
    ],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'header', type: 'string', defaultValue: "''" },
      { name: 'description', type: 'string', defaultValue: "''" },
      { name: 'width', type: 'string', defaultValue: "'32rem'" },
    ],
    models: [{ name: 'visible', type: 'boolean', defaultValue: 'false' }],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Dialog',
    storybookFiles: [...dialogStories, ...dialogToastStories],
    stories: [
      'design-system-components-dialog--default',
      'design-system-components-dialog--destructive-confirmation',
      'design-system-components-dialog--long-content',
      'design-system-components-dialog--focus-sequence',
    ],
    testStatus: 'complete',
    testFiles: [
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      ...shellTokenEvidence,
    ],
    behaviors: [
      'labelled modal semantics',
      'accessible description relationship',
      'background inertness and restoration',
      'body scroll lock and restoration',
      'safe initial focus',
      'forward and reverse focus containment',
      'Escape dismissal',
      'close-button and backdrop dismissal',
      'focus restoration to the opener',
      'destructive confirmation ordering',
      'long-content modal scrolling',
      'narrow-viewport reflow',
      'light and dark modal token inheritance',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/dialog/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    accessibilityPattern: 'dialog',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    warnings: [
      'Stacked or nested dialogs are unsupported.',
      'A dedicated semantic backdrop token is not yet recorded.',
    ],
  }),
  entry({
    id: 'ps-empty-state',
    tokenBoundary: 'provider-coupled',
    findingIds: ['API-NAMING-001', 'TOKEN-NATIVE-001'], name: 'Empty State', exportName: 'PublicEmptyStateComponent', selector: 'ps-empty-state', selectorAliases: ['public-empty-state'],
    source: 'packages/ui-patterns/src/public-empty-state.component.ts',
    description: 'Composite empty-state pattern using shared tokens and the public button wrapper.',
    kind: 'pattern', provider: 'composite', accessibilityPattern: 'status', publicApiStatus: 'complete',
    inputs: [{ name: 'icon', type: 'string', defaultValue: 'pi pi-inbox' }, { name: 'title', type: 'string', required: true }, { name: 'message', type: 'string', required: true }, { name: 'actionLabel', type: 'string', defaultValue: "''" }], outputs: [{ name: 'activated', type: 'void' }],
    storybookStatus: 'complete', storybookTitle: 'Design System/Components/Empty State', storybookFiles: ['apps/qa-remote/src/stories/empty-state.stories.ts'], stories: ['Default', 'WithoutAction', 'SearchResults', 'LongContent', 'ActionEvent'],
  }),
  entry({
    id: 'ps-form-section',
    tokenBoundary: 'mixed',
    findingIds: ['API-NAMING-001', 'TOKEN-NATIVE-001'], name: 'Form Section', exportName: 'PublicFormSectionComponent', selector: 'ps-form-section', selectorAliases: ['public-form-section'],
    source: 'packages/ui-patterns/src/public-form-section.component.ts',
    description: 'Composite form grouping surface with title, description, and projected controls.',
    kind: 'pattern', provider: 'composite', accessibilityPattern: 'group', publicApiStatus: 'complete',
    inputs: [{ name: 'title', type: 'string', required: true }, { name: 'description', type: 'string', defaultValue: "''" }],
    storybookStatus: 'complete', storybookTitle: 'Design System/Components/Form Section', storybookFiles: ['apps/qa-remote/src/stories/form-section.stories.ts'], stories: ['CompleteForm', 'WithoutDescription', 'ValidationContent', 'LongResponsiveContent', 'RequiredAndOptionalFields', 'DisabledControls'],
  }),
  entry({
    id: 'ps-input',
    tokenBoundary: 'provider-coupled',
    findingIds: [],
    duplicationCluster: 'unique:ps-input',
    disposition: 'canonical',
    name: 'Input',
    exportName: 'PublicInputComponent',
    selector: 'ps-input',
    source: 'packages/ui-patterns/src/public-input.component.ts',
    description: 'Native text field wrapper supporting text, search, password, and date types with help, invalid, and required states.',
    provider: 'native',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', required: true },
      { name: 'type', type: 'PublicInputType', defaultValue: 'text' },
      { name: 'placeholder', type: 'string', defaultValue: "''" },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'required', type: 'boolean', defaultValue: 'false' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false' },
      { name: 'helpText', type: 'string', defaultValue: "''" },
      { name: 'errorText', type: 'string', defaultValue: "''" },
      { name: 'fieldId', type: 'string', description: 'Stable label and description relationship identifier.' },
    ],
    models: [{ name: 'value', type: 'string', defaultValue: "''" }],
    publicTypes: ['PublicInputType'],
    variants: [{ name: 'type', values: ['text', 'search', 'password', 'date'] }],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Input',
    storybookFiles: ['apps/qa-remote/src/stories/input.stories.ts'],
    stories: [
      'design-system-components-input--default',
      'design-system-components-input--search',
      'design-system-components-input--password',
      'design-system-components-input--date',
      'design-system-components-input--disabled',
      'design-system-components-input--required-with-help',
      'design-system-components-input--invalid-with-error',
      'design-system-components-input--long-label',
    ],
    accessibilityPattern: 'textbox',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/input.storybook.spec.ts'],
    behaviors: [
      'label and input relationship',
      'type-specific native behavior',
      'disabled suppression',
      'required, invalid, help, and error relationships',
      'long-label reflow',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/input/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    knownLimitations: ['Figma property mapping and manual screen-reader review remain pending.'],
  }),
  entry({
    id: 'ps-menu', name: 'Menu', exportName: 'PublicMenuComponent', selector: 'ps-menu',
    source: 'packages/ui-patterns/src/public-menu.component.ts',
    description: 'Governed menu action wrapper that contains PrimeNG overlay behavior.', provider: 'primeng',
    providerModules: ['primeng/menu'], publicApiStatus: 'complete', inputs: [{ name: 'label', type: 'string', defaultValue: 'Open menu' }, { name: 'icon', type: 'string', defaultValue: 'pi pi-bars' }, { name: 'actions', type: 'PublicMenuAction[]', defaultValue: '[]' }], publicTypes: ['PublicMenuAction'],
    storybookStatus: 'complete', storybookTitle: 'Design System/Components/Menu', storybookFiles: ['apps/qa-remote/src/stories/menu.stories.ts'], stories: ['Interactive', 'EmptyMenu', 'DisabledAction', 'LongLabels', 'CommandCallbacks', 'GroupedDestructiveActions', 'KeyboardInstructions'], accessibilityPattern: 'menu', testStatus: 'partial', testFiles: shellTokenEvidence,
  }),
  entry({
    id: 'ps-paginator',
    tokenBoundary: 'provider-coupled',
    findingIds: ['TOKEN-NATIVE-001'],
    name: 'Paginator',
    exportName: 'PublicPaginatorComponent',
    selector: 'ps-paginator',
    source: 'packages/ui-patterns/src/public-paginator.component.ts',
    description: 'Native pagination pattern with current-page and rows-per-page models.',
    provider: 'native',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'totalRecords', type: 'number', defaultValue: '0' },
      { name: 'rowsPerPageOptions', type: 'number[]', defaultValue: '[5, 10, 15]' },
      { name: 'itemLabel', type: 'string', defaultValue: 'items' },
      { name: 'ariaLabel', type: 'string', defaultValue: 'Pagination' },
      { name: 'rowsPerPageLabel', type: 'string', defaultValue: 'Rows per page' },
    ],
    models: [
      { name: 'currentPage', type: 'number', defaultValue: '1' },
      { name: 'rowsPerPage', type: 'number', defaultValue: '5' },
    ],
    storybookStatus: 'complete', storybookTitle: 'Design System/Components/Paginator', storybookFiles: ['apps/qa-remote/src/stories/paginator.stories.ts'], stories: ['FirstPage', 'MiddlePage', 'LastPage', 'EmptyDataset', 'SinglePage', 'CustomLanguage', 'MobileResponsive', 'ModelInteraction'],
    accessibilityPattern: 'navigation',
  }),
  entry({
    id: 'ps-page-header',
    tokenBoundary: 'mixed',
    findingIds: ['API-NAMING-001', 'TOKEN-NATIVE-001'], name: 'Page Header', exportName: 'PublicPageHeaderComponent', selector: 'ps-page-header', selectorAliases: ['public-page-header'],
    source: 'packages/ui-patterns/src/public-page-header.component.ts',
    description: 'Composite page title and action-header pattern.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'banner', publicApiStatus: 'complete', inputs: [{ name: 'eyebrow', type: 'string', defaultValue: "''" }, { name: 'title', type: 'string', required: true }, { name: 'description', type: 'string', defaultValue: "''" }],
    storybookStatus: 'complete', storybookTitle: 'Design System/Components/Page Header', storybookFiles: ['apps/qa-remote/src/stories/page-header.stories.ts'], stories: ['Default', 'TitleOnly', 'WithoutEyebrow', 'LongResponsiveHeading', 'PrimaryAndSecondaryActions', 'WrappedMobileActions'],
  }),
  entry({
    id: 'ps-popover', name: 'Popover', exportName: 'PublicPopoverComponent', selector: 'ps-popover',
    source: 'packages/ui-patterns/src/public-popover.component.ts',
    description: 'Governed contextual-content wrapper that contains PrimeNG overlay behavior.', provider: 'primeng',
    providerModules: ['primeng/popover'], publicApiStatus: 'complete', inputs: [{ name: 'label', type: 'string', defaultValue: 'Open details' }, { name: 'icon', type: 'string', defaultValue: 'pi pi-info-circle' }], storybookStatus: 'complete', storybookTitle: 'Design System/Components/Popover', storybookFiles: ['apps/qa-remote/src/stories/popover.stories.ts'], stories: ['Interactive', 'ShortContent', 'StructuredContent', 'LongWrappingContent', 'KeyboardTrigger'], accessibilityPattern: 'dialog', testStatus: 'partial', testFiles: shellTokenEvidence,
  }),
  entry({
    id: 'ps-progress',
    tokenBoundary: 'mixed',
    findingIds: ['TOKEN-NATIVE-001'], name: 'Progress', exportName: 'PublicProgressComponent', selector: 'ps-progress',
    source: 'packages/ui-patterns/src/public-progress.component.ts',
    description: 'Native progress indicator using the shared token contract.', provider: 'native', accessibilityPattern: 'progressbar', publicApiStatus: 'complete', inputs: [{ name: 'value', type: 'number', defaultValue: '0' }, { name: 'ariaLabel', type: 'string', defaultValue: 'Progress' }], storybookStatus: 'complete', storybookTitle: 'Design System/Components/Progress', storybookFiles: ['apps/qa-remote/src/stories/progress.stories.ts'], stories: ['Interactive', 'Empty', 'Complete', 'BelowMinimumIsBounded', 'AboveMaximumIsBounded', 'LifecycleMatrix'],
  }),
  entry({
    id: 'ps-skeleton',
    tokenBoundary: 'provider-coupled',
    findingIds: ['TOKEN-NATIVE-001'], name: 'Skeleton', exportName: 'PublicSkeletonComponent', selector: 'ps-skeleton',
    source: 'packages/ui-patterns/src/public-skeleton.component.ts',
    description: 'Native token-driven loading placeholder.', provider: 'native', accessibilityPattern: 'presentation', publicApiStatus: 'complete', inputs: [{ name: 'height', type: 'string', defaultValue: '1rem' }], storybookStatus: 'complete', storybookTitle: 'Design System/Components/Skeleton', storybookFiles: ['apps/qa-remote/src/stories/skeleton.stories.ts'], stories: ['TextLine', 'Heading', 'MediaBlock', 'CompositeLoadingCard'],
  }),
  entry({
    id: 'ps-select',
    tokenBoundary: 'provider-managed',
    findingIds: ['API-PRIMITIVE-001', 'A11Y-SEL-001', 'A11Y-SEL-002', 'A11Y-SYS-001', 'A11Y-SYS-002'],
    duplicationCluster: 'unique:ps-select',
    disposition: 'retain',
    name: 'Select',
    exportName: 'PublicSelectComponent',
    selector: 'ps-select',
    source: 'packages/ui-patterns/src/public-select.component.ts',
    description: 'Opinionated PrimeNG select facade with an internal body-overlay policy.',
    provider: 'primeng',
    providerModules: ['primeng/select'],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Select' },
      { name: 'options', type: 'PublicSelectOption[]', defaultValue: '[]' },
      { name: 'placeholder', type: 'string', defaultValue: 'Choose an option' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'required', type: 'boolean', defaultValue: 'false' },
      { name: 'invalid', type: 'boolean', defaultValue: 'false' },
      { name: 'helpText', type: 'string', defaultValue: "''" },
      { name: 'errorText', type: 'string', defaultValue: "''" },
      { name: 'fieldId', type: 'string', description: 'Stable label and description relationship identifier.' },
    ],
    models: [{ name: 'value', type: 'string | null', defaultValue: 'null' }],
    publicTypes: ['PublicSelectOption'],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Select',
    storybookFiles: ['apps/qa-remote/src/stories/select.stories.ts'],
    stories: [
      'design-system-components-select--default',
      'design-system-components-select--selected',
      'design-system-components-select--disabled',
      'design-system-components-select--disabled-option',
      'design-system-components-select--required-with-help',
      'design-system-components-select--invalid-with-error',
      'design-system-components-select--empty-options',
      'design-system-components-select--long-options',
      'design-system-components-select--model-binding',
      'design-system-components-select--overlay-boundary',
    ],
    accessibilityPattern: 'combobox',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    testStatus: 'complete',
    testFiles: [
      'apps/qa-remote/e2e/select.storybook.spec.ts',
      ...shellTokenEvidence,
    ],
    behaviors: [
      'accessible combobox and listbox relationship',
      'keyboard opening and option navigation',
      'provider-neutral model selection',
      'Escape and focus return',
      'disabled field and option suppression',
      'required, invalid, help, and error relationships',
      'body-appended overlay clipping escape',
      'light and dark overlay token inheritance',
      'mobile long-option reflow',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/select/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/overlay-dom-validation.md',
    ],
    knownLimitations: [
      'Richer option content, Figma alignment, and manual assistive-technology review remain pending.',
      'The wrapper synchronizes aria-disabled from PrimeNG provider state because the rendered option omits it.',
    ],
  }),
  entry({
    id: 'ps-status-card',
    tokenBoundary: 'mixed',
    findingIds: ['API-NAMING-001', 'TOKEN-NATIVE-001'], name: 'Status Card', exportName: 'PublicStatusCardComponent', selector: 'ps-status-card', selectorAliases: ['public-status-card'],
    source: 'packages/ui-patterns/src/public-status-card.component.ts',
    description: 'Composite metric and status summary pattern.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'region', publicApiStatus: 'complete', inputs: [{ name: 'label', type: 'string', required: true }, { name: 'value', type: 'string | number', required: true }, { name: 'detail', type: 'string', defaultValue: "''" }, { name: 'status', type: 'string', defaultValue: "''" }, { name: 'tone', type: 'PublicStatusCardTone', defaultValue: 'info' }], publicTypes: ['PublicStatusCardTone'], variants: [{ name: 'tone', values: ['neutral', 'info', 'success', 'warning', 'error', 'contrast'] }], storybookStatus: 'complete', storybookTitle: 'Design System/Components/Status Card', storybookFiles: ['apps/qa-remote/src/stories/status-card.stories.ts'], stories: ['Default', 'WithoutStatus', 'Warning', 'Critical', 'LongContent', 'OperationalDashboard'],
  }),
  entry({
    id: 'ps-table',
    tokenBoundary: 'provider-coupled',
    findingIds: [],
    duplicationCluster: 'unique:ps-table',
    disposition: 'canonical',
    name: 'Table',
    exportName: 'PublicTableComponent',
    selector: 'ps-table',
    source: 'packages/ui-patterns/src/public-table.component.ts',
    description: 'Native sortable data table shell with a keyboard-scrollable overflow region, projected row content, and a built-in empty state.',
    provider: 'native',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'columns', type: 'PublicTableColumn[]', defaultValue: '[]' },
      { name: 'ariaLabel', type: 'string', defaultValue: "'Data table'" },
      { name: 'caption', type: 'string', defaultValue: "''" },
      { name: 'empty', type: 'boolean', defaultValue: 'false' },
      { name: 'emptyMessage', type: 'string', defaultValue: "'No results found.'" },
    ],
    models: [
      { name: 'sortKey', type: 'string | null', defaultValue: 'null' },
      { name: 'sortDirection', type: 'PublicTableSortDirection', defaultValue: 'asc' },
    ],
    publicTypes: ['PublicTableColumn', 'PublicTableSortDirection'],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Table',
    storybookFiles: ['apps/qa-remote/src/stories/table.stories.ts'],
    stories: [
      'design-system-components-table--default',
      'design-system-components-table--sortable',
      'design-system-components-table--with-row-actions',
      'design-system-components-table--empty',
      'design-system-components-table--long-content',
      'design-system-components-table--mobile-overflow',
    ],
    accessibilityPattern: 'table',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/table.storybook.spec.ts'],
    behaviors: [
      'sortable column header toggling',
      'keyboard-focusable overflow region',
      'projected row content',
      'built-in empty state',
      'mobile horizontal overflow',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/table/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    knownLimitations: [
      'Row content, row actions, and cell formatting remain fully consumer-authored via content projection.',
      'Figma property mapping and manual screen-reader review remain pending.',
    ],
  }),
  entry({
    id: 'ps-tag',
    tokenBoundary: 'provider-managed',
    findingIds: ['API-PARTIAL-001'], name: 'Tag', exportName: 'PublicTagComponent', selector: 'ps-tag',
    source: 'packages/ui-patterns/src/public-tag.component.ts',
    description: 'PrimeNG-backed status label wrapper.', provider: 'primeng',
    storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Button and Tag',
    storybookFiles: buttonStories, accessibilityPattern: 'status',
  }),
  entry({
    id: 'ps-tooltip',
    tokenBoundary: 'mixed', name: 'Tooltip', exportName: 'PublicTooltipComponent', selector: 'ps-tooltip',
    source: 'packages/ui-patterns/src/public-tooltip.component.ts',
    description: 'Governed help-text wrapper that contains PrimeNG tooltip behavior.', provider: 'primeng',
    providerModules: ['primeng/tooltip'], publicApiStatus: 'complete', inputs: [{ name: 'label', type: 'string', defaultValue: 'More information' }, { name: 'text', type: 'string', defaultValue: "''" }, { name: 'position', type: 'PublicTooltipPosition', defaultValue: 'top' }], publicTypes: ['PublicTooltipPosition'], storybookStatus: 'complete', storybookTitle: 'Design System/Components/Tooltip', storybookFiles: ['apps/qa-remote/src/stories/tooltip.stories.ts'], stories: ['HoverAndFocus', 'LongText', 'EmptyText', 'PositionMatrix', 'MobileFocus', 'DisabledControlGuidance'], accessibilityPattern: 'tooltip', testStatus: 'partial', testFiles: shellTokenEvidence,
  }),
  entry({
    id: 'ps-toast',
    tokenBoundary: 'provider-coupled',
    findingIds: ['API-PARTIAL-001', 'TOKEN-NATIVE-001'], name: 'Toast Region', exportName: 'PublicToastComponent', selector: 'ps-toast',
    source: 'packages/ui-patterns/src/public-toast.component.ts',
    description: 'Native toast presentation region backed by the public toast service.', provider: 'native',
    storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Dialog and Toast',
    storybookFiles: dialogToastStories, accessibilityPattern: 'status',
  }),
  entry({
    id: 'public-toast-service',
    tokenBoundary: 'not-applicable',
    findingIds: ['API-PARTIAL-001'], name: 'Toast Service', exportName: 'PublicToastService', selector: null,
    source: 'packages/ui-patterns/src/public-toast.service.ts',
    description: 'Public service API for creating governed toast messages.', kind: 'service', provider: 'service',
    publicApiStatus: 'partial', storybookStatus: 'not-applicable', testStatus: 'partial',
    testFiles: dialogToastStories, documentationStatus: 'partial',
  }),
] satisfies ComponentManifestEntry[];

export const componentManifest: ComponentManifest = {
  schemaVersion: 1,
  package: '@public-sector/ui-patterns',
  entries: [...componentRegistry].sort((left, right) => left.identity.id.localeCompare(right.identity.id)),
  findings: [...componentFindings].sort((left, right) => left.id.localeCompare(right.id)),
};
