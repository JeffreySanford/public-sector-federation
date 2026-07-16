import { Component, computed, input } from '@angular/core';
import {
  componentManifest,
  type ComponentManifestEntry,
  type EvidenceStatus,
  type ReadinessStatus,
} from '@public-sector/ui-patterns';

export type RegistryDashboardMode =
  | 'overview'
  | 'health'
  | 'lifecycle'
  | 'providers'
  | 'accessibility'
  | 'documentation'
  | 'detail'
  | 'promotion';

@Component({
  selector: 'ps-component-registry-dashboard',
  standalone: true,
  template: `
    <main class="registry" [attr.data-mode]="mode()">
      <header class="registry__header">
        <p class="registry__eyebrow">Machine-readable design-system spine</p>
        <h1>{{ title() }}</h1>
        <p>
          This Storybook surface projects governed component metadata. Update the
          manifest source, not this dashboard, when lifecycle, evidence, ownership,
          Figma, or zeroheight status changes.
        </p>
      </header>

      <section class="summary" aria-label="Registry summary">
        <article>
          <strong>{{ entries.length }}</strong>
          <span>Registry entries</span>
        </article>
        <article>
          <strong>{{ activeCount() }}</strong>
          <span>Active</span>
        </article>
        <article>
          <strong>{{ candidateCount() }}</strong>
          <span>Candidates</span>
        </article>
        <article>
          <strong>{{ pendingAuditCount() }}</strong>
          <span>Manual audits pending</span>
        </article>
        <article>
          <strong>{{ pendingFigmaCount() }}</strong>
          <span>Figma bindings pending</span>
        </article>
      </section>

      @switch (mode()) {
        @case ('overview') {
          <section aria-labelledby="registryOverviewTitle">
            <h2 id="registryOverviewTitle">Registry overview</h2>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Entry</th>
                    <th scope="col">Lifecycle</th>
                    <th scope="col">Provider</th>
                    <th scope="col">Repository</th>
                    <th scope="col">Storybook</th>
                    <th scope="col">Accessibility</th>
                    <th scope="col">Figma</th>
                    <th scope="col">zeroheight</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of entries; track entry.identity.id) {
                    <tr>
                      <th scope="row">
                        <strong>{{ entry.identity.name }}</strong>
                        <code>{{ entry.identity.selector || entry.identity.exportName }}</code>
                      </th>
                      <td><span class="status">{{ entry.lifecycle.status }}</span></td>
                      <td>{{ entry.implementation.provider }}</td>
                      <td>{{ entry.health.repositoryReadiness }}</td>
                      <td>{{ entry.evidence.storybook.status }}</td>
                      <td>{{ entry.accessibility.screenReaderAudit }}</td>
                      <td>{{ entry.figma.status }}</td>
                      <td>{{ entry.zeroheight.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
        @case ('health') {
          <section aria-labelledby="registryHealthTitle">
            <h2 id="registryHealthTitle">Manifest health</h2>
            <div class="health-grid">
              @for (entry of entries; track entry.identity.id) {
                @if (entry.health.blockers.length || entry.health.warnings.length) {
                  <article class="health-card">
                    <div class="health-card__heading">
                      <h3>{{ entry.identity.name }}</h3>
                      <span class="status">{{ entry.health.repositoryReadiness }}</span>
                    </div>
                    @if (entry.health.blockers.length) {
                      <h4>Blockers</h4>
                      <ul>
                        @for (blocker of entry.health.blockers; track blocker) {
                          <li>{{ blocker }}</li>
                        }
                      </ul>
                    }
                    @if (entry.health.warnings.length) {
                      <h4>Warnings</h4>
                      <ul>
                        @for (warning of entry.health.warnings; track warning) {
                          <li>{{ warning }}</li>
                        }
                      </ul>
                    }
                  </article>
                }
              }
            </div>
          </section>
        }
        @case ('lifecycle') {
          <section aria-labelledby="registryLifecycleTitle">
            <h2 id="registryLifecycleTitle">Lifecycle and promotion</h2>
            <div class="lifecycle-grid">
              @for (status of lifecycleStatuses; track status) {
                <article>
                  <h3>{{ status }}</h3>
                  <ul class="entry-list">
                    @for (entry of entriesForLifecycle(status); track entry.identity.id) {
                      <li>
                        <strong>{{ entry.identity.name }}</strong>
                        <span>{{ entry.governance.tier }}</span>
                        @if (entry.lifecycle.replacementFor) {
                          <small>Candidate replacement for {{ entry.lifecycle.replacementFor }}</small>
                        }
                        @if (entry.lifecycle.replacedBy) {
                          <small>Replaced by {{ entry.lifecycle.replacedBy }}</small>
                        }
                      </li>
                    }
                  </ul>
                </article>
              }
            </div>
          </section>
        }
        @case ('providers') {
          <section aria-labelledby="registryProviderTitle">
            <h2 id="registryProviderTitle">Provider boundaries</h2>
            <p>
              PrimeNG remains an internal implementation detail. Escape hatches and
              incomplete public API inventories are made visible for review.
            </p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Entry</th>
                    <th scope="col">Classification</th>
                    <th scope="col">Internal</th>
                    <th scope="col">Provider modules</th>
                    <th scope="col">Escape hatches</th>
                    <th scope="col">API inventory</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of entries; track entry.identity.id) {
                    <tr>
                      <th scope="row">{{ entry.identity.name }}</th>
                      <td>{{ entry.implementation.provider }}</td>
                      <td>{{ entry.implementation.providerInternalOnly ? 'Yes' : 'No' }}</td>
                      <td><code>{{ displayList(entry.implementation.providerModules) }}</code></td>
                      <td>{{ displayList(entry.implementation.providerEscapeHatches) }}</td>
                      <td>{{ entry.publicApi.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
        @case ('accessibility') {
          <section aria-labelledby="registryA11yTitle">
            <h2 id="registryA11yTitle">Accessibility evidence</h2>
            <p class="callout">
              Automated checks are evidence, not a WCAG conformance claim. Manual
              keyboard and screen-reader decisions remain visible and human-owned.
            </p>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Entry</th>
                    <th scope="col">Pattern</th>
                    <th scope="col">Automated</th>
                    <th scope="col">Keyboard</th>
                    <th scope="col">Screen reader</th>
                    <th scope="col">Test evidence</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of nonServiceEntries(); track entry.identity.id) {
                    <tr>
                      <th scope="row">{{ entry.identity.name }}</th>
                      <td>{{ entry.accessibility.pattern || 'Not classified' }}</td>
                      <td>{{ entry.accessibility.automatedChecks }}</td>
                      <td>{{ entry.accessibility.keyboardCoverage }}</td>
                      <td>{{ entry.accessibility.screenReaderAudit }}</td>
                      <td>{{ entry.evidence.tests.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
        @case ('documentation') {
          <section aria-labelledby="registryDocsTitle">
            <h2 id="registryDocsTitle">Documentation readiness</h2>
            <div class="documentation-grid">
              @for (entry of entries; track entry.identity.id) {
                <article>
                  <h3>{{ entry.identity.name }}</h3>
                  <dl>
                    <div><dt>Storybook</dt><dd>{{ entry.evidence.storybook.status }}</dd></div>
                    <div><dt>Repository docs</dt><dd>{{ entry.evidence.documentation.status }}</dd></div>
                    <div><dt>Figma</dt><dd>{{ entry.figma.status }}</dd></div>
                    <div><dt>zeroheight</dt><dd>{{ entry.zeroheight.status }}</dd></div>
                    <div><dt>Owner</dt><dd>{{ entry.ownership.owner || 'Unassigned' }}</dd></div>
                  </dl>
                  <code>{{ entry.identity.source }}</code>
                </article>
              }
            </div>
          </section>
        }
        @case ('detail') {
          <ng-container *ngTemplateOutlet="detail; context: { $implicit: focusedEntry() }" />
        }
        @case ('promotion') {
          <ng-container *ngTemplateOutlet="detail; context: { $implicit: upButtonEntry() }" />
        }
      }

      <ng-template #detail let-entry>
        @if (entry) {
          <section class="detail" aria-labelledby="registryDetailTitle">
            <div class="detail__heading">
              <div>
                <p class="registry__eyebrow">{{ entry.identity.kind }}</p>
                <h2 id="registryDetailTitle">{{ entry.identity.name }}</h2>
                <p>{{ entry.identity.description }}</p>
              </div>
              <span class="status">{{ entry.lifecycle.status }}</span>
            </div>

            <div class="detail-grid">
              <article>
                <h3>Contract</h3>
                <dl>
                  <div><dt>Selector</dt><dd><code>{{ entry.identity.selector || 'service' }}</code></dd></div>
                  <div><dt>Export</dt><dd><code>{{ entry.identity.exportName }}</code></dd></div>
                  <div><dt>Provider</dt><dd>{{ entry.implementation.provider }}</dd></div>
                  <div><dt>API inventory</dt><dd>{{ entry.publicApi.status }}</dd></div>
                </dl>
                <h4>Inputs</h4>
                <ul>
                  @for (member of entry.publicApi.inputs; track member.name) {
                    <li><code>{{ member.name }}: {{ member.type }}</code></li>
                  } @empty {
                    <li>No input inventory recorded.</li>
                  }
                </ul>
                <h4>Outputs</h4>
                <ul>
                  @for (member of entry.publicApi.outputs; track member.name) {
                    <li><code>{{ member.name }}: {{ member.type }}</code></li>
                  } @empty {
                    <li>No output inventory recorded.</li>
                  }
                </ul>
              </article>

              <article>
                <h3>Evidence</h3>
                <dl>
                  <div><dt>Storybook</dt><dd>{{ entry.evidence.storybook.status }}</dd></div>
                  <div><dt>Tests</dt><dd>{{ entry.evidence.tests.status }}</dd></div>
                  <div><dt>Documentation</dt><dd>{{ entry.evidence.documentation.status }}</dd></div>
                  <div><dt>Automated a11y</dt><dd>{{ entry.accessibility.automatedChecks }}</dd></div>
                  <div><dt>Screen reader</dt><dd>{{ entry.accessibility.screenReaderAudit }}</dd></div>
                </dl>
                <h4>Evidence paths</h4>
                <ul>
                  @for (path of evidencePaths(entry); track path) {
                    <li><code>{{ path }}</code></li>
                  } @empty {
                    <li>No evidence paths recorded.</li>
                  }
                </ul>
              </article>

              <article>
                <h3>External surfaces</h3>
                <dl>
                  <div><dt>Figma</dt><dd>{{ entry.figma.status }}</dd></div>
                  <div><dt>zeroheight</dt><dd>{{ entry.zeroheight.status }}</dd></div>
                  <div><dt>Design review</dt><dd>{{ entry.governance.designReview }}</dd></div>
                  <div><dt>Owner</dt><dd>{{ entry.ownership.owner || 'Unassigned' }}</dd></div>
                </dl>
              </article>

              <article>
                <h3>Promotion readiness</h3>
                <p><strong>Repository:</strong> {{ entry.health.repositoryReadiness }}</p>
                <h4>Requirements</h4>
                <ul>
                  @for (requirement of entry.governance.promotionRequirements; track requirement) {
                    <li>{{ requirement }}</li>
                  } @empty {
                    <li>No additional promotion requirements recorded.</li>
                  }
                </ul>
                <h4>Blockers</h4>
                <ul>
                  @for (blocker of entry.health.blockers; track blocker) {
                    <li>{{ blocker }}</li>
                  } @empty {
                    <li>No blocking items recorded.</li>
                  }
                </ul>
              </article>
            </div>
          </section>
        }
      </ng-template>
    </main>
  `,
  styles: `
    :host { display: block; color: var(--p-text-color); }
    .registry { min-height: 100vh; padding: clamp(1rem, 3vw, 2.5rem); background: var(--p-surface-ground, var(--p-content-background)); }
    .registry__header { max-width: 72rem; margin: 0 auto 1.5rem; }
    .registry__header h1, h2, h3, h4, p { margin-top: 0; }
    .registry__header h1 { margin-bottom: 0.5rem; font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: -0.04em; }
    .registry__header p { max-width: 65rem; color: var(--p-text-muted-color); line-height: 1.6; }
    .registry__eyebrow { margin-bottom: 0.5rem; color: var(--p-primary-color); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    section { max-width: 88rem; margin: 0 auto 2rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.75rem; }
    .summary article, .health-card, .lifecycle-grid article, .documentation-grid article, .detail-grid article { padding: 1rem; border: 1px solid var(--p-content-border-color); border-radius: var(--p-border-radius-md, 0.75rem); background: var(--p-content-background); box-shadow: var(--p-card-shadow, none); }
    .summary strong { display: block; font-size: 1.8rem; }
    .summary span { color: var(--p-text-muted-color); }
    .table-scroll { overflow-x: auto; border: 1px solid var(--p-content-border-color); border-radius: var(--p-border-radius-md, 0.75rem); background: var(--p-content-background); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.8rem; border-bottom: 1px solid var(--p-content-border-color); text-align: left; vertical-align: top; }
    thead th { background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color)); font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    tbody th strong, tbody th code { display: block; }
    code { overflow-wrap: anywhere; color: var(--p-text-color); font-size: 0.78rem; }
    .status { display: inline-flex; padding: 0.2rem 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 999px; background: color-mix(in srgb, var(--p-content-background) 82%, var(--p-primary-color)); font-size: 0.75rem; font-weight: 800; text-transform: capitalize; }
    .health-grid, .documentation-grid, .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); gap: 1rem; }
    .health-card__heading, .detail__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .health-card ul, .detail-grid ul { padding-left: 1.2rem; }
    .lifecycle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1rem; }
    .entry-list { display: grid; gap: 0.75rem; padding: 0; list-style: none; }
    .entry-list li { display: grid; gap: 0.2rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--p-content-border-color); }
    .entry-list span, .entry-list small { color: var(--p-text-muted-color); }
    .documentation-grid dl, .detail-grid dl { display: grid; gap: 0.4rem; }
    dl div { display: grid; grid-template-columns: minmax(7rem, auto) 1fr; gap: 0.75rem; }
    dt { color: var(--p-text-muted-color); font-weight: 700; }
    dd { margin: 0; }
    .callout { padding: 0.85rem 1rem; border-left: 0.3rem solid var(--p-primary-color); background: color-mix(in srgb, var(--p-content-background) 90%, var(--p-primary-color)); line-height: 1.55; }
    @media (max-width: 40rem) { .registry { padding: 1rem; } th, td { padding: 0.6rem; } .detail__heading { display: grid; } }
  `,
})
export class ComponentRegistryDashboardComponent {
  readonly mode = input<RegistryDashboardMode>('overview');
  readonly focusId = input('ps-up-button');
  readonly entries = componentManifest.entries;
  readonly lifecycleStatuses = ['experimental', 'candidate', 'active', 'deprecated'] as const;

  readonly title = computed(() => {
    const titles: Record<RegistryDashboardMode, string> = {
      overview: 'Component Registry',
      health: 'Manifest Health',
      lifecycle: 'Lifecycle Status',
      providers: 'Provider Boundaries',
      accessibility: 'Accessibility Coverage',
      documentation: 'Documentation Readiness',
      detail: 'Component Detail',
      promotion: 'UP Button Promotion Readiness',
    };
    return titles[this.mode()];
  });
  readonly activeCount = computed(() => this.entries.filter((entry) => entry.lifecycle.status === 'active').length);
  readonly candidateCount = computed(() => this.entries.filter((entry) => entry.lifecycle.status === 'candidate').length);
  readonly pendingAuditCount = computed(() => this.entries.filter((entry) => entry.accessibility.screenReaderAudit === 'pending').length);
  readonly pendingFigmaCount = computed(() => this.entries.filter((entry) => entry.figma.status === 'pending-access').length);
  readonly focusedEntry = computed(() => this.entries.find((entry) => entry.identity.id === this.focusId()) ?? this.entries[0]);
  readonly upButtonEntry = computed(() => this.entries.find((entry) => entry.identity.id === 'ps-up-button'));

  entriesForLifecycle(status: ComponentManifestEntry['lifecycle']['status']): ComponentManifestEntry[] {
    return this.entries.filter((entry) => entry.lifecycle.status === status);
  }

  nonServiceEntries(): ComponentManifestEntry[] {
    return this.entries.filter((entry) => entry.identity.kind !== 'service');
  }

  evidencePaths(entry: ComponentManifestEntry): string[] {
    return [
      ...entry.evidence.storybook.files,
      ...entry.evidence.tests.files,
      ...entry.evidence.documentation.files,
    ];
  }

  displayList(values: string[]): string {
    return values.length > 0 ? values.join(', ') : 'None recorded';
  }

  evidenceLabel(status: EvidenceStatus): string {
    return status;
  }

  readinessLabel(status: ReadinessStatus): string {
    return status;
  }
}
