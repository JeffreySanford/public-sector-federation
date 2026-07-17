import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const root = process.cwd();
const excludedDirectories = new Set([
  '.git',
  '.nx',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.scss',
  '.svg',
  '.ts',
  '.txt',
  '.yaml',
  '.yml',
]);
const blockedReferences = [
  {
    label: 'former individual reference',
    value: String.fromCharCode(110, 101, 105, 108),
  },
  {
    label: 'former organization reference',
    value: String.fromCharCode(115, 105, 116, 101, 112, 101, 110),
  },
];

const violations = [];

async function scanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = resolve(directory, entry.name);
    const relativePath = relative(root, absolutePath).split(sep).join('/');
    const normalizedPath = relativePath.toLowerCase();

    for (const reference of blockedReferences) {
      if (normalizedPath.includes(reference.value)) {
        violations.push(`${reference.label} in filename: ${relativePath}`);
      }
    }

    if (entry.isDirectory()) {
      await scanDirectory(absolutePath);
      continue;
    }

    if (!entry.isFile() || !textExtensions.has(extname(entry.name).toLowerCase())) {
      continue;
    }

    const content = await readFile(absolutePath, 'utf8');
    const lines = content.split(/\r?\n/u);

    for (const reference of blockedReferences) {
      for (let index = 0; index < lines.length; index += 1) {
        if (lines[index].toLowerCase().includes(reference.value)) {
          violations.push(`${reference.label} in ${relativePath}:${index + 1}`);
        }
      }
    }
  }
}

await scanDirectory(root);

if (violations.length > 0) {
  console.error('Public-reference guard failed:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log('Public-reference guard passed.');
}
