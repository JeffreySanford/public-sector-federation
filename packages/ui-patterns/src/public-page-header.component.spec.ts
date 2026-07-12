import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPageHeaderComponent } from './public-page-header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicPageHeaderComponent', () => {
  let component: PublicPageHeaderComponent;
  let fixture: ComponentFixture<PublicPageHeaderComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicPageHeaderComponent);
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
    it('should render page-header element', () => {
      const header = compiled.query(By.css('.page-header'));
      expect(header).toBeTruthy();
    });

    it('should have header content area', () => {
      const content = compiled.query(By.css('.page-header__content'));
      expect(content).toBeTruthy();
    });

    it('should have h2 heading element', () => {
      const heading = compiled.query(By.css('h2'));
      expect(heading).toBeTruthy();
    });
  });

  describe('Signal Inputs', () => {
    it('should have eyebrow signal', () => {
      expect(typeof component.eyebrow).toBe('function');
    });

    it('should have title signal', () => {
      expect(typeof component.title).toBe('function');
    });

    it('should have description signal', () => {
      expect(typeof component.description).toBe('function');
    });
  });

  describe('CSS Classes', () => {
    it('should apply page-header CSS class', () => {
      const header = compiled.query(By.css('.page-header'));
      expect(header.nativeElement.classList.contains('page-header')).toBe(true);
    });

    it('should apply page-header__content CSS class', () => {
      const content = compiled.query(By.css('.page-header__content'));
      expect(content.nativeElement.classList.contains('page-header__content')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic header element', () => {
      const header = compiled.query(By.css('header.page-header'));
      expect(header).toBeTruthy();
    });
  });
});
