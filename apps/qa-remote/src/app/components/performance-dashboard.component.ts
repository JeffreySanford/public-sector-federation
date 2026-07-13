import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PerformanceDataService, PerformanceSummaryDTO, PerformanceTrendDTO, RegressionAlertDTO } from '../services/performance-data.service';

interface StatusColor {
  [key: string]: string;
}

interface PerformanceKpi {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'success' | 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'public-performance-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TagModule, ChartModule, ProgressBarModule, SkeletonModule, PublicButtonComponent, ToastModule],
  templateUrl: './performance-dashboard.component.html',
  styleUrl: './performance-dashboard.component.css',
})
export class PerformanceDashboardComponent implements OnInit {
  private readonly performanceService = inject(PerformanceDataService);
  private readonly messageService = inject(MessageService);

  // State
  summaryLoading = true;
  trendsLoading = true;
  alertsLoading = true;

  // Data
  summary: PerformanceSummaryDTO[] = [];
  selectedTestSuite: PerformanceSummaryDTO | null = null;
  trends: PerformanceTrendDTO[] = [];
  regressions: RegressionAlertDTO[] = [];

  // Chart data
  trendChartData: any;
  trendChartOptions: any;

  statusColors: StatusColor = {
    excellent: '#10b981',
    good: '#3b82f6',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  suiteLabels: { [key: string]: string } = {
    lint: 'Linting',
    unit: 'Unit Tests',
    federation: 'Federation',
    storybook: 'Storybook E2E',
    code_examples: 'Code Examples',
  };

  get performanceKpis(): PerformanceKpi[] {
    const totalTests = this.summary.reduce((sum, suite) => sum + suite.totalTests, 0);
    const failedTests = this.summary.reduce((sum, suite) => sum + suite.failedTests, 0);
    const averageDuration = this.summary.length
      ? Math.round(this.summary.reduce((sum, suite) => sum + suite.averageDuration, 0) / this.summary.length)
      : 0;
    const improvingCount = this.trends.filter((trend) => trend.trend === 'improving').length;
    const degradingCount = this.trends.filter((trend) => trend.trend === 'degrading').length;

    return [
      {
        label: 'Tracked executions',
        value: totalTests.toString(),
        detail: `${failedTests} failing in latest sample`,
        icon: 'pi pi-database',
        tone: failedTests > 0 ? 'warning' : 'success',
      },
      {
        label: 'Regression alerts',
        value: this.regressions.length.toString(),
        detail: `${this.criticalRegressionCount} critical, ${this.warningRegressionCount} warning`,
        icon: this.regressions.length > 0 ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle',
        tone: this.criticalRegressionCount > 0 ? 'danger' : this.warningRegressionCount > 0 ? 'warning' : 'success',
      },
      {
        label: 'Average duration',
        value: `${averageDuration}ms`,
        detail: 'Across suite summaries',
        icon: 'pi pi-stopwatch',
        tone: 'info',
      },
      {
        label: 'Trend balance',
        value: `${improvingCount}/${degradingCount}`,
        detail: 'Improving vs degrading browser groups',
        icon: degradingCount > improvingCount ? 'pi pi-arrow-trend-up' : 'pi pi-arrow-trend-down',
        tone: degradingCount > improvingCount ? 'warning' : 'success',
      },
    ];
  }

  get criticalRegressionCount(): number {
    return this.regressions.filter((regression) => regression.severity === 'critical').length;
  }

  get warningRegressionCount(): number {
    return this.regressions.filter((regression) => regression.severity === 'warning').length;
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadRegressions();
  }

  private loadSummary(): void {
    this.summaryLoading = true;
    this.performanceService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.summaryLoading = false;
        if (data.length > 0) {
          this.selectTestSuite(data[0]);
        }
      },
      error: (error) => {
        console.error('Failed to load performance summary:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load performance data',
          detail: error.message,
        });
        this.summaryLoading = false;
      },
    });
  }

  private loadRegressions(): void {
    this.alertsLoading = true;
    this.performanceService.getRegressions().subscribe({
      next: (data) => {
        this.regressions = data;
        this.alertsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load regressions:', error);
        this.alertsLoading = false;
      },
    });
  }

  selectTestSuite(suite: PerformanceSummaryDTO): void {
    this.selectedTestSuite = suite;
    this.loadTrends(suite.testSuite);
  }

  private loadTrends(testSuite: string): void {
    this.trendsLoading = true;
    // Get first test name from this suite (in real app, would let user select)
    const firstTrendName = this.getTrendName(testSuite);

    this.performanceService.getTrends(testSuite, firstTrendName).subscribe({
      next: (data) => {
        this.trends = data;
        this.buildTrendChart(data);
        this.trendsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load trends:', error);
        this.trendsLoading = false;
      },
    });
  }

  private getTrendName(testSuite: string): string {
    const trendMap: { [key: string]: string } = {
      lint: 'All checks',
      unit: 'AgileService',
      federation: 'Shell federation tests',
      storybook: 'Storybook E2E tests',
      code_examples: 'Code example validation',
    };
    return trendMap[testSuite] || 'All tests';
  }

  private buildTrendChart(trends: PerformanceTrendDTO[]): void {
    const labels = trends.map((t) => {
      const browser = t.browser || 'all';
      return browser === 'all' ? 'All browsers' : browser.charAt(0).toUpperCase() + browser.slice(1);
    });

    const datasets = [
      {
        label: 'Latest',
        data: trends.map((t) => t.latest),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f61a',
        tension: 0.4,
      },
      {
        label: 'Average',
        data: trends.map((t) => t.average),
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf61a',
        tension: 0.4,
      },
      {
        label: 'Baseline',
        data: trends.map((t) => t.baseline),
        borderColor: '#10b981',
        backgroundColor: '#10b9811a',
        tension: 0.4,
        borderDash: [5, 5],
      },
      {
        label: 'Threshold',
        data: trends.map((t) => {
          // Estimate threshold as 120% of baseline
          return Math.round(t.baseline * 1.2);
        }),
        borderColor: '#ef4444',
        backgroundColor: '#ef44441a',
        tension: 0.4,
        borderDash: [5, 5],
      },
    ];

    this.trendChartData = {
      labels,
      datasets,
    };

    this.trendChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Performance Trend: ${this.getTrendName(this.selectedTestSuite?.testSuite || '')}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: number) {
              return value + 'ms';
            },
          },
        },
      },
    };
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      excellent: 'success',
      good: 'info',
      warning: 'warning',
      critical: 'danger',
    };
    return severityMap[status] || 'info';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      excellent: 'Excellent',
      good: 'Good',
      warning: 'Warning',
      critical: 'Critical',
    };
    return labelMap[status] || status;
  }

  getSuiteLabel(suite: string): string {
    return this.suiteLabels[suite] || suite;
  }

  refreshData(): void {
    this.loadSummary();
    this.loadRegressions();
    this.messageService.add({
      severity: 'info',
      summary: 'Data refreshed',
      detail: 'Performance data has been updated.',
    });
  }

  calculatePassRate(suite: PerformanceSummaryDTO): number {
    if (suite.totalTests === 0) return 0;
    return Math.round((suite.passedTests / suite.totalTests) * 100);
  }

  calculateDurationPercent(trend: PerformanceTrendDTO): number {
    if (trend.baseline === 0) return 0;
    return Math.round((trend.latest / trend.baseline) * 100);
  }

  calculateBaselineDeltaPercent(trend: PerformanceTrendDTO): number {
    if (trend.baseline === 0) return 0;
    return Math.round(((trend.latest - trend.baseline) / trend.baseline) * 100);
  }

  calculateRegressionImpact(regression: RegressionAlertDTO): number {
    if (regression.baselineMs === 0) return 0;
    return Math.round(((regression.currentMs - regression.baselineMs) / regression.baselineMs) * 100);
  }

  getTrendTone(trend: PerformanceTrendDTO): 'improving' | 'stable' | 'degrading' {
    return trend.trend;
  }

  getTrendIcon(trend: PerformanceTrendDTO): string {
    if (trend.trend === 'improving') return 'pi pi-arrow-down';
    if (trend.trend === 'degrading') return 'pi pi-arrow-up';
    return 'pi pi-minus';
  }

  getTrendBarWidth(trend: PerformanceTrendDTO): number {
    return Math.min(Math.max(this.calculateDurationPercent(trend), 4), 150);
  }

  getTrendDeltaLabel(trend: PerformanceTrendDTO): string {
    const delta = this.calculateBaselineDeltaPercent(trend);
    if (delta === 0) {
      return 'On baseline';
    }
    return `${delta > 0 ? '+' : ''}${delta}% vs baseline`;
  }

  Math = Math;
}
