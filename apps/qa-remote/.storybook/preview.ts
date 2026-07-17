import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';

const applyTheme = (variant: string, mode: string) => {
  document.documentElement.classList.remove('p-dark', 'ps-theme-vibrant', 'ps-theme-pastel');

  if (mode === 'dark') {
    document.documentElement.classList.add('p-dark');
  }

  if (variant !== 'neutral') {
    document.documentElement.classList.add(`ps-theme-${variant}`);
  }
};

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [providePublicSectorPrimeNG()],
    }),
    (storyFn, context) => {
      applyTheme(String(context.globals['themeVariant'] ?? 'neutral'), String(context.globals['themeMode'] ?? 'light'));
      return storyFn();
    },
  ],
  globalTypes: {
    themeVariant: {
      description: 'Public-sector theme variant',
      defaultValue: 'neutral',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['neutral', 'vibrant', 'pastel'],
      },
    },
    themeMode: {
      description: 'Light or dark mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: ['light', 'dark'],
      },
    },
  },
  parameters: {
    a11y: {
      test: 'todo',
    },
    docs: {
      extractArgTypes: () => ({}),
    },
    options: {
      storySort: {
        order: ['Design System', ['Candidates', 'Acceptance', 'Components', 'PrimeNG Playground', 'Problem Areas']],
      },
    },
  },
};

export default preview;
