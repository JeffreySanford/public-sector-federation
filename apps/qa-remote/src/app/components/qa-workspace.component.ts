import { Component, signal, ViewEncapsulation } from '@angular/core';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { ComponentInventoryViewComponent } from './workbench/component-inventory-view.component';
import { DesignAlignmentLabComponent } from './workbench/design-alignment-lab.component';
import { QualityRemediationViewComponent } from './workbench/quality-remediation-view.component';

export type QaWorkspaceView = 'inventory' | 'quality' | 'alignment';

@Component({
  selector: 'public-qa-workspace',
  standalone: true,
  imports: [
    PublicButtonComponent,
    ComponentInventoryViewComponent,
    QualityRemediationViewComponent,
    DesignAlignmentLabComponent,
  ],
  templateUrl: './qa-workspace.component.html',
  styleUrl: './qa-workspace.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class QaWorkspaceComponent {
  readonly activeView = signal<QaWorkspaceView>('inventory');

  setActiveView(view: QaWorkspaceView): void {
    this.activeView.set(view);
  }
}
