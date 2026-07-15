import { Component, signal, ViewEncapsulation } from '@angular/core';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { QaRemoteComponent } from '../../remote/qa-remote.component';
import { CandidatesViewComponent } from './candidates/candidates-view.component';
import { PerformanceDashboardComponent } from './performance-dashboard.component';

export type QaWorkspaceView = 'qa' | 'performance' | 'candidates';

@Component({
  selector: 'public-qa-workspace',
  standalone: true,
  imports: [
    PublicButtonComponent,
    QaRemoteComponent,
    PerformanceDashboardComponent,
    CandidatesViewComponent,
  ],
  templateUrl: './qa-workspace.component.html',
  styleUrl: './qa-workspace.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class QaWorkspaceComponent {
  readonly activeView = signal<QaWorkspaceView>('qa');

  setActiveView(view: QaWorkspaceView): void {
    this.activeView.set(view);
  }
}
