import { expect, test, type Page } from '@playwright/test';

const surfaces = [
  {
    name: 'direct QA remote',
    url: 'http://localhost:4204',
  },
  {
    name: 'shell-composed QA route',
    url: 'http://localhost:4200/qa',
  },
] as const;

async function openCandidatesView(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.waitForLoadState('networkidle').catch(() => {});

  const candidatesTab = page.getByRole('button', { name: 'Candidates' }).first();
  await expect(candidatesTab).toBeVisible();
  await candidatesTab.click();

  await expect(
    page.getByRole('heading', {
      name: 'Current Button vs UP Button candidate',
    }),
  ).toBeVisible();
}

for (const surface of surfaces) {
  test.describe(`QA Candidates view - ${surface.name}`, () => {
    test('shows the stable and candidate Button with shared controls', async ({
      page,
    }) => {
      await openCandidatesView(page, surface.url);

      const comparison = page.getByTestId('live-button-comparison');
      await expect(comparison.locator('ps-button')).toHaveCount(1);
      await expect(comparison.locator('ps-up-button')).toHaveCount(1);

      await page.getByLabel('Comparison label').fill('Approve eligibility');
      await page.getByLabel('Tone').selectOption('success');
      await page.getByLabel('Appearance').selectOption('outlined');

      await expect(
        comparison.getByRole('button', { name: 'Approve eligibility' }),
      ).toHaveCount(2);

      await comparison.getByRole('button', { name: 'Approve eligibility' }).first().click();
      await comparison.getByRole('button', { name: 'Approve eligibility' }).last().click();

      await expect(comparison.getByText('Activations: 1')).toHaveCount(2);
    });

    test('supports all public-sector theme variants and dark mode', async ({
      page,
    }) => {
      await openCandidatesView(page, surface.url);

      const themeControls = page.locator('.theme-controls');
      await expect(themeControls).toBeVisible();

      await themeControls.getByRole('button', { name: 'vibrant' }).click();
      await expect(page.locator('html')).toHaveClass(/ps-theme-vibrant/);

      await themeControls.getByRole('button', { name: 'pastel' }).click();
      await expect(page.locator('html')).toHaveClass(/ps-theme-pastel/);
      await expect(page.locator('html')).not.toHaveClass(/ps-theme-vibrant/);

      await themeControls.getByLabel('Dark mode').check();
      await expect(page.locator('html')).toHaveClass(/p-dark/);

      await themeControls.getByRole('button', { name: 'neutral' }).click();
      await expect(page.locator('html')).not.toHaveClass(/ps-theme-pastel/);
      await expect(page.getByText('Current: neutral / dark')).toBeVisible();
    });

    test('keeps Storybook and documentation evidence available', async ({
      page,
    }) => {
      await openCandidatesView(page, surface.url);

      const storybookLink = page.getByRole('link', {
        name: 'Open Current vs Candidate story',
      });
      await expect(storybookLink).toHaveAttribute(
        'href',
        /design-system-components-up-button-candidate--current-vs-candidate/,
      );

      await page
        .getByRole('button', { name: 'Show Storybook preview' })
        .click();
      await expect(
        page.getByTitle('Storybook Current Button versus UP Button candidate'),
      ).toBeVisible();

      await expect(
        page.getByRole('link', { name: 'Open evidence' }).first(),
      ).toBeVisible();
      await expect(page.getByText('URL not published yet')).toBeVisible();
    });
  });
}

test('Candidates navigation is keyboard accessible', async ({ page }) => {
  await page.goto('http://localhost:4204');
  await page.waitForLoadState('networkidle').catch(() => {});

  const candidatesTab = page.getByRole('button', { name: 'Candidates' }).first();
  await candidatesTab.focus();
  await candidatesTab.press('Enter');

  await expect(
    page.getByRole('heading', {
      name: 'Current Button vs UP Button candidate',
    }),
  ).toBeVisible();
});
