# Testing & Linting Gap Analysis

**Date**: 2026-07-12
**Status**: Critical gaps identified
**Severity**: HIGH - Components untested, documentation unchecked

---

## Executive Summary

**Critical Issues**:
- ❌ 0 unit tests for `packages/ui-patterns/` components
- ❌ 0 E2E tests for shell federation
- ❌ No markdown linting for documentation
- ❌ No code example verification
- ❌ No Storybook story validation

**Current Testing**:
- ✅ 1 test file: `apps/agile-API/test/agile.service.test.ts` (backend only)
- ✅ Lint script validates JSON and story count only

---

## 1. Component Testing Gaps

### Status: MISSING ENTIRELY

**Components without tests** (in `packages/ui-patterns/src/`):

```
❌ public-empty-state.component.ts         (no .spec.ts)
❌ public-form-section.component.ts        (no .spec.ts)
❌ public-page-header.component.ts         (no .spec.ts)
❌ public-status-card.component.ts         (no .spec.ts)
```

**What's needed**:
- [ ] Unit tests for each component (props, events, rendering)
- [ ] Accessibility tests (aria-labels, roles)
- [ ] Visual regression tests
- [ ] Integration tests (components used together)

### Example: Missing Tests

**Component**: `public-empty-state.component.ts`
```typescript
// NO TESTS exist for:
// - Component initialization
// - @Input title binding
// - @Input message binding
// - @Output action click
// - CSS class application
// - Accessibility attributes
```

**Required test file**: `public-empty-state.component.spec.ts`
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicEmptyStateComponent } from './public-empty-state.component';

describe('PublicEmptyStateComponent', () => {
  let component: PublicEmptyStateComponent;
  let fixture: ComponentFixture<PublicEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title from @Input', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Test Title');
  });

  it('should emit action event when button clicked', () => {
    spyOn(component.action, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.action.emit).toHaveBeenCalled();
  });

  it('should have accessible attributes', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
```

---

## 2. Documentation Testing Gaps

### Status: NO LINTING

**Issues**:
- ❌ Markdown files not linted (no prose rules)
- ❌ Code examples in documentation not verified
- ❌ Links not validated
- ❌ Spelling/grammar not checked

**Files affected**:
```
docs/design-system/README.md                      (341 words)
docs/design-system/CODE_EXAMPLES.md              (1,620 words)
docs/design-system/TROUBLESHOOTING.md            (1,841 words)
docs/design-system/documentation/LEAN_PDF_GUIDE.md (3,027 words)
docs/design-system/zeroheight/*.md               (8,558 words)
docs/design-system/architecture/**/*.md          (18,500 words)
```

### Required: Markdown Linting Setup

**Add to package.JSON**:
```JSON
{
  "devDependencies": {
    "markdownlint-cli2": "^0.12.0",
    "remark-cli": "^12.0.0",
    "remark-preset-lint-consistent": "^5.1.2"
  },
  "scripts": {
    "lint:markdown": "markdownlint-cli2 'docs/**/*.md'",
    "lint:docs": "remark docs/design-system"
  }
}
```

**Create `.markdownlint.JSON`**:
```JSON
{
  "line-length": false,
  "no-hard-tabs": true,
  "no-trailing-punctuation": false,
  "required-headings": true
}
```

---

## 3. Code Example Verification Gaps

### Status: NO VALIDATION

**Issue**: Documentation contains code examples that aren't tested

**Examples at risk**:
- CODE_EXAMPLES.md → Token usage code
- LEAN_PDF_GUIDE.md → Component usage code
- zeroheight/FOR_DEVELOPERS.md → API examples

### Example Problem

**In CODE_EXAMPLES.md**:
```typescript
// DOCUMENTED CODE (not verified to work)
import { UiButtonComponent } from '@public-sector/ui-patterns';

@Component({
  selector: 'app-my-feature',
  template: `<ui-button label="Save" (onClick)="onSave()"></ui-button>`,
  imports: [UiButtonComponent]
})
export class MyFeatureComponent {
  onSave() { ... }
}
```

**Problem**:
- ❌ No test file imports this component
- ❌ Code could be out of date
- ❌ API could have changed

### Required: Code Example Tests

Create test file: `docs/design-system/CODE_EXAMPLES.test.ts`
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from '@public-sector/ui-patterns';

describe('CODE_EXAMPLES: Token Usage', () => {
  // Test code snippets from CODE_EXAMPLES.md

  it('should import and use UiButtonComponent as documented', () => {
    TestBed.configureTestingModule({
      imports: [UiButtonComponent]
    });
    expect(UiButtonComponent).toBeDefined();
  });

  it('token CSS variables should be defined', () => {
    const style = getComputedStyle(document.documentElement);
    expect(style.getPropertyValue('--color-primary-500')).toBeTruthy();
    expect(style.getPropertyValue('--spacing-md')).toBeTruthy();
  });
});
```

---

## 4. Storybook Story Validation Gaps

### Status: PARTIAL - Linted but not E2E tested

**What's checked**:
- ✅ Story files exist (in `scripts/lint-workspace.mjs`)
- ✅ Story count is tallied

**What's NOT checked**:
- ❌ Stories actually render without errors
- ❌ Components display correctly in all viewports
- ❌ Accessibility tests pass in stories
- ❌ Story props match component API

### Example: Missing Story Validation

**In `apps/qa-remote/src/stories/`** - no E2E tests verify:
```typescript
// Story exists but is it valid?
export const Default: Story = {
  args: { label: 'Click me', variant: 'primary' },
};

// Questions:
// ❌ Does component accept variant prop?
// ❌ Does it render without console errors?
// ❌ Can the label change dynamically?
// ❌ Is it accessible (keyboard navigation)?
```

### Required: Story Validation E2E Tests

Create: `apps/qa-remote/E2E/Storybook-stories.E2E.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Storybook Stories Validation', () => {
  test('Button Default story renders', async ({ page }) => {
    await page.goto('http://localhost:4400/?path=/story/components-button--default');

    const button = page.locator('button').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click me');
  });

  test('Button story is accessible', async ({ page }) => {
    await page.goto('http://localhost:4400/?path=/story/components-button--default');

    const button = page.locator('button').first();
    await button.focus();
    await button.press('Space');
    // Should trigger click without error
  });

  test('No console errors in stories', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('http://localhost:4400/?path=/story/components-button--default');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });
});
```

---

## 5. E2E Testing Gaps

### Status: MISSING

**What's NOT tested**:
- ❌ Shell + remote federation (mounting works?)
- ❌ Token inheritance across remotes
- ❌ Cross-remote navigation
- ❌ Component usage in real app
- ❌ Webhook automation flow

### Example: Missing E2E Test for Federation

**Critical flow untested**:
```
1. Shell serves at localhost:4200
2. Admin-remote mounts at path /admin
3. Components use shared tokens
4. Theme change propagates to all remotes
```

**Required**: `apps/shell/E2E/federation.E2E.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Shell Federation', () => {
  test('Admin remote mounts inside shell', async ({ page }) => {
    await page.goto('http://localhost:4200/admin');

    // Should load admin-remote content inside shell
    const content = page.locator('[data-remote="admin"]');
    await expect(content).toBeVisible();
  });

  test('Tokens are inherited by remotes', async ({ page }) => {
    await page.goto('http://localhost:4200/admin');

    const button = page.locator('ui-button').first();
    const bgColor = await button.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // Should use token value, not default
    expect(bgColor).toBe('rgb(var(--color-primary-500))');
  });

  test('Theme change affects all remotes', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Change theme
    await page.click('[data-theme-toggle]');

    // Navigate to admin remote
    await page.goto('http://localhost:4200/admin');

    // Admin should have new theme colors
    const style = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--theme-mode')
    );
    expect(style).toContain('dark');
  });
});
```

---

## 6. Linting Coverage Gaps

### Status: MINIMAL - JSON only

**Currently linted**:
- ✅ JSON files (package.JSON, nx.JSON, tsconfig.JSON)
- ✅ Storybook story file count

**NOT linted**:
- ❌ TypeScript code (no eslint)
- ❌ Markdown documentation (no markdownlint)
- ❌ SCSS/CSS (no stylelint)
- ❌ Accessibility in code (no axe rules)
- ❌ Code examples accuracy

### Required: Complete Linting Setup

**Add to scripts/lint-workspace.mjs**:
```javascript
// Add TypeScript linting
run('eslint', [
  'packages/**/*.ts',
  'apps/**/*.ts',
  '!**/node_modules/**'
]);

// Add Markdown linting
run('markdownlint-cli2', [
  'docs/**/*.md'
]);

// Validate code examples
run('npx', ['vitest', 'run', 'CODE_EXAMPLES.test.ts']);

// Check docs links
run('npx', ['markdown-link-check', 'docs/**/*.md']);
```

---

## 7. Documentation Integrity Gaps

### Status: NO VALIDATION

**What could break**:
- 📌 Links to deleted files
- 📌 Code examples using old APIs
- 📌 Storybook localhost:4400 references (port could change)
- 📌 Command examples that don't exist
- 📌 File paths that moved

### Missing Validation Script

Create: `scripts/validate-documentation.mjs`
```javascript
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const docsDir = 'docs/design-system';

// 1. Validate all links exist
// 2. Validate all commands in code blocks work
// 3. Validate all file paths exist
// 4. Validate all localhost references match actual ports
// 5. Check for broken image references
// 6. Verify code examples have correct imports
```

---

## Recommended Action Plan

### Phase 1: Critical (This Week)

**Priority 1: Unit Tests for Components**
```bash
# Create test files for each component
packages/ui-patterns/src/
  ├─ public-empty-state.component.spec.ts
  ├─ public-form-section.component.spec.ts
  ├─ public-page-header.component.spec.ts
  └─ public-status-card.component.spec.ts

# Add to project.JSON: test target
# Run: pnpm nx test ui-patterns
```

**Effort**: 4-6 hours (30 min per component)
**Impact**: ✅ Prevent component API breaking changes

---

**Priority 2: Documentation Linting**
```bash
# Install markdown linter
pnpm add -D markdownlint-cli2 remark-cli

# Add to scripts/lint-workspace.mjs
run('markdownlint-cli2', ['docs/**/*.md']);

# Run: pnpm lint (will validate markdown)
```

**Effort**: 1-2 hours
**Impact**: ✅ Catch typos, broken links in docs

---

### Phase 2: Important (Next 2 Weeks)

**Priority 3: Code Example Verification**
```typescript
// Create docs/design-system/CODE_EXAMPLES.test.ts
// Test each code snippet in docs
// Verify imports work
// Verify APIs haven't changed
```

**Effort**: 3-4 hours
**Impact**: ✅ Documentation stays accurate

---

**Priority 4: E2E Tests for Federation**
```typescript
// Create apps/shell/e2e/federation.e2e.ts
// Test shell mounting remotes
// Test token inheritance
// Test theme switching
```

**Effort**: 6-8 hours
**Impact**: ✅ Prevent federation breakage

---

### Phase 3: Nice-to-Have (Later)

**Priority 5: Storybook Story Validation**
- E2E tests for story rendering
- Accessibility validation in stories
- Visual regression testing

**Priority 6: Full Documentation Validation**
- Link checking
- File path validation
- Command verification

---

## Quick Implementation Guide

### Step 1: Add Unit Tests (Fastest Win)

```bash
# 1. Create test file
cat > packages/ui-patterns/src/public-empty-state.component.spec.ts << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicEmptyStateComponent } from './public-empty-state.component';

describe('PublicEmptyStateComponent', () => {
  let component: PublicEmptyStateComponent;
  let fixture: ComponentFixture<PublicEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF

# 2. Add to project.JSON test target
# 3. Run: pnpm test ui-patterns
```

### Step 2: Add Markdown Linting

```bash
# 1. Install
pnpm add -D markdownlint-cli2

# 2. Add to scripts
echo 'run("markdownlint-cli2", ["docs/**/*.md"]);' >> scripts/lint-workspace.mjs

# 3. Run: pnpm lint
```

---

## Current Test Status Matrix

| Item | Status | Tests | Gap |
|------|--------|-------|-----|
| **Agile API** | ✅ Tested | 1 file | Small |
| **Token Package** | ⚠️ Built | 0 files | Build task exists |
| **UI Components** | ❌ Untested | 0 files | **CRITICAL** |
| **Shell App** | ❌ Untested | 0 files | **CRITICAL** |
| **Remotes** | ❌ Untested | 0 files | **CRITICAL** |
| **Storybook** | ⚠️ Linted count | 0 E2E | Medium |
| **Documentation** | ❌ Unlinted | 0 checks | **CRITICAL** |
| **Code Examples** | ❌ Unverified | 0 tests | **CRITICAL** |

---

## Risk Assessment

**If we don't add tests**:
1. ❌ Component APIs could break silently
2. ❌ Documentation examples could be wrong
3. ❌ Shell federation could fail and we'd only find out in production
4. ❌ New developer onboarding will be painful (no safety net)

**If we add tests now**:
1. ✅ Catch breaking changes early
2. ✅ Documentation stays accurate
3. ✅ Confidence in deployment
4. ✅ New developers can modify code safely

---

## Success Criteria

- ✅ All components have unit tests (80%+ coverage)
- ✅ Markdown documentation passes linter
- ✅ Code examples verified to work
- ✅ E2E tests for critical flows
- ✅ Lint runs on every commit (via pre-commit hook)

---

**Prepared**: 2026-07-12
**Next Review**: After Phase 1 completion
