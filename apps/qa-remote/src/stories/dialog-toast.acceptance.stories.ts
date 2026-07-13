import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'public-dialog-toast-acceptance-story',
  standalone: true,
  imports: [PublicButtonComponent, CardModule, DialogModule, TagModule, ToastModule],
  template: `
    <p-toast />
    <section class="acceptance-story">
      <header>
        <p-tag value="Acceptance: Dialog / Toast" severity="info" />
        <h1>Dialog and toast acceptance states</h1>
        <p>Proves overlay append policy, z-index, modal behavior, toast severity styling, and native trigger stability.</p>
      </header>

      <div class="story-grid">
        <p-card header="Dialog overlay" subheader="Native trigger plus PrimeNG modal">
          <p>
            Open the dialog from a stable trigger. The overlay should append to body,
            stack above shell-like content, and keep readable contrast.
          </p>
          <button type="button" class="story-button" (click)="dialogVisible = true">
            <i class="pi pi-window-maximize" aria-hidden="true"></i>
            <span>Open dialog</span>
          </button>
        </p-card>

        <p-card header="Toast feedback" subheader="Severity and message surface">
          <p>
            Toasts should use the shared PrimeNG provider and tokenized message
            surfaces for success, info, warning, and error feedback.
          </p>
          <div class="inline-row">
            <ps-button label="Success" icon="pi pi-check" (buttonClick)="showToast('success')" />
            <ps-button label="Info" icon="pi pi-info-circle" [outlined]="true" (buttonClick)="showToast('info')" />
            <ps-button label="Warn" icon="pi pi-exclamation-triangle" [outlined]="true" (buttonClick)="showToast('warn')" />
            <ps-button label="Error" icon="pi pi-times-circle" [outlined]="true" (buttonClick)="showToast('error')" />
          </div>
        </p-card>
      </div>

      <article>
        <h2>Acceptance checks</h2>
        <ul>
          <li>Dialog opens as an overlay, not inline route content.</li>
          <li>Overlay uses <code>appendTo="body"</code> and a predictable base z-index.</li>
          <li>Toast severity variants are visually styled and readable.</li>
          <li>Close and confirm actions are keyboard reachable.</li>
        </ul>
      </article>

      <p-dialog
        header="Remote-ready dialog"
        [(visible)]="dialogVisible"
        [modal]="true"
        appendTo="body"
        [baseZIndex]="2000"
        [draggable]="false"
        [resizable]="false"
        [style]="{ width: '32rem' }"
      >
        <p>
          This overlay uses the same policy needed by federated remotes: append to body,
          no draggable/resizable behavior, and clear footer actions.
        </p>
        <ng-template pTemplate="footer">
          <ps-button label="Close" [text]="true" (buttonClick)="dialogVisible = false" />
          <ps-button label="Confirm" icon="pi pi-check" (buttonClick)="confirmDialog()" />
        </ng-template>
      </p-dialog>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 72rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 7%, transparent);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p,
    li {
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

    code {
      color: var(--p-text-color);
      font-weight: 800;
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
class DialogToastAcceptanceStoryComponent {
  private readonly messageService = inject(MessageService);

  dialogVisible = false;

  showToast(severity: 'success' | 'info' | 'warn' | 'error'): void {
    this.messageService.add({
      severity,
      summary: `${severity[0].toUpperCase()}${severity.slice(1)} feedback`,
      detail: 'Toast severity styling is driven by shared public-sector tokens.',
      life: 3500,
    });
  }

  confirmDialog(): void {
    this.dialogVisible = false;
    this.showToast('success');
  }
}

const meta: Meta<DialogToastAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Dialog and Toast',
  component: DialogToastAcceptanceStoryComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<DialogToastAcceptanceStoryComponent>;

export const OverlayAndFeedback: Story = {};

@Component({
  selector: 'public-dialog-toast-stress-story',
  standalone: true,
  imports: [PublicButtonComponent, DialogModule, TagModule, ToastModule],
  template: `
    <p-toast />
    <section class="acceptance-story">
      <header>
        <p-tag value="Stress: Dialog / Toast" severity="warn" />
        <h1>Long dialog copy and error feedback</h1>
        <p>Checks scrollable modal content and error toast readability.</p>
      </header>

      <div class="inline-row">
        <button type="button" class="story-button" (click)="dialogVisible = true">
          <span>Open long-content dialog</span>
        </button>
        <ps-button label="Error toast" icon="pi pi-times-circle" (buttonClick)="showToast('error')" />
      </div>

      <p-dialog
        header="Extended review dialog with long supporting copy"
        [(visible)]="dialogVisible"
        [modal]="true"
        appendTo="body"
        [baseZIndex]="2000"
        [draggable]="false"
        [resizable]="false"
        [style]="{ width: '36rem' }"
      >
        <p>
          This dialog includes multiple paragraphs to verify scroll behavior, footer
          placement, and readable contrast when route-critical guidance exceeds a short
          confirmation message.
        </p>
        <p>
          Federated remotes should keep stable native triggers and append overlays to
          body so shell navigation and remote content do not clip modal surfaces.
        </p>
        <ng-template pTemplate="footer">
          <ps-button label="Close" [text]="true" (buttonClick)="dialogVisible = false" />
        </ng-template>
      </p-dialog>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 72rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
    }

    h1 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .inline-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    .story-button {
      display: inline-flex;
      align-items: center;
      padding: 0.65rem 0.9rem;
      border: 1px solid var(--ps-button-background);
      border-radius: var(--p-border-radius-md);
      background: var(--ps-button-background);
      color: var(--ps-button-text);
      cursor: pointer;
      font: inherit;
      font-weight: 800;
    }
  `,
})
class DialogToastStressStoryComponent {
  private readonly messageService = inject(MessageService);

  dialogVisible = false;

  showToast(severity: 'success' | 'info' | 'warn' | 'error'): void {
    this.messageService.add({
      severity,
      summary: 'Submission failed',
      detail: 'The eligibility review could not be saved because required audit metadata was missing from the request payload.',
      life: 5000,
    });
  }
}

export const LongContentAndError: StoryObj<DialogToastStressStoryComponent> = {
  render: () => ({
    template: '<public-dialog-toast-stress-story />',
    moduleMetadata: {
      imports: [DialogToastStressStoryComponent],
    },
  }),
};

