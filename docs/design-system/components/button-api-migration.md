# Button API Migration

## Decision

`ps-button` remains the canonical selector. The provider-neutral contract proven by
`ps-up-button` merges into that stable component; `ps-up-button` does not become a second permanent
Button.

The target public contract is:

- `intent: primary | secondary | destructive`;
- `appearance: solid | outlined | text`;
- `disabled`;
- `loading`;
- a governed icon identifier rather than a PrimeIcons class string;
- `activated: void`.

Navigation belongs to a Link or link-button presentation contract rather than the action Button.

## Compatibility window

Legacy aliases remain supported until the next major release. They must continue to work during
that window, but new consumers and examples must use the target API. Removal is allowed only in an
intentional major-version change after repository usage evidence confirms the migration path.

| Compatibility surface | Target replacement |
| --- | --- |
| `tone` | `intent` |
| `outlined` | `appearance="outlined"` |
| `text` | `appearance="text"` |
| `buttonClick: MouseEvent` | `activated: void` |
| PrimeIcons class string | Governed icon identifier |
| `routerLink` | Link or link-button contract |
| `styleClass` | Governed variants, component tokens, or an explicitly reviewed extension |

## Delivery rules

1. Keep compatibility behavior covered while the aliases remain public.
2. Use only the target API in new application code, Storybook stories, and documentation examples.
3. Inventory remaining consumers before removal.
4. Publish migration notes before the major release.
5. Remove `ps-up-button` only after its contract and evidence have been absorbed by `ps-button`.
6. Keep manual assistive-technology and Figma approval separate from API approval.

## Evidence status

The contract and compatibility window are approved. Implementation migration is planned. Existing
Button keyboard, focus, loading, disabled, and activation evidence remains applicable; manual NVDA
and Chrome review and approved Figma identity remain pending.
