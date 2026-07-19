import type { ComponentFinding } from './component-meta.types';

const flagshipComponents = ['ps-button', 'ps-select', 'ps-dialog'];

export const componentFindings: ComponentFinding[] = [
  {
    id: 'API-BTN-001',
    category: 'api',
    severity: 'moderate',
    status: 'open',
    componentIds: ['ps-button', 'ps-up-button'],
    summary:
      'The stable Button retains compatibility inputs, a style escape hatch, navigation behavior, PrimeIcons strings, and a DOM-event output while the candidate demonstrates the preferred provider-neutral contract.',
    evidence: [
      'packages/ui-patterns/src/public-button.component.ts',
      'packages/ui-patterns/src/public-up-button.component.ts',
      'docs/documentation-upgrade/18-component-estate-audit.md',
      'docs/documentation-upgrade/20-component-consolidation-proposal.md',
    ],
  },
  {
    id: 'API-NAMING-001',
    category: 'api',
    severity: 'advisory',
    status: 'open',
    componentIds: ['ps-empty-state', 'ps-form-section', 'ps-page-header', 'ps-status-card'],
    summary:
      'The public package mixes ps-* and public-* selector prefixes and requires a staged compatibility decision.',
    evidence: [
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
    status: 'open',
    componentIds: ['ps-dialog'],
    summary: 'Background content is not made inert while the modal is open.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-DLG-002',
    category: 'accessibility',
    severity: 'moderate',
    status: 'open',
    componentIds: ['ps-dialog'],
    summary: 'Explicit body scroll locking is not implemented.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-DLG-003',
    category: 'accessibility',
    severity: 'moderate',
    status: 'open',
    componentIds: ['ps-dialog'],
    summary: 'The public Dialog API has no accessible-description relationship.',
    evidence: [
      'packages/ui-patterns/src/public-dialog.component.ts',
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
    status: 'investigate',
    componentIds: ['ps-select'],
    summary: 'Disabled-option ARIA behavior lacks dedicated evidence.',
    evidence: [
      'apps/qa-remote/src/stories/select.stories.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-SEL-002',
    category: 'accessibility',
    severity: 'serious',
    status: 'open',
    componentIds: ['ps-select'],
    summary:
      'Required, invalid, error-message, and help-text relationships are absent from the public Select contract.',
    evidence: [
      'packages/ui-patterns/src/public-select.component.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-BTN-001',
    category: 'accessibility',
    severity: 'moderate',
    status: 'open',
    componentIds: ['ps-button'],
    summary: 'Stable Button keyboard evidence is missing from the manifest.',
    evidence: [
      'packages/ui-patterns/src/manifest/component-registry.ts',
      'docs/documentation-upgrade/19-accessibility-findings-and-remediation.md',
    ],
  },
  {
    id: 'A11Y-BTN-002',
    category: 'accessibility',
    severity: 'serious',
    status: 'investigate',
    componentIds: ['ps-button'],
    summary:
      'Loading announcement and repeated-activation suppression require dedicated stable Button verification.',
    evidence: [
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
    status: 'open',
    componentIds: flagshipComponents,
    summary: 'Windows forced-colors evidence is not recorded for the flagship components.',
    evidence: ['docs/documentation-upgrade/19-accessibility-findings-and-remediation.md'],
  },
];
