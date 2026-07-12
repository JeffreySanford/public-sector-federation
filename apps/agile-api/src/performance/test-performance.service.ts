import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestPerformanceMetric, PerformanceStatus, TestSuite, Browser } from '@prisma/client';

export interface PerformanceMetricInput {
  testSuite: TestSuite;
  testName: string;
  browser?: Browser | null;
  durationMs: number;
  baselineMs: number;
  thresholdMs: number;
  passed: boolean;
  errorMessage?: string | null;
  commitHash: string;
  branch: string;
}

export interface PerformanceTrendData {
  testSuite: TestSuite;
  testName: string;
  browser?: Browser | null;
  average: number;
  baseline: number;
  latest: number;
  trend: 'improving' | 'stable' | 'degrading';
  status: PerformanceStatus;
  lastUpdated: Date;
}

export interface PerformanceSummary {
  testSuite: TestSuite;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageDuration: number;
  status: PerformanceStatus;
}

@Injectable()
export class TestPerformanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record a new performance metric
   */
  async recordMetric(input: PerformanceMetricInput): Promise<TestPerformanceMetric> {
    // Determine status based on duration vs threshold
    let status: PerformanceStatus = 'excellent';
    if (input.durationMs > input.thresholdMs) {
      status = 'critical';
    } else if (input.durationMs > input.baselineMs * 1.5) {
      status = 'warning';
    } else if (input.durationMs > input.baselineMs * 1.2) {
      status = 'good';
    }

    return this.prisma.testPerformanceMetric.create({
      data: {
        ...input,
        status,
      },
    });
  }

  /**
   * Get all performance metrics with optional filtering
   */
  async getMetrics(
    testSuite?: TestSuite,
    testName?: string,
    browser?: Browser,
    limit?: number,
  ): Promise<TestPerformanceMetric[]> {
    return this.prisma.testPerformanceMetric.findMany({
      where: {
        ...(testSuite && { testSuite }),
        ...(testName && { testName }),
        ...(browser && { browser }),
      },
      orderBy: { recordedAt: 'desc' },
      take: limit || 100,
    });
  }

  /**
   * Get performance trends for a specific test
   */
  async getTrends(testSuite: TestSuite, testName: string, browser?: Browser): Promise<PerformanceTrendData[]> {
    const metrics = await this.prisma.testPerformanceMetric.findMany({
      where: {
        testSuite,
        testName,
        ...(browser && { browser }),
      },
      orderBy: { recordedAt: 'desc' },
      take: 20, // Last 20 runs
    });

    if (metrics.length === 0) {
      return [];
    }

    // Group by browser (or use single metric if no browser)
    const grouped = new Map<string | null, TestPerformanceMetric[]>();
    metrics.forEach((m) => {
      const key = m.browser || 'no-browser';
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(m);
    });

    // Calculate trends for each group
    const trends: PerformanceTrendData[] = [];
    grouped.forEach((metricsForBrowser, key) => {
      const sorted = metricsForBrowser.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());
      const average = sorted.reduce((sum, m) => sum + m.durationMs, 0) / sorted.length;
      const baseline = sorted[0]?.baselineMs || 0;
      const latest = sorted[0]?.durationMs || 0;

      // Determine trend
      let trend: 'improving' | 'stable' | 'degrading' = 'stable';
      if (sorted.length >= 2) {
        const oldAvg = sorted.slice(5, 10).reduce((sum, m) => sum + m.durationMs, 0) / Math.min(5, sorted.length - 5);
        if (latest < oldAvg * 0.95) {
          trend = 'improving';
        } else if (latest > oldAvg * 1.05) {
          trend = 'degrading';
        }
      }

      trends.push({
        testSuite,
        testName,
        browser: key === 'no-browser' ? undefined : (key as Browser),
        average: Math.round(average),
        baseline,
        latest,
        trend,
        status: sorted[0]?.status || 'good',
        lastUpdated: sorted[0]?.recordedAt || new Date(),
      });
    });

    return trends;
  }

  /**
   * Get performance summary grouped by test suite
   */
  async getSummary(): Promise<PerformanceSummary[]> {
    const metrics = await this.prisma.testPerformanceMetric.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 100, // Last 100 metrics
    });

    const grouped = new Map<TestSuite, TestPerformanceMetric[]>();
    metrics.forEach((m) => {
      if (!grouped.has(m.testSuite)) {
        grouped.set(m.testSuite, []);
      }
      grouped.get(m.testSuite)!.push(m);
    });

    const summaries: PerformanceSummary[] = [];
    grouped.forEach((metricsForSuite, testSuite) => {
      const passed = metricsForSuite.filter((m) => m.passed).length;
      const failed = metricsForSuite.length - passed;
      const average = Math.round(metricsForSuite.reduce((sum, m) => sum + m.durationMs, 0) / metricsForSuite.length);

      // Determine overall status
      const statuses = metricsForSuite.map((m) => m.status);
      let status: PerformanceStatus = 'excellent';
      if (statuses.includes('critical')) {
        status = 'critical';
      } else if (statuses.includes('warning')) {
        status = 'warning';
      } else if (statuses.some((s) => s === 'good')) {
        status = 'good';
      }

      summaries.push({
        testSuite,
        totalTests: metricsForSuite.length,
        passedTests: passed,
        failedTests: failed,
        averageDuration: average,
        status,
      });
    });

    return summaries;
  }

  /**
   * Get metrics for a specific date range
   */
  async getMetricsInDateRange(startDate: Date, endDate: Date): Promise<TestPerformanceMetric[]> {
    return this.prisma.testPerformanceMetric.findMany({
      where: {
        recordedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  /**
   * Check for regressions
   */
  async checkRegressions(): Promise<Array<{ testName: string; severity: 'warning' | 'critical'; currentMs: number; baselineMs: number }>> {
    const metrics = await this.prisma.testPerformanceMetric.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });

    const regressions: Array<{ testName: string; severity: 'warning' | 'critical'; currentMs: number; baselineMs: number }> = [];

    const grouped = new Map<string, TestPerformanceMetric[]>();
    metrics.forEach((m) => {
      const key = `${m.testSuite}:${m.testName}:${m.browser || 'none'}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(m);
    });

    grouped.forEach((metricsForTest) => {
      const latest = metricsForTest[0];
      if (latest.status === 'critical') {
        regressions.push({
          testName: latest.testName,
          severity: 'critical',
          currentMs: latest.durationMs,
          baselineMs: latest.baselineMs,
        });
      } else if (latest.status === 'warning') {
        regressions.push({
          testName: latest.testName,
          severity: 'warning',
          currentMs: latest.durationMs,
          baselineMs: latest.baselineMs,
        });
      }
    });

    return regressions;
  }
}
