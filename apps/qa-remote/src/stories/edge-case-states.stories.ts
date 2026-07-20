import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent, PublicToastService } from '@public-sector/ui-patterns';

type Tone = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'public-edge-case-state-story',
  standalone: true,
  imports: [FormsModule, PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent],
  template: `
    <ps-toast />
    <main class="storybook-shell">
      <header><ps-tag [value]="badge()" [tone]="tone()" /><h1>{{ title() }}</h1><p>{{ description() }}</p></header>
      <section class="story-grid">
        <ps-card [header]="primaryHeading()" [subheader]="primarySubheading()">
          <div class="form-grid">
            <label>Applicant name<input [(ngModel)]="applicantName" [class.invalid]="invalid()" /></label>
            <label>Program<select [(ngModel)]="program"><option>Housing assistance</option><option>Benefits renewal</option><option>Permit review</option></select></label>
          </div>
          <table><thead><tr><th>Program</th><th>Status</th></tr></thead><tbody>@for (row of tableRows; track row.program) { <tr><td>{{ row.program }}</td><td><ps-tag [value]="row.status" [tone]="row.tone" /></td></tr> } @empty { <tr><td colspan="2">No rows available.</td></tr> }</tbody></table>
          <div class="inline-row"><ps-button label="Show toast" icon="pi pi-bell" (buttonClick)="showToast()" /><ps-button label="Open dialog" icon="pi pi-window-maximize" [outlined]="true" (buttonClick)="dialogVisible = true" /></div>
        </ps-card>
        <ps-card header="Coverage notes" subheader="What this story covers"><p>{{ notes() }}</p><div class="inline-row"><ps-tag [value]="qaStatus()" [tone]="qaStatusTone()" /><ps-tag value="Storybook evidence" tone="contrast" /><ps-tag value="/qa checkpoint" tone="success" /><ps-tag value="Shell route" tone="warn" /></div></ps-card>
      </section>
      <ps-dialog [header]="dialogHeading()" [(visible)]="dialogVisible"><p>{{ dialogBody() }}</p><div ps-dialog-footer><ps-button label="Close" (buttonClick)="dialogVisible = false" /></div></ps-dialog>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.story-grid{display:grid;grid-template-columns:2fr 1fr;gap:1rem}.form-grid{display:grid;gap:1rem}label{display:grid;gap:.4rem;font-weight:800}input,select{min-height:2.5rem;padding:.6rem .75rem;border:1px solid var(--p-content-border-color);border-radius:.5rem;background:var(--p-content-background);color:var(--p-text-color)}input.invalid{border-color:var(--p-red-500,#ef4444)}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}.inline-row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}`,
})
class EdgeCaseStateStoryComponent {
  private readonly toast = inject(PublicToastService);
  readonly title = input('Edge case state coverage');
  readonly description = input('Focused coverage for overlay behavior, wrapper boundaries, native gaps, and shell mounting.');
  readonly badge = input('Evidence');
  readonly tone = input<Tone>('info');
  readonly qaStatus = input<'Passes Storybook QA' | 'Does not pass Storybook QA'>('Passes Storybook QA');
  readonly primaryHeading = input('Runtime surface');
  readonly primarySubheading = input('Wrapper and native control behavior');
  readonly notes = input('This story captures behavior that should stay stable across themes and shell mounting.');
  readonly dialogHeading = input('Dialog evidence');
  readonly dialogBody = input('Overlay content remains readable and dismissible.');
  readonly invalid = input(false);
  dialogVisible = false;
  applicantName = 'Jordan Avery';
  program = 'Housing assistance';
  readonly tableRows = [
    { program: 'Housing assistance', status: 'On track', tone: 'success' as Tone },
    { program: 'Permit review', status: 'Watch', tone: 'warn' as Tone },
  ];
  showToast(): void { this.toast.add({ severity: this.tone(), summary: this.badge(), detail: this.description() }); }

  qaStatusTone(): Tone {
    return this.qaStatus() === 'Passes Storybook QA' ? 'success' : 'danger';
  }
}

const meta: Meta<EdgeCaseStateStoryComponent> = {
  title: 'Design System/Acceptance/Edge Case States',
  component: EdgeCaseStateStoryComponent,
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [EdgeCaseStateStoryComponent] },
    template: `
      <public-edge-case-state-story
        [title]="title"
        [description]="description"
        [badge]="badge"
        [tone]="tone"
        [qaStatus]="qaStatus"
        [primaryHeading]="primaryHeading"
        [primarySubheading]="primarySubheading"
        [notes]="notes"
        [dialogHeading]="dialogHeading"
        [dialogBody]="dialogBody"
        [invalid]="invalid"
      />
    `,
  }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<EdgeCaseStateStoryComponent>;
export const Overview: Story = { args: { title: 'Overlay and Shadow DOM overview', badge: 'Overview', tone: 'info' } };
export const ToastSeverityStates: Story = { args: { title: 'Toast severity states', badge: 'Toast states', tone: 'success' } };
export const ToastLongErrorCopy: Story = { args: { title: 'Toast long error copy', badge: 'Long error', tone: 'danger', description: 'Long error copy wraps without clipping or obscuring controls.' } };
export const DialogOverlayAppend: Story = { args: { title: 'Dialog overlay append', badge: 'Dialog', tone: 'info', dialogHeading: 'Overlay append evidence' } };
export const SelectOverlayRisk: Story = { args: { title: 'Select overlay risk', badge: 'Select', tone: 'warn', primaryHeading: 'Native select fallback' } };
export const FormInvalidState: Story = { args: { title: 'Form invalid state', badge: 'Invalid form', tone: 'danger', invalid: true } };
export const TableEmptyEvidence: Story = { args: { title: 'Table empty evidence', badge: 'Table', tone: 'info' } };
export const LongLabelStress: Story = { args: { title: 'Long label stress', badge: 'Long labels', tone: 'warn', description: 'Long labels and dense text should wrap cleanly.' } };
export const TokenThemeEvidence: Story = { args: { title: 'Token theme evidence', badge: 'Theme', tone: 'contrast' } };
export const ShellMountedRisk: Story = { args: { title: 'Shell mounted risk', badge: 'Shell route', tone: 'warn' } };
export const ExternalDocsGovernance: Story = { args: { title: 'External docs governance', badge: 'Governance', tone: 'success' } };
export const KnownQaFailure: Story = {
  args: {
    title: 'Blocked state example',
    badge: 'Blocked component',
    tone: 'danger',
    qaStatus: 'Does not pass Storybook QA',
    primaryHeading: 'Acceptance blocked',
    primarySubheading: 'This component is intentionally held back from passing acceptance stories',
    description: 'This example represents a component with unresolved Storybook QA issues and should remain outside the passing acceptance lane.',
    notes: 'Fails Storybook QA until accessibility, state coverage, and runtime checks are corrected. Keep this story in the edge-case lane only.',
    dialogHeading: 'Blocked state example',
    dialogBody: 'Do not promote this component into /qa or shell acceptance until the Storybook QA issues are fixed.',
    invalid: true,
  },
};
