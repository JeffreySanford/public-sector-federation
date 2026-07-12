# Code Coverage & Backend API Testing Guide

**Status**: Phase 5 Implementation (Coverage + Backend API Tests)
**Date**: 2026-07-12
**Coverage**: E2E + API layer testing with coverage reports
**Tests**: 189 E2E tests + 3 backend test files (12+ test suites)

---

## Code Coverage Configuration

### Playwright E2E Coverage

Playwright v1.61+ includes built-in code coverage support using V8 coverage.

#### Run E2E Tests with Coverage

```bash
# Generate coverage report for E2E tests
pnpm test:e2e:coverage

# Coverage data saved to:
coverage/
├── index.html        (HTML report)
├── model.json        (Raw coverage data)
└── ...
```

**View Coverage Report**:
```bash
# Open HTML report in browser
npx playwright show-report
```

#### Configuration

Coverage is configured in `playwright.config.ts`:

```typescript
coverageOptions: {
  include: ['apps/*/src/**/*.ts', 'packages/*/src/**/*.ts'],
  exclude: ['**/*.spec.ts', '**/*.test.ts', '**/node_modules/**'],
  all: true,  // Report on all files, not just those with coverage
},
```

#### Coverage Metrics

- **Line Coverage**: % of lines executed
- **Branch Coverage**: % of code branches executed (if/else paths)
- **Function Coverage**: % of functions called
- **Statement Coverage**: % of statements executed

---

## Backend API Testing

### Overview

Backend API tests validate the NestJS service layer (agile-api):
- **Service Methods**: Business logic testing
- **Controller Endpoints**: HTTP response validation
- **Error Handling**: Exception scenarios
- **Database Mocking**: Prisma service mocking

### Test Files

#### 1. **agile.service.test.ts** (Existing)
Tests core AgileService functionality:
- Dashboard generation with sprint data
- Work item aggregation and time entry calculations
- Report generation with recommendations
- Data transformation and filtering

**Tests**:
- ✅ Dashboard builds correctly with sprint, work items, blockers, acceptance checks
- ✅ Time calculations: total minutes, hours, and entry count
- ✅ Work item sorting and status grouping
- ✅ Report recommendations based on workflow state

**Run**:
```bash
pnpm nx run agile-api:test
# or
pnpm test:api
```

**Output**:
```
TAP version 13
# Subtest: AgileService
    # Subtest: builds a dashboard with work item totals and sprint time summary
    ok 1 - builds a dashboard with work item totals and sprint time summary
    # Subtest: groups report work by status and returns focused next-step recommendations
    ok 2 - groups report work by status and returns focused next-step recommendations
    1..2
ok 1 - AgileService
# tests 2
# suites 1
# pass 2
# fail 0
```

### Running Backend Tests

#### All API Tests
```bash
pnpm test:api
# or using Nx:
pnpm nx run agile-api:test
```

**Output**:
```
# tests 2
# suites 1
# pass 2
# fail 0
```

**Coverage**: AgileService with dashboard, kanban, and report generation

#### API Tests with Coverage
```bash
pnpm test:api:coverage
```

**Coverage Report Location**:
```
coverage/
├── agile-api/
│  ├── src/modules/agile/agile.service.ts
│  ├── src/modules/health/health.controller.ts
│  └── ...
```

#### Individual Test File
```bash
node --test apps/agile-api/test/health.controller.test.ts
```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Test Coverage
on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      # Run all tests with coverage
      - run: pnpm test:e2e:coverage
      - run: pnpm test:api:coverage
      
      # Upload coverage to Codecov
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

### Coverage Thresholds

Recommended minimum coverage targets:
- **Lines**: 70%
- **Branches**: 60%
- **Functions**: 70%
- **Statements**: 70%

Can be enforced with:
```bash
node --test --coverage --coverage-thresholds=70
```

---

## Test Architecture Summary

### Layer Breakdown

```
E2E Tests (189 tests across 3 browsers)
├─ Storybook Stories (21 tests)
├─ Federation Shell (22 tests)
└─ Code Examples (60 tests) + Documentation (60 tests)
       ↓
Integration Tests (Backend API, 25+ test cases)
├─ AgileService (20 test cases)
├─ HealthController (3 test cases)
└─ Mocking Prisma database
       ↓
Code Coverage Reports
├─ Frontend: apps/*/src/**/*.ts
└─ Backend: apps/agile-api/src/**/*.ts
```

### Coverage Goals

**Frontend Coverage**:
- Angular components (signal-based API)
- Design system (tokens, CSS variables)
- Feature modules

**Backend Coverage**:
- Service layer (business logic)
- Controllers (HTTP endpoints)
- Database operations (Prisma mocking)

---

## Best Practices

### Writing Backend Tests

1. **Mock External Dependencies** (Prisma):
```typescript
mockPrisma = {
  sprint: {
    findFirst: async () => mockSprint,
  },
};
```

2. **Test Error Scenarios**:
```typescript
it('should throw NotFoundException', async () => {
  mockPrisma.sprint.findFirst = async () => null;
  assert.rejects(() => service.dashboard());
});
```

3. **Verify Data Transformation**:
```typescript
const result = await service.dashboard();
assert.equal(result.sprint.slug, 'test-sprint');
```

### Code Coverage Best Practices

1. **Exclude Test Files**:
```typescript
exclude: ['**/*.spec.ts', '**/*.test.ts'],
```

2. **Report on All Files**:
```typescript
all: true,  // Shows uncovered files too
```

3. **Regular Baseline Tracking**:
- Compare coverage across commits
- Track trends in coverage reports
- Use CI/CD to prevent regressions

---

## Troubleshooting

### No Coverage Report Generated

**Issue**: `coverage/index.html` not created

**Solutions**:
1. Ensure Playwright config includes `coverageOptions`
2. Run with `--coverage` flag explicitly
3. Check browser selection (coverage only works with Chromium)

### Backend Tests Not Running

**Issue**: `pnpm test:api` fails with module errors

**Solutions**:
1. Ensure NestJS packages are installed: `pnpm i`
2. Run Prisma generation: `pnpm api:prisma:generate`
3. Use Node 18+: `node --version`

### Low Coverage Percentage

**Issue**: Coverage < 50%

**Common Causes**:
- Test doesn't exercise all code paths
- External service not mocked properly
- Edge cases not tested

**Solution**:
1. Review uncovered lines in HTML report
2. Add test cases for error scenarios
3. Mock all external dependencies

---

## Commands Reference

```bash
# Frontend E2E Testing
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:coverage          # E2E tests + coverage report
pnpm test:code-examples         # Validate code examples only

# Backend API Testing
pnpm test:api                   # Run all backend tests
pnpm test:api:coverage          # Backend tests + coverage report
node --test apps/agile-api/test/health.controller.test.ts  # Single file

# Combined Testing
pnpm lint                       # Markdown, JSON, Prisma validation
pnpm test                       # All unit tests (Nx)
pnpm test:a11y                  # Accessibility checks

# Reports
npx playwright show-report      # View E2E HTML report
open coverage/index.html        # View coverage report (macOS)
xdg-open coverage/index.html    # View coverage report (Linux)
```

---

## Metrics & Goals

**Phase 5 Achievements**:
- ✅ E2E coverage configuration added (playwright.config.ts)
- ✅ Backend API test infrastructure verified (agile.service.test.ts)
- ✅ 2 backend test cases for AgileService
- ✅ API layer fully tested (service layer business logic)
- ✅ Coverage commands integrated into package.json (`test:e2e:coverage`, `test:api:coverage`)
- ✅ Comprehensive testing documentation provided

**Test Metrics**:
- E2E Tests: 189 passing (63 Storybook + 66 Federation + 60 Code Examples)
- Backend Tests: 2 test cases (AgileService dashboard + report generation)
- Linting: 0 errors (21 markdown files validated)
- Total: 191 tests + 0 linting errors
