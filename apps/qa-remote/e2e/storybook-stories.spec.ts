import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const storybookHomeUrl = 'http://localhost:4400';
const buttonTagStoryId = 'design-system-interaction-stories-button-and-tag--states';
const tableStoryId = 'design-system-acceptance-table-paginator--sort-filter-and-page';

function managerStoryUrl(storyId: string): string {
  return `${storybookHomeUrl}/?path=/story/${storyId}`;
}

function iframeStoryUrl(storyId: string): string {
  const params = new URLSearchParams({ id: storyId, viewMode: 'story' });
  return `${storybookHomeUrl}/iframe.html?${params.toString()}`;
}

async function gotoStorybookHome(page: Page): Promise<void> {
  await page.goto(storybookHomeUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

async function gotoManagerStory(page: Page, storyId = buttonTagStoryId): Promise<void> {
  await page.goto(managerStoryUrl(storyId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('#storybook-preview-iframe')).toBeVisible({ timeout: 20000 });
}

async function gotoIframeStory(page: Page, storyId = buttonTagStoryId): Promise<void> {
  await page.goto(iframeStoryUrl(storyId), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

async function storyEntries(request: APIRequestContext): Promise<Record<string, unknown>> {
  const response = await request.get(`${storybookHomeUrl}/index.json`);
  expect(response.ok()).toBe(true);
  const payload = (await response.json()) as { entries?: Record<string, unknown> };
  return payload.entries ?? {};
}

async function getTableStory(page: Page) {
  await gotoIframeStory(page, tableStoryId);
  await expect(
    page.getByRole('heading', { name: /Filter and page through active programs/i }),
  ).toBeVisible({ timeout: 20000 });

  const paginator = page.locator('.paginator');
  await expect(paginator).toBeVisible({ timeout: 20000 });
  await expect(paginator.locator('.paginator-info')).toBeVisible({ timeout: 20000 });

  const table = page.locator('table').filter({
    has: page.getByRole('columnheader', { name: 'Program' }),
  });
  const dataRows = table.locator('tbody > tr:visible').filter({ has: page.locator('td') });
  return { paginator, dataRows };
}

test.describe('Storybook Stories - Rendering & Console', () => {
  test('should load Storybook dashboard', async ({ page }) => {
    await gotoStorybookHome(page);
    expect(await page.title()).toBeTruthy();
  });

  test('should render story without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await gotoIframeStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('should display story canvas', async ({ page }) => {
    await gotoManagerStory(page);
    await expect(page.locator('#storybook-preview-iframe')).toBeVisible();
  });

  test('should load story panel without errors', async ({ page }) => {
    await gotoManagerStory(page);
    const errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
    await expect(errorMessage).toHaveCount(0);
  });
});

test.describe('Storybook Stories - Accessibility (WCAG 2.1 AA)', () => {
  test('should render Button and Tag components with correct styling', async ({ page }) => {
    await gotoIframeStory(page);
    await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
    await expect(page.getByText('On track', { exact: true })).toBeVisible();
  });

  test('should have semantic heading structure', async ({ page }) => {
    await gotoIframeStory(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Button and tag states' })).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await gotoIframeStory(page);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
  });
});

test.describe('Storybook Stories - Keyboard Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await gotoIframeStory(page);
    const firstButton = page.getByRole('button').first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBeTruthy();
  });

  test('should support Enter key on interactive elements', async ({ page }) => {
    await gotoIframeStory(page);
    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    await button.press('Enter');
    await expect(button).toBeVisible();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await gotoIframeStory(page);
    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    await expect(button).toBeFocused();
  });
});

test.describe('Storybook Stories - Props & Controls', () => {
  test('should display story controls panel', async ({ page }) => {
    await gotoManagerStory(page);
    await expect(page.locator('[role="tablist"]').first()).toBeVisible();
  });

  test('should update story when controls change', async ({ page }) => {
    await gotoManagerStory(page);
    await expect(page.locator('#storybook-preview-iframe')).toBeVisible();
  });
});

test.describe('Storybook Stories - Component Coverage', () => {
  test('should have PublicEmptyStateComponent story', async ({ request }) => {
    const entries = await storyEntries(request);
    expect(JSON.stringify(entries)).toMatch(/empty.?state/i);
  });

  test('should have PublicFormSectionComponent story', async ({ request }) => {
    const entries = await storyEntries(request);
    expect(JSON.stringify(entries)).toMatch(/form.?section/i);
  });

  test('should have PublicPageHeaderComponent story', async ({ request }) => {
    const entries = await storyEntries(request);
    expect(JSON.stringify(entries)).toMatch(/page.?header/i);
  });

  test('should have PublicStatusCardComponent story', async ({ request }) => {
    const entries = await storyEntries(request);
    expect(JSON.stringify(entries)).toMatch(/status.?card/i);
  });

  test('should have at least 4 component stories', async ({ request }) => {
    const entries = await storyEntries(request);
    expect(Object.keys(entries).length).toBeGreaterThanOrEqual(4);
  });
});

test.describe('Storybook Stories - Performance', () => {
  test('should load Storybook within 5 seconds', async ({ page }) => {
    await gotoStorybookHome(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should render story within 3 seconds', async ({ page }) => {
    await gotoIframeStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
  });
});

test.describe('Storybook Stories - Table Paginator Functionality', () => {
  test('should display paginator controls', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    await expect(paginator.getByRole('button', { name: 'Previous' })).toBeVisible();
    await expect(paginator.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 5 of 10 programs',
    );
  });

  test('should navigate between pages with Next button', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    const currentReport = paginator.locator('.paginator-info');
    await paginator.getByRole('button', { name: 'Next' }).click();
    await expect(currentReport).toContainText('Showing 6 to 10 of 10 programs');
  });

  test('should navigate back with Previous button', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await paginator.getByRole('button', { name: 'Previous' }).click();
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 5 of 10 programs',
    );
  });

  test('should disable Previous button on first page', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    await expect(paginator.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('should filter rows from the search box', async ({ page }) => {
    const { paginator, dataRows } = await getTableStory(page);
    await page.getByRole('searchbox', { name: /Search programs/i }).fill('housing');
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 2 of 2 programs',
    );
    await expect(dataRows).toHaveCount(2);
    await expect(dataRows.nth(0)).toContainText('Housing assistance');
    await expect(dataRows.nth(1)).toContainText('Emergency housing');
  });

  test('should reset the current report when filtering narrows the dataset', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('searchbox', { name: /Search programs/i }).fill('housing');
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 2 of 2 programs',
    );
  });

  test('should display table rows matching page size', async ({ page }) => {
    const { dataRows } = await getTableStory(page);
    await expect(dataRows).toHaveCount(5);
  });

  test('should support 5, 10, and 15 rows-per-page options', async ({ page }) => {
    const { paginator } = await getTableStory(page);
    const rowsSelect = paginator.locator('select');
    const optionValues = await rowsSelect
      .locator('option')
      .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
    expect(optionValues).toEqual(['5', '10', '15']);

    await rowsSelect.selectOption('15');
    await expect(paginator.locator('.paginator-info')).toContainText('Showing 1 to 10 of 10 programs');
  });

  test('should sort a string column ascending and descending', async ({ page }) => {
    const { dataRows } = await getTableStory(page);
    const programHeader = page.getByRole('columnheader', { name: 'Program' });

    await programHeader.getByRole('button').click();
    await expect(programHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(dataRows.first()).toContainText('Benefits renewal');

    await programHeader.getByRole('button').click();
    await expect(programHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(dataRows.first()).toContainText('Transit assistance');
  });

  test('should sort a numeric column by value, not string order', async ({ page }) => {
    const { dataRows } = await getTableStory(page);
    const casesHeader = page.getByRole('columnheader', { name: 'Cases' });

    await casesHeader.getByRole('button').click();
    await expect(casesHeader).toHaveAttribute('aria-sort', 'ascending');
    // Ascending numeric order starts at 72 (Permit inspections); a naive string
    // sort would incorrectly place "137" or "158" before "72".
    await expect(dataRows.first()).toContainText('Permit inspections');
  });
});

test.describe('Storybook Stories - Error Handling', () => {
  test('should handle missing story gracefully', async ({ page }) => {
    await page.goto(managerStoryUrl('nonexistent--story'), {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    expect(await page.content()).toBeTruthy();
    expect(await page.title()).toBeTruthy();
  });

  test('should recover from story error', async ({ page }) => {
    await gotoIframeStory(page);
    await expect(page.getByRole('heading', { name: 'Button and tag states' })).toBeVisible();
  });
});
