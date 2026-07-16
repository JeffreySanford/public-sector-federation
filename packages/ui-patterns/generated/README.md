# Generated Component Manifest

Run:

```bash
pnpm manifest:build
```

This writes `component-manifest.json` from the typed registry at
`packages/ui-patterns/src/manifest/component-registry.ts`.

Do not hand-edit the JSON artifact. Storybook reads the typed registry directly so
local and CI builds do not depend on a committed generated file. The JSON projection
exists for external consumers such as future zeroheight automation, governance
reports, and agent tooling.
