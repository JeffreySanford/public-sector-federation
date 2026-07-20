import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const sourceDir = new URL('.', import.meta.url);

const readJson = async (fileName) => JSON.parse(await readFile(new URL(fileName, sourceDir), 'utf8'));
const readText = async (fileName) => readFile(new URL(fileName, sourceDir), 'utf8');

const resolveCssReference = (tokens, value) => {
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/);
  return reference ? resolveCssReference(tokens, tokens[reference[1]]) : value;
};

describe('token build artifacts', () => {
  it('keeps the sample Figma DTCG input aligned with expected token tiers', async () => {
    const sample = await readJson(join('tokens', 'figma-dtcg.sample.json'));

    assert.equal(sample.$extensions['public-sector'].source, 'Figma');
    assert.equal(sample.$extensions['public-sector'].artifact, 'DTCG-compatible JSON');
    assert.match(sample.$extensions['public-sector'].purpose, /No external documentation platform is part of token creation/);
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
    const designTokens = await readJson('design-tokens.json');
    const css = await readText('tokens.css');

    assert.deepEqual(
      designTokens.$extensions['public-sector'].normalizationRules.map((rule) => rule.id),
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

  it('keeps PrimeNG bridge values aligned with generated CSS token values and preset inputs', async () => {
    const themes = await readJson(join('tokens', 'themes.json'));
    const presetSource = await readFile(new URL('../../primeng-preset/src/preset.ts', sourceDir), 'utf8');
    const rootTokens = themes.selectors.find(({ selector }) => selector === ':root')?.tokens;

    assert.ok(rootTokens, 'root tokens should exist');

    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-primary-color']), rootTokens['--ps-primary-background']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-primary-inverse-color']), rootTokens['--ps-primary-foreground']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-content-background']), rootTokens['--ps-surface-card']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-content-border-color']), rootTokens['--ps-surface-border']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-text-color']), rootTokens['--ps-text-primary']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-text-muted-color']), rootTokens['--ps-text-secondary']);
    assert.equal(resolveCssReference(rootTokens, rootTokens['--p-button-primary-background']), rootTokens['--ps-primary-background']);

    assert.match(presetSource, /from '@public-sector\/tokens'/);
    assert.ok(presetSource.includes('semantic.light.primaryBackground'));
    assert.ok(presetSource.includes('semantic.light.surfaceCard'));
    assert.ok(presetSource.includes('semantic.dark.primaryBackground'));
    assert.ok(presetSource.includes('typography.fontFamily'));
  });
});
