# Zeroheight Skeleton

Use this as the first manual page structure for the real Zeroheight space. The
portal should publish stable, implemented guidance from this repo, not speculative
design ideas.

## Site Setup

- Space name: `Public Sector Federation Design System`.
- Status: POC / Sprint 1.
- Primary repo source: `docs/design-system`.
- Token source: `packages/tokens/src/tokens/*.json`.
- Token export: `packages/tokens/src/zeroheight-tokens.json`.
- Visual checkpoint: `/qa`.
- Component proof: `pnpm storybook:qa`.

## Home / Getting Started

Purpose: explain what the system is and how teams should start.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| What this is | Angular 21 Nx federation sample using PrimeNG styled mode and shared tokens. | `README.md` |
| Who it serves | Product, design, accessibility, platform, and remote app teams. | `README.md` |
| Start here | App inventory first, then component coverage, then Storybook and `/qa`. | `app-inventory.md` |
| Runtime map | Shell and remote apps, ports, routes, element names, owners. | `app-inventory.md` |
| Verification | `pnpm start:all`, `pnpm check:dev-ports`, `pnpm verify:fed`, `pnpm report:all`. | scripts |

Initial callouts:

- The app inventory is the working source for what each route owns.
- `/qa` is the visual federation checkpoint.
- Zeroheight is published only after implementation checks pass.

## Foundations

Purpose: publish token foundations and theme behavior.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| Token model | Primitive -> semantic -> component -> PrimeNG mapping. | `zeroheight-style-dictionary.md` |
| Theme modes | Neutral, vibrant, pastel across light and dark. | `themes.json` |
| Surface and text | Background, card, border, primary text, secondary text. | `zeroheight-tokens.json` |
| Actions and focus | Action text, button background, button text, focus ring. | `zeroheight-tokens.json` |
| Status colors | Success, warning, danger, toast surfaces. | `zeroheight-tokens.json` |

Publishing rules:

- Token tables should come from `zeroheight-tokens.json`.
- Do not manually type token values into the portal unless they are copied from
  the generated export.
- Include light/dark examples for each theme variant.

## Components

Purpose: document the proven PrimeNG component families and adoption guidance.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| Component status | Proven, active, experimental, risky definitions. | `component-coverage-matrix.md` |
| Button / Tag | Action hierarchy, icon spacing, disabled state, status labels. | Storybook and `/qa` |
| Card | Metric, long-content, empty-state, route-critical fallback guidance. | Storybook and `/qa` |
| Table / Paginator | Sorting, filtering, current-page report, rows per page. | Reporting remote, Storybook, `/qa` |
| Dialog / Toast | Append policy, z-index, footer actions, toast severity styling. | Admin remote, Storybook, `/qa` |

Each component page should include:

- Usage guidance.
- Do / do not examples.
- Accessibility notes.
- Federation notes.
- Storybook reference.
- `/qa` verification reference.
- Current status from the coverage matrix.

## Patterns

Purpose: explain cross-component workflows that feature teams actually build.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| Service intake | Form labels, helper text, eligibility evidence, action hierarchy. | Services remote |
| Reporting workflow | Metric cards, table filters, status language, report notes. | Reporting remote |
| Admin workflow | Settings, password handling, dialog confirmation, toast feedback. | Admin remote |
| Empty states | No results, no reviews, and no contrast issues examples. | `/qa` and Storybook |
| Overlay pattern | Dialogs and overlay-triggering controls in shell-composed remotes. | Admin remote and `/qa` |

Publishing rules:

- Patterns should point to live app routes, not only component screenshots.
- Use native/token-styled fallback guidance where PrimeNG hosts are still risky.
- Include validation commands when a pattern has federation risk.

## Developer Guide

Purpose: give engineers the operational contract for consuming and changing the
design system.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| Install and run | `pnpm install`, `pnpm start:all`, ports, health checks. | `README.md` and scripts |
| PrimeNG bootstrap | Every shell/remote app calls `providePublicSectorPrimeNG()`. | `federation-primeng.md` |
| Token workflow | Edit JSON source, run `pnpm build:tokens`, inspect generated CSS/export. | `packages/tokens` |
| Storybook workflow | Build acceptance stories before promoting component families. | `storybook.md` |
| Verification workflow | Run `pnpm verify:fed` before and after token/federation changes. | scripts |
| Platform reporting | Start Docker-backed API/DB, capture screenshots, and export progress reports. | `platform-reporting.md` |

Initial code references:

- `packages/tokens/src/tokens/themes.json`
- `packages/tokens/src/tokens.css`
- `packages/tokens/src/zeroheight-tokens.json`
- `packages/primeng-preset`
- `module-federation.manifest.json`
- `apps/qa-remote`

## Governance

Purpose: define how changes become published guidance.

Recommended blocks:

| Block | Content | Source |
| --- | --- | --- |
| Contribution flow | Figma proposal, token update, Storybook proof, `/qa` validation, Zeroheight publish. | `zeroheight.md` |
| Release readiness | Build, typecheck, Storybook build, federation verification. | scripts |
| Component promotion | Move from risky to active/proven using direct and shell checks. | `component-coverage-matrix.md` |
| Sprint plan | Sprint scope, LOE, blockers, owners, done criteria. | `agile-workflow.md` |
| Executive evidence | Markdown, HTML, JSON, and Playwright screenshot exports. | `platform-reporting.md` |
| Known blockers | Blank hosts, overlay clipping, manual token source, form reintroduction. | `component-coverage-matrix.md` |

Governance rules:

- Zeroheight documents shipped behavior.
- New token values start in JSON source and are generated outward.
- Component pages update only after Storybook and `/qa` are updated.
- A PrimeNG component cannot become a shared wrapper until direct remote and
  shell-composed checks pass.

## Manual Build Checklist

- Create top-level pages exactly named:
  - `Home / Getting Started`
  - `Foundations`
  - `Components`
  - `Patterns`
  - `Developer Guide`
  - `Governance`
- Add source links back to repo docs and live local routes.
- Import or reference `zeroheight-tokens.json` for token tables.
- Embed or link Storybook acceptance stories for proven PrimeNG families.
- Add `/qa` screenshots only after `pnpm verify:fed` passes.
