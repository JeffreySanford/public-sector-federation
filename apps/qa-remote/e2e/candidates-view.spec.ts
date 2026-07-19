import { expect, test, type Page } from '@playwright/test';

const surfaces = [
  { name: 'direct QA remote', url: 'http://localhost:4204' },
  { name: 'shell-composed QA route', url: 'http://localhost:4200/qa' },
] as const;

async function openAlignmentLab(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  const alignmentButton = page.getByRole('button', { name: 'Design Alignment Lab', exact: true });
  await expect(alignmentButton).toBeVisible();
  await alignmentButton.click();
  await expect(page.getByRole('heading', { name: 'Design Alignment Lab', exact: true })).toBeVisible();
}

for (const surface of surfaces) {
  test.describe(`Design Alignment Lab - ${surface.name}`, () => {
    test('supports Button, Select, and Dialog as explicit alignment cases', async ({ page }) => {
      await openAlignmentLab(page, surface.url);
      const selector = page.getByLabel('Component case');

      await expect(selector.locator('option')).toHaveCount(3);
      await expect(page.locator('#alignmentCaseTitle')).toHaveText('Button');

      await selector.selectOption('ps-select');
      await expect(page.locator('#alignmentCaseTitle')).toHaveText('Select');

      await selector.selectOption('ps-dialog');
      await expect(page.locator('#alignmentCaseTitle')).toHaveText('Dialog');
    });

    test('keeps code, Storybook, accessibility, and Figma evidence separate', async ({ page }) => {
      await openAlignmentLab(page, surface.url);

      await expect(page.getByRole('heading', { name: 'Angular contract', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Figma binding', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Storybook & test evidence', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Semantic intent → provider translation', exact: true })).toBeVisible();
      await expect(page.getByText(/Figma access is pending|No Figma binding is recorded/).first()).toBeVisible();
      await expect(page.getByText('Screen reader')).toBeVisible();
    });

    test('recomputes the public API and proposed mapping for Select', async ({ page }) => {
      await openAlignmentLab(page, surface.url);
      await page.getByLabel('Component case').selectOption('ps-select');

      const contractTable = page.getByRole('table').first();
      await expect(contractTable).toContainText('label');
      await expect(contractTable).toContainText('options');
      await expect(contractTable).toContainText('value');

      const mappingTable = page.getByRole('table').nth(1);
      await expect(mappingTable).toContainText('Angular public API');
      await expect(mappingTable).toContainText('proposed');
      await expect(page.getByText(/Reconstruct Figma from the shipped contract|Review and narrow the public API/).first()).toBeVisible();
    });
  });
}

test('Design Alignment Lab navigation is keyboard accessible', async ({ page }) => {
  await page.goto('http://localhost:4204', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const alignmentButton = page.getByRole('button', { name: 'Design Alignment Lab', exact: true });
  await alignmentButton.focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Design Alignment Lab', exact: true })).toBeVisible();
  await expect(page.getByLabel('Component case')).toBeVisible();
});
