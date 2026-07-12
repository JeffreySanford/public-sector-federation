import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerformanceMetricDTO {
  id: string;
  testSuite: 'lint' | 'unit' | 'federation' | 'storybook' | 'code_examples';
  testName: string;
  browser?: 'chromium' | 'firefox' | 'webkit' | null;
  durationMs: number;
  baselineMs: number;
  thresholdMs: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  passed: boolean;
  errorMessage?: string | null;
  commitHash: string;
  branch: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceTrendDTO {
  testSuite: 'lint' | 'unit' | 'federation' | 'storybook' | 'code_examples';
  testName: string;
  browser?: 'chromium' | 'firefox' | 'webkit' | null;
  average: number;
  baseline: number;
  latest: number;
  trend: 'improving' | 'stable' | 'degrading';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface PerformanceSummaryDTO {
  testSuite: 'lint' | 'unit' | 'federation' | 'storybook' | 'code_examples';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageDuration: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface RegressionAlertDTO {
  testName: string;
  severity: 'warning' | 'critical';
  currentMs: number;
  baselineMs: number;
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceDataService {
  private apiUrl = 'http://localhost:3000/api/performance';

  constructor(private http: HttpClient) {}

  /**
   * Get performance summary grouped by test suite
   */
  getSummary(): Observable<PerformanceSummaryDTO[]> {
    return this.http.get<PerformanceSummaryDTO[]>(`${this.apiUrl}/summary`);
  }

  /**
   * Get performance trends for a specific test
   */
  getTrends(
    testSuite: string,
    testName: string,
    browser?: string,
  ): Observable<PerformanceTrendDTO[]> {
    let params = new HttpParams()
      .set('testSuite', testSuite)
      .set('testName', testName);

    if (browser) {
      params = params.set('browser', browser);
    }

    return this.http.get<PerformanceTrendDTO[]>(`${this.apiUrl}/trends`, { params });
  }

  /**
   * Get performance metrics with optional filtering
   */
  getMetrics(
    testSuite?: string,
    testName?: string,
    browser?: string,
    limit?: number,
  ): Observable<PerformanceMetricDTO[]> {
    let params = new HttpParams();

    if (testSuite) params = params.set('testSuite', testSuite);
    if (testName) params = params.set('testName', testName);
    if (browser) params = params.set('browser', browser);
    if (limit) params = params.set('limit', limit.toString());

    return this.http.get<PerformanceMetricDTO[]>(`${this.apiUrl}`, { params });
  }

  /**
   * Get performance regressions
   */
  getRegressions(): Observable<RegressionAlertDTO[]> {
    return this.http.get<RegressionAlertDTO[]>(`${this.apiUrl}/regressions`);
  }

  /**
   * Get metrics in date range
   */
  getMetricsInDateRange(
    startDate: Date,
    endDate: Date,
  ): Observable<PerformanceMetricDTO[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<PerformanceMetricDTO[]>(`${this.apiUrl}/date-range`, { params });
  }

  /**
   * Record a new performance metric
   */
  recordMetric(metric: Omit<PerformanceMetricDTO, 'id' | 'createdAt' | 'updatedAt' | 'recordedAt'>): Observable<PerformanceMetricDTO> {
    return this.http.post<PerformanceMetricDTO>(`${this.apiUrl}`, metric);
  }
}
