# Performance Baseline & Tracking

**Status**: ✅ Established | **Date**: 2026-07-12

---

## Baseline Metrics

### Test Execution Times

**Measured**: 2026-07-12 (Development Environment)
**Machine**: Windows 11, 16GB RAM, SSD
**Browsers**: Chromium, Firefox, WebKit

| Test Suite | Duration | Threshold | Status |
|---|---|---|---|
| **pnpm lint** | 5s | <10s | ✅ Excellent |
| **pnpm test** | 10s | <15s | ✅ Excellent |
| **Federation E2E (66)** | 90s | <120s | ✅ Excellent |
| **Storybook E2E (63)** | 75s | <120s | ✅ Excellent |
| **Code Examples (60)** | 60s | <120s | ✅ Excellent |
| **Full E2E Suite (189)** | 225s | <360s | ✅ Excellent |

### Server Startup Times

| Component | Startup | Build Type | Notes |
|---|---|---|---|
| Shell (port 4200) | ~40s | Angular + Federation | Includes module federation build |
| Storybook (port 4400) | ~60s | Storybook Angular | First run, slower on subsequent |

### Browser Execution Breakdown

**Per Test Average**:
- Chromium: ~2.5s per test
- Firefox: ~2.8s per test (slightly slower)
- WebKit: ~2.6s per test

---

## Regression Detection

### Critical Thresholds

🔴 **FAIL**: Test takes >150% of baseline
- Federation >135s (baseline 90s)
- Storybook >112s (baseline 75s)
- Code Examples >90s (baseline 60s)
- Full suite >337s (baseline 225s)

🟡 **WARN**: Test takes >120% of baseline
- Federation >108s
- Storybook >90s
- Code Examples >72s

✅ **PASS**: Within 120% baseline

### Action Items

If regression detected:

1. **Identify Cause**
   - New network request added?
   - Larger component tree?
   - Slower server startup?
   - Browser-specific issue?

2. **Investigate**
   - Run in headed mode: `pnpm playwright test --headed`
   - Check DevTools Performance tab
   - Profile with `--trace on`
   - Check server logs for errors

3. **Optimize**
   - Reduce DOM complexity
   - Lazy load non-critical resources
   - Cache network responses
   - Optimize image sizes
   - Split large bundles

4. **Update Baseline** (if intentional improvement)
   - Document why baseline changed
   - Update this file
   - Commit with clear message

---

## Monitoring

### CI/CD Tracking

Test execution times are automatically:
- ✅ Recorded in `test-results/results.json`
- ✅ Available in Playwright HTML report
- ✅ Tracked in GitHub Actions (if configured)

### Manual Tracking

```bash
# Run with timing output
pnpm playwright test --reporter=list

# Save results
pnpm playwright test > test-results/baseline-$(date +%Y%m%d).txt

# Compare results
diff test-results/baseline-20260712.txt test-results/baseline-20260712-new.txt
```

---

## Performance Optimization

### Known Optimizations Applied

- ✅ Server reuse (reuseExistingServer)
- ✅ Browser reuse across tests
- ✅ Parallel test execution (3 browsers simultaneously)
- ✅ Screenshot/video only on failure
- ✅ Trace only on first retry

### Optimization Opportunities

| Area | Current | Potential | Effort |
|---|---|---|---|
| **Network** | Real HTTP | Mock responses | High |
| **Build Cache** | Standard | Incremental | Medium |
| **Browser Pools** | Per-project | Shared | Medium |
| **Screenshot Size** | Full page | Viewport only | Low |

---

## Historical Tracking

### Version: 2026-07-12

```
Baseline Established
- Federation: 90s
- Storybook: 75s
- Code Examples: 60s
- Total E2E: 225s

Environment: Dev machine, clean state
Browsers: All 3 (Chromium, Firefox, WebKit)
Tests: 189 E2E + 2 Unit = 191 total
```

### Future Updates

Add entries as baselines change:

```
### Version: YYYY-MM-DD

Baseline Updated: [Reason]
- Changed metric from X to Y

Investigation: [Notes]
- Found performance issue in...
- Applied optimization...
```

---

## Goals

**Short-term** (Next sprint):
- [ ] Maintain <360s for full E2E suite
- [ ] No regressions >120% baseline
- [ ] All tests passing consistently

**Medium-term** (Next 2 sprints):
- [ ] Reduce E2E suite to <200s
- [ ] Parallel execution for faster feedback
- [ ] Code coverage >70%

**Long-term** (Next quarter):
- [ ] E2E suite <120s (with mocks)
- [ ] CI/CD full run <5 minutes
- [ ] Production monitoring integrated

---

## See Also

- [Testing Guide](./TESTING.md) - How to run tests
- [Playwright Docs](https://playwright.dev) - Official docs
- [Performance Testing](https://playwright.dev/docs/test-performance) - Advanced profiling

**Last Updated**: 2026-07-12
**Next Review**: After first regression or optimization attempt
