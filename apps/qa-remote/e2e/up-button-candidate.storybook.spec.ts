import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const candidateId = 'design-system-candidates-button-up';

function storyUrl(story: string, globals?: string): string {
  const params = new URLSearchParams({
    id: `${candidateId}--${story}`,
    viewMode: 'story',
  });

  if (globals) {
    params.set('globals', globals);
  }

  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoCandidateStory(page: Page, story: string, globals?: string): Promise<void> {
  await page.goto(storyUrl(story, globals), { waitUntil: 'domcontentloaded', timeout: 60000 });
  const body = page.locator('body');
  await expect(body).toBeVisible({ timeout: 20000 });
}

test.describe('UP Button Candidate isolated Storybook iframe', () => {
  test('renders primary story with role, accessible name, and token-driven styles', async ({ page }) => {
    await gotoCandidateStory(page, 'primary');

    const button = page.getByRole('button', { name: 'Primary action' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    const styles = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        color: computed.color,
        fontWeight: computed.fontWeight,
      };
    });

    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderRadius).not.toBe('0px');
    expect(Number(styles.fontWeight)).toBeGreaterThanOrEqual(600);
  });

  test('emits normalized buttonClick on pointer and keyboard activation', async ({ page }) => {
    await gotoCandidateStory(page, 'interaction-harness');

    const button = page.getByRole('button', { name: 'Submit application' });
    const output = page.locator('output');

    await expect(output).toHaveText('Activations: 0');
    await button.click();
    await expect(output).toHaveText('Activations: 1');

    await button.focus();
    await page.keyboard.press('Enter');
    await expect(output).toHaveText('Activations: 2');

    await page.keyboard.press('Space');
    await expect(output).toHaveText('Activations: 3');
  });

  test('prevents activation when disabled', async ({ page }) => {
    await gotoCandidateStory(page, 'disabled');

    const button = page.getByRole('button', { name: 'Unavailable action' });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test('prevents activation while loading and exposes busy state', async ({ page }) => {
    await gotoCandidateStory(page, 'loading');

    const button = page.getByRole('button', { name: 'Submitting' });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  });

  test('shows visible focus treatment', async ({ page }) => {
    await gotoCandidateStory(page, 'primary');

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();

    const focusStyle = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        outlineStyle: computed.outlineStyle,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    expect(focusStyle.outlineStyle === 'none' && focusStyle.boxShadow === 'none').toBe(false);
    expect(focusStyle.outlineWidth).not.toBe('0px');
  });

  test('renders the long label without clipping', async ({ page }) => {
    await gotoCandidateStory(page, 'long-label');

    const button = page.getByRole('button', {
      name: 'Submit housing assistance eligibility review for North Region queue',
    });
    await expect(button).toBeVisible();

    const geometry = await button.evaluate((element) => {
      const htmlElement = element as HTMLElement;
      return {
        clientWidth: htmlElement.clientWidth,
        scrollWidth: htmlElement.scrollWidth,
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
  });

  test('renders tone and appearance matrix stories', async ({ page }) => {
    await gotoCandidateStory(page, 'tone-matrix');
    await expect(page.getByRole('button', { name: 'primary action' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'error action' })).toBeVisible();

    await gotoCandidateStory(page, 'appearance-matrix');
    await expect(page.getByRole('button', { name: 'Primary action' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Error action' }).first()).toBeVisible();
  });

  test('renders current wrapper and UP candidate comparison story', async ({ page }) => {
    await gotoCandidateStory(page, 'current-vs-candidate');

    await expect(page.getByRole('heading', { name: 'Current Button vs UP Button candidate' })).toBeVisible();
    await expect(page.getByText('Current design system')).toBeVisible();
    await expect(page.getByText('UP Design System candidate')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary action' })).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Submit housing assistance eligibility review for North Region queue' })).toHaveCount(2);
  });

  test('responds to Storybook theme globals in dark vibrant mode', async ({ page }) => {
    await gotoCandidateStory(page, 'primary', 'themeMode:dark;themeVariant:vibrant');

    const button = page.getByRole('button', { name: 'Primary action' });
    await expect(button).toBeVisible();

    const tokenValues = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.documentElement);
      return {
        modeClass: document.documentElement.classList.contains('p-dark'),
        variantClass: document.documentElement.classList.contains('ps-theme-vibrant'),
        buttonBackground: computed.getPropertyValue('--ps-button-background').trim(),
        buttonText: computed.getPropertyValue('--ps-button-text').trim(),
      };
    });

    expect(tokenValues.modeClass).toBe(true);
    expect(tokenValues.variantClass).toBe(true);
    expect(tokenValues.buttonBackground).toBeTruthy();
    expect(tokenValues.buttonText).toBeTruthy();
  });
});
