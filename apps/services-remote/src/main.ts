import { provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
import { ServicesRemoteComponent } from './remote/services-remote.component';

createApplication({
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    providePublicSectorPrimeNG(),
  ],
})
  .then((appRef) => {
    const element = createCustomElement(ServicesRemoteComponent, {
      injector: appRef.injector,
    });

    if (!customElements.get('public-services-root')) {
      customElements.define('public-services-root', element);
    }
  })
  .catch((error) => console.error(error));
