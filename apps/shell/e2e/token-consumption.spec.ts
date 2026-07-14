import { expect, test } from '@playwright/test';

const tokenNames = [
  '--ps-surface-background',
  '--ps-text-primary',
  '--ps-button-background',
  '--ps-button-text',
  '--p-content-background',
  '--p-primary-color',
  '--p-text-color',
];

type OverlayCheck = {
  name: string;
  selector: string;
  open: (page: import('@playwright/test').Page) => Promise<void>;
};

async function readRootTokens(page: import('@playwright/test').Page) {
  return page.evaluate((names) => {
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
  }, tokenNames);
}

async function readElementTokens(page: import('@playwright/test').Page, selector: string) {
  return page.locator(selector).evaluate(
    (element, names) => {
      const styles = getComputedStyle(element);
      return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
    },
    tokenNames,
  );
}

async function readBodyOverlayTokens(page: import('@playwright/test').Page, check: OverlayCheck) {
  await check.open(page);

  const overlay = page.locator(check.selector).last();
  await expect(overlay, `${check.name} overlay should be visible`).toBeVisible();

  return overlay.evaluate((element, names) => {
    let overlayRoot = element;
    while (overlayRoot.parentElement && overlayRoot.parentElement !== document.body) {
      overlayRoot = overlayRoot.parentElement;
    }

    const styles = getComputedStyle(overlayRoot);
    const rootStyles = getComputedStyle(document.documentElement);

    return {
      parentTag: overlayRoot.parentElement?.tagName ?? '',
      background: styles.backgroundColor,
      color: styles.color,
      tokens: Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()])),
      rootTokens: Object.fromEntries(names.map((name) => [name, rootStyles.getPropertyValue(name).trim()])),
    };
  }, tokenNames);
}

async function closeOpenOverlay(page: import('@playwright/test').Page) {
  await page.keyboard.press('Escape');
  await page.mouse.click(12, 12);
}

test.describe('Design token consumption contract', () => {
  test('resolves the shared token contract in the shell and a mounted remote', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('public-sector-shell')).toBeVisible();

    const shellTokens = await readRootTokens(page);
    for (const name of tokenNames) {
      expect(shellTokens[name], `${name} should resolve in the shell`).not.toBe('');
    }

    await page.goto('/qa');
    await expect(page.locator('public-qa-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Component and token coverage/i })).toBeVisible();

    const hostBoundary = await page.locator('public-qa-root').evaluate((element) => ({
      tagName: element.tagName.toLowerCase(),
      hasShadowRoot: Boolean(element.shadowRoot),
    }));
    expect(hostBoundary.tagName).toBe('public-qa-root');
    expect(hostBoundary.hasShadowRoot).toBe(false);

    const remoteTokens = await readRootTokens(page);
    for (const name of tokenNames) {
      expect(remoteTokens[name], `${name} should resolve in the mounted QA remote`).not.toBe('');
    }

    const remoteHostTokens = await readElementTokens(page, 'public-qa-root');
    for (const name of tokenNames) {
      expect(remoteHostTokens[name], `${name} should resolve on the QA custom-element host`).not.toBe('');
      expect(remoteHostTokens[name]).toBe(remoteTokens[name]);
    }

    expect(remoteTokens['--ps-button-background']).toBe(shellTokens['--ps-button-background']);
    expect(remoteTokens['--p-content-background']).toBe(shellTokens['--p-content-background']);
  });

  test('updates shell and mounted remote token values when the shell theme changes', async ({ page }) => {
    await page.goto('/qa');
    await expect(page.locator('public-qa-root')).toBeVisible();

    const lightTokens = await readRootTokens(page);
    await page.getByRole('button', { name: /Use dark mode/i }).click();
    await expect(page.getByRole('button', { name: /Use light mode/i })).toBeVisible();

    const darkTokens = await readRootTokens(page);
    expect(darkTokens['--ps-surface-background']).not.toBe(lightTokens['--ps-surface-background']);
    expect(darkTokens['--p-content-background']).not.toBe(lightTokens['--p-content-background']);

    const remoteHostTokens = await readElementTokens(page, 'public-qa-root');
    expect(remoteHostTokens['--ps-surface-background']).toBe(darkTokens['--ps-surface-background']);
    expect(remoteHostTokens['--p-content-background']).toBe(darkTokens['--p-content-background']);

    await expect(page.getByRole('heading', { name: /Component and token coverage/i })).toBeVisible();
  });

  test('keeps shared overlay surfaces in the shared token context', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('public-admin-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Administrative settings/i })).toBeVisible();

    await page.getByRole('button', { name: /Open dialog/i }).click();
    const dialog = page.getByRole('dialog', { name: /Remote dialog/i });
    await expect(dialog).toBeVisible();

    const overlayStyles = await dialog.evaluate((element) => {
      const styles = getComputedStyle(element);
      const rootStyles = getComputedStyle(document.documentElement);
      return {
        overlayHasShadowRoot: Boolean(element.shadowRoot),
        background: styles.backgroundColor,
        color: styles.color,
        contentBackground: styles.getPropertyValue('--p-content-background').trim(),
        textColor: styles.getPropertyValue('--p-text-color').trim(),
        tokenBackground: rootStyles.getPropertyValue('--p-content-background').trim(),
        tokenText: rootStyles.getPropertyValue('--p-text-color').trim(),
      };
    });

    expect(overlayStyles.overlayHasShadowRoot).toBe(false);
    expect(overlayStyles.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(overlayStyles.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(overlayStyles.contentBackground).toBe(overlayStyles.tokenBackground);
    expect(overlayStyles.textColor).toBe(overlayStyles.tokenText);
    expect(overlayStyles.tokenBackground).not.toBe('');
    expect(overlayStyles.tokenText).not.toBe('');
  });

  test('keeps menu, select, popover, and tooltip overlays in the shared body token context', async ({ page }) => {
    const overlayChecks: OverlayCheck[] = [
      {
        name: 'menu',
        selector: 'body > .p-menu, body > .p-menu-overlay',
        open: async (currentPage) => {
          await currentPage.getByRole('button', { name: /Open overlay menu/i }).click();
          await expect(currentPage.getByText('Review queue')).toBeVisible();
        },
      },
      {
        name: 'select',
        selector: 'body [role="listbox"][aria-label="Option List"]',
        open: async (currentPage) => {
          await currentPage.locator('ps-select').filter({ hasText: /Program overlay select/i }).locator('.p-select').click();
          await expect(
            currentPage
              .locator('body [role="listbox"][aria-label="Option List"]')
              .getByRole('option', { name: /Housing assistance/i }),
          ).toBeVisible();
        },
      },
      {
        name: 'popover',
        selector: 'body > .p-popover',
        open: async (currentPage) => {
          await currentPage.getByRole('button', { name: /Open token popover/i }).click();
          await expect(currentPage.getByText('Popover token context')).toBeVisible();
        },
      },
      {
        name: 'tooltip',
        selector: 'body > .p-tooltip',
        open: async (currentPage) => {
          await currentPage.getByRole('button', { name: /Tooltip proof/i }).focus();
          await expect(currentPage.getByText('Tooltip body overlay token proof')).toBeVisible();
        },
      },
    ];

    await page.goto('/qa');
    await expect(page.locator('public-qa-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Body overlay token proof/i })).toBeVisible();

    const lightRootTokens = await readRootTokens(page);

    for (const check of overlayChecks) {
      const overlay = await readBodyOverlayTokens(page, check);
      expect(overlay.parentTag, `${check.name} should append directly to body`).toBe('BODY');
      expect(overlay.tokens['--ps-surface-background'], `${check.name} should inherit ps surface token`).not.toBe('');
      expect(overlay.tokens['--p-content-background'], `${check.name} should inherit PrimeNG surface token`).not.toBe('');
      expect(overlay.tokens['--p-text-color'], `${check.name} should inherit PrimeNG text token`).not.toBe('');
      expect(overlay.tokens['--ps-surface-background']).toBe(overlay.rootTokens['--ps-surface-background']);
      expect(overlay.tokens['--p-content-background']).toBe(overlay.rootTokens['--p-content-background']);
      expect(overlay.tokens['--p-text-color']).toBe(overlay.rootTokens['--p-text-color']);
      await closeOpenOverlay(page);
    }

    await page.getByRole('button', { name: /Use dark mode/i }).click();
    await expect(page.getByRole('button', { name: /Use light mode/i })).toBeVisible();

    const darkRootTokens = await readRootTokens(page);
    expect(darkRootTokens['--ps-surface-background']).not.toBe(lightRootTokens['--ps-surface-background']);
    expect(darkRootTokens['--p-content-background']).not.toBe(lightRootTokens['--p-content-background']);

    for (const check of overlayChecks) {
      const overlay = await readBodyOverlayTokens(page, check);
      expect(overlay.parentTag, `${check.name} should remain body-appended after theme change`).toBe('BODY');
      expect(overlay.tokens['--ps-surface-background']).toBe(darkRootTokens['--ps-surface-background']);
      expect(overlay.tokens['--p-content-background']).toBe(darkRootTokens['--p-content-background']);
      expect(overlay.tokens['--p-text-color']).toBe(darkRootTokens['--p-text-color']);
      await closeOpenOverlay(page);
    }
  });
});
