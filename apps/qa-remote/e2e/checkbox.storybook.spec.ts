import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const checkboxStoryId = 'design-system-components-checkbox';

function storyUrl(story: string): string {
  const params = new URLSearchParams({
    id: `${checkboxStoryId}--${story}`,
    viewMode: 'story',
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoCheckboxStory(page: Page, story: string): Promise<void> {
  await page.goto(storyUrl(story), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

test.describe('Checkbox isolated Storybook contract', () => {
  test('exposes an accessible checkbox and toggles with the keyboard', async ({ page }) => {
    await gotoCheckboxStory(page, 'default');
    const checkbox = page.getByRole('checkbox', { name: 'Expedite review' });

    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
  });

  test('exposes the switch role for the switch variant', async ({ page }) => {
    await gotoCheckboxStory(page, 'switch');
    const toggle = page.getByRole('switch', { name: 'Audit logging' });
    await expect(toggle).toBeVisible();
  });

  test('renders the checked state without fabricating a value', async ({ page }) => {
    await gotoCheckboxStory(page, 'checked');
    await expect(page.getByRole('checkbox', { name: 'Expedite review' })).toBeChecked();
  });

  test('keeps the disabled control unavailable', async ({ page }) => {
    await gotoCheckboxStory(page, 'disabled');
    const checkbox = page.getByRole('checkbox', { name: 'Expedite review' });
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toBeChecked();
  });

  test('associates required, help, invalid, and error guidance with the control', async ({ page }) => {
    await gotoCheckboxStory(page, 'required-with-help');
    let checkbox = page.getByRole('checkbox', { name: 'Expedite review' });
    await expect(checkbox).toHaveAttribute('id', 'required-acknowledgement');
    await expect(checkbox).toHaveAttribute('aria-required', 'true');
    await expect(checkbox).not.toHaveAttribute('aria-invalid', 'true');
    await expect(checkbox).toHaveAttribute('aria-describedby', 'required-acknowledgement-help');

    await gotoCheckboxStory(page, 'invalid-with-error');
    checkbox = page.getByRole('checkbox', { name: 'Expedite review' });
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    await expect(checkbox).toHaveAttribute(
      'aria-describedby',
      'invalid-acknowledgement-help invalid-acknowledgement-error',
    );
    await expect(page.locator('#invalid-acknowledgement-error')).toHaveText(
      'Acknowledgement is required before continuing.',
    );
  });

  test('keeps long labels readable at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoCheckboxStory(page, 'long-label');
    const label = page.locator('.ps-checkbox-field__control');
    const geometry = await label.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  });

  test('keeps the control visible and focusable in forced-colors mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoCheckboxStory(page, 'default');
    const checkbox = page.getByRole('checkbox', { name: 'Expedite review' });
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    await expect(checkbox).toBeVisible();
  });
});
