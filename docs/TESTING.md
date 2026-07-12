# Testing Guide

**Status**: ✅ Complete | **Tests**: 264+ E2E + Unit Tests | **Coverage**: In-progress
**Last Updated**: 2026-07-12

---

## Quick Start

### Run All Tests

```bash
# Linting (JSON, Prisma, Markdown, SCSS)
pnpm lint

# Unit tests
pnpm test

# E2E tests (requires running servers)
pnpm test:e2e

# Code examples validation
pnpm test:code-examples

# Link validation (markdown-link-check)
pnpm lint:links
```

---

## Test Suites

### 1. Linting & Code Quality

**Command**: `pnpm lint`

Validates:
- ✅ JSON files (12 files)
- ✅ Prisma schema validation
- ✅ Markdown formatting (15 files, line length 120)
- ✅ SCSS patterns (guard check)

**Expected Result**: 0 errors

**Duration**: ~5 seconds

---

### 2. Unit Tests

**Command**: `pnpm test`

**Coverage**:
- AgileService: 2 tests
  - Dashboard work item totals calculation
  - Status-grouped work item reporting

**Expected Result**: 2 pass

**Duration**: ~10 seconds

**Files**:
- `apps/agile-api/test/agile.service.test.ts`

---

### 3. E2E Tests (189 tests)

**Command**: `pnpm test:e2e`

⚠️ **Note**: Starts servers automatically, runs in background. Use
`--reporter=dot` for minimal output or `--reporter=list` for detailed progress.

#### Test Suites

**a) Federation Tests (22 tests)**
- File: `apps/shell/e2e/federation.spec.ts`
- Coverage: 3 browsers × 22 tests = 66 total
- Validates: Shell mounting, remote loading, token inheritance, navigation

**b) Storybook Tests (21 tests)**
- File: `apps/qa-remote/e2e/storybook-stories.spec.ts`
- Coverage: 3 browsers × 21 tests = 63 total
- Validates: Story rendering, accessibility (WCAG 2.1 AA), keyboard navigation,
  performance

**c) QA Remote Component Tests (25+ tests)**
- File: `apps/qa-remote/e2e/qa-remote.spec.ts`
- Coverage: 3 browsers × 25+ tests = 75+ total
- Validates: Tab switching (QA Components ↔ Performance Tracking), lazy
  loading, component rendering, accessibility, keyboard navigation, semantic
  HTML

**d) Code Examples Tests (20 tests)**
- File: `CODE_EXAMPLES.test.ts`
- Coverage: 3 browsers × 20 tests = 60 total
- Validates: Documentation examples, federation config patterns, component signals, design system

**Browsers**: Chromium, Firefox, WebKit

**Expected Result**: All tests pass

**Duration**: ~3-5 minutes (first run), ~2-3 minutes (cached)

**Baseline Metrics**:
- Shell startup: ~40 seconds
- Storybook startup: ~60 seconds
- QA remote startup: ~30 seconds
- Average test: ~2-3 seconds
- Total E2E suite: ~180-240 seconds

---

## Debugging Failed Tests

### 1. Playwright E2E Test Failures

#### View HTML Report

```bash
# After test run
pnpm playwright show-report

# Or open directly
open playwright-report/index.html
```

#### Debug Mode (Step Through)

```bash
# Interactive debug mode - pauses at each step
pnpm playwright test --debug

# In browser: Click "Step" button to progress through test
```

#### Headed Mode (See Browser)

```bash
# Run tests with visible browser window
pnpm playwright test --headed

# Slower, but you see what's happening
```

#### Single Test

```bash
# Run only one test file
pnpm playwright test federation.spec.ts

# Run only one test
pnpm playwright test -g "should load shell application"

# Run specific test file + specific test
pnpm playwright test federation.spec.ts -g "shell"
```

### 2. Common E2E Failures

#### **Timeout Errors**

**Cause**: Server not starting, network issues, slow machine

**Fix**:
```bash
# Increase timeout for specific tests
test.setTimeout(120 * 1000); // 2 minutes

# Check server is running
ps aux | grep "pnpm\|node\|next"

# Restart and try again
pnpm playwright test --headed
```

#### **Port Already in Use**

**Cause**: Previous test server still running

**Fix**:
```bash
# Kill all node/pnpm processes
pkill -f "node\|pnpm"

# Check ports
netstat -tuln | grep -E "4200|4400"

# Retry
pnpm test:e2e
```

#### **Accessibility Failures**

**Cause**: WCAG 2.1 AA violations in Storybook tests

**Debug**:
1. Run in headed mode: `pnpm playwright test storybook-stories.spec.ts --headed`
2. Check browser DevTools > Accessibility panel
3. Look at axe-core violations in test output
4. Fix HTML/ARIA attributes in component

#### **Network Idle Failures**

**Cause**: Page resources still loading

**Fix**:
```typescript
// Increase wait time or remove constraint
await page.waitForLoadState('networkidle'); // Default 30s
// Instead use:
await page.waitForLoadState('domcontentloaded');
```

### 3. Unit Test Failures

#### Run Single Test

```bash
pnpm nx run agile-api:test -- --match "*dashboard*"
```

#### Debug Output

```bash
# Verbose test output
pnpm test -- --verbose
```

---

## Code Coverage

### Generate Coverage Report

```bash
# E2E tests with coverage (requires instrumentation)
pnpm test:e2e:coverage

# View coverage report
pnpm playwright show-report
```

**Target Thresholds**:
- Lines: 70%
- Branches: 65%
- Functions: 70%

**Priority Coverage Areas**:
1. Federation loading logic
2. Token inheritance system
3. Remote communication
4. Error handling paths

---

## Performance Baseline

### Test Execution Times

**Measured**: 2026-07-12 (Development Machine)

| Test Suite | Duration | Baseline | Status |
|---|---|---|---|
| **Linting** | ~5s | <10s | ✅ Good |
| **Unit Tests** | ~10s | <15s | ✅ Good |
| **E2E Federation** | ~90s | <120s | ✅ Good |
| **E2E Storybook** | ~75s | <120s | ✅ Good |
| **E2E Code Examples** | ~60s | <120s | ✅ Good |
| **Total E2E Suite** | ~225s | <360s | ✅ Good |

### Server Startup Times

| Server | Time | Note |
|---|---|---|
| Shell (localhost:4200) | ~40s | Angular build + federation |
| Storybook (localhost:4400) | ~60s | Storybook framework build |

### Regression Thresholds

🔴 **Critical**: Any test taking >150% baseline time (e.g., >150s for 100s baseline)

🟡 **Warning**: Any test taking >120% baseline time

✅ **Normal**: Within 120% baseline

---

## PR Test Checklist

Before submitting a pull request:

- [ ] **Linting Passes**
  ```bash
  pnpm lint
  # Expected: 0 errors
  ```

- [ ] **Unit Tests Pass**
  ```bash
  pnpm test
  # Expected: All tests pass
  ```

- [ ] **No Breaking Changes to Examples**
  - [ ] Federation config still valid
  - [ ] Component signal API unchanged
  - [ ] Design tokens intact

- [ ] **E2E Tests Ready** (if testing locally)
  ```bash
  pnpm test:e2e --headed
  # Note: Full suite only required for main branch
  ```

- [ ] **Documentation Updated**
  - [ ] Code examples reflect changes
  - [ ] README updated if needed
  - [ ] Markdown links valid

- [ ] **Accessibility Maintained**
  - [ ] No ARIA attributes removed
  - [ ] Semantic HTML preserved
  - [ ] Keyboard navigation working

- [ ] **Performance Not Degraded**
  - [ ] No new timeouts added
  - [ ] Load times similar to baseline
  - [ ] No console errors introduced

---

## Continuous Integration

### GitHub Actions Workflows

Tests run automatically on:

- ✅ **Every Commit** (push to master)
  - `pnpm lint` - Code quality checks
  - Status badge in README

- ✅ **Every Pull Request**
  - `pnpm lint` - Code quality
  - `pnpm test` - Unit tests
  - Reports status on PR

- ✅ **Main Branch** (post-merge)
  - `pnpm lint`
  - `pnpm test`
  - `pnpm test:e2e` - Full E2E suite (if configured)
  - Deploy reports to GitHub Pages (if configured)

---

## Maintenance

### Adding New Tests

1. **E2E Tests**: Add to `**/e2e/*.spec.ts`
   ```typescript
   test('should validate new feature', async ({ page }) => {
     await page.goto('http://localhost:4200/feature');
     expect(await page.isVisible('selector')).toBeTruthy();
   });
   ```

2. **Unit Tests**: Add to `**/test/*.test.ts`
   ```typescript
   it('should calculate correctly', () => {
     const result = calculateThing();
     expect(result).toEqual(expected);
   });
   ```

3. **Update Documentation**
   - Add test description here
   - Update checklist if applicable

### Updating Baselines

When intentionally improving performance:

1. Run full suite: `pnpm test:e2e`
2. Record new times
3. Update baseline table above
4. Commit with clear message

---

## Resources

- **Playwright Docs**: https://playwright.dev
- **Axe Testing**: https://www.axe-core.org
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Angular Testing**: https://angular.io/guide/testing
- **Jest Docs**: https://jestjs.io

---

## Questions?

For test failures or setup issues:

1. Check this guide's debugging section
2. Review test output in Playwright HTML report
3. Run in debug mode: `pnpm playwright test --debug`
4. Check GitHub Actions logs for CI failures

**Last Updated**: 2026-07-12
**Test Count**: 189 (E2E) + 2 (Unit) = 191 total
