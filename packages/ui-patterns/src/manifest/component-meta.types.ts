export type RegistryKind = 'component' | 'pattern' | 'service';
export type LifecycleStatus = 'experimental' | 'candidate' | 'active' | 'deprecated';
export type ProviderKind = 'primeng' | 'native' | 'composite' | 'service';
export type EvidenceStatus = 'complete' | 'partial' | 'missing' | 'not-applicable';
export type ManualAuditStatus = 'passed' | 'failed' | 'pending' | 'not-started' | 'not-applicable';
export type FigmaStatus = 'linked' | 'pending-access' | 'not-linked' | 'not-applicable';
export type ZeroheightStatus = 'published' | 'draft' | 'planned' | 'not-linked' | 'not-applicable';
export type ReadinessStatus = 'ready' | 'partial' | 'blocked';

export interface PublicApiMember {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentManifestEntry {
  schemaVersion: 1;
  identity: {
    id: string;
    name: string;
    kind: RegistryKind;
    exportName: string;
    selector: string | null;
    package: '@public-sector/ui-patterns';
    source: string;
    description: string;
  };
  lifecycle: {
    status: LifecycleStatus;
    productionUse: boolean;
    replacementFor?: string;
    replacedBy?: string;
  };
  ownership: {
    owner: string | null;
    steward: string | null;
  };
  publicApi: {
    status: EvidenceStatus;
    inputs: PublicApiMember[];
    outputs: PublicApiMember[];
    models: PublicApiMember[];
    publicTypes: string[];
  };
  implementation: {
    provider: ProviderKind;
    providerName: 'PrimeNG' | 'Native' | 'Mixed' | 'None';
    providerInternalOnly: boolean;
    providerModules: string[];
    providerEscapeHatches: string[];
    knownLimitations: string[];
  };
  variants: {
    properties: Array<{ name: string; values: string[] }>;
    supportedCombinations: Array<Record<string, string>>;
  };
  tokens: {
    semantic: string[];
    providerBridge: string[];
    status: EvidenceStatus;
  };
  accessibility: {
    pattern: string | null;
    automatedChecks: EvidenceStatus;
    keyboardCoverage: EvidenceStatus;
    screenReaderAudit: ManualAuditStatus;
    knownResponsibilities: string[];
  };
  evidence: {
    storybook: {
      status: EvidenceStatus;
      title: string | null;
      files: string[];
      stories: string[];
    };
    tests: {
      status: EvidenceStatus;
      files: string[];
      behaviors: string[];
    };
    documentation: {
      status: EvidenceStatus;
      files: string[];
    };
  };
  figma: {
    status: FigmaStatus;
    componentKey: string | null;
    componentSetKey: string | null;
    propertyMappings: Array<{ figmaProperty: string; publicApiProperty: string }>;
  };
  zeroheight: {
    status: ZeroheightStatus;
    pageId: string | null;
    template: string | null;
  };
  governance: {
    tier: 'core' | 'candidate' | 'experimental' | 'team-stewarded';
    designReview: 'approved' | 'pending' | 'not-started';
    promotionRequirements: string[];
  };
  health: {
    repositoryReadiness: ReadinessStatus;
    externalDesignBinding: ReadinessStatus;
    blockers: string[];
    warnings: string[];
  };
}

export interface ComponentManifest {
  schemaVersion: 1;
  package: '@public-sector/ui-patterns';
  entries: ComponentManifestEntry[];
}
