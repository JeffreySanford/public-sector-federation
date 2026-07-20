import { expect, test, type Locator, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const selectStoryId = 'design-system-components-select';

function storyUrl(story: string, globals?: string): string {
  const params = new URLSearchParams({
    id: `${selectStoryId}--${story}`,
    viewMode: 'story',
  });
  if (globals) params.set('globals', globals);
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoSelectStory(page: Page, story: string, globals?: string): Promise<void> {
  await page.goto(storyUrl(story, globals), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

function optionList(page: Page): Locator {
  return page.locator('body [role="listbox"][aria-label="Option List"]').last();
}

async function openWithKeyboard(page: Page, name: string): Promise<Locator> {
  const combobox = page.getByRole('combobox', { name });
  await combobox.focus();
  await page.keyboard.press('ArrowDown');
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');
  await expect(optionList(page)).toBeVisible();
  return combobox;
}

async function readOverlayTheme(page: Page) {
  const listbox = optionList(page);
  return listbox.evaluate((element) => {
    let overlayRoot = element as HTMLElement;
    while (overlayRoot.parentElement && overlayRoot.parentElement !== document.body) {
      overlayRoot = overlayRoot.parentElement;
    }
    const surface =
      element.closest<HTMLElement>('.p-select-overlay, .p-dropdown-panel') ??
      (element as HTMLElement);
    const surfaceStyles = getComputedStyle(surface);
    const rootStyles = getComputedStyle(document.documentElement);
    return {
      parentTag: overlayRoot.parentElement?.tagName ?? '',
      background: surfaceStyles.backgroundColor,
      color: surfaceStyles.color,
      zIndex: Number.parseInt(getComputedStyle(overlayRoot).zIndex || '0', 10),
      contentBackground: surfaceStyles.getPropertyValue('--p-content-background').trim(),
      textColor: surfaceStyles.getPropertyValue('--p-text-color').trim(),
      rootContentBackground: rootStyles.getPropertyValue('--p-content-background').trim(),
      rootTextColor: rootStyles.getPropertyValue('--p-text-color').trim(),
      rootSurface: rootStyles.getPropertyValue('--ps-surface-background').trim(),
    };
  });
}

test.describe('Select isolated Storybook contract', () => {
  test('exposes an accessible combobox and related body-appended listbox', async ({ page }) => {
    await gotoSelectStory(page, 'default');
    const combobox = page.getByRole('combobox', { name: 'Program' });

    await expect(combobox).toBeVisible();
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await openWithKeyboard(page, 'Program');

    const listbox = optionList(page);
    const controls = await combobox.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    await expect(listbox).toHaveAttribute('id', controls ?? 'missing-listbox-id');
    await expect(listbox.getByRole('option', { name: 'Housing assistance' })).toBeVisible();

    const bodyRelationship = await listbox.evaluate((element) => {
      const host = document.querySelector('ps-select');
      let overlayRoot = element as HTMLElement;
      while (overlayRoot.parentElement && overlayRoot.parentElement !== document.body) {
        overlayRoot = overlayRoot.parentElement;
      }
      return {
        hostContainsListbox: Boolean(host?.contains(element)),
        overlayParent: overlayRoot.parentElement?.tagName ?? '',
      };
    });
    expect(bodyRelationship.hostContainsListbox).toBe(false);
    expect(bodyRelationship.overlayParent).toBe('BODY');
  });

  test('supports keyboard navigation and writes the provider-neutral value model', async ({ page }) => {
    await gotoSelectStory(page, 'model-binding');
    const output = page.locator('output');
    await expect(output).toHaveText('Selected value: none');

    const combobox = await openWithKeyboard(page, 'Communication preference');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(output).toHaveText('Selected value: mail');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await expect(combobox).toBeFocused();
  });

  test('closes with Escape and returns focus without changing the value', async ({ page }) => {
    await gotoSelectStory(page, 'model-binding');
    const output = page.locator('output');
    const combobox = await openWithKeyboard(page, 'Communication preference');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');

    await expect(optionList(page)).toBeHidden();
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await expect(combobox).toBeFocused();
    await expect(output).toHaveText('Selected value: none');
  });

  test('keeps the disabled field and disabled option unavailable', async ({ page }) => {
    await gotoSelectStory(page, 'disabled');
    const disabledCombobox = page.getByRole('combobox', { name: 'Program' });
    await expect(disabledCombobox).toHaveAttribute('aria-disabled', 'true');

    await gotoSelectStory(page, 'disabled-option');
    const combobox = page.getByRole('combobox', { name: 'Program with archived option' });
    await combobox.click();
    const archived = optionList(page).getByRole('option', { name: 'Archived pilot program' });
    await expect(archived).toBeVisible();
    await expect(archived).toHaveAttribute('data-p-disabled', 'true');
    await expect(archived).toHaveAttribute('aria-selected', 'false');
    expect(await archived.getAttribute('aria-disabled')).toBeNull();
    await archived.click({ force: true });
    await expect(combobox).toContainText('Choose an active program');
  });

  test('renders selected and empty-option states without fabricating values', async ({ page }) => {
    await gotoSelectStory(page, 'selected');
    await expect(page.getByRole('combobox', { name: 'Program' })).toContainText('Housing assistance');

    await gotoSelectStory(page, 'empty-options');
    const emptyCombobox = page.getByRole('combobox', { name: 'Assigned reviewer' });
    await expect(emptyCombobox).toContainText('No reviewers available');
    await emptyCombobox.click();
    const listbox = optionList(page);
    await expect(listbox.locator('.p-select-option')).toHaveCount(0);
    await expect(listbox.locator('.p-select-empty-message')).toBeVisible();
  });

  test('escapes an overflow-hidden application boundary and remains positioned above content', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await gotoSelectStory(page, 'overlay-boundary');
    const combobox = page.getByRole('combobox', { name: 'Service region' });
    await combobox.click();

    const listbox = optionList(page);
    await expect(listbox).toBeVisible();
    const geometry = await page.evaluate(() => {
      const panel = document.querySelector<HTMLElement>('.application-panel');
      const list = document.querySelector<HTMLElement>('body [role="listbox"][aria-label="Option List"]');
      if (!panel || !list) return null;
      let overlayRoot = list;
      while (overlayRoot.parentElement && overlayRoot.parentElement !== document.body) {
        overlayRoot = overlayRoot.parentElement;
      }
      const panelRect = panel.getBoundingClientRect();
      const overlayRect = overlayRoot.getBoundingClientRect();
      return {
        panelBottom: panelRect.bottom,
        overlayTop: overlayRect.top,
        overlayBottom: overlayRect.bottom,
        parentTag: overlayRoot.parentElement?.tagName ?? '',
        zIndex: Number.parseInt(getComputedStyle(overlayRoot).zIndex || '0', 10),
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.parentTag).toBe('BODY');
    expect(geometry?.overlayBottom ?? 0).toBeGreaterThan(geometry?.panelBottom ?? 0);
    expect(geometry?.overlayTop ?? 0).toBeGreaterThanOrEqual(0);
    expect(geometry?.zIndex ?? 0).toBeGreaterThan(0);
  });

  test('inherits shared light and dark tokens in the body-appended overlay', async ({ page }) => {
    await gotoSelectStory(page, 'overlay-boundary', 'themeVariant:neutral;themeMode:light');
    await page.getByRole('combobox', { name: 'Service region' }).click();
    const light = await readOverlayTheme(page);
    expect(light.parentTag).toBe('BODY');
    expect(light.contentBackground).toBe(light.rootContentBackground);
    expect(light.textColor).toBe(light.rootTextColor);
    expect(light.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(light.color).not.toBe('rgba(0, 0, 0, 0)');

    await gotoSelectStory(page, 'overlay-boundary', 'themeVariant:neutral;themeMode:dark');
    await expect(page.locator('html')).toHaveClass(/p-dark/);
    await page.getByRole('combobox', { name: 'Service region' }).click();
    const dark = await readOverlayTheme(page);
    expect(dark.parentTag).toBe('BODY');
    expect(dark.contentBackground).toBe(dark.rootContentBackground);
    expect(dark.textColor).toBe(dark.rootTextColor);
    expect(dark.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(dark.rootSurface).not.toBe(light.rootSurface);
    expect(dark.rootContentBackground).not.toBe(light.rootContentBackground);
  });

  test('keeps long labels and options readable at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoSelectStory(page, 'long-options');
    await page
      .getByRole('combobox', { name: 'Regional processing and service-delivery office' })
      .click();

    const longOption = optionList(page).getByRole('option', {
      name: 'Northwest multi-county eligibility and document-verification center',
    });
    await expect(longOption).toBeVisible();
    const geometry = await longOption.evaluate((element) => {
      const node = element as HTMLElement;
      return {
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  });

  test('keeps the control, focused option, and overlay distinguishable in forced-colors mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoSelectStory(page, 'default');
    const combobox = await openWithKeyboard(page, 'Program');
    const focusedOption = optionList(page).locator('.p-focus').first();

    await expect(combobox).toBeFocused();
    await expect(focusedOption).toBeVisible();
    const styles = await focusedOption.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        outlineStyle: computed.outlineStyle,
        outlineWidth: computed.outlineWidth,
      };
    });
    expect(styles.outlineStyle).not.toBe('none');
    expect(styles.outlineWidth).not.toBe('0px');
  });
});
