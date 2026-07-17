import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

test.setTimeout(60_000);

const storybookUrl = 'http://localhost:4400';
const buttonStoryId = 'design-system-acceptance-button-tag--states';
const candidateStoryId =
  'design-system-architecture-opinionated-wrapper-contract--preferred-candidate-api';
const tableStoryId = 'design-system-acceptance-table-paginator--sort-filter-and-page';

interface StorybookIndexEntry {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
}

interface StorybookIndexPayload {
  entries?: Record<string, StorybookIndexEntry>;
  stories?: Record<string, StorybookIndexEntry>;
}

function storyUrl(storyId: string): string {
  const params = new URLSearchParams({ id: storyId, viewMode: 'story' });
  return `${storybookUrl}/iframe.html?${params.toString()}`;
}

async function openStory(page: Page, storyId = buttonStoryId): Promise<void> {
  await page.goto(storyUrl(storyId), {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await expect(page.locator('body')).toBeVisible({ timeout: 20_000 });
}

async function storyIndex(request: APIRequestContext): Promise<StorybookIndexEntry[]> {
  const response = await request.get(`${storybookUrl}/index.json`);
  expect(response.ok()).toBe(true);

  const payload = (await response.json()) as StorybookIndexPayload;
  return Object.values(payload.entries ?? payload.stories ?? {});
}

function hasTitle(entries: StorybookIndexEntry[], title: string): boolean {
  return entries.some((entry) => entry.title === title);
}

test.describe('Storybook rendering', () => {
  test('loads the Storybook manager', async ({ page }) => {
    await page.goto(storybookUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('body')).toBeVisible();
    expect(await page.title()).toBeTruthy();
  });

  test('renders the Button and Tag acceptance story', async ({ page }) => {
    await openStory(page);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Button and tag states' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
    await expect(page.getByText('On track', { exact: true })).toBeVisible();
  });

  test('renders without a missing-story error', async ({ page }) => {
    await openStory(page);
    await expect(
      page.getByText(/NoStoryMatchError|Couldn't find story/i),
    ).toHaveCount(0);
  });
});

test.describe('Storybook accessibility and interaction', () => {
  test('publishes a semantic heading', async ({ page }) => {
    await openStory(page);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Button and tag states' }),
    ).toBeVisible();
  });

  test('supports keyboard focus', async ({ page }) => {
    await openStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    await expect(button).toBeFocused();
  });

  test('shows a visible focus treatment', async ({ page }) => {
    await openStory(page);

    const button = page.getByRole('button', { name: 'Primary action' });
    await button.focus();
    const hasFocusTreatment = await button.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return computed.outlineStyle !== 'none' || computed.boxShadow !== 'none';
    });

    expect(hasFocusTreatment).toBe(true);
  });

  test('activates the provider-neutral candidate API', async ({ page }) => {
    await openStory(page, candidateStoryId);

    const button = page.getByRole('button', { name: 'Delete draft' });
    await expect(page.getByText('Activations: 0')).toBeVisible();
    await button.click();
    await expect(page.getByText('Activations: 1')).toBeVisible();
  });
});

test.describe('Storybook index coverage', () => {
  test('publishes the representative Button story', async ({ request }) => {
    const entries = await storyIndex(request);
    const entry = entries.find((candidate) => candidate.id === buttonStoryId);

    expect(entry).toBeDefined();
    expect(entry?.name).toBe('States');
    expect(entry?.type).toBe('story');
  });

  test('publishes Empty State stories', async ({ request }) => {
    expect(
      hasTitle(await storyIndex(request), 'Design System/Components/Empty State'),
    ).toBe(true);
  });

  test('publishes Form Section stories', async ({ request }) => {
    expect(
      hasTitle(await storyIndex(request), 'Design System/Components/Form Section'),
    ).toBe(true);
  });

  test('publishes Page Header stories', async ({ request }) => {
    expect(
      hasTitle(await storyIndex(request), 'Design System/Components/Page Header'),
    ).toBe(true);
  });

  test('publishes Status Card stories', async ({ request }) => {
    expect(
      hasTitle(await storyIndex(request), 'Design System/Components/Status Card'),
    ).toBe(true);
  });

  test('publishes at least four component story groups', async ({ request }) => {
    const entries = await storyIndex(request);
    const componentTitles = new Set(
      entries
        .map((entry) => entry.title)
        .filter(
          (title): title is string =>
            typeof title === 'string' && title.startsWith('Design System/Components/'),
        ),
    );

    expect(componentTitles.size).toBeGreaterThanOrEqual(4);
  });
});

test.describe('Table and paginator story', () => {
  async function tableStory(page: Page) {
    await openStory(page, tableStoryId);
    await expect(
      page.getByRole('heading', {
        name: /Filter and page through active programs/i,
      }),
    ).toBeVisible({ timeout: 20_000 });

    const paginator = page.locator('.paginator');
    const table = page.locator('table').filter({
      has: page.getByRole('columnheader', { name: 'Program' }),
    });
    const rows = table.locator('tbody > tr:visible').filter({
      has: page.locator('td'),
    });

    await expect(paginator).toBeVisible();
    return { paginator, rows };
  }

  test('shows the first page', async ({ page }) => {
    const { paginator, rows } = await tableStory(page);
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 5 of 10 programs',
    );
    await expect(rows).toHaveCount(5);
  });

  test('moves to the next page', async ({ page }) => {
    const { paginator } = await tableStory(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 6 to 10 of 10 programs',
    );
  });

  test('returns to the previous page', async ({ page }) => {
    const { paginator } = await tableStory(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await paginator.getByRole('button', { name: 'Previous' }).click();
    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 5 of 10 programs',
    );
  });

  test('disables Previous on the first page', async ({ page }) => {
    const { paginator } = await tableStory(page);
    await expect(
      paginator.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled();
  });

  test('filters the dataset and resets pagination', async ({ page }) => {
    const { paginator, rows } = await tableStory(page);
    await paginator.getByRole('button', { name: 'Next' }).click();
    await page
      .getByRole('searchbox', { name: /Search programs/i })
      .fill('housing');

    await expect(paginator.locator('.paginator-info')).toContainText(
      'Showing 1 to 2 of 2 programs',
    );
    await expect(rows).toHaveCount(2);
  });
});

test.describe('Storybook recovery', () => {
  test('recovers after a missing story', async ({ page }) => {
    await page.goto(storyUrl('nonexistent--story'), {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('body')).toBeVisible();

    await openStory(page);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Button and tag states' }),
    ).toBeVisible();
  });
});
