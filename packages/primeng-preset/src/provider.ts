import { providePrimeNG } from 'primeng/config';
import { publicSectorPassThrough } from './passthrough';
import preset from './preset';

export function providePublicSectorPrimeNG() {
  return providePrimeNG({
    theme: {
      preset,
      options: {
        darkModeSelector: '.p-dark',
        cssLayer: {
          name: 'primeng',
          order: 'reset, primeng, app',
        },
      },
    },
    ripple: true,
    inputVariant: 'outlined',
    overlayAppendTo: 'body',
    pt: publicSectorPassThrough,
    zIndex: {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1200,
    },
  });
}
