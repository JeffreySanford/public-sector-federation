import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignAlignmentLabComponent } from './design-alignment-lab.component';

describe('DesignAlignmentLabComponent', () => {
  let fixture: ComponentFixture<DesignAlignmentLabComponent>;
  let component: DesignAlignmentLabComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DesignAlignmentLabComponent] }).compileComponents();
    fixture = TestBed.createComponent(DesignAlignmentLabComponent);
    component = fixture.componentInstance;
  });

  it('starts with Button and exposes the three flagship cases', () => {
    expect(component.selectedEntry()?.identity.id).toBe('ps-button');
    expect(component.caseEntries().map((entry) => entry.identity.id)).toEqual([
      'ps-button',
      'ps-select',
      'ps-dialog',
    ]);
  });

  it('recomputes contract members when the selected case changes', () => {
    component.selectCase({ target: { value: 'ps-select' } } as unknown as Event);
    expect(component.selectedEntry()?.identity.id).toBe('ps-select');
    expect(component.contractMembers().some((member) => member.name === 'value' && member.direction === 'model')).toBe(true);
    expect(component.contractMembers().some((member) => member.name === 'options')).toBe(true);
  });

  it('distinguishes recorded and proposed Figma mappings', () => {
    const rows = component.mappingRows();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.status === 'recorded' || row.status === 'proposed')).toBe(true);
  });

  it('does not claim alignment while design evidence is incomplete', () => {
    for (const entry of component.caseEntries()) {
      if (entry.figma.status !== 'linked' || entry.governance.designReview !== 'approved') {
        expect(component.alignmentStatus(entry)).not.toBe('aligned');
      }
      expect(component.recommendedDecision(entry).trim().length).toBeGreaterThan(0);
      expect(component.nextActions(entry).length).toBeGreaterThan(0);
    }
  });

  it('renders code, design, evidence, decision, and token surfaces', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Angular contract');
    expect(text).toContain('Figma binding');
    expect(text).toContain('Storybook & test evidence');
    expect(text).toContain('Decision record');
    expect(text).toContain('Semantic intent → provider translation');
  });
});
