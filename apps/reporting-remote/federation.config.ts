export default {
  name: 'reporting',
  exposes: {
    './web-component': './apps/reporting-remote/src/main.ts',
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/elements': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/platform-browser': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    primeng: { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@public-sector/tokens': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@public-sector/primeng-preset': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },
  skip: [/^@primeuix\//, /^@module-federation\//],
};
