# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\shell\e2e\federation.spec.ts >> Shell Module Federation >> should load shell application
- Location: apps\shell\e2e\federation.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('app-root')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('app-root')

```

```yaml
- complementary:
  - text: PS
  - strong: Public Sector Portal
  - text: Federated services platform
  - navigation "Federated modules":
    - link "Citizen Services":
      - /url: /services
    - link "Reporting":
      - /url: /reporting
    - link "Administration":
      - /url: /admin
    - link "QA Components":
      - /url: /qa
  - button "Use dark mode"
  - region "Theme style":
    - text: Theme style
    - button "Neutral"
    - button "Vibrant"
    - button "Pastel"
- main:
  - text: Angular 21 + Web Components
  - heading "Token-driven services portal" [level=1]
  - paragraph: Shell and remotes bootstrap the same PrimeNG preset so independently delivered modules keep one visual language.
  - button " QA route"
  - button " Shell Button"
  - text: "Remote: Services"
  - heading "Citizen services workspace" [level=2]
  - paragraph: A web component remote proving shared form, focus, validation, and card styling from the PrimeNG preset.
  - button "Create case"
  - button "Send notice"
  - article:
    - text: Open cases
    - strong: "128"
    - text: Across citizen services
  - article:
    - text: Completed today
    - strong: "34"
    - text: Notices and renewals
  - article:
    - text: SLA health
    - strong: 92%
    - text: Trailing 7 days
  - heading "Case intake" [level=3]
  - paragraph: Token-driven citizen service form
  - text: Case ID
  - textbox "Case ID": PS-2026-1042
  - text: Uses global input text PassThrough markers. Applicant name
  - textbox "Applicant name": Jordan Avery
  - text: Service type
  - combobox "Service type":
    - option "Benefits renewal" [selected]
    - option "Permit request"
    - option "Document upload"
    - option "Housing assistance"
  - text: Appointment date
  - textbox "Appointment date": 2026-07-09
  - checkbox "Expedite review"
  - text: Expedite review Focus rings, borders, and validation colors come from semantic tokens.
  - heading "Workflow status" [level=3]
  - list "Service workflow":
    - listitem: Intake
    - listitem: Review
    - listitem: Decision
    - listitem: Notice
  - strong: Eligibility completion
  - text: 2 of 3 checks complete
  - progressbar "Eligibility completion progress"
  - text: Identity verified Complete Eligibility review In progress Final notice Pending
  - heading "Eligibility checklist" [level=3]
  - paragraph: Review required evidence before moving the case to decision.
  - text: Completion
  - strong: 2 of 3
  - text: One evidence item still needs review Needs income review
  - article:
    - checkbox "Required documents verified Identity, signed renewal packet, and uploaded proof of benefit period are present." [checked]
    - strong: Required documents verified
    - text: "Identity, signed renewal packet, and uploaded proof of benefit period are present. Source: Upload portal Reviewed by Intake"
  - article:
    - checkbox "Residency confirmed Address matches state records and service region requirements." [checked]
    - strong: Residency confirmed
    - text: "Address matches state records and service region requirements. Source: Address registry Verified Jul 8"
  - article:
    - checkbox "Income reviewed Recent income statement is missing. Request update before final decision."
    - strong: Income reviewed
    - text: Recent income statement is missing. Request update before final decision.
    - button "Request document"
    - button "Add note"
  - heading "Guidance notes" [level=3]
  - group:
    - text: What reviewers check
    - paragraph: Review documents, eligibility, and communication preferences before moving the case to decision.
  - group: When to expedite
  - heading "Case queue" [level=3]
  - table:
    - rowgroup:
      - row "Case Applicant Program Status Due":
        - columnheader "Case"
        - columnheader "Applicant"
        - columnheader "Program"
        - columnheader "Status"
        - columnheader "Due"
    - rowgroup:
      - row "PS-2026-1042 Jordan Avery Benefits renewal Review Today":
        - cell "PS-2026-1042"
        - cell "Jordan Avery"
        - cell "Benefits renewal"
        - cell "Review"
        - cell "Today"
      - row "PS-2026-1043 Sam Rivera Housing assistance Ready Tomorrow":
        - cell "PS-2026-1043"
        - cell "Sam Rivera"
        - cell "Housing assistance"
        - cell "Ready"
        - cell "Tomorrow"
      - row "PS-2026-1044 Lee Morgan Permit request Blocked Jul 12":
        - cell "PS-2026-1044"
        - cell "Lee Morgan"
        - cell "Permit request"
        - cell "Blocked"
        - cell "Jul 12"
  - heading "Case timeline" [level=3]
  - list:
    - listitem:
      - text: Jul 7
      - strong: Application received
      - text: Complete
    - listitem:
      - text: Jul 8
      - strong: Identity verification
      - text: Complete
    - listitem:
      - text: Today
      - strong: Eligibility review
      - text: In progress
    - listitem:
      - text: Next
      - strong: Notice generation
      - text: Pending
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Shell Module Federation', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate to shell home
  6   |     await page.goto('/');
  7   |     // Wait for shell to load
  8   |     await page.waitForLoadState('networkidle');
  9   |   });
  10  | 
  11  |   test('should load shell application', async ({ page }) => {
  12  |     const title = await page.title();
  13  |     expect(title).toBeTruthy();
  14  | 
  15  |     // Check for shell container
  16  |     const shellContainer = page.locator('app-root');
> 17  |     await expect(shellContainer).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  18  |   });
  19  | 
  20  |   test('should render shell navigation', async ({ page }) => {
  21  |     // Look for navigation elements (adjust selectors based on actual markup)
  22  |     const nav = page.locator('nav, [role="navigation"]');
  23  |     await expect(nav).toBeVisible();
  24  |   });
  25  | 
  26  |   test('should expose remotes in window object', async ({ page }) => {
  27  |     // Check if module federation remotes are available
  28  |     const remotesExist = await page.evaluate(() => {
  29  |       return !!(window as any).__MF_INIT__ || !!(window as any).__REMOTES__;
  30  |     });
  31  |     expect(remotesExist).toBeTruthy();
  32  |   });
  33  | 
  34  |   test('should have shared dependencies available', async ({ page }) => {
  35  |     // Verify shared Angular packages are loaded
  36  |     const depsLoaded = await page.evaluate(() => {
  37  |       const ng = (window as any).ng;
  38  |       return ng && ng.core && ng.platform;
  39  |     });
  40  |     expect(depsLoaded).toBeTruthy();
  41  |   });
  42  | 
  43  |   test('should allow navigation to services remote', async ({ page }) => {
  44  |     // Navigate to services route
  45  |     await page.goto('/services');
  46  |     await page.waitForLoadState('networkidle');
  47  | 
  48  |     // Check for services remote content
  49  |     const content = page.locator('body');
  50  |     const text = await content.textContent();
  51  |     expect(text).toBeTruthy();
  52  | 
  53  |     // Should not have 404
  54  |     const response = await page.goto('/services');
  55  |     expect(response?.status()).toBeLessThan(400);
  56  |   });
  57  | 
  58  |   test('should allow navigation to reporting remote', async ({ page }) => {
  59  |     await page.goto('/reporting');
  60  |     await page.waitForLoadState('networkidle');
  61  | 
  62  |     const response = await page.goto('/reporting');
  63  |     expect(response?.status()).toBeLessThan(400);
  64  |   });
  65  | 
  66  |   test('should allow navigation to admin remote', async ({ page }) => {
  67  |     await page.goto('/admin');
  68  |     await page.waitForLoadState('networkidle');
  69  | 
  70  |     const response = await page.goto('/admin');
  71  |     expect(response?.status()).toBeLessThan(400);
  72  |   });
  73  | 
  74  |   test('should allow navigation to QA remote', async ({ page }) => {
  75  |     await page.goto('/qa');
  76  |     await page.waitForLoadState('networkidle');
  77  | 
  78  |     const response = await page.goto('/qa');
  79  |     expect(response?.status()).toBeLessThan(400);
  80  |   });
  81  | 
  82  |   test('should preserve routing when navigating between remotes', async ({ page }) => {
  83  |     // Start at home
  84  |     await page.goto('/');
  85  |     let url = page.url();
  86  |     expect(url).toContain('localhost:4200');
  87  | 
  88  |     // Go to services
  89  |     await page.goto('/services');
  90  |     await page.waitForLoadState('networkidle');
  91  |     url = page.url();
  92  |     expect(url).toContain('/services');
  93  | 
  94  |     // Go back to home
  95  |     await page.goto('/');
  96  |     url = page.url();
  97  |     expect(url).not.toContain('/services');
  98  |   });
  99  | 
  100 |   test('should maintain shared tokens across remotes', async ({ page }) => {
  101 |     // Load home page
  102 |     await page.goto('/');
  103 | 
  104 |     // Get computed styles from shell
  105 |     const shellStyles = await page.evaluate(() => {
  106 |       const element = document.body;
  107 |       return {
  108 |         bgColor: window.getComputedStyle(element).backgroundColor,
  109 |         fontFamily: window.getComputedStyle(element).fontFamily,
  110 |       };
  111 |     });
  112 | 
  113 |     // Navigate to services remote
  114 |     await page.goto('/services');
  115 |     await page.waitForLoadState('networkidle');
  116 | 
  117 |     // Get computed styles from remote
```