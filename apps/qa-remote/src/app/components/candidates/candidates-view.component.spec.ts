import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatesViewComponent } from './candidates-view.component';

describe('CandidatesViewComponent', () => {
  let fixture: ComponentFixture<CandidatesViewComponent>;
  let component: CandidatesViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.documentElement.classList.remove(
      'p-dark',
      'ps-theme-vibrant',
      'ps-theme-pastel',
    );
  });

  it('renders the stable and candidate Button implementations', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(
      element.querySelector('[data-testid="live-button-comparison"] ps-button'),
    ).not.toBeNull();
    expect(
      element.querySelector('[data-testid="live-button-comparison"] ps-button-candidate'),
    ).not.toBeNull();
    expect(element.textContent).toContain('Current Button vs Button candidate');
  });

  it('updates the shared comparison controls', () => {
    component.setLabel('Approve request');
    component.setIntent('secondary');
    component.setAppearance('outlined');
    component.setDisabled(true);
    component.setLoading(true);

    expect(component.label()).toBe('Approve request');
    expect(component.intent()).toBe('secondary');
    expect(component.appearance()).toBe('outlined');
    expect(component.disabled()).toBeTrue();
    expect(component.loading()).toBeTrue();
  });

  it('tracks activations independently for the stable and candidate wrappers', () => {
    component.recordActivation('stable');
    component.recordActivation('candidate');
    component.recordActivation('candidate');

    expect(component.stableActivations()).toBe(1);
    expect(component.candidateActivations()).toBe(2);
  });

  it('applies all public-sector theme controls through the shared theme service', () => {
    component.setThemeVariant('vibrant');
    component.setDarkMode(true);

    expect(component.theme.variant()).toBe('vibrant');
    expect(component.theme.isDark()).toBeTrue();
    expect(
      document.documentElement.classList.contains('ps-theme-vibrant'),
    ).toBeTrue();
    expect(document.documentElement.classList.contains('p-dark')).toBeTrue();

    component.setThemeVariant('pastel');
    component.setDarkMode(false);

    expect(
      document.documentElement.classList.contains('ps-theme-vibrant'),
    ).toBeFalse();
    expect(
      document.documentElement.classList.contains('ps-theme-pastel'),
    ).toBeTrue();
    expect(document.documentElement.classList.contains('p-dark')).toBeFalse();
  });

  it('keeps Storybook embedding optional and preserves the fallback link', () => {
    expect(component.showStorybookPreview()).toBeFalse();
    expect(component.storybookUrl).toContain('current-vs-candidate');

    component.toggleStorybookPreview();

    expect(component.showStorybookPreview()).toBeTrue();
  });

  it('maps lifecycle status values to display classes', () => {
    expect(component.statusClass('Complete')).toBe(
      'candidate-status--complete',
    );
    expect(component.statusClass('In review')).toBe(
      'candidate-status--review',
    );
    expect(component.statusClass('Pending')).toBe(
      'candidate-status--pending',
    );
    expect(component.statusClass('Blocked')).toBe(
      'candidate-status--blocked',
    );
  });
});
