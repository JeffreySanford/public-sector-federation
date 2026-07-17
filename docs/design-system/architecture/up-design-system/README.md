# Sanitized Design-System Notes

These notes capture technical findings from a separate design-system exercise in a sanitized form. They help the public reference repository model token export, PrimeNG mapping, and governed component wrappers without depending on organization-specific names or implementation details.

Read these documents as prototype and adoption guidance—not as proof that any external production runtime has already been validated.

## Documents

- [Token Export Validation](./token-export-validation.md)
- [PrimeNG Binding Audit](./primeng-binding-audit.md)
- [Wrapper Pattern Validation](./wrapper-pattern-validation.md)
- [Runtime Architecture Answered](./runtime-architecture-answered.md)
- [Design-System Decision Record](./design-decisions.md)
- [Critical Design Decisions](./critical-design-decisions.md)
- [Design-System Questions](./design-system-questions.md)
- [Change Log](./change-log.md)

## Review scope

The focused question is how design tokens are consumed inside an existing federated Web Component framework:

- whether a Figma or DTCG-compatible export is adequate;
- what normalization and mapping are required;
- how token values reach the PrimeNG preset;
- how registry wrappers consume the token contract;
- how public wrapper APIs keep PrimeNG internal;
- what still requires production-runtime validation.

These files intentionally avoid real product, organization, repository, package, and person names. Keep public documentation sanitized and describe external production decisions as adoption requirements rather than unfinished work in this sample.
