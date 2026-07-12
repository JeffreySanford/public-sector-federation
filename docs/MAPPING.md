# Token To PrimeNG Mapping

The public-sector design system uses this layering:

```text
primitive -> semantic -> component -> library mapping
```

## Source Of Truth

`@public-sector/tokens` owns primitive and semantic values. PrimeNG is not the
source of truth; it is the component implementation layer.

## PrimeNG Preset

`@public-sector/PrimeNG-preset` maps organization tokens onto PrimeNG styled mode
with `definePreset(Aura, ...)`.

Current mapping highlights:

- Primitive palettes map to PrimeNG `blue`, `slate`, `red`, and `green`.
- Semantic light/dark color schemes map to PrimeNG `primary`, `text`, `content`,
  and `surface` tokens.
- Focus rings use a semantic primary color and a 2px outline.
- Component tokens are only defined for components that need specific treatment,
  currently `card` radius and `datatable` header background.

## Governance

Apps should consume semantic CSS variables or PrimeNG components. They should not
consume primitive tokens directly unless they are implementing design-system
internals.
