import { defineConfig, devices } from '@playwright/test';

const reuseExistingServer = !process.env.CI;
const requestedWorkers = Number.parseInt(process.env.PW_WORKERS ?? '4', 10);
const localWorkers = Number.isFinite(requestedWorkers) && requestedWorkers > 0 ? requestedWorkers : 4;

/**
 * Playwright configuration for the federated shell, remotes, and Storybook.
 * Each development server is tracked independently so an existing process on
 * one port can be reused without preventing the remaining servers from starting.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['**/e2e/**/*.spec.ts', '*.test.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : localWorkers,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm serve:shell',
      url: 'http://localhost:4200',
      reuseExistingServer,
      timeout: 120000,
    },
    {
      command: 'pnpm serve:services',
      url: 'http://localhost:4201',
      reuseExistingServer,
      timeout: 120000,
    },
    {
      command: 'pnpm serve:reporting',
      url: 'http://localhost:4202',
      reuseExistingServer,
      timeout: 120000,
    },
    {
      command: 'pnpm serve:admin',
      url: 'http://localhost:4203',
      reuseExistingServer,
      timeout: 120000,
    },
    {
      command: 'pnpm serve:qa',
      url: 'http://localhost:4204',
      reuseExistingServer,
      timeout: 120000,
    },
    {
      command: 'pnpm storybook:qa',
      url: 'http://localhost:4400',
      reuseExistingServer,
      timeout: 180000,
    },
  ],
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
  timeout: 30000,
  expect: { timeout: 10000 },
});
