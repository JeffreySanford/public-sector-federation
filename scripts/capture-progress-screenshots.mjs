import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:4200';
const outputDir = process.env.SCREENSHOT_DIR ?? join('docs', 'reports', 'agile-progress', 'latest', 'screenshots');
const viewport = { width: 1440, height: 1100 };

const captures = [
  { name: 'shell-home', route: '/' },
  { name: 'citizen-services', route: '/services' },
  { name: 'reporting', route: '/reporting' },
  { name: 'admin', route: '/admin' },
  { name: 'qa-workbench', route: '/qa' },
  {
    name: 'qa-agile-report',
    route: '/qa',
    afterLoad: async (page) => {
      await page.getByRole('button', { name: /Agile plan/i }).click();
    },
  },
];

const themeCaptures = [
  ['neutral', 'light'],
  ['neutral', 'dark'],
  ['vibrant', 'light'],
  ['vibrant', 'dark'],
  ['pastel', 'light'],
  ['pastel', 'dark'],
];

async function applyTheme(page, variant, mode) {
  await page.evaluate(
    ({ variant, mode }) => {
      const root = document.documentElement;
      root.classList.remove('ps-theme-vibrant', 'ps-theme-pastel');
      if (variant !== 'neutral') {
        root.classList.add(`ps-theme-${variant}`);
      }
      root.classList.toggle('p-dark', mode === 'dark');
    },
    { variant, mode },
  );
}

async function capture(page, name) {
  await page.screenshot({
    path: join(outputDir, `${name}.png`),
    fullPage: true,
  });
  console.log(`Captured ${name}.png`);
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport });
const page = await context.newPage();

for (const item of captures) {
  await page.goto(`${baseUrl}${item.route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  if (item.afterLoad) {
    await item.afterLoad(page);
    await page.waitForTimeout(500);
  }
  await capture(page, item.name);
}

for (const [variant, mode] of themeCaptures) {
  await page.goto(`${baseUrl}/qa`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Agile plan/i }).click();
  await applyTheme(page, variant, mode);
  await page.waitForTimeout(500);
  await capture(page, `qa-agile-${variant}-${mode}`);
}

await context.close();
await browser.close();

console.log(`Progress screenshots written to ${outputDir}.`);
