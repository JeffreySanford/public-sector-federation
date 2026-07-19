import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PublicButtonComponent, PublicTagComponent } from '@public-sector/ui-patterns';
import { PublicSectorThemeService, PublicSectorThemeVariant } from '@public-sector/primeng-preset';

@Component({
  selector: 'public-sector-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, PublicButtonComponent, PublicTagComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly links = [
    { path: '/services', label: 'Citizen Services' },
    { path: '/reporting', label: 'Reporting' },
    { path: '/admin', label: 'Administration' },
    { path: '/qa', label: 'QA Components' },
  ];
  readonly documentationUrl =
    window.location.port === '4200'
      ? `${window.location.protocol}//${window.location.hostname}:4321/docs/`
      : '/docs/';
  readonly themeVariants: { label: string; value: PublicSectorThemeVariant }[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Vibrant', value: 'vibrant' },
    { label: 'Pastel', value: 'pastel' },
  ];

  constructor(readonly theme: PublicSectorThemeService) {}
}
