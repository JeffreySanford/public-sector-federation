import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const dialogStoryId = 'design-system-components-dialog';

function storyUrl(story: string, globals?: string): string {
  const params = new URLSearchParams({
    id: `${dialogStoryId}--${story}`,
    viewMode: 'story',
  });
  if (globals) params.set('globals', globals);
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoDialogStory(page: Page, story: string, globals?: string): Promise<void> {
  await page.goto(storyUrl(story, globals), {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

async function openDialog(page: Page, triggerName: string, dialogName: string) {
  const trigger = page.getByRole('button', { name: triggerName, exact: true });
  await trigger.focus();
  await expectDomFocus(trigger);
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: dialogName, exact: true });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

async function expectDomFocus(locator: ReturnType<Page['locator']>): Promise<void> {
  await expect.poll(async () => {
    return isDomFocus(locator);
  }).toBe(true);
}

async function isDomFocus(locator: ReturnType<Page['locator']>): Promise<boolean> {
  return locator.evaluate((element) => {
    const active = element.ownerDocument.activeElement as HTMLElement | null;
    return active === element || element.contains(active);
  });
}

test.describe('Dialog isolated Storybook contract', () => {
  test.describe.configure({ mode: 'serial' });

  test('opens with labelled modal semantics and predictable initial focus', async ({ page }) => {
    await gotoDialogStory(page, 'default');
    const { dialog } = await openDialog(page, 'Review application', 'Review application');

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    const labelledBy = await dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`#${labelledBy}`)).toHaveText('Review application');
    const describedBy = await dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText(
      'Review the application details before recording a decision.',
    );
    await expectDomFocus(dialog.getByRole('button', { name: 'Close dialog' }));
  });

  test('makes background content inert and locks page scrolling until close', async ({ page }) => {
    await gotoDialogStory(page, 'default');
    const { trigger, dialog } = await openDialog(page, 'Review application', 'Review application');
    const pageHeading = page.locator('.dialog-proof > h1');

    await expect(dialog).toBeVisible();
    await expect(pageHeading).toHaveAttribute('inert', '');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(trigger).not.toBeFocused();

    await dialog.getByRole('button', { name: 'Close dialog' }).click();
    await expect(pageHeading).not.toHaveAttribute('inert', '');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
    await expectDomFocus(trigger);
  });

  test('contains forward and reverse Tab navigation inside the modal', async ({ page }) => {
    await gotoDialogStory(page, 'focus-sequence');
    const { dialog } = await openDialog(page, 'Inspect focus sequence', 'Dialog focus sequence');
    const close = dialog.getByRole('button', { name: 'Close dialog' });
    const note = dialog.getByRole('textbox', { name: 'Reviewer note' });
    const cancel = dialog.getByRole('button', { name: 'Cancel' });
    const confirm = dialog.getByRole('button', { name: 'Save review' });

    await expectDomFocus(close);
    await page.keyboard.press('Tab');
    const tabbedToNote = await isDomFocus(note);
    if (tabbedToNote) {
      await expectDomFocus(note);
      await page.keyboard.press('Tab');
    }
    await expectDomFocus(cancel);
    await page.keyboard.press('Tab');
    await expectDomFocus(confirm);
    await page.keyboard.press('Tab');
    await expectDomFocus(close);
    await page.keyboard.press('Shift+Tab');
    await expectDomFocus(confirm);
  });

  test('closes with Escape and restores focus to the opener', async ({ page }) => {
    await gotoDialogStory(page, 'default');
    const { trigger, dialog } = await openDialog(page, 'Review application', 'Review application');

    await dialog.getByRole('textbox', { name: 'Reviewer note' }).focus();
    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expectDomFocus(trigger);
    await expect(page.locator('output')).toHaveText('No decision recorded.');
  });

  test('restores focus after close-button and backdrop dismissal', async ({ page }) => {
    await gotoDialogStory(page, 'default');
    let opened = await openDialog(page, 'Review application', 'Review application');
    await opened.dialog.getByRole('button', { name: 'Close dialog' }).click();
    await expect(opened.dialog).toBeHidden();
    await expectDomFocus(opened.trigger);

    opened = await openDialog(page, 'Review application', 'Review application');
    await page.locator('.ps-dialog__backdrop').click({ position: { x: 4, y: 4 } });
    await expect(opened.dialog).toBeHidden();
    await expectDomFocus(opened.trigger);
  });

  test('keeps the destructive decision distinct and returns focus after confirmation', async ({ page }) => {
    await gotoDialogStory(page, 'destructive-confirmation');
    const { trigger, dialog } = await openDialog(page, 'Delete draft', 'Delete draft application?');
    const destructiveAction = dialog.getByRole('button', { name: 'Delete draft', exact: true });

    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(destructiveAction).toHaveClass(/p-button-danger/);
    await destructiveAction.click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('output')).toHaveText('Draft deleted.');
    await expectDomFocus(trigger);
  });

  test('constrains long content at a narrow viewport without document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 480 });
    await gotoDialogStory(page, 'long-content');
    const { dialog } = await openDialog(page, 'Review full application', 'Full application review');

    const geometry = await dialog.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      right: element.getBoundingClientRect().right,
      left: element.getBoundingClientRect().left,
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));

    expect(geometry.scrollHeight).toBeGreaterThan(geometry.clientHeight);
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  });

  test('inherits light and dark modal surface tokens', async ({ page }) => {
    await gotoDialogStory(page, 'default', 'themeVariant:neutral;themeMode:light');
    let opened = await openDialog(page, 'Review application', 'Review application');
    const light = await opened.dialog.evaluate((element) => {
      const styles = getComputedStyle(element);
      const root = getComputedStyle(document.documentElement);
      return {
        background: styles.backgroundColor,
        color: styles.color,
        contentBackground: styles.getPropertyValue('--p-content-background').trim(),
        rootBackground: root.getPropertyValue('--p-content-background').trim(),
        rootSurface: root.getPropertyValue('--ps-surface-background').trim(),
      };
    });
    expect(light.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(light.contentBackground).toBe(light.rootBackground);

    await gotoDialogStory(page, 'default', 'themeVariant:neutral;themeMode:dark');
    await expect(page.locator('html')).toHaveClass(/p-dark/);
    opened = await openDialog(page, 'Review application', 'Review application');
    const dark = await opened.dialog.evaluate((element) => {
      const styles = getComputedStyle(element);
      const root = getComputedStyle(document.documentElement);
      return {
        background: styles.backgroundColor,
        color: styles.color,
        contentBackground: styles.getPropertyValue('--p-content-background').trim(),
        rootBackground: root.getPropertyValue('--p-content-background').trim(),
        rootSurface: root.getPropertyValue('--ps-surface-background').trim(),
      };
    });
    expect(dark.contentBackground).toBe(dark.rootBackground);
    expect(dark.rootSurface).not.toBe(light.rootSurface);
    expect(dark.background).not.toBe(light.background);
  });

  test('passes automated accessibility analysis while open', async ({ page }) => {
    await gotoDialogStory(page, 'default');
    await openDialog(page, 'Review application', 'Review application');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('keeps the modal boundary and focused close action visible in forced-colors mode', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await gotoDialogStory(page, 'default');
    const { dialog } = await openDialog(page, 'Review application', 'Review application');
    const close = dialog.getByRole('button', { name: 'Close dialog' });

    await expectDomFocus(close);
    const styles = await close.evaluate((element) => {
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
