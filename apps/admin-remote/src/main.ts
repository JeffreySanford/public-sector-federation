import { provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
import { AdminRemoteComponent } from './remote/admin-remote.component';

createApplication({
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    MessageService,
    providePublicSectorPrimeNG(),
  ],
})
  .then((appRef) => {
    const element = createCustomElement(AdminRemoteComponent, {
      injector: appRef.injector,
    });

    if (!customElements.get('public-admin-root')) {
      customElements.define('public-admin-root', element);
    }
  })
  .catch((error) => console.error(error));
