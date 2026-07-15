import { provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
import { QaWorkspaceComponent } from './app/components/qa-workspace.component';

createApplication({
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    providePublicSectorPrimeNG(),
  ],
})
  .then((appRef) => {
    const element = createCustomElement(QaWorkspaceComponent, {
      injector: appRef.injector,
    });

    if (!customElements.get('public-qa-root')) {
      customElements.define('public-qa-root', element);
    }
  })
  .catch((error) => console.error(error));
