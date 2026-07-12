# Phase 1 Quick Start Guide

**Duration**: 8-10 hours  
**Effort Level**: Medium (straightforward template-based work)  
**Deadline**: End of Week 1  
**Result**: 4 component tests + markdown linting enabled

---

## What You'll Do Today

### 1. Component Tests (6-8 hours)
Create unit test files for 4 Angular components in `packages/ui-patterns/src/`:
- ✅ public-empty-state.component.spec.ts
- ✅ public-form-section.component.spec.ts  
- ✅ public-page-header.component.spec.ts
- ✅ public-status-card.component.spec.ts

### 2. Markdown Linting (2 hours)
Install and enable markdown validation:
- ✅ Add markdownlint-cli2 to package.json
- ✅ Create .markdownlint.json
- ✅ Update scripts/lint-workspace.mjs
- ✅ Run linter and fix issues

---

## Task 1: Create First Component Test (30 min)

### Step 1: Create file
```bash
# Create empty file
touch packages/ui-patterns/src/public-empty-state.component.spec.ts
```

### Step 2: Copy template (from TESTING_IMPLEMENTATION_CHECKLIST.md)
Open `TESTING_IMPLEMENTATION_CHECKLIST.md` and find "Task 1.1" section.

Copy the entire test code block under "public-empty-state.component.spec.ts" and paste into your new file.

### Step 3: Save and verify syntax
```bash
# Check TypeScript compilation
npx tsc --noEmit packages/ui-patterns/src/public-empty-state.component.spec.ts
```

Should show no errors (or only missing component reference, which is OK).

---

## Task 2: Create Test Target (10 min)

### Open file
`packages/ui-patterns/project.json`

### Find this section:
```json
"targets": {
  "build": { ... },
  "typecheck": { ... }
}
```

### Add test target after build:
```json
"test": {
  "executor": "nx:run-commands",
  "options": {
    "command": "cd packages/ui-patterns && pnpm test"
  }
}
```

### Save file

---

## Task 3: Repeat for Other 3 Components (2.5 hours)

**Timeline**:
- public-form-section.component.spec.ts (30 min)
- public-page-header.component.spec.ts (30 min)
- public-status-card.component.spec.ts (30 min)
- Testing all 4 (30 min)

### For each component:
1. Open TESTING_IMPLEMENTATION_CHECKLIST.md
2. Find the component section (Task 1.1)
3. Copy the test template
4. Create `component-name.spec.ts` file
5. Paste code
6. Save

---

## Task 4: Enable Markdown Linting (2 hours)

### Step 1: Install linter
```bash
pnpm add -D markdownlint-cli2 remark-cli
```

Takes ~2 min. Go grab coffee ☕

### Step 2: Create config file
Create `.markdownlint.json` in root:

```json
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
    "names": ["Angular", "TypeScript", "PrimeNG", "Storybook", "Nx"],
    "code_blocks": false
  }
}
```

### Step 3: Update lint script
Open `scripts/lint-workspace.mjs`

Find the line near the end that says something like:
```javascript
console.log('All checks passed!');
```

**Before that line, add**:
```javascript
console.log('Linting Markdown files...');
run('npx', ['markdownlint-cli2', 'docs/**/*.md']);
```

### Step 4: Test linting
```bash
pnpm lint
```

If you get errors, that's normal. Fix them:
- Most common: Line too long (wrap at 120 chars)
- Missing headings (add headers to markdown files)
- Trailing spaces (remove spaces at end of lines)

### Step 5: Until passing
Keep fixing until `pnpm lint` shows:
```
All linting checks passed! ✅
```

---

## Verification Checklist

### Component Tests

- [ ] `public-empty-state.component.spec.ts` created
- [ ] `public-form-section.component.spec.ts` created
- [ ] `public-page-header.component.spec.ts` created
- [ ] `public-status-card.component.spec.ts` created
- [ ] Test target added to `packages/ui-patterns/project.json`

### Linting

- [ ] `markdownlint-cli2` installed
- [ ] `.markdownlint.json` created
- [ ] `scripts/lint-workspace.mjs` updated
- [ ] `pnpm lint` passes with 0 errors

### Final Verification

Run this command:
```bash
pnpm lint && pnpm test:components
```

Expected output:
```
✅ All linting checks passed
✅ Component tests passing
```

---

## Common Issues & Fixes

### Issue 1: `pnpm: command not found`
**Fix**: Make sure pnpm is installed
```bash
npm install -g pnpm
```

### Issue 2: Test file shows red squiggles
**Fix**: VSCode needs to load TypeScript. Try:
1. Open command palette: Ctrl+Shift+P
2. Type "TypeScript: Reload Projects"
3. Press Enter

### Issue 3: `Cannot find module '@angular/core/testing'`
**Fix**: Angular testing is built-in. Make sure file is `.spec.ts`:
- ❌ wrong: `component.test.ts`
- ✅ right: `component.spec.ts`

### Issue 4: Markdown linting too strict
**Fix**: The .markdownlint.json can be adjusted. Most errors are:
- **Line too long**: Wrap at 120 chars
- **Trailing spaces**: Remove spaces at end of lines
- **Hard tabs**: Use spaces instead

### Issue 5: `Cannot find template for component`
**Fix**: Totally fine! The component might use inline templates. Tests still validate the component exists and has right structure.

---

## Tips for Success

### Before You Start
- [ ] Read this document completely
- [ ] Open TESTING_IMPLEMENTATION_CHECKLIST.md in another tab
- [ ] Bookmark the "Task 1.1" section for quick reference

### While Working
- [ ] Copy-paste code exactly from templates
- [ ] Test after each component (don't do all 4 then test)
- [ ] Use `pnpm lint` frequently to catch issues early
- [ ] Take a break if stuck - fresh eyes help!

### Time Management
- **Hour 1**: public-empty-state test
- **Hour 2**: public-form-section test
- **Hour 3**: public-page-header test
- **Hour 4**: public-status-card test
- **Hour 5**: Markdown linting setup
- **Hour 6-8**: Fix linting issues & verify all tests pass

---

## Success Looks Like

After Phase 1:

```bash
$ pnpm lint
✅ All linting checks passed

$ pnpm test:components
PASS  packages/ui-patterns/src/public-empty-state.component.spec.ts
PASS  packages/ui-patterns/src/public-form-section.component.spec.ts
PASS  packages/ui-patterns/src/public-page-header.component.spec.ts
PASS  packages/ui-patterns/src/public-status-card.component.spec.ts

Test Suites: 4 passed, 4 total
Tests:       40+ passed
```

---

## What's Next (After Phase 1)

After you finish Phase 1 and get approval:

1. **Phase 2** (Days 3-6): E2E federation tests + code example verification (12 hrs)
2. **Phase 3** (Days 7-9): Storybook validation + docs links (8 hrs)

Each phase builds on the previous one but can be done by different people.

---

## Key Files to Reference

| File | Purpose |
|------|---------|
| `TESTING_IMPLEMENTATION_CHECKLIST.md` | Copy test code from here |
| `.markdownlint.json` | Linting rules config |
| `scripts/lint-workspace.mjs` | Where linting runs |
| `packages/ui-patterns/project.json` | Add test target here |
| `TESTING_STRATEGY.md` | Why we're doing this |

---

## Quick Commands

```bash
# Run linting (validates markdown, JSON, etc)
pnpm lint

# Run component tests
pnpm test:components

# Or individually
pnpm nx test ui-patterns

# Watch mode (tests rerun on save)
pnpm nx test ui-patterns --watch

# See all available commands
pnpm nx list
```

---

## When You Get Stuck

**Option 1**: Check this Quick Start Guide (you're reading it!)

**Option 2**: Check TESTING_IMPLEMENTATION_CHECKLIST.md for detailed steps

**Option 3**: Check TESTING_GAP_ANALYSIS.md for background context

**Option 4**: Ask a teammate who completed Phase 1

**Option 5**: Check the error message - often tells you exactly what's wrong

---

## Estimated Time Breakdown

| Task | Time | Est. Complete |
|------|------|---|
| Setup & read guide | 15 min | 9:15 AM |
| Component 1 (empty-state) | 30 min | 9:45 AM |
| Component 2 (form-section) | 30 min | 10:15 AM |
| Component 3 (page-header) | 30 min | 10:45 AM |
| Component 4 (status-card) | 30 min | 11:15 AM |
| Test run & fixes | 30 min | 11:45 AM |
| **Lunch break** | 1 hr | 12:45 PM |
| Install linter | 5 min | 12:50 PM |
| Create .markdownlint.json | 10 min | 1:00 PM |
| Update lint script | 10 min | 1:10 PM |
| Run linting & fix issues | 1 hr | 2:10 PM |
| Final verification | 15 min | 2:25 PM |
| **DONE** | | ✅ 2:30 PM |

**Total: 8-10 hours (realistic with breaks)**

---

## You've Got This! 💪

This is straightforward, well-documented work. You're copying templates, pasting code, and running commands. No complex architecture or design decisions needed.

Each test file follows the same pattern. Each markdown fix is simple (spaces, line wrapping).

**After today**: Your components will be protected. Tomorrow you can feel confident making changes.

---

**Created**: 2026-07-12  
**For**: First implementation of Phase 1  
**Questions?** Check TESTING_IMPLEMENTATION_CHECKLIST.md for detailed instructions
