# Starlight visual baselines

Playwright stores approved Starlight screenshots beside the browser specification in `apps/starlight/tests/e2e/documentation-quality.spec.ts-snapshots/`.

CI never creates or accepts missing or changed baselines. A baseline may be updated only with:

```bash
pnpm test:starlight:visual:update
```

After running the command, review every changed image before committing it. Confirm that the difference is intentional in light, dark, desktop, and mobile contexts. Do not use snapshot updates to hide clipping, overflow, contrast, hierarchy, or responsive-layout defects.

Substantial visual changes also require the status in `apps/starlight/quality-policy.json` to record one of:

- `polish-approved`;
- `polish-approved-with-follow-up`;
- `polish-changes-required`.

The release gate fails when the status is `polish-changes-required` or when automatic visual-baseline acceptance is enabled.
