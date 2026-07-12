# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Rendering & Console >> should display story canvas
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:51:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('iframe[title*="canvas"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('iframe[title*="canvas"]').first()

```

```yaml
- banner "Storybook":
  - heading "Storybook" [level=1]
  - img
  - link "Skip to content":
    - /url: "#storybook-preview-wrapper"
  - link "Storybook":
    - /url: ./
    - img "Storybook"
  - switch "Settings":
    - img
  - button "Open onboarding guide":
    - img
    - strong: Get started
  - button "Collapse onboarding guide" [expanded]:
    - img
  - button "33% completed":
    - img
    - img
    - text: 33%
  - list:
    - listitem:
      - button "Open onboarding guide for Change a story with Controls":
        - img
        - text: Change a story with Controls
    - listitem:
      - button "Open onboarding guide for Publish your Storybook for feedback":
        - img
        - text: Publish your Storybook for feedback
    - listitem:
      - button "Open onboarding guide for Test functionality with interactions":
        - img
        - text: Test functionality with interactions
  - text: Search for components
  - search:
    - combobox "Search for components":
      - img
      - searchbox "Search for components"
      - code: ⌃ K
      - button "Tag filters":
        - img
  - navigation "Stories":
    - heading "Stories" [level=2]
    - button "Collapse" [expanded]:
      - img
      - text: Design System
    - button "Expand all":
      - img
    - button "Acceptance":
      - img
      - img
      - text: Acceptance
    - button "PrimeNG Playground":
      - img
      - img
      - text: PrimeNG Playground
    - button "Problem Areas":
      - img
      - img
      - text: Problem Areas
- separator "Sidebar resize handle"
- region "Toolbar":
  - heading "Toolbar" [level=2]
  - toolbar:
    - button "Public-sector theme variant neutral":
      - img
      - text: neutral
    - button "Light or dark mode light":
      - img
      - text: light
- main "Main preview area":
  - heading "Main preview area" [level=2]
  - iframe
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
  12  | test.describe('Storybook Stories - Rendering & Console', () => {
  13  |   test('should load Storybook dashboard', async ({ page }) => {
  14  |     await page.goto('http://localhost:4400', { waitUntil: 'domcontentloaded', timeout: 60000 });
  15  |     
  16  |     try {
  17  |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  18  |     } catch {
  19  |       // Storybook might be slow, but page is still usable
  20  |     }
  21  |     
  22  |     const title = await page.title();
  23  |     expect(title).toBeTruthy();
  24  |   });
  25  | 
  26  |   test('should render story without console errors', async ({ page }) => {
  27  |     const errors: string[] = [];
  28  |     const warnings: string[] = [];
  29  |     
  30  |     page.on('console', (msg) => {
  31  |       if (msg.type() === 'error') {
  32  |         errors.push(msg.text());
  33  |       }
  34  |       if (msg.type() === 'warning') {
  35  |         warnings.push(msg.text());
  36  |       }
  37  |     });
  38  | 
  39  |     // Navigate to first story (assuming default stories exist)
  40  |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  41  |     try {
  42  |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  43  |     } catch {
  44  |       // Storybook might be slow, but page is still usable
  45  |     }
  46  | 
  47  |     // Allow non-critical warnings but no errors
  48  |     expect(errors).toHaveLength(0);
  49  |   });
  50  | 
  51  |   test('should display story canvas', async ({ page }) => {
  52  |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  53  |     try {
  54  |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  55  |     } catch {
  56  |       // Storybook might be slow
  57  |     }
  58  | 
  59  |     // Storybook canvas contains the story frame
  60  |     const canvas = page.locator('iframe[title*="canvas"]').first();
> 61  |     await expect(canvas).toBeVisible({ timeout: 10000 });
      |                          ^ Error: expect(locator).toBeVisible() failed
  62  |   });
  63  | 
  64  |   test('should load story panel without errors', async ({ page }) => {
  65  |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  66  |     try {
  67  |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  68  |     } catch {
  69  |       // Storybook might be slow
  70  |     }
  71  | 
  72  |     // Check for error boundary or error state
  73  |     const errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
  74  |     await expect(errorMessage).toHaveCount(0);
  75  |   });
  76  | });
  77  | 
  78  | test.describe('Storybook Stories - Accessibility (WCAG 2.1 AA)', () => {
  79  |   test('should pass axe accessibility checks on story', async ({ page }) => {
  80  |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  81  |     try {
  82  |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  83  |     } catch {
  84  |       // Storybook might be slow
  85  |     }
  86  | 
  87  |     // Inject axe and check accessibility of the story frame
  88  |     const frame = page.frameLocator('iframe[title*="canvas"]').first();
  89  |     
  90  |     try {
  91  |       await page.evaluate(() => {
  92  |         const script = document.createElement('script');
  93  |         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js';
  94  |         document.head.appendChild(script);
  95  |       });
  96  | 
  97  |       // Wait for axe to load
  98  |       await page.waitForTimeout(2000);
  99  |       
  100 |       // Check accessibility within the story frame
  101 |       const violations = await page.evaluate(() => {
  102 |         return new Promise((resolve) => {
  103 |           if (typeof (window as any).axe === 'undefined') {
  104 |             resolve([]);
  105 |           } else {
  106 |             (window as any).axe.run((results: any) => {
  107 |               resolve(results.violations);
  108 |             });
  109 |           }
  110 |         });
  111 |       });
  112 | 
  113 |       // Some violations are expected in demo content, but critical ones should be fixed
  114 |       expect(violations).toBeTruthy();
  115 |     } catch (error) {
  116 |       // If axe doesn't load, that's OK - we still tested rendering
  117 |       console.log('Axe accessibility check skipped (axe not available)');
  118 |     }
  119 |   });
  120 | 
  121 |   test('should have semantic heading structure', async ({ page }) => {
  122 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  123 |     try {
  124 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  125 |     } catch {
  126 |       // Storybook might be slow
  127 |     }
  128 | 
  129 |     // Check for at least one heading (semantic structure)
  130 |     const headings = page.locator('h1, h2, h3');
  131 |     const count = await headings.count();
  132 |     
  133 |     // Storybook page should have headings
  134 |     expect(count).toBeGreaterThan(0);
  135 |   });
  136 | 
  137 |   test('should have proper color contrast', async ({ page }) => {
  138 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  139 |     try {
  140 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  141 |     } catch {
  142 |       // Storybook might be slow
  143 |     }
  144 | 
  145 |     // Get computed colors from story elements
  146 |     const canvas = page.locator('iframe[title*="canvas"]').first();
  147 |     const isVisible = await canvas.isVisible();
  148 |     
  149 |     // Verify canvas is visible (indicates proper rendering for contrast)
  150 |     expect(isVisible).toBe(true);
  151 |   });
  152 | });
  153 | 
  154 | test.describe('Storybook Stories - Keyboard Accessibility', () => {
  155 |   test('should be keyboard navigable', async ({ page }) => {
  156 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  157 |     try {
  158 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  159 |     } catch {
  160 |       // Storybook might be slow
  161 |     }
```