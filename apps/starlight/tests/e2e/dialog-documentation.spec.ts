import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const route = '/docs/components/dialog/';
const storybookOrigin = 'https://master--6a57d5b6de2da2591d3236aa.chromatic.com';

async function open(page: Page): Promise<void> {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response).not.toBeNull();
  expect(response?.ok(), `${route} returned ${response?.status()}.`).toBeTruthy();
  await expect(page.getByRole('heading', { level: 1, name: 'Dialog' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
}

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.evaluate((nextTheme) => {
    document.documentElement.dataset.theme = nextTheme;
  }, theme);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveClass(/p-dark/);
  } else {
    await expect(page.locator('html')).not.toHaveClass(/p-dark/);
  }
}

test.describe('Dialog documentation contract', () => {
  for (const width of [360, 768, 1024, 1280, 1440]) {
    test(`Dialog guidance and StoryFrame remain usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      await expectNoHorizontalOverflow(page);

      const storyFrame = page.locator('[data-story-frame]');
      await expect(storyFrame).toBeVisible();
      await expect(storyFrame.getByRole('button', { name: 'Load live example' })).toBeVisible();
      await expect(storyFrame.getByRole('link', { name: 'Open full story' })).toBeVisible();
      const box = await storyFrame.boundingBox();
      expect(box?.width ?? 0).toBeLessThanOrEqual(width);
    });
  }

  test('Dialog content reflows at the 320 CSS-pixel equivalent of 200% zoom', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await open(page);
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('button', { name: 'Load live example' })).toBeVisible();
  });

  test('loads the canonical Dialog story only after activation', async ({ page }) => {
    await page.route(`${storybookOrigin}/**`, async (request) => request.abort());
    await open(page);
    const storyFrame = page.locator('[data-story-frame]');
    const iframe = storyFrame.locator('iframe');

    await expect(iframe).toBeHidden();
    await expect(iframe).toHaveAttribute('title', 'Dialog — review an application');
    await expect(iframe).toHaveAttribute('loading', 'lazy');
    await storyFrame.getByRole('button', { name: 'Load live example' }).click();
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute(
      'src',
      /design-system-components-dialog--default.*themeVariant:neutral;themeMode:light/,
    );
  });

  test('reloads the activated Dialog story with the documentation theme', async ({ page }) => {
    await page.route(`${storybookOrigin}/**`, async (request) => request.abort());
    await open(page);
    const storyFrame = page.locator('[data-story-frame]');
    const iframe = storyFrame.locator('iframe');
    await storyFrame.getByRole('button', { name: 'Load live example' }).click();
    await setTheme(page, 'dark');
    await expect(iframe).toHaveAttribute('src', /themeMode:dark/);
  });

  test('has no serious or critical axe violations', async ({ page }) => {
    await open(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('retains the critical Dialog page and StoryFrame accessibility-tree shape', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(`
      - heading "Dialog" [level=1]
    `);
    await expect(page.locator('[data-story-frame]')).toMatchAriaSnapshot(`
      - region "Dialog — review an application live example":
        - strong: Dialog — review an application
        - paragraph: The stable ps-dialog wrapper with a labelled modal surface, close control, body content, footer actions, focus containment, and opener restoration.
        - link "Open full story"
        - paragraph: Load the isolated implementation when you are ready to interact with it.
        - button "Load live example"
        - paragraph: The live frame is opt-in to keep documentation navigation fast and predictable.
    `);
  });
});

test.describe('Dialog human-reviewed visual baselines', () => {
  test('Dialog light desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page);
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('dialog-light-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Dialog dark desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await open(page);
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('dialog-dark-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Dialog light mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page);
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('dialog-light-mobile.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });
});
