import { Component, computed, signal } from '@angular/core';
import {
  componentManifest,
  type ComponentManifestEntry,
  type PublicApiMember,
} from '@public-sector/ui-patterns';

interface AlignmentMappingRow {
  figmaProperty: string;
  publicApiProperty: string;
  status: 'recorded' | 'proposed';
}

interface ContractMemberRow extends PublicApiMember {
  direction: 'input' | 'output' | 'model';
}

@Component({
  selector: 'public-design-alignment-lab',
  standalone: true,
  template: `
    <section class="alignment-view" aria-labelledby="designAlignmentTitle">
      <header class="workbench-hero">
        <div>
          <p class="workbench-eyebrow">Code-to-design reconstruction</p>
          <h1 id="designAlignmentTitle">Design Alignment Lab</h1>
          <p>
            Compare the shipped Angular contract, isolated Storybook evidence, and the
            currently recorded Figma binding before deciding which side should change.
          </p>
        </div>
        <div class="workbench-scope" aria-label="Alignment scope">
          <span>Cases: Button, Select, Dialog</span>
          <span>Decision-first, not screenshot-first</span>
        </div>
      </header>

      <section class="case-selector" aria-label="Alignment case selector">
        <label>
          <span>Component case</span>
          <select [value]="selectedId()" (change)="selectCase($event)">
            @for (entry of caseEntries(); track entry.identity.id) {
              <option [value]="entry.identity.id">{{ entry.identity.name }}</option>
            }
          </select>
        </label>
        @if (selectedEntry(); as entry) {
          <div class="case-status">
            <span class="status-pill">Code: {{ entry.lifecycle.status }}</span>
            <span class="status-pill">Figma: {{ entry.figma.status }}</span>
            <span class="status-pill" [attr.data-alignment]="alignmentStatus(entry)">
              Alignment: {{ alignmentStatus(entry) }}
            </span>
          </div>
        }
      </section>

      @if (selectedEntry(); as entry) {
        <section class="alignment-summary" aria-labelledby="alignmentCaseTitle">
          <div>
            <p class="workbench-eyebrow">Selected case</p>
            <h2 id="alignmentCaseTitle">{{ entry.identity.name }}</h2>
            <p>{{ entry.identity.description }}</p>
          </div>
          <dl>
            <div><dt>Selector</dt><dd><code>{{ entry.identity.selector || entry.identity.exportName }}</code></dd></div>
            <div><dt>Provider</dt><dd>{{ entry.implementation.providerName }}</dd></div>
            <div><dt>Repository readiness</dt><dd>{{ entry.health.repositoryReadiness }}</dd></div>
            <div><dt>Design review</dt><dd>{{ entry.governance.designReview }}</dd></div>
          </dl>
        </section>

        <section class="comparison-grid" aria-label="Code and design comparison">
          <article>
            <div class="panel-heading">
              <div>
                <p class="workbench-eyebrow">Shipped code</p>
                <h2>Angular contract</h2>
              </div>
              <span class="status-pill">{{ entry.publicApi.status }}</span>
            </div>
            <code class="source-path">{{ entry.identity.source }}</code>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Direction</th>
                    <th scope="col">Member</th>
                    <th scope="col">Type</th>
                    <th scope="col">Default</th>
                  </tr>
                </thead>
                <tbody>
                  @for (member of contractMembers(); track member.direction + member.name) {
                    <tr>
                      <td>{{ member.direction }}</td>
                      <th scope="row"><code>{{ member.name }}</code></th>
                      <td><code>{{ member.type }}</code></td>
                      <td><code>{{ member.defaultValue || '—' }}</code></td>
                    </tr>
                  } @empty {
                    <tr><td colspan="4" class="empty-cell">No public API members are recorded.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </article>

          <article>
            <div class="panel-heading">
              <div>
                <p class="workbench-eyebrow">Design intent</p>
                <h2>Figma binding</h2>
              </div>
              <span class="status-pill">{{ entry.figma.status }}</span>
            </div>
            <dl class="binding-list">
              <div><dt>Component key</dt><dd><code>{{ entry.figma.componentKey || 'Not recorded' }}</code></dd></div>
              <div><dt>Component-set key</dt><dd><code>{{ entry.figma.componentSetKey || 'Not recorded' }}</code></dd></div>
              <div><dt>Property mappings</dt><dd>{{ entry.figma.propertyMappings.length }}</dd></div>
              <div><dt>External binding health</dt><dd>{{ entry.health.externalDesignBinding }}</dd></div>
            </dl>
            <div class="design-gap">
              <h3>Current design evidence</h3>
              <p>{{ designEvidenceSummary(entry) }}</p>
            </div>
            <div class="design-gap">
              <h3>Required anatomy review</h3>
              <ul>
                @for (item of anatomyReview(entry); track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          </article>
        </section>

        <section class="mapping-panel" aria-labelledby="propertyMappingTitle">
          <div class="panel-heading">
            <div>
              <p class="workbench-eyebrow">Contract translation</p>
              <h2 id="propertyMappingTitle">Figma property ↔ Angular API mapping</h2>
            </div>
            <p>Proposed rows are inferred from the shipped code and remain unapproved until design review.</p>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Figma property</th>
                  <th scope="col">Angular public API</th>
                  <th scope="col">Mapping status</th>
                </tr>
              </thead>
              <tbody>
                @for (row of mappingRows(); track $index) {
                  <tr>
                    <th scope="row"><code>{{ row.figmaProperty }}</code></th>
                    <td><code>{{ row.publicApiProperty }}</code></td>
                    <td><span class="status-pill">{{ row.status }}</span></td>
                  </tr>
                } @empty {
                  <tr><td colspan="3" class="empty-cell">No mapping candidates can be inferred from the current contract.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section class="evidence-decision-grid">
          <article>
            <div class="panel-heading">
              <div>
                <p class="workbench-eyebrow">Isolated implementation</p>
                <h2>Storybook &amp; test evidence</h2>
              </div>
              <span class="status-pill">{{ entry.evidence.storybook.status }}</span>
            </div>
            <dl class="binding-list">
              <div><dt>Canonical title</dt><dd>{{ entry.evidence.storybook.title || 'Not recorded' }}</dd></div>
              <div><dt>Story count</dt><dd>{{ entry.evidence.storybook.stories.length }}</dd></div>
              <div><dt>Test status</dt><dd>{{ entry.evidence.tests.status }}</dd></div>
              <div><dt>Automated a11y</dt><dd>{{ entry.accessibility.automatedChecks }}</dd></div>
              <div><dt>Keyboard</dt><dd>{{ entry.accessibility.keyboardCoverage }}</dd></div>
              <div><dt>Screen reader</dt><dd>{{ entry.accessibility.screenReaderAudit }}</dd></div>
            </dl>
            <h3>Evidence paths</h3>
            <ul class="path-list">
              @for (path of evidencePaths(entry); track path) {
                <li><code>{{ path }}</code></li>
              } @empty {
                <li>No isolated evidence paths are recorded.</li>
              }
            </ul>
          </article>

          <article class="decision-card">
            <p class="workbench-eyebrow">Decision record</p>
            <h2>{{ recommendedDecision(entry) }}</h2>
            <p>{{ decisionRationale(entry) }}</p>
            <h3>Next actions</h3>
            <ol>
              @for (action of nextActions(entry); track action) {
                <li>{{ action }}</li>
              }
            </ol>
            <dl class="binding-list">
              <div><dt>Recommended owner</dt><dd>Design-system engineering + design</dd></div>
              <div><dt>Approval gate</dt><dd>{{ entry.governance.designReview }}</dd></div>
              <div><dt>Promotion tier</dt><dd>{{ entry.governance.tier }}</dd></div>
            </dl>
          </article>
        </section>

        <section class="token-panel" aria-labelledby="tokenComparisonTitle">
          <div class="panel-heading">
            <div>
              <p class="workbench-eyebrow">Token chain</p>
              <h2 id="tokenComparisonTitle">Semantic intent → provider translation</h2>
            </div>
            <span class="status-pill">{{ entry.tokens.status }}</span>
          </div>
          <div class="token-grid">
            <article>
              <h3>Semantic tokens</h3>
              <ul>
                @for (token of entry.tokens.semantic; track token) {
                  <li><code>{{ token }}</code></li>
                } @empty {
                  <li>No semantic token references are recorded in the manifest.</li>
                }
              </ul>
            </article>
            <article>
              <h3>Provider bridge</h3>
              <ul>
                @for (token of entry.tokens.providerBridge; track token) {
                  <li><code>{{ token }}</code></li>
                } @empty {
                  <li>No provider-bridge token references are recorded.</li>
                }
              </ul>
            </article>
            <article>
              <h3>Boundary findings</h3>
              <ul>
                @for (escapeHatch of entry.implementation.providerEscapeHatches; track escapeHatch) {
                  <li>Public escape hatch: <code>{{ escapeHatch }}</code></li>
                } @empty {
                  <li>No provider escape hatches are recorded.</li>
                }
              </ul>
            </article>
          </div>
        </section>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    .alignment-view { display: grid; gap: 1.25rem; color: var(--p-text-color); }
    .workbench-hero, .panel-heading, .alignment-summary { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .workbench-hero { padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--p-content-border-color); border-radius: 1rem; background: linear-gradient(135deg, color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background)), var(--p-content-background)); }
    .workbench-hero h1, h2, h3, p { margin-top: 0; }
    .workbench-hero h1 { margin-bottom: 0.55rem; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.04em; }
    .workbench-hero p { max-width: 62rem; margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.65; }
    .workbench-eyebrow { margin-bottom: 0.4rem; color: var(--p-primary-color); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
    .workbench-scope { display: grid; gap: 0.35rem; min-width: 15rem; color: var(--p-text-muted-color); font-size: 0.82rem; text-align: right; }
    .case-selector, .alignment-summary, .comparison-grid article, .mapping-panel, .evidence-decision-grid article, .token-panel { border: 1px solid var(--p-content-border-color); border-radius: 0.9rem; background: var(--p-content-background); box-shadow: var(--p-card-shadow, none); }
    .case-selector { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding: 1rem; }
    label { display: grid; gap: 0.35rem; min-width: min(100%, 22rem); color: var(--p-text-muted-color); font-size: 0.78rem; font-weight: 800; }
    select { min-height: 2.7rem; width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--p-content-border-color); border-radius: 0.55rem; background: var(--p-content-background); color: var(--p-text-color); font: inherit; }
    select:focus-visible { outline: 0.2rem solid color-mix(in srgb, var(--p-primary-color) 55%, transparent); outline-offset: 0.15rem; }
    .case-status { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.45rem; }
    .status-pill { display: inline-flex; padding: 0.2rem 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 999px; background: color-mix(in srgb, var(--p-content-background) 82%, var(--p-primary-color)); font-size: 0.72rem; font-weight: 850; text-transform: capitalize; }
    .status-pill[data-alignment='blocked'] { border-color: var(--p-red-500, var(--p-primary-color)); }
    .status-pill[data-alignment='review'] { border-color: var(--p-orange-500, var(--p-primary-color)); }
    .status-pill[data-alignment='aligned'] { border-color: var(--p-green-500, var(--p-primary-color)); }
    .alignment-summary { padding: 1rem; }
    .alignment-summary > div > p:last-child { max-width: 50rem; margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.55; }
    dl { display: grid; gap: 0.4rem; margin: 0; }
    dl div { display: grid; grid-template-columns: minmax(8rem, auto) 1fr; gap: 0.75rem; }
    dt { color: var(--p-text-muted-color); font-weight: 800; }
    dd { margin: 0; }
    .comparison-grid, .evidence-decision-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .comparison-grid article, .mapping-panel, .evidence-decision-grid article, .token-panel { min-width: 0; padding: 1rem; }
    .panel-heading p { max-width: 34rem; margin-bottom: 0; color: var(--p-text-muted-color); text-align: right; }
    code { overflow-wrap: anywhere; color: var(--p-text-color); font-size: 0.76rem; }
    .source-path { display: block; margin-bottom: 0.8rem; padding: 0.65rem; border-radius: 0.45rem; background: var(--p-surface-ground, color-mix(in srgb, var(--p-content-background) 88%, var(--p-text-color))); }
    .table-scroll { overflow-x: auto; border: 1px solid var(--p-content-border-color); border-radius: 0.7rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.7rem; border-bottom: 1px solid var(--p-content-border-color); text-align: left; vertical-align: top; }
    thead th { background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color)); color: var(--p-text-muted-color); font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    .empty-cell { padding: 2rem; color: var(--p-text-muted-color); text-align: center; }
    .binding-list { margin: 0.8rem 0; }
    .design-gap { padding-top: 0.8rem; border-top: 1px solid var(--p-content-border-color); }
    .design-gap p, .design-gap ul, .path-list, .decision-card p, .decision-card ol { margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.55; }
    .design-gap ul, .path-list, .decision-card ol { padding-left: 1.2rem; }
    .path-list li + li, .decision-card li + li { margin-top: 0.35rem; }
    .decision-card { background: linear-gradient(145deg, color-mix(in srgb, var(--p-primary-color) 9%, var(--p-content-background)), var(--p-content-background)) !important; }
    .decision-card h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
    .decision-card h3 { margin-top: 1rem; }
    .token-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; margin-top: 0.9rem; }
    .token-grid article { padding: 0.85rem; border: 1px solid var(--p-content-border-color); border-radius: 0.65rem; background: color-mix(in srgb, var(--p-content-background) 96%, var(--p-primary-color)); }
    .token-grid ul { margin-bottom: 0; padding-left: 1.2rem; color: var(--p-text-muted-color); line-height: 1.5; }
    @media (max-width: 64rem) { .comparison-grid, .evidence-decision-grid, .token-grid { grid-template-columns: 1fr; } }
    @media (max-width: 48rem) { .workbench-hero, .panel-heading, .alignment-summary, .case-selector { display: grid; } .workbench-scope, .panel-heading p { min-width: 0; text-align: left; } .case-status { justify-content: flex-start; } }
  `,
})
export class DesignAlignmentLabComponent {
  readonly entries = componentManifest.entries;
  readonly selectedId = signal('ps-button');
  readonly caseEntries = computed(() => ['ps-button', 'ps-select', 'ps-dialog']
    .map((id) => this.entries.find((entry) => entry.identity.id === id))
    .filter((entry): entry is ComponentManifestEntry => Boolean(entry)));
  readonly selectedEntry = computed(() => this.caseEntries().find((entry) => entry.identity.id === this.selectedId()) ?? this.caseEntries()[0]);
  readonly contractMembers = computed<ContractMemberRow[]>(() => {
    const entry = this.selectedEntry();
    if (!entry) return [];
    return [
      ...entry.publicApi.inputs.map((member) => ({ ...member, direction: 'input' as const })),
      ...entry.publicApi.outputs.map((member) => ({ ...member, direction: 'output' as const })),
      ...entry.publicApi.models.map((member) => ({ ...member, direction: 'model' as const })),
    ];
  });
  readonly mappingRows = computed<AlignmentMappingRow[]>(() => {
    const entry = this.selectedEntry();
    if (!entry) return [];

    const recorded = entry.figma.propertyMappings.map((mapping) => ({ ...mapping, status: 'recorded' as const }));
    const recordedApiNames = new Set(recorded.map((mapping) => mapping.publicApiProperty));
    const proposedFromVariants = entry.variants.properties
      .filter((variant) => !recordedApiNames.has(variant.name))
      .map((variant) => ({
        figmaProperty: this.humanize(variant.name),
        publicApiProperty: variant.name,
        status: 'proposed' as const,
      }));
    const proposedFromInputs = entry.publicApi.inputs
      .filter((member) => !recordedApiNames.has(member.name) && !proposedFromVariants.some((row) => row.publicApiProperty === member.name))
      .slice(0, 6)
      .map((member) => ({
        figmaProperty: this.humanize(member.name),
        publicApiProperty: member.name,
        status: 'proposed' as const,
      }));

    return [...recorded, ...proposedFromVariants, ...proposedFromInputs];
  });

  selectCase(event: Event): void {
    this.selectedId.set((event.target as HTMLSelectElement).value);
  }

  alignmentStatus(entry: ComponentManifestEntry): 'blocked' | 'review' | 'aligned' {
    if (entry.health.blockers.length || entry.health.externalDesignBinding === 'blocked') return 'blocked';
    if (entry.figma.status !== 'linked' || entry.health.warnings.length || entry.governance.designReview !== 'approved') return 'review';
    return 'aligned';
  }

  designEvidenceSummary(entry: ComponentManifestEntry): string {
    if (entry.figma.status === 'linked') return 'A Figma binding is recorded and can be checked against the runtime contract.';
    if (entry.figma.status === 'pending-access') return 'Figma access is pending, so code remains the observable source for reconstructing current design behavior.';
    if (entry.figma.status === 'not-applicable') return 'This entry does not require a visual design binding.';
    return 'No Figma binding is recorded; design intent must be reconstructed and reviewed before alignment can be claimed.';
  }

  anatomyReview(entry: ComponentManifestEntry): string[] {
    const items = [
      `Compare rendered DOM and interaction states for the ${entry.accessibility.pattern ?? entry.identity.kind} pattern.`,
      'Verify light and dark theme behavior against semantic tokens.',
      'Confirm property names describe user intent rather than provider implementation details.',
    ];
    if (entry.implementation.providerEscapeHatches.length) items.push('Decide whether each provider escape hatch should be removed, governed, or explicitly documented.');
    return items;
  }

  evidencePaths(entry: ComponentManifestEntry): string[] {
    return [
      ...entry.evidence.storybook.files,
      ...entry.evidence.tests.files,
      ...entry.evidence.documentation.files,
    ];
  }

  recommendedDecision(entry: ComponentManifestEntry): string {
    if (entry.health.blockers.length) return 'Remediate code before design approval';
    if (entry.figma.status === 'pending-access' || entry.figma.status === 'not-linked') return 'Reconstruct Figma from the shipped contract';
    if (entry.implementation.providerEscapeHatches.length) return 'Review and narrow the public API';
    if (entry.governance.designReview !== 'approved') return 'Review both code and design intent';
    return 'Accept the aligned contract';
  }

  decisionRationale(entry: ComponentManifestEntry): string {
    if (entry.health.blockers.length) return entry.health.blockers[0];
    if (entry.figma.status !== 'linked' && entry.figma.status !== 'not-applicable') {
      return 'The code contract and isolated evidence exist, but the external design binding is incomplete. Alignment should not be inferred from screenshots alone.';
    }
    if (entry.implementation.providerEscapeHatches.length) {
      return `The public boundary still exposes ${entry.implementation.providerEscapeHatches.join(', ')}, which can allow consumers to bypass governed design intent.`;
    }
    return 'The recorded contract, evidence, and governance state support the current recommendation.';
  }

  nextActions(entry: ComponentManifestEntry): string[] {
    const actions: string[] = [];
    if (entry.publicApi.status !== 'complete') actions.push('Complete the source-level public API inventory.');
    if (entry.figma.status !== 'linked' && entry.figma.status !== 'not-applicable') actions.push('Create or locate the Figma component and record stable property mappings.');
    if (entry.tokens.status !== 'complete') actions.push('Record semantic-token and provider-bridge usage in the manifest.');
    if (entry.accessibility.keyboardCoverage !== 'complete') actions.push('Add keyboard behavior evidence.');
    if (entry.accessibility.screenReaderAudit !== 'passed' && entry.accessibility.screenReaderAudit !== 'not-applicable') actions.push('Complete the manual screen-reader audit.');
    if (entry.governance.designReview !== 'approved') actions.push('Record the joint design and engineering decision.');
    return actions.length ? actions : ['Preserve the contract and monitor visual and accessibility regression evidence.'];
  }

  private humanize(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^./, (character) => character.toUpperCase());
  }
}
