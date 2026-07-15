# Developer

## Installation and import

```typescript
import { PublicUpButtonComponent } from '@public-sector/ui-patterns';
```

For a standalone Angular component:

```typescript
@Component({
  standalone: true,
  imports: [PublicUpButtonComponent],
  template: `
    <ps-up-button
      label="Submit application"
      icon="pi pi-check"
      tone="primary"
      appearance="solid"
      (buttonClick)="submitApplication()"
    />
  `,
})
export class ApplicationActionsComponent {
  submitApplication(): void {
    // Application behavior.
  }
}
```

## Public API

### Inputs

| Input | Type | Default | Purpose |
| --- | --- | --- | --- |
| `label` | `string` | `Button` | Visible action label. |
| `icon` | `string \| undefined` | `undefined` | Optional icon class for the current Candidate proof. |
| `tone` | `PublicUpButtonTone` | `primary` | Provider-neutral action tone. |
| `appearance` | `solid \| outlined \| text` | `solid` | Visual emphasis model. |
| `disabled` | `boolean` | `false` | Prevents activation. |
| `loading` | `boolean` | `false` | Shows progress, sets busy state, and prevents duplicate activation. |

### Outputs

| Output | Type | Purpose |
| --- | --- | --- |
| `buttonClick` | `MouseEvent` | Emits only while the Button is enabled and not loading. |

## Tone type

```typescript
export type PublicUpButtonTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'help'
  | 'contrast';
```

## Appearance type

```typescript
export type PublicUpButtonAppearance =
  | 'solid'
  | 'outlined'
  | 'text';
```

## Usage examples

### Primary action

```html
<ps-up-button
  label="Submit application"
  icon="pi pi-check"
  tone="primary"
/>
```

### Outlined secondary action

```html
<ps-up-button
  label="Save draft"
  icon="pi pi-save"
  tone="secondary"
  appearance="outlined"
/>
```

### Text action

```html
<ps-up-button
  label="View details"
  icon="pi pi-info-circle"
  appearance="text"
/>
```

### Loading action

```html
<ps-up-button
  label="Submitting"
  icon="pi pi-send"
  [loading]="true"
/>
```

### Disabled action

```html
<ps-up-button
  label="Unavailable action"
  icon="pi pi-lock"
  [disabled]="true"
/>
```

## Behavior

- The component renders a native `<button type="button">`.
- `loading` and `disabled` both disable the native Button.
- `loading` sets `aria-busy`.
- `buttonClick` is emitted only while the Button is enabled and not loading.
- A loading spinner replaces the icon while loading.
- Hover, active, focus-visible, disabled, and loading treatments are owned by the Candidate implementation.

## Content guidance

- Begin labels with a clear verb.
- Describe the result of the action, such as `Submit application` or `Save draft`.
- Avoid vague labels such as `Click here`, `Okay`, or `Go` when a specific action is available.
- Keep labels concise while allowing wrapping for localization and public-sector program language.
- Do not rely on an icon as the only accessible name.

## Storybook

Storybook title:

```text
Design System / Candidates / Button — UP
```

Primary comparison story ID:

```text
design-system-candidates-button-up--current-vs-candidate
```

Local Storybook command:

```bash
pnpm storybook:qa
```

Local story URL:

```text
http://localhost:4400/?path=/story/design-system-candidates-button-up--current-vs-candidate
```

Replace the local URL in Zeroheight with a stable HTTPS Storybook deployment when available. The Zeroheight page should continue to link to Storybook rather than duplicating every interactive example as static documentation.

## Source links

- [Candidate wrapper source](https://github.com/JeffreySanford/public-sector-federation/blob/master/packages/ui-patterns/src/public-up-button.component.ts)
- [Candidate Storybook stories](https://github.com/JeffreySanford/public-sector-federation/blob/master/apps/qa-remote/src/stories/up-button.stories.ts)
- [Candidate integration plan](https://github.com/JeffreySanford/public-sector-federation/blob/master/docs/design-system/components/up-button-candidate-integration-plan.md)
- [QA Candidates view checklist](https://github.com/JeffreySanford/public-sector-federation/blob/master/docs/design-system/components/up-button-candidates-view-checklist.md)

## Migration guidance

No production migration is currently approved.

If the Candidate is promoted, the preferred target is to preserve the canonical `ps-button` selector while moving approved Candidate API, token, behavior, and styling decisions into the stable implementation.

A promotion proposal must define:

- compatibility for existing `outlined` and `text` inputs;
- whether those inputs become deprecated aliases for `appearance`;
- public tone terminology;
- icon-contract migration;
- release version and deprecation window;
- application migration examples.

## Stable alternative

Continue to use `ps-button` for production work until the Candidate promotion decision is approved and released.
