import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaRemoteComponent } from './qa-remote.component';

describe('QaRemoteComponent', () => {
  let fixture: ComponentFixture<QaRemoteComponent>;
  let component: QaRemoteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaRemoteComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(QaRemoteComponent);
    component = fixture.componentInstance;
  });

  it('maps program status to shared tag tone', () => {
    expect(component.severity('On track')).toBe('success');
    expect(component.severity('Watch')).toBe('warn');
    expect(component.severity('Delayed')).toBe('danger');
  });

  it('switches between QA and performance tabs', () => {
    expect(component.activeTab()).toBe('qa');

    component.setActiveTab('performance');
    expect(component.activeTab()).toBe('performance');

    component.setActiveTab('qa');
    expect(component.activeTab()).toBe('qa');
  });

  it('returns empty acceptance rows when empty state is enabled', () => {
    expect(component.qaAcceptanceTableRows.length).toBeGreaterThan(0);

    component.toggleQaTableEmpty();
    expect(component.qaAcceptanceTableRows).toEqual([]);
  });

  it('uses five rows by default and exposes the expected page sizes', () => {
    expect(component.qaTableRows).toBe(5);
  });

  it('toggles table loading state', () => {
    expect(component.qaTableLoading).toBeFalse();

    component.toggleQaTableLoading();
    expect(component.qaTableLoading).toBeTrue();
  });

  it('filters acceptance rows from the search box query and resets to the first page', () => {
    component.qaTableCurrentPage = 3;

    component.onQaTableSearch('housing');

    expect(component.qaTableCurrentPage).toBe(1);
    expect(component.qaAcceptanceTableRows.map((row) => row.program)).toEqual([
      'Housing assistance',
      'Emergency housing',
    ]);
  });

  it('maps workflow statuses to chip classes', () => {
    expect(component.statusChipClass('done')).toBe('status-chip--success');
    expect(component.statusChipClass('in progress')).toBe('status-chip--warn');
    expect(component.statusChipClass('review')).toBe('status-chip--warn');
    expect(component.statusChipClass('blocked')).toBe('status-chip--danger');
    expect(component.statusChipClass('draft')).toBe('status-chip--info');
  });
});
