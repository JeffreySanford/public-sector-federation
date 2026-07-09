# Zeroheight Export Package

Generated for the Public Sector Federation POC.

## Contents

- Markdown page sources in `pages/`
- Token exports in `tokens/`
- Agile report artifacts in `reports/agile-progress/`
- Playwright screenshots in `reports/agile-progress/screenshots/`
- Upload/publish metadata in `manifest.json`

## Recommended Workflow

```bash
pnpm report:all
```

If using a custom publishing bridge, configure:

```bash
ZEROHEIGHT_PUBLISH_ENDPOINT=...
ZEROHEIGHT_CLIENT_ID=...
ZEROHEIGHT_ACCESS_TOKEN=...
ZEROHEIGHT_DRY_RUN=false
```
