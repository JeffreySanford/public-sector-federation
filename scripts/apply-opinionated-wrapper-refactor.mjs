import { readFile, writeFile } from 'node:fs/promises';

async function read(path) {
  return readFile(path, 'utf8');
}

async function write(path, content) {
  await writeFile(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to update ${label}: expected source text was not found.`);
  }
  return source.replace(search, replacement);
}

let registry = await read('packages/ui-patterns/src/manifest/component-registry.ts');
const upButtonEntry = `  entry({
    id: 'ps-up-button',
    name: 'UP Button Candidate',
    exportName: 'PublicUpButtonComponent',
    selector: 'ps-up-button',
    source: 'packages/ui-patterns/src/public-up-button.component.ts',
    description: 'Opinionated PrimeNG facade exposing product intent while keeping provider controls private.',
    status: 'candidate',
    productionUse: false,
    replacementFor: 'ps-button',
    provider: 'primeng',
    providerModules: ['primeng/button'],
    knownLimitations: [
      'Legacy tone and buttonClick aliases remain during the Candidate compatibility window.',
      'Figma property mapping and manual screen-reader review remain pending.',
    ],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'label', type: 'string', defaultValue: 'Button' },
      { name: 'icon', type: 'PublicUpButtonIcon | undefined' },
      { name: 'intent', type: 'PublicUpButtonIntent', defaultValue: 'primary', description: 'Preferred consumer-driven action purpose.' },
      { name: 'appearance', type: 'PublicUpButtonAppearance', defaultValue: 'solid' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false' },
      { name: 'loading', type: 'boolean', defaultValue: 'false' },
      { name: 'tone', type: 'PublicUpButtonTone | undefined', description: 'Deprecated Candidate compatibility alias; use intent.' },
    ],
    outputs: [
      { name: 'activated', type: 'void', description: 'Preferred high-level action event.' },
      { name: 'buttonClick', type: 'void', description: 'Deprecated Candidate compatibility alias; use activated.' },
    ],
    publicTypes: ['PublicUpButtonIntent', 'PublicUpButtonTone', 'PublicUpButtonAppearance', 'PublicUpButtonIcon'],
    variants: [
      { name: 'intent', values: ['primary', 'secondary', 'destructive'] },
      { name: 'appearance', values: ['solid', 'outlined', 'text'] },
    ],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Candidates/Button UP',
    storybookFiles: [
      'apps/qa-remote/src/stories/up-button.stories.ts',
      'apps/qa-remote/src/stories/opinionated-wrapper-contract.stories.ts',
    ],
    stories: [
      'Primary',
      'ToneMatrix',
      'AppearanceMatrix',
      'InteractionStateReference',
      'LightDarkModeMatrix',
      'CurrentVsCandidate',
      'ApprovedApi',
      'SupportedIntentMatrix',
      'ProviderTranslation',
      'CompatibilityWindow',
    ],
    testStatus: 'complete',
    testFiles: ['apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts'],
    behaviors: ['pointer activation', 'keyboard activation', 'disabled suppression', 'loading state', 'visible focus', 'light and dark mode'],
    documentationStatus: 'complete',
    documentationFiles: [
      'docs/design-system/architecture/opinionated-wrapper-contract.md',
      'docs/design-system/components/up-button-candidate-overview.md',
      'docs/design-system/components/up-button-candidate-integration-plan.md',
      'docs/design-system/components/up-button-candidate-developer.md',
    ],
    accessibilityPattern: 'button',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    zeroheightStatus: 'draft',
    zeroheightTemplate: 'component-candidate',
    governanceTier: 'candidate',
    designReview: 'pending',
    promotionRequirements: [
      'Approve the opinionated intent API.',
      'Remove or time-box legacy Candidate aliases.',
      'Validate the Figma property mapping.',
      'Complete manual accessibility review.',
      'Record the final promotion decision.',
    ],
    blockers: ['Design review is pending.', 'Manual screen-reader audit is pending.'],
    warnings: ['Legacy Candidate aliases remain visible until current QA examples migrate.'],
  }),`;

const registryPattern = /  entry\(\{\n    id: 'ps-up-button',[\s\S]*?\n  \}\),\n  entry\(\{\n    id: 'ps-card'/;
if (!registry.includes("description: 'Opinionated PrimeNG facade")) {
  if (!registryPattern.test(registry)) {
    throw new Error('Unable to locate the UP Button manifest entry.');
  }
  registry = registry.replace(
    registryPattern,
    `${upButtonEntry}\n  entry({\n    id: 'ps-card'`,
  );
  await write('packages/ui-patterns/src/manifest/component-registry.ts', registry);
}

let validator = await read('scripts/build-component-manifest.mjs');
if (!validator.includes('const providerSpecificMembers = new Set')) {
  validator = replaceRequired(
    validator,
    `    if (implementation.providerModules.length > 0) {
      const missing = implementation.providerModules.filter((moduleName) => !detectedPrimeNgImports.includes(moduleName));
      if (missing.length > 0) {
        addProblem(problems, \`${identity.id}: declared provider modules were not detected: \${missing.join(', ')}\`);
      }
    }
`,
    `    if (implementation.providerModules.length > 0) {
      const missing = implementation.providerModules.filter((moduleName) => !detectedPrimeNgImports.includes(moduleName));
      if (missing.length > 0) {
        addProblem(problems, \`${identity.id}: declared provider modules were not detected: \${missing.join(', ')}\`);
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
        \`${identity.id}: provider-specific public members must be removed or declared as escape hatches: \${undeclaredProviderLeaks.join(', ')}\`,
      );
    }
`,
    'manifest provider-leak validation',
  );
}
if (!validator.includes('provider escape hatch remains public')) {
  validator = replaceRequired(
    validator,
    `    if (entry.ownership.owner === null) {
      warnings.push(\`${identity.id}: owner is not assigned.\`);
    }
`,
    `    if (entry.ownership.owner === null) {
      warnings.push(\`${identity.id}: owner is not assigned.\`);
    }
    for (const escapeHatch of implementation.providerEscapeHatches) {
      warnings.push(\`${identity.id}: provider escape hatch remains public: \${escapeHatch}.\`);
    }
`,
    'manifest escape-hatch advisory',
  );
}
await write('scripts/build-component-manifest.mjs', validator);

let e2e = await read('scripts/storybook-e2e.mjs');
if (!e2e.includes('design-system-architecture-opinionated-wrapper-contract--approved-api')) {
  e2e = replaceRequired(
    e2e,
    "    'design-system-registry-component-manifest--overview',\n",
    "    'design-system-registry-component-manifest--overview',\n    'design-system-architecture-opinionated-wrapper-contract--approved-api',\n",
    'Storybook representative story list',
  );
}
if (!e2e.includes("storyId.includes('opinionated-wrapper-contract')")) {
  e2e = replaceRequired(
    e2e,
    `    if (storyId.includes('component-manifest')) {
      await waitForStory(page.getByRole('heading', { name: 'Component Registry' }), storyId, 'the Component Registry heading');
      await waitForStory(page.getByRole('row', { name: /Paginator/ }), storyId, 'the Paginator registry row');
      await waitForStory(page.getByRole('row', { name: /Toast Service/ }), storyId, 'the Toast Service registry row');
    }
`,
    `    if (storyId.includes('component-manifest')) {
      await waitForStory(page.getByRole('heading', { name: 'Component Registry' }), storyId, 'the Component Registry heading');
      await waitForStory(page.getByRole('row', { name: /Paginator/ }), storyId, 'the Paginator registry row');
      await waitForStory(page.getByRole('row', { name: /Toast Service/ }), storyId, 'the Toast Service registry row');
    }
    if (storyId.includes('opinionated-wrapper-contract')) {
      await waitForStory(page.getByRole('heading', { name: 'Approved high-level API' }), storyId, 'the approved API heading');
      await waitForStory(page.getByText('Private provider controls'), storyId, 'the private provider controls section');
      const destructiveButton = page.getByRole('button', { name: 'Delete draft' });
      await waitForStory(destructiveButton, storyId, 'the destructive intent button');
      await destructiveButton.click();
      await waitForStory(page.getByText('Activations: 1'), storyId, 'the normalized activated output');
    }
`,
    'Storybook wrapper-contract assertion',
  );
}
await write('scripts/storybook-e2e.mjs', e2e);

let overview = await read('docs/design-system/components/up-button-candidate-overview.md');
overview = overview
  .replace(
    'It renders native Button markup, replaces separate `outlined` and `text` booleans with a single `appearance` API, applies Candidate UP-style token mappings, and directly owns hover, active, focus, disabled, and loading treatments.',
    'It now acts as an opinionated PrimeNG facade: it exposes product-facing `intent`, a single `appearance` API, provider-neutral icons, and `activated`, while translating those concepts into private PrimeNG behavior and UP-style token mappings.',
  )
  .replace('| Rendering | Wraps PrimeNG `p-button` | Renders native `<button>` markup |', '| Rendering | Wraps PrimeNG `p-button` | Wraps PrimeNG through a smaller Candidate-owned facade |')
  .replace('| Styling ownership | Uses the shared PrimeNG preset | Owns Candidate Button CSS and token mappings |', '| Styling ownership | Uses the shared PrimeNG preset | Maps Candidate Button tokens into private PrimeNG variables |')
  .replace('| Behavior | Delegates provider behavior through the wrapper | Normalizes activation and suppresses disabled or loading clicks |', '| Behavior | Delegates provider behavior through the wrapper | Normalizes PrimeNG activation to `activated` and suppresses disabled or loading actions |')
  .replace('| Accessibility | Combines PrimeNG semantics with wrapper behavior | Explicitly controls disabled, loading, focus, and `aria-busy` behavior |', '| Accessibility | Combines PrimeNG semantics with wrapper behavior | Uses PrimeNG semantics while retaining Candidate loading, focus, and activation requirements |')
  .replace('- native Button rendering;', '- an opinionated PrimeNG facade rather than a mirrored provider API;')
  .replace('the current `ps-up-button` namespace and native rendering model are public-sector Candidate decisions', 'the current `ps-up-button` namespace and opinionated wrapper contract are public-sector Candidate decisions');
await write('docs/design-system/components/up-button-candidate-overview.md', overview);

let candidate = await read('docs/design-system/components/up-button-candidate.md');
candidate = candidate.replace(
  'a more design-system-owned Button API, native rendering model, token mapping, state styling, accessibility ownership, and promotion process.',
  'a more design-system-owned Button API, opinionated PrimeNG facade, token mapping, normalized events, accessibility ownership, and promotion process.',
);
await write('docs/design-system/components/up-button-candidate.md', candidate);

let integration = await read('docs/design-system/components/up-button-candidate-integration-plan.md');
if (!integration.includes('Candidate refactored into an opinionated PrimeNG facade')) {
  integration = integration.replace(
    '- [x] Candidate is intended to appear in the QA remote for side-by-side and federated-runtime validation.',
    '- [x] Candidate is intended to appear in the QA remote for side-by-side and federated-runtime validation.\n- [x] Candidate refactored into an opinionated PrimeNG facade with preferred `intent` and `activated` APIs.',
  );
}
integration = integration
  .replace('- [ ] Decide whether destructive styling is a tone or a separate intent.', '- [x] Destructive behavior is represented as the product-facing `destructive` intent.')
  .replace('### Tone\n\n- [ ] Confirm the UP Design System tone vocabulary.\n- [x] Candidate currently implements:', '### Intent and compatibility tone\n\n- [x] Preferred Candidate intent vocabulary is `primary`, `secondary`, and `destructive`.\n- [ ] Confirm that vocabulary against the approved UP Design System source.\n- [x] The temporary compatibility `tone` alias still accepts:')
  .replace('- [x] `buttonClick` remains the normalized wrapper event.', '- [x] `activated` is the preferred normalized wrapper event and emits no provider payload.\n- [x] `buttonClick` remains a deprecated Candidate compatibility alias.');
await write('docs/design-system/components/up-button-candidate-integration-plan.md', integration);

let test = await read('apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts');
test = test.replace(
  "    await expect(button).toHaveAttribute('aria-busy', 'true');",
  "    await expect(page.locator('ps-up-button')).toHaveAttribute('aria-busy', 'true');",
);
await write('apps/qa-remote/e2e/up-button-candidate.storybook.spec.ts', test);

console.log('Remaining opinionated wrapper contract changes applied.');
