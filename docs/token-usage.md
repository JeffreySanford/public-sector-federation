# Token Usage

Application teams should use the design system in this order:

1. Prefer PrimeNG components configured by `providePublicSectorPrimeNG()`.
2. Use semantic CSS variables for local layout or feature-specific styling.
3. Request a component token only when the design need cannot be expressed with a
   semantic token.
4. Avoid direct overrides of PrimeNG internal classes.

## Angular Provider

Shell and remotes should import:

```ts
import { providePublicSectorPrimeNG } from '@public-sector/primeng-preset';
```

and include it in app-level providers.

## CSS Variables

Global styles may import token CSS:

```css
@import "@public-sector/tokens/tokens.css";
```

Use semantic variables for custom feature layout. Do not use primitive palette
variables directly in application code.

## Dark Mode

The shell controls dark mode by toggling `.p-dark` on `document.documentElement`.
Remotes should not define a different dark-mode selector.
