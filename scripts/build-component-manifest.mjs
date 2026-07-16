import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const registryPath = join(root, 'packages/ui-patterns/src/manifest/component-registry.ts');
const indexPath = join(root, 'packages/ui-patterns/src/index.ts');
const outputPath = join(root, 'packages/ui-patterns/generated/component-manifest.json');
const checkOnly = process.argv.includes('--check');

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function loadRegistry() {
  const source = await readFile(registryPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
    fileName: registryPath,
  }).outputText;
  const encoded = Buffer.from(transpiled, 'utf8').toString('base64');
  const module = await import(`data:text/javascript;base64,${encoded}`);
  return module.componentManifest;
}

function readPublicExports(source) {
  const sourceFile = ts.createSourceFile(indexPath, source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const exports = new Set();

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier || !statement.exportClause) {
      continue;
    }
    const modulePath = statement.moduleSpecifier.text;
    if (!modulePath.startsWith('./public-')) {
      continue;
    }
    if (!ts.isNamedExports(statement.exportClause)) {
      continue;
    }
    for (const element of statement.exportClause.elements) {
      if (statement.isTypeOnly || element.isTypeOnly) {
        continue;
      }
      const name = element.name.text;
      if (/^Public[A-Z].*(Component|Service)$/.test(name)) {
        exports.add(name);
      }
    }
  }

  return exports;
}

function selectorFromSource(source) {
  return source.match(/selector\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null;
}

function primeNgImports(source) {
  return [...source.matchAll(/from\s+['"](primeng\/[^'"]+)['"]/g)].map((match) => match[1]);
}

function addProblem(problems, message) {
  problems.push(message);
}

async function validateManifest(manifest) {
  const problems = [];
  const warnings = [];
  const indexSource = await readFile(indexPath, 'utf8');
  const publicExports = readPublicExports(indexSource);
  const manifestExports = new Set(manifest.entries.map((entry) => entry.identity.exportName));
  const ids = new Set();
  const selectors = new Set();

  for (const exportName of publicExports) {
    if (!manifestExports.has(exportName)) {
      addProblem(problems, `Public export ${exportName} has no manifest entry.`);
    }
  }
  for (const exportName of manifestExports) {
    if (!publicExports.has(exportName)) {
      addProblem(problems, `Manifest entry ${exportName} is not a public component or service export.`);
    }
  }

  for (const entry of manifest.entries) {
    const { identity, implementation, evidence } = entry;
    if (ids.has(identity.id)) {
      addProblem(problems, `Duplicate manifest id: ${identity.id}`);
    }
    ids.add(identity.id);

    if (identity.selector) {
      if (selectors.has(identity.selector)) {
        addProblem(problems, `Duplicate component selector: ${identity.selector}`);
      }
      selectors.add(identity.selector);
    }

    const sourcePath = join(root, identity.source);
    if (!(await pathExists(sourcePath))) {
      addProblem(problems, `${identity.id}: source does not exist: ${identity.source}`);
      continue;
    }

    const source = await readFile(sourcePath, 'utf8');
    if (!source.includes(`export class ${identity.exportName}`)) {
      addProblem(problems, `${identity.id}: ${identity.exportName} was not found in ${identity.source}`);
    }

    const detectedSelector = selectorFromSource(source);
    if (identity.kind === 'service') {
      if (identity.selector !== null) {
        addProblem(problems, `${identity.id}: services must use selector: null.`);
      }
    } else if (detectedSelector !== identity.selector) {
      addProblem(problems, `${identity.id}: selector mismatch; metadata=${identity.selector}, source=${detectedSelector}`);
    }

    const detectedPrimeNgImports = primeNgImports(source);
    if (implementation.provider === 'primeng' && detectedPrimeNgImports.length === 0) {
      addProblem(problems, `${identity.id}: declared PrimeNG-backed but no primeng/* import was detected.`);
    }
    if (implementation.provider === 'native' && detectedPrimeNgImports.length > 0) {
      addProblem(problems, `${identity.id}: declared native but imports ${detectedPrimeNgImports.join(', ')}.`);
    }
    if (implementation.providerModules.length > 0) {
      const missing = implementation.providerModules.filter((moduleName) => !detectedPrimeNgImports.includes(moduleName));
      if (missing.length > 0) {
        addProblem(problems, `${identity.id}: declared provider modules were not detected: ${missing.join(', ')}`);
      }
    }

    const providerSpecificMembers = new Set([
      'severity',
      'styleClass',
      'pt',
      'unstyled',
      'buttonProps',
      'badgeClass',
      'loadingIcon',
      'raised',
      'rounded',
      'plain',
      'fluid',
    ]);
    const publicMemberNames = [
      ...entry.publicApi.inputs,
      ...entry.publicApi.outputs,
      ...entry.publicApi.models,
    ].map((member) => member.name);
    const undeclaredProviderLeaks = publicMemberNames.filter(
      (name) => providerSpecificMembers.has(name) && !implementation.providerEscapeHatches.includes(name),
    );
    if (implementation.providerInternalOnly && undeclaredProviderLeaks.length > 0) {
      addProblem(
        problems,
        `${identity.id}: provider-specific public members must be removed or declared as escape hatches: ${undeclaredProviderLeaks.join(', ')}`,
      );
    }

    for (const path of [
      ...evidence.storybook.files,
      ...evidence.tests.files,
      ...evidence.documentation.files,
    ]) {
      if (!(await pathExists(join(root, path)))) {
        addProblem(problems, `${identity.id}: evidence path does not exist: ${path}`);
      }
    }

    if (entry.publicApi.status !== 'complete') {
      warnings.push(`${identity.id}: public API extraction is ${entry.publicApi.status}.`);
    }
    if (entry.ownership.owner === null) {
      warnings.push(`${identity.id}: owner is not assigned.`);
    }
    for (const escapeHatch of implementation.providerEscapeHatches) {
      warnings.push(`${identity.id}: provider escape hatch remains public: ${escapeHatch}.`);
    }
  }

  return { problems, warnings };
}

function summary(manifest) {
  const countBy = (selector) =>
    Object.fromEntries(
      [...new Set(manifest.entries.map(selector))]
        .sort()
        .map((value) => [value, manifest.entries.filter((entry) => selector(entry) === value).length]),
    );

  return {
    entries: manifest.entries.length,
    lifecycle: countBy((entry) => entry.lifecycle.status),
    providers: countBy((entry) => entry.implementation.provider),
    missingStorybook: manifest.entries.filter((entry) => entry.evidence.storybook.status === 'missing').length,
    pendingManualAudits: manifest.entries.filter((entry) => entry.accessibility.screenReaderAudit === 'pending').length,
    pendingFigmaBindings: manifest.entries.filter((entry) => entry.figma.status === 'pending-access').length,
  };
}

const manifest = await loadRegistry();
const { problems, warnings } = await validateManifest(manifest);

if (problems.length > 0) {
  console.error('Component manifest validation failed:\n');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

if (checkOnly) {
  console.log('Component manifest validation passed.');
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Generated ${outputPath.replace(`${root}/`, '')}.`);
}

const report = summary(manifest);
console.log(JSON.stringify(report, null, 2));
if (warnings.length > 0) {
  console.warn(`Manifest advisory warnings: ${warnings.length}`);
}
