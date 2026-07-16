import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const jsonFiles = [
  'package.json',
  'nx.json',
  'tsconfig.base.json',
  'apps/agile-api/project.json',
  'apps/agile-api/tsconfig.app.json',
  'apps/agile-api/tsconfig.spec.json',
  'apps/agile-api/prisma/seed-data/agile-workflow.seed.json',
  'apps/admin-remote/tsconfig.json',
  'apps/playground/tsconfig.json',
  'apps/qa-remote/project.json',
  'apps/qa-remote/tsconfig.json',
  'apps/qa-remote/tsconfig.app.json',
  'apps/qa-remote/tsconfig.storybook.json',
  'apps/reporting-remote/tsconfig.json',
  'apps/services-remote/tsconfig.json',
  'apps/shell/tsconfig.json',
  'packages/tokens/package.json',
  'packages/tokens/project.json',
];

const run = (command, args) => {
  const isWindowsPnpm = process.platform === 'win32' && command === 'pnpm';
  const executable = isWindowsPnpm ? process.env.ComSpec ?? 'cmd.exe' : command;
  const commandArgs = isWindowsPnpm ? ['/d', '/s', '/c', 'pnpm.cmd', ...args] : args;
  const result = spawnSync(executable, commandArgs, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

for (const file of jsonFiles) {
  JSON.parse(await readFile(join(root, file), 'utf8'));
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (packageJson.devDependencies['@storybook/addon-docs'] !== '10.4.6') {
  throw new Error('@storybook/addon-docs must stay pinned to 10.4.6 to match the Storybook package set.');
}

const storyFiles = (await readdir(join(root, 'apps/qa-remote/src/stories'))).filter((file) => file.endsWith('.stories.ts'));
let storyCount = 0;
const storyExports = new Set();
for (const file of storyFiles) {
  const source = await readFile(join(root, 'apps/qa-remote/src/stories', file), 'utf8');
  for (const match of source.matchAll(/^export const\s+(\w+)/gm)) {
    storyExports.add(match[1]);
    storyCount += 1;
  }
}

const requiredStories = [
  'Primary',
  'ToneMatrix',
  'AppearanceMatrix',
  'CurrentVsCandidate',
  'InteractionStateReference',
  'SizeMatrix',
  'FocusReference',
  'LightDarkModeMatrix',
  'ThemeVariantMatrix',
];

const missingStories = requiredStories.filter((story) => !storyExports.has(story));
if (storyCount < 20 || missingStories.length > 0) {
  throw new Error(
    `Expected at least 20 QA Storybook stories and required coverage stories. Found ${storyCount}; missing: ${
      missingStories.join(', ') || 'none'
    }.`,
  );
}

const storybookMain = await readFile(join(root, 'apps/qa-remote/.storybook/main.ts'), 'utf8');
if (!storybookMain.includes("'@storybook/addon-docs'") || !storybookMain.includes("'@storybook/addon-a11y'")) {
  throw new Error('QA Storybook must register addon-docs and addon-a11y.');
}

run('node', ['scripts/guard-scss.mjs']);
run('node', ['scripts/check-primeng-boundaries.mjs']);
run('node', ['scripts/build-component-manifest.mjs', '--check']);
run('pnpm', ['db:validate']);
run('pnpm', ['markdownlint-cli2', 'docs/**/*.md', '!docs/reports/**/*.md']);

console.log(
  `Workspace lint checks passed: ${jsonFiles.length} JSON files, ${storyCount} Storybook stories, component manifest, PrimeNG boundaries, Prisma schema, SCSS guard, and Markdown linting.`,
);
