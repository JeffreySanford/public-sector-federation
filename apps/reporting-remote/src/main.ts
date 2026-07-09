import { provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
import { ReportingRemoteComponent } from './remote/reporting-remote.component';

createApplication({
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    MessageService,
    providePublicSectorPrimeNG(),
  ],
})
  .then((appRef) => {
    const element = createCustomElement(ReportingRemoteComponent, {
      injector: appRef.injector,
    });

    if (!customElements.get('public-reporting-root')) {
      customElements.define('public-reporting-root', element);
    }
  })
  .catch((error) => console.error(error));
