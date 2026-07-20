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

  it('filters and explains consolidation dispositions from manifest audit metadata', () => {
    component.dispositionFilter.set('canonical');
    const canonicalEntries = component.filteredEntries();
    expect(canonicalEntries.length).toBeGreaterThan(0);
    expect(canonicalEntries.every((entry) => entry.audit.disposition === 'canonical')).toBeTrue();

    for (const entry of component.entries) {
      expect(component.consolidationAction(entry).trim().length).toBeGreaterThan(0);
    }
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
    expect(element.querySelectorAll('select').length).toBe(3);
    expect(element.querySelector('button[aria-label^="Inspect "]')).not.toBeNull();
    expect(element.textContent).toContain('Consolidation decision');
  });

  it('presents canonical selectors and compatibility aliases from the manifest', () => {
    component.selectEntry('ps-empty-state');
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('ps-empty-state');
    expect(text).toContain('public-empty-state');
    expect(text).toContain('until next major');
  });
});
