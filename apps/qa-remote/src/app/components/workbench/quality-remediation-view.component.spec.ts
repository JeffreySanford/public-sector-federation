import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualityRemediationViewComponent } from './quality-remediation-view.component';

describe('QualityRemediationViewComponent', () => {
  let fixture: ComponentFixture<QualityRemediationViewComponent>;
  let component: QualityRemediationViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [QualityRemediationViewComponent] }).compileComponents();
    fixture = TestBed.createComponent(QualityRemediationViewComponent);
    component = fixture.componentInstance;
  });

  it('keeps quality scores bounded and computes an aggregate', () => {
    const scores = component.entries.map((entry) => component.qualityScore(entry));
    expect(scores.every((score) => score >= 0 && score <= 100)).toBeTrue();
    expect(component.overallCoverage()).toBeGreaterThanOrEqual(0);
    expect(component.overallCoverage()).toBeLessThanOrEqual(100);
  });

  it('orders remediation work from highest to lowest risk', () => {
    const queue = component.remediationQueue();
    expect(queue.length).toBeGreaterThan(0);
    for (let index = 1; index < queue.length; index += 1) {
      expect(queue[index - 1].riskScore).toBeGreaterThanOrEqual(queue[index].riskScore);
    }
  });

  it('keeps Button, Select, and Dialog as representative cases', () => {
    expect(component.caseEntries().map((entry) => entry.identity.id)).toEqual([
      'ps-button',
      'ps-select',
      'ps-dialog',
    ]);
  });

  it('returns a concrete next action for every queued entry', () => {
    for (const item of component.remediationQueue()) {
      expect(item.nextAction.trim().length).toBeGreaterThan(0);
      expect(component.issueCount(item.entry)).toBeGreaterThan(0);
    }
  });

  it('renders the scorecard, queue, cases, and secondary diagnostics', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Evidence by component');
    expect(text).toContain('What should be repaired next');
    expect(text).toContain('Representative remediation cases');
    expect(text).toContain('Technical diagnostics and evidence distribution');
  });
});
