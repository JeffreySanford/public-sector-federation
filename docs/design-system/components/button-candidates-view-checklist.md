# Experiments View — UP Button Comparison Checklist

## Relationship to the main candidate plan

This document is the UI implementation companion to:

- [`button-candidate-integration-plan.md`](./button-candidate-integration-plan.md)

The main plan owns the full UP Button candidate workflow: token discovery, wrapper design, Figma, Storybook, testing, Zeroheight, governance, and promotion.

This document focuses specifically on the requested **Experiments** view in the Component Lab.

## Confirmed direction

- [X] Add a third top-level QA view named **Experiments**.
- [X] Place the **Experiments** button to the right of **Performance Tracking**.
- [X] Follow the existing QA view-switching pattern rather than adding a separate Angular route during the first implementation.
- [X] Keep **QA Components** as the default view.
- [X] Keep **Performance Tracking** unchanged.
- [X] Use the new **Experiments** view as the review surface for experimental design-system components.
- [X] Use the UP Button candidate as the first component displayed in this view.
- [X] Show the current stable `ps-button` and the new `ps-up-button` candidate together.
- [X] Do not replace the existing `ps-button` as part of creating this view.
- [X] Integrate Storybook through a live embedded story when framing is available, with a normal external link as the required fallback.
- [X] Add Zeroheight links when a stable Button candidate page URL is available.
- [X] Do not make the Component Lab depend on Zeroheight being online.

## Current QA navigation pattern

The current Component Lab begins with two view buttons:

```html
<div class="qa-view-tabs">
  <ps-button
    label="QA Components"
    [styleClass]="activeTab() === 'qa' ? 'view-tab active' : 'view-tab'"
    (buttonClick)="setActiveTab('qa')"
  />
  <ps-button
    label="Performance Tracking"
    [styleClass]="activeTab() === 'performance' ? 'view-tab active' : 'view-tab'"
    (buttonClick)="setActiveTab('performance')"
  />
</div>
```

The component currently uses:

```ts
activeTab = signal<'qa' | 'performance'>('qa');
```

The first implementation should extend this exact pattern.

## Navigation implementation

### Template

- [ ] Add the **Experiments** Button immediately after **Performance Tracking**.
- [ ] Keep it inside `.qa-view-tabs`.
- [ ] Use the current stable `ps-button` for the navigation control.
- [ ] Do not use `ps-up-button` as the navigation tab itself; the candidate must not control access to its own review page.
- [ ] Use the existing `view-tab` and `active` classes.
- [ ] Set the active view to `candidates` when clicked.

Recommended markup:

```html
<div class="qa-view-tabs">
  <ps-button
    label="QA Components"
    [styleClass]="activeTab() === 'qa' ? 'view-tab active' : 'view-tab'"
    (buttonClick)="setActiveTab('qa')"
  />

  <ps-button
    label="Performance Tracking"
    [styleClass]="activeTab() === 'performance' ? 'view-tab active' : 'view-tab'"
    (buttonClick)="setActiveTab('performance')"
  />

  <ps-button
    label="Experiments"
    icon="pi pi-flask"
    [styleClass]="activeTab() === 'candidates' ? 'view-tab active' : 'view-tab'"
    (buttonClick)="setActiveTab('candidates')"
  />
</div>
```

### Component state

- [ ] Expand the active-tab union to include `candidates`.
- [ ] Update the `setActiveTab` method type to include `candidates`.
- [ ] Keep `qa` as the initial value.
- [ ] Confirm no exhaustive switch or conditional elsewhere assumes only two views.

Recommended state:

```ts
type QaView = 'qa' | 'performance' | 'candidates';

activeTab = signal<QaView>('qa');

setActiveTab(tab: QaView): void {
  this.activeTab.set(tab);
}
```

### View container

- [ ] Add a new view container after the QA Components container and before or after the Performance Tracking container, following the existing file organization.
- [ ] Render it only when `activeTab() === 'candidates'`.
- [ ] Prefer extracting the Candidate content into a dedicated component instead of adding hundreds of additional lines to `qa-remote.component.html`.

Recommended host markup:

```html
<ng-container *ngIf="activeTab() === 'candidates'">
  <public-candidates-view />
</ng-container>
```

## Recommended file structure

- [ ] Create a dedicated Candidates feature folder.
- [ ] Keep the view reusable and independently testable.
- [ ] Import both the current and candidate Button wrappers only inside the comparison feature.

Recommended structure:

```text
apps/qa-remote/src/app/components/candidates/
├── candidates-view.component.ts
├── candidates-view.component.html
├── candidates-view.component.css
├── candidates-view.component.spec.ts
└── candidate-links.ts
```

Alternative acceptable structure:

```text
apps/qa-remote/src/app/candidates/
├── candidates-view.component.ts
├── candidates-view.component.html
├── candidates-view.component.css
└── candidates-view.component.spec.ts
```

- [ ] Choose one folder convention that matches the current Component Lab organization.
- [ ] Do not create both structures.

## Experiments view purpose

The Experiments view is a controlled review surface for components that have not yet been promoted into the stable public-sector design system.

It should answer these questions immediately:

- What is the current stable component?
- What is the proposed candidate?
- What source design system influenced the candidate?
- Which tokens are verified and which are still assumptions?
- How do the current and candidate components behave under identical inputs?
- Where are the Storybook stories?
- Where is the Figma design?
- Where is the Zeroheight guidance?
- Where are the source, tests, and validation results?
- What remains before promotion?

## Experiments view header

- [ ] Add a page tag such as `Component Lab Candidate Review`.
- [ ] Use the heading `Component Experiments`.
- [ ] Explain that this is an experimental review area and not the stable component catalog.
- [ ] Explain that the stable component remains available until a candidate is approved.
- [ ] Display a visible Candidate lifecycle badge.
- [ ] Include a short warning that sanitized UP references must not be treated as verified enterprise values.

Recommended content:

```html
<header class="qa-header candidates-header">
  <span class="qa-tag">Component Lab Candidate Review</span>
  <h2>Component Experiments</h2>
  <p>
    Compare stable public-sector wrappers with experimental candidates before
    design, token, accessibility, Storybook, and federation approval.
  </p>
</header>
```

## First candidate tile: UP Button

- [ ] Create a full-width candidate tile for `UP Button Candidate`.
- [ ] Show lifecycle status as `Candidate`.
- [ ] Show source influence as `UP Design System`.
- [ ] Show current stable selector as `ps-button`.
- [ ] Show candidate selector as `ps-up-button`.
- [ ] State clearly that this proof is Button-only and is not a migration of the entire design system.
- [ ] Show the token status as `Sanitized/sample mappings pending verification` until the actual UP Button source is reviewed.

Recommended header layout:

```text
UP Button Candidate                                      Candidate
Button-only proof based on UP Design System references
Current: ps-button                 Candidate: ps-up-button
```

## Stable-versus-candidate comparison

### Required layout

- [ ] Use a two-column comparison grid on desktop.
- [ ] Stack the two columns on narrow screens.
- [ ] Place **Current / Stable** on the left.
- [ ] Place **UP Candidate** on the right.
- [ ] Use identical labels, states, and intent in each comparison row.
- [ ] Never compare different labels or states in the same row.

Recommended layout:

```text
┌────────────────────────────────────────────────────────────────────┐
│ UP Button Candidate                                      Candidate │
├───────────────────────────────┬────────────────────────────────────┤
│ Current / Stable              │ UP Candidate                       │
│ <ps-button>                   │ <ps-up-button>                     │
│ Existing token contract       │ UP Button candidate token mapping │
├───────────────────────────────┼────────────────────────────────────┤
│ Primary action                │ Primary action                     │
│ Outlined action               │ Outlined action                    │
│ Text action                   │ Text action                        │
│ Disabled action               │ Disabled action                    │
│ Loading action                │ Loading action                     │
│ Leading icon                  │ Leading icon                       │
│ Long label                    │ Long label                         │
└───────────────────────────────┴────────────────────────────────────┘
```

### Required comparison rows

- [ ] Primary/default Button.
- [ ] Secondary Button.
- [ ] Outlined Button.
- [ ] Text Button.
- [ ] Disabled Button.
- [ ] Loading Button.
- [ ] Leading-icon Button.
- [ ] Icon-only Button with an accessible label.
- [ ] Long-label Button.
- [ ] Full-width Button, if the candidate supports it.
- [ ] Danger/error Button after terminology is approved.
- [ ] Warning Button after terminology is approved.
- [ ] Small, medium, and large sizes after the candidate size API is approved.

### Example comparison

```html
<section class="candidate-comparison-row">
  <div class="candidate-example candidate-example--stable">
    <span class="candidate-example__label">Current / Stable</span>
    <code>&lt;ps-button&gt;</code>
    <ps-button
      label="Save changes"
      tone="primary"
      (buttonClick)="recordStableClick()"
    />
  </div>

  <div class="candidate-example candidate-example--proposed">
    <span class="candidate-example__label">UP Candidate</span>
    <code>&lt;ps-up-button&gt;</code>
    <ps-up-button
      label="Save changes"
      tone="primary"
      appearance="solid"
      (buttonClick)="recordCandidateClick()"
    />
  </div>
</section>
```

- [ ] Adjust property names to the final candidate API.
- [ ] Do not pretend the candidate supports an input until the component actually implements it.

## Shared comparison controls

A useful enhancement is a small control bar that applies the same review state to both components.

- [ ] Add a label input or predefined label choices.
- [ ] Add an appearance choice.
- [ ] Add a tone choice.
- [ ] Add a size choice when size support exists.
- [ ] Add disabled toggle.
- [ ] Add loading toggle.
- [ ] Add icon toggle.
- [ ] Add long-label toggle.
- [ ] Apply equivalent inputs to both stable and candidate Buttons.
- [ ] When the stable Button lacks an equivalent API, label the comparison as `Not supported by current API` rather than silently approximating it.

## Theme and mode comparison

The Component Lab already supports neutral, vibrant, pastel, light, and dark review.

- [ ] Confirm both Buttons respond to the active global theme.
- [ ] Compare neutral light.
- [ ] Compare neutral dark.
- [ ] Compare vibrant light.
- [ ] Compare vibrant dark.
- [ ] Compare pastel light.
- [ ] Compare pastel dark.
- [ ] Show the active theme and mode inside the candidate tile.
- [ ] Add a warning if the candidate uses locally scoped UP values that intentionally do not follow a public-sector theme.
- [ ] Document whether UP values are fixed, mode-based, or mapped into the current theme structure.

## Storybook integration

### Required behavior

- [ ] Add an `Open Candidate in Storybook` link.
- [ ] Add an `Open Current Button Acceptance Story` link.
- [ ] Add an `Open All Candidate Stories` link when a dedicated Storybook group exists.
- [ ] Use stable deployed Storybook URLs for shared review.
- [ ] Use localhost URLs only as a development fallback.
- [ ] Open external documentation links in a new browser tab.
- [ ] Add `rel="noopener noreferrer"` to external links.

### Story URLs

Do not guess permanent story IDs. Confirm them from the generated Storybook `index.json` after the stories build.

- [ ] Record the current Button acceptance story ID.
- [ ] Record the candidate primary story ID.
- [ ] Record the candidate matrix story ID.
- [ ] Store the base Storybook URL in environment or configuration rather than scattering it through the template.
- [ ] Build iframe URLs from the confirmed story IDs.

Recommended configuration shape:

```ts
export interface CandidateDocumentationLinks {
  storybookBaseUrl: string;
  stableButtonStoryId: string;
  candidateButtonStoryId: string;
  candidateButtonMatrixStoryId?: string;
  zeroheightButtonUrl?: string;
  figmaButtonUrl?: string;
  sourceUrl: string;
  tokenPlanUrl: string;
}
```

### Embedded Storybook panel

- [ ] Attempt to embed the candidate story only when the deployed Storybook host allows iframe embedding.
- [ ] Use Storybook's single-story iframe URL.
- [ ] Give the iframe an explicit title.
- [ ] Use a responsive container with a sensible minimum height.
- [ ] Lazy-load the iframe.
- [ ] Show an external-link fallback even when embedding succeeds.
- [ ] Do not block the Experiments view when Storybook is unavailable.
- [ ] Show an unavailable/configuration message instead of a broken blank frame.

Recommended iframe shape:

```html
<iframe
  *ngIf="candidateStoryUrl; else storybookUnavailable"
  class="candidate-story-frame"
  [src]="candidateStoryUrl"
  title="UP Button candidate Storybook story"
  loading="lazy"
></iframe>

<ng-template #storybookUnavailable>
  <p class="candidate-link-status">
    A deployed Storybook URL has not been configured. Run Storybook locally or
    use the source and test links below.
  </p>
</ng-template>
```

- [ ] Sanitize or construct iframe URLs using an approved Angular approach.
- [ ] Do not bypass Angular security with arbitrary user-provided URLs.

### Suggested local development URL

```text
http://localhost:4400/iframe.html?id=<confirmed-candidate-story-id>&viewMode=story&shortcuts=false&singleStory=true
```

- [ ] Replace `<confirmed-candidate-story-id>` after inspecting the generated Storybook index.
- [ ] Do not commit a guessed ID as final evidence.

## Zeroheight integration

### Required behavior

- [ ] Add an `Open Button Candidate in Zeroheight` link when the component page exists.
- [ ] Add an `Open Design System Portal` link as a temporary fallback when only the Zeroheight root URL is known.
- [ ] Keep the link optional in configuration.
- [ ] Hide or disable the component-page link when no stable URL exists.
- [ ] Label the link `Planned` rather than presenting a nonexistent page as published.
- [ ] Do not embed Zeroheight unless its security policy explicitly allows framing.
- [ ] Do not make the view fail when Zeroheight is unavailable.

### Recommended display states

- [ ] `Published` — a stable Button candidate page URL exists.
- [ ] `Portal only` — the Zeroheight site exists but the Button page link is not finalized.
- [ ] `Planned` — the candidate page has not yet been created.
- [ ] `Unavailable` — configuration is intentionally absent.

### Zeroheight content expected for this candidate

- [ ] Candidate lifecycle status.
- [ ] Stable-versus-candidate relationship.
- [ ] Button-only scope statement.
- [ ] Usage and anti-pattern guidance.
- [ ] Public wrapper API.
- [ ] UP Button token-source qualification.
- [ ] Figma link.
- [ ] Storybook link or embed.
- [ ] GitHub source link.
- [ ] Experiments view link.
- [ ] Test and accessibility evidence.
- [ ] Promotion checklist.

## Figma integration

- [ ] Add an `Open UP Button design in Figma` link when a stable component URL is available.
- [ ] Keep the link optional until access and URL are confirmed.
- [ ] Display `Figma source pending verification` while only sanitized notes are available.
- [ ] Do not claim pixel parity until the real Button component and tokens are reviewed.

## Source and evidence links

The candidate tile should have a compact evidence toolbar.

- [ ] Candidate component source.
- [ ] Stable Button source.
- [ ] Candidate Storybook stories.
- [ ] Current Button acceptance story.
- [ ] Candidate token mapping plan.
- [ ] Main candidate integration plan.
- [ ] Figma Button component.
- [ ] Zeroheight Button candidate page.
- [ ] CI/test run.
- [ ] Accessibility report.

Recommended UI:

```text
Storybook | Zeroheight | Figma | Candidate source | Stable source | Token plan | Tests
```

- [ ] Use actual anchors for navigation rather than clickable `div` elements.
- [ ] Give every link a clear accessible name.
- [ ] Mark external links visually when helpful.

## Candidate status panel

- [ ] Show lifecycle status: Candidate.
- [ ] Show design-source status.
- [ ] Show token-verification status.
- [ ] Show Storybook build status.
- [ ] Show interaction-test status.
- [ ] Show accessibility status.
- [ ] Show QA direct-remote status.
- [ ] Show shell-mounted status.
- [ ] Show Zeroheight publication status.
- [ ] Show promotion decision status.

Recommended initial values:

| Gate | Initial status |
| --- | --- |
| Wrapper implementation | Local work reported; verify after commit. |
| UP source tokens | Sanitized/sample only; enterprise Button source pending. |
| Storybook stories | Basic candidate stories reported locally. |
| Storybook build | Reported green locally. |
| Static Storybook E2E | Final result pending in supplied work log. |
| Accessibility | Candidate-specific strict gate pending. |
| QA direct remote | Candidate reported locally; verify after commit. |
| Shell mounted | Pending. |
| Zeroheight candidate page | Planned unless a stable URL is supplied. |
| Promotion | Not eligible; remains Candidate. |

## User interaction evidence

- [ ] Show stable click count or last-click message.
- [ ] Show candidate click count or last-click message.
- [ ] Confirm each Button triggers only its own normalized event.
- [ ] Confirm disabled Buttons do not increment counts.
- [ ] Confirm loading Buttons do not trigger duplicate actions.
- [ ] Include keyboard interaction in tests rather than relying only on mouse clicks.

## Styling checklist

- [ ] Extend `.qa-view-tabs` only if necessary to fit the third Button.
- [ ] Preserve wrapping on narrow screens.
- [ ] Keep the Candidates Button on the right of Performance Tracking in normal left-to-right layout.
- [ ] Add `.candidates-view` root styling.
- [ ] Add `.candidate-tile` styling.
- [ ] Add `.candidate-comparison-grid` styling.
- [ ] Add `.candidate-example` styling.
- [ ] Add stable and candidate labels without relying only on color.
- [ ] Add responsive stacking.
- [ ] Add iframe container styling.
- [ ] Add visible keyboard focus for evidence links and controls.
- [ ] Confirm light and dark contrast.
- [ ] Avoid hard-coded UP visual values in the QA page CSS; consume candidate tokens through the wrapper.

## Accessibility checklist

### Navigation

- [ ] All three top-level view buttons are keyboard reachable.
- [ ] The selected view is visually obvious.
- [ ] Selected state is exposed programmatically where the wrapper allows it.
- [ ] Focus remains visible in every theme.
- [ ] Changing views does not unexpectedly move focus.
- [ ] The Experiments heading is available immediately after activation.

### Comparison content

- [ ] Stable and candidate columns have headings.
- [ ] Comparison rows have understandable labels.
- [ ] Icon-only examples have accessible names.
- [ ] Status is not conveyed only through color.
- [ ] Storybook iframe has a useful title.
- [ ] External links have descriptive text.
- [ ] Loading and disabled examples expose appropriate semantics.
- [ ] Long labels remain readable at zoom.

## Unit test checklist

### Component Lab navigation

- [ ] Default active view is `qa`.
- [ ] Clicking QA Components activates `qa`.
- [ ] Clicking Performance Tracking activates `performance`.
- [ ] Clicking Candidates activates `candidates`.
- [ ] Only the selected view content is rendered.
- [ ] Existing QA and performance behavior remains unchanged.

### Candidates component

- [ ] Stable and candidate Buttons render.
- [ ] Stable selector evidence is displayed.
- [ ] Candidate selector evidence is displayed.
- [ ] Candidate lifecycle badge is displayed.
- [ ] Stable click event is handled.
- [ ] Candidate click event is handled.
- [ ] Optional Storybook links render when configured.
- [ ] Storybook unavailable state renders when not configured.
- [ ] Optional Zeroheight link renders when configured.
- [ ] Zeroheight planned/unavailable state renders when not configured.
- [ ] Optional Figma link behaves the same way.

## Playwright/E2E checklist

### Direct Component Lab

- [ ] Open the Component Lab.
- [ ] Confirm the top buttons appear in this order:
  1. [ ] QA Components
  2. [ ] Performance Tracking
  3. [ ] Experiments
- [ ] Activate Experiments.
- [ ] Verify `Component Experiments` heading.
- [ ] Verify current `ps-button` example.
- [ ] Verify candidate `ps-up-button` example.
- [ ] Trigger stable Button and verify evidence.
- [ ] Trigger candidate Button and verify evidence.
- [ ] Verify disabled behavior.
- [ ] Verify Storybook external link.
- [ ] Verify Zeroheight link or planned state.
- [ ] Run axe on the Experiments view.

### Shell-composed Component Lab

- [ ] Open the shell-composed QA route.
- [ ] Activate Experiments.
- [ ] Verify both Button wrappers render.
- [ ] Verify global theme propagation.
- [ ] Verify no console errors.
- [ ] Verify Storybook and documentation links remain correct under shell composition.
- [ ] Run axe on the shell-composed Experiments view.

## Storybook relationship

The Experiments view does not replace Storybook.

- [X] Storybook remains the isolated component laboratory.
- [X] Candidates remains the integrated QA comparison and evidence surface.
- [ ] Storybook stories cover all candidate variants and states.
- [ ] Candidates displays a curated subset of high-value comparisons.
- [ ] Candidates links to the full story set for deeper review.
- [ ] Storybook interaction/a11y evidence is linked from the candidate tile.

## Zeroheight relationship

The Experiments view does not replace Zeroheight.

- [X] Zeroheight remains the governed usage and lifecycle documentation surface.
- [X] Candidates remains the runtime comparison and integration evidence surface.
- [ ] Candidates links to Zeroheight when a stable page exists.
- [ ] Zeroheight links back to the Experiments view when a stable deployed QA URL exists.
- [ ] Both surfaces use the same Candidate lifecycle label.

## Definition of done for the first Experiments view

- [ ] Third **Experiments** navigation Button appears to the right of **Performance Tracking**.
- [ ] Existing QA Components view is unchanged.
- [ ] Existing Performance Tracking view is unchanged.
- [ ] Experiments view renders through the existing active-tab pattern.
- [ ] Experiments content is extracted into a maintainable component.
- [ ] Current stable `ps-button` appears on the left.
- [ ] New `ps-up-button` candidate appears on the right.
- [ ] Both use the same primary label and state.
- [ ] At least primary, outlined, text, disabled, loading, and long-label comparisons exist.
- [ ] Candidate status and Button-only scope are clearly stated.
- [ ] Storybook candidate link works.
- [ ] Storybook stable-story link works.
- [ ] Embedded Storybook story works or displays a graceful fallback.
- [ ] Zeroheight Button link works or displays `Planned`/`Portal only` accurately.
- [ ] Figma link works or displays `Pending verification` accurately.
- [ ] Source and token-plan links work.
- [ ] Direct Component Lab tests pass.
- [ ] Shell-composed tests pass.
- [ ] Axe accessibility checks pass.
- [ ] Existing `ps-button` behavior and styling remain unchanged.

## Immediate implementation order

1. [ ] Add `candidates` to the QA active-view type.
2. [ ] Add the third **Candidates** `ps-button` after **Performance Tracking**.
3. [ ] Create `CandidatesViewComponent`.
4. [ ] Import `CandidatesViewComponent` into `QaRemoteComponent`.
5. [ ] Add the conditional Experiments view container.
6. [ ] Render current and candidate primary Buttons side by side.
7. [ ] Add remaining high-value state comparisons.
8. [ ] Add candidate lifecycle and token-source status.
9. [ ] Confirm Storybook story IDs from generated `index.json`.
10. [ ] Add Storybook external links.
11. [ ] Add Storybook iframe with graceful fallback.
12. [ ] Add optional Zeroheight and Figma links.
13. [ ] Add source, plan, and test-evidence links.
14. [ ] Add responsive and theme-aware styling.
15. [ ] Add unit tests for the three-view navigation.
16. [ ] Add Candidate component unit tests.
17. [ ] Add direct QA Playwright coverage.
18. [ ] Add shell-composed Playwright coverage.
19. [ ] Run axe and resolve findings.
20. [ ] Record the Experiments view as integration evidence in the main candidate plan and Zeroheight page.

## Final decision

The requested **Experiments** view is the correct place for the old-versus-new comparison.

It keeps responsibilities clear:

```text
Storybook
  -> isolated candidate variants, controls, interactions, and a11y

Experiments view
  -> stable-versus-candidate comparison inside the real Component Lab

Shell-composed QA
  -> federation and theme propagation evidence

Zeroheight
  -> curated usage, ownership, lifecycle, and approval guidance

GitHub/CI
  -> source, tests, review, and release evidence
```

The first Experiments view remains deliberately narrow: it evaluates one UP-inspired Button candidate and does not convert the rest of the public-sector design system.
