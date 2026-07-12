# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\shell\e2e\federation.spec.ts >> Token Inheritance >> should inherit color tokens in shell and remotes
- Location: apps\shell\e2e\federation.spec.ts:271:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: ""
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: PS
      - generic [ref=e7]:
        - strong [ref=e8]: Public Sector Portal
        - generic [ref=e9]: Federated services platform
    - navigation "Federated modules" [ref=e10]:
      - link "Citizen Services" [ref=e11] [cursor=pointer]:
        - /url: /services
      - link "Reporting" [ref=e12] [cursor=pointer]:
        - /url: /reporting
      - link "Administration" [ref=e13] [cursor=pointer]:
        - /url: /admin
      - link "QA Components" [ref=e14] [cursor=pointer]:
        - /url: /qa
    - button "Use dark mode" [ref=e15] [cursor=pointer]
    - region "Theme style" [ref=e16]:
      - generic [ref=e17]: Theme style
      - button "Neutral" [ref=e18] [cursor=pointer]
      - button "Vibrant" [ref=e19] [cursor=pointer]
      - button "Pastel" [ref=e20] [cursor=pointer]
  - main [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e25]: Angular 21 + Web Components
        - heading "Token-driven services portal" [level=1] [ref=e26]
        - paragraph [ref=e27]: Shell and remotes bootstrap the same PrimeNG preset so independently delivered modules keep one visual language.
      - generic [ref=e28]:
        - button " QA route" [ref=e30] [cursor=pointer]:
          - generic [ref=e31]: 
          - generic [ref=e32]: QA route
        - button " Shell Button" [ref=e34] [cursor=pointer]:
          - generic [ref=e35]: 
          - generic [ref=e36]: Shell Button
    - generic [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]: "Remote: Services"
          - heading "Citizen services workspace" [level=2] [ref=e44]
          - paragraph [ref=e45]: A web component remote proving shared form, focus, validation, and card styling from the PrimeNG preset.
        - generic [ref=e46]:
          - button "Create case" [ref=e47] [cursor=pointer]:
            - generic [ref=e48]: 
            - generic [ref=e49]: Create case
          - button "Send notice" [ref=e50] [cursor=pointer]:
            - generic [ref=e51]: 
            - generic [ref=e52]: Send notice
      - generic [ref=e53]:
        - article [ref=e54]:
          - generic [ref=e55]: Open cases
          - strong [ref=e56]: "128"
          - generic [ref=e57]: Across citizen services
        - article [ref=e58]:
          - generic [ref=e59]: Completed today
          - strong [ref=e60]: "34"
          - generic [ref=e61]: Notices and renewals
        - article [ref=e62]:
          - generic [ref=e63]: SLA health
          - strong [ref=e64]: 92%
          - generic [ref=e65]: Trailing 7 days
      - generic [ref=e66]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - heading "Case intake" [level=3] [ref=e69]
            - paragraph [ref=e70]: Token-driven citizen service form
          - generic [ref=e71]: Case ID
          - textbox "Case ID" [ref=e72]: PS-2026-1042
          - generic [ref=e73]: Uses global input text PassThrough markers.
          - generic [ref=e74]: Applicant name
          - textbox "Applicant name" [ref=e75]: Jordan Avery
          - generic [ref=e76]: Service type
          - combobox "Service type" [ref=e77]:
            - option "Benefits renewal" [selected]
            - option "Permit request"
            - option "Document upload"
            - option "Housing assistance"
          - generic [ref=e78]: Appointment date
          - textbox "Appointment date" [ref=e79]: 2026-07-09
          - generic [ref=e80]:
            - checkbox "Expedite review" [ref=e81]
            - generic [ref=e82]: Expedite review
          - generic [ref=e83]: Focus rings, borders, and validation colors come from semantic tokens.
        - generic [ref=e84]:
          - heading "Workflow status" [level=3] [ref=e86]
          - list "Service workflow" [ref=e87]:
            - listitem [ref=e88]: Intake
            - listitem [ref=e89]: Review
            - listitem [ref=e90]: Decision
            - listitem [ref=e91]: Notice
          - generic [ref=e92]:
            - generic [ref=e93]:
              - strong [ref=e94]: Eligibility completion
              - generic [ref=e95]: 2 of 3 checks complete
            - progressbar "Eligibility completion progress" [ref=e96]
          - generic [ref=e97]:
            - generic [ref=e98]: Identity verified
            - generic [ref=e99]: Complete
            - generic [ref=e100]: Eligibility review
            - generic [ref=e101]: In progress
            - generic [ref=e102]: Final notice
            - generic [ref=e103]: Pending
      - generic [ref=e104]:
        - generic [ref=e105]:
          - generic [ref=e106]:
            - heading "Eligibility checklist" [level=3] [ref=e107]
            - paragraph [ref=e108]: Review required evidence before moving the case to decision.
          - generic "Eligibility review summary" [ref=e109]:
            - generic [ref=e110]:
              - generic [ref=e111]: Completion
              - strong [ref=e112]: 2 of 3
              - generic [ref=e113]: One evidence item still needs review
            - generic [ref=e114]: Needs income review
          - generic [ref=e115]:
            - article [ref=e116]:
              - generic [ref=e117]:
                - checkbox "Required documents verified Identity, signed renewal packet, and uploaded proof of benefit period are present." [checked] [ref=e118]
                - generic [ref=e119]:
                  - strong [ref=e120]: Required documents verified
                  - generic [ref=e121]: Identity, signed renewal packet, and uploaded proof of benefit period are present.
              - generic [ref=e122]:
                - generic [ref=e123]: "Source: Upload portal"
                - generic [ref=e124]: Reviewed by Intake
            - article [ref=e125]:
              - generic [ref=e126]:
                - checkbox "Residency confirmed Address matches state records and service region requirements." [checked] [ref=e127]
                - generic [ref=e128]:
                  - strong [ref=e129]: Residency confirmed
                  - generic [ref=e130]: Address matches state records and service region requirements.
              - generic [ref=e131]:
                - generic [ref=e132]: "Source: Address registry"
                - generic [ref=e133]: Verified Jul 8
            - article [ref=e134]:
              - generic [ref=e135]:
                - checkbox "Income reviewed Recent income statement is missing. Request update before final decision." [ref=e136]
                - generic [ref=e137]:
                  - strong [ref=e138]: Income reviewed
                  - generic [ref=e139]: Recent income statement is missing. Request update before final decision.
              - generic [ref=e140]:
                - button "Request document" [ref=e141] [cursor=pointer]:
                  - generic [ref=e142]: 
                  - generic [ref=e143]: Request document
                - button "Add note" [ref=e144] [cursor=pointer]:
                  - generic [ref=e145]: 
                  - generic [ref=e146]: Add note
        - generic [ref=e147]:
          - heading "Guidance notes" [level=3] [ref=e149]
          - generic [ref=e150]:
            - group [ref=e151]:
              - generic "What reviewers check" [ref=e152] [cursor=pointer]
              - paragraph [ref=e153]: Review documents, eligibility, and communication preferences before moving the case to decision.
            - group [ref=e154]:
              - generic "When to expedite" [ref=e155] [cursor=pointer]
      - generic [ref=e156]:
        - heading "Case queue" [level=3] [ref=e158]
        - table [ref=e159]:
          - rowgroup [ref=e160]:
            - row "Case Applicant Program Status Due" [ref=e161]:
              - columnheader "Case" [ref=e162]
              - columnheader "Applicant" [ref=e163]
              - columnheader "Program" [ref=e164]
              - columnheader "Status" [ref=e165]
              - columnheader "Due" [ref=e166]
          - rowgroup [ref=e167]:
            - row "PS-2026-1042 Jordan Avery Benefits renewal Review Today" [ref=e168]:
              - cell "PS-2026-1042" [ref=e169]
              - cell "Jordan Avery" [ref=e170]
              - cell "Benefits renewal" [ref=e171]
              - cell "Review" [ref=e172]:
                - generic [ref=e173]: Review
              - cell "Today" [ref=e174]
            - row "PS-2026-1043 Sam Rivera Housing assistance Ready Tomorrow" [ref=e175]:
              - cell "PS-2026-1043" [ref=e176]
              - cell "Sam Rivera" [ref=e177]
              - cell "Housing assistance" [ref=e178]
              - cell "Ready" [ref=e179]:
                - generic [ref=e180]: Ready
              - cell "Tomorrow" [ref=e181]
            - row "PS-2026-1044 Lee Morgan Permit request Blocked Jul 12" [ref=e182]:
              - cell "PS-2026-1044" [ref=e183]
              - cell "Lee Morgan" [ref=e184]
              - cell "Permit request" [ref=e185]
              - cell "Blocked" [ref=e186]:
                - generic [ref=e187]: Blocked
              - cell "Jul 12" [ref=e188]
      - generic [ref=e189]:
        - heading "Case timeline" [level=3] [ref=e191]
        - list [ref=e192]:
          - listitem [ref=e193]:
            - generic [ref=e194]: Jul 7
            - strong [ref=e195]: Application received
            - generic [ref=e196]: Complete
          - listitem [ref=e197]:
            - generic [ref=e198]: Jul 8
            - strong [ref=e199]: Identity verification
            - generic [ref=e200]: Complete
          - listitem [ref=e201]:
            - generic [ref=e202]: Today
            - strong [ref=e203]: Eligibility review
            - generic [ref=e204]: In progress
          - listitem [ref=e205]:
            - generic [ref=e206]: Next
            - strong [ref=e207]: Notice generation
            - generic [ref=e208]: Pending
```

# Test source

```ts
  185 |     await page.goto('/invalid-route', { waitUntil: 'networkidle' });
  186 | 
  187 |     // Should either show 404 or error page
  188 |     const content = await page.content();
  189 |     expect(content).toBeTruthy();
  190 |   });
  191 | 
  192 |   test('should initialize module federation manifest', async ({ page }) => {
  193 |     const manifestLoaded = await page.evaluate(() => {
  194 |       // Check if manifest is loaded (varies by federation setup)
  195 |       const manifest =
  196 |         (window as any).__MANIFEST__ || (window as any).remotes;
  197 |       return !!manifest;
  198 |     });
  199 | 
  200 |     // Manifest or remote configuration should exist
  201 |     expect(manifestLoaded || true).toBeTruthy();
  202 |   });
  203 | 
  204 |   test('should share PrimeNG across remotes', async ({ page }) => {
  205 |     await page.goto('/');
  206 | 
  207 |     const primengLoaded = await page.evaluate(() => {
  208 |       // Check for PrimeNG in window or module cache
  209 |       return !!(window as any).primeng || !!(window as any).__PRIMENG__;
  210 |     });
  211 | 
  212 |     expect(primengLoaded || true).toBeTruthy();
  213 |   });
  214 | 
  215 |   test('should share Angular packages across remotes', async ({ page }) => {
  216 |     await page.goto('/');
  217 | 
  218 |     const angularShared = await page.evaluate(() => {
  219 |       return {
  220 |         core: !!(window as any).ng?.core,
  221 |         common: !!(window as any).ng?.common,
  222 |         platform: !!(window as any).ng?.platform,
  223 |       };
  224 |     });
  225 | 
  226 |     // At least Angular core should be available
  227 |     expect(angularShared.core || true).toBeTruthy();
  228 |   });
  229 | });
  230 | 
  231 | test.describe('Remote Loading Performance', () => {
  232 |   test('should load services remote within acceptable time', async ({ page }) => {
  233 |     const startTime = Date.now();
  234 |     await page.goto('/services');
  235 |     await page.waitForLoadState('networkidle');
  236 |     const loadTime = Date.now() - startTime;
  237 | 
  238 |     // Should load within 5 seconds
  239 |     expect(loadTime).toBeLessThan(5000);
  240 |   });
  241 | 
  242 |   test('should load reporting remote within acceptable time', async ({ page }) => {
  243 |     const startTime = Date.now();
  244 |     await page.goto('/reporting');
  245 |     await page.waitForLoadState('networkidle');
  246 |     const loadTime = Date.now() - startTime;
  247 | 
  248 |     expect(loadTime).toBeLessThan(5000);
  249 |   });
  250 | 
  251 |   test('should load admin remote within acceptable time', async ({ page }) => {
  252 |     const startTime = Date.now();
  253 |     await page.goto('/admin');
  254 |     await page.waitForLoadState('networkidle');
  255 |     const loadTime = Date.now() - startTime;
  256 | 
  257 |     expect(loadTime).toBeLessThan(5000);
  258 |   });
  259 | 
  260 |   test('should load QA remote within acceptable time', async ({ page }) => {
  261 |     const startTime = Date.now();
  262 |     await page.goto('/qa');
  263 |     await page.waitForLoadState('networkidle');
  264 |     const loadTime = Date.now() - startTime;
  265 | 
  266 |     expect(loadTime).toBeLessThan(5000);
  267 |   });
  268 | });
  269 | 
  270 | test.describe('Token Inheritance', () => {
  271 |   test('should inherit color tokens in shell and remotes', async ({ page }) => {
  272 |     await page.goto('/');
  273 | 
  274 |     const shellTokens = await page.evaluate(() => {
  275 |       return document.documentElement.style.cssText;
  276 |     });
  277 | 
  278 |     await page.goto('/services');
  279 | 
  280 |     const remoteTokens = await page.evaluate(() => {
  281 |       return document.documentElement.style.cssText;
  282 |     });
  283 | 
  284 |     // Both should have style information
> 285 |     expect(shellTokens || remoteTokens).toBeTruthy();
      |                                         ^ Error: expect(received).toBeTruthy()
  286 |   });
  287 | 
  288 |   test('should apply consistent font across federation boundary', async ({
  289 |     page,
  290 |   }) => {
  291 |     await page.goto('/');
  292 | 
  293 |     const shellFont = await page.evaluate(() => {
  294 |       return window.getComputedStyle(document.body).fontFamily;
  295 |     });
  296 | 
  297 |     await page.goto('/reporting');
  298 | 
  299 |     const remoteFont = await page.evaluate(() => {
  300 |       return window.getComputedStyle(document.body).fontFamily;
  301 |     });
  302 | 
  303 |     // Both should have font applied
  304 |     expect(shellFont).toBeTruthy();
  305 |     expect(remoteFont).toBeTruthy();
  306 |   });
  307 | });
  308 | 
```