import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicFormSectionComponent } from './public-form-section.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicFormSectionComponent', () => {
  let component: PublicFormSectionComponent;
  let fixture: ComponentFixture<PublicFormSectionComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicFormSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicFormSectionComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.componentRef.setInput('title', 'Contact details');
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should render form-card section', () => {
      const section = compiled.query(By.css('.form-card'));
      expect(section).toBeTruthy();
    });

    it('should have header with h3 title', () => {
      const header = compiled.query(By.css('header'));
      const heading = compiled.query(By.css('h3'));
      expect(header).toBeTruthy();
      expect(heading).toBeTruthy();
    });

    it('should have content projection area', () => {
      const formSection = compiled.query(By.css('.form-section'));
      expect(formSection).toBeTruthy();
    });
  });

  describe('Signal Inputs', () => {
    it('should have title signal', () => {
      expect(typeof component.title).toBe('function');
    });

    it('should have description signal', () => {
      expect(typeof component.description).toBe('function');
    });
  });

  describe('CSS Classes', () => {
    it('should apply form-card CSS class', () => {
      const container = compiled.query(By.css('.form-card'));
      expect(container.nativeElement.classList.contains('form-card')).toBe(true);
    });

    it('should apply form-section CSS class to content area', () => {
      const formSection = compiled.query(By.css('.form-section'));
      expect(formSection.nativeElement.classList.contains('form-section')).toBe(true);
    });
  });
});
