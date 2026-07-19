import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * Tests the module federation shell and remote apps.
 *
 * Starlight owns a separate built-site configuration and quality gate because
 * its server, base path, visual baselines, and accessibility checks differ
 * from the Angular federation applications.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['**/e2e/**/*.spec.ts', '*.test.ts'],
  testIgnore: ['apps/starlight/tests/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  webServer: [
    {
      command: 'pnpm start:frontend',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'pnpm nx run qa-remote:storybook',
      url: 'http://localhost:4400',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  timeout: 60000,
  expect: { timeout: 10000 },
});
