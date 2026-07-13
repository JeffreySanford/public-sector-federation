import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent, PublicToastService } from '@public-sector/ui-patterns';

interface PlaygroundRow { component: string; family: string; status: 'Proven' | 'Active' | 'Watch' }

@Component({
  selector: 'public-primeng-playground-story',
  standalone: true,
  imports: [FormsModule, PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent],
  template: `
    <ps-toast />
    <main class="storybook-shell">
      <header><ps-tag value="Storybook Lab" tone="contrast" /><h1>Shared wrapper playground</h1><p>Use this story to test component families, states, and theme behavior before moving patterns into a federated remote.</p></header>
      <div class="story-grid">
        <ps-card header="Actions and feedback" subheader="Buttons, tags, toast, and dialog"><div class="inline-row"><ps-button label="Primary action" icon="pi pi-check" /><ps-button label="Show toast" icon="pi pi-bell" tone="secondary" (buttonClick)="showToast()" /><ps-button label="Open dialog" icon="pi pi-window-maximize" [outlined]="true" (buttonClick)="dialogVisible = true" /><ps-tag value="On track" tone="success" /><ps-tag value="Watch" tone="warn" /></div></ps-card>
        <ps-card header="Forms" subheader="Native form controls under token styling"><div class="form-grid"><label>Applicant name<input id="storybook-applicant-name" [(ngModel)]="applicantName" /></label><label>Program<select [(ngModel)]="selectedProgram">@for (program of programs; track program) { <option [value]="program">{{ program }}</option> }</select></label><label>Temporary password<input type="password" [(ngModel)]="temporaryPassword" /></label><label class="toggle-row"><span>Expedite review</span><input type="checkbox" role="switch" [(ngModel)]="expedited" /></label></div></ps-card>
      </div>
      <ps-card header="Data display" subheader="Table, status tags, and progress"><progress value="82" max="100" aria-label="Storybook coverage progress"></progress><table><thead><tr><th>Component</th><th>Family</th><th>Status</th></tr></thead><tbody>@for (row of rows; track row.component) { <tr><td>{{ row.component }}</td><td>{{ row.family }}</td><td><ps-tag [value]="row.status" [tone]="severity(row.status)" /></td></tr> }</tbody></table></ps-card>
      <ps-card header="Disclosure" subheader="Details support content"><details open><summary>Promotion rule</summary><p>Promote to a shared wrapper only after direct remote and shell-composed checks pass.</p></details><details><summary>Federation risk</summary><p>Projection-heavy components should not be the only route-critical content until proven.</p></details></ps-card>
      <ps-dialog header="Dialog smoke test" [(visible)]="dialogVisible"><p>This dialog validates overlay rendering in the Storybook runtime.</p><div ps-dialog-footer><ps-button label="Close" [outlined]="true" (buttonClick)="dialogVisible = false" /></div></ps-dialog>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.story-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.inline-row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}.form-grid{display:grid;gap:1rem}label{display:grid;gap:.4rem;font-weight:800}input,select{min-height:2.5rem;padding:.6rem .75rem;border:1px solid var(--p-content-border-color);border-radius:.5rem;background:var(--p-content-background);color:var(--p-text-color)}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;border-bottom:1px solid var(--p-content-border-color);text-align:left}progress{width:100%}`,
})
export class PrimeNgPlaygroundStoryComponent {
  private readonly toast = inject(PublicToastService);
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
  severity(status: PlaygroundRow['status']): 'success' | 'contrast' | 'warn' { return status === 'Proven' ? 'success' : status === 'Active' ? 'contrast' : 'warn'; }
  showToast(): void { this.toast.add({ severity: 'success', summary: 'Storybook feedback', detail: 'Toast tokens are applied in the wrapper playground.' }); }
}

const meta: Meta<PrimeNgPlaygroundStoryComponent> = {
  title: 'Design System/PrimeNG Playground',
  render: () => ({ moduleMetadata: { imports: [PrimeNgPlaygroundStoryComponent] }, template: '<public-primeng-playground-story />' }),
  parameters: { layout: 'fullscreen', docs: { source: { type: 'dynamic' } } },
};

export default meta;
type Story = StoryObj<PrimeNgPlaygroundStoryComponent>;
export const ComponentFamilies: Story = {};
