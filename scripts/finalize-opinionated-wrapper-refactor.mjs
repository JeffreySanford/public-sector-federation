import { readFile, unlink, writeFile } from 'node:fs/promises';

async function update(path, transform) {
  const source = await readFile(path, 'utf8');
  const next = transform(source);
  if (next === source) {
    console.log(`No finalization change needed for ${path}.`);
    return;
  }
  await writeFile(path, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
  console.log(`Finalized ${path}.`);
}

await update('apps/qa-remote/src/stories/opinionated-wrapper-contract.stories.ts', (source) =>
  source
    .replace(
      'header p { margin: 0 0 0.35rem; color: var(--p-primary-color); font-weight: 800; text-transform: uppercase; }',
      'header p { margin: 0 0 0.35rem; color: var(--p-text-color); font-weight: 800; text-transform: uppercase; }',
    )
    .replace(
      'header span { color: var(--p-text-muted-color); }',
      'header span { color: var(--p-text-color); }',
    )
    .replace(
      'intent="destructive"\n            appearance="outlined"',
      'intent="destructive"\n            appearance="solid"',
    ),
);

for (const path of [
  '.github/workflows/apply-opinionated-wrapper-refactor.yml',
  'scripts/apply-opinionated-wrapper-refactor.mjs',
  'scripts/finalize-opinionated-wrapper-refactor.mjs',
]) {
  await unlink(path);
  console.log(`Removed one-time implementation helper ${path}.`);
}
