import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicInputComponent } from './public-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicInputComponent', () => {
  let component: PublicInputComponent;
  let fixture: ComponentFixture<PublicInputComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicInputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Case ID');
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should render a labelled input', () => {
      const label = compiled.query(By.css('label'));
      const input = compiled.query(By.css('input'));
      expect(label).toBeTruthy();
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('id')).toBe(label.nativeElement.getAttribute('for'));
    });

    it('should default to a text input', () => {
      const input = compiled.query(By.css('input'));
      expect(input.nativeElement.type).toBe('text');
    });

    it('should switch the native type per the type input', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();
      const input = compiled.query(By.css('input'));
      expect(input.nativeElement.type).toBe('password');
    });
  });

  describe('Signal Inputs', () => {
    it('should have label and type signals', () => {
      expect(typeof component.label).toBe('function');
      expect(typeof component.type).toBe('function');
    });
  });

  describe('Model', () => {
    it('should default value to an empty string', () => {
      expect(component.value()).toBe('');
    });
  });
});
