import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(sourceDir, 'tokens');

const readJson = async (fileName) => JSON.parse(await readFile(join(tokensDir, fileName), 'utf8'));

const themes = await readJson('themes.json');
const primitives = await readJson('primitives.json');
const metadata = await readJson('zeroheight-metadata.json');
const componentOverrides = await readFile(join(tokensDir, 'component-overrides.css'), 'utf8');

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
      tier: tokenName.startsWith('--p-') ? 'primeng-mapping' : 'semantic',
      category: tokenName.startsWith('--p-') ? 'PrimeNG Mapping' : 'Foundations',
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

const zeroheightTokens = themes.selectors.flatMap(({ selector, theme, mode, tokens }) =>
  Object.entries(tokens).map(([name, value]) => {
    const docs = matchMetadata(name);

    return {
      name,
      value,
      selector,
      theme,
      mode,
      tier: name.startsWith('--p-') ? 'primeng-mapping' : docs.tier,
      category: docs.category,
      usage: docs.usage,
      description: metadata.tokenDescriptions[name] ?? `${name} for ${theme} ${mode}.`,
      primeNgFamily: primeNgFamily(name),
      cssVariable: name,
    };
  }),
);

const designTokens = {
  $description: 'DTCG-compatible token import generated from packages/tokens/src/tokens/*.json.',
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
          tier: name.startsWith('--p-') ? 'primeng-mapping' : docs.tier,
          category: docs.category,
          usage: docs.usage,
          primeNgFamily: primeNgFamily(name),
        },
      },
    });
  }
}

await writeFile(join(sourceDir, 'tokens.css'), css);
await writeFile(
  join(sourceDir, 'zeroheight-tokens.json'),
  `${JSON.stringify(
    {
      generatedFrom: 'packages/tokens/src/tokens/*.json',
      tokenCount: zeroheightTokens.length,
      tokens: zeroheightTokens,
    },
    null,
    2,
  )}\n`,
);
await writeFile(join(sourceDir, 'design-tokens.json'), `${JSON.stringify(designTokens, null, 2)}\n`);

console.log(`Generated tokens.css, zeroheight-tokens.json, and design-tokens.json from ${zeroheightTokens.length} token values.`);
