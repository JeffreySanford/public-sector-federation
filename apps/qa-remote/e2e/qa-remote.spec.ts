import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const shellQaUrl = 'http://localhost:4200/qa';
const directQaUrl = 'http://localhost:4204';

async function openWorkbench(page: Page, url = shellQaUrl): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await expect(page.getByRole('heading', { name: 'Forensic Design-System Workbench', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Component Inventory', exact: true })).toBeVisible();
}

async function switchView(page: Page, name: 'Component Inventory' | 'Quality & Remediation' | 'Design Alignment Lab'): Promise<void> {
  const button = page.getByRole('button', { name, exact: true });
  await button.click();
  await expect(button).toHaveClass(/is-active/);
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}

async function expectNoAxeViolations(page: Page, view: string): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.flatMap((node) => node.target),
  }));
  expect(violations, `${view} accessibility violations: ${JSON.stringify(violations, null, 2)}`).toEqual([]);
}

test.describe('Forensic design-system workbench', () => {
  test.beforeEach(async ({ page }) => {
    await openWorkbench(page);
  });

  test('starts with the manifest-driven Component Inventory', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Design-system workbench views' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Component Inventory', exact: true })).toHaveClass(/is-active/);
    await expect(page.getByRole('button', { name: 'Quality & Remediation', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Design Alignment Lab', exact: true })).toBeVisible();
    await expect(page.getByText('Source: component manifest')).toBeVisible();
    await expect(page.getByRole('table').first()).toBeVisible();
  });

  test('switches between all three mission-aligned views', async ({ page }) => {
    await switchView(page, 'Quality & Remediation');
    await expect(page.getByRole('heading', { name: 'Evidence by component', exact: true })).toBeVisible();

    await switchView(page, 'Design Alignment Lab');
    await expect(page.getByRole('heading', { name: 'Figma property ↔ Angular API mapping', exact: true })).toBeVisible();

    await switchView(page, 'Component Inventory');
    await expect(page.getByRole('heading', { name: /matching entries/ })).toBeVisible();
  });

  test('filters the inventory and opens a component evidence detail', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Search shipped components' });
    await search.fill('Select');

    const table = page.getByRole('table').first();
    const selectRow = table.getByRole('row').filter({ hasText: 'Select' });
    await expect(selectRow).toBeVisible();
    await expect(table.getByRole('row').filter({ hasText: 'Button' })).toHaveCount(0);

    await selectRow.getByRole('button', { name: 'Inspect Select', exact: true }).click();
    const detail = page.locator('.detail-panel');
    await expect(detail.getByRole('heading', { name: 'Select', exact: true })).toBeVisible();
    await expect(detail.getByRole('heading', { name: 'Evidence coverage', exact: true })).toBeVisible();
    await expect(detail).toContainText('PrimeNG');
  });

  test('combines lifecycle and provider filters without fabricating results', async ({ page }) => {
    await page.getByLabel('Lifecycle').selectOption('active');
    await page.getByLabel('Provider').selectOption('primeng');

    const resultsHeading = page.getByRole('heading', { name: /matching entries/ });
    await expect(resultsHeading).toBeVisible();
    const rows = page.getByRole('table').first().locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    await expect(page.getByRole('table').first()).toContainText('PrimeNG');
  });

  test('presents a prioritized remediation queue and representative casework', async ({ page }) => {
    await switchView(page, 'Quality & Remediation');
    await expect(page.getByRole('heading', { name: 'What should be repaired next', exact: true })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Prioritized component remediation queue' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Representative remediation cases', exact: true })).toBeVisible();
    await expect(page.locator('.case-grid')).toContainText('Button');
    await expect(page.locator('.case-grid')).toContainText('Select');
    await expect(page.locator('.case-grid')).toContainText('Dialog');
  });

  test('presents typed findings with provenance and next actions', async ({ page }) => {
    await switchView(page, 'Quality & Remediation');

    const register = page.locator('.findings-panel');
    await expect(register.getByRole('heading', { name: 'Evidence finding register', exact: true })).toBeVisible();
    await expect(register.getByText('A11Y-BTN-001', { exact: true })).toBeVisible();
    await expect(register.getByText('TOKEN-NATIVE-001', { exact: true })).toBeVisible();
    await expect(register.getByText('API-BTN-001', { exact: true })).toBeVisible();

    const buttonFinding = register.locator('tr[data-finding-id="A11Y-BTN-001"]');
    await expect(buttonFinding).toContainText('verified');
    await expect(buttonFinding).toContainText('ps-button');
    await expect(buttonFinding).toContainText('Preserve the linked verification');
    await buttonFinding.getByText(/evidence sources?/i).click();
    await expect(buttonFinding.getByRole('link', { name: /button\.storybook\.spec\.ts/ })).toHaveAttribute(
      'href',
      /github\.com\/JeffreySanford\/public-sector-federation\/blob\/master\//,
    );
  });

  test('has no automated accessibility violations across all three workbench views', async ({ page }) => {
    await expectNoAxeViolations(page, 'Component Inventory');

    await switchView(page, 'Quality & Remediation');
    await expectNoAxeViolations(page, 'Quality & Remediation');

    await switchView(page, 'Design Alignment Lab');
    await expectNoAxeViolations(page, 'Design Alignment Lab');
  });

  test('supports keyboard disclosure of finding evidence', async ({ page }) => {
    await switchView(page, 'Quality & Remediation');

    const buttonFinding = page.locator('tr[data-finding-id="A11Y-BTN-001"]');
    const disclosure = buttonFinding.getByText(/evidence sources?/i);
    await disclosure.focus();
    await expect(disclosure).toBeFocused();
    await page.keyboard.press('Enter');

    const evidenceLink = buttonFinding.getByRole('link', { name: /button\.storybook\.spec\.ts/ });
    await expect(evidenceLink).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(evidenceLink).toBeFocused();
  });

  test('changes alignment cases and keeps missing design evidence explicit', async ({ page }) => {
    await switchView(page, 'Design Alignment Lab');
    const caseSelector = page.getByLabel('Component case');

    await caseSelector.selectOption('ps-select');
    await expect(page.locator('#alignmentCaseTitle')).toHaveText('Select');
    await expect(page.getByText(/Figma access is pending|No Figma binding is recorded/).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Storybook & test evidence', exact: true })).toBeVisible();

    await caseSelector.selectOption('ps-dialog');
    await expect(page.locator('#alignmentCaseTitle')).toHaveText('Dialog');
    await expect(page.getByRole('heading', { name: /Reconstruct Figma|Remediate code|Review both code/ }).first()).toBeVisible();
  });

  test('supports keyboard activation for workbench navigation', async ({ page }) => {
    const qualityButton = page.getByRole('button', { name: 'Quality & Remediation', exact: true });
    await qualityButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Quality & Remediation', exact: true })).toBeVisible();
    await expect(qualityButton).toBeFocused();

    const alignmentButton = page.getByRole('button', { name: 'Design Alignment Lab', exact: true });
    await alignmentButton.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('heading', { name: 'Design Alignment Lab', exact: true })).toBeVisible();
  });

  test('reflows at a mobile viewport without document-level horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await openWorkbench(page);

    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);

    await switchView(page, 'Quality & Remediation');
    await switchView(page, 'Design Alignment Lab');
    const finalGeometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(finalGeometry.scrollWidth).toBeLessThanOrEqual(finalGeometry.clientWidth + 1);
  });

  test('continues to render after the shell switches to dark mode', async ({ page }) => {
    const lightSurface = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--p-content-background').trim());
    await page.getByRole('button', { name: /Use dark mode/i }).click();
    await expect(page.getByRole('button', { name: /Use light mode/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Component Inventory', exact: true })).toBeVisible();
    const darkSurface = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--p-content-background').trim());
    expect(darkSurface).not.toBe(lightSurface);
  });

  test('loads both direct and shell-composed surfaces without critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await openWorkbench(page, directQaUrl);
    await openWorkbench(page, shellQaUrl);

    const criticalErrors = errors.filter((message) =>
      !message.includes('favicon') &&
      !message.includes('Failed to load resource') &&
      !message.includes('third-party'),
    );
    expect(criticalErrors).toEqual([]);
  });
});
