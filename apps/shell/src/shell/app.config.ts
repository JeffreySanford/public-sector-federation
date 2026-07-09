import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    providePublicSectorPrimeNG(),
  ],
};
