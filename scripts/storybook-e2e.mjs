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
const browserMessages = [];
page.on('console', (message) => browserMessages.push(`console:${message.type()}: ${message.text()}`));
page.on('pageerror', (error) => browserMessages.push(`pageerror: ${error.message}`));

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

async function waitForStory(locator, storyId, description) {
  try {
    await locator.waitFor({ timeout: 30000 });
  } catch (error) {
    const bodyText = await page.locator('body').innerText().catch(() => '<body unavailable>');
    throw new Error(
      `${storyId} did not render ${description}.\n` +
        `Body text:\n${bodyText.slice(0, 4000)}\n` +
        `Browser messages:\n${browserMessages.slice(-20).join('\n') || '<none>'}`,
      { cause: error },
    );
  }
}

try {
  const index = JSON.parse(await readFile(join(storybookRoot, 'index.json'), 'utf8'));
  const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');
  if (stories.length < 29) {
    throw new Error(`Expected at least 29 built Storybook stories, found ${stories.length}.`);
  }

  const storyIds = [
    'design-system-interaction-stories-edge-case-states--overview',
    'design-system-interaction-stories-dialog-and-toast--overlay-and-feedback',
    'design-system-experiments-button-contract-exploration--primary',
    'design-system-registry-component-manifest--overview',
    'design-system-architecture-opinionated-wrapper-contract--preferred-candidate-api',
  ];

  const availableStoryIds = new Set(stories.map((story) => story.id));
  for (const storyId of storyIds) {
    if (!availableStoryIds.has(storyId)) {
      const related = stories
        .map((story) => story.id)
        .filter((id) => id.includes('registry') || id.includes('component-manifest'));
      throw new Error(`Built Storybook is missing ${storyId}. Related story ids: ${related.join(', ') || 'none'}`);
    }
  }

  for (const storyId of storyIds) {
    browserMessages.length = 0;
    await page.goto(`http://localhost:${port}/iframe.html?id=${storyId}&viewMode=story`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    if (storyId.includes('edge-case-states')) {
      await waitForStory(page.getByText('Overlay and Shadow DOM overview'), storyId, 'the edge-case state heading');
    }
    if (storyId.includes('dialog-and-toast')) {
      await waitForStory(page.getByText('Dialog and toast'), storyId, 'the Dialog and Toast heading');
    }
    if (storyId.includes('button-contract-exploration')) {
      await waitForStory(page.getByRole('button', { name: 'Primary action' }), storyId, 'the primary action');
    }
    if (storyId.includes('component-manifest')) {
      await waitForStory(page.getByRole('heading', { name: 'Component Registry' }), storyId, 'the Component Registry heading');
      await waitForStory(page.getByRole('row', { name: /Paginator/ }), storyId, 'the Paginator registry row');
      await waitForStory(page.getByRole('row', { name: /Toast Service/ }), storyId, 'the Toast Service registry row');
    }
    if (storyId.includes('opinionated-wrapper-contract')) {
      await waitForStory(page.getByRole('heading', { name: 'Preferred candidate API' }), storyId, 'the preferred candidate API heading');
      await waitForStory(page.getByText('Private provider controls'), storyId, 'the private provider controls section');
      const destructiveButton = page.getByRole('button', { name: 'Delete draft' });
      await waitForStory(destructiveButton, storyId, 'the destructive intent button');
      await destructiveButton.click();
      await waitForStory(page.getByText('Activations: 1'), storyId, 'the normalized activated output');
      // PrimeNG's transient ripple overlays the label immediately after activation,
      // which prevents axe from determining the label's background color.
      await page.waitForTimeout(800);
    }

    const bodyText = await page.locator('body').innerText();
    if (storyId.includes('edge-case-states') && !bodyText.includes('Overlay and Shadow DOM overview')) {
      throw new Error('Edge Case States overview story did not render expected content.');
    }
    if (storyId.includes('dialog-and-toast') && !bodyText.includes('Dialog and toast')) {
      throw new Error('Dialog Toast acceptance story did not render expected content.');
    }
    if (storyId.includes('button-contract-exploration') && !bodyText.includes('Primary action')) {
      throw new Error('Button Contract Exploration primary story did not render expected content.');
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
            incomplete: axe.incomplete.map((item) => ({
              id: item.id,
              impact: item.impact,
              nodes: item.nodes.map((node) => ({
                target: node.target,
                html: node.html,
                failureSummary: node.failureSummary,
              })),
            })),
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
