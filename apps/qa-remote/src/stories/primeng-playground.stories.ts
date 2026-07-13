import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionModule } from 'primeng/accordion';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface PlaygroundRow {
  component: string;
  family: string;
  status: 'Proven' | 'Active' | 'Watch';
}

@Component({
  selector: 'public-primeng-playground-story',
  standalone: true,
  imports: [
    AccordionModule,
    PublicButtonComponent,
    CardModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TableModule,
    TagModule,
    ToastModule,
    ToggleSwitchModule,
  ],
  template: `
    <main class="storybook-shell">
      <header>
        <p-tag value="Storybook Lab" severity="contrast" />
        <h1>PrimeNG federation playground</h1>
        <p>
          Use this story to test component families, states, and theme behavior before
          moving patterns into a federated remote.
        </p>
      </header>

      <div class="story-grid">
        <p-card header="Actions and feedback" subheader="Buttons, tags, toast, and dialog">
          <div class="story-stack">
            <div class="inline-row">
              <ps-button label="Primary action" icon="pi pi-check" />
              <ps-button label="Outlined action" icon="pi pi-download" [outlined]="true" />
              <p-tag value="On track" severity="success" />
              <p-tag value="Watch" severity="warn" />
            </div>
            <div class="inline-row">
              <ps-button label="Show toast" icon="pi pi-bell" tone="secondary" (buttonClick)="showToast()" />
              <ps-button label="Open dialog" icon="pi pi-window-maximize" [outlined]="true" (buttonClick)="dialogVisible = true" />
            </div>
          </div>
        </p-card>

        <p-card header="Forms" subheader="PrimeNG form controls under token styling">
          <div class="form-grid">
            <label>
              Applicant name
              <input id="storybook-applicant-name" pInputText [(ngModel)]="applicantName" />
            </label>
            <label for="storybook-program">Program</label>
              <p-select
                inputId="storybook-program"
                [(ngModel)]="selectedProgram"
                [options]="programs"
                appendTo="body"
                ariaLabel="Program"
              />
            <label for="storybook-temporary-password">Temporary password</label>
              <p-password
                inputId="storybook-temporary-password"
                [(ngModel)]="temporaryPassword"
                [feedback]="false"
                toggleMask
                ariaLabel="Temporary password"
              />
            <label class="toggle-row">
              <span>Expedite review</span>
              <p-toggleswitch inputId="storybook-expedite-review" [(ngModel)]="expedited" ariaLabel="Expedite review" />
            </label>
          </div>
        </p-card>
      </div>

      <p-card header="Data display" subheader="Table, sort readiness, status tags, and progress">
        <div class="story-stack">
          <progress value="82" max="100" aria-label="Storybook PrimeNG coverage progress"></progress>
          <p-table [value]="rows" styleClass="p-datatable-gridlines">
            <ng-template pTemplate="header">
              <tr>
                <th>Component</th>
                <th>Family</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td>{{ row.component }}</td>
                <td>{{ row.family }}</td>
                <td><p-tag [value]="row.status" [severity]="severity(row.status)" /></td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <p-card header="Disclosure" subheader="Accordion support content">
        <p-accordion value="0">
          <p-accordion-panel value="0">
            <p-accordion-header>Promotion rule</p-accordion-header>
            <p-accordion-content>
              <p>Promote to a shared wrapper only after direct remote and shell-composed checks pass.</p>
            </p-accordion-content>
          </p-accordion-panel>
          <p-accordion-panel value="1">
            <p-accordion-header>Federation risk</p-accordion-header>
            <p-accordion-content>
              <p>Projection-heavy components should not be the only route-critical content until proven.</p>
            </p-accordion-content>
          </p-accordion-panel>
        </p-accordion>
      </p-card>

      <p-toast />
      <p-dialog
        header="Dialog smoke test"
        [(visible)]="dialogVisible"
        [modal]="true"
        appendTo="body"
        [baseZIndex]="2000"
        [draggable]="false"
        [resizable]="false"
        [style]="{ width: '32rem' }"
      >
        <p>This dialog validates overlay rendering in the Storybook runtime.</p>
        <ng-template pTemplate="footer">
          <ps-button label="Close" [outlined]="true" (buttonClick)="dialogVisible = false" />
        </ng-template>
      </p-dialog>
    </main>
  `,
  styles: `
    .storybook-shell {
      display: grid;
      gap: 1rem;
      max-width: 72rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header {
      padding: 1.5rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
    }

    h1 {
      margin: 0.75rem 0 0.25rem;
      font-size: clamp(1.75rem, 4vw, 3rem);
      letter-spacing: 0;
    }

    p {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .story-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .story-stack,
    .form-grid {
      display: grid;
      gap: 1rem;
    }

    .inline-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    label {
      display: grid;
      gap: 0.4rem;
      color: var(--p-text-color);
      font-weight: 800;
    }

    progress {
      width: 100%;
      height: 0.75rem;
      accent-color: var(--ps-button-background);
    }

    .toggle-row {
      grid-template-columns: 1fr auto;
      align-items: center;
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PrimeNgPlaygroundStoryComponent {
  private readonly messageService = inject(MessageService);

  dialogVisible = false;
  expedited = true;
  applicantName = 'Jordan Avery';
  selectedProgram = 'Housing assistance';
  temporaryPassword = 'Temporary-2026';

  readonly programs = ['Housing assistance', 'Benefits renewal', 'Permit review'];

  readonly rows: PlaygroundRow[] = [
    { component: 'Button and Tag', family: 'Actions', status: 'Active' },
    { component: 'Table and Paginator', family: 'Data Display', status: 'Proven' },
    { component: 'Dialog and Toast', family: 'Overlays', status: 'Watch' },
  ];

  severity(status: PlaygroundRow['status']): 'success' | 'contrast' | 'warn' {
    return status === 'Proven' ? 'success' : status === 'Active' ? 'contrast' : 'warn';
  }

  showToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Storybook feedback',
      detail: 'Toast tokens are applied in the PrimeNG playground.',
      life: 3500,
    });
  }
}

const meta: Meta<PrimeNgPlaygroundStoryComponent> = {
  title: 'Design System/PrimeNG Playground',
  render: () => ({
    moduleMetadata: {
      imports: [PrimeNgPlaygroundStoryComponent],
    },
    template: '<public-primeng-playground-story />',
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
};

export default meta;

type Story = StoryObj<PrimeNgPlaygroundStoryComponent>;

export const ComponentFamilies: Story = {};

