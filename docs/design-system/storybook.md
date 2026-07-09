# Storybook

Storybook should be the interactive engineering surface for component behavior,
states, and visual regression candidates. It complements `/qa`: the QA route
proves the federated shell composition, while Storybook isolates individual
components and patterns.

## Local POC Setup

Storybook is installed for the QA remote because that route already acts as the
design-system visual contract.

Run it with:

```bash
pnpm storybook:qa
```

Build the static Storybook with:

```bash
pnpm build-storybook:qa
```

The first story lives at:

```text
apps/qa-remote/src/stories/primeng-playground.stories.ts
```

It is intentionally PrimeNG-heavy and covers actions, tags, cards, forms, table,
progress, accordion, toast, and dialog behavior.

## How We Will Use Storybook

Use Storybook for:

- Shared design-system wrappers from `packages/ui-patterns`.
- PrimeNG smoke tests before a component family is used in a remote.
- Theme matrix stories for neutral, vibrant, and pastel in light and dark.
- Accessibility states: focus, disabled, invalid, loading, empty, and error.
- Data-heavy variants such as paginated tables and filtered lists.
- Overlay states such as dialogs, menus, toasts, and confirmation flows.

## Story Categories

Recommended top-level story groups:

- Foundations
- Forms
- Navigation
- Data Display
- Feedback
- Overlays
- Layout
- Federation Smoke Tests

## PrimeNG Reintroduction Rule

Before promoting a PrimeNG component to a shared wrapper:

1. Add an isolated Storybook story.
2. Confirm it renders internal PrimeNG DOM, not just a raw host element.
3. Add or update the `/qa` route smoke test.
4. Verify it through the shell route.
5. Run `pnpm verify:fed`.

## Definition Of Done

A useful Storybook story should include:

- Default state
- Long-content state
- Disabled or read-only state when applicable
- Error or empty state when applicable
- Keyboard focus visibility
- Light and dark theme coverage
- Notes linking back to Zeroheight usage guidance

Storybook should not replace Zeroheight. It proves behavior; Zeroheight explains
policy, governance, and intended usage.

