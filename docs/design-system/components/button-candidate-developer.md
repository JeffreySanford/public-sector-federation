# Developer

## Preferred usage

```typescript
import { PublicButtonCandidateComponent } from '@public-sector/ui-patterns';
```

```typescript
@Component({
  standalone: true,
  imports: [PublicButtonCandidateComponent],
  template: `
    <ps-button-candidate
      label="Submit application"
      icon="check"
      intent="primary"
      appearance="solid"
      (activated)="submitApplication()"
    />
  `,
})
export class ApplicationActionsComponent {
  submitApplication(): void {
    // Application behavior.
  }
}
```

## Preferred public API

| Member | Type | Default | Purpose |
| --- | --- | --- | --- |
| `label` | `string` | `Button` | Visible action label. |
| `icon` | `PublicButtonCandidateIcon \| undefined` | `undefined` | Provider-neutral approved icon name. |
| `intent` | `primary \| secondary \| destructive` | `primary` | Product-facing action purpose. |
| `appearance` | `solid \| outlined \| text` | `solid` | Visual emphasis model. |
| `disabled` | `boolean` | `false` | Prevents activation. |
| `loading` | `boolean` | `false` | Shows progress and prevents duplicate activation. |
| `activated` | `void` output | — | Signals that the governed action occurred. |

PrimeNG severity names, variant flags, `styleClass`, PassThrough configuration,
unstyled mode, and provider callback payloads are not public Candidate controls.

## Intent

```typescript
export type PublicButtonCandidateIntent =
  | 'primary'
  | 'secondary'
  | 'destructive';
```

Use intent to describe the role of the action, not its provider color name.

```html
<ps-button-candidate label="Save changes" icon="save" intent="primary" />
<ps-button-candidate label="Save draft" icon="save" intent="secondary" appearance="outlined" />
<ps-button-candidate label="Delete draft" icon="times-circle" intent="destructive" />
```

## Provider boundary

`ps-button-candidate` renders PrimeNG internally. The wrapper translates:

- `intent` into component-owned token mappings;
- `appearance` into the private PrimeNG variant;
- provider-neutral icon names into PrimeIcons classes;
- PrimeNG `onClick` into the `activated` output;
- loading and disabled inputs into provider behavior.

Applications continue to import only `@public-sector/ui-patterns`.

## Compatibility aliases

The Candidate temporarily retains:

| Alias | Replacement | Status |
| --- | --- | --- |
| `tone` | `intent` | Deprecated Candidate compatibility alias |
| `buttonClick` | `activated` | Deprecated Candidate compatibility alias |

Do not use the aliases in new application examples. They remain only so existing QA
and Storybook evidence can migrate without an unrelated breaking change.

## Behavior

- PrimeNG is the private rendering engine.
- `loading` and `disabled` suppress activation.
- `activated` emits no provider or browser event payload.
- The public icon vocabulary remains provider-neutral.
- Component tokens map into PrimeNG Button variables at the wrapper boundary.
- The Candidate does not expose arbitrary application styling hooks.

## Storybook

Use these Storybook areas:

```text
Design System / Experiments / Button Contract Exploration
Design System / Architecture / Opinionated Wrapper Contract
```

The architecture stories explain the API boundary. Candidate stories provide
visual, interaction, theme, and compatibility evidence.

## Promotion guidance

The stable `ps-button` remains the production component. Candidate promotion still
requires approved Figma mappings, manual accessibility review, a compatibility
plan, and a human promotion decision.

See:

- [Opinionated wrapper contract](../architecture/opinionated-wrapper-contract.md)
- [Button Contract Exploration overview](./button-candidate.md)
- [Candidate design and tokens](./button-candidate-design-tokens.md)
- [Candidate validation](./button-candidate-validation.md)
