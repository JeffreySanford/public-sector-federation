import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TestPerformanceService, PerformanceMetricInput, PerformanceTrendData, PerformanceSummary } from './test-performance.service';
import { TestPerformanceMetric, TestSuite, Browser } from '@prisma/client';

@Controller('api/performance')
export class TestPerformanceController {
  constructor(private readonly service: TestPerformanceService) {}

  /**
   * POST /api/performance
   * Record a new performance metric
   */
  @Post()
  async recordMetric(@Body() input: PerformanceMetricInput): Promise<TestPerformanceMetric> {
    return this.service.recordMetric(input);
  }

  /**
   * GET /api/performance
   * Get all metrics with optional filtering
   * Query params: testSuite, testName, browser, limit
   */
  @Get()
  async getMetrics(
    @Query('testSuite') testSuite?: TestSuite,
    @Query('testName') testName?: string,
    @Query('browser') browser?: Browser,
    @Query('limit') limit?: string,
  ): Promise<TestPerformanceMetric[]> {
    return this.service.getMetrics(testSuite, testName, browser, limit ? parseInt(limit) : undefined);
  }

  /**
   * GET /api/performance/trends
   * Get performance trends for a specific test
   * Query params: testSuite, testName, browser
   */
  @Get('trends')
  async getTrends(
    @Query('testSuite') testSuite: TestSuite,
    @Query('testName') testName: string,
    @Query('browser') browser?: Browser,
  ): Promise<PerformanceTrendData[]> {
    return this.service.getTrends(testSuite, testName, browser);
  }

  /**
   * GET /api/performance/summary
   * Get performance summary grouped by test suite
   */
  @Get('summary')
  async getSummary(): Promise<PerformanceSummary[]> {
    return this.service.getSummary();
  }

  /**
   * GET /api/performance/regressions
   * Check for regressions
   */
  @Get('regressions')
  async checkRegressions(): Promise<Array<{ testName: string; severity: 'warning' | 'critical'; currentMs: number; baselineMs: number }>> {
    return this.service.checkRegressions();
  }

  /**
   * GET /api/performance/date-range
   * Get metrics for a specific date range
   * Query params: startDate, endDate (ISO 8601 format)
   */
  @Get('date-range')
  async getMetricsInDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TestPerformanceMetric[]> {
    return this.service.getMetricsInDateRange(new Date(startDate), new Date(endDate));
  }
}
