import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';

const root = process.cwd();
const storybookRoot = resolve(root, 'dist/storybook/qa-remote');
const port = Number(process.env.STORYBOOK_E2E_PORT ?? 4410);
const mimeTypes = new Map([
  ['.css', 'text/css'],
  ['.html', 'text/html'],
  ['.js', 'text/javascript'],
  ['.json', 'application/json'],
  ['.svg', 'image/svg+xml'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);
    const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = normalize(resolve(storybookRoot, `.${requestedPath}`));

    if (!filePath.startsWith(storybookRoot)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, { 'content-type': mimeTypes.get(extname(filePath)) ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

await new Promise((resolveListen) => server.listen(port, resolveListen));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

async function analyzeAccessibility(targetPage, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await new AxeBuilder({ page: targetPage }).analyze();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('Axe is already running') || attempt === attempts) {
        throw error;
      }
      await targetPage.waitForTimeout(300 * attempt);
    }
  }

  throw new Error('Axe analysis did not complete.');
}

try {
  const index = JSON.parse(await readFile(join(storybookRoot, 'index.json'), 'utf8'));
  const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');
  if (stories.length < 29) {
    throw new Error(`Expected at least 29 built Storybook stories, found ${stories.length}.`);
  }

  const storyIds = [
    'design-system-problem-areas--overview',
    'design-system-primeng-playground--component-families',
    'design-system-candidates-button-up--primary',
    'design-system-registry-component-manifest--overview',
  ];
  for (const storyId of storyIds) {
    await page.goto(`http://localhost:${port}/iframe.html?id=${storyId}&viewMode=story`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    if (storyId.includes('problem-areas')) {
      await page.getByText('Problem area overview').waitFor({ timeout: 60000 });
    }
    if (storyId.includes('primeng-playground')) {
      await page.getByText('Shared wrapper playground').waitFor({ timeout: 60000 });
    }
    if (storyId.includes('button-up')) {
      await page.getByRole('button', { name: 'Primary action' }).waitFor({ timeout: 60000 });
    }
    if (storyId.includes('component-manifest')) {
      await page.getByRole('heading', { name: 'Component Registry' }).waitFor({ timeout: 60000 });
      await page.getByRole('row', { name: /Paginator/ }).waitFor({ timeout: 60000 });
      await page.getByRole('row', { name: /Toast Service/ }).waitFor({ timeout: 60000 });
    }

    const bodyText = await page.locator('body').innerText();
    if (storyId.includes('problem-areas') && !bodyText.includes('Problem area overview')) {
      throw new Error('Problem Areas overview story did not render expected content.');
    }
    if (storyId.includes('primeng-playground') && !bodyText.includes('Shared wrapper playground')) {
      throw new Error('Shared wrapper playground story did not render expected content.');
    }
    if (storyId.includes('button-up') && !bodyText.includes('Primary action')) {
      throw new Error('UP Button candidate primary story did not render expected content.');
    }
    if (storyId.includes('component-manifest') && (!bodyText.includes('Paginator') || !bodyText.includes('Toast Service'))) {
      throw new Error('Component Manifest overview did not render the expected public registry entries.');
    }

    const axe = await analyzeAccessibility(page);
    if (axe.violations.length > 0 || axe.incomplete.length > 0) {
      throw new Error(
        `${storyId} has axe issues: ${JSON.stringify(
          {
            violations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })),
            incomplete: axe.incomplete.map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length })),
          },
          null,
          2,
        )}`,
      );
    }
  }

  console.log(`Storybook e2e checks passed for ${stories.length} stories and ${storyIds.length} rendered story iframes.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
