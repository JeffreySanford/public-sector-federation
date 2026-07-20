import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const inputStoryId = 'design-system-components-input';

function storyUrl(story: string): string {
  const params = new URLSearchParams({
    id: `${inputStoryId}--${story}`,
    viewMode: 'story',
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoInputStory(page: Page, story: string): Promise<void> {
  await page.goto(storyUrl(story), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

test.describe('Input isolated Storybook contract', () => {
  test('exposes an accessible labelled textbox that accepts typed input', async ({ page }) => {
    await gotoInputStory(page, 'default');
    const input = page.getByRole('textbox', { name: 'Case ID' });

    await expect(input).toBeVisible();
    await input.fill('PS-2026-1042');
    await expect(input).toHaveValue('PS-2026-1042');
  });

  test('renders the search and password native types', async ({ page }) => {
    await gotoInputStory(page, 'search');
    await expect(page.getByRole('searchbox', { name: 'Search program performance' })).toBeVisible();

    await gotoInputStory(page, 'password');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Generate or enter password');
  });

  test('renders the date native type', async ({ page }) => {
    await gotoInputStory(page, 'date');
    await expect(page.locator('input[type="date"]')).toBeVisible();
  });

  test('keeps the disabled field unavailable', async ({ page }) => {
    await gotoInputStory(page, 'disabled');
    const input = page.getByRole('textbox', { name: 'Case ID' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('PS-2026-1042');
  });

  test('associates required, help, invalid, and error guidance with the field', async ({ page }) => {
    await gotoInputStory(page, 'required-with-help');
    let input = page.getByRole('textbox', { name: 'Case ID' });
    await expect(input).toHaveAttribute('id', 'required-case-id');
    await expect(input).toHaveAttribute('aria-required', 'true');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', 'required-case-id-help');

    await gotoInputStory(page, 'invalid-with-error');
    input = page.getByRole('textbox', { name: 'Case ID' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', 'invalid-case-id-help invalid-case-id-error');
    await expect(page.locator('#invalid-case-id-error')).toHaveText('Enter a valid case ID before continuing.');
  });

  test('keeps long labels readable at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoInputStory(page, 'long-label');
    const geometry = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  });

  test('keeps the field visible and focusable in forced-colors mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoInputStory(page, 'default');
    const input = page.getByRole('textbox', { name: 'Case ID' });
    await input.focus();
    await expect(input).toBeFocused();
    await expect(input).toBeVisible();
  });
});
