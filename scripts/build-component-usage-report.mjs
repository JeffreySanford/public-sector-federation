import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import process from 'node:process';
import { glob } from 'glob';

const root = process.cwd();
const manifestPath = join(root, 'packages/ui-patterns/generated/component-manifest.json');
const outputPath = join(root, 'artifacts/component-audit/component-usage-report.json');
const quiet = process.argv.includes('--quiet');

const sourcePatterns = [
  'apps/**/*.{ts,html,astro,md,mdx}',
  'packages/**/*.{ts,html,astro,md,mdx}',
  'docs/**/*.{md,mdx}',
];

const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/coverage/**',
  '**/playwright-report/**',
  '**/test-results/**',
  '**/*-snapshots/**',
  'packages/ui-patterns/generated/**',
  'packages/ui-patterns/src/manifest/**',
];

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}

function countMatches(source, expression) {
  return [...source.matchAll(expression)].length;
}

function classifyPath(path) {
  if (/\.stories\.[cm]?[jt]s$|\/stories\//.test(path)) return 'storybook';
  if (/\.(spec|test)\.[cm]?[jt]s$|\/e2e\/|\/tests?\//.test(path)) return 'test';
  if (path.startsWith('docs/') || path.startsWith('apps/starlight/src/content/')) return 'documentation';
  if (path.startsWith('packages/ui-patterns/')) return 'library';
  if (path.startsWith('apps/')) return 'application';
  return 'tooling';
}

function countByScope(consumers) {
  const scopes = ['application', 'library', 'storybook', 'test', 'documentation', 'tooling'];
  return Object.fromEntries(
    scopes.map((scope) => {
      const matches = consumers.filter((consumer) => consumer.scope === scope);
      return [
        scope,
        {
          consumerFiles: matches.length,
          references: matches.reduce((sum, consumer) => sum + consumer.references, 0),
        },
      ];
    }),
  );
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const files = await glob(sourcePatterns, {
    cwd: root,
    absolute: true,
    nodir: true,
    ignore: ignorePatterns,
  });

  const sources = await Promise.all(
    files.sort().map(async (absolutePath) => {
      const path = relative(root, absolutePath).replaceAll('\\', '/');
      return { path, source: await readFile(absolutePath, 'utf8') };
    }),
  );

  const entries = manifest.entries.map((entry) => {
    const selector = entry.identity.selector;
    const symbol = entry.identity.exportName;
    const selectorPattern = selector
      ? new RegExp(`<${escapeRegex(selector)}(?=[\\s/>])`, 'g')
      : null;
    const symbolPattern = new RegExp(`\\b${escapeRegex(symbol)}\\b`, 'g');

    const consumers = sources
      .filter(({ path }) => path !== entry.identity.source)
      .map(({ path, source }) => {
        const selectorOccurrences = selectorPattern ? countMatches(source, selectorPattern) : 0;
        const symbolOccurrences = countMatches(source, symbolPattern);
        return {
          path,
          scope: classifyPath(path),
          selectorOccurrences,
          symbolOccurrences,
          references: selectorOccurrences + symbolOccurrences,
        };
      })
      .filter((consumer) => consumer.references > 0)
      .sort((left, right) => left.path.localeCompare(right.path));

    const counts = countByScope(consumers);
    const runtimeConsumers = consumers.filter(
      (consumer) => consumer.scope === 'application' || consumer.scope === 'library',
    );

    return {
      id: entry.identity.id,
      name: entry.identity.name,
      selector,
      exportName: symbol,
      lifecycle: entry.lifecycle.status,
      provider: entry.implementation.provider,
      duplicationCluster: entry.audit.duplicationCluster,
      disposition: entry.audit.disposition,
      runtime: {
        consumerFiles: runtimeConsumers.length,
        references: runtimeConsumers.reduce((sum, consumer) => sum + consumer.references, 0),
      },
      counts,
      consumers,
    };
  });

  const directProviderImports = sources
    .filter(({ path }) => path.startsWith('apps/'))
    .flatMap(({ path, source }) => {
      const modules = [...source.matchAll(/from\s+['"](primeng\/[^'"]+)['"]/g)]
        .map((match) => match[1]);
      return modules.length
        ? [{ path, scope: classifyPath(path), modules: [...new Set(modules)].sort() }]
        : [];
    })
    .sort((left, right) => left.path.localeCompare(right.path));

  const missingAuditMetadata = entries.filter(
    (entry) => !entry.duplicationCluster || !entry.disposition,
  );
  if (missingAuditMetadata.length > 0) {
    throw new Error(
      `Missing audit metadata: ${missingAuditMetadata.map((entry) => entry.id).join(', ')}`,
    );
  }

  const report = {
    schemaVersion: 1,
    package: manifest.package,
    generatedFrom: 'packages/ui-patterns/generated/component-manifest.json',
    methodology: {
      runtimeScopes: ['application', 'library'],
      evidenceScopes: ['storybook', 'test', 'documentation'],
      countDefinition:
        'consumerFiles counts distinct files; references counts selector and exported-symbol occurrences.',
      exclusions: ignorePatterns,
    },
    summary: {
      entries: entries.length,
      entriesWithRuntimeConsumers: entries.filter((entry) => entry.runtime.consumerFiles > 0).length,
      entriesWithoutRuntimeConsumers: entries.filter((entry) => entry.runtime.consumerFiles === 0).length,
      directProviderImportFiles: directProviderImports.length,
    },
    entries,
    directProviderImports,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (!quiet) {
    console.log(`Generated ${relative(root, outputPath)}.`);
    console.log(JSON.stringify(report.summary, null, 2));
  }
}

await main();
