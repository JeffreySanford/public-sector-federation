import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaWorkspaceComponent } from './qa-workspace.component';

describe('QaWorkspaceComponent', () => {
  let fixture: ComponentFixture<QaWorkspaceComponent>;
  let component: QaWorkspaceComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaWorkspaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QaWorkspaceComponent);
    component = fixture.componentInstance;
  });

  it('starts on Component Inventory and switches through all workbench views', () => {
    expect(component.activeView()).toBe('inventory');

    component.setActiveView('quality');
    expect(component.activeView()).toBe('quality');

    component.setActiveView('alignment');
    expect(component.activeView()).toBe('alignment');

    component.setActiveView('inventory');
    expect(component.activeView()).toBe('inventory');
  });

  it('renders the mission-aligned navigation controls', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const labels = Array.from(
      element.querySelectorAll('.qa-workspace__tabs button'),
    ).map((button) => button.textContent?.trim());

    expect(labels).toEqual([
      'Component Inventory',
      'Quality & Remediation',
      'Design Alignment Lab',
    ]);
  });

  it('renders the manifest-driven inventory by default', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('public-component-inventory-view')).not.toBeNull();
    expect(element.textContent).toContain('Forensic component discovery');
    expect(element.textContent).toContain('Component Inventory');
  });

  it('renders the Design Alignment Lab when selected', () => {
    component.setActiveView('alignment');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('public-design-alignment-lab')).not.toBeNull();
    expect(element.textContent).toContain('Code-to-design reconstruction');
    expect(element.textContent).toContain('Figma property ↔ Angular API mapping');
  });
});
