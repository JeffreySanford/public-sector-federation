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

function selectorsFromSource(source) {
  const selector = source.match(/selector\s*:\s*['"]([^'"]+)['"]/)?.[1];
  return selector?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
}

function primeNgImports(source) {
  return [...source.matchAll(/from\s+['"](primeng\/[^'"]+)['"]/g)].map((match) => match[1]);
}

function tokenReferences(source, prefix) {
  return [...new Set([...source.matchAll(new RegExp(`var\\((--${prefix}-[a-z0-9-]+)`, 'gi'))].map((match) => match[1]))];
}

function angularSignalMembers(source, sourcePath) {
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const members = { inputs: [], outputs: [], models: [] };
  const visit = (node) => {
    if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      let call = node.initializer;
      if (ts.isCallExpression(call) && ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'required') {
        const factory = call.expression.expression;
        if (ts.isIdentifier(factory)) {
          const bucket = factory.text === 'input' ? 'inputs' : factory.text === 'output' ? 'outputs' : factory.text === 'model' ? 'models' : null;
          if (bucket) members[bucket].push(node.name.text);
          ts.forEachChild(node, visit);
          return;
        }
      }
      if (ts.isCallExpression(call) && ts.isIdentifier(call.expression)) {
        const bucket = call.expression.text === 'input' ? 'inputs' : call.expression.text === 'output' ? 'outputs' : call.expression.text === 'model' ? 'models' : null;
        if (bucket) members[bucket].push(node.name.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return members;
}

function providerTypeLeaks(source, sourcePath) {
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const providerAliases = new Set();
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.moduleSpecifier.text.startsWith('primeng/')) continue;
    const clause = statement.importClause;
    if (clause?.name) providerAliases.add(clause.name.text);
    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) providerAliases.add(element.name.text);
    }
  }
  const leaks = [];
  const visit = (node) => {
    const initializer = ts.isPropertyDeclaration(node) ? node.initializer : undefined;
    const signalCall = initializer && ts.isCallExpression(initializer)
      ? initializer
      : initializer && ts.isCallExpression(initializer) && ts.isPropertyAccessExpression(initializer.expression)
        ? initializer
        : undefined;
    const isPublicSignal = signalCall && (
      (ts.isIdentifier(signalCall.expression) && ['input', 'output', 'model'].includes(signalCall.expression.text)) ||
      (ts.isPropertyAccessExpression(signalCall.expression) && ts.isIdentifier(signalCall.expression.expression) && ['input', 'output', 'model'].includes(signalCall.expression.expression.text))
    );
    const explicitlyPublic = (ts.isPropertyDeclaration(node) || ts.isMethodDeclaration(node)) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.PublicKeyword);
    if (isPublicSignal || explicitlyPublic) {
      const text = node.getText(sourceFile);
      for (const alias of providerAliases) if (new RegExp(`\\b${alias}\\b`).test(text)) leaks.push(`${node.name?.getText(sourceFile) ?? 'member'}: ${alias}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return leaks;
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
  const findingIds = new Set();
  const findingById = new Map();

  for (const finding of manifest.findings) {
    if (findingIds.has(finding.id)) {
      addProblem(problems, `Duplicate finding id: ${finding.id}`);
    }
    findingIds.add(finding.id);
    findingById.set(finding.id, finding);

    for (const path of finding.evidence) {
      if (!(await pathExists(join(root, path)))) {
        addProblem(problems, `${finding.id}: evidence path does not exist: ${path}`);
      }
    }
  }

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

    const detectedSelectors = selectorsFromSource(source);
    if (identity.kind === 'service') {
      if (identity.selector !== null) {
        addProblem(problems, `${identity.id}: services must use selector: null.`);
      }
    } else if (detectedSelectors[0] !== identity.selector) {
      addProblem(problems, `${identity.id}: canonical selector mismatch; metadata=${identity.selector}, source=${detectedSelectors[0] ?? null}`);
    } else if (JSON.stringify(detectedSelectors.slice(1)) !== JSON.stringify(identity.selectorAliases)) {
      addProblem(problems, `${identity.id}: selector aliases mismatch; metadata=${identity.selectorAliases.join(',')}, source=${detectedSelectors.slice(1).join(',')}`);
    }

    const publicTokenReferences = tokenReferences(source, 'ps');
    const providerTokenReferences = tokenReferences(source, 'p');
    const tokenBoundary = entry.audit.tokenBoundary;

    if (identity.kind === 'service' && tokenBoundary !== 'not-applicable') {
      addProblem(problems, `${identity.id}: services must use tokenBoundary: not-applicable.`);
    }
    if (publicTokenReferences.length > 0 && providerTokenReferences.length > 0 && tokenBoundary !== 'mixed') {
      addProblem(problems, `${identity.id}: both --ps-* and --p-* tokens were detected; tokenBoundary must be mixed.`);
    }
    if (
      providerTokenReferences.length > 0
      && ['native', 'composite'].includes(implementation.provider)
      && !['provider-coupled', 'mixed'].includes(tokenBoundary)
    ) {
      addProblem(problems, `${identity.id}: native/composite --p-* use requires a provider-coupled or mixed token boundary.`);
    }
    if (publicTokenReferences.length > 0 && providerTokenReferences.length === 0 && tokenBoundary === 'provider-coupled') {
      addProblem(problems, `${identity.id}: only --ps-* tokens were detected; provider-coupled is inaccurate.`);
    }

    for (const findingId of entry.audit.findingIds) {
      const finding = findingById.get(findingId);
      if (!finding) {
        addProblem(problems, `${identity.id}: unknown finding id: ${findingId}`);
        continue;
      }
      if (!finding.componentIds.includes(identity.id)) {
        addProblem(problems, `${identity.id}: finding ${findingId} does not link back to this component.`);
      }
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

    if (entry.publicApi.status === 'complete' && identity.kind !== 'service') {
      const detected = angularSignalMembers(source, sourcePath);
      for (const bucket of ['inputs', 'outputs', 'models']) {
        const declaredNames = entry.publicApi[bucket].map((member) => member.name).sort();
        const detectedNames = detected[bucket].sort();
        if (declaredNames.join('|') !== detectedNames.join('|')) {
          addProblem(problems, `${identity.id}: manifest ${bucket} [${declaredNames.join(', ')}] do not match source [${detectedNames.join(', ')}].`);
        }
      }
    }

    const leakedTypes = providerTypeLeaks(source, sourcePath);
    if (implementation.providerInternalOnly && leakedTypes.length > 0) {
      addProblem(problems, `${identity.id}: PrimeNG types appear in explicitly public members: ${leakedTypes.join(', ')}`);
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

  for (const finding of manifest.findings) {
    for (const componentId of finding.componentIds) {
      const component = manifest.entries.find((entry) => entry.identity.id === componentId);
      if (!component) {
        addProblem(problems, `${finding.id}: unknown component id: ${componentId}`);
      } else if (!component.audit.findingIds.includes(finding.id)) {
        addProblem(problems, `${finding.id}: component ${componentId} does not link back to the finding.`);
      }
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
    findings: manifest.findings.length,
    openFindings: manifest.findings.filter((finding) => ['open', 'investigate', 'planned'].includes(finding.status)).length,
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
