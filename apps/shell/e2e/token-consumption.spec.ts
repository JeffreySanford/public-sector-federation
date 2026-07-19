import { expect, test, type Page } from '@playwright/test';

const tokenNames = [
  '--ps-surface-background',
  '--ps-text-primary',
  '--ps-button-background',
  '--ps-button-text',
  '--p-content-background',
  '--p-primary-color',
  '--p-text-color',
];

async function readRootTokens(page: Page) {
  return page.evaluate((names) => {
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
  }, tokenNames);
}

async function readElementTokens(page: Page, selector: string) {
  return page.locator(selector).evaluate(
    (element, names) => {
      const styles = getComputedStyle(element);
      return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
    },
    tokenNames,
  );
}

async function expectElementUsesRootTokens(page: Page, selector: string): Promise<void> {
  const rootTokens = await readRootTokens(page);
  const elementTokens = await readElementTokens(page, selector);
  for (const name of tokenNames) {
    expect(elementTokens[name], `${name} should resolve on ${selector}`).not.toBe('');
    expect(elementTokens[name], `${name} should match the document token context on ${selector}`).toBe(rootTokens[name]);
  }
}

test.describe('Design token consumption contract', () => {
  test('resolves the shared token contract in the shell and mounted workbench', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('public-sector-shell')).toBeVisible();

    const shellTokens = await readRootTokens(page);
    for (const name of tokenNames) {
      expect(shellTokens[name], `${name} should resolve in the shell`).not.toBe('');
    }

    await page.goto('/qa');
    await expect(page.locator('public-qa-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Forensic Design-System Workbench', exact: true })).toBeVisible();

    const hostBoundary = await page.locator('public-qa-root').evaluate((element) => ({
      tagName: element.tagName.toLowerCase(),
      hasShadowRoot: Boolean(element.shadowRoot),
    }));
    expect(hostBoundary).toEqual({ tagName: 'public-qa-root', hasShadowRoot: false });

    await expectElementUsesRootTokens(page, 'public-qa-root');
    const remoteTokens = await readRootTokens(page);
    expect(remoteTokens['--ps-button-background']).toBe(shellTokens['--ps-button-background']);
    expect(remoteTokens['--p-content-background']).toBe(shellTokens['--p-content-background']);
  });

  test('updates shell and workbench token values when the shell theme changes', async ({ page }) => {
    await page.goto('/qa');
    await expect(page.locator('public-qa-root')).toBeVisible();

    const lightTokens = await readRootTokens(page);
    await page.getByRole('button', { name: /Use dark mode/i }).click();
    await expect(page.getByRole('button', { name: /Use light mode/i })).toBeVisible();

    const darkTokens = await readRootTokens(page);
    expect(darkTokens['--ps-surface-background']).not.toBe(lightTokens['--ps-surface-background']);
    expect(darkTokens['--p-content-background']).not.toBe(lightTokens['--p-content-background']);
    await expectElementUsesRootTokens(page, 'public-qa-root');
    await expect(page.getByRole('heading', { name: 'Component Inventory', exact: true })).toBeVisible();
  });

  test('keeps the shared admin dialog overlay in the root token context', async ({ page }) => {
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
  });

  test('keeps all three workbench views in one shared light and dark token context', async ({ page }) => {
    await page.goto('/qa');
    await expect(page.getByRole('heading', { name: 'Component Inventory', exact: true })).toBeVisible();
    await expectElementUsesRootTokens(page, 'public-component-inventory-view');

    await page.getByRole('button', { name: 'Quality & Remediation', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Quality & Remediation', exact: true })).toBeVisible();
    await expectElementUsesRootTokens(page, 'public-quality-remediation-view');

    await page.getByRole('button', { name: 'Design Alignment Lab', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Design Alignment Lab', exact: true })).toBeVisible();
    await expectElementUsesRootTokens(page, 'public-design-alignment-lab');

    const lightTokens = await readRootTokens(page);
    await page.getByRole('button', { name: /Use dark mode/i }).click();
    const darkTokens = await readRootTokens(page);
    expect(darkTokens['--ps-surface-background']).not.toBe(lightTokens['--ps-surface-background']);
    await expectElementUsesRootTokens(page, 'public-design-alignment-lab');
  });
});
