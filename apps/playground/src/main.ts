import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { MessageService } from 'primeng/api';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
import { PlaygroundComponent } from './playground.component';

const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    MessageService,
    providePublicSectorPrimeNG(),
  ],
};

bootstrapApplication(PlaygroundComponent, appConfig).catch((error) => console.error(error));
