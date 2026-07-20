import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PublicButtonComponent,
  PublicCardComponent,
  PublicCheckboxComponent,
  PublicInputComponent,
  PublicPaginatorComponent,
  PublicProgressComponent,
  PublicSelectComponent,
  PublicTableColumn,
  PublicTableComponent,
  PublicTagComponent,
  type PublicTagTone,
} from '@public-sector/ui-patterns';

interface CaseQueueRow {
  case: string;
  applicant: string;
  program: string;
  status: string;
  statusTone: PublicTagTone;
  due: string;
}

@Component({
  selector: 'public-services-remote',
  standalone: true,
  imports: [
    FormsModule,
    PublicButtonComponent,
    PublicCardComponent,
    PublicCheckboxComponent,
    PublicInputComponent,
    PublicPaginatorComponent,
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
    { key: 'program', header: 'Program', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'due', header: 'Due', align: 'end' },
  ];

  readonly caseQueueRows: CaseQueueRow[] = [
    { case: 'PS-2026-1042', applicant: 'Jordan Avery', program: 'Benefits renewal', status: 'Review', statusTone: 'warn', due: 'Today' },
    { case: 'PS-2026-1043', applicant: 'Sam Rivera', program: 'Housing assistance', status: 'Ready', statusTone: 'success', due: 'Tomorrow' },
    { case: 'PS-2026-1044', applicant: 'Lee Morgan', program: 'Permit request', status: 'Blocked', statusTone: 'danger', due: 'Jul 12' },
    { case: 'PS-2026-1045', applicant: 'Taylor Brooks', program: 'Document upload', status: 'Ready', statusTone: 'success', due: 'Jul 13' },
    { case: 'PS-2026-1046', applicant: 'Casey Morgan', program: 'Benefits renewal', status: 'Review', statusTone: 'warn', due: 'Jul 13' },
    { case: 'PS-2026-1047', applicant: 'Jamie Patel', program: 'Housing assistance', status: 'Blocked', statusTone: 'danger', due: 'Jul 14' },
    { case: 'PS-2026-1048', applicant: 'Skyler Reed', program: 'Permit request', status: 'Ready', statusTone: 'success', due: 'Jul 14' },
    { case: 'PS-2026-1049', applicant: 'Parker Nguyen', program: 'Document upload', status: 'Review', statusTone: 'warn', due: 'Jul 15' },
    { case: 'PS-2026-1050', applicant: 'Quinn Davis', program: 'Benefits renewal', status: 'Ready', statusTone: 'success', due: 'Jul 15' },
    { case: 'PS-2026-1051', applicant: 'Harper Stone', program: 'Housing assistance', status: 'Review', statusTone: 'warn', due: 'Jul 16' },
    { case: 'PS-2026-1052', applicant: 'Rowan Mills', program: 'Permit request', status: 'Blocked', statusTone: 'danger', due: 'Jul 16' },
    { case: 'PS-2026-1053', applicant: 'Avery Clark', program: 'Document upload', status: 'Ready', statusTone: 'success', due: 'Jul 17' },
  ];

  caseQueueQuery = '';
  caseQueueSortKey: string | null = null;
  caseQueueSortDirection: 'asc' | 'desc' = 'asc';
  caseQueueCurrentPage = 1;
  caseQueueRowsPerPage = 5;

  filteredCaseQueueRows(): CaseQueueRow[] {
    const query = this.caseQueueQuery.trim().toLowerCase();
    const rows = query
      ? this.caseQueueRows.filter((row) =>
          [row.case, row.applicant, row.program, row.status].some((value) => value.toLowerCase().includes(query)),
        )
      : this.caseQueueRows;

    const sortKey = this.caseQueueSortKey;
    if (!sortKey || !this.isCaseQueueSortKey(sortKey)) {
      return rows;
    }

    const direction = this.caseQueueSortDirection === 'asc' ? 1 : -1;
    return [...rows].sort((left, right) => direction * String(left[sortKey]).localeCompare(String(right[sortKey])));
  }

  pagedCaseQueueRows(): CaseQueueRow[] {
    const start = (this.caseQueueCurrentPage - 1) * this.caseQueueRowsPerPage;
    return this.filteredCaseQueueRows().slice(start, start + this.caseQueueRowsPerPage);
  }

  private isCaseQueueSortKey(key: string): key is keyof CaseQueueRow {
    return key === 'case' || key === 'applicant' || key === 'program' || key === 'status' || key === 'due';
  }
}
