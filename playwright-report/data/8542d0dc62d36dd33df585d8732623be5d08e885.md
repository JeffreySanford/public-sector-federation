# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Rendering & Console >> should render story without console errors
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:33:7

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:4400/?path=/story/design-system-acceptance-button-and-tag--states", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Storybook Story Validation E2E Tests
  5   |  * Tests story rendering, accessibility, and component coverage
  6   |  * Stories are served at localhost:4400 by Playwright webServer config
  7   |  */
  8   | 
  9   | // Increase timeout for Storybook tests since build can be slow
  10  | test.setTimeout(60 * 1000);
  11  | 
  12  | const storybookHomeUrl = 'http://localhost:4400';
  13  | const storybookStoryUrl = `${storybookHomeUrl}/?path=/story/design-system-acceptance-button-and-tag--states`;
  14  | 
  15  | async function gotoStorybookHome(page: import('@playwright/test').Page): Promise<void> {
  16  |   await page.goto(storybookHomeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  17  |   await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  18  | }
  19  | 
  20  | async function gotoStory(page: import('@playwright/test').Page): Promise<void> {
> 21  |   await page.goto(storybookStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      |              ^ Error: page.goto: Could not connect to server
  22  |   await page.locator('#storybook-preview-iframe').waitFor({ state: 'visible', timeout: 20000 });
  23  | }
  24  | 
  25  | test.describe('Storybook Stories - Rendering & Console', () => {
  26  |   test('should load Storybook dashboard', async ({ page }) => {
  27  |     await gotoStorybookHome(page);
  28  |     
  29  |     const title = await page.title();
  30  |     expect(title).toBeTruthy();
  31  |   });
  32  | 
  33  |   test('should render story without console errors', async ({ page }) => {
  34  |     const errors: string[] = [];
  35  |     const warnings: string[] = [];
  36  |     
  37  |     page.on('console', (msg) => {
  38  |       if (msg.type() === 'error') {
  39  |         errors.push(msg.text());
  40  |       }
  41  |       if (msg.type() === 'warning') {
  42  |         warnings.push(msg.text());
  43  |       }
  44  |     });
  45  | 
  46  |     await gotoStory(page);
  47  | 
  48  |     // Allow non-critical warnings but no errors
  49  |     expect(errors).toHaveLength(0);
  50  |   });
  51  | 
  52  |   test('should display story canvas', async ({ page }) => {
  53  |     await gotoStory(page);
  54  | 
  55  |     await expect(page.locator('#storybook-preview-iframe')).toBeVisible({ timeout: 10000 });
  56  |   });
  57  | 
  58  |   test('should load story panel without errors', async ({ page }) => {
  59  |     await gotoStory(page);
  60  | 
  61  |     // Check for error boundary or error state
  62  |     const errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
  63  |     await expect(errorMessage).toHaveCount(0);
  64  |   });
  65  | });
  66  | 
  67  | test.describe('Storybook Stories - Accessibility (WCAG 2.1 AA)', () => {
  68  |   test('should render Button and Tag components with correct styling', async ({ page }) => {
  69  |     // Navigate to Button/Tag story
  70  |     await page.goto('http://localhost:4400/?path=/story/design-system-acceptance-button-tag--states', {
  71  |       waitUntil: 'domcontentloaded',
  72  |       timeout: 60000,
  73  |     });
  74  | 
  75  |     // Wait for Storybook to fully load
  76  |     await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  77  |     
  78  |     // Verify the story page loaded with a title
  79  |     const pageTitle = await page.title();
  80  |     expect(pageTitle.length).toBeGreaterThan(0);
  81  | 
  82  |     // Check that the preview iframe is visible
  83  |     const previewIframe = page.locator('#storybook-preview-iframe');
  84  |     await expect(previewIframe).toBeVisible({ timeout: 10000 });
  85  | 
  86  |     // Verify the story loaded without throwing errors
  87  |     const consoleErrors: string[] = [];
  88  |     page.on('console', (msg) => {
  89  |       if (msg.type() === 'error') {
  90  |         consoleErrors.push(msg.text());
  91  |       }
  92  |     });
  93  | 
  94  |     // Simple validation - the story rendered without critical errors
  95  |     expect(consoleErrors.length).toBeLessThan(3); // Allow some non-critical warnings
  96  |   });
  97  | 
  98  |   test('should have semantic heading structure', async ({ page }) => {
  99  |     await gotoStory(page);
  100 | 
  101 |     // Check for at least one heading (semantic structure)
  102 |     const headings = page.locator('h1, h2, h3');
  103 |     const count = await headings.count();
  104 |     
  105 |     // Storybook page should have headings
  106 |     expect(count).toBeGreaterThan(0);
  107 |   });
  108 | 
  109 |   test('should have proper color contrast', async ({ page }) => {
  110 |     await gotoStory(page);
  111 | 
  112 |     await expect(page.locator('body')).toBeVisible();
  113 |     await expect(page.locator('#storybook-preview-iframe')).toBeVisible();
  114 |   });
  115 | });
  116 | 
  117 | test.describe('Storybook Stories - Keyboard Accessibility', () => {
  118 |   test('should be keyboard navigable', async ({ page }) => {
  119 |     await gotoStory(page);
  120 | 
  121 |     // Tab through Storybook UI elements
```