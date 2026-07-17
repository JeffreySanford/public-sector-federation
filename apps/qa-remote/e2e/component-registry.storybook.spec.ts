import { expect, test, type Page } from '@playwright/test';

const storybookUrl = 'http://localhost:4400';
const registryId = 'design-system-registry-component-manifest';

function storyUrl(story: string): string {
  const params = new URLSearchParams({
    id: `${registryId}--${story}`,
    viewMode: 'story',
  });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function gotoStory(page: Page, story: string): Promise<void> {
  await page.goto(storyUrl(story), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
}

test.describe('component manifest Storybook registry', () => {
  test('renders the full public registry overview', async ({ page }) => {
    await gotoStory(page, 'overview');

    await expect(page.getByRole('heading', { name: 'Component Registry' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Paginator/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Toast Service/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /UP Button Candidate/ })).toBeVisible();
    await expect(page.getByText('18', { exact: true }).first()).toBeVisible();
  });

  test('keeps the stable and candidate buttons distinct', async ({ page }) => {
    await gotoStory(page, 'lifecycle-status');

    await expect(page.getByText('Button', { exact: true })).toBeVisible();
    await expect(page.getByText('UP Button Candidate', { exact: true })).toBeVisible();
    await expect(page.getByText('Candidate replacement for ps-button')).toBeVisible();
  });

  test('shows PrimeNG, native, composite, and service boundaries', async ({ page }) => {
    await gotoStory(page, 'provider-boundaries');

    await expect(page.getByRole('heading', { name: 'Provider boundaries', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'primeng', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'native', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'composite', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'service', exact: true })).toBeVisible();
  });

  test('states accessibility evidence without claiming conformance', async ({ page }) => {
    await gotoStory(page, 'accessibility-coverage');

    await expect(page.getByRole('heading', { name: 'Accessibility evidence' })).toBeVisible();
    await expect(page.getByText(/Automated checks are evidence, not a WCAG conformance claim/)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pending', exact: true }).first()).toBeVisible();
  });

  test('renders external documentation readiness honestly', async ({ page }) => {
    await gotoStory(page, 'documentation-readiness');

    await expect(page.getByRole('heading', { name: 'Documentation readiness', exact: true })).toBeVisible();
    await expect(page.getByText('pending-access', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Unassigned', { exact: true }).first()).toBeVisible();
  });

  test('renders UP Button promotion evidence and blockers', async ({ page }) => {
    await gotoStory(page, 'up-button-promotion-readiness');

    await expect(page.getByRole('heading', { name: 'UP Button Candidate' })).toBeVisible();
    await expect(page.getByText('Design review is pending.')).toBeVisible();
    await expect(page.getByText('Manual screen-reader audit is pending.')).toBeVisible();
    await expect(page.getByText('pending-access', { exact: true })).toBeVisible();
    await expect(page.getByText('draft', { exact: true })).toBeVisible();
  });
});
