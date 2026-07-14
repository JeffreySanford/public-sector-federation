# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Table Paginator Functionality >> should display table rows matching page size
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:349:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - log
    - log [ref=e3]:
      - generic [ref=e4]: Component test is rendering.
  - generic [ref=e6]:
    - generic [ref=e7]:
      - banner "Storybook" [ref=e9]:
        - heading "Storybook" [level=1] [ref=e10]
        - img
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]:
              - link "Skip to content" [ref=e17] [cursor=pointer]:
                - /url: "#storybook-preview-wrapper"
              - link "Storybook" [ref=e19] [cursor=pointer]:
                - /url: ./
                - img "Storybook" [ref=e20]
              - switch "Settings" [ref=e25] [cursor=pointer]:
                - img [ref=e26]
            - generic [ref=e31]:
              - generic [ref=e33] [cursor=pointer]:
                - button "Open onboarding guide" [ref=e37]:
                  - img [ref=e39]
                  - strong [ref=e41]: Get started
                - generic [ref=e42]:
                  - button "Collapse onboarding guide" [expanded] [ref=e43]:
                    - img [ref=e44]
                  - button "33% completed" [ref=e46]:
                    - generic [ref=e47]:
                      - img [ref=e48]
                      - img [ref=e50]
                    - generic [ref=e53]: 33%
              - list [ref=e55]:
                - listitem [ref=e56]:
                  - button "Open onboarding guide for Change a story with Controls" [ref=e57] [cursor=pointer]:
                    - img [ref=e59]
                    - generic [ref=e62]: Change a story with Controls
                - listitem [ref=e63]:
                  - button "Open onboarding guide for Publish your Storybook for feedback" [ref=e64] [cursor=pointer]:
                    - img [ref=e66]
                    - generic [ref=e69]: Publish your Storybook for feedback
                - listitem [ref=e70]:
                  - button "Open onboarding guide for Test functionality with interactions" [ref=e71] [cursor=pointer]:
                    - img [ref=e73]
                    - generic [ref=e76]: Test functionality with interactions
          - generic [ref=e77]: Search for components
          - search [ref=e78]:
            - combobox "Search for components" [ref=e79]:
              - generic:
                - img
              - searchbox "Search for components" [ref=e80]
              - code: ⌃ K
              - button "Tag filters" [ref=e82] [cursor=pointer]:
                - img [ref=e83]
          - switch "Review new stories" [ref=e86] [cursor=pointer]:
            - img [ref=e87]
            - text: Review new stories
          - navigation "Stories" [ref=e90]:
            - heading "Stories" [level=2] [ref=e91]
            - generic [ref=e93]:
              - generic [ref=e94]:
                - button "Collapse" [expanded] [ref=e95] [cursor=pointer]:
                  - img [ref=e97]
                  - text: Design System
                - button "Expand all" [ref=e99] [cursor=pointer]:
                  - img [ref=e100]
              - generic [ref=e102]:
                - button "Acceptance" [expanded] [ref=e103] [cursor=pointer]:
                  - generic [ref=e104]:
                    - img [ref=e106]
                    - img [ref=e108]
                  - text: Acceptance
                - 'button "Change status: New" [ref=e110] [cursor=pointer]':
                  - img [ref=e111]
              - button "Button Tag" [ref=e114] [cursor=pointer]:
                - generic [ref=e115]:
                  - img [ref=e117]
                  - img [ref=e119]
                - text: Button Tag
              - button "Card" [ref=e122] [cursor=pointer]:
                - generic [ref=e123]:
                  - img [ref=e125]
                  - img [ref=e127]
                - text: Card
              - button "Dialog Toast" [ref=e130] [cursor=pointer]:
                - generic [ref=e131]:
                  - img [ref=e133]
                  - img [ref=e135]
                - text: Dialog Toast
              - generic [ref=e137]:
                - button "Table Paginator" [expanded] [ref=e138] [cursor=pointer]:
                  - generic [ref=e139]:
                    - img [ref=e141]
                    - img [ref=e143]
                  - text: Table Paginator
                - 'button "Change status: New" [ref=e145] [cursor=pointer]':
                  - img [ref=e146]
              - generic [ref=e148]:
                - link "Sort Filter And Page" [ref=e149] [cursor=pointer]:
                  - /url: /?path=/story/design-system-acceptance-table-paginator--sort-filter-and-page
                  - img [ref=e151]
                  - text: Sort Filter And Page
                - link "Skip to content" [ref=e153] [cursor=pointer]:
                  - /url: "#storybook-preview-wrapper"
                - 'button "Change status: New" [ref=e154] [cursor=pointer]':
                  - img [ref=e155]
              - generic [ref=e157]:
                - link "Loading And Empty" [ref=e158] [cursor=pointer]:
                  - /url: /?path=/story/design-system-acceptance-table-paginator--loading-and-empty
                  - img [ref=e160]
                  - text: Loading And Empty
                - 'button "Change status: New" [ref=e162] [cursor=pointer]':
                  - img [ref=e163]
              - button "PrimeNG Playground" [ref=e166] [cursor=pointer]:
                - generic [ref=e167]:
                  - img [ref=e169]
                  - img [ref=e171]
                - text: PrimeNG Playground
              - button "Problem Areas" [ref=e174] [cursor=pointer]:
                - generic [ref=e175]:
                  - img [ref=e177]
                  - img [ref=e179]
                - text: Problem Areas
      - separator "Sidebar resize handle" [ref=e181]
    - generic [ref=e183]:
      - region "Toolbar" [ref=e184]:
        - heading "Toolbar" [level=2] [ref=e185]
        - toolbar [ref=e186]:
          - generic [ref=e187]:
            - button "Reload story" [ref=e188] [cursor=pointer]:
              - img [ref=e189]
            - switch "Measure tool" [ref=e191] [cursor=pointer]:
              - img [ref=e192]
            - switch "Outline tool" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - button "Viewport size" [ref=e198] [cursor=pointer]:
              - img [ref=e199]
            - button "Vision filter" [ref=e203] [cursor=pointer]:
              - img [ref=e204]
          - generic [ref=e208]:
            - button "Open in isolation mode" [ref=e209] [cursor=pointer]:
              - img [ref=e210]
            - switch "Change zoom level" [ref=e215] [cursor=pointer]: 100%
            - button "Enter full screen" [ref=e216] [cursor=pointer]:
              - img [ref=e217]
            - button "Open in editor" [ref=e219] [cursor=pointer]:
              - img [ref=e220]
      - main "Main preview area" [ref=e223]:
        - heading "Main preview area" [level=2] [ref=e224]
        - generic [ref=e225]:
          - progressbar "Content is loading..." [ref=e227]
          - generic [ref=e228]:
            - link "Skip to sidebar" [ref=e229] [cursor=pointer]:
              - /url: "#design-system-acceptance-table-paginator--sort-filter-and-page"
            - iframe [ref=e233]:
              
    - generic [ref=e234]:
      - separator "Addon panel resize handle" [ref=e235]
      - region "Addon panel" [ref=e237]:
        - heading "Addon panel" [level=2] [ref=e238]
        - generic [ref=e239]:
          - generic [ref=e240]:
            - generic [ref=e241]:
              - button "Move addon panel to right" [ref=e242] [cursor=pointer]:
                - img [ref=e243]
              - button "Hide addon panel" [ref=e246] [cursor=pointer]:
                - img [ref=e247]
            - tablist "Available addons" [ref=e252]:
              - tab "Controls" [selected] [ref=e253] [cursor=pointer]:
                - generic [ref=e255]: Controls
              - tab "Actions" [ref=e256] [cursor=pointer]:
                - generic [ref=e258]: Actions
              - tab "Interactions" [ref=e259] [cursor=pointer]:
                - generic [ref=e261]: Interactions
              - tab "Code" [ref=e262] [cursor=pointer]
              - tab "Accessibility" [ref=e263] [cursor=pointer]:
                - generic [ref=e265]: Accessibility
          - tabpanel "Controls" [ref=e266]
```

# Test source

```ts
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
> 355 |     expect(rowCount).toBe(5);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
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