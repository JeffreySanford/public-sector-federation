import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInventoryViewComponent } from './component-inventory-view.component';

describe('ComponentInventoryViewComponent', () => {
  let fixture: ComponentFixture<ComponentInventoryViewComponent>;
  let component: ComponentInventoryViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ComponentInventoryViewComponent] }).compileComponents();
    fixture = TestBed.createComponent(ComponentInventoryViewComponent);
    component = fixture.componentInstance;
  });

  it('filters manifest entries by search text', () => {
    component.query.set('ps-select');
    expect(component.filteredEntries().map((entry) => entry.identity.id)).toEqual(['ps-select']);

    component.query.set('button');
    expect(component.filteredEntries().some((entry) => entry.identity.id === 'ps-button')).toBeTrue();
  });

  it('combines lifecycle and provider filters', () => {
    component.lifecycleFilter.set('active');
    component.providerFilter.set('primeng');

    const results = component.filteredEntries();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((entry) => entry.lifecycle.status === 'active')).toBeTrue();
    expect(results.every((entry) => entry.implementation.provider === 'primeng')).toBeTrue();
  });

  it('selects a visible entry and falls back when filtering removes it', () => {
    component.selectEntry('ps-select');
    expect(component.selectedEntry()?.identity.id).toBe('ps-select');

    component.query.set('dialog');
    expect(component.selectedEntry()?.identity.id).toBe('ps-dialog');
  });

  it('counts incomplete evidence, manual review, and Figma gaps separately', () => {
    const select = component.entries.find((entry) => entry.identity.id === 'ps-select');
    expect(select).toBeDefined();
    expect(component.evidenceGapCount(select!)).toBeGreaterThan(0);
  });

  it('renders accessible filters and inspect actions', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('input[type="search"]')).not.toBeNull();
    expect(element.querySelectorAll('select').length).toBe(2);
    expect(element.querySelector('button[aria-label^="Inspect "]')).not.toBeNull();
  });
});
