## PR Test Checklist

Before submitting, please verify all tests pass locally:

### Testing ✅

- [ ] `pnpm lint` passes (0 errors)
- [ ] `pnpm test` passes (all unit tests)
- [ ] Code examples still valid
- [ ] No console errors or warnings
- [ ] No new test timeouts (baseline: federation ~90s, storybook ~75s)

### Quality ✅

- [ ] No breaking changes to public APIs
- [ ] Accessibility maintained (WCAG 2.1 AA)
- [ ] Markdown links valid (`pnpm lint:links`)
- [ ] Comments clear and concise

### Documentation ✅

- [ ] README updated if needed
- [ ] Code examples reflect changes
- [ ] JSDoc comments added for new functions
- [ ] Migration guide if breaking changes

### Performance ✅

- [ ] No regression in test execution time
- [ ] No new network requests
- [ ] No large bundle size increases

### Type Safety ✅

- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] All signals properly typed
- [ ] No `any` types without justification

---

**Test Status**: 
- Linting: ✅ 
- Unit: ✅ 
- E2E: ✅ (if run locally)

**Impact**: High / Medium / Low

**Related Issue**: #___

