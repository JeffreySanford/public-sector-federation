# Public Sector Federation: Portfolio Walkthrough

## The five-minute version

Public Sector Federation demonstrates how a large Angular platform can combine independently deployed applications without giving up shared design, accessibility, or quality standards.

The reference architecture uses an Angular shell to discover and mount custom-element remotes. Each remote can run independently, while shared token, PrimeNG preset, and UI wrapper packages keep the integrated experience aligned.

## What to review first

1. Open the [live Storybook](https://master--6a57d5b6de2da2591d3236aa.chromatic.com/) to review component states, light and dark themes, and accessibility evidence.
2. Read the [reference architecture recommendation](./design-system/architecture/reference-architecture-recommendation.md) for the token, wrapper, and runtime decisions.
3. Review the [generated component manifest](../packages/ui-patterns/generated/component-manifest.json) to see how public APIs, providers, evidence, lifecycle, and governance status are represented as data.
4. Review the shell and remote applications under `apps/` to see the runtime federation pattern.
5. Run `pnpm verify:release` to exercise the complete repository acceptance gate.

## Architecture story

### Platform composition

- The shell loads remote definitions from `module-federation.manifest.json`.
- Services, reporting, administration, and QA applications bootstrap independently.
- Remotes register custom elements that the shell mounts at runtime.
- Light DOM allows root-level semantic CSS variables and theme state to cascade through the integrated document.

### Design-system delivery

- A DTCG-compatible source is normalized into semantic `--ps-*` tokens.
- Generated artifacts include CSS variables, JSON, TypeScript helpers, and Zeroheight-oriented exports.
- The PrimeNG preset maps the same resolved contract into provider tokens.
- Applications consume provider-neutral APIs from `@public-sector/ui-patterns` rather than importing PrimeNG directly.
- Boundary checks prevent applications and remotes from bypassing the wrapper package.

### Quality evidence

- Storybook demonstrates component variants, interaction states, responsive behavior, and theme coverage.
- Chromatic publishes visual evidence and visual-diff workflows.
- Playwright validates federation, keyboard behavior, overlays, accessibility, and documentation examples.
- The generated manifest identifies complete, partial, missing, candidate, and externally blocked evidence instead of hiding gaps.

## What the repository intentionally does not claim

This is a finished public reference implementation, not a claim that every adopting organization has approved the same token names, owners, deployment topology, or component APIs.

The following remain production-specific decisions:

- authoritative Figma or DTCG export shape;
- accountable design-system owners and stewards;
- organization-specific package names and release policies;
- legacy PrimeNG migration allowlists;
- final design and manual assistive-technology approvals;
- production hosting, monitoring, and security controls.

## Skills demonstrated

- Angular and TypeScript platform architecture
- Nx monorepo organization
- runtime module federation and Angular custom elements
- RxJS-based application integration
- design tokens and PrimeNG theming
- provider-neutral component wrapper design
- Storybook and Chromatic workflows
- Playwright E2E and accessibility testing
- governance, release evidence, and technical documentation

## Release commands

```bash
pnpm install
pnpm start:all
pnpm verify:smoke
pnpm verify:release
```

The smaller smoke check validates a running integrated platform. The full release check validates repository quality, builds, manifest drift, and E2E behavior.
