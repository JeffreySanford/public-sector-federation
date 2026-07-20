# Storybook

Storybook is the live, isolated component contract for registry components and
shared UI patterns.

It should prove how a component behaves before the component is validated in a
subapplication or shell-composed runtime.

## Each Shared Component Should Show

- Default usage
- Approved variants
- Inputs and outputs
- Disabled, loading, empty, and error states where applicable
- Long content and responsive behavior
- Accessibility notes
- Token and theme behavior
- Interaction examples
- Links to source and related guidance

## Relationship To Other Tools

Storybook proves component behavior in isolation. Shell validation proves the
same component works after integration. Playwright makes the evidence
repeatable. Starlight explains when to use the component and links to the
evidence.
