import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = process.cwd();
const scanRoots = ['apps', 'packages'];
const candidateSelector = /<ps-button-candidate\b[\s\S]*?>/g;
const violations = [];

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'generated'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(path);
      continue;
    }
    if (!['.ts', '.html'].includes(extname(entry.name))) continue;
    const source = await readFile(path, 'utf8');
    for (const match of source.matchAll(candidateSelector)) {
      const tag = match[0];
      const forbidden = [
        ['tone input', /(?:\[tone\]|\stone)\s*=/],
        ['buttonClick output', /\(buttonClick\)\s*=/],
        ['raw PrimeIcons class', /icon\s*=\s*["']pi\s/],
      ].filter(([, pattern]) => pattern.test(tag));
      for (const [reason] of forbidden) {
        const line = source.slice(0, match.index).split(/\r?\n/).length;
        violations.push(`${path.slice(root.length + 1)}:${line}: ps-button-candidate exposes forbidden ${reason}`);
      }
    }
  }
}

for (const directory of scanRoots) await scan(join(root, directory));

const candidateStoryPath = join(root, 'apps/qa-remote/src/stories/button-candidate.stories.ts');
const candidateStory = await readFile(candidateStoryPath, 'utf8');
if (!/component\s*:\s*PublicButtonCandidateComponent\b/.test(candidateStory)) {
  violations.push(
    'apps/qa-remote/src/stories/button-candidate.stories.ts: candidate metadata must set component: PublicButtonCandidateComponent for production arg-type extraction',
  );
}

if (violations.length) {
  console.error(`Wrapper contract validation failed:\n${violations.join('\n')}`);
  process.exit(1);
}

console.log('Wrapper contract validation passed: ps-button-candidate uses only the provider-neutral candidate API.');
