import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const buttonStoryId = 'design-system-components-button';

function storyUrl(story: string): string {
  const params = new URLSearchParams({
    id: `${buttonStoryId}--${story}`,
    viewMode: 'story',
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoButtonStory(page: Page, story: string): Promise<void> {
  await page.goto(storyUrl(story), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

test.describe('Stable Button accessibility evidence', () => {
  test('emits exactly once for pointer, Enter, and Space activation', async ({ page }) => {
    await gotoButtonStory(page, 'interaction-harness');

    const button = page.getByRole('button', { name: 'Submit application' });
    const output = page.getByRole('status');

    await expect(output).toHaveText('Activations: 0');

    await button.click();
    await expect(output).toHaveText('Activations: 1');

    await button.focus();
    await page.keyboard.press('Enter');
    await expect(output).toHaveText('Activations: 2');

    await page.keyboard.press('Space');
    await expect(output).toHaveText('Activations: 3');
  });

  test('preserves its accessible name and suppresses activation while loading', async ({ page }) => {
    await gotoButtonStory(page, 'interaction-harness');

    const button = page.getByRole('button', { name: 'Submitting application' });
    const output = page.getByRole('status');

    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(page.locator('ps-button').filter({ has: button }).locator('p-button')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(output).toHaveText('Activations: 0');

    await button.click({ force: true });
    await expect(output).toHaveText('Activations: 0');
  });

  test('exposes a visible focus treatment for keyboard users', async ({ page }) => {
    await gotoButtonStory(page, 'default');

    const button = page.getByRole('button', { name: 'Save changes' });
    await button.focus();
    await expect(button).toBeFocused();

    const focusStyle = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        outlineStyle: computed.outlineStyle,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    expect(focusStyle.outlineStyle === 'none' && focusStyle.boxShadow === 'none').toBe(false);
    expect(focusStyle.outlineWidth === '0px' && focusStyle.boxShadow === 'none').toBe(false);
  });

  test('keeps disabled actions out of activation', async ({ page }) => {
    await gotoButtonStory(page, 'disabled');

    const button = page.getByRole('button', { name: 'Unavailable action' });
    await expect(button).toBeDisabled();
  });
});
