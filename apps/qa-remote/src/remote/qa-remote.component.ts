import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  PublicButtonComponent,
  PublicCardComponent,
  PublicDialogComponent,
  PublicMenuComponent,
  PublicPopoverComponent,
  PublicSelectComponent,
  PublicTooltipComponent,
  PublicTagComponent,
  PublicToastComponent,
  PublicToastService,
  PublicUpButtonComponent,
  type PublicMenuAction,
  type PublicSelectOption,
} from '@public-sector/ui-patterns';
import { PerformanceDashboardComponent } from '../app/components/performance-dashboard.component';
import { AgileWorkflowService } from './agile-workflow.service';
import type { AgileApiDashboard, AgileApiReport, AgileSeedStatus } from './agile-workflow.service';

interface QaProgramRow {
  program: string;
  cases: number;
  status: 'On track' | 'Watch' | 'Delayed';
  region: string;
  sla: number;
}

interface RetrofitRoadmapRow {
  day: string;
  focus: string;
  output: string;
  workItemSlugs: string[];
}

interface SprintScopeRow {
  slug: string;
  item: string;
  includes: string;
  loe: 'Small' | 'Medium' | 'Large';
  acceptance: string;
  status: string;
}

interface AgileBoardRow {
  slug: string;
  workstream: string;
  sprint: string;
  loe: 'Small' | 'Medium' | 'Large';
  blockers: string;
  done: string;
  status: string;
}

@Component({
  selector: 'public-qa-remote',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PublicButtonComponent,
    PublicCardComponent,
    PublicDialogComponent,
    PublicMenuComponent,
    PublicPopoverComponent,
    PublicSelectComponent,
    PublicTagComponent,
    PublicTooltipComponent,
    PublicToastComponent,
    PublicUpButtonComponent,
    PerformanceDashboardComponent,
  ],
  templateUrl: './qa-remote.component.html',
  styleUrl: './qa-remote.component.css',
})
export class QaRemoteComponent implements OnInit {
  private readonly messageService = inject(PublicToastService);
  private readonly agileWorkflow = inject(AgileWorkflowService);

  activeTab = signal<'qa' | 'performance'>('qa');

  dialogVisible = false;
  acceptanceDialogVisible = false;
  selectedOverlayProgram = 'housing';
  qaTableLoading = false;
  qaTableShowEmpty = false;
  qaTableQuery = '';
  qaTableFirst = 0;
  qaTableRows = 5;
  agileApiSource = 'Loading Agile API…';
  agileApiDetail = 'Fetching sprint data from Postgres.';
  agileTimeSummary = 'Loading time summary…';
  agileReportSummary = 'Loading report summary…';
  agileSeedStatus = 'Checking seed sync status…';
  agileSprintHeadline = 'Sprint status';
  agileSprintSummary = 'Loading sprint summary from the Agile API.';
  agileSprintDaySummary = 'Showing the sprint items for the current sprint day.';
  agileAcceptanceGates: string[] = [];
  agileNextSteps: string[] = ['Loading next steps from the Agile API.'];
  agileExportLinks = [
    { label: 'Dashboard JSON', href: 'http://localhost:3333/api/agile/dashboard' },
    { label: 'Executive report JSON', href: 'http://localhost:3333/api/agile/report' },
    { label: 'OpenAPI contract', href: 'http://localhost:3333/api/docs' },
  ];

  readonly developerViews = [
    {
      id: 'storybook',
      title: 'Storybook',
      status: 'Developer playground',
      description: 'PrimeNG-heavy component stories for testing states before promoting patterns into remotes.',
      command: 'pnpm storybook:qa',
      reportLead: 'Use Storybook as the isolated lab for PrimeNG component behavior, states, and theme combinations.',
      metrics: ['4 acceptance stories', '7 proven PrimeNG hosts', 'Theme toolbar ready'],
      nextSteps: ['Add form control acceptance stories', 'Add loading states', 'Promote passing stories into shared wrappers'],
    },
    {
      id: 'zeroheight',
      title: 'Zeroheight preview',
      status: 'In-app documentation model',
      description: 'A local view of the guidance that would be published to Zeroheight for app teams.',
      command: 'docs/design-system',
      reportLead: 'Use this preview to model the small Storybook, token, and governance workflow Zeroheight should support.',
      metrics: ['Focus doc linked', 'Token delivery model linked', 'Validation checklist linked'],
      nextSteps: ['Confirm Zeroheight role', 'Link Storybook evidence', 'Keep runtime config out of documentation'],
    },
    {
      id: 'style-dictionary',
      title: 'Token delivery browser',
      status: 'Token export model',
      description: 'A token browser showing semantic tokens and PrimeNG mapping tokens side by side.',
      command: 'packages/tokens',
      reportLead: 'Use this browser to show how semantic public-sector tokens map into PrimeNG --p-* component variables.',
      metrics: ['294 exported token values', '3 source JSON files', 'PrimeNG mappings generated'],
      nextSteps: ['Broaden token metadata descriptions', 'Feed generated JSON into Zeroheight', 'Add token diff checks to CI'],
    },
    {
      id: 'agile',
      title: 'Agile plan',
      status: 'Sprint planning model',
      description: 'A delivery view for sprint slices, level of effort, blockers, and done criteria.',
      command: 'docs/design-system/focus.md',
      reportLead: 'Use this plan to keep the design-system work centered on token delivery, shell integration, and validation gates.',
      metrics: ['Loading sprint metrics…', 'Acceptance checks pending', 'Blockers pending'],
      nextSteps: ['Loading next steps from the Agile API.'],
    },
  ];

  selectedDeveloperView = this.developerViews[0];

  readonly zeroheightSections = [
    {
      section: 'Architecture focus',
      audience: 'Product, design, engineering',
      content: 'Token delivery, shell mounting, registry role, and validation checks.',
    },
    {
      section: 'Component coverage',
      audience: 'Design system and feature teams',
      content: 'PrimeNG family status, reintroduction order, risk, and promotion rules.',
    },
    {
      section: 'Accessibility and QA',
      audience: 'Engineering and accessibility reviewers',
      content: 'Theme matrix, contrast gates, keyboard focus, overlays, and known framework quirks.',
    },
    {
      section: 'Release readiness',
      audience: 'Delivery leads and app teams',
      content: 'Sprint scope, accepted component families, remaining blockers, and migration notes.',
    },
  ];

  readonly storybookAcceptanceRows = [
    {
      check: 'Default state',
      evidence: 'Component renders with real PrimeNG internals and public-sector tokens.',
      gate: 'Storybook story visible and no raw/blank host.',
      status: 'Done',
    },
    {
      check: 'Theme matrix',
      evidence: 'Neutral, vibrant, pastel, light, and dark are exercised with toolbar globals.',
      gate: 'Visual check plus `pnpm verify:fed` after promotion to /qa.',
      status: 'Done',
    },
    {
      check: 'Accessibility',
      evidence: 'Labels, keyboard focus, and contrast are explicit in the story.',
      gate: 'A11y addon review and route-level axe pass after /qa adoption.',
      status: 'Done',
    },
    {
      check: 'Stress state',
      evidence: 'Long text, empty data, loading state, or invalid state is represented.',
      gate: 'Story includes at least one non-happy-path state.',
      status: 'Done',
    },
    {
      check: 'Federation readiness',
      evidence: 'Candidate component is verified directly and through shell composition.',
      gate: 'Direct remote and shell route both render stable content.',
      status: 'Done',
    },
    {
      check: 'Promotion decision',
      evidence: 'Component promotion status and validation evidence are updated after validation.',
      gate: 'Status moves to Active or Proven only with Storybook, direct remote, shell-mounted, and accessibility evidence.',
      status: 'Done',
    },
  ];

  readonly overlayMenuActions: PublicMenuAction[] = [
    {
      label: 'Review queue',
      icon: 'pi pi-list-check',
      action: () => this.showAcceptanceToast('info'),
    },
    {
      label: 'Escalate item',
      icon: 'pi pi-exclamation-triangle',
      action: () => this.showAcceptanceToast('warn'),
    },
    {
      label: 'Close case',
      icon: 'pi pi-check',
      action: () => this.showAcceptanceToast('success'),
    },
  ];

  readonly overlayProgramOptions: PublicSelectOption[] = [
    { label: 'Housing assistance', value: 'housing' },
    { label: 'Benefits renewal', value: 'benefits' },
    { label: 'Permit review', value: 'permits' },
  ];

  readonly federationProofRows = [
    {
      family: 'Button / Tag',
      directRemote: 'http://localhost:4204',
      shellComposed: 'http://localhost:4200/qa',
      verifyFed: 'Passed',
      matrixStatus: 'Proven',
    },
    {
      family: 'Card',
      directRemote: 'http://localhost:4204',
      shellComposed: 'http://localhost:4200/qa',
      verifyFed: 'Passed',
      matrixStatus: 'Proven',
    },
    {
      family: 'Table / Paginator',
      directRemote: 'http://localhost:4204',
      shellComposed: 'http://localhost:4200/qa',
      verifyFed: 'Passed',
      matrixStatus: 'Proven',
    },
    {
      family: 'Dialog / Toast',
      directRemote: 'http://localhost:4204',
      shellComposed: 'http://localhost:4200/qa',
      verifyFed: 'Passed',
      matrixStatus: 'Proven',
    },
  ];

  readonly storybookBacklogRows = [
    { family: 'Button and Tag', story: 'Default, long labels, disabled, severity labels', status: 'Proven in /qa' },
    { family: 'Card', story: 'Metric, long content, empty state, route-safe composition', status: 'Proven in /qa' },
    { family: 'Table', story: 'Empty, loading, filtered, sorted, paginated, long cells', status: 'Proven in /qa' },
    { family: 'Dialog and Toast', story: 'Overlay, long copy, error toast, append policy', status: 'Proven in /qa' },
    { family: 'InputText and Select', story: 'Default, disabled, invalid, helper text, overlay append', status: 'Sprint 2' },
    { family: 'Password and ToggleSwitch', story: 'Admin states, labels, reveal icon, invalid state', status: 'Sprint 2' },
  ];

  readonly zeroheightPortalRows = [
    { page: 'Focus', content: 'What problem this work is solving for the unified platform.', source: 'docs/design-system/focus.md' },
    { page: 'Token pipeline', content: 'How tokens reach shell, subapps, PrimeNG, Storybook, and documentation.', source: 'Token delivery decision diagram' },
    { page: 'Components', content: 'Usage, states, accessibility notes, and embedded Storybook examples.', source: 'Storybook' },
    { page: 'Patterns', content: 'Forms, search/filter, tables, empty states, loading, errors, confirmations.', source: '/qa and remotes' },
    { page: 'Developer guide', content: 'Install preset, import tokens, bootstrap PrimeNG, and verify federated routes.', source: 'Repo docs' },
    { page: 'Governance', content: 'Contribution model, release readiness, blockers, and versioning notes.', source: 'Agile plan' },
  ];

  readonly figmaSetupRows = [
    { page: '00 Cover', purpose: 'Name, status, owner, and links to Storybook, Zeroheight, and repo docs.', status: 'Ready to create' },
    { page: '01 Foundations', purpose: 'Semantic color variables, type scale, spacing, radius, shadow, and focus.', status: 'Sprint 1' },
    { page: '02 Tokens / Variables', purpose: 'Light/dark modes plus neutral, vibrant, and pastel variable modes.', status: 'Sprint 1' },
    { page: '03 Components', purpose: 'Button, input, select, card, table, dialog, and toast frames.', status: 'Sprint 1' },
    { page: '04 Patterns', purpose: 'Service intake, reporting table, admin settings, empty state, and error patterns.', status: 'Sprint 2' },
    { page: '05 App Examples', purpose: 'Screenshots or frames based on shell, services, reporting, admin, and QA.', status: 'Sprint 2' },
  ];

  readonly styleDictionaryPlanRows = [
    {
      step: 'Model token source',
      output: 'JSON source for primitive, semantic, component, and library tiers.',
      status: 'Started',
    },
    {
      step: 'Generate CSS',
      output: '`tokens.css` becomes generated output or a thin import layer.',
      status: 'Started',
    },
    {
      step: 'Generate docs export',
      output: 'Zeroheight-friendly JSON with tier, mode, theme, usage, and accessibility metadata.',
      status: 'Started',
    },
    {
      step: 'Verify consumers',
      output: 'PrimeNG preset, /qa token browser, and remotes all consume the same artifacts.',
      status: 'Next',
    },
  ];

  readonly tokenAuditRows = [
    { area: 'Foundations', tokens: 'surface, text, border, radius, focus, font family', source: 'tokens/themes.json' },
    { area: 'Theme variants', tokens: 'neutral, vibrant, pastel, light, dark', source: 'tokens/themes.json selectors' },
    { area: 'Actions', tokens: 'action text, button background, button text, focus ring', source: 'tokens/themes.json and zeroheight metadata' },
    { area: 'Feedback', tokens: 'success, warning, danger, toast severity surfaces', source: 'tokens/themes.json and component overrides' },
    { area: 'Data display', tokens: 'datatable header, rows, hover, paginator selected state', source: 'tokens/themes.json and component overrides' },
  ];

  readonly retrofitRoadmapRows: RetrofitRoadmapRow[] = [
    {
      day: 'Day 1',
      focus: 'Inventory current app',
      output: 'Foundations, components, patterns, states, inconsistencies.',
      workItemSlugs: ['track-platform-validation-risks', 'create-storybook-acceptance-checks'],
    },
    {
      day: 'Day 2',
      focus: 'Token map v1',
      output: 'Semantic token list and PrimeNG mapping candidates.',
      workItemSlugs: ['compare-token-delivery-methods'],
    },
    {
      day: 'Day 3',
      focus: 'Token delivery comparison',
      output: 'Shared package, shell CSS, subapp CSS, host variables, and PrimeNG preset tradeoffs.',
      workItemSlugs: ['compare-token-delivery-methods', 'validate-storybook-zeroheight-dx'],
    },
    {
      day: 'Day 4',
      focus: 'Storybook proof',
      output: 'PrimeNG stories for core component families.',
      workItemSlugs: ['harden-proven-primeng-families', 'create-storybook-acceptance-checks'],
    },
    {
      day: 'Day 5',
      focus: 'Storybook and Zeroheight DX',
      output: 'Small evidence workflow for stories, token display, component status, and governance notes.',
      workItemSlugs: ['validate-storybook-zeroheight-dx'],
    },
    {
      day: 'Day 6',
      focus: 'Developer onboarding',
      output: 'How to consume preset, tokens, stories, and validation checks.',
      workItemSlugs: ['validate-storybook-zeroheight-dx', 'citizen-services-primeng-reintroduction'],
    },
    {
      day: 'Day 7',
      focus: 'Demo and next plan',
      output: 'Working demo plus Sprint 2 backlog and blockers.',
      workItemSlugs: ['citizen-services-primeng-reintroduction'],
    },
  ];

  selectedSprintDay = this.currentSprintDay();

  sprintScopeRows: SprintScopeRow[] = [];

  blockerRows: Array<{
    blocker: string;
    affected: string;
    mitigation: string;
    owner: string;
    status: string;
  }> = [];

  agileRows: AgileBoardRow[] = [];

  readonly tokenRows = [
    {
      name: '--ps-action-text',
      tier: 'Semantic',
      value: 'Accessible action foreground',
      mapsTo: '--p-button-outlined-primary-color',
    },
    {
      name: '--ps-button-background',
      tier: 'Semantic',
      value: 'Filled action background',
      mapsTo: '--p-button-primary-background',
    },
    {
      name: '--p-datatable-header-cell-background',
      tier: 'PrimeNG mapping',
      value: 'Tokenized datatable header',
      mapsTo: 'p-table',
    },
    {
      name: '--p-toast-message-success-background',
      tier: 'PrimeNG mapping',
      value: 'Tokenized success toast surface',
      mapsTo: 'p-toast',
    },
    {
      name: '--p-paginator-nav-button-selected-background',
      tier: 'PrimeNG mapping',
      value: 'Selected paginator page',
      mapsTo: 'p-paginator',
    },
  ];

  readonly primengSmokeRows = [
    { component: 'p-tag', status: 'Rendered' },
    { component: 'p-button outlined', status: 'Rendered' },
    { component: 'p-table', status: 'Testing' },
  ];

  readonly qaProgramRows: QaProgramRow[] = [
    { program: 'Housing assistance', cases: 428, status: 'On track', region: 'North Region', sla: 96 },
    { program: 'Small business grants', cases: 183, status: 'Watch', region: 'Central Region', sla: 87 },
    { program: 'Permit inspections', cases: 72, status: 'Delayed', region: 'South Region', sla: 68 },
    { program: 'Benefits renewal', cases: 316, status: 'On track', region: 'North Region', sla: 94 },
    { program: 'Document intake', cases: 241, status: 'Watch', region: 'Central Region', sla: 82 },
    { program: 'Transit assistance', cases: 137, status: 'On track', region: 'East Region', sla: 91 },
    { program: 'Child care subsidy', cases: 205, status: 'Delayed', region: 'West Region', sla: 73 },
    { program: 'Emergency housing', cases: 94, status: 'Watch', region: 'South Region', sla: 79 },
    { program: 'License review', cases: 158, status: 'On track', region: 'East Region', sla: 93 },
    { program: 'Food assistance', cases: 376, status: 'On track', region: 'West Region', sla: 95 },
    { program: 'Veteran services', cases: 121, status: 'Watch', region: 'Central Region', sla: 84 },
    { program: 'Public records', cases: 67, status: 'Delayed', region: 'North Region', sla: 70 },
  ];

  readonly qaAcceptanceChecks = [
    'Story renders real PrimeNG internals, not blank/raw custom hosts.',
    'Stress states cover long labels, loading, empty data, and error feedback.',
    'Theme contrast works in neutral, vibrant, pastel, light, and dark modes.',
    'Direct remote and shell-composed /qa routes pass `pnpm verify:fed`.',
    'Component promotion evidence marks proven families as Active or Proven.',
  ];

  ngOnInit(): void {
    this.agileWorkflow.getDashboard().subscribe((dashboard) => {
      if (!dashboard) {
        return;
      }

      this.applyAgileDashboard(dashboard);
    });
    this.agileWorkflow.getReport().subscribe((report) => {
      if (report) {
        this.applyAgileReport(report);
      }
    });
    this.agileWorkflow.getSeedStatus().subscribe((status) => {
      if (status) {
        this.applySeedStatus(status);
      }
    });
  }

  selectDeveloperView(view: (typeof this.developerViews)[number]): void {
    this.selectedDeveloperView = view;
    if (view.id === 'agile') {
      view.nextSteps = [...this.agileNextSteps];
    }
  }

  setActiveTab(tab: 'qa' | 'performance'): void {
    this.activeTab.set(tab);
  }

  severity(status: QaProgramRow['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }

  get qaAcceptanceTableRows(): QaProgramRow[] {
    if (this.qaTableShowEmpty) {
      return [];
    }

    const query = this.qaTableQuery.trim().toLowerCase();
    if (!query) {
      return this.qaProgramRows;
    }

    return this.qaProgramRows.filter((row) =>
      [row.program, row.status, row.region, String(row.cases), String(row.sla)].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }

  get selectedSprintDayRoadmap(): RetrofitRoadmapRow {
    return this.retrofitRoadmapRows.find((row) => row.day === this.selectedSprintDay) ?? this.retrofitRoadmapRows[0];
  }

  get selectedSprintDaySlugs(): string[] {
    return this.selectedSprintDayRoadmap.workItemSlugs;
  }

  get selectedSprintScopeRows(): SprintScopeRow[] {
    return this.sprintScopeRows.filter((row) => this.selectedSprintDaySlugs.includes(row.slug));
  }

  get selectedAgileRows(): AgileBoardRow[] {
    return this.agileRows.filter((row) => this.selectedSprintDaySlugs.includes(row.slug));
  }

  toggleQaTableLoading(): void {
    this.qaTableLoading = !this.qaTableLoading;
  }

  toggleQaTableEmpty(): void {
    this.qaTableShowEmpty = !this.qaTableShowEmpty;
    this.resetQaTablePaging();
  }

  onQaTableSearch(query: string): void {
    this.qaTableQuery = query;
    this.resetQaTablePaging();
  }

  showAcceptanceToast(severity: 'success' | 'info' | 'warn' | 'danger'): void {
    this.messageService.add({
      severity,
      summary: `${severity === 'danger' ? 'Error' : `${severity[0].toUpperCase()}${severity.slice(1)}`} checkpoint`,
      detail: 'Toast styling is driven by the shared PrimeNG token contract.',
      life: 3500,
    });
  }

  selectSprintDay(row: RetrofitRoadmapRow): void {
    this.selectedSprintDay = row.day;
    this.updateSprintDaySummary();
  }

  confirmAcceptanceDialog(): void {
    this.acceptanceDialogVisible = false;
    this.showAcceptanceToast('success');
  }

  private applyAgileDashboard(dashboard: AgileApiDashboard): void {
    const doneCount = dashboard.workItems.filter((item) => item.status === 'done').length;
    const agileView = this.developerViews.find((view) => view.id === 'agile');

    this.agileApiSource = `Postgres API: ${dashboard.sprint.name}`;
    this.agileApiDetail = dashboard.sprint.goal;
    this.agileTimeSummary = `${dashboard.timeSummary.totalHours} tracked hours across ${dashboard.timeSummary.entryCount} entries`;
    this.agileSprintHeadline = `${dashboard.sprint.name} progress`;
    this.agileSprintSummary = `${doneCount} of ${dashboard.workItems.length} sprint items are complete. ${dashboard.sprint.goal}`;
    this.agileAcceptanceGates = dashboard.acceptanceChecks.map(
      (check) => `${check.check}: ${this.labelStatus(check.status)}`,
    );

    if (agileView) {
      agileView.metrics = [
        `${doneCount}/${dashboard.workItems.length} sprint items done`,
        `${dashboard.acceptanceChecks.filter((check) => check.status === 'done').length}/${dashboard.acceptanceChecks.length} acceptance checks done`,
        `${dashboard.blockers.filter((blocker) => blocker.status !== 'done').length} active blocker themes`,
        `${dashboard.timeSummary.totalHours} tracked hours`,
      ];
    }

    this.sprintScopeRows = dashboard.workItems.map((item) => ({
      slug: item.slug,
      item: item.title,
      includes: item.includes,
      loe: this.labelEffort(item.effort),
      acceptance: item.doneCriteria,
      status: this.labelStatus(item.status),
    }));

    this.agileRows = dashboard.workItems.map((item) => ({
      slug: item.slug,
      workstream: item.workstream,
      sprint: dashboard.sprint.name,
      loe: this.labelEffort(item.effort),
      blockers: item.blockerSummary ?? 'No active blocker recorded.',
      done: `${item.doneCriteria} Time tracked: ${(item.totalMinutes / 60).toFixed(1)}h.`,
      status: this.labelStatus(item.status),
    }));

    this.blockerRows = dashboard.blockers.map((blocker) => ({
      blocker: blocker.title,
      affected: blocker.affectedArea,
      mitigation: blocker.mitigation,
      owner: blocker.owner,
      status: this.labelStatus(blocker.status),
    }));

    if (this.selectedDeveloperView.id === 'agile' && agileView) {
      this.selectedDeveloperView.metrics = [...agileView.metrics];
    }

    this.updateSprintDaySummary();
  }

  private applyAgileReport(report: AgileApiReport): void {
    const agileView = this.developerViews.find((view) => view.id === 'agile');

    this.agileReportSummary = [
      `Completed ${report.summary.completedCount}`,
      `current ${report.summary.currentCount}`,
      `remaining ${report.summary.remainingCount}`,
      `blockers ${report.summary.blockerCount}`,
    ].join(', ');

    this.agileNextSteps = report.recommendations;
    if (agileView) {
      agileView.nextSteps = [...report.recommendations];
    }
    if (this.selectedDeveloperView.id === 'agile') {
      this.selectedDeveloperView.nextSteps = [...report.recommendations];
    }
  }

  private applySeedStatus(status: AgileSeedStatus): void {
    this.agileSeedStatus = status.synced
      ? 'Database and seed artifact are synchronized'
      : 'Database and seed artifact need synchronization';
  }

  private labelEffort(effort: AgileApiDashboard['workItems'][number]['effort']): 'Small' | 'Medium' | 'Large' {
    return effort === 'small' ? 'Small' : effort === 'medium' ? 'Medium' : 'Large';
  }

  private labelStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  private currentSprintDay(): string {
    const sprintStart = new Date(2026, 6, 9);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const elapsedDays = Math.floor((todayStart.getTime() - sprintStart.getTime()) / 86_400_000);
    const dayIndex = Math.min(Math.max(elapsedDays, 0), this.retrofitRoadmapRows.length - 1);

    return this.retrofitRoadmapRows[dayIndex].day;
  }

  private updateSprintDaySummary(): void {
    const itemCount = this.selectedSprintScopeRows.length;
    const noun = itemCount === 1 ? 'item' : 'items';

    this.agileSprintDaySummary = `${this.selectedSprintDayRoadmap.day}: ${this.selectedSprintDayRoadmap.focus}. Showing ${itemCount} sprint ${noun}.`;
  }

  statusChipClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized === 'done') {
      return 'status-chip--success';
    }
    if (normalized === 'next' || normalized === 'review' || normalized === 'in progress') {
      return 'status-chip--warn';
    }
    if (normalized === 'blocked') {
      return 'status-chip--danger';
    }
    return 'status-chip--info';
  }

  private resetQaTablePaging(): void {
    this.qaTableFirst = 0;
  }
}
