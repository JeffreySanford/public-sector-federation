import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCheckboxComponent } from './public-checkbox.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicCheckboxComponent', () => {
  let component: PublicCheckboxComponent;
  let fixture: ComponentFixture<PublicCheckboxComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicCheckboxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Expedite review');
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should render an input of type checkbox', () => {
      const input = compiled.query(By.css('input[type="checkbox"]'));
      expect(input).toBeTruthy();
    });

    it('should render the label text', () => {
      const label = compiled.query(By.css('.ps-checkbox-field__control'));
      expect(label.nativeElement.textContent).toContain('Expedite review');
    });

    it('should apply the switch role only for the switch variant', () => {
      fixture.componentRef.setInput('variant', 'switch');
      fixture.detectChanges();
      const input = compiled.query(By.css('input[type="checkbox"]'));
      expect(input.nativeElement.getAttribute('role')).toBe('switch');
    });
  });

  describe('Signal Inputs', () => {
    it('should have label and variant signals', () => {
      expect(typeof component.label).toBe('function');
      expect(typeof component.variant).toBe('function');
    });
  });

  describe('Model', () => {
    it('should default checked to false', () => {
      expect(component.checked()).toBe(false);
    });
  });
});
