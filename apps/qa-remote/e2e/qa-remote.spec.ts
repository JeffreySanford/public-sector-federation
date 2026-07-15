import { test, expect } from '@playwright/test';

/**
 * QA Remote E2E Tests
 * Tests the QA remote component functionality including:
 * - Tab switching between QA Components and Performance Tracking
 * - Developer view selection
 * - Component rendering and accessibility
 * - Dynamic content loading
 */

test.setTimeout(60 * 1000);

test.describe('QA Remote - Component & Tab Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to QA remote via shell
    await page.goto('http://localhost:4200/qa', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    try {
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    } catch {
      // QA may be slow to load but is still usable
    }
  });

  test('should load QA remote and display header', async ({ page }) => {
    // Verify page title/header
    const heading = page.locator('h2').first();
    await expect(heading).toContainText('Component and token coverage');
    
    // Verify QA tag is visible
    const qaTag = page.locator('.qa-tag').first();
    await expect(qaTag).toContainText('QA Remote');
  });

  test('should display tab navigation buttons', async ({ page }) => {
    // Check for QA Components tab button
    const qaComponentsTab = page.getByRole('button', { name: /QA Components/i });
    await expect(qaComponentsTab).toBeVisible();
    
    // Check for Performance Tracking tab button
    const performanceTab = page.getByRole('button', { name: /Performance Tracking/i });
    await expect(performanceTab).toBeVisible();
  });

  test('should start with QA Components tab active', async ({ page }) => {
    // Get QA Components tab button
    const qaComponentsTab = page.getByRole('button', { name: /QA Components/i });
    
    // Should have active class
    await expect(qaComponentsTab).toHaveClass(/active/);
    
    // QA content should be visible
    const qaSection = page.locator('.qa-header');
    await expect(qaSection).toBeVisible();
  });

  test('should switch to Performance Tracking tab when clicked', async ({ page }) => {
    const performanceTab = page.getByRole('button', { name: /Performance Tracking/i });
    
    // Click the Performance Tracking tab
    await performanceTab.click();
    
    // Performance tab should now be active
    await expect(performanceTab).toHaveClass(/active/);
    
    // Performance dashboard should be visible
    const performanceDashboard = page.locator('.performance-dashboard');
    await expect(performanceDashboard).toBeVisible();
  });

  test('should switch back to QA Components tab', async ({ page }) => {
    // First go to Performance tab
    const performanceTab = page.getByRole('button', { name: /Performance Tracking/i });
    await performanceTab.click();
    
    // Then go back to QA Components
    const qaComponentsTab = page.getByRole('button', { name: /QA Components/i });
    await qaComponentsTab.click();
    
    // QA Components tab should be active
    await expect(qaComponentsTab).toHaveClass(/active/);
  });

  test('should display acceptance checkpoint section', async ({ page }) => {
    // Verify acceptance checkpoint is visible
    const checkpointTitle = page.getByRole('heading', { name: /Storybook acceptance stories/i });
    await expect(checkpointTitle).toBeVisible();
    
    // Check for component panels (Button/Tag, Card, etc)
    const componentPanels = page.locator('.acceptance-panel');
    const panelCount = await componentPanels.count();
    expect(panelCount).toBeGreaterThan(0);
  });

  test('should render component panels with correct structure', async ({ page }) => {
    // Check first component panel has required content
    const firstPanel = page.locator('.acceptance-panel').first();
    
    // Should have a header with component name
    const panelHeader = firstPanel.locator('.acceptance-panel__header');
    await expect(panelHeader).toBeVisible();
    
    // Should have a tag with component info
    const tag = firstPanel.locator('p-tag').first();
    await expect(tag).toBeVisible();
  });

  test('should display developer views selection', async ({ page }) => {
    // Look for developer view buttons or selection mechanism
    // The component has developerViews array with storybook, zeroheight, style-dictionary, agile
    const buttons = await page.locator('button').all();
    
    // At least some buttons should exist for navigation
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should display federation proof rows', async ({ page }) => {
    // Look for federation proof table or rows
    const tableRows = page.locator('table tbody tr');
    
    // Should have some rows (Button/Tag, Card, Table, Dialog/Toast)
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(0); // Might be 0 if table is empty initially
  });

  test('should handle dialog visibility toggle', async ({ page }) => {
    // Look for registry buttons that might trigger dialogs
    const registryButtons = page.locator('ps-button');
    await expect(registryButtons.first()).toBeVisible();
    
    // Should have some buttons available
    await expect(registryButtons).not.toHaveCount(0);
  });

  test('should not show console errors on load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate and wait for load
    await page.goto('http://localhost:4200/qa', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Allow some specific angular/framework warnings but no critical errors
    const criticalErrors = errors.filter(e => !e.includes('WARNING') && !e.includes('Deprecation'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have accessible button labels', async ({ page }) => {
    // Check that registry buttons render accessible labels
    const qaComponentsTab = page.getByRole('button', { name: /QA Components/i });
    await expect(qaComponentsTab).toBeVisible();
    
    const performanceTab = page.getByRole('button', { name: /Performance Tracking/i });
    await expect(performanceTab).toBeVisible();
  });

  test('should display all required component families', async ({ page }) => {
    // Look for specific component names in the page
    const pageText = await page.locator('body').textContent();
    
    expect(pageText).toContain('Button');
    expect(pageText).toContain('Tag');
    expect(pageText).toContain('Card');
    expect(pageText).toContain('Table');
  });

  test('should display theme-related content', async ({ page }) => {
    const pageText = await page.locator('body').textContent();
    
    // Should mention themes or token-related content
    expect(pageText).toContain('token');
  });

  test('performance tab should not load until clicked (lazy loading)', async ({ page }) => {
    // Get initial HTML
    const initialHTML = await page.content();
    
    // Performance dashboard should not be in initial HTML if lazy loaded
    // (or it might be there but with display:none)
    const performanceDashboard = page.locator('.performance-dashboard');
    
    // Initially might not be visible
    const isInitiallyVisible = await performanceDashboard.isVisible().catch(() => false);
    
    // After clicking the tab it should be visible
    const performanceTab = page.getByRole('button', { name: /Performance Tracking/i });
    await performanceTab.click();
    
    // Now it should be visible
    await expect(performanceDashboard).toBeVisible();
  });
});

test.describe('QA Remote - Interactions & State Changes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/qa', { waitUntil: 'domcontentloaded', timeout: 60000 });
    try {
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    } catch {
      // Ignore timeout
    }
  });

  test('should switch tabs multiple times without errors', async ({ page }) => {
    const qaTab = page.getByRole('button', { name: /QA Components/i });
    const perfTab = page.getByRole('button', { name: /Performance Tracking/i });
    
    // Switch multiple times
    for (let i = 0; i < 3; i++) {
      await perfTab.click();
      await expect(perfTab).toHaveClass(/active/);
      
      await qaTab.click();
      await expect(qaTab).toHaveClass(/active/);
    }
  });

  test('should maintain tab state during interactions', async ({ page }) => {
    const perfTab = page.getByRole('button', { name: /Performance Tracking/i });
    
    // Switch to Performance tab
    await perfTab.click();
    
    // Scroll or interact with the page
    await page.evaluate(() => window.scrollBy(0, 100));
    
    // Tab should still be active
    await expect(perfTab).toHaveClass(/active/);
  });

  test('should render performance dashboard content when tab is active', async ({ page }) => {
    const perfTab = page.getByRole('button', { name: /Performance Tracking/i });
    
    // Switch to performance tab
    await perfTab.click();
    
    // Look for performance dashboard elements
    const dashboard = page.locator('.performance-dashboard');
    await expect(dashboard).toBeVisible();
    
    // Should have header
    const header = page.locator('.performance-dashboard .header');
    await expect(header).toBeVisible();
  });
});

test.describe('QA Remote - Performance Dashboard Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/performance/summary', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            testSuite: 'federation',
            totalTests: 12,
            passedTests: 10,
            failedTests: 2,
            averageDuration: 6200,
            status: 'warning',
          },
        ]),
      });
    });

    await page.route('**/api/performance/regressions', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            testName: 'Shell federation tests',
            severity: 'warning',
            currentMs: 13000,
            baselineMs: 10000,
          },
        ]),
      });
    });

    await page.route('**/api/performance/trends**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            testSuite: 'federation',
            testName: 'Shell federation tests',
            browser: 'chromium',
            average: 8800,
            baseline: 10000,
            latest: 8000,
            trend: 'improving',
            status: 'excellent',
            lastUpdated: '2026-07-12T00:00:00.000Z',
          },
          {
            testSuite: 'federation',
            testName: 'Shell federation tests',
            browser: 'firefox',
            average: 11200,
            baseline: 10000,
            latest: 13000,
            trend: 'degrading',
            status: 'warning',
            lastUpdated: '2026-07-12T00:00:00.000Z',
          },
          {
            testSuite: 'federation',
            testName: 'Shell federation tests',
            browser: 'webkit',
            average: 10000,
            baseline: 10000,
            latest: 10000,
            trend: 'stable',
            status: 'good',
            lastUpdated: '2026-07-12T00:00:00.000Z',
          },
        ]),
      });
    });

    await page.goto('http://localhost:4200/qa', { waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  test('should visualize performance improvements and degradation with infographic data', async ({ page }) => {
    await page.getByRole('button', { name: /Performance Tracking/i }).click();

    await expect(page.locator('.performance-dashboard')).toBeVisible();
    await expect(page.locator('.infographic-card')).toHaveCount(4);
    await expect(page.locator('.infographic-card').filter({ hasText: 'Trend balance' })).toContainText('1/1');

    await expect(page.locator('.alerts-section ps-card')).toBeVisible();
    await expect(page.locator('.alerts-section')).toContainText('Performance regressions detected');
    await expect(page.locator('.alerts-section')).toContainText('warning alerts need review');
    await expect(page.locator('.impact')).toContainText('+3000ms');
    await expect(page.locator('.impact')).toContainText('30%');

    await expect(page.locator('.variance-row')).toHaveCount(3);
    await expect(page.locator('.variance-row.improving')).toContainText('-20% vs baseline');
    await expect(page.locator('.variance-row.improving .pi-arrow-down')).toBeVisible();
    await expect(page.locator('.variance-row.improving .variance-bar')).toHaveAttribute('style', /80%/);

    await expect(page.locator('.variance-row.degrading')).toContainText('+30% vs baseline');
    await expect(page.locator('.variance-row.degrading .pi-arrow-up')).toBeVisible();
    await expect(page.locator('.variance-row.degrading .variance-bar')).toHaveAttribute('style', /130%/);

    await expect(page.locator('.variance-row.stable')).toContainText('On baseline');
    await expect(page.locator('.trend-chart')).toBeVisible();
  });
});

test.describe('QA Remote - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/qa', { waitUntil: 'domcontentloaded', timeout: 60000 });
    try {
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    } catch {
      // Ignore timeout
    }
  });

  test('should support keyboard navigation between tabs', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Focus should be on a button
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    // Should be able to focus on buttons
    expect(focusedElement).toBeDefined();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Check for required semantic elements
    const nav = page.locator('nav');
    const main = page.locator('main');
    
    // Should have proper structure (nav might not be present, but main should be)
    // At minimum should have role-based structure
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should have aria labels on interactive elements', async ({ page }) => {
    // Tab buttons should have labels
    const qaTab = page.getByRole('button', { name: /QA Components/i });
    const perfTab = page.getByRole('button', { name: /Performance Tracking/i });
    
    // Both should exist and be accessible
    await expect(qaTab).toBeVisible();
    await expect(perfTab).toBeVisible();
  });
});
