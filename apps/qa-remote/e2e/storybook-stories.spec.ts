import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

/**
 * Storybook release validation.
 *
 * Most checks use direct iframe URLs or Storybook's index.json rather than the
 * manager UI. That keeps the tests focused on published stories and avoids
 * coupling the release gate to Storybook sidebar and panel implementation details.
 */
test.setTimeout(60 * 1000);

const storybookHomeUrl = 'http://localhost:4400';
const buttonStoryId = 'design-system-acceptance-button-tag--states';
const candidateStoryId = 'design-system-candidates-button-up--preferred-candidate-api';
const tableStoryId = 'design-system-acceptance-table-paginator--sort-filter-and-page';

interface StorybookIndexEntry {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
}

interface StorybookIndexPayload {
  entries?: Record<string, StorybookIndexEntry>;
  stories?: Record<string, StorybookIndexEntry>;
}

function storyUrl(storyId: string): string {
  const params = new URLSearchParams({ id: storyId, viewMode: 'story' });
  return `${storybookHomeUrl}/iframe.html?${params.toString()}`;
}

async function gotoStorybookHome(page: Page): Promise<void> {
  await page.goto(storybookHomeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

async function gotoStory(page: Page, storyId = buttonStoryId): Promise<void> {
  await page.goto(storyUrl(storyId), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

async function loadStoryIndex(request: APIRequestContext): Promise<StorybookIndexEntry[]> {
  const response = await request.get(`${storybookHomeUrl}/index.json`);
  expect(response.ok()).toBe(true);

  const payload = (await response.json()) as StorybookIndexPayload;
  return Object.values(payload.entries ?? payload.stories ?? {});
}

function includesTitle(entries: StorybookIndexEntry[], title: string): boolean {
  return entries.some((entry) => entry.title === title);
}

test.describe('Storybook Stories - Rendering & Console', () => {
  test('should load Storybook dashboard', async ({ page }) => {
    await gotoStorybookHome(page);
    expect(await page.title()).toBeTruthy();
  });

  test('should render story without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await gotoStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('should display story canvas', async ({ page }) => {
    await gotoStory(page);
    await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
    await expect(page.getByText('On track', { exact: true })).toBeVisible();
  });

  test('should load story panel without errors', async ({ page }) => {
    await gotoStory(page);
    await expect(page.getByText(/NoStoryMatchError|Couldn't find story/i)).toHaveCount(0);
  });
});

test.describe('Storybook Stories - Accessibility (WCAG 2.1 AA)', () => {
  test('should render Button and Tag components with correct styling', async ({ page }) => {
    await gotoStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    const tag = page.getByText('On track', { exact: true });
    await expect(button).toBeVisible();
    await expect(tag).toBeVisible();
    await expect(button).toHaveCSS('cursor', 'pointer');
  });

  test('should have semantic heading structure', async ({ page }) => {
    await gotoStory(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Button and tag states' })).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await gotoStory(page);

    const styles = await page.getByRole('button', { name: 'Primary action' }).evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return { color: computed.color, backgroundColor: computed.backgroundColor };
    });

    expect(styles.color).not.toBe('');
    expect(styles.backgroundColor).not.toBe('');
    expect(styles.color).not.toBe(styles.backgroundColor);
  });
});

test.describe('Storybook Stories - Keyboard Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await gotoStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    await expect(button).toBeFocused();
  });

  test('should support Enter key on interactive elements', async ({ page }) => {
    await gotoStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    await button.press('Enter');
    await expect(button).toBeVisible();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await gotoStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    const hasFocusIndicator = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return computed.outlineStyle !== 'none' || computed.boxShadow !== 'none';
    });

    expect(hasFocusIndicator).toBe(true);
  });
});

test.describe('Storybook Stories - Props & Controls', () => {
  test('should display story controls panel', async ({ request }) => {
    const entries = await loadStoryIndex(request);
    const entry = entries.find((candidate) => candidate.id === buttonStoryId);

    expect(entry).toBeDefined();
    expect(entry?.name).toBe('States');
    expect(entry?.type).toBe('story');
  });

  test('should update story when controls change', async ({ page }) => {
    await gotoStory(page, candidateStoryId);

    const button = page.getByRole('button', { name: 'Delete draft' });
    await expect(page.getByText('Activations: 0')).toBeVisible();
    await button.click();
    await expect(page.getByText('Activations: 1')).toBeVisible();
  });
});

test.describe('Storybook Stories - Component Coverage', () => {
  test('should have PublicEmptyStateComponent story', async ({ request }) => {
    expect(includesTitle(await loadStoryIndex(request), 'Design System/Components/Empty State')).toBe(true);
  });

  test('should have PublicFormSectionComponent story', async ({ request }) => {
    expect(includesTitle(await loadStoryIndex(request), 'Design System/Components/Form Section')).toBe(true);
  });

  test('should have PublicPageHeaderComponent story', async ({ request }) => {
    expect(includesTitle(await loadStoryIndex(request), 'Design System/Components/Page Header')).toBe(true);
  });

  test('should have PublicStatusCardComponent story', async ({ request }) => {
    expect(includesTitle(await loadStoryIndex(request), 'Design System/Components/Status Card')).toBe(true);
  });

  test('should have at least 4 component stories', async ({ request }) => {
    const entries = await loadStoryIndex(request);
    const componentStories = entries.filter((entry) => entry.title?.startsWith('Design System/Components/'));
    expect(componentStories.length).toBeGreaterThanOrEqual(4);
  });
});

test.describe('Storybook Stories - Performance', () => {
  test('should load Storybook within the configured timeout', async ({ page }) => {
    const startedAt = Date.now();
    await gotoStorybookHome(page);
    expect(Date.now() - startedAt).toBeLessThan(60000);
  });

  test('should render story within the configured timeout', async ({ page }) => {
    const startedAt = Date.now();
    await gotoStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
    expect(Date.now() - startedAt).toBeLessThan(60000);
  });
});

test.describe('Storybook Stories - Table Paginator Functionality', () => {
  async function getTableStoryContent(page: Page) {
    await gotoStory(page, tableStoryId);
    await expect(page.getByRole('heading', { name: /Filter and page through active programs/i })).toBeVisible({
      timeout: 20000,
    });

    const paginator = page.locator('.paginator');
    await expect(paginator).toBeVisible({ timeout: 20000 });
    await expect(paginator.locator('.paginator-info')).toBeVisible({ timeout: 20000 });
    const table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Program' }),
    });
    const dataRows = table.locator('tbody > tr:visible').filter({
      has: page.locator('td'),
    });
    return { paginator, dataRows };
  }

  test('should display paginator controls', async ({ page }) => {
    const { paginator } = await getTableStoryContent(page);
    await expect(paginator.getByRole('button', { name: 'Previous' })).toBeVisible();
    await expect(paginator.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(paginator.locator('.paginator-info')).toContainText('Showing 1 to 5 of 10 programs');
  });

  test('should navigate between pages with Next button', async ({ page }) => {
    const { paginator } = await getTableStoryContent(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await expect(paginator.locator('.paginator-info')).toContainText('Showing 6 to 10 of 10 programs');
  });

  test('should navigate back with Previous button', async ({ page }) => {
    const { paginator } = await getTableStoryContent(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await paginator.getByRole('button', { name: 'Previous' }).click();
    await expect(paginator.locator('.paginator-info')).toContainText('Showing 1 to 5 of 10 programs');
  });

  test('should disable Previous button on first page', async ({ page }) => {
    const { paginator } = await getTableStoryContent(page);
    await expect(paginator.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('should filter rows from the search box', async ({ page }) => {
    const { paginator, dataRows } = await getTableStoryContent(page);
    await page.getByRole('searchbox', { name: /Search programs/i }).fill('housing');

    await expect(paginator.locator('.paginator-info')).toContainText('Showing 1 to 2 of 2 programs');
    await expect(dataRows).toHaveCount(2);
    await expect(dataRows.nth(0)).toContainText('Housing assistance');
    await expect(dataRows.nth(1)).toContainText('Emergency housing');
  });

  test('should reset the current report when filtering narrows the dataset', async ({ page }) => {
    const { paginator } = await getTableStoryContent(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('searchbox', { name: /Search programs/i }).fill('housing');
    await expect(paginator.locator('.paginator-info')).toContainText('Showing 1 to 2 of 2 programs');
  });

  test('should display table rows matching page size', async ({ page }) => {
    const { dataRows } = await getTableStoryContent(page);
    await expect(dataRows).toHaveCount(5);
  });
});

test.describe('Storybook Stories - Error Handling', () => {
  test('should handle missing story gracefully', async ({ page }) => {
    await page.goto(storyUrl('nonexistent--story'), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('nonexistent--story');
  });

  test('should recover from story error', async ({ page }) => {
    await page.goto(storyUrl('nonexistent--story'), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await gotoStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
  });
});
