import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicEmptyStateComponent } from './public-empty-state.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicEmptyStateComponent', () => {
  let component: PublicEmptyStateComponent;
  let fixture: ComponentFixture<PublicEmptyStateComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicEmptyStateComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render empty state section', () => {
      const section = compiled.query(By.css('.empty-state'));
      expect(section).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should have icon element', () => {
      const icon = compiled.query(By.css('i[aria-hidden="true"]'));
      expect(icon).toBeTruthy();
    });

    it('should have heading element', () => {
      const heading = compiled.query(By.css('h3'));
      expect(heading).toBeTruthy();
    });

    it('should have description paragraph', () => {
      const paragraph = compiled.query(By.css('p'));
      expect(paragraph).toBeTruthy();
    });
  });

  describe('Signal Inputs', () => {
    it('should have title signal', () => {
      expect(typeof component.title).toBe('function');
    });

    it('should have message signal', () => {
      expect(typeof component.message).toBe('function');
    });

    it('should have actionLabel signal', () => {
      expect(typeof component.actionLabel).toBe('function');
    });

    it('should have icon signal', () => {
      expect(typeof component.icon).toBe('function');
    });
  });

  describe('CSS Classes', () => {
    it('should apply empty-state CSS class', () => {
      const container = compiled.query(By.css('.empty-state'));
      expect(container.nativeElement.classList.contains('empty-state')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should hide icon from accessibility tree', () => {
      const icon = compiled.query(By.css('i'));
      expect(icon.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
