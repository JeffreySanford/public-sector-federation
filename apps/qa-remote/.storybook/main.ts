import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (webpackConfig) => ({
    ...webpackConfig,
    performance: false,
  }),
};

export default config;

