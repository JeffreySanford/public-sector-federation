const { chromium } = require('playwright');

module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:4322/docs/',
        'http://127.0.0.1:4322/docs/components/',
        'http://127.0.0.1:4322/docs/architecture/',
      ],
      numberOfRuns: 1,
      startServerCommand: 'pnpm --dir apps/starlight preview',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 120000,
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 2500000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 1500000 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 4 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 4 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'artifacts/lighthouse/starlight',
    },
  },
};
