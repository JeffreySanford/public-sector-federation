# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Table Paginator Functionality >> should navigate back with Previous button
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:301:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('#storybook-preview-iframe').locator('iframe').contentFrame().locator('button').filter({ hasText: /Next/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - log
    - log
  - generic [ref=e4]:
    - generic [ref=e5]:
      - banner "Storybook" [ref=e7]:
        - heading "Storybook" [level=1] [ref=e8]
        - img
        - generic [ref=e11]:
          - generic [ref=e12]:
            - generic [ref=e13]:
              - generic [ref=e14]:
                - link "Skip to content" [ref=e15] [cursor=pointer]:
                  - /url: "#storybook-preview-wrapper"
                - link "Storybook" [ref=e17] [cursor=pointer]:
                  - /url: ./
                  - img "Storybook" [ref=e18]
                - switch "Settings" [ref=e23] [cursor=pointer]:
                  - img [ref=e24]
              - generic [ref=e29]:
                - generic [ref=e31] [cursor=pointer]:
                  - button "Open onboarding guide" [ref=e35]:
                    - img [ref=e37]
                    - strong [ref=e39]: Get started
                  - generic [ref=e40]:
                    - button "Collapse onboarding guide" [expanded] [ref=e41]:
                      - img [ref=e42]
                    - button "33% completed" [ref=e44]:
                      - generic [ref=e45]:
                        - img [ref=e46]
                        - img [ref=e48]
                      - generic [ref=e51]: 33%
                - list [ref=e53]:
                  - listitem [ref=e54]:
                    - button "Open onboarding guide for Change a story with Controls" [ref=e55] [cursor=pointer]:
                      - img [ref=e57]
                      - generic [ref=e60]: Change a story with Controls
                  - listitem [ref=e61]:
                    - button "Open onboarding guide for Publish your Storybook for feedback" [ref=e62] [cursor=pointer]:
                      - img [ref=e64]
                      - generic [ref=e67]: Publish your Storybook for feedback
                  - listitem [ref=e68]:
                    - button "Open onboarding guide for Test functionality with interactions" [ref=e69] [cursor=pointer]:
                      - img [ref=e71]
                      - generic [ref=e74]: Test functionality with interactions
            - generic [ref=e75]: Search for components
            - search [ref=e76]:
              - combobox "Search for components" [ref=e77]:
                - generic:
                  - img
                - searchbox "Search for components" [ref=e78]
                - code: ⌃ K
                - button "Tag filters" [ref=e80] [cursor=pointer]:
                  - img [ref=e81]
            - switch "Review new stories" [ref=e84] [cursor=pointer]:
              - img [ref=e85]
              - text: Review new stories
            - navigation "Stories" [ref=e88]:
              - heading "Stories" [level=2] [ref=e89]
              - generic [ref=e91]:
                - generic [ref=e92]:
                  - button "Collapse" [expanded] [ref=e93] [cursor=pointer]:
                    - img [ref=e95]
                    - text: Design System
                  - button "Expand all" [ref=e97] [cursor=pointer]:
                    - img [ref=e98]
                - generic [ref=e100]:
                  - button "Acceptance" [expanded] [ref=e101] [cursor=pointer]:
                    - generic [ref=e102]:
                      - img [ref=e104]
                      - img [ref=e106]
                    - text: Acceptance
                  - 'button "Change status: New" [ref=e108] [cursor=pointer]':
                    - img [ref=e109]
                - button "Button Tag" [ref=e112] [cursor=pointer]:
                  - generic [ref=e113]:
                    - img [ref=e115]
                    - img [ref=e117]
                  - text: Button Tag
                - button "Card" [ref=e120] [cursor=pointer]:
                  - generic [ref=e121]:
                    - img [ref=e123]
                    - img [ref=e125]
                  - text: Card
                - button "Dialog Toast" [ref=e128] [cursor=pointer]:
                  - generic [ref=e129]:
                    - img [ref=e131]
                    - img [ref=e133]
                  - text: Dialog Toast
                - generic [ref=e135]:
                  - button "Table Paginator" [expanded] [ref=e136] [cursor=pointer]:
                    - generic [ref=e137]:
                      - img [ref=e139]
                      - img [ref=e141]
                    - text: Table Paginator
                  - 'button "Change status: New" [ref=e143] [cursor=pointer]':
                    - img [ref=e144]
                - generic [ref=e146]:
                  - link "Sort Filter And Page" [ref=e147] [cursor=pointer]:
                    - /url: /?path=/story/design-system-acceptance-table-paginator--sort-filter-and-page
                    - img [ref=e149]
                    - text: Sort Filter And Page
                  - link "Skip to content" [ref=e151] [cursor=pointer]:
                    - /url: "#storybook-preview-wrapper"
                  - 'button "Change status: New" [ref=e152] [cursor=pointer]':
                    - img [ref=e153]
                - generic [ref=e155]:
                  - link "Loading And Empty" [ref=e156] [cursor=pointer]:
                    - /url: /?path=/story/design-system-acceptance-table-paginator--loading-and-empty
                    - img [ref=e158]
                    - text: Loading And Empty
                  - 'button "Change status: New" [ref=e160] [cursor=pointer]':
                    - img [ref=e161]
                - button "PrimeNG Playground" [ref=e164] [cursor=pointer]:
                  - generic [ref=e165]:
                    - img [ref=e167]
                    - img [ref=e169]
                  - text: PrimeNG Playground
                - button "Problem Areas" [ref=e172] [cursor=pointer]:
                  - generic [ref=e173]:
                    - img [ref=e175]
                    - img [ref=e177]
                  - text: Problem Areas
          - generic [ref=e181]:
            - img [ref=e183]
            - generic [ref=e185]:
              - generic "Connection lost" [ref=e186]
              - generic [ref=e187]: Please restart your Storybook server and reload the page
            - button "Dismiss notification" [ref=e188] [cursor=pointer]:
              - img [ref=e189]
      - separator "Sidebar resize handle" [ref=e191]
    - generic [ref=e193]:
      - region "Toolbar" [ref=e194]:
        - heading "Toolbar" [level=2] [ref=e195]
        - toolbar [ref=e196]:
          - generic [ref=e197]:
            - button "Reload story" [ref=e198] [cursor=pointer]:
              - img [ref=e199]
            - switch "Grid visibility" [ref=e201] [cursor=pointer]:
              - img [ref=e202]
            - button "Preview background" [ref=e204] [cursor=pointer]:
              - img [ref=e205]
            - switch "Measure tool" [ref=e208] [cursor=pointer]:
              - img [ref=e209]
            - switch "Outline tool" [ref=e212] [cursor=pointer]:
              - img [ref=e213]
            - button "Viewport size" [ref=e215] [cursor=pointer]:
              - img [ref=e216]
            - button "Vision filter" [ref=e220] [cursor=pointer]:
              - img [ref=e221]
            - button "Public-sector theme variant neutral" [ref=e226] [cursor=pointer]:
              - img [ref=e227]
              - text: neutral
            - button "Light or dark mode light" [ref=e229] [cursor=pointer]:
              - img [ref=e230]
              - text: light
          - generic [ref=e232]:
            - button "Open in isolation mode" [ref=e233] [cursor=pointer]:
              - img [ref=e234]
            - switch "Change zoom level" [ref=e239] [cursor=pointer]: 100%
            - button "Enter full screen" [ref=e240] [cursor=pointer]:
              - img [ref=e241]
            - button "Open in editor" [ref=e243] [cursor=pointer]:
              - img [ref=e244]
      - main "Main preview area" [ref=e247]:
        - heading "Main preview area" [level=2] [ref=e248]
        - generic [ref=e250]:
          - link "Skip to sidebar" [ref=e251] [cursor=pointer]:
            - /url: "#design-system-acceptance-table-paginator--sort-filter-and-page"
          - iframe [ref=e255]:
            - main [ref=f1e5]:
              - generic [ref=f1e6]:
                - generic [ref=f1e9]: "Acceptance: Table Paginator"
                - heading "Program performance" [level=1] [ref=f1e10]
                - paragraph [ref=f1e11]: Filter active public programs.
              - generic [ref=f1e14]:
                - table [ref=f1e16]:
                  - rowgroup [ref=f1e17]:
                    - row "Program Cases Status Region SLA Owner" [ref=f1e18]:
                      - columnheader "Program" [ref=f1e19]
                      - columnheader "Cases" [ref=f1e20]
                      - columnheader "Status" [ref=f1e21]
                      - columnheader "Region" [ref=f1e22]
                      - columnheader "SLA" [ref=f1e23]
                      - columnheader "Owner" [ref=f1e24]
                  - rowgroup [ref=f1e25]:
                    - row "Housing assistance 428 On track North Region 96% Avery Clark" [ref=f1e26]:
                      - cell "Housing assistance" [ref=f1e27]:
                        - strong [ref=f1e28]: Housing assistance
                      - cell "428" [ref=f1e29]
                      - cell "On track" [ref=f1e30]:
                        - generic [ref=f1e33]: On track
                      - cell "North Region" [ref=f1e34]
                      - cell "96%" [ref=f1e35]
                      - cell "Avery Clark" [ref=f1e36]
                    - row "Small business grants 183 Watch Central Region 87% Morgan Lee" [ref=f1e37]:
                      - cell "Small business grants" [ref=f1e38]:
                        - strong [ref=f1e39]: Small business grants
                      - cell "183" [ref=f1e40]
                      - cell "Watch" [ref=f1e41]:
                        - generic [ref=f1e44]: Watch
                      - cell "Central Region" [ref=f1e45]
                      - cell "87%" [ref=f1e46]
                      - cell "Morgan Lee" [ref=f1e47]
                    - row "Permit inspections 72 Delayed South Region 68% Riley Chen" [ref=f1e48]:
                      - cell "Permit inspections" [ref=f1e49]:
                        - strong [ref=f1e50]: Permit inspections
                      - cell "72" [ref=f1e51]
                      - cell "Delayed" [ref=f1e52]:
                        - generic [ref=f1e55]: Delayed
                      - cell "South Region" [ref=f1e56]
                      - cell "68%" [ref=f1e57]
                      - cell "Riley Chen" [ref=f1e58]
                    - row "Benefits renewal 316 On track North Region 94% Jordan Avery" [ref=f1e59]:
                      - cell "Benefits renewal" [ref=f1e60]:
                        - strong [ref=f1e61]: Benefits renewal
                      - cell "316" [ref=f1e62]
                      - cell "On track" [ref=f1e63]:
                        - generic [ref=f1e66]: On track
                      - cell "North Region" [ref=f1e67]
                      - cell "94%" [ref=f1e68]
                      - cell "Jordan Avery" [ref=f1e69]
                    - row "Document intake 241 Watch Central Region 82% Taylor Brooks" [ref=f1e70]:
                      - cell "Document intake" [ref=f1e71]:
                        - strong [ref=f1e72]: Document intake
                      - cell "241" [ref=f1e73]
                      - cell "Watch" [ref=f1e74]:
                        - generic [ref=f1e77]: Watch
                      - cell "Central Region" [ref=f1e78]
                      - cell "82%" [ref=f1e79]
                      - cell "Taylor Brooks" [ref=f1e80]
                - generic [ref=f1e81]:
                  - generic [ref=f1e82]: Showing 1 to 5 of 12 programs
                  - generic [ref=f1e83]:
                    - button "← Previous" [disabled] [ref=f1e84]
                    - generic [ref=f1e85]: Page 1 of 3
                    - button "Next →" [ref=f1e86] [cursor=pointer]
                    - combobox [ref=f1e87] [cursor=pointer]:
                      - option "5 per page" [selected]
                      - option "10 per page"
                      - option "15 per page"
    - generic [ref=e256]:
      - separator "Addon panel resize handle" [ref=e257]
      - region "Addon panel" [ref=e259]:
        - heading "Addon panel" [level=2] [ref=e260]
        - generic [ref=e261]:
          - generic [ref=e262]:
            - generic [ref=e263]:
              - button "Move addon panel to right" [ref=e264] [cursor=pointer]:
                - img [ref=e265]
              - button "Hide addon panel" [ref=e268] [cursor=pointer]:
                - img [ref=e269]
            - tablist "Available addons" [ref=e274]:
              - tab "Controls" [selected] [ref=e275] [cursor=pointer]:
                - generic [ref=e277]: Controls
              - tab "Actions" [ref=e278] [cursor=pointer]:
                - generic [ref=e280]: Actions
              - tab "Interactions" [ref=e281] [cursor=pointer]:
                - generic [ref=e283]: Interactions
              - tab "Accessibility 1" [ref=e284] [cursor=pointer]:
                - generic [ref=e285]:
                  - generic [ref=e286]: Accessibility
                  - generic [ref=e287]: "1"
          - tabpanel "Controls" [ref=e288]:
            - generic [ref=e295]:
              - generic [ref=e296]:
                - generic [ref=e297]: Interactive story playground
                - generic [ref=e298]: Controls give you an easy to use interface to test your components. Set your story args and you'll see controls appearing here automatically.
              - link "Read docs" [ref=e301] [cursor=pointer]:
                - /url: https://storybook.js.org/docs/essentials/controls?ref=ui
                - generic [ref=e302]:
                  - img [ref=e303]
                  - text: Read docs
                  - img [ref=e306]
```

# Test source

```ts
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
> 306 |     await nextBtn.click();
      |                   ^ Error: locator.click: Test timeout of 60000ms exceeded.
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