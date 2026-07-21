# NVDA Manual Accessibility Review

This is the contributor workflow for manual screen-reader review with NVDA on Windows. Automated
axe, keyboard-interaction, and forced-colors checks already run in CI and Storybook Playwright —
this review covers the parts that only a human with a screen reader can verify: whether the
experience actually makes sense out loud, not just whether the DOM has the right attributes.

The three flagship components — Button, Select, Dialog — are the current review priority. Their
manifest `accessibility.screenReaderAudit` status is `pending` until a review record like the ones
below exists for each.

## One-time setup

1. Install NVDA from the [official NVDA download page](https://www.nvaccess.org/download/) and
   confirm it launches (you've already done this).
2. Pick the browser you'll review in — Chrome or Edge both work well with NVDA. No special
   configuration is required beyond a normal install.
3. Start the Storybook dev server:

   ```bash
   pnpm storybook:qa
   ```

   This serves Storybook at `http://localhost:4400`.

## Per-review workflow

For each story below:

1. Start NVDA (`Ctrl+Alt+N` if you've set that shortcut, or via the Start menu).
2. Open the story's direct iframe URL (listed below) in your browser — the iframe URL isolates
   just the component, without Storybook's own manager UI competing for landmarks/headings.
3. Navigate **keyboard-only**: `Tab` / `Shift+Tab` to move focus, `Enter`/`Space` to activate,
   arrow keys for any listbox/menu, `Escape` to dismiss overlays.
4. Listen to NVDA speech output (or open the NVDA speech viewer: `NVDA menu → Tools → Speech
   Viewer` to read along) and confirm against the checklist for that component below.
5. Fill in one copy of the [review record template](#review-record-template) per component and
   append it to the "Completed reviews" section at the bottom of this file.

## Story URLs

| Component | Direct iframe URL |
| --- | --- |
| Button | `http://localhost:4400/iframe.html?id=design-system-components-button--default&viewMode=story` |
| Button (loading) | `http://localhost:4400/iframe.html?id=design-system-components-button--loading&viewMode=story` |
| Button (disabled) | `http://localhost:4400/iframe.html?id=design-system-components-button--disabled&viewMode=story` |
| Select | `http://localhost:4400/iframe.html?id=design-system-components-select--default&viewMode=story` |
| Select (required + help) | `http://localhost:4400/iframe.html?id=design-system-components-select--required-with-help&viewMode=story` |
| Select (invalid + error) | `http://localhost:4400/iframe.html?id=design-system-components-select--invalid-with-error&viewMode=story` |
| Dialog | `http://localhost:4400/iframe.html?id=design-system-components-dialog--default&viewMode=story` |
| Dialog (destructive) | `http://localhost:4400/iframe.html?id=design-system-components-dialog--destructive-confirmation&viewMode=story` |

## Per-component checklist

### Button

- [ ] Accessible name is announced clearly (label text, not an icon description or "button").
- [ ] Disabled state is announced (`dimmed`/`unavailable`, not silently unreachable).
- [ ] Loading state's busy semantics are announced (`aria-busy`) without erasing the label.
- [ ] Focus is visible and NVDA announces the focus move when tabbing to/from the button.
- [ ] Enter and Space both activate; nothing double-fires or silently no-ops.

### Select

- [ ] The control's accessible name (label) is announced when it receives focus.
- [ ] Opening the listbox is announced (expanded state change), and the current/selected option is
      announced.
- [ ] Arrow-key navigation through options announces each option as focus moves.
- [ ] Disabled options are announced as unavailable and cannot be selected.
- [ ] Required/invalid state and any help or error text are announced in connection with the
      control (not just visually present).
- [ ] Selecting an option and closing the listbox is announced clearly (no dead air, no losing
      track of focus).

### Dialog

- [ ] Opening the dialog moves focus inside it and announces the dialog's accessible name
      (title) — confirm it doesn't just silently shift focus with no announcement.
- [ ] Background content is not reachable while the dialog is open (Tab doesn't escape into page
      content behind it).
- [ ] Any description text is announced in connection with the dialog (not just the title).
- [ ] Escape closes the dialog and returns focus to the element that opened it, and that return is
      announced.
- [ ] Destructive-action dialogs make the destructive nature of the action clear from the
      announced content, not only from color.

## Review record template

Copy this block, fill it in, and paste it into "Completed reviews" below.

```md
### <Component> — <date>

- Reviewer:
- Date:
- OS:
- Browser + version:
- NVDA version:
- Story ID / route:
- Steps taken:
- Expected result:
- Actual result:
- Findings (if any):
- Follow-up links (issue, finding ID, etc.):
```

## Completed reviews

_None recorded yet. Add entries above this line as reviews are completed._
