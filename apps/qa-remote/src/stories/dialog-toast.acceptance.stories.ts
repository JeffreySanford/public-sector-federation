import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent, PublicToastService } from '@public-sector/ui-patterns';

@Component({
  selector: 'public-dialog-toast-acceptance-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent],
  template: `
    <ps-toast />
    <main class="storybook-shell">
      <header><ps-tag value="Acceptance: Dialog / Toast" tone="info" /><h1>Dialog and toast</h1></header>
      <section class="grid">
        <ps-card header="Dialog overlay" subheader="Native trigger plus shared modal"><ps-button label="Open dialog" icon="pi pi-window-maximize" (buttonClick)="visible = true" /></ps-card>
        <ps-card header="Toast feedback" subheader="Severity and message surface"><ps-button label="Success toast" icon="pi pi-check" (buttonClick)="show('success')" /><ps-button label="Warning toast" icon="pi pi-exclamation-triangle" [outlined]="true" (buttonClick)="show('warn')" /></ps-card>
      </section>
      <ps-dialog header="Dialog smoke test" [(visible)]="visible"><p>This dialog validates overlay rendering.</p><div ps-dialog-footer><ps-button label="Close" [outlined]="true" (buttonClick)="visible = false" /></div></ps-dialog>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}`,
})
class DialogToastAcceptanceStoryComponent {
  private readonly toast = inject(PublicToastService);
  visible = false;
  show(severity: 'success' | 'warn'): void { this.toast.add({ severity, summary: 'Storybook feedback', detail: 'Toast tokens are applied.' }); }
}

@Component({
  selector: 'public-dialog-toast-stress-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent],
  template: `
    <ps-toast />
    <main class="storybook-shell">
      <header><ps-tag value="Stress: Dialog / Toast" tone="warn" /><h1>Long content and error states</h1></header>
      <ps-button label="Show long error toast" icon="pi pi-times-circle" (buttonClick)="showError()" />
      <ps-button label="Open long dialog" icon="pi pi-window-maximize" [outlined]="true" (buttonClick)="visible = true" />
      <ps-dialog header="Long dialog content" [(visible)]="visible"><p>This dialog includes longer content to check wrapping and footer spacing in constrained viewports.</p><div ps-dialog-footer><ps-button label="Close" (buttonClick)="visible = false" /></div></ps-dialog>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}`,
})
class DialogToastStressStoryComponent {
  private readonly toast = inject(PublicToastService);
  visible = false;
  showError(): void { this.toast.add({ severity: 'danger', summary: 'Unable to complete validation', detail: 'Long error copy wraps without clipping.' }); }
}

const meta: Meta<DialogToastAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Dialog Toast',
  component: DialogToastAcceptanceStoryComponent,
  render: () => ({ moduleMetadata: { imports: [DialogToastAcceptanceStoryComponent] }, template: '<public-dialog-toast-acceptance-story />' }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<DialogToastAcceptanceStoryComponent>;
export const OverlayAndFeedback: Story = {};
export const LongContentAndError: StoryObj<DialogToastStressStoryComponent> = {
  render: () => ({ moduleMetadata: { imports: [DialogToastStressStoryComponent] }, template: '<public-dialog-toast-stress-story />' }),
};
