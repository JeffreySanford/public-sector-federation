# Figma File Blueprint

Use this as the manual build sheet for the first Figma file. The goal is not to
invent new styling in Figma; it is to mirror the shipped token and component
contract in this repo so design review has the same structure as Storybook,
Zeroheight, and `/qa`.

## File Setup

- File name: `Public Sector Federation Design System`.
- File status: POC / Sprint 1.
- Primary source: `packages/tokens/src/tokens/*.json`.
- Visual checkpoint: `/qa`.
- Component proof: `pnpm storybook:qa`.
- Token export: `packages/tokens/src/zeroheight-tokens.json`.

## 00 Cover

Purpose: orient stakeholders and make the file useful without repo context.

Create these frames:

| Frame | Content | Source |
| --- | --- | --- |
| Overview | System name, POC status, date, owners, and repo link. | `README.md` |
| Runtime map | Shell and remotes with ports, routes, and owners. | `app-inventory.md` |
| Tool map | Storybook, `/qa`, Zeroheight preview, token export, and Agile workflow. | `docs/design-system/README.md` |
| Acceptance gates | `pnpm build-storybook:qa`, `pnpm verify:fed`, direct remote checks, shell checks. | `/qa` and scripts |

Include these links or placeholders:

- Storybook: `http://localhost:4400`.
- Shell: `http://localhost:4200`.
- QA route: `http://localhost:4200/qa`.
- App inventory: `docs/design-system/app-inventory.md`.
- Component matrix: `docs/design-system/component-coverage-matrix.md`.

## 01 Foundations

Purpose: define reusable visual foundations before component frames.

Create these sections:

| Section | Include | Token source |
| --- | --- | --- |
| Color roles | Surface, card, border, primary text, secondary text, action, success, warning, danger. | `themes.json` |
| Typography | Font family, text hierarchy examples, body copy, table labels, helper text. | `primitives.json` and `themes.json` |
| Spacing | `--ps-space-2`, `--ps-space-4`, `--ps-space-6` examples. | `themes.json` |
| Radius | `--ps-radius-md`, `--ps-radius-lg`, PrimeNG card/dialog radius. | `themes.json` |
| Focus | Visible focus ring examples on links, buttons, inputs, tiles. | `--p-focus-ring-*` |
| Elevation | Card, dialog, toast, and table container shadows. | `themes.json` and CSS overrides |

Acceptance notes:

- Every foundation frame should identify the token name, not only the visual
  color or size.
- Light and dark examples should sit side by side.
- Avoid adding values that do not exist in the token source JSON.

## 02 Tokens / Variables

Purpose: model Figma variables around the same modes and tiers as the generated
token artifacts.

Create variable collections:

| Collection | Modes | Examples |
| --- | --- | --- |
| Primitive | Base | Blue, slate, purple, cyan, rose, green, amber. |
| Semantic | Neutral light, neutral dark, vibrant light, vibrant dark, pastel light, pastel dark. | Surface, text, action, status, nav. |
| Component | Same six modes as semantic. | Button, card, table, paginator, dialog, toast. |
| PrimeNG Mapping | Same six modes where applicable. | `--p-button-*`, `--p-card-*`, `--p-datatable-*`, `--p-dialog-*`, `--p-toast-*`. |

Create these documentation frames:

| Frame | Content |
| --- | --- |
| Token tier model | Primitive -> semantic -> component -> PrimeNG mapping. |
| Mode matrix | Neutral, vibrant, pastel across light and dark. |
| Zeroheight export sample | Show fields from `zeroheight-tokens.json`: name, value, tier, category, usage, mode, theme. |
| Change rule | Token changes start in JSON, generate CSS/export, validate `/qa`, then publish docs. |

Acceptance notes:

- Figma variable names should stay close to CSS custom properties.
- PrimeNG mapping variables are documentation mappings, not the primary design
  language designers should use for exploration.
- Published Zeroheight values should come from generated JSON, not manual copy.

## 03 Components

Purpose: document the proven PrimeNG families first, matching Storybook and `/qa`.

Create component sections:

| Section | Frames | Source |
| --- | --- | --- |
| Button / Tag | Filled, outlined, text, disabled, icon spacing, success, warning, danger, draft. | Storybook acceptance story and `/qa` checkpoint |
| Card | Metric card, long-content card, empty-state card, route-critical fallback note. | Storybook acceptance story and `/qa` checkpoint |
| Table / Paginator | Header, body row, status tag row, filters, sort affordance, paginator, rows per page. | Reporting remote and Storybook acceptance story |
| Dialog / Toast | Modal anatomy, footer actions, toast severities, z-index/append policy notes. | Admin remote and Storybook acceptance story |

For each component section, include:

- Usage guidance: when to use it.
- Accessibility notes: labels, keyboard focus, contrast, status text.
- Federation notes: direct remote check, shell-composed check, route-critical risk.
- Storybook reference: story name and command.
- `/qa` reference: visual checkpoint section.

## Manual Build Checklist

- Create pages exactly named `00 Cover`, `01 Foundations`, `02 Tokens / Variables`, and `03 Components`.
- Add a cover link block for Storybook, `/qa`, app inventory, component matrix,
  and token export.
- Build variables from `packages/tokens/src/tokens/*.json`.
- Mirror only proven component families in Sprint 1.
- Add TODO notes for `04 Patterns` and `05 App Examples`, but do not build them
  until the current four pages are accepted.
- Before publishing screenshots to Zeroheight, run `pnpm verify:fed`.
