# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Accessibility (WCAG 2.1 AA) >> should have proper color contrast
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:137:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - banner "Storybook" [ref=e6]:
      - heading "Storybook" [level=1] [ref=e7]
      - img
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - link "Skip to content" [ref=e31] [cursor=pointer]:
              - /url: "#storybook-preview-wrapper"
            - link "Storybook" [ref=e33]:
              - /url: ./
              - img "Storybook" [ref=e34]
            - switch "Settings" [ref=e41] [cursor=pointer]:
              - img [ref=e42]
          - generic [ref=e47]:
            - generic [ref=e49] [cursor=pointer]:
              - button "Open onboarding guide" [ref=e53]:
                - img [ref=e55]
                - strong [ref=e57]: Get started
              - generic [ref=e58]:
                - button "Collapse onboarding guide" [expanded] [ref=e59]:
                  - img [ref=e60]
                - button "33% completed" [ref=e62]:
                  - generic [ref=e63]:
                    - img [ref=e64]
                    - img [ref=e66]
                  - generic [ref=e69]: 33%
            - list [ref=e71]:
              - listitem [ref=e72]:
                - button "Open onboarding guide for Change a story with Controls" [ref=e73] [cursor=pointer]:
                  - img [ref=e75]
                  - generic [ref=e78]: Change a story with Controls
              - listitem [ref=e79]:
                - button "Open onboarding guide for Publish your Storybook for feedback" [ref=e80] [cursor=pointer]:
                  - img [ref=e82]
                  - generic [ref=e85]: Publish your Storybook for feedback
              - listitem [ref=e86]:
                - button "Open onboarding guide for Test functionality with interactions" [ref=e87] [cursor=pointer]:
                  - img [ref=e89]
                  - generic [ref=e92]: Test functionality with interactions
        - generic [ref=e93]: Search for components
        - search [ref=e94]:
          - combobox "Search for components" [ref=e95]:
            - generic:
              - img
            - searchbox "Search for components" [ref=e96]
            - code: ⌃ K
            - button "Tag filters" [ref=e98] [cursor=pointer]:
              - img [ref=e99]
        - navigation "Stories" [ref=e102]:
          - heading "Stories" [level=2] [ref=e103]
          - generic [ref=e105]:
            - generic [ref=e106]:
              - button "Collapse" [expanded] [ref=e107] [cursor=pointer]:
                - img [ref=e109]
                - text: Design System
              - button "Expand all" [ref=e111] [cursor=pointer]:
                - img [ref=e112]
            - button "Acceptance" [ref=e115] [cursor=pointer]:
              - generic [ref=e116]:
                - img [ref=e118]
                - img [ref=e120]
              - text: Acceptance
            - button "PrimeNG Playground" [ref=e123] [cursor=pointer]:
              - generic [ref=e124]:
                - img [ref=e126]
                - img [ref=e128]
              - text: PrimeNG Playground
            - button "Problem Areas" [ref=e131] [cursor=pointer]:
              - generic [ref=e132]:
                - img [ref=e134]
                - img [ref=e136]
              - text: Problem Areas
    - separator "Sidebar resize handle" [ref=e138]
  - generic [ref=e140]:
    - region "Toolbar" [ref=e141]:
      - heading "Toolbar" [level=2] [ref=e142]
      - toolbar [ref=e143]
    - main "Main preview area" [ref=e144]:
      - heading "Main preview area" [level=2] [ref=e145]
      - generic [ref=e146]:
        - progressbar "Content is loading..." [ref=e148]
        - iframe [ref=e153]:
          
```

# Test source

```ts
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
  61  |     await expect(canvas).toBeVisible({ timeout: 10000 });
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
> 150 |     expect(isVisible).toBe(true);
      |                       ^ Error: expect(received).toBe(expected) // Object.is equality
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
  162 | 
  163 |     // Tab through Storybook UI elements
  164 |     await page.keyboard.press('Tab');
  165 |     await page.keyboard.press('Tab');
  166 |     await page.keyboard.press('Tab');
  167 | 
  168 |     // Should not throw or get stuck
  169 |     const focusedElement = await page.evaluate(() => {
  170 |       return (document.activeElement as HTMLElement)?.tagName;
  171 |     });
  172 | 
  173 |     expect(focusedElement).toBeTruthy();
  174 |   });
  175 | 
  176 |   test('should support Enter key on interactive elements', async ({ page }) => {
  177 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  178 |     try {
  179 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  180 |     } catch {
  181 |       // Storybook might be slow
  182 |     }
  183 | 
  184 |     // Find a focusable element
  185 |     const button = page.locator('button').first();
  186 |     const isVisible = await button.isVisible().catch(() => false);
  187 | 
  188 |     if (isVisible) {
  189 |       await button.focus();
  190 |       // Press Enter should not throw
  191 |       await button.press('Enter');
  192 |     }
  193 | 
  194 |     // Test passed if no error
  195 |     expect(true).toBe(true);
  196 |   });
  197 | 
  198 |   test('should have visible focus indicators', async ({ page }) => {
  199 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  200 |     try {
  201 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  202 |     } catch {
  203 |       // Storybook might be slow
  204 |     }
  205 | 
  206 |     // Focus an element
  207 |     const focusableElement = page.locator('button, a, input').first();
  208 |     const isVisible = await focusableElement.isVisible().catch(() => false);
  209 | 
  210 |     if (isVisible) {
  211 |       await focusableElement.focus();
  212 |       
  213 |       // Get focus state
  214 |       const hasFocusClass = await focusableElement.evaluate((el) => {
  215 |         const computed = window.getComputedStyle(el);
  216 |         return computed.outline !== 'none' || computed.boxShadow !== 'none';
  217 |       }).catch(() => false);
  218 | 
  219 |       // Either has focus indicator or is visible (which is enough)
  220 |       expect(focusableElement).toBeVisible();
  221 |     }
  222 |   });
  223 | });
  224 | 
  225 | test.describe('Storybook Stories - Props & Controls', () => {
  226 |   test('should display story controls panel', async ({ page }) => {
  227 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  228 |     try {
  229 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  230 |     } catch {
  231 |       // Storybook might be slow
  232 |     }
  233 | 
  234 |     // Look for Storybook controls/docs panel
  235 |     const controlsPanel = page.locator('[role="tablist"]').filter({ hasText: /controls|docs/i });
  236 |     const controlsPanelVisible = await controlsPanel.isVisible().catch(() => false);
  237 | 
  238 |     // Either controls are visible or story is simple (both are valid)
  239 |     expect(page).toBeTruthy();
  240 |   });
  241 | 
  242 |   test('should update story when controls change', async ({ page }) => {
  243 |     await page.goto('http://localhost:4400/?path=/story', { timeout: 60000 });
  244 |     try {
  245 |       await page.waitForLoadState('networkidle', { timeout: 20000 });
  246 |     } catch {
  247 |       // Storybook might be slow
  248 |     }
  249 | 
  250 |     // Get initial canvas content
```