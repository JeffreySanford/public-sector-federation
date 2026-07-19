import { Component, computed, signal } from '@angular/core';
import {
  componentManifest,
  type ComponentManifestEntry,
  type LifecycleStatus,
  type ProviderKind,
} from '@public-sector/ui-patterns';

type LifecycleFilter = 'all' | LifecycleStatus;
type ProviderFilter = 'all' | ProviderKind;

@Component({
  selector: 'public-component-inventory-view',
  standalone: true,
  template: `
    <section class="inventory-view" aria-labelledby="componentInventoryTitle">
      <header class="workbench-hero">
        <div>
          <p class="workbench-eyebrow">Forensic component discovery</p>
          <h1 id="componentInventoryTitle">Component Inventory</h1>
          <p>
            Inspect what is actually shipped, where provider boundaries leak, and which
            components are missing the evidence required for design-system governance.
          </p>
        </div>
        <div class="workbench-scope" aria-label="Inventory scope">
          <span>Source: component manifest</span>
          <span>Theme scope: light + dark</span>
        </div>
      </header>

      <section class="summary-grid" aria-label="Inventory summary">
        <article>
          <strong>{{ entries.length }}</strong>
          <span>Registry entries</span>
        </article>
        <article>
          <strong>{{ activeCount() }}</strong>
          <span>Active components</span>
        </article>
        <article>
          <strong>{{ candidateCount() }}</strong>
          <span>Promotion candidates</span>
        </article>
        <article>
          <strong>{{ blockedCount() }}</strong>
          <span>Blocked entries</span>
        </article>
        <article>
          <strong>{{ entriesWithEvidenceGaps() }}</strong>
          <span>Evidence gaps</span>
        </article>
      </section>

      <section class="inventory-controls" aria-label="Inventory filters">
        <label>
          <span>Search shipped components</span>
          <input
            type="search"
            [value]="query()"
            (input)="setQuery($event)"
            placeholder="Name, selector, source, or provider"
          />
        </label>
        <label>
          <span>Lifecycle</span>
          <select [value]="lifecycleFilter()" (change)="setLifecycleFilter($event)">
            <option value="all">All lifecycle states</option>
            <option value="experimental">Experimental</option>
            <option value="candidate">Candidate</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </label>
        <label>
          <span>Provider</span>
          <select [value]="providerFilter()" (change)="setProviderFilter($event)">
            <option value="all">All providers</option>
            <option value="native">Native</option>
            <option value="primeng">PrimeNG</option>
            <option value="composite">Composite</option>
            <option value="service">Service</option>
          </select>
        </label>
      </section>

      <div class="inventory-layout">
        <section class="inventory-table-panel" aria-labelledby="inventoryResultsTitle">
          <div class="panel-heading">
            <div>
              <p class="workbench-eyebrow">Runtime catalog</p>
              <h2 id="inventoryResultsTitle">{{ filteredEntries().length }} matching entries</h2>
            </div>
            <p>Select a row to inspect the contract and evidence.</p>
          </div>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Lifecycle</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Repository</th>
                  <th scope="col">Evidence gaps</th>
                  <th scope="col"><span class="visually-hidden">Inspect</span></th>
                </tr>
              </thead>
              <tbody>
                @for (entry of filteredEntries(); track entry.identity.id) {
                  <tr [class.is-selected]="selectedEntry()?.identity?.id === entry.identity.id">
                    <th scope="row">
                      <strong>{{ entry.identity.name }}</strong>
                      <code>{{ entry.identity.selector || entry.identity.exportName }}</code>
                    </th>
                    <td><span class="status-pill">{{ entry.lifecycle.status }}</span></td>
                    <td>{{ entry.implementation.providerName }}</td>
                    <td>{{ entry.health.repositoryReadiness }}</td>
                    <td>{{ evidenceGapCount(entry) }}</td>
                    <td>
                      <button
                        type="button"
                        class="inspect-button"
                        [attr.aria-label]="'Inspect ' + entry.identity.name"
                        [attr.aria-pressed]="selectedEntry()?.identity?.id === entry.identity.id"
                        (click)="selectEntry(entry.identity.id)"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="empty-cell">No manifest entries match these filters.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        @if (selectedEntry(); as entry) {
          <aside class="detail-panel" aria-labelledby="inventoryDetailTitle">
            <div class="detail-panel__heading">
              <div>
                <p class="workbench-eyebrow">Shipped contract</p>
                <h2 id="inventoryDetailTitle">{{ entry.identity.name }}</h2>
              </div>
              <span class="status-pill">{{ entry.lifecycle.status }}</span>
            </div>

            <p>{{ entry.identity.description }}</p>
            <code class="source-path">{{ entry.identity.source }}</code>

            <dl class="detail-list">
              <div><dt>Selector</dt><dd><code>{{ entry.identity.selector || 'Service API' }}</code></dd></div>
              <div><dt>Export</dt><dd><code>{{ entry.identity.exportName }}</code></dd></div>
              <div><dt>Provider boundary</dt><dd>{{ entry.implementation.providerInternalOnly ? 'Internal' : 'Exposed' }}</dd></div>
              <div><dt>Public API inventory</dt><dd>{{ entry.publicApi.status }}</dd></div>
              <div><dt>Design review</dt><dd>{{ entry.governance.designReview }}</dd></div>
              <div><dt>Figma binding</dt><dd>{{ entry.figma.status }}</dd></div>
            </dl>

            <section>
              <h3>Evidence coverage</h3>
              <div class="evidence-grid">
                <span><strong>Storybook</strong>{{ entry.evidence.storybook.status }}</span>
                <span><strong>Tests</strong>{{ entry.evidence.tests.status }}</span>
                <span><strong>Documentation</strong>{{ entry.evidence.documentation.status }}</span>
                <span><strong>Automated a11y</strong>{{ entry.accessibility.automatedChecks }}</span>
                <span><strong>Keyboard</strong>{{ entry.accessibility.keyboardCoverage }}</span>
                <span><strong>Screen reader</strong>{{ entry.accessibility.screenReaderAudit }}</span>
              </div>
            </section>

            <section>
              <h3>Provider and API findings</h3>
              <ul>
                @for (escapeHatch of entry.implementation.providerEscapeHatches; track escapeHatch) {
                  <li>Provider escape hatch: <code>{{ escapeHatch }}</code></li>
                }
                @for (limitation of entry.implementation.knownLimitations; track limitation) {
                  <li>{{ limitation }}</li>
                }
                @empty {
                  <li>No provider escape hatches or implementation limitations recorded.</li>
                }
              </ul>
            </section>

            <section>
              <h3>Health findings</h3>
              <ul>
                @for (blocker of entry.health.blockers; track blocker) {
                  <li class="finding finding--blocked">{{ blocker }}</li>
                }
                @for (warning of entry.health.warnings; track warning) {
                  <li class="finding">{{ warning }}</li>
                }
                @empty {
                  <li>No blockers or warnings recorded.</li>
                }
              </ul>
            </section>
          </aside>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .inventory-view { display: grid; gap: 1.25rem; color: var(--p-text-color); }
    .workbench-hero, .panel-heading, .detail-panel__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .workbench-hero { padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--p-content-border-color); border-radius: 1rem; background: linear-gradient(135deg, color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background)), var(--p-content-background)); }
    .workbench-hero h1, .panel-heading h2, .detail-panel h2, .detail-panel h3, p { margin-top: 0; }
    .workbench-hero h1 { margin-bottom: 0.55rem; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.04em; }
    .workbench-hero p { max-width: 62rem; margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.65; }
    .workbench-eyebrow { margin-bottom: 0.4rem; color: var(--p-primary-color); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
    .workbench-scope { display: grid; gap: 0.35rem; min-width: 14rem; color: var(--p-text-muted-color); font-size: 0.82rem; text-align: right; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr)); gap: 0.75rem; }
    .summary-grid article, .inventory-table-panel, .detail-panel { border: 1px solid var(--p-content-border-color); border-radius: 0.9rem; background: var(--p-content-background); box-shadow: var(--p-card-shadow, none); }
    .summary-grid article { padding: 1rem; }
    .summary-grid strong { display: block; font-size: 1.8rem; }
    .summary-grid span { color: var(--p-text-muted-color); }
    .inventory-controls { display: grid; grid-template-columns: minmax(16rem, 2fr) repeat(2, minmax(10rem, 1fr)); gap: 0.8rem; padding: 1rem; border: 1px solid var(--p-content-border-color); border-radius: 0.9rem; background: var(--p-content-background); }
    label { display: grid; gap: 0.35rem; color: var(--p-text-muted-color); font-size: 0.78rem; font-weight: 800; }
    input, select { min-height: 2.7rem; width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--p-content-border-color); border-radius: 0.55rem; background: var(--p-content-background); color: var(--p-text-color); font: inherit; }
    input:focus-visible, select:focus-visible, button:focus-visible { outline: 0.2rem solid color-mix(in srgb, var(--p-primary-color) 55%, transparent); outline-offset: 0.15rem; }
    .inventory-layout { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(19rem, 0.8fr); gap: 1rem; align-items: start; }
    .inventory-table-panel, .detail-panel { min-width: 0; padding: 1rem; }
    .panel-heading p { max-width: 26rem; margin-bottom: 0; color: var(--p-text-muted-color); text-align: right; }
    .table-scroll { overflow-x: auto; margin-top: 1rem; border: 1px solid var(--p-content-border-color); border-radius: 0.7rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid var(--p-content-border-color); text-align: left; vertical-align: top; }
    thead th { background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color)); color: var(--p-text-muted-color); font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    tbody tr.is-selected { background: color-mix(in srgb, var(--p-primary-color) 8%, var(--p-content-background)); }
    tbody th strong, tbody th code { display: block; }
    code { overflow-wrap: anywhere; color: var(--p-text-color); font-size: 0.78rem; }
    .status-pill { display: inline-flex; padding: 0.2rem 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 999px; background: color-mix(in srgb, var(--p-content-background) 82%, var(--p-primary-color)); font-size: 0.72rem; font-weight: 850; text-transform: capitalize; }
    .inspect-button { min-height: 2.25rem; padding: 0.35rem 0.7rem; border: 1px solid var(--p-primary-color); border-radius: 0.45rem; background: transparent; color: var(--p-primary-color); font: inherit; font-weight: 800; cursor: pointer; }
    .inspect-button:hover { background: color-mix(in srgb, var(--p-primary-color) 10%, transparent); }
    .empty-cell { padding: 2rem; color: var(--p-text-muted-color); text-align: center; }
    .detail-panel { position: sticky; top: 6.25rem; display: grid; gap: 1rem; }
    .detail-panel > p { margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.55; }
    .source-path { display: block; padding: 0.65rem; border-radius: 0.45rem; background: var(--p-surface-ground, color-mix(in srgb, var(--p-content-background) 88%, var(--p-text-color))); }
    .detail-list { display: grid; gap: 0.45rem; margin: 0; }
    .detail-list div { display: grid; grid-template-columns: minmax(7.5rem, auto) 1fr; gap: 0.75rem; }
    dt { color: var(--p-text-muted-color); font-weight: 800; }
    dd { margin: 0; }
    .detail-panel section { padding-top: 0.9rem; border-top: 1px solid var(--p-content-border-color); }
    .detail-panel h3 { margin-bottom: 0.65rem; font-size: 1rem; }
    .detail-panel ul { margin: 0; padding-left: 1.2rem; }
    .detail-panel li + li { margin-top: 0.4rem; }
    .evidence-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; }
    .evidence-grid span { display: grid; gap: 0.15rem; padding: 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 0.45rem; color: var(--p-text-muted-color); font-size: 0.78rem; }
    .evidence-grid strong { color: var(--p-text-color); }
    .finding--blocked { font-weight: 800; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    @media (max-width: 70rem) { .inventory-layout { grid-template-columns: 1fr; } .detail-panel { position: static; } }
    @media (max-width: 48rem) { .workbench-hero, .panel-heading, .detail-panel__heading { display: grid; } .workbench-scope, .panel-heading p { min-width: 0; text-align: left; } .inventory-controls { grid-template-columns: 1fr; } .evidence-grid { grid-template-columns: 1fr; } }
  `,
})
export class ComponentInventoryViewComponent {
  readonly entries = componentManifest.entries;
  readonly query = signal('');
  readonly lifecycleFilter = signal<LifecycleFilter>('all');
  readonly providerFilter = signal<ProviderFilter>('all');
  readonly selectedId = signal(this.entries[0]?.identity.id ?? '');

  readonly activeCount = computed(() => this.entries.filter((entry) => entry.lifecycle.status === 'active').length);
  readonly candidateCount = computed(() => this.entries.filter((entry) => entry.lifecycle.status === 'candidate').length);
  readonly blockedCount = computed(() => this.entries.filter((entry) => entry.health.repositoryReadiness === 'blocked').length);
  readonly entriesWithEvidenceGaps = computed(() => this.entries.filter((entry) => this.evidenceGapCount(entry) > 0).length);

  readonly filteredEntries = computed(() => {
    const query = this.query().trim().toLowerCase();
    const lifecycle = this.lifecycleFilter();
    const provider = this.providerFilter();

    return this.entries.filter((entry) => {
      const searchable = [
        entry.identity.name,
        entry.identity.id,
        entry.identity.selector ?? '',
        entry.identity.exportName,
        entry.identity.source,
        entry.implementation.provider,
        entry.identity.description,
      ].join(' ').toLowerCase();

      return (!query || searchable.includes(query))
        && (lifecycle === 'all' || entry.lifecycle.status === lifecycle)
        && (provider === 'all' || entry.implementation.provider === provider);
    });
  });

  readonly selectedEntry = computed<ComponentManifestEntry | undefined>(() => {
    const visibleEntries = this.filteredEntries();
    return visibleEntries.find((entry) => entry.identity.id === this.selectedId())
      ?? visibleEntries[0]
      ?? this.entries[0];
  });

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  setLifecycleFilter(event: Event): void {
    this.lifecycleFilter.set((event.target as HTMLSelectElement).value as LifecycleFilter);
  }

  setProviderFilter(event: Event): void {
    this.providerFilter.set((event.target as HTMLSelectElement).value as ProviderFilter);
  }

  selectEntry(id: string): void {
    this.selectedId.set(id);
  }

  evidenceGapCount(entry: ComponentManifestEntry): number {
    const evidenceStatuses = [
      entry.publicApi.status,
      entry.evidence.storybook.status,
      entry.evidence.tests.status,
      entry.evidence.documentation.status,
      entry.accessibility.automatedChecks,
      entry.accessibility.keyboardCoverage,
    ];

    let gaps = evidenceStatuses.filter((status) => status === 'missing' || status === 'partial').length;
    if (entry.identity.kind !== 'service' && entry.accessibility.screenReaderAudit !== 'passed') gaps += 1;
    if (entry.figma.status === 'pending-access' || entry.figma.status === 'not-linked') gaps += 1;
    return gaps;
  }
}
