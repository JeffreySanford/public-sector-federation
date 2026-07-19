from __future__ import annotations

from pathlib import Path

root = Path(__file__).resolve().parents[1]
registry_path = root / 'packages/ui-patterns/src/manifest/component-registry.ts'
registry = registry_path.read_text()

old_constants = "const buttonStories = ['apps/qa-remote/src/stories/button.stories.ts'];\nconst dialogToastStories = ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'];\nconst shellTokenEvidence = ['apps/shell/e2e/token-consumption.spec.ts'];"
new_constants = "const buttonStories = ['apps/qa-remote/src/stories/button.stories.ts'];\nconst dialogStories = ['apps/qa-remote/src/stories/dialog.stories.ts'];\nconst dialogToastStories = ['apps/qa-remote/src/stories/dialog-toast.acceptance.stories.ts'];\nconst shellTokenEvidence = ['apps/shell/e2e/token-consumption.spec.ts'];"
if old_constants in registry:
    registry = registry.replace(old_constants, new_constants)
elif "const dialogStories = ['apps/qa-remote/src/stories/dialog.stories.ts'];" not in registry:
    raise SystemExit('Unable to locate Dialog story constants in component registry.')

old_entry = """  entry({
    id: 'ps-dialog', name: 'Dialog', exportName: 'PublicDialogComponent', selector: 'ps-dialog',
    source: 'packages/ui-patterns/src/public-dialog.component.ts',
    description: 'Modal content pattern with a controlled header, body, footer, and visibility model.', provider: 'native',
    storybookStatus: 'complete', storybookTitle: 'Design System/Acceptance/Dialog and Toast',
    storybookFiles: dialogToastStories, accessibilityPattern: 'dialog',
  }),"""
new_entry = """  entry({
    id: 'ps-dialog',
    name: 'Dialog',
    exportName: 'PublicDialogComponent',
    selector: 'ps-dialog',
    source: 'packages/ui-patterns/src/public-dialog.component.ts',
    description: 'Native governed modal with labelled semantics, contained focus, dismissal, and opener restoration.',
    provider: 'native',
    knownLimitations: [
      'Background inertness, explicit body scroll lock, configurable initial focus, aria-describedby, stacked dialogs, Figma alignment, and manual assistive-technology review remain pending.',
    ],
    publicApiStatus: 'complete',
    inputs: [
      { name: 'header', type: 'string', defaultValue: "''" },
      { name: 'width', type: 'string', defaultValue: "'32rem'" },
    ],
    models: [{ name: 'visible', type: 'boolean', defaultValue: 'false' }],
    storybookStatus: 'complete',
    storybookTitle: 'Design System/Components/Dialog',
    storybookFiles: [...dialogStories, ...dialogToastStories],
    stories: [
      'design-system-components-dialog--default',
      'design-system-components-dialog--destructive-confirmation',
      'design-system-components-dialog--long-content',
      'design-system-components-dialog--focus-sequence',
    ],
    testStatus: 'complete',
    testFiles: [
      'apps/qa-remote/e2e/dialog.storybook.spec.ts',
      ...shellTokenEvidence,
    ],
    behaviors: [
      'labelled modal semantics',
      'safe initial focus',
      'forward and reverse focus containment',
      'Escape dismissal',
      'close-button and backdrop dismissal',
      'focus restoration to the opener',
      'destructive confirmation ordering',
      'long-content modal scrolling',
      'narrow-viewport reflow',
      'light and dark modal token inheritance',
    ],
    documentationStatus: 'complete',
    documentationFiles: [
      'apps/starlight/src/content/docs/components/dialog/index.mdx',
      'docs/design-system/components/catalog.md',
      'docs/design-system/architecture/registry-consumption-spec.md',
    ],
    accessibilityPattern: 'dialog',
    automatedChecks: 'complete',
    keyboardCoverage: 'complete',
    warnings: [
      'The current modal contract does not make background content inert or explicitly lock body scrolling.',
      'A dedicated semantic backdrop token is not yet recorded.',
    ],
  }),"""
if old_entry in registry:
    registry = registry.replace(old_entry, new_entry)
elif "storybookTitle: 'Design System/Components/Dialog'" not in registry:
    raise SystemExit('Unable to locate the existing ps-dialog registry entry.')

registry_path.write_text(registry)

test_path = root / 'apps/qa-remote/e2e/dialog.storybook.spec.ts'
test_source = test_path.read_text()
test_source = test_source.replace(
    "await expect(destructiveAction.locator('.p-button')).toHaveClass(/p-button-danger/);",
    "await expect(destructiveAction).toHaveClass(/p-button-danger/);",
)
test_path.write_text(test_source)
