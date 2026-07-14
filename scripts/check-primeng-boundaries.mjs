import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = process.cwd();

const sourceRoots = ['apps', 'packages'];
const textExtensions = new Set(['.ts', '.html', '.css', '.scss']);

const allowedPrimeNgImportPaths = [
  `packages${sep}ui-patterns${sep}`,
  `packages${sep}primeng-preset${sep}`,
];

const allowedPrimeNgStylePaths = [
  `packages${sep}ui-patterns${sep}`,
  `packages${sep}primeng-preset${sep}`,
  `packages${sep}tokens${sep}`,
];

const violations = [];
const legacyAllowances = [];
let scannedFiles = 0;

async function readLegacyAllowlist() {
  try {
    const source = await readFile(join(root, 'scripts', 'primeng-boundary-allowlist.json'), 'utf8');
    const parsed = JSON.parse(source);
    return (parsed.legacyPrimeNgAllowedPaths ?? []).map((path) => path.split(/[\\/]/).join(sep));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

const isUnder = (file, prefixes) => prefixes.some((prefix) => file.startsWith(prefix));

const extensionOf = (file) => {
  const dot = file.lastIndexOf('.');
  return dot === -1 ? '' : file.slice(dot);
};

async function collectFiles(dir) {
  const entries = await readdir(join(root, dir), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.angular') {
        continue;
      }
      files.push(...(await collectFiles(child)));
      continue;
    }

    if (entry.isFile() && textExtensions.has(extensionOf(entry.name))) {
      files.push(child);
    }
  }

  return files;
}

function addViolation(file, line, message) {
  violations.push(`${file}:${line}: ${message}`);
}

function addLegacyAllowance(file, line, message) {
  legacyAllowances.push(`${file}:${line}: ${message}`);
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

const legacyPrimeNgAllowedPaths = await readLegacyAllowlist();

for (const sourceRoot of sourceRoots) {
  const files = await collectFiles(sourceRoot);

  for (const file of files) {
    const normalizedFile = file.split(/[\\/]/).join(sep);
    const source = await readFile(join(root, file), 'utf8');
    const extension = extensionOf(file);
    scannedFiles += 1;

    const importMatches = [...source.matchAll(/from\s+['"]primeng\/([^'"]+)['"]/g)];
    for (const match of importMatches) {
      const moduleName = match[1];
      const line = lineNumber(source, match.index ?? 0);

      if (isUnder(normalizedFile, legacyPrimeNgAllowedPaths)) {
        addLegacyAllowance(file, line, `Legacy direct primeng/${moduleName} import is temporarily allowed.`);
      } else if (!isUnder(normalizedFile, allowedPrimeNgImportPaths)) {
        addViolation(
          file,
          line,
          `Direct primeng/${moduleName} import is blocked. Use @public-sector/ui-patterns wrappers or add the integration behind packages/ui-patterns.`,
        );
      }
    }

    if (extension === '.html') {
      for (const match of source.matchAll(/<\/?p-[a-z][\w-]*/g)) {
        if (isUnder(normalizedFile, legacyPrimeNgAllowedPaths)) {
          addLegacyAllowance(file, lineNumber(source, match.index ?? 0), 'Legacy direct PrimeNG <p-*> usage is temporarily allowed.');
        } else if (!isUnder(normalizedFile, allowedPrimeNgImportPaths)) {
          addViolation(file, lineNumber(source, match.index ?? 0), 'Direct PrimeNG <p-*> element usage is blocked. Use @public-sector/ui-patterns wrappers or native markup.');
        }
      }

      for (const match of source.matchAll(/\s(pTemplate|p[A-Z][A-Za-z]*)\b/g)) {
        if (isUnder(normalizedFile, legacyPrimeNgAllowedPaths)) {
          addLegacyAllowance(file, lineNumber(source, match.index ?? 0), 'Legacy direct PrimeNG template/directive usage is temporarily allowed.');
        } else if (!isUnder(normalizedFile, allowedPrimeNgImportPaths)) {
          addViolation(file, lineNumber(source, match.index ?? 0), 'Direct PrimeNG template/directive usage is blocked. Use @public-sector/ui-patterns wrappers or native markup.');
        }
      }
    }

    if (extension === '.css' || extension === '.scss') {
      for (const match of source.matchAll(/\.p-[a-z0-9_-]+/g)) {
        if (isUnder(normalizedFile, legacyPrimeNgAllowedPaths)) {
          addLegacyAllowance(file, lineNumber(source, match.index ?? 0), 'Legacy app-level .p-* styling is temporarily allowed.');
        } else if (!isUnder(normalizedFile, allowedPrimeNgStylePaths)) {
          addViolation(
            file,
            lineNumber(source, match.index ?? 0),
            'Do not style PrimeNG .p-* internals from apps/remotes. Move styling behind @public-sector/ui-patterns.',
          );
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error('PrimeNG wrapper boundary violations found:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  console.error('\nApplications and remotes must consume @public-sector/ui-patterns wrappers. PrimeNG remains internal to wrapper implementations.');
  process.exit(1);
}

if (legacyAllowances.length > 0) {
  console.warn('Legacy PrimeNG compatibility allowances found:\n');
  for (const allowance of legacyAllowances) {
    console.warn(`- ${allowance}`);
  }
  console.warn('\nThese allowances should be tracked with owners and removed as wrappers are adopted.\n');
}

console.log(`PrimeNG wrapper boundary check passed. Scanned ${scannedFiles} source files.`);
