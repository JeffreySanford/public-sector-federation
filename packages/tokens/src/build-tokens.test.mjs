import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const sourceDir = new URL('.', import.meta.url);

const readJson = async (fileName) => JSON.parse(await readFile(new URL(fileName, sourceDir), 'utf8'));
const readText = async (fileName) => readFile(new URL(fileName, sourceDir), 'utf8');

describe('token build artifacts', () => {
  it('exports CSS variables for every themed selector and keeps PrimeNG overrides', async () => {
    const themes = await readJson(join('tokens', 'themes.json'));
    const css = await readText('tokens.css');

    for (const { selector, tokens } of themes.selectors) {
      assert.match(css, new RegExp(`(^|\\n)${selector.replaceAll('.', '\\.')} \\{`));

      for (const [name, value] of Object.entries(tokens)) {
        assert.ok(css.includes(`  ${name}: ${value};`), `${name} should be emitted for ${selector}`);
      }
    }

    assert.ok(css.includes('Stable PrimeNG component overrides'), 'component override section should be present');
    assert.ok(css.includes('--p-datatable-header-cell-background'), 'PrimeNG datatable overrides should be emitted');
  });

  it('creates a Zeroheight token export with metadata and PrimeNG family mapping', async () => {
    const themes = await readJson(join('tokens', 'themes.json'));
    const zeroheight = await readJson('zeroheight-tokens.json');
    const expectedCount = themes.selectors.reduce((count, selector) => count + Object.keys(selector.tokens).length, 0);

    assert.equal(zeroheight.generatedFrom, 'packages/tokens/src/tokens/*.json');
    assert.equal(zeroheight.tokenCount, expectedCount);
    assert.equal(zeroheight.tokens.length, expectedCount);

    const buttonToken = zeroheight.tokens.find((token) => token.name === '--p-button-primary-background');
    assert.ok(buttonToken, 'button background token should be exported');
    assert.equal(buttonToken.primeNgFamily, 'Button');
    assert.equal(buttonToken.cssVariable, '--p-button-primary-background');
    assert.ok(buttonToken.description.length > 0);
  });

  it('creates DTCG-compatible design tokens for primitive and importable theme values', async () => {
    const designTokens = await readJson('design-tokens.json');

    assert.equal(designTokens.$description, 'DTCG-compatible token import generated from packages/tokens/src/tokens/*.json.');
    assert.equal(designTokens.primitive.color.blue['500'].$type, 'color');
    assert.equal(designTokens.primitive.radius.md.$type, 'dimension');
    assert.equal(designTokens.primitive.typography.fontFamily.$type, 'fontFamily');

    const neutralLight = designTokens.theme['neutral-light'];
    assert.ok(neutralLight, 'neutral light theme should be emitted');
    assert.equal(neutralLight.ps.surface.background.$extensions['public-sector'].theme, 'neutral');
    assert.equal(neutralLight.ps.surface.background.$extensions['public-sector'].mode, 'light');
  });
});
