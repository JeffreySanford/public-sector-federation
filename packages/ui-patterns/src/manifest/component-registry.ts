import type {
  ComponentManifest,
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
  source: string;
  description: string;
  kind?: RegistryKind;
  status?: ComponentManifestEntry['lifecycle']['status'];
  productionUse?: boolean;
  replacementFor?: string;
  replacedBy?: string;
  provider: ProviderKind;
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
}

const genericDocumentation = ['docs/design-system/components/catalog.md', 'docs/design-system/architecture/registry-consumption-spec.md'];

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
  const repositoryWarnings = [
    ...(seed.warnings ?? []),
    ...(storybookStatus === 'missing' && !isService ? ['No dedicated Storybook evidence is recorded.'] : []),
    ...(testStatus === 'missing' && !isService ? ['No dedicated automated behavior evidence is recorded.'] : []),
    ...(!seed.publicApiStatus || seed.publicApiStatus !== 'complete' ? ['Public API inventory is not yet fully extracted from source.'] : []),
  ];

  return {
    schemaVersion: 1,
    identity: {
      id: seed.id,
      name: seed.name,
      kind: seed.kind ?? 'component',
      exportName: seed.exportName,
      selector: seed.selector,
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
    ownership: {
      owner: null,
      steward: null,
    },
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
    tokens: {
      semantic: [],
      providerBridge: [],
      status: 'partial',
    },
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
    health: {
      repositoryReadiness: seed.blockers?.length ? 'blocked' : repositoryWarnings.length ? 'partial' : 'ready',
      externalDesignBinding: isService ? 'ready' : 'partial',
      blockers: seed.blockers ?? [],
      warnings: repositoryWarnings,
    },
  };
}

export const componentRegistry = [
  entry({
    id: 'ps-button',
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
      { name: 'tone', type: 'PublicButtonTone', defaultValue: 'primary' },
      { name: 'styleClass', type: 'string | undefined' },
      { name: 'outlined', type: 'boolean', defaultValue: 'false' },
      { name: 'text', type: 'boolean', defaultValue: 'false' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
      { name: 'routerLink', type: 'string | unknown[] | null', defaultValue: 'null' },
    ],
    outputs: [{ name: 'buttonClick', type: 'MouseEvent' }],
    publicTypes: ['PublicButtonTone'],
    variants: [
      { name: 'tone', values: ['primary', 'secondary', 'success', 'info', 'warn', 'warning', 'danger', 'error', 'help', 'contrast'] },
      { name: 'appearance', values: ['solid', 'outlined', 'text'] },
    ],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Acceptance/Button and Tag',
    storybookFiles: ['apps/qa-remote/src/stories/button-tag.acceptance.stories.ts'],
    testStatus: 'partial',
    accessibilityPattern: 'button',
    warnings: ['The current stable API still exposes styleClass and separate outlined/text booleans.'],
  }),
  entry({
    id: 'ps-up-button',
    name: 'UP Button Candidate',
    exportName: 'PublicUpButtonComponent',
    selector: 'ps-up-button',
    source: 'packages/ui-patterns/src/public-up-button.component.ts',
    description: 'Candidate UP Design System button with a curated appearance API and token-driven behavior.',
    status: 'candidate',
    productionUse: false,
    replacementFor: 'ps-button',
    provider: 'native',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Button' },
      { name: 'icon', type: 'PublicUpButtonIcon | undefined' },
      { name: 'tone', type: 'PublicUpButtonTone', defaultValue: 'primary' },
      { name: 'appearance', type: 'PublicUpButtonAppearance', defaultValue: 'solid' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
    ],
    outputs: [{ name: 'buttonClick', type: 'MouseEvent' }],
    publicTypes: ['PublicUpButtonTone', 'PublicUpButtonAppearance', 'PublicUpButtonIcon'],
    variants: [
      { name: 'tone', values: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'help', 'contrast'] },
      { name: 'appearance', values: ['solid', 'outlined', 'text'] },
    ],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Candidates/Button UP',
    storybookFiles: ['apps/qa-remote/src/stories/up-button.stories.ts'],
    stories: ['Primary', 'ToneMatrix', 'AppearanceMatrix', 'InteractionStateReference', 'LightDarkModeMatrix', 'CurrentVsCandidate'],
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts'],
    behaviors: ['pointer activation', 'keyboard activation', 'disabled suppression', 'loading state', 'visible focus', 'light and dark mode'],
    documentationStatus: 'complete',
    documentationFiles: [
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
    promotionRequirements: ['Approve the public API.', 'Validate the Figma property mapping.', 'Complete manual accessibility review.', 'Record the final promotion decision.'],
    blockers: ['Design review is pending.', 'Manual screen-reader audit is pending.'],
  }),
  entry({ id: 'ps-card', name: 'Card', exportName: 'PublicCardComponent', selector: 'ps-card', source: 'packages/ui-patterns/src/public-card.component.ts', description: 'Token-driven content surface with optional heading content.', provider: 'native', storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Card', storybookFiles: ['apps/qa-remote/src/stories/card.acceptance.stories.ts'], accessibilityPattern: 'region' }),
  entry({ id: 'ps-dialog', name: 'Dialog', exportName: 'PublicDialogComponent', selector: 'ps-dialog', source: 'packages/ui-patterns/src/public-dialog.component.ts', description: 'Modal content pattern with a controlled header, body, footer, and visibility model.', provider: 'native', storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Dialog and Toast', storybookFiles: ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'], accessibilityPattern: 'dialog' }),
  entry({ id: 'ps-empty-state', name: 'Empty State', exportName: 'PublicEmptyStateComponent', selector: 'public-empty-state', source: 'packages/ui-patterns/src/public-empty-state.component.ts', description: 'Composite empty-state pattern using shared tokens and the public button wrapper.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'status' }),
  entry({ id: 'ps-form-section', name: 'Form Section', exportName: 'PublicFormSectionComponent', selector: 'public-form-section', source: 'packages/ui-patterns/src/public-form-section.component.ts', description: 'Composite form grouping surface with title, description, and projected controls.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'group' }),
  entry({ id: 'ps-menu', name: 'Menu', exportName: 'PublicMenuComponent', selector: 'ps-menu', source: 'packages/ui-patterns/src/public-menu.component.ts', description: 'Governed menu action wrapper that contains PrimeNG overlay behavior.', provider: 'primeng', accessibilityPattern: 'menu', testStatus: 'partial', testFiles: ['apps/shell/e2e/token-consumption.spec.ts'] }),
  entry({
    id: 'ps-paginator',
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
    accessibilityPattern: 'navigation',
  }),
  entry({ id: 'ps-page-header', name: 'Page Header', exportName: 'PublicPageHeaderComponent', selector: 'public-page-header', source: 'packages/ui-patterns/src/public-page-header.component.ts', description: 'Composite page title and action-header pattern.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'banner' }),
  entry({ id: 'ps-popover', name: 'Popover', exportName: 'PublicPopoverComponent', selector: 'ps-popover', source: 'packages/ui-patterns/src/public-popover.component.ts', description: 'Governed contextual-content wrapper that contains PrimeNG overlay behavior.', provider: 'primeng', accessibilityPattern: 'dialog', testStatus: 'partial', testFiles: ['apps/shell/e2e/token-consumption.spec.ts'] }),
  entry({ id: 'ps-progress', name: 'Progress', exportName: 'PublicProgressComponent', selector: 'ps-progress', source: 'packages/ui-patterns/src/public-progress.component.ts', description: 'Shared progress indicator wrapper.', provider: 'primeng', accessibilityPattern: 'progressbar' }),
  entry({ id: 'ps-skeleton', name: 'Skeleton', exportName: 'PublicSkeletonComponent', selector: 'ps-skeleton', source: 'packages/ui-patterns/src/public-skeleton.component.ts', description: 'Shared loading-placeholder wrapper.', provider: 'primeng', accessibilityPattern: 'presentation' }),
  entry({
    id: 'ps-select',
    name: 'Select',
    exportName: 'PublicSelectComponent',
    selector: 'ps-select',
    source: 'packages/ui-patterns/src/public-select.component.ts',
    description: 'Opinionated PrimeNG select facade with an internal body-overlay policy.',
    provider: 'primeng',
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Select' },
      { name: 'options', type: 'PublicSelectOption[]', defaultValue: '[]' },
      { name: 'placeholder', type: 'string', defaultValue: 'Choose an option' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
    ],
    models: [{ name: 'value', type: 'string | null', defaultValue: 'null' }],
    publicTypes: ['PublicSelectOption'],
    accessibilityPattern: 'combobox',
    testStatus: 'partial',
    testFiles: ['apps/shell/e2e/token-consumption.spec.ts'],
  }),
  entry({ id: 'ps-status-card', name: 'Status Card', exportName: 'PublicStatusCardComponent', selector: 'public-status-card', source: 'packages/ui-patterns/src/public-status-card.component.ts', description: 'Composite metric and status summary pattern.', kind: 'pattern', provider: 'composite', accessibilityPattern: 'region' }),
  entry({ id: 'ps-tag', name: 'Tag', exportName: 'PublicTagComponent', selector: 'ps-tag', source: 'packages/ui-patterns/src/public-tag.component.ts', description: 'PrimeNG-backed status label wrapper.', provider: 'primeng', storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Button and Tag', storybookFiles: ['apps/qa-remote/src/stories/button-tag.acceptance.stories.ts'], accessibilityPattern: 'status' }),
  entry({ id: 'ps-tooltip', name: 'Tooltip', exportName: 'PublicTooltipComponent', selector: 'ps-tooltip', source: 'packages/ui-patterns/src/public-tooltip.component.ts', description: 'Governed help-text wrapper that contains PrimeNG tooltip behavior.', provider: 'primeng', accessibilityPattern: 'tooltip', testStatus: 'partial', testFiles: ['apps/shell/e2e/token-consumption.spec.ts'] }),
  entry({ id: 'ps-toast', name: 'Toast Region', exportName: 'PublicToastComponent', selector: 'ps-toast', source: 'packages/ui-patterns/src/public-toast.component.ts', description: 'PrimeNG-backed toast presentation region.', provider: 'primeng', storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Dialog and Toast', storybookFiles: ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'], accessibilityPattern: 'status' }),
  entry({ id: 'public-toast-service', name: 'Toast Service', exportName: 'PublicToastService', selector: null, source: 'packages/ui-patterns/src/public-toast.service.ts', description: 'Public service API for creating governed toast messages.', kind: 'service', provider: 'service', publicApiStatus: 'partial', storybookStatus: 'not-applicable', testStatus: 'partial', testFiles: ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'], documentationStatus: 'partial' }),
] satisfies ComponentManifestEntry[];

export const componentManifest: ComponentManifest = {
  schemaVersion: 1,
  package: '@public-sector/ui-patterns',
  entries: [...componentRegistry].sort((left, right) => left.identity.id.localeCompare(right.identity.id)),
};
