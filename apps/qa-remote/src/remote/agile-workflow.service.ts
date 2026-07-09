import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface AgileApiWorkItem {
  slug: string;
  title: string;
  workstream: string;
  status: string;
  effort: 'small' | 'medium' | 'large';
  owner: string;
  summary: string;
  includes: string;
  blockerSummary?: string | null;
  doneCriteria: string;
  totalMinutes: number;
}

export interface AgileApiBlocker {
  slug: string;
  title: string;
  affectedArea: string;
  mitigation: string;
  owner: string;
  status: string;
}

export interface AgileApiDashboard {
  sprint: {
    slug: string;
    name: string;
    goal: string;
    status: string;
  };
  workItems: AgileApiWorkItem[];
  blockers: AgileApiBlocker[];
  acceptanceChecks: AgileApiAcceptanceCheck[];
  timeSummary: {
    totalMinutes: number;
    totalHours: number;
    entryCount: number;
  };
}

export interface AgileApiAcceptanceCheck {
  slug: string;
  check: string;
  status: string;
  gate: string;
}

export interface AgileApiReportWorkItem {
  title: string;
  status: string;
  workstream: string;
}

export interface AgileApiReport {
  summary: {
    completedCount: number;
    currentCount: number;
    remainingCount: number;
    blockerCount: number;
    totalTrackedHours: number;
  };
  recommendations: string[];
  workLeft: AgileApiReportWorkItem[];
  completedWork: AgileApiReportWorkItem[];
  acceptanceChecks: AgileApiAcceptanceCheck[];
}

export interface AgileSeedStatus {
  synced: boolean;
  seedFilePath: string;
  databaseHash: string;
  seedHash: string;
}

@Injectable({ providedIn: 'root' })
export class AgileWorkflowService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:3333/api/agile';

  getDashboard(): Observable<AgileApiDashboard | null> {
    return this.http.get<AgileApiDashboard>(`${this.apiBase}/dashboard`).pipe(catchError(() => of(null)));
  }

  getReport(): Observable<AgileApiReport | null> {
    return this.http.get<AgileApiReport>(`${this.apiBase}/report`).pipe(catchError(() => of(null)));
  }

  getSeedStatus(): Observable<AgileSeedStatus | null> {
    return this.http.get<AgileSeedStatus>(`${this.apiBase}/export/status`).pipe(catchError(() => of(null)));
  }
}
