import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaWorkspaceComponent } from './qa-workspace.component';

describe('QaWorkspaceComponent', () => {
  let fixture: ComponentFixture<QaWorkspaceComponent>;
  let component: QaWorkspaceComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaWorkspaceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(QaWorkspaceComponent);
    component = fixture.componentInstance;
  });

  it('starts on QA Components and switches through all workspace views', () => {
    expect(component.activeView()).toBe('qa');

    component.setActiveView('performance');
    expect(component.activeView()).toBe('performance');

    component.setActiveView('candidates');
    expect(component.activeView()).toBe('candidates');

    component.setActiveView('qa');
    expect(component.activeView()).toBe('qa');
  });

  it('renders Candidates as the third navigation control', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const labels = Array.from(
      element.querySelectorAll('.qa-workspace__tabs button'),
    ).map((button) => button.textContent?.trim());

    expect(labels).toEqual([
      'QA Components',
      'Performance Tracking',
      'Candidates',
    ]);
  });

  it('renders the dedicated Candidates view when selected', () => {
    component.setActiveView('candidates');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('public-candidates-view')).not.toBeNull();
    expect(element.textContent).toContain('Current Button vs UP Button candidate');
  });
});
