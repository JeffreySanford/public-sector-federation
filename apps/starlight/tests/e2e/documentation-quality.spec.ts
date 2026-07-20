import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const storybookOrigin = 'https://master--6a57d5b6de2da2591d3236aa.chromatic.com';
const routes = [
  { name: 'overview', path: '/docs/' },
  { name: 'foundations', path: '/docs/foundations/' },
  { name: 'components', path: '/docs/components/' },
  { name: 'button', path: '/docs/components/button/' },
  { name: 'select', path: '/docs/components/select/' },
  { name: 'patterns', path: '/docs/patterns/' },
  { name: 'accessibility', path: '/docs/accessibility/' },
  { name: 'develop', path: '/docs/develop/' },
  { name: 'quality', path: '/docs/quality/' },
  { name: 'architecture', path: '/docs/architecture/' },
  { name: 'exploration', path: '/docs/exploration/' },
] as const;

async function open(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response, `No response was returned for ${route}.`).not.toBeNull();
  expect(response?.ok(), `${route} returned ${response?.status()}.`).toBeTruthy();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
}

async function expectNoHorizontalOverflow(page: Page) {
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => {
        const style = getComputedStyle(element);
        if (style.position === 'fixed' || style.position === 'absolute') return false;
        const rect = element.getBoundingClientRect();
        return rect.right > root.clientWidth + 1 || rect.left < -1;
      })
      .slice(0, 8)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        left: Math.round(element.getBoundingClientRect().left),
        right: Math.round(element.getBoundingClientRect().right),
      }));

    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      offenders,
    };
  });

  expect(
    result.scrollWidth,
    `Horizontal overflow detected: ${JSON.stringify(result, null, 2)}`,
  ).toBeLessThanOrEqual(result.clientWidth + 1);
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
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

test.describe('Starlight route integrity', () => {
  for (const route of routes) {
    test(`${route.name} renders one page title without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await open(page, route.path);
      await expectNoHorizontalOverflow(page);

      const tables = page.locator('table');
      for (let index = 0; index < (await tables.count()); index += 1) {
        const table = tables.nth(index);
        await expect(table).toBeVisible();
        const box = await table.boundingBox();
        expect(box?.width ?? 0).toBeLessThanOrEqual(1280);
      }
    });
  }
});

test.describe('responsive navigation and reflow', () => {
  for (const width of [360, 768, 1024, 1280, 1440]) {
    test(`documentation navigation remains usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, '/docs/components/');
      await expectNoHorizontalOverflow(page);
      await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();

      const menuButton = page
        .locator('starlight-menu-button button, button[aria-label*="menu" i]')
        .first();
      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
      }

      await expect(
        page.getByRole('link', { name: 'Foundations overview', exact: true }),
      ).toBeVisible();
    });

    test(`Button guidance and StoryFrame remain usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, '/docs/components/button/');
      await expectNoHorizontalOverflow(page);
      await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();

      const storyFrame = page.locator('[data-story-frame]');
      await expect(storyFrame).toBeVisible();
      await expect(storyFrame.getByRole('button', { name: 'Load live example' })).toBeVisible();
      await expect(storyFrame.getByRole('link', { name: 'Open full story' })).toBeVisible();
      const box = await storyFrame.boundingBox();
      expect(box?.width ?? 0).toBeLessThanOrEqual(width);
    });

    test(`Select guidance and StoryFrame remain usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, '/docs/components/select/');
      await expectNoHorizontalOverflow(page);
      await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible();

      const storyFrame = page.locator('[data-story-frame]');
      await expect(storyFrame).toBeVisible();
      await expect(storyFrame.getByRole('button', { name: 'Load live example' })).toBeVisible();
      await expect(storyFrame.getByRole('link', { name: 'Open full story' })).toBeVisible();
      const box = await storyFrame.boundingBox();
      expect(box?.width ?? 0).toBeLessThanOrEqual(width);
    });
  }

  test('Button content reflows at the 320 CSS-pixel equivalent of 200% zoom', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await open(page, '/docs/components/button/');
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load live example' })).toBeVisible();
  });

  test('Select content reflows at the 320 CSS-pixel equivalent of 200% zoom', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await open(page, '/docs/components/select/');
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load live example' })).toBeVisible();
  });
});

test.describe('StoryFrame contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${storybookOrigin}/**`, async (route) => route.abort());
  });

  test('loads the canonical Button story only after activation', async ({ page }) => {
    await open(page, '/docs/components/button/');
    const storyFrame = page.locator('[data-story-frame]');
    const iframe = storyFrame.locator('iframe');

    await expect(iframe).toBeHidden();
    await expect(iframe).toHaveAttribute('title', 'Button — default action');
    await expect(iframe).toHaveAttribute('loading', 'lazy');
    await storyFrame.getByRole('button', { name: 'Load live example' }).click();
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute(
      'src',
      /design-system-components-button--default.*themeVariant:neutral;themeMode:light/,
    );
  });

  test('loads the canonical Select story only after activation', async ({ page }) => {
    await open(page, '/docs/components/select/');
    const storyFrame = page.locator('[data-story-frame]');
    const iframe = storyFrame.locator('iframe');

    await expect(iframe).toBeHidden();
    await expect(iframe).toHaveAttribute('title', 'Select — choose a program');
    await expect(iframe).toHaveAttribute('loading', 'lazy');
    await storyFrame.getByRole('button', { name: 'Load live example' }).click();
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute(
      'src',
      /design-system-components-select--default.*themeVariant:neutral;themeMode:light/,
    );
  });

  test('reloads an activated story with the current documentation theme', async ({ page }) => {
    await open(page, '/docs/components/select/');
    const storyFrame = page.locator('[data-story-frame]');
    const iframe = storyFrame.locator('iframe');
    await storyFrame.getByRole('button', { name: 'Load live example' }).click();
    await setTheme(page, 'dark');
    await expect(iframe).toHaveAttribute('src', /themeMode:dark/);
  });
});

test.describe('theme and accessibility contracts', () => {
  test('shared token dark mode follows the Starlight theme', async ({ page }) => {
    await open(page, '/docs/');
    await setTheme(page, 'dark');
    await setTheme(page, 'light');
  });

  for (const route of [
    '/docs/',
    '/docs/components/',
    '/docs/components/button/',
    '/docs/components/select/',
    '/docs/architecture/',
  ]) {
    test(`${route} has no serious or critical axe violations`, async ({ page }) => {
      await open(page, route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter((violation) =>
        violation.impact === 'serious' || violation.impact === 'critical',
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  }

  test('critical overview semantics retain their accessibility-tree shape', async ({ page }) => {
    await open(page, '/docs/');
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(`
      - heading "Components you can understand, trust, and improve." [level=1]
    `);
    await expect(page.getByRole('link', { name: 'Explore components' })).toMatchAriaSnapshot(`
      - link "Explore components"
    `);
  });

  test('Button page and StoryFrame retain their critical accessibility-tree shape', async ({ page }) => {
    await open(page, '/docs/components/button/');
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(`
      - heading "Button" [level=1]
    `);
    await expect(page.locator('[data-story-frame]')).toMatchAriaSnapshot(`
      - region "Button — default action live example":
        - strong: Button — default action
        - paragraph: The stable ps-button wrapper using its preferred intent, appearance, and activated contract.
        - link "Open full story"
        - paragraph: Load the isolated implementation when you are ready to interact with it.
        - button "Load live example"
        - paragraph: The live frame is opt-in to keep documentation navigation fast and predictable.
    `);
  });

  test('Select page and StoryFrame retain their critical accessibility-tree shape', async ({ page }) => {
    await open(page, '/docs/components/select/');
    await expect(page.getByRole('heading', { level: 1 })).toMatchAriaSnapshot(`
      - heading "Select" [level=1]
    `);
    await expect(page.locator('[data-story-frame]')).toMatchAriaSnapshot(`
      - region "Select — choose a program live example":
        - strong: Select — choose a program
        - paragraph: The stable ps-select wrapper with a visible label, placeholder, provider-neutral options, and a nullable string value.
        - link "Open full story"
        - paragraph: Load the isolated implementation when you are ready to interact with it.
        - button "Load live example"
        - paragraph: The live frame is opt-in to keep documentation navigation fast and predictable.
    `);
  });
});

test.describe('human-reviewed visual baselines', () => {
  test('overview light desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('overview-light-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('overview dark desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await open(page, '/docs/');
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('overview-dark-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('overview light mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('overview-light-mobile.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Button light desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/components/button/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('button-light-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Button dark desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await open(page, '/docs/components/button/');
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('button-dark-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Button light mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/components/button/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('button-light-mobile.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Select light desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/components/select/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('select-light-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Select dark desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await open(page, '/docs/components/select/');
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('select-dark-desktop.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });

  test('Select light mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await open(page, '/docs/components/select/');
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('select-light-mobile.png', {
      fullPage: true,
      mask: [page.locator('time')],
    });
  });
});
