# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Table Paginator Functionality >> should change rows per page
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:324:7

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:4400/?path=/story/design-system-acceptance-table-paginator--sort-filter-and-page", waiting until "domcontentloaded"

```

# Test source

```ts
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
  293 |     await expect(pageInfo).toContainText('Page 1');
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
> 325 |     await page.goto(tableStoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      |                ^ Error: page.goto: Could not connect to server
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