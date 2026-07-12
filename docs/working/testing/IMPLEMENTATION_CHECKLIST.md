# Testing Implementation Checklist

**Status**: Ready to implement
**Start Date**: 2026-07-12
**Estimated Completion**: 2026-07-26 (2 weeks)

---

## Overview

This checklist provides step-by-step instructions to close the testing gaps identified in [TESTING_GAP_ANALYSIS.md](./TESTING_GAP_ANALYSIS.md).

**Priority Order**:
1. ✅ Unit tests for UI components (Critical - 6 hours)
2. ✅ Markdown linting (Critical - 2 hours)
3. ✅ Code example verification (High - 4 hours)
4. ✅ E2E tests for shell federation (High - 8 hours)
5. ✅ Storybook story validation (Medium - 6 hours)

---

## Phase 1: Unit Tests for UI Components (Critical)

**Status**: Not started
**Effort**: 6-8 hours
**Timeline**: Days 1-2

### Task 1.1: Create test files for each component

**File**: `packages/ui-patterns/src/public-empty-state.component.spec.ts`

- [ ] Create file
- [ ] Add basic test structure
- [ ] Test component creation
- [ ] Test @Input bindings
- [ ] Test @Output events
- [ ] Test Accessibility

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicEmptyStateComponent } from './public-empty-state.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicEmptyStateComponent', () => {
  let component: PublicEmptyStateComponent;
  let fixture: ComponentFixture<PublicEmptyStateComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicEmptyStateComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render with default values', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toBeTruthy();
    });
  });

  describe('@Input Bindings', () => {
    it('should display title from @Input', () => {
      const testTitle = 'Test Empty State';
      component.title = testTitle;
      fixture.detectChanges();

      const title = compiled.query(By.CSS('h2, h3'));
      expect(title.nativeElement.textContent).toContain(testTitle);
    });

    it('should display message from @Input', () => {
      const testMessage = 'No items found';
      component.message = testMessage;
      fixture.detectChanges();

      const message = compiled.query(By.CSS('p'));
      expect(message.nativeElement.textContent).toContain(testMessage);
    });
  });

  describe('@Output Events', () => {
    it('should emit action event when button clicked', () => {
      spyOn(component.action, 'emit');

      const button = compiled.query(By.CSS('button'));
      button.nativeElement.click();

      expect(component.action.emit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.detectChanges();

      const main = compiled.query(By.CSS('[role="main"]'));
      expect(main).toBeTruthy();
    });

    it('button should be keyboard accessible', () => {
      fixture.detectChanges();
      spyOn(component.action, 'emit');

      const button = compiled.query(By.CSS('button'));
      button.nativeElement.focus();
      expect(button.nativeElement).toBe(document.activeElement);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      button.nativeElement.dispatchEvent(event);
    });
  });

  describe('CSS Classes', () => {
    it('should apply appropriate CSS classes', () => {
      fixture.detectChanges();

      const container = compiled.query(By.CSS('.empty-state'));
      expect(container).toBeTruthy();
      expect(container.nativeElement.classList.contains('empty-state')).toBe(true);
    });
  });
});
```

**Checklist**:
- [ ] File created
- [ ] Tests pass locally
- [ ] All 4+ test suites pass
- [ ] Can run via `pnpm test ui-patterns`

---

**File**: `packages/ui-patterns/src/public-form-section.component.spec.ts`

- [ ] Create file
- [ ] Test component inputs (label, required flag, error state)
- [ ] Test child content projection
- [ ] Test Accessibility

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicFormSectionComponent } from './public-form-section.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicFormSectionComponent', () => {
  let component: PublicFormSectionComponent;
  let fixture: ComponentFixture<PublicFormSectionComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicFormSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicFormSectionComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('@Input Bindings', () => {
    it('should display label from @Input', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const label = compiled.query(By.CSS('label'));
      expect(label.nativeElement.textContent).toContain('Test Label');
    });

    it('should show required indicator when required=true', () => {
      component.label = 'Test Label';
      component.required = true;
      fixture.detectChanges();

      const requiredMarker = compiled.query(By.CSS('[aria-required="true"]'));
      expect(requiredMarker).toBeTruthy();
    });

    it('should show error state when error=true', () => {
      component.error = true;
      fixture.detectChanges();

      const errorElement = compiled.query(By.CSS('.error, [role="alert"]'));
      expect(errorElement).toBeTruthy();
    });
  });

  describe('Content Projection', () => {
    it('should project form controls as children', () => {
      component.label = 'Input Field';
      fixture.detectChanges();

      const content = compiled.query(By.CSS('ng-content'));
      expect(content).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      component.label = 'Test Field';
      fixture.detectChanges();

      const label = compiled.query(By.CSS('label'));
      expect(label.nativeElement.getAttribute('for')).toBeTruthy();
    });

    it('should have error role when in error state', () => {
      component.error = true;
      component.errorMessage = 'This field is required';
      fixture.detectChanges();

      const errorMsg = compiled.query(By.CSS('[role="alert"]'));
      expect(errorMsg).toBeTruthy();
    });
  });
});
```

**Checklist**:
- [ ] File created
- [ ] All tests pass
- [ ] Error state rendering verified

---

**File**: `packages/ui-patterns/src/public-page-header.component.spec.ts`

- [ ] Create file
- [ ] Test title, subtitle, breadcrumbs
- [ ] Test action buttons
- [ ] Test responsive behavior

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicPageHeaderComponent } from './public-page-header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicPageHeaderComponent', () => {
  let component: PublicPageHeaderComponent;
  let fixture: ComponentFixture<PublicPageHeaderComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicPageHeaderComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Title & Subtitle', () => {
    it('should display title from @Input', () => {
      component.title = 'Page Title';
      fixture.detectChanges();

      const title = compiled.query(By.CSS('h1, h2'));
      expect(title.nativeElement.textContent).toContain('Page Title');
    });

    it('should display subtitle when provided', () => {
      component.subtitle = 'Page subtitle';
      fixture.detectChanges();

      const subtitle = compiled.query(By.CSS('.subtitle, p'));
      expect(subtitle?.nativeElement.textContent).toContain('Page subtitle');
    });
  });

  describe('Breadcrumbs', () => {
    it('should render breadcrumbs when provided', () => {
      component.breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Parent', url: '/parent' }
      ];
      fixture.detectChanges();

      const breadcrumbs = compiled.queryAll(By.CSS('nav a, [role="navigation"] a'));
      expect(breadcrumbs.length).toBe(2);
    });
  });

  describe('Actions', () => {
    it('should emit action events', () => {
      spyOn(component.onAction, 'emit');

      component.actions = [{ label: 'Save', key: 'save' }];
      fixture.detectChanges();

      const actionButton = compiled.query(By.CSS('button'));
      actionButton.nativeElement.click();

      expect(component.onAction.emit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      component.title = 'Page Title';
      fixture.detectChanges();

      const heading = compiled.query(By.CSS('h1, h2'));
      expect(heading).toBeTruthy();
      expect(['H1', 'H2'].includes(heading.nativeElement.tagName)).toBe(true);
    });

    it('should have navigation role for breadcrumbs', () => {
      component.breadcrumbs = [{ label: 'Home', url: '/' }];
      fixture.detectChanges();

      const nav = compiled.query(By.CSS('[role="navigation"]'));
      expect(nav).toBeTruthy();
    });
  });
});
```

**Checklist**:
- [ ] File created
- [ ] Breadcrumbs rendering verified
- [ ] Action buttons tested

---

**File**: `packages/ui-patterns/src/public-status-card.component.spec.ts`

- [ ] Create file
- [ ] Test status variants (success, warning, error, info)
- [ ] Test content areas
- [ ] Test visual states

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicStatusCardComponent } from './public-status-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PublicStatusCardComponent', () => {
  let component: PublicStatusCardComponent;
  let fixture: ComponentFixture<PublicStatusCardComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicStatusCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Status Variants', () => {
    const statuses = ['success', 'warning', 'error', 'info'];

    statuses.forEach(status => {
      it(`should apply ${status} variant class`, () => {
        component.status = status;
        fixture.detectChanges();

        const card = compiled.query(By.CSS('.status-card'));
        expect(card.nativeElement.classList.contains(`status-${status}`)).toBe(true);
      });
    });

    it('should have correct color for status', () => {
      component.status = 'success';
      fixture.detectChanges();

      const icon = compiled.query(By.CSS('[data-status-icon]'));
      expect(icon?.nativeElement.getAttribute('data-status-icon')).toBe('success');
    });
  });

  describe('Content Areas', () => {
    it('should display title', () => {
      component.title = 'Operation Successful';
      fixture.detectChanges();

      const title = compiled.query(By.CSS('.status-title'));
      expect(title?.nativeElement.textContent).toContain('Operation Successful');
    });

    it('should display message', () => {
      component.message = 'Your changes have been saved';
      fixture.detectChanges();

      const message = compiled.query(By.CSS('.status-message'));
      expect(message?.nativeElement.textContent).toContain('Your changes have been saved');
    });
  });

  describe('Actions', () => {
    it('should show action button when provided', () => {
      component.actionLabel = 'Undo';
      fixture.detectChanges();

      const button = compiled.query(By.CSS('button'));
      expect(button?.nativeElement.textContent).toContain('Undo');
    });

    it('should emit action event when button clicked', () => {
      spyOn(component.onAction, 'emit');
      component.actionLabel = 'Undo';
      fixture.detectChanges();

      const button = compiled.query(By.CSS('button'));
      button?.nativeElement.click();

      expect(component.onAction.emit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate ARIA role', () => {
      component.status = 'error';
      fixture.detectChanges();

      const card = compiled.query(By.CSS('[role="alert"]'));
      expect(card).toBeTruthy();
    });

    it('should have status indication for screen readers', () => {
      component.status = 'success';
      fixture.detectChanges();

      const statusText = compiled.query(By.CSS('[aria-live="polite"]'));
      expect(statusText).toBeTruthy();
    });
  });
});
```

**Checklist**:
- [ ] File created
- [ ] All status variants tested
- [ ] Actions verified

---

### Task 1.2: Add test target to `packages/ui-patterns/project.JSON`

**Location**: `packages/ui-patterns/project.JSON`

**Change**:
```JSON
{
  "name": "ui-patterns",
  "$schema": "../../node_modules/nx/schemas/project-schema.JSON",
  "sourceRoot": "packages/ui-patterns/src",
  "projectType": "library",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm --dir packages/ui-patterns build"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "cd packages/ui-patterns && pnpm test"
      }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm --dir packages/ui-patterns typecheck"
      }
    }
  },
  "tags": ["scope:design-system", "type:patterns"]
}
```

**Checklist**:
- [ ] Test target added
- [ ] Can run: `pnpm nx test ui-patterns`
- [ ] Tests execute successfully

---

### Task 1.3: Verify test execution

```bash
# Run tests for ui-patterns
pnpm test ui-patterns

# Expected output:
# ✓ PublicEmptyStateComponent
# ✓ PublicFormSectionComponent
# ✓ PublicPageHeaderComponent
# ✓ PublicStatusCardComponent
#
# Test Suites: 4 passed
# Tests:       40+ passed
```

**Checklist**:
- [ ] All component tests pass
- [ ] Coverage report generated
- [ ] No console errors

---

## Phase 2: Markdown Linting (Critical)

**Status**: Not started
**Effort**: 2 hours
**Timeline**: Day 2

### Task 2.1: Install markdown linter

```bash
pnpm add -D markdownlint-cli2 remark-cli remark-preset-lint-consistent
```

**Checklist**:
- [ ] Packages installed
- [ ] Can run: `npx markdownlint-cli2 --version`

---

### Task 2.2: Create `.markdownlint.JSON`

**File**: `.markdownlint.JSON`

```JSON
{
  "extends": "default",
  "line-length": {
    "line_length": 120,
    "heading_line_length": 120,
    "headers": true,
    "code_blocks": false,
    "code_inline": false
  },
  "no-hard-tabs": true,
  "no-trailing-punctuation": false,
  "required-headings": {
    "present": true
  },
  "proper-names": {
    "names": ["Angular", "TypeScript", "PrimeNG", "Storybook", "Nx", "Playwright", "Zeroheight"],
    "code_blocks": false
  }
}
```

**Checklist**:
- [ ] File created
- [ ] Can test: `npx markdownlint-cli2 docs/design-system/README.md`

---

### Task 2.3: Update `scripts/lint-workspace.mjs`

**Add to file**:
```javascript
// After JSON validation, add:
console.log('Linting Markdown files...');
run('npx', ['markdownlint-cli2', 'docs/**/*.md']);

console.log('All linting checks passed!');
```

**Location**: Add before the final success message in `scripts/lint-workspace.mjs`

**Checklist**:
- [ ] Linting code added
- [ ] Can run: `pnpm lint`
- [ ] Markdown files are validated

---

### Task 2.4: Fix any markdown issues

```bash
# Check for issues
pnpm lint

# Common fixes:
# - Trailing whitespace
# - Missing headings
# - Link formatting
# - Line length (auto-wrap at 120 chars)
```

**Checklist**:
- [ ] No linting errors
- [ ] All docs pass validation

---

## Phase 3: Code Example Verification (High)

**Status**: Not started
**Effort**: 4 hours
**Timeline**: Days 3-4

### Task 3.1: Create code example test file

**File**: `docs/design-system/CODE_EXAMPLES.test.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { UiButtonComponent } from '@public-sector/ui-patterns';

describe('CODE_EXAMPLES: Documentation Code Snippets', () => {

  describe('Component Import', () => {
    it('should import UiButtonComponent from @public-sector/ui-patterns', () => {
      expect(UiButtonComponent).toBeDefined();
    });

    it('should be usable as standalone component', () => {
      TestBed.configureTestingModule({
        imports: [UiButtonComponent],
      });

      const fixture = TestBed.createComponent(UiButtonComponent);
      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  describe('Token CSS Variables', () => {
    it('primary token should be defined', () => {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      const value = computed.getPropertyValue('--color-primary-500');

      expect(value.trim()).toBeTruthy();
    });

    it('spacing token should be defined', () => {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      const value = computed.getPropertyValue('--spacing-md');

      expect(value.trim()).toBeTruthy();
    });

    it('all documented tokens should exist', () => {
      const documentedTokens = [
        '--color-primary-500',
        '--color-secondary-500',
        '--spacing-sm',
        '--spacing-md',
        '--spacing-lg',
        '--font-size-base',
        '--border-radius-sm'
      ];

      const root = document.documentElement;
      const computed = getComputedStyle(root);

      documentedTokens.forEach(token => {
        const value = computed.getPropertyValue(token);
        expect(value.trim()).toBeTruthy(`Token ${token} not defined`);
      });
    });
  });

  describe('Example Code Patterns', () => {
    it('component with @Input properties should render', () => {
      TestBed.configureTestingModule({
        imports: [UiButtonComponent],
      });

      const fixture = TestBed.createComponent(UiButtonComponent);
      const component = fixture.componentInstance;

      // Test example from CODE_EXAMPLES.md
      component.label = 'Save';
      component.variant = 'primary';

      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Save');
    });

    it('should emit events as documented', () => {
      TestBed.configureTestingModule({
        imports: [UiButtonComponent],
      });

      const fixture = TestBed.createComponent(UiButtonComponent);
      const component = fixture.componentInstance;

      spyOn(component.click, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(component.click.emit).toHaveBeenCalled();
    });
  });

  describe('Storybook Story Pattern', () => {
    it('story template syntax is valid', () => {
      // Verify the template syntax documented works
      const template = `<ui-button [label]="label" [variant]="variant"></ui-button>`;
      expect(template).toContain('ui-button');
    });
  });
});
```

**Checklist**:
- [ ] File created
- [ ] Tests pass: `pnpm test`
- [ ] Code examples verified as accurate

---

### Task 3.2: Run test and fix examples

```bash
pnpm test CODE_EXAMPLES.test.ts

# If failures occur:
# 1. Check example code in docs
# 2. Update docs if API changed
# 3. Re-run tests
```

**Checklist**:
- [ ] All tests pass
- [ ] Examples match actual code

---

## Phase 4: E2E Tests for Shell Federation (High)

**Status**: Not started
**Effort**: 8 hours
**Timeline**: Days 5-6

### Task 4.1: Create Playwright config

**File**: `Playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/shell/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'HTML',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: [
    {
      command: 'pnpm serve:shell',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm serve:services',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

**Checklist**:
- [ ] File created
- [ ] Config is valid TypeScript

---

### Task 4.2: Create federation test suite

**File**: `apps/shell/E2E/federation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shell Federation', () => {
  test('should load shell at port 4200', async ({ page }) => {
    await page.goto('http://localhost:4200');

    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should mount services-remote under /services', async ({ page }) => {
    await page.goto('http://localhost:4200/services');

    // Wait for remote to load
    await page.waitForTimeout(1000);

    // Verify content loaded
    const content = page.locator('[data-testid="services-content"]');
    await expect(content).toBeVisible();
  });

  test('should share tokens across remotes', async ({ page }) => {
    await page.goto('http://localhost:4200/services');

    // Get computed style from remote
    const button = page.locator('button').first();
    const bgColor = await button.evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    // Should be using token color, not default
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should maintain navigation state across remotes', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Navigate to services
    await page.click('a[href="/services"]');
    await page.waitForURL('**/services');

    // Navigate back
    await page.click('a[href="/"]');
    await page.waitForURL('http://localhost:4200/');

    expect(page.url()).toBe('http://localhost:4200/');
  });

  test('should handle navigation between all remotes', async ({ page }) => {
    const remotes = [
      { name: 'Services', path: '/services' },
      { name: 'Admin', path: '/admin' },
      { name: 'Reporting', path: '/reporting' },
      { name: 'QA', path: '/qa' },
    ];

    for (const remote of remotes) {
      await page.goto(`http://localhost:4200${remote.path}`);
      await expect(page).toHaveURL(`*${remote.path}`);
    }
  });
});

test.describe('Federation Error Handling', () => {
  test('should show error if remote fails to load', async ({ page }) => {
    // Simulate remote failure
    await page.route('**/services-remote/**', route => {
      route.abort('failed');
    });

    await page.goto('http://localhost:4200/services');

    // Should show error state or fallback
    const errorMsg = page.locator('[role="alert"]');
    await expect(errorMsg).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Token Inheritance', () => {
  test('remote components should use shell tokens', async ({ page }) => {
    await page.goto('http://localhost:4200/services');

    const elemStyle = await page.locator('.component-wrapper').first().evaluate((el) => {
      return {
        color: getComputedStyle(el).color,
        fontSize: getComputedStyle(el).fontSize,
      };
    });

    // Verify custom token is applied
    expect(elemStyle.color).toBeTruthy();
    expect(elemStyle.fontSize).toBeTruthy();
  });
});
```

**Checklist**:
- [ ] File created
- [ ] Tests compile successfully

---

### Task 4.3: Run E2E tests

```bash
# Install Playwright if needed
pnpm exec playwright install

# Run tests
pnpm exec playwright test apps/shell/e2e/federation.spec.ts

# Expected output:
# federation.spec.ts 6 passed
```

**Checklist**:
- [ ] All federation tests pass
- [ ] No timeout errors
- [ ] All remotes load correctly

---

## Phase 5: Storybook Story Validation (Medium)

**Status**: Not started
**Effort**: 6 hours
**Timeline**: Days 7-8

### Task 5.1: Create story validation tests

**File**: `apps/qa-remote/E2E/Storybook-stories.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Storybook Stories', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook
    await page.goto('http://localhost:4400');
  });

  test('should render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:4400/?path=/story/components-button--primary');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('http://localhost:4400/?path=/story/components-button--primary');

    const button = page.locator('button').first();

    // Focus and activate via keyboard
    await button.focus();
    await button.press('Space');

    // Should not throw
    expect(button).toBeTruthy();
  });

  test('should pass Accessibility checks', async ({ page }) => {
    await page.goto('http://localhost:4400/?path=/story/components-button--primary');

    await injectAxe(page);
    await checkA11y(page, '#storybook-root', null, {
      detailedReport: true,
      detailedReportOptions: {
        HTML: true,
      },
    });
  });

  test('story controls should work', async ({ page }) => {
    await page.goto('http://localhost:4400/?path=/story/components-button--primary&args=label:Click+Me');

    const button = page.locator('button').first();
    await expect(button).toContainText('Click Me');
  });
});

test.describe('Component Registry in Storybook', () => {
  test('all documented components should have stories', async ({ page }) => {
    const components = [
      'button',
      'card',
      'modal',
      'form-section',
      'empty-state',
      'status-card',
    ];

    for (const component of components) {
      await page.goto(`http://localhost:4400/?path=/story/components-${component}--primary`);

      const story = page.locator('#storybook-root');
      await expect(story).toBeVisible();
    }
  });
});
```

**Checklist**:
- [ ] File created
- [ ] Tests compile

---

### Task 5.2: Run story validation

```bash
# Start Storybook first
pnpm storybook:qa &

# Run tests
pnpm exec playwright test apps/qa-remote/e2e/storybook-stories.spec.ts

# Expected output:
# storybook-stories.spec.ts N passed
```

**Checklist**:
- [ ] All story tests pass
- [ ] Accessibility checks pass
- [ ] No console errors

---

## Phase 6: Documentation Link Validation (Optional)

**Status**: Not started
**Effort**: 2 hours
**Timeline**: Day 9 (if time allows)

### Task 6.1: Install link checker

```bash
pnpm add -D markdown-link-check
```

---

### Task 6.2: Add link validation to lint script

```javascript
// In scripts/lint-workspace.mjs
run('npx', ['markdown-link-check', 'docs/design-system/**/*.md', '--config', '.markdown-link-check.JSON']);
```

**Checklist**:
- [ ] Link checker installed
- [ ] All documentation links valid

---

## Integration: Update CI/CD Pipeline

### Step 1: Update npm scripts in `package.JSON`

```JSON
{
  "scripts": {
    "lint": "node scripts/lint-workspace.mjs",
    "test": "pnpm nx run-many -t test",
    "test:components": "pnpm nx test ui-patterns",
    "test:e2e": "pnpm exec playwright test",
    "test:e2e:ui": "pnpm exec playwright test apps/shell/e2e",
    "test:all": "pnpm lint && pnpm test:components && pnpm test:e2e"
  }
}
```

### Step 2: Create pre-commit hook

**File**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint
pnpm test:components
```

**Install Husky**:
```bash
pnpm add -D husky
pnpm exec husky install
```

---

## Verification Checklist

### Phase 1: ✅ Component Tests
- [ ] All 4 components have test files
- [ ] `pnpm test ui-patterns` passes
- [ ] Coverage > 80%

### Phase 2: ✅ Markdown Linting
- [ ] markdownlint installed
- [ ] `pnpm lint` runs markdown checks
- [ ] No linting errors

### Phase 3: ✅ Code Examples
- [ ] CODE_EXAMPLES.test.ts created
- [ ] All examples verified
- [ ] Documentation stays accurate

### Phase 4: ✅ E2E Federation Tests
- [ ] Playwright.config.ts created
- [ ] `pnpm test:E2E:ui` passes
- [ ] All remotes tested

### Phase 5: ✅ Storybook Validation
- [ ] Story tests pass
- [ ] Accessibility checks pass
- [ ] No console errors

### Phase 6: ✅ Documentation Links
- [ ] All links valid
- [ ] No broken references

---

## Success Criteria

**Must Have**:
- ✅ 0 failing tests
- ✅ 0 linting errors
- ✅ Code examples accurate
- ✅ Federation verified working

**Should Have**:
- ✅ 80%+ component test coverage
- ✅ All docs pass linting
- ✅ All links valid
- ✅ E2E tests for all critical paths

**Nice to Have**:
- ✅ Visual regression tests
- ✅ Performance benchmarks
- ✅ Coverage reports on CI

---

## Timeline Summary

| Phase | Task | Days | Status |
|-------|------|------|--------|
| 1 | Unit Tests (4 components) | 1-2 | Not started |
| 2 | Markdown Linting | 2 | Not started |
| 3 | Code Example Verification | 3-4 | Not started |
| 4 | E2E Federation Tests | 5-6 | Not started |
| 5 | Storybook Validation | 7-8 | Not started |
| 6 | Documentation Links | 9 | Optional |

**Total Estimated Time**: 8-9 days, 28-32 hours

**Recommended Pace**: 4 hours/day over 2 weeks

---

**Created**: 2026-07-12
**Updated**: 2026-07-12
**Next Review**: After Phase 1 completion
