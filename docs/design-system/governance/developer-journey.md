# Developer Journey: External Team Perspective

## Purpose

Governance should feel like a clear paved road to external product-team developers,
not a committee process or approval bottleneck.

This document describes what the design-system governance model looks like to a
developer from an external team trying to build a new view using approved
patterns. It is the practical experience of the InnerSource and governance model
from the consumer's perspective.

## The Developer's Experience: Eight Steps

### 1. Start in Zeroheight

The developer goes to Zeroheight to answer:

- Which page-layout pattern is approved?
- Which header, card, form, table, status, and navigation patterns should I use?
- Which variants are allowed?
- What accessibility rules apply?
- What package and version should I install?
- Where are the Storybook examples?
- Is the pattern Active, Candidate, or Experimental?

For a new Rates Sheet view, they might find:

```
✅ Page layout: Active
✅ Page header: Active
✅ Filter panel: Active
✅ Data table pattern: Active
✅ Status chip: Active
✅ Empty state: Active
```

Zeroheight is the starting point for discovery, but not the code source. The
Zeroheight page should link directly to:

- Storybook story with working examples
- Figma design reference
- Source repository and current version
- Known issues or deprecation status
- Accessibility guidance
- Link to contribute or request changes

### 2. Install the Approved Packages

The developer installs the design-system artifacts from the repository:

```bash
pnpm add @public-sector/tokens @public-sector/primeng-preset @public-sector/ui-patterns
```

The application registers the shared PrimeNG configuration:

```typescript
import { providePrimeNG } from 'primeng/config';
import { publicSectorPrimePreset } from '@public-sector/primeng-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: publicSectorPrimePreset,
      },
    }),
  ],
};
```

The application also loads the approved token CSS:

```typescript
@use '@public-sector/tokens/css';
```

At this point, the developer has:

- ✅ Approved component wrappers
- ✅ Shared token CSS variables
- ✅ PrimeNG preset configured
- ✅ Accessibility defaults enabled

### 3. Copy the Nearest Storybook Example

The developer should not invent the view from scratch.

They navigate to the Storybook story linked from Zeroheight and copy a proven
composition as a starting template:

```typescript
<public-page-layout>
  <public-page-header
    [title]="'Rates Sheet'"
    [description]="'Review current rates and pricing options'"
  />

  <public-filter-panel
    [fields]="filters()"
    (submitted)="onFiltersApplied($event)"
  />

  <public-data-table
    [rows]="rates()"
    [columns]="columns()"
    [loading]="loading()"
    emptyMessage="No rates match the selected filters"
  />
</public-page-layout>
```

The Storybook story shows:

- Supported component states (loading, empty, error, success)
- Responsive behavior on mobile/tablet/desktop
- Keyboard navigation working end-to-end
- Accessibility labels and ARIA attributes
- Theme switching (light/dark mode)
- Example data shapes

### 4. Own Domain Content, Not Redesigns

The distinction of responsibility should be crystal clear:

**Product Team Owns:**

- Page title and business copy
- Route and workflow definition
- API calls and data fetching
- Domain models and business logic
- Permissions and authorization
- Loading and error states
- Domain-specific actions and validations
- Interaction sequencing

**Design System Owns:**

- Spacing and layout rhythm
- Typography hierarchy
- Component states and variants
- Keyboard behavior and shortcuts
- Focus treatment and indicators
- Responsive grid and breakpoints
- Approved color and contrast
- Accessibility rules and compliance
- PrimeNG preset and theming

The operating principle:

```
Design system supplies the structure, rules, and guardrails.
Product team supplies the business meaning, data, and behavior.
```

This separation keeps the view consistent without forcing it into a generic
mold.

### 5. Validate Locally

Before opening a contribution or product PR, the developer runs prescribed checks:

```bash
# Lint code
pnpm lint

# Run unit tests
pnpm test

# Validate components in Storybook
pnpm storybook:test

# Run E2E tests
pnpm e2e
```

For a shell-mounted subapplication, they also validate the view through the
integration surface:

```bash
# Direct subapp
http://localhost:4201/rates-sheet

# Shell-mounted (if configured)
http://localhost:4200/application/rates-sheet

# Run shell and subapp E2E together
pnpm e2e:federation
```

Before shipping, they confirm:

- ✅ Tokens resolve correctly (CSS variables present)
- ✅ PrimeNG overlays are themed (dropdowns, modals, tooltips)
- ✅ Keyboard navigation works (Tab, Enter, Arrow keys)
- ✅ Responsive layout works (mobile, tablet, desktop)
- ✅ Remote loading does not break the view (if shell-mounted)
- ✅ No local CSS overrides conflict with approved patterns
- ✅ No console errors during normal workflows

### 6. Decide Whether Anything Is Missing

Most views should be built entirely from approved components and patterns.

When the developer encounters a gap, there are three paths:

#### Path A: Compose from Existing Primitives

The existing components can be combined to solve the problem locally:

```
Page header + card + form + table + empty state
```

No design-system change required. The product team owns the composition.

Example: A custom "Loan Dashboard" that uses page header, cards, tables, and
status chips. This is product-team composition, not a new shared component.

#### Path B: Domain-Specific Feature

Keep the feature in the product application using shared primitives:

```
Capital Markets Risk Assessment Panel
  (uses table + form + status chip + accordion)
```

It may consume and compose shared primitives without becoming a shared
component itself.

Example: A loan-underwriting-specific feature that is unlikely to be reused
across domains. It uses approved components but is not promoted as shared.

#### Path C: Genuine Reusable Gap

Submit a contribution proposal to the design system:

```
Problem:
Four applications need the same table bulk-action pattern.
Current implementations are inconsistent.
Two have keyboard-navigation defects.
Developers keep rebuilding this locally.

Evidence:
- Three separate implementations in Rates Sheet, Pipeline, Committed Loans
- 12+ defects filed on similar patterns
- Design team confirmed this pattern is common
- User research shows bulk actions are frequent workflows

Expected consumers:
- Rates Sheet team
- Loan Pipeline team
- Committed Loans team
- (at least 3 teams to justify shared investment)

Proposed owner:
Capital Markets UI team

Proposed scope:
New `<public-bulk-actions>` component wrapping PrimeNG toolbar
with icon pattern, keyboard shortcuts, and accessibility
validation
```

Submit this proposal as an issue or through the contribution portal.

### 7. Receive a Predictable Review

The developer should know in advance:

- **Who reviews?** Named maintainers and decision owners
- **What evidence is required?** Links to Zeroheight and component-promotion.md
- **Expected turnaround?** Published SLA (e.g., 5 business days for Minor, 10 for Major)
- **What is the decision?** One of five outcomes (see below)
- **Exception path?** Link to exception-handling process
- **Result ownership?** Who maintains this after approval?

The response should not simply be "approved" or "rejected." It should guide the
team toward the right implementation path:

| Decision | Response | Next Step |
| --- | --- | --- |
| **Reuse** | Use existing component X instead | Link to Zeroheight page, Storybook example, documentation |
| **Extend** | Propose an additive variant of existing Y | Minor change approval, extend Storybook, update docs |
| **Create** | This should become a shared component | Route to InnerSource contribution process with timeline |
| **Keep Local** | This is domain-specific; implement in your application | Provide pattern recommendations but no shared promotion |
| **Research** | This needs more evidence; revisit in 6 months | Document the gap for future roadmap discussion |

### 8. Ship Using an Approved Version

Once the view passes application and integration validation, the product team
releases it on its own schedule using approved package versions.

The product team does not need to wait for design-system approval unless they
are contributing a new shared pattern.

If they contributed a new shared pattern, that pattern follows its own lifecycle:

```
Experimental (in development)
  ↓ (evidence gates pass)
Candidate (ready for review)
  ↓ (promotion decision approved)
Active (supported, published, discoverable)
```

Zeroheight is updated only after the shared capability is promoted to Active.

---

## What the Developer Journey Should Feel Like

### Happy Path: Using Approved Patterns (90% of work)

```
Find approved pattern in Zeroheight
  ↓
Copy Storybook example
  ↓
Add business data and behavior
  ↓
Run automated checks (lint, test, e2e)
  ↓
Validate in shell integration
  ↓
Ship on product team's schedule
```

**Time investment**: 2-4 hours
**Approval required**: None (already approved)
**Governance feels**: Invisible, enabling

### Contribution Path: Extending the System (10% of work)

```
Identify reusable gap
  ↓
Gather evidence (existing implementations, team feedback, usage data)
  ↓
Submit contribution proposal
  ↓
Collaborate with maintainers (design, UX, accessibility, platform)
  ↓
Implement with Storybook validation
  ↓
Platform validation (shell, remotes, Playwright)
  ↓
Promotion decision review
  ↓
Zeroheight publication
  ↓
Enterprise adoption
```

**Time investment**: 2-4 weeks
**Approval required**: Design, engineering, accessibility maintainers
**Governance feels**: Structured, collaborative, standards-aligned

---

## Key Success Measures

### For the Developer

- ✅ I found what I need in Zeroheight in < 5 minutes
- ✅ I can copy a working Storybook example without modification
- ✅ My view works without overriding approved CSS
- ✅ My keyboard navigation works out of the box
- ✅ I did not need to request an exception
- ✅ My PR review focused on my business logic, not design-system compliance

### For the Design System

- ✅ > 80% of views are built from approved patterns
- ✅ Contribution proposals are submitted regularly (1-2 per quarter)
- ✅ Average review turnaround < 5 business days
- ✅ > 90% of requests resolved through reuse or extension
- ✅ Defect rate on shared patterns < 0.5 bugs/month
- ✅ Zero accessibility compliance failures

---

## Enabling This Experience

For the developer journey to feel seamless, the design system must provide:

### Discovery

- Searchable, current Zeroheight documentation
- Clear guidance on when to use each pattern
- Links to Storybook examples and Figma reference
- Lifecycle status visible upfront (Active vs. Experimental)
- Known issues and deprecation notices

### Code

- Copyable Storybook examples with working component compositions
- Stable Angular packages with semantic versioning
- TypeScript types for component APIs
- Automated linting and validation rules
- Example data shapes for common patterns

### Support

- Named maintainers for each component or pattern
- Published review SLAs (maximum wait time)
- Contribution templates (for proposals and code)
- Office hours or async support channel
- Documented exception and escalation paths

### Validation

- Automated checks (lint, test, accessibility)
- Storybook snapshot and interaction testing
- Shell and remote integration testing
- Theme and token validation
- Performance regression detection

---

## Anti-Patterns That Break the Experience

### Broken discovery

- ❌ Zeroheight is out of sync with actual implementation
- ❌ Developers cannot find approved patterns easily
- ❌ Status is unclear (Active? Experimental? Deprecated?)
- ❌ No Storybook link or broken link

**Impact**: Teams implement their own components instead of reusing

### Broken code

- ❌ Storybook examples require modification to work
- ❌ Components have undocumented breaking changes
- ❌ Package versions are unstable or frequently breaking
- ❌ No TypeScript types

**Impact**: Teams fork components locally instead of upgrading

### Broken support

- ❌ No named maintainer or unclear ownership
- ❌ Contribution requests wait > 2 weeks with no feedback
- ❌ Exception process is opaque or undefined
- ❌ No help for teams following the governed path

**Impact**: Teams bypass the process and create workarounds

### Broken validation

- ❌ No automated linting (teams make mistakes uncaught)
- ❌ No shell integration testing (regressions slip through)
- ❌ No accessibility validation (compliance gaps not detected)
- ❌ No performance tracking (regressions accumulate)

**Impact**: Shared components degrade over time; teams lose confidence

---

## The Core Principle

**Following the governed path must be easier than creating a local fork.**

When this principle is upheld, governance is mostly invisible during normal
development. It becomes visible only when the team needs to change or extend
the shared system.

The developer should never think "Ugh, governance is slowing me down." Instead,
they should think "Oh, this example is perfect, I can copy it directly."

When that happens, the governance model is working.
