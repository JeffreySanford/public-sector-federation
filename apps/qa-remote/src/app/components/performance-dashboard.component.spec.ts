import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PerformanceDashboardComponent } from './performance-dashboard.component';
import { PerformanceDataService, PerformanceSummaryDTO, PerformanceTrendDTO } from '../services/performance-data.service';

describe('PerformanceDashboardComponent', () => {
  let fixture: ComponentFixture<PerformanceDashboardComponent>;
  let component: PerformanceDashboardComponent;
  let performanceService: jasmine.SpyObj<PerformanceDataService>;

  const summary: PerformanceSummaryDTO = {
    testSuite: 'federation',
    totalTests: 10,
    passedTests: 8,
    failedTests: 2,
    averageDuration: 90000,
    status: 'warning',
  };

  const trend: PerformanceTrendDTO = {
    testSuite: 'federation',
    testName: 'Shell federation tests',
    browser: 'chromium',
    average: 91000,
    baseline: 90000,
    latest: 99000,
    trend: 'degrading',
    status: 'warning',
    lastUpdated: '2026-07-12T00:00:00.000Z',
  };

  beforeEach(async () => {
    performanceService = jasmine.createSpyObj<PerformanceDataService>('PerformanceDataService', [
      'getSummary',
      'getRegressions',
      'getTrends',
    ]);
    performanceService.getSummary.and.returnValue(of([summary]));
    performanceService.getRegressions.and.returnValue(
      of([{ testName: 'Shell federation tests', severity: 'critical', currentMs: 120000, baselineMs: 90000 }]),
    );
    performanceService.getTrends.and.returnValue(of([trend]));

    await TestBed.configureTestingModule({
      imports: [PerformanceDashboardComponent],
      providers: [
        {
          provide: PerformanceDataService,
          useValue: performanceService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceDashboardComponent);
    component = fixture.componentInstance;
  });

  it('maps status to shared tag tone and display labels', () => {
    expect(component.getStatusSeverity('excellent')).toBe('success');
    expect(component.getStatusSeverity('good')).toBe('info');
    expect(component.getStatusSeverity('warning')).toBe('warning');
    expect(component.getStatusSeverity('critical')).toBe('danger');
    expect(component.getStatusLabel('critical')).toBe('Critical');
  });

  it('calculates pass rate and duration percentages', () => {
    expect(component.calculatePassRate(summary)).toBe(80);
    expect(component.calculatePassRate({ ...summary, totalTests: 0, passedTests: 0 })).toBe(0);
    expect(component.calculateDurationPercent(trend)).toBe(110);
    expect(component.calculateBaselineDeltaPercent(trend)).toBe(10);
  });

  it('returns trend icon, tone, bar width, and delta label', () => {
    expect(component.getTrendIcon(trend)).toBe('pi pi-arrow-up');
    expect(component.getTrendTone(trend)).toBe('degrading');
    expect(component.getTrendBarWidth(trend)).toBe(110);
    expect(component.getTrendDeltaLabel(trend)).toBe('+10% vs baseline');
  });

  it('builds KPI tiles from loaded summary and regression data', () => {
    fixture.detectChanges();

    expect(component.performanceKpis).toHaveSize(4);
    expect(component.criticalRegressionCount).toBe(1);
    expect(component.warningRegressionCount).toBe(0);
    expect(component.performanceKpis[1]?.value).toBe('1');
  });

  it('loads trends when a suite is selected', () => {
    component.selectTestSuite(summary);

    expect(component.selectedTestSuite).toEqual(summary);
    expect(performanceService.getTrends).toHaveBeenCalledWith('federation', 'Shell federation tests');
  });
});
