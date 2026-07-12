import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

type ProblemSeverity = 'success' | 'info' | 'warn' | 'danger' | 'contrast';
type StoryMode = 'overview' | 'toast' | 'dialog' | 'form' | 'table' | 'theme' | 'governance';

interface EvidenceRow {
  check: string;
  risk: string;
  proof: string;
}

@Component({
  selector: 'public-problem-area-story',
  standalone: true,
  imports: [ButtonModule, CardModule, DialogModule, FormsModule, InputTextModule, SelectModule, TableModule, TagModule, ToastModule],
  template: `
    <p-toast />
    <main class="problem-story">
      <header>
        <p-tag [value]="badge" [severity]="severity" />
        <h1>{{ title }}</h1>
        <p>{{ summary }}</p>
      </header>

      <div class="story-grid">
        <p-card [header]="primaryHeading" [subheader]="primarySubheading">
          @if (mode === 'toast') {
            <div class="inline-row">
              <p-button label="Success" icon="pi pi-check" (click)="showToast('success')" />
              <p-button label="Info" icon="pi pi-info-circle" [outlined]="true" (click)="showToast('info')" />
              <p-button label="Warn" icon="pi pi-exclamation-triangle" [outlined]="true" (click)="showToast('warn')" />
              <p-button label="Error" icon="pi pi-times-circle" [outlined]="true" (click)="showToast('error')" />
            </div>
          } @else if (mode === 'dialog') {
            <button type="button" class="story-button" (click)="dialogVisible = true">
              <i class="pi pi-window-maximize" aria-hidden="true"></i>
              <span>Open overlay</span>
            </button>
          } @else if (mode === 'form') {
            <div class="form-grid">
              <label for="problem-applicant-name">Applicant name</label>
              <input
                id="problem-applicant-name"
                pInputText
                [(ngModel)]="applicantName"
                [attr.aria-invalid]="invalidForm"
                aria-describedby="problem-applicant-help"
              />
              <small id="problem-applicant-help">{{ formHelp }}</small>

              <label for="problem-program">Program</label>
              <p-select
                inputId="problem-program"
                [(ngModel)]="selectedProgram"
                [options]="programs"
                appendTo="body"
                ariaLabel="Program"
              />
            </div>
          } @else if (mode === 'table') {
            <p-table [value]="tableRows" styleClass="p-datatable-gridlines">
              <ng-template pTemplate="header">
                <tr>
                  <th>Check</th>
                  <th>Risk</th>
                  <th>Proof</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.check }}</td>
                  <td>{{ row.risk }}</td>
                  <td>{{ row.proof }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3">No evidence has been added for this state yet.</td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <p>{{ primaryCopy }}</p>
          }
        </p-card>

        <p-card header="Validation notes" subheader="What this story should prove">
          <ul>
            @for (note of notes; track note) {
              <li>{{ note }}</li>
            }
          </ul>
        </p-card>
      </div>

      <article>
        <h2>Promotion gate</h2>
        <p>{{ gate }}</p>
        <div class="inline-row">
          <p-tag value="Storybook evidence" severity="contrast" />
          <p-tag value="/qa checkpoint" severity="success" />
          <p-tag value="Shell route" severity="warn" />
        </div>
      </article>

      <p-dialog
        [header]="dialogHeading"
        [(visible)]="dialogVisible"
        [modal]="true"
        appendTo="body"
        [baseZIndex]="2000"
        [draggable]="false"
        [resizable]="false"
        [style]="{ width: '34rem' }"
      >
        <p>{{ dialogCopy }}</p>
        <ng-template pTemplate="footer">
          <p-button label="Close" [text]="true" (click)="dialogVisible = false" />
          <p-button label="Confirm" icon="pi pi-check" (click)="confirmDialog()" />
        </ng-template>
      </p-dialog>
    </main>
  `,
  styles: `
    .problem-story {
      display: grid;
      gap: 1rem;
      max-width: 74rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1rem;
      background: var(--p-content-background);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
    }

    p,
    li,
    small {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .story-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .inline-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    .form-grid {
      display: grid;
      gap: 0.5rem;
    }

    label {
      font-weight: 800;
    }

    .story-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 0.9rem;
      border: 1px solid var(--ps-button-background);
      border-radius: var(--p-border-radius-md);
      background: var(--ps-button-background);
      color: var(--ps-button-text);
      cursor: pointer;
      font: inherit;
      font-weight: 800;
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ProblemAreaStoryComponent {
  private readonly messageService = inject(MessageService);

  @Input() badge = 'Problem area';
  @Input() title = 'Problem area overview';
  @Input() summary = 'Use this story to document a known validation risk and the evidence needed to promote it.';
  @Input() severity: ProblemSeverity = 'contrast';
  @Input() mode: StoryMode = 'overview';
  @Input() primaryHeading = 'Evidence focus';
  @Input() primarySubheading = 'What to inspect';
  @Input() primaryCopy = 'This story records the problem, the proof path, and the promotion gate.';
  @Input() notes: string[] = ['Check Storybook first.', 'Promote to /qa only after the behavior is stable.', 'Verify shell-mounted behavior before marking proven.'];
  @Input() gate = 'Do not mark this pattern proven until Storybook, /qa, shell-mounted route, and accessibility evidence agree.';
  @Input() dialogHeading = 'Overlay validation';
  @Input() dialogCopy = 'This dialog validates appendTo body behavior, z-index, focus handling, and readable overlay content.';
  @Input() invalidForm = false;
  @Input() formHelp = 'Helper text remains associated with the field.';
  @Input() emptyTable = false;

  dialogVisible = false;
  applicantName = 'Jordan Avery';
  selectedProgram = 'Housing assistance';

  readonly programs = ['Housing assistance', 'Benefits renewal', 'Permit review'];
  readonly evidenceRows: EvidenceRow[] = [
    { check: 'Storybook', risk: 'Isolated component behavior', proof: 'Story renders expected state' },
    { check: '/qa', risk: 'Remote composition', proof: 'Direct remote stays visible' },
    { check: 'Shell route', risk: 'Web Component mounting', proof: 'Shell-mounted route works' },
  ];

  get tableRows(): EvidenceRow[] {
    return this.emptyTable ? [] : this.evidenceRows;
  }

  showToast(severity: 'success' | 'info' | 'warn' | 'error'): void {
    this.messageService.add({
      severity,
      summary: `${severity[0].toUpperCase()}${severity.slice(1)} feedback`,
      detail: 'Toast feedback must remain readable, correctly layered, and tied to the shared token system.',
      life: 3500,
    });
  }

  confirmDialog(): void {
    this.dialogVisible = false;
    this.showToast('success');
  }
}

const meta: Meta<ProblemAreaStoryComponent> = {
  title: 'Design System/Problem Areas',
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [ProblemAreaStoryComponent],
    },
    template: `
      <public-problem-area-story
        [badge]="badge"
        [title]="title"
        [summary]="summary"
        [severity]="severity"
        [mode]="mode"
        [primaryHeading]="primaryHeading"
        [primarySubheading]="primarySubheading"
        [primaryCopy]="primaryCopy"
        [notes]="notes"
        [gate]="gate"
        [dialogHeading]="dialogHeading"
        [dialogCopy]="dialogCopy"
        [invalidForm]="invalidForm"
        [formHelp]="formHelp"
        [emptyTable]="emptyTable"
      />
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warn', 'danger', 'contrast'],
    },
    mode: {
      control: 'select',
      options: ['overview', 'toast', 'dialog', 'form', 'table', 'theme', 'governance'],
    },
  },
};

export default meta;

type Story = StoryObj<ProblemAreaStoryComponent>;

export const Overview: Story = {
  args: {
    badge: 'Overview',
    title: 'Known problem areas',
    summary: 'A compact map of the behaviors that need evidence before they become shared design-system guidance.',
    primaryHeading: 'Risk map',
    primarySubheading: 'Where defects have shown up',
    primaryCopy: 'The recurring risks are blank PrimeNG hosts, overlay clipping, token drift, invalid ARIA emitted by component internals, and over-documenting Zeroheight.',
  },
};

export const ToastSeverityStates: Story = {
  args: {
    badge: 'Toast',
    title: 'Toast severity states',
    summary: 'Proves success, info, warning, and error feedback surfaces with shared PrimeNG tokens.',
    mode: 'toast',
    primaryHeading: 'Toast controls',
    primarySubheading: 'Trigger each severity',
    notes: ['All severity labels need readable contrast.', 'Toast content should not be the only evidence of an action.', 'Provider configuration must work in Storybook and /qa.'],
  },
};

export const ToastLongErrorCopy: Story = {
  args: {
    badge: 'Toast stress',
    title: 'Long error feedback',
    summary: 'Checks whether error toasts remain readable when audit or validation copy is longer than usual.',
    severity: 'warn',
    mode: 'toast',
    primaryHeading: 'Error-message stress',
    primarySubheading: 'Long feedback text',
    gate: 'Long error feedback must wrap without clipping and remain readable in light and dark modes.',
  },
};

export const DialogOverlayAppend: Story = {
  args: {
    badge: 'Overlay',
    title: 'Dialog append policy',
    summary: 'Validates the overlay behavior needed when remotes are mounted inside the shell.',
    mode: 'dialog',
    primaryHeading: 'Dialog trigger',
    primarySubheading: 'appendTo body and z-index',
    notes: ['Dialog opens above shell-like content.', 'Footer actions are keyboard reachable.', 'No clipping inside the remote container.'],
  },
};

export const SelectOverlayRisk: Story = {
  args: {
    badge: 'Select',
    title: 'Select overlay risk',
    summary: 'Tracks the known risk that select-like overlays can clip or lose token styling in composed routes.',
    mode: 'form',
    primaryHeading: 'Select field',
    primarySubheading: 'appendTo body validation',
    notes: ['Open the Select and check layering.', 'Confirm the panel inherits usable token colors.', 'Verify again inside /qa and the shell route.'],
  },
};

export const FormInvalidState: Story = {
  args: {
    badge: 'Forms',
    title: 'Invalid form state',
    summary: 'Documents the reintroduction path for InputText and Select before Citizen Services consumes them.',
    severity: 'warn',
    mode: 'form',
    invalidForm: true,
    formHelp: 'Applicant name is required before this intake can be submitted.',
    primaryHeading: 'Input and helper text',
    primarySubheading: 'Associated labels and invalid state',
    gate: 'InputText and Select should stay in backlog until /qa, direct remote, shell route, overlay, and accessibility checks pass.',
  },
};

export const TableEmptyEvidence: Story = {
  args: {
    badge: 'Table',
    title: 'Empty evidence state',
    summary: 'Checks how tables behave when no validation evidence has been recorded yet.',
    mode: 'table',
    emptyTable: true,
    primaryHeading: 'Evidence table',
    primarySubheading: 'Empty state',
    notes: ['Empty state must be explicit.', 'No blank PrimeNG host should be mistaken for empty data.', 'Route-critical fallback text should remain visible.'],
  },
};

export const LongLabelStress: Story = {
  args: {
    badge: 'Stress',
    title: 'Long labels and dense content',
    summary: 'Documents wrapping risk for public-sector labels, statuses, and action text.',
    severity: 'warn',
    primaryHeading: 'Dense copy',
    primarySubheading: 'No clipping or overlap',
    primaryCopy: 'Submit housing assistance eligibility review for North Region queue after identity verification documents are resubmitted.',
    notes: ['Long labels wrap instead of overflowing.', 'Text does not overlap controls.', 'Buttons keep recognizable icons and labels.'],
  },
};

export const TokenThemeEvidence: Story = {
  args: {
    badge: 'Tokens',
    title: 'Token and theme evidence',
    summary: 'Keeps the token proof path visible without turning Zeroheight into a runtime dependency.',
    mode: 'theme',
    primaryHeading: 'Token consumers',
    primarySubheading: 'Shell, subapp, PrimeNG, docs',
    primaryCopy: 'The same generated token artifacts should support shell CSS, subapp CSS, PrimeNG preset mapping, Storybook previews, and Zeroheight exports.',
  },
};

export const ShellMountedRisk: Story = {
  args: {
    badge: 'Shell',
    title: 'Shell-mounted remote risk',
    summary: 'Documents what must be checked after a story passes in isolation.',
    severity: 'warn',
    mode: 'dialog',
    primaryHeading: 'Mounted behavior',
    primarySubheading: 'Web Component route',
    notes: ['CSS variables should inherit into the mounted subapp.', 'Selector-based styles should not be assumed across Shadow DOM.', 'Overlays need explicit append and z-index policy.'],
  },
};

export const ZeroheightGovernance: Story = {
  args: {
    badge: 'Zeroheight',
    title: 'Zeroheight governance boundary',
    summary: 'Shows how Zeroheight should point to evidence rather than becoming a second implementation surface.',
    mode: 'governance',
    primaryHeading: 'Documentation role',
    primarySubheading: 'Guidance, status, and links',
    primaryCopy: 'Zeroheight should document usage, lifecycle status, governance, and links to Storybook evidence. Runtime URLs and token loading remain owned by the platform configuration.',
    gate: 'Keep Zeroheight small: guidance, governed status, token reference, and evidence links only.',
  },
};
