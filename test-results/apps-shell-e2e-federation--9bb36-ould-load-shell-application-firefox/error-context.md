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

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> C:\Users\Sanford\AppData\Local\ms-playwright\firefox-1532\firefox\firefox.exe -no-remote -headless -profile C:\Users\Sanford\AppData\Local\Temp\playwright_firefoxdev_profile-NJDFpu -juggler-pipe -silent
<launched> pid=54604
[pid=54604][err] *** You are running in headless mode.
[pid=54604][err] JavaScript warning: resource://services-settings/Utils.sys.mjs, line 119: unreachable code after return statement
[pid=54604][out] 
[pid=54604][out] Juggler listening to the pipe
[pid=54604][out] Crash Annotation GraphicsCriticalError: |[0][GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt (t=0.616613) [GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt
[pid=54604][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=54604][out] console.error: "Error fetching remote settings base url from CDN. Falling back to https://firefox-settings-attachments.cdn.mozilla.net/" (new SyntaxError("XMLHttpRequest.open: '/' is not a valid URL.", (void 0), 126))
[pid=54604][out] console.error: services.settings: 
[pid=54604][out]   Message: EmptyDatabaseError: "main/nimbus-desktop-experiments" has not been synced yet
[pid=54604][out]   Stack:
[pid=54604][out]     EmptyDatabaseError@resource://services-settings/Database.sys.mjs:19:5
[pid=54604][out] list@resource://services-settings/Database.sys.mjs:96:13
[pid=54604][out] 
[pid=54604][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 181"  data: no]
[pid=54604][out] console.error: [Exception... "Component returned failure code: 0x80040111 (NS_ERROR_NOT_AVAILABLE) [nsIContentSniffer.getMIMETypeFromContent]"  nsresult: "0x80040111 (NS_ERROR_NOT_AVAILABLE)"  location: "JS frame :: resource:///modules/FaviconLoader.sys.mjs :: onStopRequest :: line 348"  data: no]
[pid=54604][out] console.warn: services.settings: #fetchAttachment: Forcing fallbackToDump to false due to Utils.LOAD_DUMPS being false
[pid=54604][out] console.error: (new NotFoundError("Could not find fa0fc42c-d91d-fca7-34eb-806ff46062dc in cache or dump", "resource://services-settings/Attachments.sys.mjs", 48))
[pid=54604][out] console.warn: "Unable to find the attachment for" "fa0fc42c-d91d-fca7-34eb-806ff46062dc"
```