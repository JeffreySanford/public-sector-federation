---
title: Accessibility
description: Explicit interaction contracts, automated evidence, manual review status, and unresolved accessibility risk.
---

Accessibility is a component and pattern responsibility, not a final audit added after implementation.

## Evidence model

The documentation keeps these dimensions separate:

- semantic structure and accessible naming;
- keyboard interaction and focus management;
- announcements and dynamic-state behavior;
- automated axe and browser checks;
- visual contrast, reflow, zoom, and reduced-motion validation;
- manual screen-reader and assistive-technology review;
- known issues, blockers, and remediation decisions.

Automated checks provide useful evidence, but they are never presented as complete conformance. A component can be technically testable and still require manual review or design correction.
