# Performance Tracking Setup

This document describes the performance tracking system for the public-sector-federation project.

## Overview

The performance tracking system automatically records test execution metrics (duration, status, pass/fail) to a database for trend analysis and regression detection. The system consists of:

1. **Database Schema**: `TestPerformanceMetric` model in Prisma
2. **API Endpoints**: REST API for recording and querying metrics
3. **Dashboard View**: "Performance Tracking" tab in QA remote (optional, lazy-loaded)
4. **CI/CD Integration**: GitHub Actions workflows for automatic recording
5. **CLI Tool**: Node.js script for manual metric recording

## How to Access

The performance dashboard is accessible as an optional tab in the QA remote:
1. Navigate to the QA remote in your shell
2. Click the "Performance Tracking" tab (default is "QA Components")
3. Dashboard loads on demand with regression alerts, summary cards, trends, and detailed metrics

This keeps the QA remote lightweight while providing performance visibility when needed.

## Components

### 1. Database Model

The `TestPerformanceMetric` model tracks:
- Test suite (lint, unit, federation, storybook, code_examples)
- Test name
- Browser (chromium, firefox, webkit, or null for non-browser tests)
- Duration in milliseconds
- Baseline duration (from PERFORMANCE_BASELINE.md)
- Threshold duration (max acceptable)
- Performance status (excellent, good, warning, critical)
- Pass/fail indicator
- Error message (if failed)
- Git commit hash and branch
- Timestamp

**Location**: [apps/agile-api/prisma/schema.prisma](../apps/agile-api/prisma/schema.prisma)

### 2. API Endpoints

All endpoints are prefixed with `/api/performance` and served by the agile-api NestJS server.

#### Record a Metric
```
POST /api/performance
Content-Type: application/json

{
  "testSuite": "federation",
  "testName": "Shell federation tests",
  "browser": "chromium",
  "durationMs": 88000,
  "baselineMs": 90000,
  "thresholdMs": 108000,
  "passed": true,
  "errorMessage": null,
  "commitHash": "abc123def456",
  "branch": "master"
}
```

#### Get Summary
```
GET /api/performance/summary

Returns PerformanceSummary[] with:
- testSuite, totalTests, passedTests, failedTests
- averageDuration, status
```

#### Get Trends
```
GET /api/performance/trends?testSuite=federation&testName=Shell+federation+tests&browser=chromium

Returns PerformanceTrendDTO[] with:
- average, baseline, latest
- trend (improving/stable/degrading)
- status, lastUpdated
```

#### Get Metrics
```
GET /api/performance?testSuite=federation&limit=50

Returns PerformanceMetricDTO[] with all recorded metrics
```

#### Check Regressions
```
GET /api/performance/regressions

Returns RegressionAlertDTO[] with critical/warning regressions
```

#### Get Date Range
```
GET /api/performance/date-range?startDate=2026-07-01T00:00:00Z&endDate=2026-07-31T23:59:59Z

Returns PerformanceMetricDTO[] for specified range
```

**Location**: [apps/agile-api/src/performance/](../apps/agile-api/src/performance/)

### 3. Performance Dashboard (QA Remote Tab)

The Performance Dashboard is accessible as an optional tab in the QA remote application. It provides:
- **Regression Alerts Section**: Shows critical/warning regressions with impact metrics
- **Test Suite Summary Cards**: 5 cards for each test suite with status, duration, and pass rate
- **Performance Trends Chart**: Line chart showing latest, average, baseline, and threshold
- **Detailed Table**: Browser-specific performance data with trend indicators
- **Responsive Design**: Mobile-optimized layout
- **Real-time Refresh**: Manual refresh button to update data

**Integration**:
The dashboard is lazily loaded via Angular's `@if` directive, so it only renders when the user clicks the "Performance Tracking" tab. This keeps the QA remote lightweight by default.

**Location**: 
- Shell → QA Remote → "Performance Tracking" tab

**Implementation**:
```typescript
// In qa-remote.component.ts
activeTab = signal<'qa' | 'performance'>('qa');
setActiveTab(tab: 'qa' | 'performance'): void {
  this.activeTab.set(tab);
}

// In qa-remote.component.html
@if (activeTab() === 'performance') {
  <public-performance-dashboard></public-performance-dashboard>
}
```

**Location**: [apps/qa-remote/src/app/components/](../apps/qa-remote/src/app/components/)

### 4. CLI Recording Tool

Record test metrics from command line:

```bash
pnpm perf:record [--api-url http://localhost:3000]
```

The script:
1. Reads `test-results/results.json` (Playwright JSON reporter output)
2. Extracts test suite, name, browser, and duration
3. Compares against baselines from PERFORMANCE_BASELINE.md
4. Determines status (excellent/good/warning/critical)
5. Records metrics to API via HTTP POST
6. Reports success/failure count

**Environment Variables**:
- `PERFORMANCE_API_URL`: Override API URL (default: http://localhost:3000)
- `GIT_COMMIT_HASH`: Git commit hash (auto-detected if not provided)
- `GIT_BRANCH`: Git branch name (auto-detected if not provided)

**Location**: [scripts/record-performance.mjs](../scripts/record-performance.mjs)

### 5. GitHub Actions Workflows

#### Automatic Recording (performance-tracking.yml)
- Triggers after successful E2E tests
- Requires PostgreSQL service
- Downloads test results artifact
- Seeds database with baseline metrics
- Records metrics to API
- Comments on PR with results link

**Note**: This workflow runs only if E2E tests pass and a PR is associated.

#### Manual Recording (manual-perf-record.yml)
- Manual trigger via GitHub Actions UI
- Runs full test suite locally
- Accepts API URL parameter
- Uploads test results as artifact
- Can be used to record metrics for specific branches

## Setup Instructions

### Local Development

1. **Start services**:
   ```bash
   pnpm start:backend  # Starts PostgreSQL and API
   ```

2. **Run tests**:
   ```bash
   pnpm test:e2e
   ```

3. **Record metrics**:
   ```bash
   pnpm perf:record
   ```

4. **View dashboard**:
   - Access qa-remote app and navigate to Performance Dashboard
   - API running on http://localhost:3000

### CI/CD Integration

The workflows are configured to:
1. Run after E2E tests complete
2. Set up PostgreSQL service
3. Build and start API server
4. Download test results
5. Record metrics to database
6. Export and update seed file with latest metrics
7. Auto-commit and push changes to master
8. Comment on PR with results link

**Automatic Seed Synchronization**:
The system automatically syncs the database with the seed file, ensuring fresh database instances get the latest performance baselines. After each test run:
- `pnpm perf:record` reads test results and saves to database
- `pnpm perf:export-seed --auto-commit` exports latest DB metrics to seed file
- Changes are automatically committed and pushed to master

This keeps `apps/agile-api/prisma/seed-data/test-performance.seed.json` in sync with actual measured performance, eliminating manual synchronization.

See [PERFORMANCE_SEED_SYNC.md](./PERFORMANCE_SEED_SYNC.md) for detailed seed auto-update documentation.

**Customization**:
- Edit `.github/workflows/performance-tracking.yml` for automatic recording
- Edit `.github/workflows/manual-perf-record.yml` for manual runs
- Modify `scripts/export-performance-seed.mjs` to change export behavior

## Baseline Thresholds

From [docs/PERFORMANCE_BASELINE.md](../docs/PERFORMANCE_BASELINE.md):

| Test Suite | Baseline | Threshold | Status |
|------------|----------|-----------|--------|
| Lint | 5s | 10s | Excellent |
| Unit | 10s | 15s | Excellent |
| Federation | 90s | 108s | Excellent |
| Storybook | 75s | 90s | Excellent |
| Code Examples | 60s | 72s | Excellent |

**Status Calculation**:
- **Excellent**: < 100% baseline
- **Good**: 100% - 120% baseline
- **Warning**: 120% - 150% baseline
- **Critical**: > 150% baseline

## Regression Detection

The system automatically detects regressions when metrics exceed thresholds:

- **Critical**: Exceeds `thresholdMs` (e.g., 120% of baseline)
- **Warning**: Exceeds 150% of baseline

Example regressions:
- A test with 90s baseline failing at 150s+ = **CRITICAL**
- A test with 90s baseline running at 140s = **WARNING**
- A test with 90s baseline running at 105s = **GOOD**

## Database Seeding

Initial baseline metrics are seeded from [apps/agile-api/prisma/seed-data/test-performance.seed.json](../apps/agile-api/prisma/seed-data/test-performance.seed.json):

```bash
pnpm api:seed
```

This creates 11 baseline metrics matching the expected test suite performance.

## Trend Analysis

The dashboard calculates trends by comparing latest execution against historical averages:

- **Improving**: Latest < previous average × 0.95
- **Degrading**: Latest > previous average × 1.05
- **Stable**: Between thresholds

## Integration with Agile Workflow

Performance tracking is tracked as a work item in the agile workflow:

- **Work Item**: "Performance Tracking" (done)
- **Effort**: Medium
- **Owner**: QA Team
- **Description**: "Database infrastructure for historical performance tracking with QA dashboard visualization"

## Troubleshooting

### Metrics not recording
1. Verify API server is running: `curl http://localhost:3000/api/performance/summary`
2. Check test results file exists: `ls test-results/results.json`
3. Check git info: `git rev-parse HEAD` and `git rev-parse --abbrev-ref HEAD`

### Database connection errors
1. Verify PostgreSQL is running: `psql -U public_sector -d public_sector_agile -c "SELECT 1"`
2. Check DATABASE_URL environment variable
3. Run migrations: `pnpm api:migrate`

### Performance data not showing in dashboard
1. Verify metrics were recorded: `curl http://localhost:3000/api/performance?limit=10`
2. Check browser console for API errors
3. Verify PerformanceDataService is injected correctly

## Future Enhancements

Potential improvements:
1. **Automated regression reporting**: Fail builds on critical regressions
2. **Performance budgets**: Set and enforce per-test-suite budgets
3. **Trend predictions**: ML-based regression forecasting
4. **Custom alerts**: Email/Slack notifications on regressions
5. **Comparative analysis**: Compare branches/commits
6. **Performance optimization suggestions**: AI-powered recommendations
7. **Multi-team tracking**: Track performance across team ownership
8. **Integration with PR checks**: Require performance approval for merges

## References

- [Performance Baseline Documentation](../docs/PERFORMANCE_BASELINE.md)
- [Testing Documentation](../docs/TESTING.md)
- [Agile API Server](../apps/agile-api/README.md)
- [QA Remote App](../apps/qa-remote/README.md)
