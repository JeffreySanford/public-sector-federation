import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['apps', 'packages'];
const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.scss')) {
      offenders.push(fullPath);
    }
  }
}

for (const root of roots) {
  try {
    if (statSync(root).isDirectory()) {
      walk(root);
    }
  } catch {
    // Missing roots are fine before apps/packages are generated.
  }
}

if (offenders.length > 0) {
  console.error('SCSS files are not allowed in this workspace:');
  for (const offender of offenders) {
    console.error(`- ${offender}`);
  }
  process.exit(1);
}

console.log('No SCSS files found.');
