import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PublicButtonComponent,
  PublicCardComponent,
  PublicCheckboxComponent,
  PublicInputComponent,
  PublicProgressComponent,
  PublicSelectComponent,
  PublicTableColumn,
  PublicTableComponent,
  PublicTagComponent,
} from '@public-sector/ui-patterns';

@Component({
  selector: 'public-services-remote',
  standalone: true,
  imports: [
    FormsModule,
    PublicButtonComponent,
    PublicCardComponent,
    PublicCheckboxComponent,
    PublicInputComponent,
    PublicProgressComponent,
    PublicSelectComponent,
    PublicTableComponent,
    PublicTagComponent,
  ],
  templateUrl: './services-remote.component.html',
  styleUrl: './services-remote.component.css',
})
export class ServicesRemoteComponent {
  caseId = 'PS-2026-1042';
  applicantName = 'Jordan Avery';
  expediteReview = false;
  documentsVerified = true;
  residencyConfirmed = true;
  incomeReviewed = false;

  readonly serviceTypes = [
    { label: 'Benefits renewal', value: 'benefits-renewal' },
    { label: 'Permit request', value: 'permit-request' },
    { label: 'Document upload', value: 'document-upload' },
    { label: 'Housing assistance', value: 'housing-assistance' },
  ];

  selectedService = this.serviceTypes[0].value;
  appointmentDate = '2026-07-09';

  readonly caseQueueColumns: PublicTableColumn[] = [
    { key: 'case', header: 'Case', sortable: true },
    { key: 'applicant', header: 'Applicant', sortable: true },
    { key: 'program', header: 'Program' },
    { key: 'status', header: 'Status' },
    { key: 'due', header: 'Due', align: 'end' },
  ];
}
