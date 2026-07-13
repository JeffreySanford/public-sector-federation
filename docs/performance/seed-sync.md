# Performance Seed Auto-Update

**Status**: ✅ Complete | **Date**: 2026-07-12

The performance tracking system automatically synchronizes the database with
the seed file, ensuring baseline metrics stay in sync with actual measured
performance data.

## How It Works

### Local Development

```bash
# After running tests and recording metrics
pnpm perf:record

# Manually export current DB metrics to seed file
pnpm perf:export-seed

# Commit changes manually
git add apps/agile-api/prisma/seed-data/test-performance.seed.json
git commit -m "chore: update performance baselines"
```

### Automated CI/CD

The performance workflows automatically update the seed file:

**`performance-tracking.yml` (Automatic on E2E completion)**
1. E2E tests complete successfully
2. Workflow downloads test results
3. Sets up database and API
4. Records metrics: `pnpm perf:record`
5. Exports and commits seed: `pnpm perf:export-seed --auto-commit`
6. Push to master happens automatically

**`manual-perf-record.yml` (Manual dispatch)**
1. Triggered manually via GitHub Actions
2. Runs full test suite
3. Records metrics: `pnpm perf:record`
4. Exports and commits seed: `pnpm perf:export-seed --auto-commit`
5. Push to master happens automatically

## What Gets Exported

The export script:
- Connects to the database
- Queries all `TestPerformanceMetric` records
- Groups by test suite, name, and browser
- Takes the latest record for each combination
- Sorts by suite → name → browser
- Writes to `apps/agile-api/prisma/seed-data/test-performance.seed.json`

### Example Export
```json
{
  "performanceMetrics": [
    {
      "testSuite": "lint",
      "testName": "All checks",
      "browser": null,
      "durationMs": 5000,
      "baselineMs": 5000,
      "thresholdMs": 10000,
      "status": "excellent",
      "passed": true,
      "errorMessage": null,
      "commitHash": "abc123def456",
      "branch": "master"
    },
    {
      "testSuite": "federation",
      "testName": "Shell federation tests",
      "browser": "chromium",
      "durationMs": 88000,
      "baselineMs": 90000,
      "thresholdMs": 108000,
      "status": "excellent",
      "passed": true,
      "errorMessage": null,
      "commitHash": "abc123def456",
      "branch": "master"
    }
  ]
}
```

## Benefits

1. **Fresh Baselines**: New database instances automatically get latest performance metrics
2. **Traceability**: Every metric includes commit hash and branch name
3. **No Manual Sync**: Developers don't need to manually copy DB data to seed file
4. **Historical Context**: Seed file shows the actual commit where metrics were recorded
5. **Continuous Tracking**: Each test run automatically updates baselines

## Auto-Commit Details

When `--auto-commit` flag is used:

```bash
pnpm perf:export-seed --auto-commit
```

The script automatically:
1. Writes the seed file
2. Stages the file: `git add apps/agile-api/prisma/seed-data/test-performance.seed.json`
3. Commits with message: `chore: update performance seed with latest metrics (N combinations)`
4. Pushes to master: `git push origin master`

If any step fails, a warning is logged but execution continues.

## Environment Variables

```bash
# Enable auto-commit via environment variable
AUTO_COMMIT=true pnpm perf:export-seed

# Override database URL
DATABASE_URL=postgresql://... pnpm perf:export-seed

# In CI/CD workflows (GitHub Actions):
env:
  DATABASE_URL: postgresql://public_sector:public_sector@localhost:5432/public_sector_agile
run: pnpm perf:export-seed --auto-commit
```

## Manual Updates

For manual control:

```bash
# Just export without committing
pnpm perf:export-seed

# Review changes
git diff apps/agile-api/prisma/seed-data/test-performance.seed.json

# Commit manually with custom message
git add apps/agile-api/prisma/seed-data/test-performance.seed.json
git commit -m "chore: update performance baselines after optimization"
git push origin master
```

## Seeding Database with Updated Metrics

After seed file is updated, new database instances will use the latest metrics:

```bash
# Reset and reseed with latest metrics
pnpm api:migrate
pnpm api:seed

# Verify metrics are loaded
psql postgresql://public_sector:public_sector@localhost:5432/public_sector_agile -c \
  "SELECT test_suite, test_name, browser, duration_ms, status FROM \"TestPerformanceMetric\" ORDER BY test_suite;"
```

## Workflow Order

```
Test Execution
    ↓
Record Metrics (pnpm perf:record)
    ↓ saves to: database
    ↓
Export Seed (pnpm perf:export-seed --auto-commit)
    ↓ reads from: database
    ↓ writes to: test-performance.seed.json
    ↓ commits: git commit & git push
    ↓
Next Fresh Database Instance
    ↓
Uses Updated Baselines (pnpm api:seed)
```

## Troubleshooting

**"No metrics found in database"**
- Ensure database is running: `pnpm docker:up`
- Ensure migrations are applied: `pnpm api:migrate`
- Ensure metrics were recorded: `pnpm perf:record`

**"Could not auto-commit" warning**
- Check git status: `git status`
- Ensure branch is set: `git rev-parse --abbrev-ref HEAD`
- Git push may fail if branch is protected - manual commit needed

**Seed file not updating**
- Check database connection: `DATABASE_URL=... pnpm db:validate`
- Verify metrics exist: `pnpm prisma studio` (in browser at localhost:5555)
- Run with verbose output: Check console logs from export script

## See Also

- [tracking.md](./tracking.md) - Complete system overview
- [baseline.md](./baseline.md) - Baseline thresholds
- [TESTING.md](../TESTING.md) - Test execution guide
