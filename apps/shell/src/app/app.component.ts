import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PublicSectorThemeService, PublicSectorThemeVariant } from '@public-sector/primeng-preset';

@Component({
  selector: 'public-sector-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, PublicButtonComponent, CardModule, TagModule],
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
  readonly themeVariants: { label: string; value: PublicSectorThemeVariant }[] = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Vibrant', value: 'vibrant' },
    { label: 'Pastel', value: 'pastel' },
  ];

  constructor(readonly theme: PublicSectorThemeService) {}
}
