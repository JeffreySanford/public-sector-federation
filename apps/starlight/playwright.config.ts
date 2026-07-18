import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['line'],
    ['html', { outputFolder: '../../playwright-report/starlight', open: 'never' }],
    ['junit', { outputFile: '../../test-results/starlight/junit.xml' }],
  ],
  outputDir: '../../test-results/starlight/artifacts',
  updateSnapshots: process.env.UPDATE_STARLIGHT_SNAPSHOTS === '1' ? 'all' : 'none',
  webServer: {
    command: 'pnpm nx run starlight:preview',
    url: 'http://127.0.0.1:4322/docs/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    },
  },
});
