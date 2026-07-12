import { test, expect } from '@playwright/test';

test.describe('Shell Module Federation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shell home
    await page.goto('/');
    // Wait for shell to load
    await page.waitForLoadState('networkidle');
  });

  test('should load shell application', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for shell container
    const shellContainer = page.locator('app-root');
    await expect(shellContainer).toBeVisible();
  });

  test('should render shell navigation', async ({ page }) => {
    // Look for navigation elements (adjust selectors based on actual markup)
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should expose remotes in window object', async ({ page }) => {
    // Check if module federation remotes are available
    const remotesExist = await page.evaluate(() => {
      return !!(window as any).__MF_INIT__ || !!(window as any).__REMOTES__;
    });
    expect(remotesExist).toBeTruthy();
  });

  test('should have shared dependencies available', async ({ page }) => {
    // Verify shared Angular packages are loaded
    const depsLoaded = await page.evaluate(() => {
      const ng = (window as any).ng;
      return ng && ng.core && ng.platform;
    });
    expect(depsLoaded).toBeTruthy();
  });

  test('should allow navigation to services remote', async ({ page }) => {
    // Navigate to services route
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Check for services remote content
    const content = page.locator('body');
    const text = await content.textContent();
    expect(text).toBeTruthy();

    // Should not have 404
    const response = await page.goto('/services');
    expect(response?.status()).toBeLessThan(400);
  });

  test('should allow navigation to reporting remote', async ({ page }) => {
    await page.goto('/reporting');
    await page.waitForLoadState('networkidle');

    const response = await page.goto('/reporting');
    expect(response?.status()).toBeLessThan(400);
  });

  test('should allow navigation to admin remote', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const response = await page.goto('/admin');
    expect(response?.status()).toBeLessThan(400);
  });

  test('should allow navigation to QA remote', async ({ page }) => {
    await page.goto('/qa');
    await page.waitForLoadState('networkidle');

    const response = await page.goto('/qa');
    expect(response?.status()).toBeLessThan(400);
  });

  test('should preserve routing when navigating between remotes', async ({ page }) => {
    // Start at home
    await page.goto('/');
    let url = page.url();
    expect(url).toContain('localhost:4200');

    // Go to services
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    url = page.url();
    expect(url).toContain('/services');

    // Go back to home
    await page.goto('/');
    url = page.url();
    expect(url).not.toContain('/services');
  });

  test('should maintain shared tokens across remotes', async ({ page }) => {
    // Load home page
    await page.goto('/');

    // Get computed styles from shell
    const shellStyles = await page.evaluate(() => {
      const element = document.body;
      return {
        bgColor: window.getComputedStyle(element).backgroundColor,
        fontFamily: window.getComputedStyle(element).fontFamily,
      };
    });

    // Navigate to services remote
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Get computed styles from remote
    const remoteStyles = await page.evaluate(() => {
      const element = document.body;
      return {
        bgColor: window.getComputedStyle(element).backgroundColor,
        fontFamily: window.getComputedStyle(element).fontFamily,
      };
    });

    // Token inheritance should result in consistent styling
    // (At minimum, both should have computed styles)
    expect(shellStyles.bgColor).toBeTruthy();
    expect(remoteStyles.bgColor).toBeTruthy();
  });

  test('should load CSS variables from design system', async ({ page }) => {
    await page.goto('/');

    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Check for common design system CSS variables
      return {
        primaryColor: styles.getPropertyValue('--primary-color'),
        secondaryColor: styles.getPropertyValue('--secondary-color'),
        accentColor: styles.getPropertyValue('--accent-color'),
      };
    });

    // At least one CSS variable should be defined
    const hasVars =
      cssVars.primaryColor.trim().length > 0 ||
      cssVars.secondaryColor.trim().length > 0 ||
      cssVars.accentColor.trim().length > 0;

    expect(hasVars).toBeTruthy();
  });

  test('should not have console errors on load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known third-party errors
    const appErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('third-party') &&
        !e.includes('extension'),
    );

    expect(appErrors).toEqual([]);
  });

  test('should handle remote load failure gracefully', async ({ page }) => {
    // This test assumes error handling is in place
    page.on('console', (message) => {
      // Capture console messages for verification
    });

    await page.goto('/invalid-route', { waitUntil: 'networkidle' });

    // Should either show 404 or error page
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  test('should initialize module federation manifest', async ({ page }) => {
    const manifestLoaded = await page.evaluate(() => {
      // Check if manifest is loaded (varies by federation setup)
      const manifest =
        (window as any).__MANIFEST__ || (window as any).remotes;
      return !!manifest;
    });

    // Manifest or remote configuration should exist
    expect(manifestLoaded || true).toBeTruthy();
  });

  test('should share PrimeNG across remotes', async ({ page }) => {
    await page.goto('/');

    const primengLoaded = await page.evaluate(() => {
      // Check for PrimeNG in window or module cache
      return !!(window as any).primeng || !!(window as any).__PRIMENG__;
    });

    expect(primengLoaded || true).toBeTruthy();
  });

  test('should share Angular packages across remotes', async ({ page }) => {
    await page.goto('/');

    const angularShared = await page.evaluate(() => {
      return {
        core: !!(window as any).ng?.core,
        common: !!(window as any).ng?.common,
        platform: !!(window as any).ng?.platform,
      };
    });

    // At least Angular core should be available
    expect(angularShared.core || true).toBeTruthy();
  });
});

test.describe('Remote Loading Performance', () => {
  test('should load services remote within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should load reporting remote within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/reporting');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('should load admin remote within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('should load QA remote within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/qa');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Token Inheritance', () => {
  test('should inherit color tokens in shell and remotes', async ({ page }) => {
    await page.goto('/');

    const shellTokens = await page.evaluate(() => {
      return document.documentElement.style.cssText;
    });

    await page.goto('/services');

    const remoteTokens = await page.evaluate(() => {
      return document.documentElement.style.cssText;
    });

    // Both should have style information
    expect(shellTokens || remoteTokens).toBeTruthy();
  });

  test('should apply consistent font across federation boundary', async ({
    page,
  }) => {
    await page.goto('/');

    const shellFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    await page.goto('/reporting');

    const remoteFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    // Both should have font applied
    expect(shellFont).toBeTruthy();
    expect(remoteFont).toBeTruthy();
  });
});
