# Design & Tokens

## Design intent

The Candidate should use the same vocabulary across Figma, Starlight, Storybook, Angular, tests, and release documentation.

Recommended property vocabulary:

| Property | Candidate values |
| --- | --- |
| Appearance | `solid`, `outlined`, `text` |
| Tone | `primary`, `secondary`, `success`, `info`, `warning`, `error`, `help`, `contrast` |
| State | default, hover, pressed, focused, disabled, loading |
| Theme variant | neutral, vibrant, pastel |
| Mode | light, dark |
| Icon | none or leading; trailing and icon-only remain future decisions |

## Anatomy

1. Native `<button>` element
2. Optional loading spinner or leading icon
3. Visible action label
4. Border and background treatment
5. Focus indicator
6. Disabled or loading state treatment

## Appearances

### Solid

Use for the highest-emphasis action in a region. The default treatment uses the Candidate background and inverse foreground tokens.

### Outlined

Use for secondary actions that require visible structure without the emphasis of a filled Button.

### Text

Use for lower-emphasis actions where a bordered control would add unnecessary visual weight.

## States

The Candidate owns explicit treatment for:

- default;
- hover;
- active or pressed;
- focus-visible;
- disabled;
- loading.

The disabled and loading states suppress activation. Loading also exposes `aria-busy`.

## Token direction

The target Button token flow is:

```text
approved external design source
  -> source inventory
  -> primitive tokens
  -> semantic action tokens
  -> ps-button-candidate component tokens
  -> Candidate CSS implementation
```

The Candidate must not require application teams to use PrimeNG provider tokens or internal CSS selectors.

Recommended Candidate component-token namespace:

```text
--ps-button-candidate-background
--ps-button-candidate-foreground
--ps-button-candidate-border-color
--ps-button-candidate-hover-background
--ps-button-candidate-active-background
--ps-button-candidate-focus-color
--ps-button-candidate-border-radius
--ps-button-candidate-padding-inline
--ps-button-candidate-padding-block
--ps-button-candidate-content-gap
--ps-button-candidate-font-size
--ps-button-candidate-font-weight
--ps-button-candidate-icon-size
--ps-button-candidate-transition-duration
```

## Token information to collect from an approved external design source

### Color and action roles

- primary background, foreground, border, hover, active, focus, disabled, and loading values;
- secondary background, foreground, border, hover, active, focus, disabled, and loading values;
- success, information, warning, error, help, and contrast values where supported;
- inverse and high-contrast values;
- light and dark mode values;
- theme or brand-mode differences.

### Shape and layout

- border radius;
- border width and style;
- minimum height;
- horizontal and vertical padding;
- content gap;
- minimum width;
- full-width behavior;
- icon-only dimensions.

### Typography

- font family;
- font size;
- font weight;
- line height;
- letter spacing;
- text transform, if any.

### Icons and motion

- icon size;
- leading and trailing icon spacing;
- spinner size and stroke;
- transition duration and easing;
- reduced-motion behavior.

## Token verification requirement

Before promotion:

- verify the exact external source token path;
- preserve source aliases and Figma variable IDs;
- record light and dark values;
- record theme or brand-mode values where applicable;
- document normalization rules;
- generate runtime artifacts from source-controlled token data;
- prove that no Candidate token changes leak into the stable Button or unrelated components.

## Theme and mode support

The Candidate must be reviewed in:

| Variant | Light | Dark |
| --- | --- | --- |
| Neutral | Required | Required |
| Vibrant | Required | Required |
| Pastel | Required | Required |

The Experiments view changes the shared document theme so the stable and Candidate implementations can be reviewed in the same runtime context.

## Figma design source

**Status:** Pending

When available, link the approved Button Figma component set here and document:

- component node URL;
- variable collections and modes;
- appearance, tone, size, state, and icon properties;
- anatomy;
- source token names and aliases;
- publication date or library version;
- design-owner approval.

## Current qualification

The current implementation uses exploratory styling and existing public-sector foundations. These values are Candidate evidence, not approved external design-source values.

Only Button-related values are required for this proof. This work does not authorize importing or converting every token family or component from an external design system.
