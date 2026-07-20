import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const tableStoryId = 'design-system-components-table';

function storyUrl(story: string): string {
  const params = new URLSearchParams({
    id: `${tableStoryId}--${story}`,
    viewMode: 'story',
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoTableStory(page: Page, story: string): Promise<void> {
  await page.goto(storyUrl(story), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

test.describe('Table isolated Storybook contract', () => {
  test('renders an accessible, labelled table with projected row content', async ({ page }) => {
    await gotoTableStory(page, 'default');
    const region = page.getByRole('region', { name: 'Case queue' });
    await expect(region).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Case' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'PS-2026-1042' })).toBeVisible();
  });

  test('toggles sort direction on the sortable column and writes the sort model', async ({ page }) => {
    await gotoTableStory(page, 'sortable');
    const output = page.locator('output');
    await expect(output).toHaveText('Sort: none asc');

    const sortButton = page.getByRole('button', { name: 'Case' });
    const header = page.getByRole('columnheader', { name: 'Case' });

    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(output).toHaveText('Sort: case asc');

    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(output).toHaveText('Sort: case desc');
  });

  test('supports row actions projected into a data cell', async ({ page }) => {
    await gotoTableStory(page, 'with-row-actions');
    await expect(page.getByRole('button', { name: 'Open' })).toBeVisible();
  });

  test('renders the built-in empty state instead of projected content', async ({ page }) => {
    await gotoTableStory(page, 'empty');
    await expect(page.getByText('No results found.')).toBeVisible();
    const emptyCell = page.locator('.ps-table__empty');
    await expect(emptyCell).toHaveAttribute('colspan', '5');
  });

  test('keeps the overflow region keyboard-focusable and does not overflow the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoTableStory(page, 'mobile-overflow');
    const region = page.getByRole('region', { name: 'Case queue' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await region.focus();
    await expect(region).toBeFocused();

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('keeps long cell content from forcing page-level overflow', async ({ page }) => {
    await gotoTableStory(page, 'long-content');
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
