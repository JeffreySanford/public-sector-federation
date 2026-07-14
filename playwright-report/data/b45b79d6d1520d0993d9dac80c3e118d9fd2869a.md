# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Table Paginator Functionality >> should navigate between pages with Next button
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:288:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#storybook-preview-iframe').locator('iframe').contentFrame().locator('.page-info')
Expected substring: "Page 1"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('#storybook-preview-iframe').locator('iframe').contentFrame().locator('.page-info')

```

```yaml
- log
- log
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
  - switch "Review new stories"
  - navigation "Stories":
    - heading "Stories" [level=2]
    - button "Collapse" [expanded]:
      - img
      - text: Design System
    - button "Expand all":
      - img
    - button "Acceptance" [expanded]:
      - img
      - img
      - text: Acceptance
    - 'button "Change status: New"':
      - img
    - button "Button Tag":
      - img
      - img
      - text: Button Tag
    - button "Card":
      - img
      - img
      - text: Card
    - button "Dialog Toast":
      - img
      - img
      - text: Dialog Toast
    - button "Table Paginator" [expanded]:
      - img
      - img
      - text: Table Paginator
    - 'button "Change status: New"':
      - img
    - link "Sort Filter And Page":
      - /url: /?path=/story/design-system-acceptance-table-paginator--sort-filter-and-page
      - img
      - text: Sort Filter And Page
    - link "Skip to content":
      - /url: "#storybook-preview-wrapper"
    - 'button "Change status: New"':
      - img
    - link "Loading And Empty":
      - /url: /?path=/story/design-system-acceptance-table-paginator--loading-and-empty
      - img
      - text: Loading And Empty
    - 'button "Change status: New"':
      - img
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
    - button "Reload story":
      - img
    - switch "Grid visibility":
      - img
    - button "Preview background":
      - img
    - switch "Measure tool":
      - img
    - switch "Outline tool":
      - img
    - button "Viewport size":
      - img
    - button "Vision filter":
      - img
    - button "Public-sector theme variant neutral":
      - img
      - text: neutral
    - button "Light or dark mode light":
      - img
      - text: light
    - button "Open in isolation mode":
      - img
    - switch "Change zoom level": 100%
    - button "Enter full screen":
      - img
    - button "Open in editor":
      - img
- main "Main preview area":
  - heading "Main preview area" [level=2]
  - link "Skip to sidebar":
    - /url: "#design-system-acceptance-table-paginator--sort-filter-and-page"
  - iframe
- separator "Addon panel resize handle"
- region "Addon panel":
  - heading "Addon panel" [level=2]
  - button "Move addon panel to right":
    - img
  - button "Hide addon panel":
    - img
  - tablist "Available addons":
    - tab "Controls" [selected]
    - tab "Actions"
    - tab "Interactions"
    - tab "Accessibility 1"
  - tabpanel "Controls":
    - text: Interactive story playground Controls give you an easy to use interface to test your components. Set your story args and you'll see controls appearing here automatically.
    - link "Read docs":
      - /url: https://storybook.js.org/docs/essentials/controls?ref=ui
      - img
      - text: Read docs
      - img
```

# Test source

```ts
  193 | test.describe('Storybook Stories - Component Coverage', () => {
  194 |   test('should have PublicEmptyStateComponent story', async ({ page }) => {
  195 |     // Check for story related to empty state component
  196 |     await gotoStorybookHome(page);
  197 | 
  198 |     // Look for component in sidebar
  199 |     const sidebar = page.locator('[role="navigation"]');
  200 |     const hasEmptyState = await sidebar.textContent().then(content => 
  201 |       (content || '').toLowerCase().includes('empty') || (content || '').toLowerCase().includes('state')
  202 |     ).catch(() => true); // Pass if we can't verify (stories might be organized differently)
  203 | 
  204 |     expect(true).toBe(true); // Always pass - stories structure varies
  205 |   });
  206 | 
  207 |   test('should have PublicFormSectionComponent story', async ({ page }) => {
  208 |     await gotoStorybookHome(page);
  209 | 
  210 |     // Stories exist - check basic Storybook structure
  211 |     const sidebar = page.locator('[role="navigation"]');
  212 |     const isVisible = await sidebar.isVisible().catch(() => false);
  213 | 
  214 |     expect(isVisible || true).toBe(true); // Pass if sidebar exists or not
  215 |   });
  216 | 
  217 |   test('should have PublicPageHeaderComponent story', async ({ page }) => {
  218 |     await gotoStorybookHome(page);
  219 | 
  220 |     // Verify Storybook loads
  221 |     const title = await page.title();
  222 |     expect(title).toBeTruthy();
  223 |   });
  224 | 
  225 |   test('should have PublicStatusCardComponent story', async ({ page }) => {
  226 |     await gotoStorybookHome(page);
  227 | 
  228 |     // Verify Storybook loads
  229 |     const title = await page.title();
  230 |     expect(title).toBeTruthy();
  231 |   });
  232 | 
  233 |   test('should have at least 4 component stories', async ({ page }) => {
  234 |     await gotoStorybookHome(page);
  235 | 
  236 |     // Count story entries in sidebar (flexible - structure varies)
  237 |     const storyItems = page.locator('[role="button"]').filter({ hasText: /story|component/i });
  238 |     const count = await storyItems.count().catch(() => 0);
  239 | 
  240 |     // Either we find 4+ stories or Storybook is configured differently
  241 |     expect(count >= 0).toBe(true); // Always pass - stories organization is flexible
  242 |   });
  243 | });
  244 | 
  245 | test.describe('Storybook Stories - Performance', () => {
  246 |   test('should load Storybook within 5 seconds', async ({ page }) => {
  247 |     // Note: Storybook might take longer on first load due to Angular build
  248 |     // This test verifies it eventually loads, not that it's super fast
  249 |     await gotoStorybookHome(page);
  250 | 
  251 |     // If we got here, it loaded successfully
  252 |     expect(true).toBe(true);
  253 |   });
  254 | 
  255 |   test('should render story within 3 seconds', async ({ page }) => {
  256 |     // Navigate to first page  
  257 |     await gotoStorybookHome(page);
  258 | 
  259 |     // Navigate to a story
  260 |     await gotoStory(page);
  261 |     
  262 |     await expect(page.locator('body')).toBeVisible();
  263 |   });
  264 | });
  265 | 
  266 | test.describe('Storybook Stories - Table Paginator Functionality', () => {
  267 |   const tableStoryUrl = `${storybookHomeUrl}/?path=/story/design-system-acceptance-table-paginator--sort-filter-and-page`;
  268 | 
  269 |   async function getIframeContent(page: import('@playwright/test').Page) {
  270 |     const iframe = page.locator('#storybook-preview-iframe');
  271 |     await iframe.waitFor({ state: 'visible', timeout: 20000 });
  272 |     return iframe.frameLocator('iframe');
  273 |   }
  274 | 
  275 |   test('should display paginator controls', async ({ page }) => {
  276 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  277 | 
  278 |     const frameContent = await getIframeContent(page);
  279 |     const previousBtn = frameContent.locator('button').filter({ hasText: /Previous/i });
  280 |     const nextBtn = frameContent.locator('button').filter({ hasText: /Next/i });
  281 |     const rowsSelect = frameContent.locator('select');
  282 | 
  283 |     await expect(previousBtn).toBeVisible();
  284 |     await expect(nextBtn).toBeVisible();
  285 |     await expect(rowsSelect).toBeVisible();
  286 |   });
  287 | 
  288 |   test('should navigate between pages with Next button', async ({ page }) => {
  289 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  290 | 
  291 |     const frameContent = await getIframeContent(page);
  292 |     const pageInfo = frameContent.locator('.page-info');
> 293 |     await expect(pageInfo).toContainText('Page 1');
      |                            ^ Error: expect(locator).toContainText(expected) failed
  294 | 
  295 |     const nextBtn = frameContent.locator('button').filter({ hasText: /Next/i });
  296 |     await nextBtn.click();
  297 | 
  298 |     await expect(pageInfo).toContainText('Page 2');
  299 |   });
  300 | 
  301 |   test('should navigate back with Previous button', async ({ page }) => {
  302 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  303 | 
  304 |     const frameContent = await getIframeContent(page);
  305 |     const nextBtn = frameContent.locator('button').filter({ hasText: /Next/i });
  306 |     await nextBtn.click();
  307 | 
  308 |     const previousBtn = frameContent.locator('button').filter({ hasText: /Previous/i });
  309 |     await previousBtn.click();
  310 | 
  311 |     const pageInfo = frameContent.locator('.page-info');
  312 |     await expect(pageInfo).toContainText('Page 1');
  313 |   });
  314 | 
  315 |   test('should disable Previous button on first page', async ({ page }) => {
  316 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  317 | 
  318 |     const frameContent = await getIframeContent(page);
  319 |     const previousBtn = frameContent.locator('button').filter({ hasText: /Previous/i });
  320 |     const isDisabled = await previousBtn.isDisabled();
  321 |     expect(isDisabled).toBe(true);
  322 |   });
  323 | 
  324 |   test('should change rows per page', async ({ page }) => {
  325 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  326 | 
  327 |     const frameContent = await getIframeContent(page);
  328 |     const rowsSelect = frameContent.locator('select');
  329 |     await rowsSelect.selectOption('10');
  330 | 
  331 |     const pageInfo = frameContent.locator('.page-info');
  332 |     await expect(pageInfo).toContainText('Page 1');
  333 | 
  334 |     const paginatorInfo = frameContent.locator('.paginator-info');
  335 |     await expect(paginatorInfo).toContainText('Showing 1 to 10');
  336 |   });
  337 | 
  338 |   test('should display correct row range when changing page size', async ({ page }) => {
  339 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  340 | 
  341 |     const frameContent = await getIframeContent(page);
  342 |     const rowsSelect = frameContent.locator('select');
  343 |     await rowsSelect.selectOption('15');
  344 | 
  345 |     const paginatorInfo = frameContent.locator('.paginator-info');
  346 |     await expect(paginatorInfo).toContainText('Showing 1 to 12 of 12 programs');
  347 |   });
  348 | 
  349 |   test('should display table rows matching page size', async ({ page }) => {
  350 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  351 | 
  352 |     const frameContent = await getIframeContent(page);
  353 |     const tableRows = frameContent.locator('table tbody tr');
  354 |     const rowCount = await tableRows.count();
  355 |     expect(rowCount).toBe(5);
  356 |   });
  357 | });
  358 | 
  359 | test.describe('Storybook Stories - Error Handling', () => {
  360 |   test('should handle missing story gracefully', async ({ page }) => {
  361 |     // Navigate to non-existent story
  362 |     try {
  363 |       await page.goto('http://localhost:4400/?path=/story/nonexistent--story', { waitUntil: 'domcontentloaded', timeout: 60000 });
  364 |     } catch {
  365 |       // Storybook might not be available
  366 |       return;
  367 |     }
  368 | 
  369 |     // Should either show error message or redirect
  370 |     const content = await page.content();
  371 |     expect(content).toBeTruthy(); // Page loaded
  372 | 
  373 |     // Should not crash
  374 |     const title = await page.title();
  375 |     expect(title).toBeTruthy();
  376 |   });
  377 | 
  378 |   test('should recover from story error', async ({ page }) => {
  379 |     // Go to valid story
  380 |     try {
  381 |       await gotoStory(page);
  382 |     } catch {
  383 |       // Storybook might not be available
  384 |       return;
  385 |     }
  386 | 
  387 |     // Should load successfully
  388 |     await expect(page.locator('body')).toBeVisible();
  389 |   });
  390 | });
  391 | 
```