# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\shell\e2e\federation.spec.ts >> Remote Loading Performance >> should load QA remote within acceptable time
- Location: apps\shell\e2e\federation.spec.ts:260:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 5000
Received:   5508
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
        - generic [ref=e42]: QA Remote
        - heading "Component and token coverage" [level=2] [ref=e43]
        - paragraph [ref=e44]: A federated route for checking shared tokens, layout primitives, forms, data display, status colors, and overlays across neutral, vibrant, pastel, light, and dark modes.
      - generic [ref=e45]:
        - generic [ref=e46]:
          - text: Build here first
          - heading "Use this route as the visual contract before components graduate into shared wrappers." [level=3] [ref=e47]
          - paragraph [ref=e48]: "Accessibility is gated here: contrast, keyboard focus, labels, and route content must pass before token or component changes are considered ready."
        - generic [ref=e49]:
          - text: Accessibility gated
          - generic [ref=e50]: A11Y means accessibility
      - region "Storybook acceptance stories mirrored in /qa" [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]: Visual federation checkpoint
          - generic [ref=e54]:
            - heading "Storybook acceptance stories mirrored in /qa" [level=3] [ref=e55]
            - paragraph [ref=e56]: These panels mirror the focused Storybook acceptance stories so proven PrimeNG families are checked inside the federated QA remote before promotion.
        - generic [ref=e57]:
          - article [ref=e58]:
            - generic [ref=e59]:
              - generic [ref=e61]: Button / Tag
              - heading "Action hierarchy and status language" [level=4] [ref=e62]
              - paragraph [ref=e63]: Filled, outlined, text, disabled, and severity labels with icon spacing.
            - generic [ref=e64]:
              - button " Primary action" [ref=e66] [cursor=pointer]:
                - generic [ref=e67]: 
                - generic [ref=e68]: Primary action
              - button " Outlined action" [ref=e70] [cursor=pointer]:
                - generic [ref=e71]: 
                - generic [ref=e72]: Outlined action
              - button " Text action" [ref=e74] [cursor=pointer]:
                - generic [ref=e75]: 
                - generic [ref=e76]: Text action
              - button " Disabled action" [disabled] [ref=e78]:
                - generic [ref=e79]: 
                - generic [ref=e80]: Disabled action
            - generic [ref=e81]:
              - button " Submit housing assistance eligibility review for North Region queue" [ref=e83] [cursor=pointer]:
                - generic [ref=e84]: 
                - generic [ref=e85]: Submit housing assistance eligibility review for North Region queue
              - generic [ref=e87]: Awaiting supervisor review after document resubmission
            - generic [ref=e88]:
              - generic [ref=e90]: On track
              - generic [ref=e92]: Watch
              - generic [ref=e94]: Delayed
              - generic [ref=e96]: Draft
          - article [ref=e97]:
            - generic [ref=e98]:
              - generic [ref=e100]: Card
              - heading "Supporting content surfaces" [level=4] [ref=e101]
              - paragraph [ref=e102]: Cards render as stable supporting UI, not the only route-critical content.
            - generic [ref=e103]:
              - generic [ref=e105]:
                - generic [ref=e106]: Metric card
                - generic [ref=e107]: Operational snapshot
                - generic [ref=e108]:
                  - strong [ref=e109]: 94%
                  - paragraph [ref=e110]: SLA compliance over the trailing 30 days.
                  - generic [ref=e112]: On track
              - generic [ref=e114]:
                - generic [ref=e115]: Long-content card
                - generic [ref=e116]: Projection and wrapping
                - paragraph [ref=e118]: This card intentionally includes longer body copy to check spacing, line-height, text wrapping, and content projection under the shared preset.
              - generic [ref=e120]:
                - generic [ref=e121]: Empty state card
                - generic [ref=e122]: Projection and wrapping
                - generic [ref=e124]:
                  - generic [ref=e125]: 
                  - strong [ref=e126]: No pending reviews
                  - paragraph [ref=e127]: Fallback copy exists outside route-critical card-only layouts.
        - article [ref=e128]:
          - generic [ref=e129]:
            - generic [ref=e131]: Table / Paginator
            - heading "Sortable, filterable, paginated table" [level=4] [ref=e132]
            - paragraph [ref=e133]: Uses the same proven rows-per-page, filtering, sorting, loading, and page-report behavior as Reporting.
          - generic [ref=e134]:
            - button " Show loading state" [ref=e136] [cursor=pointer]:
              - generic [ref=e137]: 
              - generic [ref=e138]: Show loading state
            - button " Show empty dataset" [ref=e140] [cursor=pointer]:
              - generic [ref=e141]: 
              - generic [ref=e142]: Show empty dataset
          - generic [ref=e143]:
            - generic [ref=e145]:
              - generic [ref=e146]:
                - strong [ref=e147]: Program performance
                - generic [ref=e148]: Search, sort, filter, and page through active programs.
              - searchbox "Search QA program performance" [ref=e149]
            - table [ref=e151]:
              - rowgroup [ref=e152]:
                - row "Program Cases Status Region SLA" [ref=e153]:
                  - columnheader "Program" [ref=e154] [cursor=pointer]:
                    - text: Program
                    - img [ref=e156]
                  - columnheader "Cases" [ref=e162] [cursor=pointer]:
                    - text: Cases
                    - img [ref=e164]
                  - columnheader "Status" [ref=e167] [cursor=pointer]:
                    - text: Status
                    - img [ref=e169]
                  - columnheader "Region" [ref=e175] [cursor=pointer]:
                    - text: Region
                    - img [ref=e177]
                  - columnheader "SLA" [ref=e183] [cursor=pointer]:
                    - text: SLA
                    - img [ref=e185]
                - row [ref=e191]:
                  - columnheader [ref=e192]:
                    - textbox "Filter program" [ref=e196]
                  - columnheader [ref=e197]:
                    - generic [ref=e201]:
                      - spinbutton "Min cases" [ref=e202]
                      - generic [ref=e203]:
                        - button [ref=e204] [cursor=pointer]:
                          - img [ref=e205]
                        - button [ref=e207] [cursor=pointer]:
                          - img [ref=e208]
                  - columnheader [ref=e210]:
                    - textbox "Filter status" [ref=e214]
                  - columnheader [ref=e215]:
                    - textbox "Filter region" [ref=e219]
                  - columnheader [ref=e220]:
                    - generic [ref=e224]:
                      - spinbutton "Min SLA" [ref=e225]
                      - generic [ref=e226]:
                        - button [ref=e227] [cursor=pointer]:
                          - img [ref=e228]
                        - button [ref=e230] [cursor=pointer]:
                          - img [ref=e231]
              - rowgroup [ref=e233]:
                - row "Housing assistance 428 On track North Region 96%" [ref=e234]:
                  - cell "Housing assistance" [ref=e235]:
                    - strong [ref=e236]: Housing assistance
                  - cell "428" [ref=e237]
                  - cell "On track" [ref=e238]:
                    - generic [ref=e240]: On track
                  - cell "North Region" [ref=e241]
                  - cell "96%" [ref=e242]
                - row "Food assistance 376 On track West Region 95%" [ref=e243]:
                  - cell "Food assistance" [ref=e244]:
                    - strong [ref=e245]: Food assistance
                  - cell "376" [ref=e246]
                  - cell "On track" [ref=e247]:
                    - generic [ref=e249]: On track
                  - cell "West Region" [ref=e250]
                  - cell "95%" [ref=e251]
                - row "Benefits renewal 316 On track North Region 94%" [ref=e252]:
                  - cell "Benefits renewal" [ref=e253]:
                    - strong [ref=e254]: Benefits renewal
                  - cell "316" [ref=e255]
                  - cell "On track" [ref=e256]:
                    - generic [ref=e258]: On track
                  - cell "North Region" [ref=e259]
                  - cell "94%" [ref=e260]
                - row "Document intake 241 Watch Central Region 82%" [ref=e261]:
                  - cell "Document intake" [ref=e262]:
                    - strong [ref=e263]: Document intake
                  - cell "241" [ref=e264]
                  - cell "Watch" [ref=e265]:
                    - generic [ref=e267]: Watch
                  - cell "Central Region" [ref=e268]
                  - cell "82%" [ref=e269]
                - row "Child care subsidy 205 Delayed West Region 73%" [ref=e270]:
                  - cell "Child care subsidy" [ref=e271]:
                    - strong [ref=e272]: Child care subsidy
                  - cell "205" [ref=e273]
                  - cell "Delayed" [ref=e274]:
                    - generic [ref=e276]: Delayed
                  - cell "West Region" [ref=e277]
                  - cell "73%" [ref=e278]
            - generic [ref=e279]:
              - generic [ref=e280]: Showing 1-5 of 12
              - button "First Page":
                - img
              - button "Previous Page" [disabled]:
                - img
              - generic [ref=e281]:
                - button "1" [ref=e282] [cursor=pointer]
                - button "2" [ref=e283] [cursor=pointer]
                - button "3" [ref=e284] [cursor=pointer]
              - button "Next Page" [ref=e285] [cursor=pointer]:
                - img [ref=e286]
              - button "Last Page" [ref=e288] [cursor=pointer]:
                - img [ref=e289]
              - generic [ref=e291] [cursor=pointer]:
                - combobox "Rows per page" [ref=e292]: "5"
                - button "dropdown trigger" [ref=e293]:
                  - img [ref=e294]
        - article [ref=e296]:
          - generic [ref=e297]:
            - generic [ref=e299]: Federation readiness
            - heading "Direct remote and shell-composed proof" [level=4] [ref=e300]
            - paragraph [ref=e301]: "Proven PrimeNG families are validated on the QA remote directly and through the shell-composed `/qa` route before matrix promotion."
          - table [ref=e302]:
            - rowgroup [ref=e303]:
              - 'row "PrimeNG family Direct remote Shell composed `verify:fed` Matrix status" [ref=e304]':
                - columnheader "PrimeNG family" [ref=e305]
                - columnheader "Direct remote" [ref=e306]
                - columnheader "Shell composed" [ref=e307]
                - 'columnheader "`verify:fed`" [ref=e308]'
                - columnheader "Matrix status" [ref=e309]
            - rowgroup [ref=e310]:
              - row "Button / Tag http://localhost:4204 http://localhost:4200/qa Passed Proven" [ref=e311]:
                - cell "Button / Tag" [ref=e312]:
                  - strong [ref=e313]: Button / Tag
                - cell "http://localhost:4204" [ref=e314]:
                  - code [ref=e315]: http://localhost:4204
                - cell "http://localhost:4200/qa" [ref=e316]:
                  - code [ref=e317]: http://localhost:4200/qa
                - cell "Passed" [ref=e318]:
                  - generic [ref=e319]: Passed
                - cell "Proven" [ref=e320]:
                  - generic [ref=e321]: Proven
              - row "Card http://localhost:4204 http://localhost:4200/qa Passed Proven" [ref=e322]:
                - cell "Card" [ref=e323]:
                  - strong [ref=e324]: Card
                - cell "http://localhost:4204" [ref=e325]:
                  - code [ref=e326]: http://localhost:4204
                - cell "http://localhost:4200/qa" [ref=e327]:
                  - code [ref=e328]: http://localhost:4200/qa
                - cell "Passed" [ref=e329]:
                  - generic [ref=e330]: Passed
                - cell "Proven" [ref=e331]:
                  - generic [ref=e332]: Proven
              - row "Table / Paginator http://localhost:4204 http://localhost:4200/qa Passed Proven" [ref=e333]:
                - cell "Table / Paginator" [ref=e334]:
                  - strong [ref=e335]: Table / Paginator
                - cell "http://localhost:4204" [ref=e336]:
                  - code [ref=e337]: http://localhost:4204
                - cell "http://localhost:4200/qa" [ref=e338]:
                  - code [ref=e339]: http://localhost:4200/qa
                - cell "Passed" [ref=e340]:
                  - generic [ref=e341]: Passed
                - cell "Proven" [ref=e342]:
                  - generic [ref=e343]: Proven
              - row "Dialog / Toast http://localhost:4204 http://localhost:4200/qa Passed Proven" [ref=e344]:
                - cell "Dialog / Toast" [ref=e345]:
                  - strong [ref=e346]: Dialog / Toast
                - cell "http://localhost:4204" [ref=e347]:
                  - code [ref=e348]: http://localhost:4204
                - cell "http://localhost:4200/qa" [ref=e349]:
                  - code [ref=e350]: http://localhost:4200/qa
                - cell "Passed" [ref=e351]:
                  - generic [ref=e352]: Passed
                - cell "Proven" [ref=e353]:
                  - generic [ref=e354]: Proven
        - generic [ref=e355]:
          - article [ref=e356]:
            - generic [ref=e357]:
              - generic [ref=e359]: Dialog / Toast
              - heading "Overlay and feedback policy" [level=4] [ref=e360]
              - paragraph [ref=e361]: Dialog appends to body, stacks predictably, and toast severities stay styled.
            - generic [ref=e362]:
              - button "Open acceptance dialog" [ref=e363] [cursor=pointer]:
                - generic [ref=e364]: 
                - generic [ref=e365]: Open acceptance dialog
              - button " Success toast" [ref=e367] [cursor=pointer]:
                - generic [ref=e368]: 
                - generic [ref=e369]: Success toast
              - button " Warn toast" [ref=e371] [cursor=pointer]:
                - generic [ref=e372]: 
                - generic [ref=e373]: Warn toast
              - button " Error toast" [ref=e375] [cursor=pointer]:
                - generic [ref=e376]: 
                - generic [ref=e377]: Error toast
          - article [ref=e378]:
            - heading "Promotion checklist" [level=4] [ref=e379]
            - list [ref=e380]:
              - listitem [ref=e381]: Story renders real PrimeNG internals, not blank/raw custom hosts.
              - listitem [ref=e382]: Stress states cover long labels, loading, empty data, and error feedback.
              - listitem [ref=e383]: Theme contrast works in neutral, vibrant, pastel, light, and dark modes.
              - listitem [ref=e384]: "Direct remote and shell-composed /qa routes pass `pnpm verify:fed`."
              - listitem [ref=e385]: Component promotion evidence marks proven families as Active or Proven.
      - generic [ref=e386]:
        - generic [ref=e387]:
          - generic [ref=e388]: Developer-owned docs views
          - heading "Storybook, Zeroheight preview, and token delivery browser" [level=3] [ref=e389]
          - paragraph [ref=e390]: These views are intentionally developer-led for the POC. They let us study PrimeNG components heavily while still modeling how a formal design-system workflow would publish guidance and token contracts.
        - generic [ref=e391]:
          - button "Developer playground Storybook PrimeNG-heavy component stories for testing states before promoting patterns into remotes. pnpm storybook:qa" [pressed] [ref=e392] [cursor=pointer]:
            - generic [ref=e393]: Developer playground
            - heading "Storybook" [level=4] [ref=e394]
            - paragraph [ref=e395]: PrimeNG-heavy component stories for testing states before promoting patterns into remotes.
            - code [ref=e396]: pnpm storybook:qa
          - button "In-app documentation model Zeroheight preview A local view of the guidance that would be published to Zeroheight for app teams. docs/design-system" [ref=e397] [cursor=pointer]:
            - generic [ref=e398]: In-app documentation model
            - heading "Zeroheight preview" [level=4] [ref=e399]
            - paragraph [ref=e400]: A local view of the guidance that would be published to Zeroheight for app teams.
            - code [ref=e401]: docs/design-system
          - button "Token export model Token delivery browser A token browser showing semantic tokens and PrimeNG mapping tokens side by side. packages/tokens" [ref=e402] [cursor=pointer]:
            - generic [ref=e403]: Token export model
            - heading "Token delivery browser" [level=4] [ref=e404]
            - paragraph [ref=e405]: A token browser showing semantic tokens and PrimeNG mapping tokens side by side.
            - code [ref=e406]: packages/tokens
          - button "Sprint planning model Agile plan A delivery view for sprint slices, level of effort, blockers, and done criteria. docs/design-system/focus.md" [ref=e407] [cursor=pointer]:
            - generic [ref=e408]: Sprint planning model
            - heading "Agile plan" [level=4] [ref=e409]
            - paragraph [ref=e410]: A delivery view for sprint slices, level of effort, blockers, and done criteria.
            - code [ref=e411]: docs/design-system/focus.md
        - article [ref=e412]:
          - generic [ref=e413]:
            - generic [ref=e414]: Developer playground
            - generic [ref=e415]:
              - heading "Storybook report" [level=3] [ref=e416]
              - paragraph [ref=e417]: Use Storybook as the isolated lab for PrimeNG component behavior, states, and theme combinations.
            - code [ref=e418]: pnpm storybook:qa
          - generic [ref=e419]:
            - generic [ref=e420]: 4 acceptance stories
            - generic [ref=e421]: 7 proven PrimeNG hosts
            - generic [ref=e422]: Theme toolbar ready
          - generic [ref=e423]:
            - generic [ref=e424]:
              - heading "What this opens" [level=4] [ref=e425]
              - paragraph [ref=e426]:
                - text: A real Storybook workspace on port
                - strong [ref=e427]: "4400"
                - text: with a PrimeNG-heavy playground story for actions, forms, tables, overlays, feedback, and disclosure.
            - generic [ref=e428]:
              - heading "Promotion checks" [level=4] [ref=e429]
              - list [ref=e430]:
                - listitem [ref=e431]: Story renders internal PrimeNG DOM.
                - listitem [ref=e432]: Theme toolbar works for neutral, vibrant, pastel, light, and dark.
                - listitem [ref=e433]: "Candidate component is then verified in `/qa` and the shell route."
          - table [ref=e434]:
            - rowgroup [ref=e435]:
              - row "Acceptance check Evidence Gate Status" [ref=e436]:
                - columnheader "Acceptance check" [ref=e437]
                - columnheader "Evidence" [ref=e438]
                - columnheader "Gate" [ref=e439]
                - columnheader "Status" [ref=e440]
            - rowgroup [ref=e441]:
              - row "Default state Component renders with real PrimeNG internals and public-sector tokens. Storybook story visible and no raw/blank host. Done" [ref=e442]:
                - cell "Default state" [ref=e443]:
                  - strong [ref=e444]: Default state
                - cell "Component renders with real PrimeNG internals and public-sector tokens." [ref=e445]
                - cell "Storybook story visible and no raw/blank host." [ref=e446]
                - cell "Done" [ref=e447]:
                  - generic [ref=e448]: Done
              - 'row "Theme matrix Neutral, vibrant, pastel, light, and dark are exercised with toolbar globals. Visual check plus `pnpm verify:fed` after promotion to /qa. Done" [ref=e449]':
                - cell "Theme matrix" [ref=e450]:
                  - strong [ref=e451]: Theme matrix
                - cell "Neutral, vibrant, pastel, light, and dark are exercised with toolbar globals." [ref=e452]
                - 'cell "Visual check plus `pnpm verify:fed` after promotion to /qa." [ref=e453]'
                - cell "Done" [ref=e454]:
                  - generic [ref=e455]: Done
              - row "Accessibility Labels, keyboard focus, and contrast are explicit in the story. A11y addon review and route-level axe pass after /qa adoption. Done" [ref=e456]:
                - cell "Accessibility" [ref=e457]:
                  - strong [ref=e458]: Accessibility
                - cell "Labels, keyboard focus, and contrast are explicit in the story." [ref=e459]
                - cell "A11y addon review and route-level axe pass after /qa adoption." [ref=e460]
                - cell "Done" [ref=e461]:
                  - generic [ref=e462]: Done
              - row "Stress state Long text, empty data, loading state, or invalid state is represented. Story includes at least one non-happy-path state. Done" [ref=e463]:
                - cell "Stress state" [ref=e464]:
                  - strong [ref=e465]: Stress state
                - cell "Long text, empty data, loading state, or invalid state is represented." [ref=e466]
                - cell "Story includes at least one non-happy-path state." [ref=e467]
                - cell "Done" [ref=e468]:
                  - generic [ref=e469]: Done
              - row "Federation readiness Candidate component is verified directly and through shell composition. Direct remote and shell route both render stable content. Done" [ref=e470]:
                - cell "Federation readiness" [ref=e471]:
                  - strong [ref=e472]: Federation readiness
                - cell "Candidate component is verified directly and through shell composition." [ref=e473]
                - cell "Direct remote and shell route both render stable content." [ref=e474]
                - cell "Done" [ref=e475]:
                  - generic [ref=e476]: Done
              - row "Promotion decision Component promotion status and validation evidence are updated after validation. Status moves to Active or Proven only with Storybook, direct remote, shell-mounted, and accessibility evidence. Done" [ref=e477]:
                - cell "Promotion decision" [ref=e478]:
                  - strong [ref=e479]: Promotion decision
                - cell "Component promotion status and validation evidence are updated after validation." [ref=e480]
                - cell "Status moves to Active or Proven only with Storybook, direct remote, shell-mounted, and accessibility evidence." [ref=e481]
                - cell "Done" [ref=e482]:
                  - generic [ref=e483]: Done
          - table [ref=e484]:
            - rowgroup [ref=e485]:
              - row "PrimeNG family Story coverage Status" [ref=e486]:
                - columnheader "PrimeNG family" [ref=e487]
                - columnheader "Story coverage" [ref=e488]
                - columnheader "Status" [ref=e489]
            - rowgroup [ref=e490]:
              - row "Button and Tag Default, long labels, disabled, severity labels Proven in /qa" [ref=e491]:
                - cell "Button and Tag" [ref=e492]:
                  - strong [ref=e493]: Button and Tag
                - cell "Default, long labels, disabled, severity labels" [ref=e494]
                - cell "Proven in /qa" [ref=e495]:
                  - generic [ref=e496]: Proven in /qa
              - row "Card Metric, long content, empty state, route-safe composition Proven in /qa" [ref=e497]:
                - cell "Card" [ref=e498]:
                  - strong [ref=e499]: Card
                - cell "Metric, long content, empty state, route-safe composition" [ref=e500]
                - cell "Proven in /qa" [ref=e501]:
                  - generic [ref=e502]: Proven in /qa
              - row "Table Empty, loading, filtered, sorted, paginated, long cells Proven in /qa" [ref=e503]:
                - cell "Table" [ref=e504]:
                  - strong [ref=e505]: Table
                - cell "Empty, loading, filtered, sorted, paginated, long cells" [ref=e506]
                - cell "Proven in /qa" [ref=e507]:
                  - generic [ref=e508]: Proven in /qa
              - row "Dialog and Toast Overlay, long copy, error toast, append policy Proven in /qa" [ref=e509]:
                - cell "Dialog and Toast" [ref=e510]:
                  - strong [ref=e511]: Dialog and Toast
                - cell "Overlay, long copy, error toast, append policy" [ref=e512]
                - cell "Proven in /qa" [ref=e513]:
                  - generic [ref=e514]: Proven in /qa
              - row "InputText and Select Default, disabled, invalid, helper text, overlay append Sprint 2" [ref=e515]:
                - cell "InputText and Select" [ref=e516]:
                  - strong [ref=e517]: InputText and Select
                - cell "Default, disabled, invalid, helper text, overlay append" [ref=e518]
                - cell "Sprint 2" [ref=e519]:
                  - generic [ref=e520]: Sprint 2
              - row "Password and ToggleSwitch Admin states, labels, reveal icon, invalid state Sprint 2" [ref=e521]:
                - cell "Password and ToggleSwitch" [ref=e522]:
                  - strong [ref=e523]: Password and ToggleSwitch
                - cell "Admin states, labels, reveal icon, invalid state" [ref=e524]
                - cell "Sprint 2" [ref=e525]:
                  - generic [ref=e526]: Sprint 2
          - generic [ref=e527]:
            - heading "Next steps" [level=4] [ref=e528]
            - list [ref=e529]:
              - listitem [ref=e530]: Add form control acceptance stories
              - listitem [ref=e531]: Add loading states
              - listitem [ref=e532]: Promote passing stories into shared wrappers
      - generic [ref=e533]:
        - article [ref=e534]:
          - heading "Token-driven services portal" [level=3] [ref=e535]
          - paragraph [ref=e536]: Shell and remotes bootstrap the same PrimeNG preset so independently delivered modules keep one visual language.
        - article [ref=e537]:
          - heading "Shell parity sample" [level=3] [ref=e538]
          - text: This card and button should match the remote applications.
          - paragraph [ref=e539]: The shell owns navigation, remote loading, and theme toggling. Feature UI is mounted below as custom elements.
          - button "Parity action" [ref=e540] [cursor=pointer]:
            - generic [ref=e541]: 
            - generic [ref=e542]: Parity action
      - generic [ref=e543]:
        - article [ref=e544]:
          - generic [ref=e545]: Forms
          - strong [ref=e546]: "9"
          - paragraph [ref=e547]: Inputs, select, date, password
          - generic [ref=e548]: Ready
        - article [ref=e549]:
          - generic [ref=e550]: Overlays
          - strong [ref=e551]: "4"
          - paragraph [ref=e552]: Dialog, toast, menu, picker
          - generic [ref=e553]: Ready
        - article [ref=e554]:
          - generic [ref=e555]: Data
          - strong [ref=e556]: "6"
          - paragraph [ref=e557]: Table, meter, chart, progress
          - generic [ref=e558]: Review
      - generic [ref=e559]:
        - article [ref=e560]:
          - heading "Theme matrix" [level=3] [ref=e561]
          - table [ref=e562]:
            - rowgroup [ref=e563]:
              - row "Variant Light Dark" [ref=e564]:
                - columnheader "Variant" [ref=e565]
                - columnheader "Light" [ref=e566]
                - columnheader "Dark" [ref=e567]
            - rowgroup [ref=e568]:
              - row "Neutral White baseline Black baseline" [ref=e569]:
                - cell "Neutral" [ref=e570]:
                  - strong [ref=e571]: Neutral
                - cell "White baseline" [ref=e572]
                - cell "Black baseline" [ref=e573]
              - row "Vibrant High-energy civic portal High-contrast operations" [ref=e574]:
                - cell "Vibrant" [ref=e575]:
                  - strong [ref=e576]: Vibrant
                - cell "High-energy civic portal" [ref=e577]
                - cell "High-contrast operations" [ref=e578]
              - row "Pastel Soft service experience Warm low-light review mode" [ref=e579]:
                - cell "Pastel" [ref=e580]:
                  - strong [ref=e581]: Pastel
                - cell "Soft service experience" [ref=e582]
                - cell "Warm low-light review mode" [ref=e583]
        - article [ref=e584]:
          - heading "Component categories" [level=3] [ref=e585]
          - generic [ref=e586]:
            - article [ref=e587]:
              - strong [ref=e588]: Forms
              - generic [ref=e589]: Input, select, multiselect, date, password, checkbox
            - article [ref=e590]:
              - strong [ref=e591]: Navigation
              - generic [ref=e592]: Steps, timeline, accordion, menu
            - article [ref=e593]:
              - strong [ref=e594]: Overlays
              - generic [ref=e595]: Dialog, toast, date picker, password reveal
            - article [ref=e596]:
              - strong [ref=e597]: Data display
              - generic [ref=e598]: Table, meter, progress, chart
      - generic [ref=e599]:
        - generic [ref=e600]:
          - heading "PrimeNG smoke test" [level=3] [ref=e601]
          - paragraph [ref=e602]: Low-risk PrimeNG hosts are reintroduced here first. This panel should render real PrimeNG internals in both the direct QA remote and shell route.
        - generic [ref=e603]:
          - generic [ref=e605]: PrimeNG Tag
          - button " PrimeNG Button" [ref=e607] [cursor=pointer]:
            - generic [ref=e608]: 
            - generic [ref=e609]: PrimeNG Button
          - button "Open PrimeNG dialog" [ref=e610] [cursor=pointer]:
            - generic [ref=e611]: 
            - generic [ref=e612]: Open PrimeNG dialog
        - table [ref=e615]:
          - rowgroup [ref=e616]:
            - row "PrimeNG host Status" [ref=e617]:
              - columnheader "PrimeNG host" [ref=e618]
              - columnheader "Status" [ref=e619]
          - rowgroup [ref=e620]:
            - row "p-tag Rendered" [ref=e621]:
              - cell "p-tag" [ref=e622]
              - cell "Rendered" [ref=e623]
            - row "p-button outlined Rendered" [ref=e624]:
              - cell "p-button outlined" [ref=e625]
              - cell "Rendered" [ref=e626]
            - row "p-table Testing" [ref=e627]:
              - cell "p-table" [ref=e628]
              - cell "Testing" [ref=e629]
        - generic [ref=e631]:
          - generic [ref=e632]: PrimeNG card smoke
          - generic [ref=e633]: Isolated card host
          - paragraph [ref=e635]: "This card confirms that `p-card` can render in QA when it is not the only route-critical content."
      - generic [ref=e636]:
        - article [ref=e637]:
          - heading "Forms" [level=3] [ref=e638]
          - paragraph [ref=e639]: Inputs and validation surfaces
          - generic [ref=e640]: Applicant name
          - textbox "Applicant name" [ref=e641]: Jordan Avery
          - generic [ref=e642]: Program
          - combobox "Program" [ref=e643]:
            - option "Housing assistance" [selected]
            - option "Benefits renewal"
            - option "Permit review"
          - generic [ref=e644]: Regions
          - listbox "Regions" [ref=e645]:
            - option "North Region" [selected] [ref=e646]
            - option "Central Region" [ref=e647]
            - option "South Region" [ref=e648]
          - generic [ref=e649]: Review date
          - textbox "Review date" [ref=e650]: 2026-07-09
          - generic [ref=e651]: Temporary password
          - textbox "Temporary password" [ref=e652]:
            - /placeholder: Generate or enter password
          - generic [ref=e653]:
            - checkbox "Accessibility notes acknowledged" [checked] [ref=e654]
            - generic [ref=e655]: Accessibility notes acknowledged
        - article [ref=e656]:
          - heading "Navigation and flow" [level=3] [ref=e657]
          - list [ref=e658]:
            - listitem [ref=e659]: Draft
            - listitem [ref=e660]: Validate
            - listitem [ref=e661]: Publish
          - list [ref=e662]:
            - listitem [ref=e663]:
              - generic [ref=e664]: Step 1
              - strong [ref=e665]: Theme loaded
            - listitem [ref=e666]:
              - generic [ref=e667]: Step 2
              - strong [ref=e668]: Remote registered
            - listitem [ref=e669]:
              - generic [ref=e670]: Step 3
              - strong [ref=e671]: A11y audit
      - generic [ref=e672]:
        - article [ref=e673]:
          - heading "Data display" [level=3] [ref=e674]
          - table [ref=e675]:
            - rowgroup [ref=e676]:
              - row "Component Category Status" [ref=e677]:
                - columnheader "Component" [ref=e678]
                - columnheader "Category" [ref=e679]
                - columnheader "Status" [ref=e680]
            - rowgroup [ref=e681]:
              - row "Input / Select / MultiSelect Forms Ready" [ref=e682]:
                - cell "Input / Select / MultiSelect" [ref=e683]
                - cell "Forms" [ref=e684]
                - cell "Ready" [ref=e685]:
                  - generic [ref=e686]: Ready
              - row "Dialog / Toast / Menu Overlays Ready" [ref=e687]:
                - cell "Dialog / Toast / Menu" [ref=e688]
                - cell "Overlays" [ref=e689]
                - cell "Ready" [ref=e690]:
                  - generic [ref=e691]: Ready
              - row "Table / Meter / Chart Data display Review" [ref=e692]:
                - cell "Table / Meter / Chart" [ref=e693]
                - cell "Data display" [ref=e694]
                - cell "Review" [ref=e695]:
                  - generic [ref=e696]: Review
        - article [ref=e697]:
          - heading "Feedback and chart stand-ins" [level=3] [ref=e698]
          - generic [ref=e699]:
            - generic [ref=e700]: Message surface uses semantic success colors.
            - progressbar "QA coverage progress" [ref=e701]
            - generic [ref=e702]:
              - generic [ref=e703]: Forms
              - meter [ref=e704]
            - generic [ref=e705]:
              - generic [ref=e706]: Data
              - meter [ref=e707]
            - generic [ref=e708]:
              - generic [ref=e709]: Overlay
              - meter [ref=e710]
      - generic [ref=e711]:
        - article [ref=e712]:
          - heading "Overlays and actions" [level=3] [ref=e713]
          - generic [ref=e714]:
            - button "Open dialog" [ref=e715] [cursor=pointer]:
              - generic [ref=e716]: 
              - generic [ref=e717]: Open dialog
            - button "Show toast" [ref=e718] [cursor=pointer]:
              - generic [ref=e719]: 
              - generic [ref=e720]: Show toast
            - navigation "QA actions" [ref=e721]:
              - link "Open dialog" [ref=e722] [cursor=pointer]:
                - /url: "#qa-dialog"
                - generic [ref=e723]: 
                - generic [ref=e724]: Open dialog
              - link "Send toast" [ref=e725] [cursor=pointer]:
                - /url: "#qa-toast"
                - generic [ref=e726]: 
                - generic [ref=e727]: Send toast
        - article [ref=e728]:
          - heading "Disclosure and empty state" [level=3] [ref=e729]
          - group [ref=e730]:
            - generic "Theme coverage" [ref=e731] [cursor=pointer]
            - paragraph [ref=e732]: Run the automated a11y check against all theme combinations before changing tokens.
          - generic [ref=e733]:
            - generic [ref=e734]: 
            - heading "No contrast issues" [level=3] [ref=e735]
            - paragraph [ref=e736]: Automated checks should keep this route clean.
            - button "View report" [ref=e737] [cursor=pointer]
```

# Test source

```ts
  166 |     await page.waitForLoadState('networkidle');
  167 | 
  168 |     // Filter out known third-party errors
  169 |     const appErrors = errors.filter(
  170 |       (e) =>
  171 |         !e.includes('favicon') &&
  172 |         !e.includes('third-party') &&
  173 |         !e.includes('extension'),
  174 |     );
  175 | 
  176 |     expect(appErrors).toEqual([]);
  177 |   });
  178 | 
  179 |   test('should handle remote load failure gracefully', async ({ page }) => {
  180 |     // This test assumes error handling is in place
  181 |     page.on('console', (message) => {
  182 |       // Capture console messages for verification
  183 |     });
  184 | 
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
> 266 |     expect(loadTime).toBeLessThan(5000);
      |                      ^ Error: expect(received).toBeLessThan(expected)
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
  285 |     expect(shellTokens || remoteTokens).toBeTruthy();
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