import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { basename, join } from 'node:path';

const reportRoot = join('docs', 'reports', 'zeroheight');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
const latestRoot = join(reportRoot, 'latest');
const stampedRoot = join(reportRoot, stamp);

const pages = [
  {
    zeroheightPage: 'Home / Getting Started',
    source: 'docs/design-system/README.md',
    output: 'home-getting-started.md',
  },
  {
    zeroheightPage: 'Foundations',
    source: 'docs/design-system/zeroheight-style-dictionary.md',
    output: 'foundations.md',
  },
  {
    zeroheightPage: 'Components',
    source: 'docs/design-system/component-coverage-matrix.md',
    output: 'components.md',
  },
  {
    zeroheightPage: 'Patterns',
    source: 'docs/design-system/app-inventory.md',
    output: 'patterns.md',
  },
  {
    zeroheightPage: 'Developer Guide',
    source: 'docs/design-system/platform-reporting.md',
    output: 'developer-guide.md',
  },
  {
    zeroheightPage: 'Governance',
    source: 'docs/design-system/agile-workflow.md',
    output: 'governance.md',
  },
  {
    zeroheightPage: 'Figma File Blueprint',
    source: 'docs/design-system/figma-file-blueprint.md',
    output: 'figma-file-blueprint.md',
  },
  {
    zeroheightPage: 'Zeroheight Skeleton',
    source: 'docs/design-system/zeroheight-skeleton.md',
    output: 'zeroheight-skeleton.md',
  },
];

const tokenFiles = [
  'packages/tokens/src/zeroheight-tokens.json',
  'packages/tokens/src/tokens.css',
  'packages/tokens/src/tokens/primitives.json',
  'packages/tokens/src/tokens/themes.json',
  'packages/tokens/src/tokens/zeroheight-metadata.json',
  'packages/tokens/src/tokens/component-overrides.css',
];

const reportFiles = [
  'docs/reports/agile-progress/latest/agile-progress.json',
  'docs/reports/agile-progress/latest/agile-progress.md',
  'docs/reports/agile-progress/latest/agile-progress.html',
];

function runTokenBuild() {
  const result = spawnSync('pnpm', ['build:tokens'], {
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error('Token build failed before Zeroheight export.');
  }
}

async function copyIfExists(source, destination) {
  try {
    await copyFile(source, destination);
    return true;
  } catch {
    return false;
  }
}

async function copyScreenshots(outputRoot) {
  const sourceDir = join('docs', 'reports', 'agile-progress', 'latest', 'screenshots');
  const screenshotOutput = join(outputRoot, 'reports', 'agile-progress', 'screenshots');

  try {
    const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.png')).sort();
    await Promise.all(files.map((file) => copyFile(join(sourceDir, file), join(screenshotOutput, file))));
    return files;
  } catch {
    return [];
  }
}

async function buildPackage(outputRoot) {
  const pageOutput = join(outputRoot, 'pages');
  const tokenOutput = join(outputRoot, 'tokens');
  const reportOutput = join(outputRoot, 'reports', 'agile-progress');
  const screenshotOutput = join(reportOutput, 'screenshots');

  await Promise.all([
    mkdir(pageOutput, { recursive: true }),
    mkdir(tokenOutput, { recursive: true }),
    mkdir(reportOutput, { recursive: true }),
    mkdir(screenshotOutput, { recursive: true }),
  ]);

  const copiedPages = [];
  for (const page of pages) {
    const destination = join(pageOutput, page.output);
    if (await copyIfExists(page.source, destination)) {
      const content = await readFile(destination, 'utf8');
      copiedPages.push({
        ...page,
        packagePath: destination.replaceAll('\\', '/'),
        bytes: Buffer.byteLength(content),
      });
    }
  }

  const copiedTokens = [];
  for (const source of tokenFiles) {
    const destination = join(tokenOutput, basename(source));
    if (await copyIfExists(source, destination)) {
      copiedTokens.push({
        source,
        packagePath: destination.replaceAll('\\', '/'),
      });
    }
  }

  const copiedReports = [];
  for (const source of reportFiles) {
    const destination = join(reportOutput, basename(source));
    if (await copyIfExists(source, destination)) {
      copiedReports.push({
        source,
        packagePath: destination.replaceAll('\\', '/'),
      });
    }
  }

  const screenshots = await copyScreenshots(outputRoot);
  const warnings = [];

  if (copiedReports.length === 0) {
    warnings.push('Agile report artifacts were not found. Run `pnpm agile:report` before export.');
  }

  if (screenshots.length === 0) {
    warnings.push('Progress screenshots were not found. Run `pnpm screenshots:progress` before export.');
  }

  const manifest = {
    packageName: 'public-sector-federation-zeroheight-export',
    generatedAt: new Date().toISOString(),
    sourceWorkflow: ['pnpm verify:fed', 'pnpm screenshots:progress', 'pnpm agile:report', 'pnpm zeroheight:export'],
    publishNotes: [
      'This package is ready for Zeroheight manual upload or an API bridge.',
      'Zeroheight public API capabilities vary by plan and currently focus on reading content and updating page statuses.',
      'Set ZEROHEIGHT_PUBLISH_ENDPOINT to post this manifest to an internal publishing bridge.',
    ],
    warnings,
    pages: copiedPages,
    tokens: copiedTokens,
    reports: copiedReports,
    screenshots: screenshots.map((file) => ({
      file,
      packagePath: join(screenshotOutput, file).replaceAll('\\', '/'),
    })),
    storybook: {
      localCommand: 'pnpm storybook:qa',
      staticBuildCommand: 'pnpm build-storybook:qa',
      staticOutput: 'dist/storybook/qa-remote',
    },
  };

  await writeFile(join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    join(outputRoot, 'README.md'),
    `# Zeroheight Export Package

Generated for the Public Sector Federation POC.

## Contents

- Markdown page sources in \`pages/\`
- Token exports in \`tokens/\`
- Agile report artifacts in \`reports/agile-progress/\`
- Playwright screenshots in \`reports/agile-progress/screenshots/\`
- Upload/publish metadata in \`manifest.json\`

## Recommended Workflow

\`\`\`bash
pnpm report:all
\`\`\`

If using a custom publishing bridge, configure:

\`\`\`bash
ZEROHEIGHT_PUBLISH_ENDPOINT=...
ZEROHEIGHT_CLIENT_ID=...
ZEROHEIGHT_ACCESS_TOKEN=...
ZEROHEIGHT_DRY_RUN=false
\`\`\`
`,
  );

  return manifest;
}

runTokenBuild();

await rm(latestRoot, { recursive: true, force: true });
await rm(stampedRoot, { recursive: true, force: true });

const manifest = await buildPackage(latestRoot);
await buildPackage(stampedRoot);

console.log(`Zeroheight export package written to ${latestRoot} and ${stampedRoot}.`);

if (manifest.warnings.length > 0) {
  console.warn('Zeroheight export completed with warnings:');
  for (const warning of manifest.warnings) {
    console.warn(`- ${warning}`);
  }
}
