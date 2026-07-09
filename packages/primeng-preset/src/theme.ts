import { Injectable, signal } from '@angular/core';

const DARK_CLASS = 'p-dark';
const THEME_CLASSES = ['ps-theme-vibrant', 'ps-theme-pastel'] as const;

export type PublicSectorThemeVariant = 'neutral' | 'vibrant' | 'pastel';

@Injectable({ providedIn: 'root' })
export class PublicSectorThemeService {
  readonly isDark = signal(false);
  readonly variant = signal<PublicSectorThemeVariant>('neutral');

  constructor() {
    if (typeof document !== 'undefined') {
      this.isDark.set(document.documentElement.classList.contains(DARK_CLASS));
      this.variant.set(this.detectVariant());
      this.applyVariant(this.variant());
    }
  }

  setDarkMode(isDark: boolean): void {
    this.isDark.set(isDark);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle(DARK_CLASS, isDark);
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDark());
  }

  setVariant(variant: PublicSectorThemeVariant): void {
    this.variant.set(variant);
    this.applyVariant(variant);
  }

  private applyVariant(variant: PublicSectorThemeVariant): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.remove(...THEME_CLASSES);
    if (variant !== 'neutral') {
      document.documentElement.classList.add(`ps-theme-${variant}`);
    }
  }

  private detectVariant(): PublicSectorThemeVariant {
    if (typeof document === 'undefined') {
      return 'neutral';
    }

    if (document.documentElement.classList.contains('ps-theme-vibrant')) {
      return 'vibrant';
    }

    if (document.documentElement.classList.contains('ps-theme-pastel')) {
      return 'pastel';
    }

    return 'neutral';
  }
}
