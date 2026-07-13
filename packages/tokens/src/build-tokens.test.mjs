import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const sourceDir = new URL('.', import.meta.url);

const readJson = async (fileName) => JSON.parse(await readFile(new URL(fileName, sourceDir), 'utf8'));
const readText = async (fileName) => readFile(new URL(fileName, sourceDir), 'utf8');

describe('token build artifacts', () => {
  it('keeps the sample Figma DTCG input aligned with expected token tiers', async () => {
    const sample = await readJson(join('tokens', 'figma-dtcg.sample.json'));

    assert.equal(sample.$extensions['public-sector'].source, 'Figma');
    assert.equal(sample.$extensions['public-sector'].artifact, 'DTCG-compatible JSON');
    assert.match(sample.$extensions['public-sector'].purpose, /Zeroheight is not part of token creation/);
    assert.deepEqual(sample.$extensions['public-sector'].tiers, [
      'primitive',
      'semantic',
      'component',
      'primeng-mapping',
    ]);

    assert.equal(sample.primitive.color.blue['600'].$value, '#1d4ed8');
    assert.equal(sample.semantic.color.primary.background.$value, '{primitive.color.blue.600}');
    assert.equal(sample.component.button.primary.background.$value, '{semantic.color.primary.background}');
    assert.equal(sample.provider.primeng.component.button.primary.background.$value, '{component.button.primary.background}');
    assert.equal(sample.provider.primeng.component.toast.error.background.$value, '{component.toast.danger.background}');
  });

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
    const mappingRules = await readJson(join('tokens', 'mapping-rules.json'));
    const zeroheight = await readJson('zeroheight-tokens.json');
    const expectedCount = themes.selectors.reduce((count, selector) => count + Object.keys(selector.tokens).length, 0);

    assert.equal(zeroheight.generatedFrom, 'packages/tokens/src/tokens/*.json');
    assert.equal(zeroheight.mappingRulesVersion, mappingRules.version);
    assert.deepEqual(zeroheight.authoritativeInput, mappingRules.authoritativeInput);
    assert.equal(zeroheight.figmaDtcgInput.file, 'packages/tokens/src/tokens/figma-dtcg.sample.json');
    assert.equal(zeroheight.figmaDtcgInput.source, 'Figma');
    assert.equal(zeroheight.figmaDtcgInput.artifact, 'DTCG-compatible JSON');
    assert.equal(zeroheight.figmaDtcgInput.validated, true);
    assert.ok(zeroheight.figmaDtcgInput.validationChecks.includes('primeng-button-primary-background'));
    assert.deepEqual(zeroheight.normalizationRules, mappingRules.normalizationRules);
    assert.equal(zeroheight.tokenCount, expectedCount);
    assert.equal(zeroheight.tokens.length, expectedCount);

    const buttonToken = zeroheight.tokens.find((token) => token.name === '--p-button-primary-background');
    assert.ok(buttonToken, 'button background token should be exported');
    assert.equal(buttonToken.primeNgFamily, 'Button');
    assert.equal(buttonToken.cssVariable, '--p-button-primary-background');
    assert.equal(buttonToken.mappingRulesVersion, mappingRules.version);
    assert.ok(buttonToken.description.length > 0);
  });

  it('creates DTCG-compatible design tokens for primitive and importable theme values', async () => {
    const mappingRules = await readJson(join('tokens', 'mapping-rules.json'));
    const designTokens = await readJson('design-tokens.json');

    assert.equal(designTokens.$description, 'DTCG-compatible token import generated from packages/tokens/src/tokens/*.json.');
    assert.equal(designTokens.$extensions['public-sector'].mappingRulesVersion, mappingRules.version);
    assert.deepEqual(designTokens.$extensions['public-sector'].authoritativeInput, mappingRules.authoritativeInput);
    assert.equal(designTokens.$extensions['public-sector'].figmaDtcgInput.validated, true);
    assert.equal(
      designTokens.$extensions['public-sector'].figmaDtcgInput.file,
      'packages/tokens/src/tokens/figma-dtcg.sample.json',
    );
    assert.deepEqual(designTokens.$extensions['public-sector'].tiers, mappingRules.tiers);
    assert.deepEqual(designTokens.$extensions['public-sector'].precedence, mappingRules.precedence);
    assert.deepEqual(designTokens.$extensions['public-sector'].normalizationRules, mappingRules.normalizationRules);
    assert.equal(designTokens.primitive.color.blue['500'].$type, 'color');
    assert.equal(designTokens.primitive.radius.md.$type, 'dimension');
    assert.equal(designTokens.primitive.typography.fontFamily.$type, 'fontFamily');

    const neutralLight = designTokens.theme['neutral-light'];
    assert.ok(neutralLight, 'neutral light theme should be emitted');
    assert.equal(neutralLight.ps.surface.background.$extensions['public-sector'].theme, 'neutral');
    assert.equal(neutralLight.ps.surface.background.$extensions['public-sector'].mode, 'light');
    assert.equal(neutralLight.p.primary.hover.color.$extensions['public-sector'].tier, 'primeng-mapping');
    assert.equal(neutralLight.p.primary.hover.color.$extensions['public-sector'].mappingRulesVersion, mappingRules.version);
  });

  it('keeps every documented normalization rule represented in generated artifacts', async () => {
    const mappingRules = await readJson(join('tokens', 'mapping-rules.json'));
    const zeroheight = await readJson('zeroheight-tokens.json');
    const designTokens = await readJson('design-tokens.json');
    const css = await readText('tokens.css');

    assert.deepEqual(
      designTokens.$extensions['public-sector'].normalizationRules.map((rule) => rule.id),
      mappingRules.normalizationRules.map((rule) => rule.id),
    );
    assert.deepEqual(
      zeroheight.normalizationRules.map((rule) => rule.id),
      mappingRules.normalizationRules.map((rule) => rule.id),
    );

    for (const rule of mappingRules.normalizationRules) {
      assert.match(rule.id, /^[a-z0-9-]+$/);
      assert.ok(['active', 'proposed'].includes(rule.status), `${rule.id} should declare status`);
      assert.ok(rule.behavior.length > 0, `${rule.id} should document behavior`);
    }

    const byId = Object.fromEntries(mappingRules.normalizationRules.map((rule) => [rule.id, rule]));
    assert.equal(byId['danger-to-error'].source, 'danger');
    assert.equal(byId['danger-to-error'].target, 'error');
    assert.ok(css.includes('--ps-danger-color'), 'danger semantic token should remain in runtime CSS');
    assert.ok(css.includes('--p-toast-message-error-background'), 'PrimeNG error bridge should remain in runtime CSS');

    assert.deepEqual(byId['typography-aliases'].activeAliases, []);
    assert.deepEqual(byId['missing-ramp-aliases'].activeAliases, []);
    assert.ok(css.includes('--p-primary-color: var(--ps-primary-background);'), 'PrimeNG bridge should map from --ps-*');
    assert.ok(css.includes('Stable PrimeNG component overrides'), 'component override rule should have emitted CSS');
  });
});
