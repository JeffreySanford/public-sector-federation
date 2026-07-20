import { Component, input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  PublicButtonComponent,
  PublicDialogComponent,
} from '@public-sector/ui-patterns';

@Component({
  selector: 'dialog-story-proof',
  standalone: true,
  imports: [PublicButtonComponent, PublicDialogComponent],
  template: `
    <main class="dialog-proof" aria-labelledby="dialogStoryTitle">
      <h1 id="dialogStoryTitle">{{ pageTitle() }}</h1>
      <p>{{ introduction() }}</p>
      <ps-button
        [label]="triggerLabel()"
        [intent]="destructive() ? 'destructive' : 'primary'"
        (activated)="visible = true"
      />
      <output aria-live="polite">{{ status }}</output>

      <ps-dialog
        [header]="dialogHeader()"
        [description]="dialogDescription()"
        [width]="dialogWidth()"
        [(visible)]="visible"
      >
        <label>
          <span>Reviewer note</span>
          <textarea rows="3" placeholder="Add an optional note"></textarea>
        </label>

        @if (longContent()) {
          <section class="long-content" aria-labelledby="dialogDetailsTitle">
            <h3 id="dialogDetailsTitle">Application details</h3>
            @for (paragraph of detailParagraphs; track paragraph) {
              <p>{{ paragraph }}</p>
            }
          </section>
        }

        <div ps-dialog-footer>
          <ps-button
            label="Cancel"
            appearance="outlined"
            (activated)="visible = false"
          />
          <ps-button
            [label]="confirmLabel()"
            [intent]="destructive() ? 'destructive' : 'primary'"
            (activated)="confirm()"
          />
        </div>
      </ps-dialog>
    </main>
  `,
  styles: `
    .dialog-proof {
      display: grid;
      justify-items: start;
      gap: 1rem;
      width: min(100%, 44rem);
      padding: 1.5rem;
      color: var(--p-text-color);
    }

    .dialog-proof h1,
    .dialog-proof h3,
    .dialog-proof p,
    .dialog-proof output {
      margin: 0;
    }

    .dialog-proof > p,
    .dialog-proof output {
      color: var(--p-text-muted-color);
      line-height: 1.6;
    }

    label {
      display: grid;
      gap: 0.4rem;
      color: var(--p-text-color);
      font-weight: 700;
    }

    textarea {
      width: 100%;
      min-width: min(100%, 22rem);
      padding: 0.65rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 0.45rem;
      background: var(--p-content-background);
      color: var(--p-text-color);
      font: inherit;
      resize: vertical;
    }

    textarea:focus-visible {
      outline: 0.2rem solid var(--ps-focus-ring-color, var(--p-primary-color));
      outline-offset: 0.15rem;
    }

    .long-content {
      display: grid;
      gap: 0.75rem;
    }

    .long-content p {
      color: var(--p-text-muted-color);
      line-height: 1.6;
    }
  `,
})
class DialogStoryProof {
  readonly pageTitle = input('Dialog interaction proof');
  readonly introduction = input('Open the dialog to review its modal focus and dismissal behavior.');
  readonly triggerLabel = input('Review application');
  readonly dialogHeader = input('Review application');
  readonly dialogDescription = input(
    'Review the application details before recording a decision. Closing the dialog leaves the application unchanged.',
  );
  readonly confirmLabel = input('Approve application');
  readonly destructive = input(false);
  readonly longContent = input(false);
  readonly dialogWidth = input('36rem');

  visible = false;
  status = 'No decision recorded.';

  readonly detailParagraphs = [
    'The applicant supplied identity, household, and residency information for eligibility review.',
    'Supporting documents were received through the governed upload workflow and remain available to the assigned reviewer.',
    'The decision must be recorded with enough context for a later audit without placing sensitive details in free-form notes.',
    'Long content remains inside the modal scrolling region so the page behind the dialog does not become the active reading surface.',
  ];

  confirm(): void {
    this.status = this.destructive()
      ? 'Draft deleted.'
      : 'Application approved.';
    this.visible = false;
  }
}

const meta: Meta<DialogStoryProof> = {
  title: 'Design System/Components/Dialog',
  component: DialogStoryProof,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Stable native Dialog wrapper with controlled visibility, labelled modal semantics, predictable initial focus, focus containment, Escape dismissal, and focus restoration.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<DialogStoryProof>;

export const Default: Story = {};

export const DestructiveConfirmation: Story = {
  args: {
    pageTitle: 'Destructive Dialog confirmation',
    introduction: 'The destructive action remains visually and semantically distinct from the safer Cancel action.',
    triggerLabel: 'Delete draft',
    dialogHeader: 'Delete draft application?',
    dialogDescription: 'Deleting this draft removes the saved application and cannot be undone.',
    confirmLabel: 'Delete draft',
    destructive: true,
  },
};

export const LongContent: Story = {
  args: {
    pageTitle: 'Long Dialog content',
    introduction: 'The dialog constrains and scrolls long content without causing document-level horizontal overflow.',
    triggerLabel: 'Review full application',
    dialogHeader: 'Full application review',
    confirmLabel: 'Complete review',
    longContent: true,
    dialogWidth: '44rem',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const FocusSequence: Story = {
  args: {
    pageTitle: 'Dialog focus sequence',
    introduction: 'The close button, reviewer note, Cancel, and confirmation action form the complete modal tab sequence.',
    triggerLabel: 'Inspect focus sequence',
    dialogHeader: 'Dialog focus sequence',
    confirmLabel: 'Save review',
  },
};
