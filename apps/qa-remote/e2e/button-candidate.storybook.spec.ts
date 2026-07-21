import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const candidateId = 'design-system-experiments-button-contract-exploration';

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

test.describe('Button Contract Exploration isolated Storybook iframe', () => {
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
        tokenBackground: computed.getPropertyValue('--ps-up-button-background').trim(),
        tokenForeground: computed.getPropertyValue('--ps-up-button-foreground').trim(),
        tokenBorderColor: computed.getPropertyValue('--ps-up-button-border-color').trim(),
        tokenMinHeight: computed.getPropertyValue('--ps-up-button-min-height').trim(),
      };
    });

    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.borderRadius).not.toBe('0px');
    expect(Number(styles.fontWeight)).toBeGreaterThanOrEqual(600);
    expect(styles.tokenBackground).toBeTruthy();
    expect(styles.tokenForeground).toBeTruthy();
    expect(styles.tokenBorderColor).toBeTruthy();
    expect(styles.tokenMinHeight).toBeTruthy();
  });

  test('applies token-driven hover and pressed styles', async ({ page }) => {
    await gotoCandidateStory(page, 'primary');

    const button = page.getByRole('button', { name: 'Primary action' });
    await expect(button).toBeVisible();

    const defaultStyles = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
      };
    });

    await button.hover();
    await expect
      .poll(async () => button.evaluate((element) => window.getComputedStyle(element).backgroundColor))
      .not.toBe(defaultStyles.backgroundColor);

    const hoverStyles = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        tokenBackground: computed.getPropertyValue('--ps-up-button-hover-background').trim(),
      };
    });

    await page.mouse.down();
    await expect
      .poll(async () => button.evaluate((element) => window.getComputedStyle(element).backgroundColor))
      .not.toBe(defaultStyles.backgroundColor);
    const pressedStyles = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        tokenBackground: computed.getPropertyValue('--ps-up-button-active-background').trim(),
      };
    });
    await page.mouse.up();

    expect(hoverStyles.tokenBackground).toBeTruthy();
    expect(pressedStyles.tokenBackground).toBeTruthy();
    expect(hoverStyles.backgroundColor).not.toBe(defaultStyles.backgroundColor);
    expect(pressedStyles.backgroundColor).not.toBe(defaultStyles.backgroundColor);
    expect(hoverStyles.borderColor).not.toBe(defaultStyles.borderColor);
  });

  test('emits normalized activated events on pointer and keyboard activation', async ({ page }) => {
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
    await expect(page.locator('ps-up-button')).toHaveAttribute('aria-busy', 'true');
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

  test('renders intent and appearance matrix stories', async ({ page }) => {
    await gotoCandidateStory(page, 'tone-matrix');
    await expect(page.getByRole('button', { name: 'primary action' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'destructive action' })).toBeVisible();

    await gotoCandidateStory(page, 'appearance-matrix');
    await expect(page.getByRole('button', { name: 'Primary action' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Destructive action' }).first()).toBeVisible();
  });

  test('renders interaction, size, focus, mode, and theme reference stories', async ({ page }) => {
    await gotoCandidateStory(page, 'interaction-state-reference');
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    await expect(page.locator('ps-up-button').filter({ has: page.getByRole('button', { name: 'Loading' }) })).toHaveAttribute('aria-busy', 'true');

    await gotoCandidateStory(page, 'size-matrix');
    await expect(page.getByRole('button', { name: /Compact$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Spacious$/ })).toBeVisible();

    await gotoCandidateStory(page, 'focus-reference');
    await expect(page.getByRole('button', { name: 'Focus reference' })).toBeVisible();

    await gotoCandidateStory(page, 'light-dark-mode-matrix');
    await expect(page.getByRole('button', { name: 'primary' })).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'destructive' })).toHaveCount(2);

    await gotoCandidateStory(page, 'theme-variant-matrix');
    await expect(page.getByRole('button', { name: 'Primary' })).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Outlined' })).toHaveCount(3);
  });

  test('renders current wrapper and candidate comparison story', async ({ page }) => {
    await gotoCandidateStory(page, 'current-vs-candidate');

    await expect(page.getByRole('heading', { name: 'Current Button vs Button candidate' })).toBeVisible();
    await expect(page.getByText('Current design system')).toBeVisible();
    await expect(page.getByText('Experimental candidate')).toBeVisible();
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
        candidateButtonBackground: computed.getPropertyValue('--ps-up-button-background').trim(),
        candidateButtonForeground: computed.getPropertyValue('--ps-up-button-foreground').trim(),
      };
    });

    expect(tokenValues.modeClass).toBe(true);
    expect(tokenValues.variantClass).toBe(true);
    expect(tokenValues.buttonBackground).toBeTruthy();
    expect(tokenValues.buttonText).toBeTruthy();
    expect(tokenValues.candidateButtonBackground).toBeTruthy();
    expect(tokenValues.candidateButtonForeground).toBeTruthy();
  });
});
