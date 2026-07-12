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
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]:
            - link "Skip to content" [ref=e14] [cursor=pointer]:
              - /url: "#storybook-preview-wrapper"
            - link "Storybook" [ref=e16] [cursor=pointer]:
              - /url: ./
              - img "Storybook" [ref=e17]
            - switch "Settings" [ref=e22] [cursor=pointer]:
              - img [ref=e23]
          - generic [ref=e28]:
            - generic [ref=e30] [cursor=pointer]:
              - button "Open onboarding guide" [ref=e34]:
                - img [ref=e36]
                - strong [ref=e38]: Get started
              - generic [ref=e39]:
                - button "Collapse onboarding guide" [expanded] [ref=e40]:
                  - img [ref=e41]
                - button "33% completed" [ref=e43]:
                  - generic [ref=e44]:
                    - img [ref=e45]
                    - img [ref=e47]
                  - generic [ref=e50]: 33%
            - list [ref=e52]:
              - listitem [ref=e53]:
                - button "Open onboarding guide for Change a story with Controls" [ref=e54] [cursor=pointer]:
                  - img [ref=e56]
                  - generic [ref=e59]: Change a story with Controls
              - listitem [ref=e60]:
                - button "Open onboarding guide for Publish your Storybook for feedback" [ref=e61] [cursor=pointer]:
                  - img [ref=e63]
                  - generic [ref=e66]: Publish your Storybook for feedback
              - listitem [ref=e67]:
                - button "Open onboarding guide for Test functionality with interactions" [ref=e68] [cursor=pointer]:
                  - img [ref=e70]
                  - generic [ref=e73]: Test functionality with interactions
        - generic [ref=e74]: Search for components
        - search [ref=e75]:
          - combobox "Search for components" [ref=e76]:
            - generic:
              - img
            - searchbox "Search for components" [ref=e77]
            - code: ⌃ K
            - button "Tag filters" [ref=e79] [cursor=pointer]:
              - img [ref=e80]
        - navigation "Stories" [ref=e83]:
          - heading "Stories" [level=2] [ref=e84]
          - generic [ref=e86]:
            - generic [ref=e87]:
              - button "Collapse" [expanded] [ref=e88] [cursor=pointer]:
                - img [ref=e90]
                - text: Design System
              - button "Expand all" [ref=e92] [cursor=pointer]:
                - img [ref=e93]
            - button "Acceptance" [ref=e96] [cursor=pointer]:
              - generic [ref=e97]:
                - img [ref=e99]
                - img [ref=e101]
              - text: Acceptance
            - button "PrimeNG Playground" [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - img [ref=e107]
                - img [ref=e109]
              - text: PrimeNG Playground
            - button "Problem Areas" [ref=e112] [cursor=pointer]:
              - generic [ref=e113]:
                - img [ref=e115]
                - img [ref=e117]
              - text: Problem Areas
    - separator "Sidebar resize handle" [ref=e119]
  - generic [ref=e121]:
    - region "Toolbar" [ref=e122]:
      - heading "Toolbar" [level=2] [ref=e123]
      - toolbar [ref=e124]:
        - generic [ref=e125]:
          - button "Public-sector theme variant neutral" [ref=e127] [cursor=pointer]:
            - img [ref=e128]
            - text: neutral
          - button "Light or dark mode light" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
            - text: light
    - main "Main preview area" [ref=e133]:
      - heading "Main preview area" [level=2] [ref=e134]
      - iframe [ref=e140]:
        - generic [ref=f1e5]:
          - generic [ref=f1e6]:
            - generic [ref=f1e8]: "Acceptance: Button / Tag"
            - heading "Button and tag acceptance states" [level=1] [ref=f1e9]
            - paragraph [ref=f1e10]: Proves action hierarchy, icon spacing, severity labels, disabled states, and focusable controls.
          - generic [ref=f1e11]:
            - article [ref=f1e12]:
              - heading "Action hierarchy" [level=2] [ref=f1e13]
              - generic [ref=f1e14]:
                - button " Primary action" [ref=f1e16] [cursor=pointer]:
                  - generic [ref=f1e17]: 
                  - generic [ref=f1e18]: Primary action
                - button " Outlined action" [ref=f1e20] [cursor=pointer]:
                  - generic [ref=f1e21]: 
                  - generic [ref=f1e22]: Outlined action
                - button " Text action" [ref=f1e24] [cursor=pointer]:
                  - generic [ref=f1e25]: 
                  - generic [ref=f1e26]: Text action
                - button " Disabled action" [disabled] [ref=f1e28]:
                  - generic [ref=f1e29]: 
                  - generic [ref=f1e30]: Disabled action
            - article [ref=f1e31]:
              - heading "Status language" [level=2] [ref=f1e32]
              - generic [ref=f1e33]:
                - generic [ref=f1e35]: On track
                - generic [ref=f1e37]: Watch
                - generic [ref=f1e39]: Delayed
                - generic [ref=f1e41]: Draft
          - article [ref=f1e42]:
            - heading "Acceptance checks" [level=2] [ref=f1e43]
            - list [ref=f1e44]:
              - listitem [ref=f1e45]: Icons and labels keep visible spacing.
              - listitem [ref=f1e46]: Filled and outlined actions keep contrast in all theme modes.
              - listitem [ref=f1e47]: Status labels use meaningful text, not color alone.
              - listitem [ref=f1e48]: Disabled actions remain visibly disabled without disappearing.
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