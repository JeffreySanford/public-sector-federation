# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\shell\e2e\federation.spec.ts >> Token Inheritance >> should apply consistent font across federation boundary
- Location: apps\shell\e2e\federation.spec.ts:288:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:4200/reporting", waiting until "load"

```

# Test source

```ts
  197 |       return !!manifest;
  198 |     });
  199 | 
  200 |     // Manifest or remote configuration should exist
  201 |     expect(manifestLoaded || true).toBeTruthy();
  202 |   });
  203 | 
  204 |   test('should share PrimeNG across remotes', async ({ page }) => {
  205 |     await page.goto('/');
  206 | 
  207 |     const primengLoaded = await page.evaluate(() => {
  208 |       // Check for PrimeNG in window or module cache
  209 |       return !!(window as any).primeng || !!(window as any).__PRIMENG__;
  210 |     });
  211 | 
  212 |     expect(primengLoaded || true).toBeTruthy();
  213 |   });
  214 | 
  215 |   test('should share Angular packages across remotes', async ({ page }) => {
  216 |     await page.goto('/');
  217 | 
  218 |     const angularShared = await page.evaluate(() => {
  219 |       return {
  220 |         core: !!(window as any).ng?.core,
  221 |         common: !!(window as any).ng?.common,
  222 |         platform: !!(window as any).ng?.platform,
  223 |       };
  224 |     });
  225 | 
  226 |     // At least Angular core should be available
  227 |     expect(angularShared.core || true).toBeTruthy();
  228 |   });
  229 | });
  230 | 
  231 | test.describe('Remote Loading Performance', () => {
  232 |   test('should load services remote within acceptable time', async ({ page }) => {
  233 |     const startTime = Date.now();
  234 |     await page.goto('/services');
  235 |     await page.waitForLoadState('networkidle');
  236 |     const loadTime = Date.now() - startTime;
  237 | 
  238 |     // Should load within 5 seconds
  239 |     expect(loadTime).toBeLessThan(5000);
  240 |   });
  241 | 
  242 |   test('should load reporting remote within acceptable time', async ({ page }) => {
  243 |     const startTime = Date.now();
  244 |     await page.goto('/reporting');
  245 |     await page.waitForLoadState('networkidle');
  246 |     const loadTime = Date.now() - startTime;
  247 | 
  248 |     expect(loadTime).toBeLessThan(5000);
  249 |   });
  250 | 
  251 |   test('should load admin remote within acceptable time', async ({ page }) => {
  252 |     const startTime = Date.now();
  253 |     await page.goto('/admin');
  254 |     await page.waitForLoadState('networkidle');
  255 |     const loadTime = Date.now() - startTime;
  256 | 
  257 |     expect(loadTime).toBeLessThan(5000);
  258 |   });
  259 | 
  260 |   test('should load QA remote within acceptable time', async ({ page }) => {
  261 |     const startTime = Date.now();
  262 |     await page.goto('/qa');
  263 |     await page.waitForLoadState('networkidle');
  264 |     const loadTime = Date.now() - startTime;
  265 | 
  266 |     expect(loadTime).toBeLessThan(5000);
  267 |   });
  268 | });
  269 | 
  270 | test.describe('Token Inheritance', () => {
  271 |   test('should inherit color tokens in shell and remotes', async ({ page }) => {
  272 |     await page.goto('/');
  273 | 
  274 |     const shellTokens = await page.evaluate(() => {
  275 |       return document.documentElement.style.cssText;
  276 |     });
  277 | 
  278 |     await page.goto('/services');
  279 | 
  280 |     const remoteTokens = await page.evaluate(() => {
  281 |       return document.documentElement.style.cssText;
  282 |     });
  283 | 
  284 |     // Both should have style information
  285 |     expect(shellTokens || remoteTokens).toBeTruthy();
  286 |   });
  287 | 
  288 |   test('should apply consistent font across federation boundary', async ({
  289 |     page,
  290 |   }) => {
  291 |     await page.goto('/');
  292 | 
  293 |     const shellFont = await page.evaluate(() => {
  294 |       return window.getComputedStyle(document.body).fontFamily;
  295 |     });
  296 | 
> 297 |     await page.goto('/reporting');
      |                ^ Error: page.goto: Target page, context or browser has been closed
  298 | 
  299 |     const remoteFont = await page.evaluate(() => {
  300 |       return window.getComputedStyle(document.body).fontFamily;
  301 |     });
  302 | 
  303 |     // Both should have font applied
  304 |     expect(shellFont).toBeTruthy();
  305 |     expect(remoteFont).toBeTruthy();
  306 |   });
  307 | });
  308 | 
```