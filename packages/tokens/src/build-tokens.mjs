import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(sourceDir, 'tokens');

const readJson = async (fileName) => JSON.parse(await readFile(join(tokensDir, fileName), 'utf8'));

const themes = await readJson('themes.json');
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

console.log(`Generated tokens.css and zeroheight-tokens.json from ${zeroheightTokens.length} token values.`);
