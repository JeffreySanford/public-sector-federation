import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';

const routeExpectations = {
  '/services': ['Citizen services workspace', 'Eligibility checklist', 'Case queue'],
  '/reporting': ['Reporting and analytics'],
  '/admin': ['Administrative settings', 'Temporary password'],
  '/qa': ['Component and token coverage', 'Visual federation checkpoint', 'Federation readiness'],
};
const routes = Object.keys(routeExpectations);
const variants = ['neutral', 'vibrant', 'pastel'];
const modes = ['light', 'dark'];
const baseUrl = process.env.A11Y_BASE_URL ?? 'http://localhost:4200';

function parseColor(value) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) {
    return null;
  }
  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

function relLum({ r, g, b }) {
  return [r, g, b]
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    })
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(foreground, background) {
  const fg = relLum(foreground);
  const bg = relLum(background);
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

async function contrastFailures(page) {
  return page.evaluate(
    ({ parseColorSource, contrastRatioSource }) => {
      const parseColor = eval(`(${parseColorSource})`);
      const contrastRatio = eval(`(() => {
        const relLum = ({ r, g, b }) => [r, g, b]
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
          })
          .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
        return ${contrastRatioSource};
      })()`);

      function effectiveBackground(element) {
        let node = element;
        while (node && node.nodeType === Node.ELEMENT_NODE) {
          const background = parseColor(getComputedStyle(node).backgroundColor);
          if (background && background.a > 0) {
            return background;
          }
          node = node.parentElement;
        }
        return { r: 255, g: 255, b: 255, a: 1 };
      }

      const elements = [...document.querySelectorAll('a, button, strong, small, h1, h2, h3, label, p, span, td, th')].filter(
        (element) => {
          const text = element.innerText?.trim();
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return text && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        },
      );

      const failures = [];
      for (const element of elements) {
        const style = getComputedStyle(element);
        const foreground = parseColor(style.color);
        const background = effectiveBackground(element);
        if (!foreground || !background) {
          continue;
        }

        const ratio = contrastRatio(foreground, background);
        const fontSize = Number.parseFloat(style.fontSize);
        const fontWeight = Number.parseFloat(style.fontWeight) || 400;
        const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const threshold = isLargeText ? 3 : 4.5;

        if (ratio < threshold) {
          failures.push({
            text: element.innerText.trim().replace(/\s+/g, ' ').slice(0, 100),
            selector: element.tagName.toLowerCase() + (element.className ? `.${String(element.className).trim().replace(/\s+/g, '.')}` : ''),
            ratio: Number(ratio.toFixed(2)),
            threshold,
          });
        }
      }

      return failures;
    },
    {
      parseColorSource: parseColor.toString(),
      contrastRatioSource: contrastRatio.toString(),
    },
  );
}

async function routeContentFailures(page, route) {
  const bodyText = await page.locator('body').innerText();
  return routeExpectations[route].filter((marker) => !bodyText.includes(marker));
}

async function keyboardFocusFailures(page) {
  return page.evaluate(async () => {
    const interactiveElements = [
      ...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    ].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });

    const failures = [];
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--p-primary-color').trim();

    for (const element of interactiveElements.slice(0, 20)) {
      element.focus();
      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (document.activeElement !== element) {
        continue;
      }

      const style = getComputedStyle(element);
      const hasVisibleFocusStyle =
        style.outlineStyle !== 'none' ||
        style.boxShadow !== 'none' ||
        style.borderColor === primaryColor ||
        element.matches(':focus-visible');

      if (!hasVisibleFocusStyle) {
        failures.push({
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || element.getAttribute('aria-label') || element.id,
          selector: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : ''),
        });
      }

      if (failures.length >= 10) {
        break;
      }
    }

    return failures;
  });
}

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const failures = [];

for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  for (const variant of variants) {
    for (const mode of modes) {
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

      const axe = await new AxeBuilder({ page }).analyze();
      const contrast = await contrastFailures(page);
      const content = await routeContentFailures(page, route);
      const focus = await keyboardFocusFailures(page);

      if (axe.violations.length > 0 || contrast.length > 0 || content.length > 0 || focus.length > 0) {
        failures.push({
          route,
          variant,
          mode,
          axe: axe.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              html: node.html.slice(0, 160),
              summary: node.failureSummary?.split('\n').slice(0, 3).join(' '),
            })),
          })),
          contrast,
          missingContent: content,
          focus,
        });
      }
    }
  }
}

await context.close();
await browser.close();

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log(`Accessibility checks passed for ${routes.length} routes across ${variants.length * modes.length} theme combinations.`);
