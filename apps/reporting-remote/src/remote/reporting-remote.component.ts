import { AfterViewInit, Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';

interface ReportRow {
  program: string;
  cases: number;
  status: 'On track' | 'Watch' | 'Delayed';
  owner: string;
  region: string;
  sla: number;
}

@Component({
  selector: 'public-reporting-remote',
  standalone: true,
  imports: [AccordionModule, ButtonModule, CardModule, ProgressBarModule, TableModule, TabsModule, TagModule],
  templateUrl: './reporting-remote.component.html',
  styleUrl: './reporting-remote.component.css',
})
export class ReportingRemoteComponent implements AfterViewInit {
  readonly rows: ReportRow[] = [
    { program: 'Housing assistance', cases: 428, status: 'On track', owner: 'Avery Clark', region: 'North Region', sla: 96 },
    { program: 'Small business grants', cases: 183, status: 'Watch', owner: 'Morgan Lee', region: 'Central Region', sla: 87 },
    { program: 'Permit inspections', cases: 72, status: 'Delayed', owner: 'Riley Chen', region: 'South Region', sla: 68 },
    { program: 'Benefits renewal', cases: 316, status: 'On track', owner: 'Jordan Avery', region: 'North Region', sla: 94 },
    { program: 'Document intake', cases: 241, status: 'Watch', owner: 'Taylor Brooks', region: 'Central Region', sla: 82 },
    { program: 'Transit assistance', cases: 137, status: 'On track', owner: 'Casey Morgan', region: 'East Region', sla: 91 },
    { program: 'Child care subsidy', cases: 205, status: 'Delayed', owner: 'Jamie Patel', region: 'West Region', sla: 73 },
    { program: 'Emergency housing', cases: 94, status: 'Watch', owner: 'Skyler Reed', region: 'South Region', sla: 79 },
    { program: 'License review', cases: 158, status: 'On track', owner: 'Parker Nguyen', region: 'East Region', sla: 93 },
    { program: 'Food assistance', cases: 376, status: 'On track', owner: 'Quinn Davis', region: 'West Region', sla: 95 },
    { program: 'Veteran services', cases: 121, status: 'Watch', owner: 'Harper Stone', region: 'Central Region', sla: 84 },
    { program: 'Public records', cases: 67, status: 'Delayed', owner: 'Rowan Mills', region: 'North Region', sla: 70 },
  ];
  readonly metrics = [
    { label: 'Case completion', value: 82 },
    { label: 'Digital adoption', value: 71 },
    { label: 'Document accuracy', value: 93 },
  ];

  severity(status: ReportRow['status']): 'success' | 'warn' | 'danger' {
    return status === 'On track' ? 'success' : status === 'Watch' ? 'warn' : 'danger';
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      document.querySelectorAll('public-reporting-root p-progressbar').forEach((element) => {
        element.removeAttribute('aria-level');
      });
    });
  }
}
