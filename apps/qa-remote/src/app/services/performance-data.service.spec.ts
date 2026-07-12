import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PerformanceDataService, PerformanceMetricDTO } from './performance-data.service';

describe('PerformanceDataService', () => {
  let service: PerformanceDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerformanceDataService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PerformanceDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests performance summary', () => {
    service.getSummary().subscribe((result) => {
      expect(result).toEqual([]);
    });

    const request = httpMock.expectOne('http://localhost:3333/api/performance/summary');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('requests trends with suite, test name, and browser params', () => {
    service.getTrends('federation', 'Shell federation tests', 'chromium').subscribe((result) => {
      expect(result).toEqual([]);
    });

    const request = httpMock.expectOne((req) => req.url === 'http://localhost:3333/api/performance/trends');
    expect(request.request.params.get('testSuite')).toBe('federation');
    expect(request.request.params.get('testName')).toBe('Shell federation tests');
    expect(request.request.params.get('browser')).toBe('chromium');
    request.flush([]);
  });

  it('requests filtered metrics', () => {
    service.getMetrics('storybook', 'Storybook E2E tests', 'webkit', 20).subscribe((result) => {
      expect(result).toEqual([]);
    });

    const request = httpMock.expectOne((req) => req.url === 'http://localhost:3333/api/performance');
    expect(request.request.params.get('testSuite')).toBe('storybook');
    expect(request.request.params.get('testName')).toBe('Storybook E2E tests');
    expect(request.request.params.get('browser')).toBe('webkit');
    expect(request.request.params.get('limit')).toBe('20');
    request.flush([]);
  });

  it('requests regressions', () => {
    service.getRegressions().subscribe((result) => {
      expect(result).toEqual([]);
    });

    const request = httpMock.expectOne('http://localhost:3333/api/performance/regressions');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('records a performance metric', () => {
    const metric = {
      testSuite: 'unit',
      testName: 'AgileService',
      durationMs: 9500,
      baselineMs: 10000,
      thresholdMs: 15000,
      status: 'excellent',
      passed: true,
      commitHash: 'abc123',
      branch: 'main',
    } satisfies Omit<PerformanceMetricDTO, 'id' | 'createdAt' | 'updatedAt' | 'recordedAt'>;

    service.recordMetric(metric).subscribe((result) => {
      expect(result.testName).toBe('AgileService');
    });

    const request = httpMock.expectOne('http://localhost:3333/api/performance');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(metric);
    request.flush({
      ...metric,
      id: 'metric-1',
      recordedAt: '2026-07-12T00:00:00.000Z',
      createdAt: '2026-07-12T00:00:00.000Z',
      updatedAt: '2026-07-12T00:00:00.000Z',
    });
  });
});
