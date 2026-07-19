import { Component, computed } from '@angular/core';
import {
  componentManifest,
  type ComponentFinding,
  type ComponentManifestEntry,
  type EvidenceStatus,
} from '@public-sector/ui-patterns';

type RemediationPriority = 'critical' | 'high' | 'medium' | 'low';

interface RemediationItem {
  entry: ComponentManifestEntry;
  issueCount: number;
  riskScore: number;
  priority: RemediationPriority;
  nextAction: string;
}

@Component({
  selector: 'public-quality-remediation-view',
  standalone: true,
  template: `
    <section class="quality-view" aria-labelledby="qualityRemediationTitle">
      <header class="workbench-hero">
        <div>
          <p class="workbench-eyebrow">Evidence-led remediation</p>
          <h1 id="qualityRemediationTitle">Quality &amp; Remediation</h1>
          <p>
            Convert repository findings into a prioritized repair queue. Scores summarize
            evidence coverage; they do not replace manual design, accessibility, or code review.
          </p>
        </div>
        <div class="workbench-scope" aria-label="Quality scope">
          <span>Measured from manifest evidence</span>
          <span>Manual decisions remain visible</span>
        </div>
      </header>

      <section class="summary-grid" aria-label="Quality summary">
        <article>
          <strong>{{ overallCoverage() }}%</strong>
          <span>Average evidence coverage</span>
        </article>
        <article>
          <strong>{{ readyCount() }}</strong>
          <span>Repository-ready entries</span>
        </article>
        <article>
          <strong>{{ blockedCount() }}</strong>
          <span>Blocked entries</span>
        </article>
        <article>
          <strong>{{ urgentCount() }}</strong>
          <span>Critical or high priority</span>
        </article>
        <article>
          <strong>{{ pendingManualAudits() }}</strong>
          <span>Manual audits pending</span>
        </article>
        <article>
          <strong>{{ actionableFindings().length }}</strong>
          <span>Actionable typed findings</span>
        </article>
      </section>

      <section class="scorecard-panel" aria-labelledby="qualityScorecardTitle">
        <div class="panel-heading">
          <div>
            <p class="workbench-eyebrow">Quality scorecard</p>
            <h2 id="qualityScorecardTitle">Evidence by component</h2>
          </div>
          <p>Coverage combines contract, Storybook, tests, docs, accessibility, Figma, and repository readiness.</p>
        </div>

        <div class="scorecard-grid">
          @for (entry of rankedEntries(); track entry.identity.id) {
            <article>
              <div class="scorecard-heading">
                <div>
                  <h3>{{ entry.identity.name }}</h3>
                  <code>{{ entry.identity.selector || entry.identity.exportName }}</code>
                </div>
                <strong>{{ qualityScore(entry) }}%</strong>
              </div>
              <div class="score-track" aria-hidden="true">
                <span [style.width.%]="qualityScore(entry)"></span>
              </div>
              <dl>
                <div><dt>Lifecycle</dt><dd>{{ entry.lifecycle.status }}</dd></div>
                <div><dt>Repository</dt><dd>{{ entry.health.repositoryReadiness }}</dd></div>
                <div><dt>Storybook</dt><dd>{{ entry.evidence.storybook.status }}</dd></div>
                <div><dt>Tests</dt><dd>{{ entry.evidence.tests.status }}</dd></div>
              </dl>
            </article>
          }
        </div>
      </section>

      <section class="findings-panel" aria-labelledby="evidenceFindingsTitle">
        <div class="panel-heading">
          <div>
            <p class="workbench-eyebrow">Manifest-backed evidence</p>
            <h2 id="evidenceFindingsTitle">Evidence finding register</h2>
          </div>
          <p>Typed findings connect shipped components to severity, lifecycle, source evidence, and the next verifiable action.</p>
        </div>

        <div class="finding-summary" aria-label="Finding status summary">
          <span><strong>{{ actionableFindings().length }}</strong> actionable</span>
          <span><strong>{{ verifiedFindings().length }}</strong> verified or resolved</span>
          <span><strong>{{ accessibilityFindings().length }}</strong> accessibility</span>
          <span><strong>{{ tokenFindings().length }}</strong> token boundary</span>
          <span><strong>{{ apiFindings().length }}</strong> public API</span>
        </div>

        <div class="table-scroll">
          <table>
            <caption class="visually-hidden">Manifest-backed API, token, and accessibility findings</caption>
            <thead>
              <tr>
                <th scope="col">Finding</th>
                <th scope="col">Category</th>
                <th scope="col">Severity</th>
                <th scope="col">Status</th>
                <th scope="col">Affected components</th>
                <th scope="col">Evidence and next action</th>
              </tr>
            </thead>
            <tbody>
              @for (finding of findings; track finding.id) {
                <tr [attr.data-finding-id]="finding.id">
                  <th scope="row">
                    <code>{{ finding.id }}</code>
                    <span>{{ finding.summary }}</span>
                  </th>
                  <td><span class="finding-pill">{{ finding.category }}</span></td>
                  <td><span class="finding-pill" [attr.data-severity]="finding.severity">{{ finding.severity }}</span></td>
                  <td><span class="finding-pill" [attr.data-status]="finding.status">{{ finding.status }}</span></td>
                  <td>
                    <ul class="compact-list">
                      @for (componentId of finding.componentIds; track componentId) {
                        <li><code>{{ componentId }}</code></li>
                      }
                    </ul>
                  </td>
                  <td>
                    <p class="next-action">{{ findingNextAction(finding) }}</p>
                    <details>
                      <summary>{{ finding.evidence.length }} evidence source{{ finding.evidence.length === 1 ? '' : 's' }}</summary>
                      <ul class="compact-list evidence-list">
                        @for (evidence of finding.evidence; track evidence) {
                          <li><a [href]="evidenceUrl(evidence)" target="_blank" rel="noreferrer">{{ evidence }}</a></li>
                        }
                      </ul>
                    </details>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="queue-panel" aria-labelledby="remediationQueueTitle">
        <div class="panel-heading">
          <div>
            <p class="workbench-eyebrow">Prioritized queue</p>
            <h2 id="remediationQueueTitle">What should be repaired next</h2>
          </div>
          <p>Priority rises with blockers, missing behavior evidence, accessibility gaps, and exposed provider details.</p>
        </div>

        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Priority</th>
                <th scope="col">Component</th>
                <th scope="col">Open findings</th>
                <th scope="col">Primary next action</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              @for (item of remediationQueue(); track item.entry.identity.id) {
                <tr>
                  <td><span class="priority-pill" [attr.data-priority]="item.priority">{{ item.priority }}</span></td>
                  <th scope="row">
                    <strong>{{ item.entry.identity.name }}</strong>
                    <code>{{ item.entry.identity.source }}</code>
                  </th>
                  <td>{{ item.issueCount }}</td>
                  <td>{{ item.nextAction }}</td>
                  <td>{{ qualityScore(item.entry) }}%</td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="empty-cell">No remediation findings are currently recorded.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="case-panel" aria-labelledby="remediationCasesTitle">
        <div class="panel-heading">
          <div>
            <p class="workbench-eyebrow">Before-and-after casework</p>
            <h2 id="remediationCasesTitle">Representative remediation cases</h2>
          </div>
          <p>These cases turn generic component demos into evidence of forensic analysis and repair decisions.</p>
        </div>

        <div class="case-grid">
          @for (entry of caseEntries(); track entry.identity.id) {
            <article>
              <div class="case-heading">
                <div>
                  <p class="workbench-eyebrow">{{ entry.identity.kind }}</p>
                  <h3>{{ entry.identity.name }}</h3>
                </div>
                <span class="priority-pill" [attr.data-priority]="priorityFor(entry)">{{ priorityFor(entry) }}</span>
              </div>
              <section>
                <h4>Observed in shipped code</h4>
                <p>{{ observedFinding(entry) }}</p>
              </section>
              <section>
                <h4>Required remediation</h4>
                <p>{{ nextAction(entry) }}</p>
              </section>
              <section>
                <h4>Acceptance evidence</h4>
                <ul>
                  @for (evidence of acceptanceEvidence(entry); track evidence) {
                    <li>{{ evidence }}</li>
                  }
                </ul>
              </section>
            </article>
          }
        </div>
      </section>

      <details class="diagnostics-panel">
        <summary>Technical diagnostics and evidence distribution</summary>
        <div class="diagnostics-grid">
          <article>
            <h3>Provider distribution</h3>
            <dl>
              <div><dt>Native</dt><dd>{{ providerCount('native') }}</dd></div>
              <div><dt>PrimeNG-backed</dt><dd>{{ providerCount('primeng') }}</dd></div>
              <div><dt>Composite</dt><dd>{{ providerCount('composite') }}</dd></div>
              <div><dt>Services</dt><dd>{{ providerCount('service') }}</dd></div>
            </dl>
          </article>
          <article>
            <h3>Evidence gaps</h3>
            <dl>
              <div><dt>Storybook incomplete</dt><dd>{{ incompleteEvidenceCount('storybook') }}</dd></div>
              <div><dt>Tests incomplete</dt><dd>{{ incompleteEvidenceCount('tests') }}</dd></div>
              <div><dt>Docs incomplete</dt><dd>{{ incompleteEvidenceCount('documentation') }}</dd></div>
              <div><dt>Figma unlinked</dt><dd>{{ unlinkedFigmaCount() }}</dd></div>
            </dl>
          </article>
          <article>
            <h3>Interpretation</h3>
            <p>
              Runtime performance metrics belong here only when they explain a component defect.
              The primary surface stays focused on quality, evidence, and remediation decisions.
            </p>
          </article>
        </div>
      </details>
    </section>
  `,
  styles: `
    :host { display: block; }
    .quality-view { display: grid; gap: 1.25rem; color: var(--p-text-color); }
    .workbench-hero, .panel-heading, .scorecard-heading, .case-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .workbench-hero { padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--p-content-border-color); border-radius: 1rem; background: linear-gradient(135deg, color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background)), var(--p-content-background)); }
    .workbench-hero h1, h2, h3, h4, p { margin-top: 0; }
    .workbench-hero h1 { margin-bottom: 0.55rem; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.04em; }
    .workbench-hero p { max-width: 62rem; margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.65; }
    .workbench-eyebrow { margin-bottom: 0.4rem; color: var(--p-primary-color); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
    .workbench-scope { display: grid; gap: 0.35rem; min-width: 15rem; color: var(--p-text-muted-color); font-size: 0.82rem; text-align: right; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.75rem; }
    .summary-grid article, .scorecard-panel, .findings-panel, .queue-panel, .case-panel, .diagnostics-panel { border: 1px solid var(--p-content-border-color); border-radius: 0.9rem; background: var(--p-content-background); box-shadow: var(--p-card-shadow, none); }
    .summary-grid article { padding: 1rem; }
    .summary-grid strong { display: block; font-size: 1.8rem; }
    .summary-grid span { color: var(--p-text-muted-color); }
    .scorecard-panel, .findings-panel, .queue-panel, .case-panel { padding: 1rem; }
    .panel-heading p { max-width: 34rem; margin-bottom: 0; color: var(--p-text-muted-color); text-align: right; }
    .scorecard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: 0.75rem; margin-top: 1rem; }
    .scorecard-grid article, .case-grid article, .diagnostics-grid article { padding: 0.9rem; border: 1px solid var(--p-content-border-color); border-radius: 0.7rem; background: color-mix(in srgb, var(--p-content-background) 96%, var(--p-primary-color)); }
    .scorecard-heading h3 { margin-bottom: 0.2rem; }
    .scorecard-heading strong { font-size: 1.5rem; }
    code { overflow-wrap: anywhere; color: var(--p-text-color); font-size: 0.75rem; }
    .score-track { height: 0.45rem; margin: 0.75rem 0; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--p-content-border-color) 65%, transparent); }
    .score-track span { display: block; height: 100%; border-radius: inherit; background: var(--p-primary-color); }
    dl { display: grid; gap: 0.35rem; margin: 0; }
    dl div { display: grid; grid-template-columns: minmax(7rem, auto) 1fr; gap: 0.75rem; }
    dt { color: var(--p-text-muted-color); font-weight: 800; }
    dd { margin: 0; }
    .table-scroll { overflow-x: auto; margin-top: 1rem; border: 1px solid var(--p-content-border-color); border-radius: 0.7rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid var(--p-content-border-color); text-align: left; vertical-align: top; }
    thead th { background: color-mix(in srgb, var(--p-content-background) 88%, var(--p-primary-color)); color: var(--p-text-muted-color); font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    tbody th strong, tbody th code { display: block; }
    .priority-pill { display: inline-flex; padding: 0.2rem 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 999px; background: color-mix(in srgb, var(--p-content-background) 82%, var(--p-primary-color)); font-size: 0.72rem; font-weight: 900; text-transform: uppercase; }
    .priority-pill[data-priority='critical'] { border-color: var(--p-red-500, var(--p-primary-color)); }
    .priority-pill[data-priority='high'] { border-color: var(--p-orange-500, var(--p-primary-color)); }
    .priority-pill[data-priority='medium'] { border-color: var(--p-yellow-500, var(--p-primary-color)); }
    .finding-summary { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 1rem; }
    .finding-summary span, .finding-pill { display: inline-flex; gap: 0.3rem; align-items: center; padding: 0.3rem 0.55rem; border: 1px solid var(--p-content-border-color); border-radius: 999px; background: color-mix(in srgb, var(--p-content-background) 90%, var(--p-primary-color)); font-size: 0.75rem; text-transform: capitalize; }
    .finding-pill[data-severity='critical'], .finding-pill[data-severity='serious'] { border-color: var(--p-red-500, var(--p-primary-color)); }
    .finding-pill[data-severity='moderate'] { border-color: var(--p-orange-500, var(--p-primary-color)); }
    .finding-pill[data-status='verified'], .finding-pill[data-status='resolved'] { border-color: var(--p-green-500, var(--p-primary-color)); }
    .findings-panel tbody th code, .findings-panel tbody th span { display: block; }
    .findings-panel tbody th span { margin-top: 0.35rem; max-width: 28rem; font-weight: 500; line-height: 1.45; }
    .compact-list { margin: 0; padding-left: 1rem; }
    .compact-list li + li { margin-top: 0.3rem; }
    .next-action { margin-bottom: 0.45rem; max-width: 30rem; line-height: 1.45; }
    .findings-panel details summary { color: var(--p-primary-color); font-weight: 800; cursor: pointer; }
    .evidence-list { margin-top: 0.5rem; }
    .evidence-list a { color: var(--p-primary-color); overflow-wrap: anywhere; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    .empty-cell { padding: 2rem; color: var(--p-text-muted-color); text-align: center; }
    .case-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; margin-top: 1rem; }
    .case-grid article { display: grid; gap: 0.85rem; }
    .case-grid section { padding-top: 0.75rem; border-top: 1px solid var(--p-content-border-color); }
    .case-grid h3, .case-grid h4 { margin-bottom: 0.4rem; }
    .case-grid p, .case-grid ul { margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.5; }
    .case-grid ul { padding-left: 1.2rem; }
    .diagnostics-panel { padding: 0; overflow: hidden; }
    .diagnostics-panel summary { padding: 1rem; font-weight: 850; cursor: pointer; }
    .diagnostics-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; padding: 0 1rem 1rem; }
    .diagnostics-grid p { margin-bottom: 0; color: var(--p-text-muted-color); line-height: 1.55; }
    @media (max-width: 64rem) { .case-grid, .diagnostics-grid { grid-template-columns: 1fr; } }
    @media (max-width: 48rem) { .workbench-hero, .panel-heading { display: grid; } .workbench-scope, .panel-heading p { min-width: 0; text-align: left; } }
  `,
})
export class QualityRemediationViewComponent {
  readonly entries = componentManifest.entries;
  readonly findings = componentManifest.findings;
  readonly actionableFindings = computed(() => this.findings.filter((finding) =>
    ['open', 'investigate', 'planned', 'implemented'].includes(finding.status)));
  readonly verifiedFindings = computed(() => this.findings.filter((finding) =>
    finding.status === 'verified' || finding.status === 'resolved'));
  readonly accessibilityFindings = computed(() => this.findings.filter((finding) => finding.category === 'accessibility'));
  readonly tokenFindings = computed(() => this.findings.filter((finding) => finding.category === 'token'));
  readonly apiFindings = computed(() => this.findings.filter((finding) => finding.category === 'api'));

  readonly rankedEntries = computed(() => [...this.entries].sort((left, right) => this.qualityScore(left) - this.qualityScore(right)));
  readonly overallCoverage = computed(() => {
    if (!this.entries.length) return 0;
    return Math.round(this.entries.reduce((sum, entry) => sum + this.qualityScore(entry), 0) / this.entries.length);
  });
  readonly readyCount = computed(() => this.entries.filter((entry) => entry.health.repositoryReadiness === 'ready').length);
  readonly blockedCount = computed(() => this.entries.filter((entry) => entry.health.repositoryReadiness === 'blocked').length);
  readonly pendingManualAudits = computed(() => this.entries.filter((entry) => entry.accessibility.screenReaderAudit === 'pending' || entry.accessibility.screenReaderAudit === 'not-started').length);
  readonly remediationQueue = computed<RemediationItem[]>(() => this.entries
    .map((entry) => ({
      entry,
      issueCount: this.issueCount(entry),
      riskScore: this.riskScore(entry),
      priority: this.priorityFor(entry),
      nextAction: this.nextAction(entry),
    }))
    .filter((item) => item.issueCount > 0)
    .sort((left, right) => right.riskScore - left.riskScore));
  readonly urgentCount = computed(() => this.remediationQueue().filter((item) => item.priority === 'critical' || item.priority === 'high').length);
  readonly caseEntries = computed(() => ['ps-button', 'ps-select', 'ps-dialog']
    .map((id) => this.entries.find((entry) => entry.identity.id === id))
    .filter((entry): entry is ComponentManifestEntry => Boolean(entry)));
  readonly unlinkedFigmaCount = computed(() => this.entries.filter((entry) => entry.figma.status === 'pending-access' || entry.figma.status === 'not-linked').length);

  qualityScore(entry: ComponentManifestEntry): number {
    const values = [
      this.evidenceValue(entry.publicApi.status),
      this.evidenceValue(entry.evidence.storybook.status),
      this.evidenceValue(entry.evidence.tests.status),
      this.evidenceValue(entry.evidence.documentation.status),
      this.evidenceValue(entry.accessibility.automatedChecks),
      this.evidenceValue(entry.accessibility.keyboardCoverage),
      this.manualAuditValue(entry),
      this.figmaValue(entry),
      entry.health.repositoryReadiness === 'ready' ? 1 : entry.health.repositoryReadiness === 'partial' ? 0.5 : 0,
    ];

    return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100);
  }

  issueCount(entry: ComponentManifestEntry): number {
    let count = entry.health.blockers.length + entry.health.warnings.length;
    const statuses = [
      entry.publicApi.status,
      entry.evidence.storybook.status,
      entry.evidence.tests.status,
      entry.evidence.documentation.status,
      entry.accessibility.automatedChecks,
      entry.accessibility.keyboardCoverage,
    ];
    count += statuses.filter((status) => status === 'missing' || status === 'partial').length;
    if (entry.identity.kind !== 'service' && entry.accessibility.screenReaderAudit !== 'passed') count += 1;
    if (entry.figma.status === 'pending-access' || entry.figma.status === 'not-linked') count += 1;
    if (entry.implementation.providerEscapeHatches.length) count += entry.implementation.providerEscapeHatches.length;
    return count;
  }

  riskScore(entry: ComponentManifestEntry): number {
    return (entry.health.blockers.length * 8)
      + (entry.health.warnings.length * 2)
      + ((100 - this.qualityScore(entry)) / 10)
      + (entry.lifecycle.status === 'candidate' ? 3 : 0)
      + (entry.implementation.providerEscapeHatches.length * 2);
  }

  priorityFor(entry: ComponentManifestEntry): RemediationPriority {
    const score = this.riskScore(entry);
    if (entry.health.repositoryReadiness === 'blocked' || score >= 18) return 'critical';
    if (score >= 11) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  nextAction(entry: ComponentManifestEntry): string {
    if (entry.health.blockers.length) return entry.health.blockers[0];
    if (entry.accessibility.screenReaderAudit === 'pending' || entry.accessibility.screenReaderAudit === 'not-started') {
      return `Complete manual keyboard and screen-reader review for the ${entry.accessibility.pattern ?? 'component'} pattern.`;
    }
    if (entry.evidence.tests.status !== 'complete') return 'Add behavior-focused automated tests, including negative and disabled-state coverage.';
    if (entry.figma.status === 'pending-access' || entry.figma.status === 'not-linked') return 'Reconstruct and validate the Figma contract from the shipped implementation.';
    if (entry.publicApi.status !== 'complete') return 'Extract and document the public API before changing the component contract.';
    if (entry.implementation.providerEscapeHatches.length) return 'Remove or govern provider-specific escape hatches at the public boundary.';
    if (entry.evidence.documentation.status !== 'complete') return 'Publish component guidance with evidence links and ownership.';
    return 'Review remaining warnings and record the governance decision.';
  }

  observedFinding(entry: ComponentManifestEntry): string {
    const findings = [
      ...entry.health.blockers,
      ...entry.health.warnings,
      ...entry.implementation.knownLimitations,
    ];
    if (findings.length) return findings[0];
    if (entry.evidence.tests.status !== 'complete') return 'The shipped implementation has incomplete automated behavior evidence.';
    if (entry.figma.status !== 'linked' && entry.figma.status !== 'not-applicable') return 'The runtime contract is not yet bound to an approved Figma component.';
    return 'The component is usable, but its governance evidence should be reviewed as a complete system.';
  }

  acceptanceEvidence(entry: ComponentManifestEntry): string[] {
    const evidence = [
      entry.evidence.storybook.title ? `Canonical Storybook: ${entry.evidence.storybook.title}` : 'Create a canonical Storybook story.',
      entry.evidence.tests.files.length ? `Automated test: ${entry.evidence.tests.files[0]}` : 'Add behavior and accessibility tests.',
      entry.evidence.documentation.files.length ? `Guidance: ${entry.evidence.documentation.files[0]}` : 'Publish component guidance.',
    ];
    return evidence;
  }

  findingNextAction(finding: ComponentFinding): string {
    if (finding.status === 'verified' || finding.status === 'resolved') {
      return 'Preserve the linked verification and monitor for regression.';
    }
    if (finding.status === 'implemented') {
      return 'Complete the remaining manual or cross-environment verification.';
    }
    if (finding.status === 'investigate') {
      return 'Reproduce the behavior, classify its impact, and record the result.';
    }
    if (finding.status === 'planned') {
      return 'Implement the approved remediation and attach verification evidence.';
    }
    if (finding.category === 'accessibility') {
      return 'Remediate the accessible contract and verify automated and manual behavior separately.';
    }
    if (finding.category === 'token') {
      return 'Move provider token dependencies behind the public semantic token boundary.';
    }
    return 'Decide the canonical public contract and document its compatibility path.';
  }

  evidenceUrl(path: string): string {
    return `https://github.com/JeffreySanford/public-sector-federation/blob/master/${path}`;
  }

  providerCount(provider: ComponentManifestEntry['implementation']['provider']): number {
    return this.entries.filter((entry) => entry.implementation.provider === provider).length;
  }

  incompleteEvidenceCount(dimension: 'storybook' | 'tests' | 'documentation'): number {
    return this.entries.filter((entry) => entry.evidence[dimension].status !== 'complete' && entry.evidence[dimension].status !== 'not-applicable').length;
  }

  private evidenceValue(status: EvidenceStatus): number {
    if (status === 'complete' || status === 'not-applicable') return 1;
    if (status === 'partial') return 0.5;
    return 0;
  }

  private manualAuditValue(entry: ComponentManifestEntry): number {
    const status = entry.accessibility.screenReaderAudit;
    if (status === 'passed' || status === 'not-applicable') return 1;
    if (status === 'pending') return 0.4;
    return 0;
  }

  private figmaValue(entry: ComponentManifestEntry): number {
    if (entry.figma.status === 'linked' || entry.figma.status === 'not-applicable') return 1;
    if (entry.figma.status === 'pending-access') return 0.35;
    return 0;
  }
}
