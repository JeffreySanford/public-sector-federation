import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicStatusCardComponent } from './public-status-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicStatusCardComponent', () => {
  let component: PublicStatusCardComponent;
  let fixture: ComponentFixture<PublicStatusCardComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicStatusCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should render status-card article', () => {
      const card = compiled.query(By.css('article.status-card'));
      expect(card).toBeTruthy();
    });

    it('should have status-card__accent decorative element', () => {
      const accent = compiled.query(By.css('.status-card__accent'));
      expect(accent).toBeTruthy();
      expect(accent.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have status-card__body container', () => {
      const body = compiled.query(By.css('.status-card__body'));
      expect(body).toBeTruthy();
    });

    it('should have status label span', () => {
      const label = compiled.query(By.css('.status-card__label'));
      expect(label).toBeTruthy();
    });

    it('should have strong value element', () => {
      const value = compiled.query(By.css('.status-card__body strong'));
      expect(value).toBeTruthy();
    });

    it('should have detail span', () => {
      const detail = compiled.query(By.css('.status-card__detail'));
      expect(detail).toBeTruthy();
    });
  });

  describe('Signal Inputs', () => {
    it('should have label signal', () => {
      expect(typeof component.label).toBe('function');
    });

    it('should have value signal', () => {
      expect(typeof component.value).toBe('function');
    });

    it('should have detail signal', () => {
      expect(typeof component.detail).toBe('function');
    });

    it('should have status signal', () => {
      expect(typeof component.status).toBe('function');
    });

    it('should have severity signal', () => {
      expect(typeof component.severity).toBe('function');
    });
  });

  describe('CSS Classes', () => {
    it('should apply status-card CSS class', () => {
      const card = compiled.query(By.css('.status-card'));
      expect(card.nativeElement.classList.contains('status-card')).toBe(true);
    });

    it('should apply status-card__body CSS class', () => {
      const body = compiled.query(By.css('.status-card__body'));
      expect(body.nativeElement.classList.contains('status-card__body')).toBe(true);
    });

    it('should apply status-card__label CSS class', () => {
      const label = compiled.query(By.css('.status-card__label'));
      expect(label.nativeElement.classList.contains('status-card__label')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should hide accent decoration from accessibility tree', () => {
      const accent = compiled.query(By.css('.status-card__accent'));
      expect(accent.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should use semantic article element', () => {
      const article = compiled.query(By.css('article.status-card'));
      expect(article).toBeTruthy();
    });
  });
});
