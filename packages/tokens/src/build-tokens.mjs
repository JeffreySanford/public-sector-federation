import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(sourceDir, 'tokens');

const readJson = async (fileName) => JSON.parse(await readFile(join(tokensDir, fileName), 'utf8'));

const themes = await readJson('themes.json');
const primitives = await readJson('primitives.json');
const metadata = await readJson('token-metadata.json');
const mappingRules = await readJson('mapping-rules.json');
const figmaDtcgSample = await readJson('figma-dtcg.sample.json');
const componentOverrides = await readFile(join(tokensDir, 'component-overrides.css'), 'utf8');

const getPath = (source, path) =>
  path.split('.').reduce((value, segment) => {
    if (value === undefined || value === null || !(segment in value)) {
      throw new Error(`Missing DTCG sample path: ${path}`);
    }
    return value[segment];
  }, source);

const tokenValueAt = (source, path) => {
  const token = getPath(source, path);
  if (!token || typeof token !== 'object' || typeof token.$value !== 'string') {
    throw new Error(`DTCG sample path is not a token value: ${path}`);
  }
  return token.$value;
};

const resolveDtcgReference = (source, value) => {
  const reference = value.match(/^\{(.+)\}$/);
  return reference ? resolveDtcgReference(source, tokenValueAt(source, reference[1])) : value;
};

const rootTokens = themes.selectors.find(({ selector }) => selector === ':root')?.tokens;

if (!rootTokens) {
  throw new Error('Missing :root theme selector.');
}

const resolveCssReference = (value) => {
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/);
  return reference ? resolveCssReference(rootTokens[reference[1]]) : value;
};

const assertEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, received ${actual}.`);
  }
};

const figmaDtcgInput = {
  file: 'packages/tokens/src/tokens/figma-dtcg.sample.json',
  source: figmaDtcgSample.$extensions?.['public-sector']?.source,
  artifact: figmaDtcgSample.$extensions?.['public-sector']?.artifact,
  purpose: figmaDtcgSample.$extensions?.['public-sector']?.purpose,
  validationChecks: [
    'source-metadata',
    'primitive-primary-blue',
    'semantic-primary-background',
    'primeng-primary-color',
    'primeng-button-primary-background',
    'danger-to-error-provider-reference',
  ],
};

assertEqual(figmaDtcgInput.source, mappingRules.authoritativeInput.source, 'Figma sample source must match mapping rules');
assertEqual(figmaDtcgInput.artifact, mappingRules.authoritativeInput.artifact, 'Figma sample artifact must match mapping rules');
assertEqual(tokenValueAt(figmaDtcgSample, 'primitive.color.blue.600'), primitives.color.blue['600'], 'Figma primitive sample must match primitives.json');
assertEqual(
  resolveDtcgReference(figmaDtcgSample, tokenValueAt(figmaDtcgSample, 'semantic.color.primary.background')),
  rootTokens['--ps-primary-background'],
  'Figma semantic primary sample must match :root --ps-primary-background',
);
assertEqual(
  resolveDtcgReference(figmaDtcgSample, tokenValueAt(figmaDtcgSample, 'provider.primeng.semantic.primary.color')),
  resolveCssReference(rootTokens['--p-primary-color']),
  'Figma PrimeNG primary sample must match :root --p-primary-color',
);
assertEqual(
  resolveDtcgReference(figmaDtcgSample, tokenValueAt(figmaDtcgSample, 'provider.primeng.component.button.primary.background')),
  resolveCssReference(rootTokens['--p-button-primary-background']),
  'Figma PrimeNG button sample must match :root --p-button-primary-background',
);
assertEqual(
  tokenValueAt(figmaDtcgSample, 'provider.primeng.component.toast.error.background'),
  '{component.toast.danger.background}',
  'Figma sample must document danger-to-error provider mapping',
);

figmaDtcgInput.validated = true;

const renderSelector = ({ selector, tokens }) => {
  const declarations = Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return `${selector} {\n${declarations}\n}`;
};

const css = [
  '@import "primeicons/primeicons.css";',
  '',
  '/* Generated from packages/tokens/src/tokens/*.json. Do not edit by hand. */',
  '',
  themes.selectors.map(renderSelector).join('\n\n'),
  '',
  '/* Stable PrimeNG component overrides generated from tokens/component-overrides.css. */',
  componentOverrides.trim(),
  '',
].join('\n');

const matchMetadata = (tokenName) => {
  const normalized = tokenName.toLowerCase();
  const match = Object.values(metadata.groups).find((group) =>
    group.match.some((fragment) => normalized.includes(fragment.toLowerCase())),
  );

  return (
    match ?? {
      tier: tokenName.startsWith(mappingRules.providerPrefix) ? 'primeng-mapping' : 'semantic',
      category: tokenName.startsWith(mappingRules.providerPrefix) ? 'PrimeNG Mapping' : 'Foundations',
      usage: 'Use according to the public-sector PrimeNG federation token contract.',
    }
  );
};

const primeNgFamily = (tokenName) => {
  const match = Object.entries(metadata.primeNgFamilies).find(([prefix]) => tokenName.startsWith(prefix));
  return match?.[1] ?? null;
};

const tokenPath = (name) =>
  name
    .replace(/^--/, '')
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean);

const setToken = (target, path, token) => {
  const [head, ...rest] = path;
  if (!head) {
    return;
  }
  if (rest.length === 0) {
    target[head] = token;
    return;
  }
  target[head] ??= {};
  setToken(target[head], rest, token);
};

const importableTokenType = (value, name) => {
  if (typeof value === 'string' && value.startsWith('#')) {
    return 'color';
  }
  if (typeof value === 'string' && value.match(/^-?\d*\.?\d+(px|rem)$/)) {
    return 'dimension';
  }
  if (name.endsWith('font-family')) {
    return 'fontFamily';
  }
  return null;
};

const designTokens = {
  $description: 'DTCG-compatible token import generated from packages/tokens/src/tokens/*.json.',
  $extensions: {
    'public-sector': {
      mappingRulesVersion: mappingRules.version,
      authoritativeInput: mappingRules.authoritativeInput,
      figmaDtcgInput,
      tiers: mappingRules.tiers,
      precedence: mappingRules.precedence,
      normalizationRules: mappingRules.normalizationRules,
    },
  },
  primitive: {
    color: Object.fromEntries(
      Object.entries(primitives.color).map(([family, scale]) => [
        family,
        Object.fromEntries(
          Object.entries(scale).map(([step, value]) => [
            step,
            {
              $type: 'color',
              $value: value,
              $description: `Primitive ${family} ${step}.`,
            },
          ]),
        ),
      ]),
    ),
    radius: Object.fromEntries(
      Object.entries(primitives.radius).map(([name, value]) => [
        name,
        {
          $type: 'dimension',
          $value: value,
          $description: `Primitive radius ${name}.`,
        },
      ]),
    ),
    space: Object.fromEntries(
      Object.entries(primitives.space).map(([name, value]) => [
        name,
        {
          $type: 'dimension',
          $value: value,
          $description: `Primitive spacing ${name}.`,
        },
      ]),
    ),
    typography: {
      fontFamily: {
        $type: 'fontFamily',
        $value: primitives.typography.fontFamily,
        $description: 'Primary application font stack.',
      },
    },
  },
  theme: {},
};

for (const { selector, theme, mode, tokens } of themes.selectors) {
  const modeKey = `${theme}-${mode}`;
  designTokens.theme[modeKey] = {};

  for (const [name, value] of Object.entries(tokens)) {
    const docs = matchMetadata(name);
    const type = importableTokenType(value, name);

    if (!type) {
      continue;
    }

    setToken(designTokens.theme[modeKey], tokenPath(name), {
      $type: type,
      $value: value,
      $description: metadata.tokenDescriptions[name] ?? `${name} for ${theme} ${mode}.`,
      $extensions: {
        'public-sector': {
          cssVariable: name,
          selector,
          theme,
          mode,
          tier: name.startsWith(mappingRules.providerPrefix) ? 'primeng-mapping' : docs.tier,
          mappingRulesVersion: mappingRules.version,
          category: docs.category,
          usage: docs.usage,
          primeNgFamily: primeNgFamily(name),
        },
      },
    });
  }
}

const tokenCount = themes.selectors.reduce((count, { tokens }) => count + Object.keys(tokens).length, 0);

await writeFile(join(sourceDir, 'tokens.css'), css);
await writeFile(join(sourceDir, 'design-tokens.json'), `${JSON.stringify(designTokens, null, 2)}\n`);

console.log(
  `Generated tokens.css and design-tokens.json from ${tokenCount} token values. ` +
    `Validated ${figmaDtcgInput.file}.`,
);
