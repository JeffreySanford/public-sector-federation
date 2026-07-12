# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\qa-remote\e2e\storybook-stories.spec.ts >> Storybook Stories - Accessibility (WCAG 2.1 AA) >> should pass axe accessibility checks on story
- Location: apps\qa-remote\e2e\storybook-stories.spec.ts:79:7

# Error details

```
Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - banner "Storybook" [ref=e6]:
      - heading "Storybook" [level=1] [ref=e7]
      - img
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]:
            - link "Skip to content" [ref=e14] [cursor=pointer]:
              - /url: "#storybook-preview-wrapper"
            - link "Storybook" [ref=e16] [cursor=pointer]:
              - /url: ./
              - img "Storybook" [ref=e17]
            - switch "Settings" [ref=e22] [cursor=pointer]:
              - img [ref=e23]
          - generic [ref=e28]:
            - generic [ref=e30] [cursor=pointer]:
              - button "Open onboarding guide" [ref=e34]:
                - img [ref=e36]
                - strong [ref=e38]: Get started
              - generic [ref=e39]:
                - button "Collapse onboarding guide" [expanded] [ref=e40]:
                  - img [ref=e41]
                - button "33% completed" [ref=e43]:
                  - generic [ref=e44]:
                    - img [ref=e45]
                    - img [ref=e47]
                  - generic [ref=e50]: 33%
            - list [ref=e52]:
              - listitem [ref=e53]:
                - button "Open onboarding guide for Change a story with Controls" [ref=e54] [cursor=pointer]:
                  - img [ref=e56]
                  - generic [ref=e59]: Change a story with Controls
              - listitem [ref=e60]:
                - button "Open onboarding guide for Publish your Storybook for feedback" [ref=e61] [cursor=pointer]:
                  - img [ref=e63]
                  - generic [ref=e66]: Publish your Storybook for feedback
              - listitem [ref=e67]:
                - button "Open onboarding guide for Test functionality with interactions" [ref=e68] [cursor=pointer]:
                  - img [ref=e70]
                  - generic [ref=e73]: Test functionality with interactions
        - generic [ref=e74]: Search for components
        - search [ref=e75]:
          - combobox "Search for components" [ref=e76]:
            - generic:
              - img
            - searchbox "Search for components" [ref=e77]
            - code: ⌃ K
            - button "Tag filters" [ref=e79] [cursor=pointer]:
              - img [ref=e80]
        - navigation "Stories" [ref=e83]:
          - heading "Stories" [level=2] [ref=e84]
          - generic [ref=e86]:
            - generic [ref=e87]:
              - button "Collapse" [expanded] [ref=e88] [cursor=pointer]:
                - img [ref=e90]
                - text: Design System
              - button "Expand all" [ref=e92] [cursor=pointer]:
                - img [ref=e93]
            - button "Acceptance" [ref=e96] [cursor=pointer]:
              - generic [ref=e97]:
                - img [ref=e99]
                - img [ref=e101]
              - text: Acceptance
            - button "PrimeNG Playground" [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - img [ref=e107]
                - img [ref=e109]
              - text: PrimeNG Playground
            - button "Problem Areas" [ref=e112] [cursor=pointer]:
              - generic [ref=e113]:
                - img [ref=e115]
                - img [ref=e117]
              - text: Problem Areas
    - separator "Sidebar resize handle" [ref=e119]
  - generic [ref=e121]:
    - region "Toolbar" [ref=e122]:
      - heading "Toolbar" [level=2] [ref=e123]
      - toolbar [ref=e124]:
        - generic [ref=e125]:
          - button "Public-sector theme variant neutral" [ref=e127] [cursor=pointer]:
            - img [ref=e128]
            - text: neutral
          - button "Light or dark mode light" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
            - text: light
    - main "Main preview area" [ref=e133]:
      - heading "Main preview area" [level=2] [ref=e134]
      - iframe [ref=e140]:
        - generic [ref=f1e5]:
          - generic [ref=f1e6]:
            - generic [ref=f1e8]: "Acceptance: Button / Tag"
            - heading "Button and tag acceptance states" [level=1] [ref=f1e9]
            - paragraph [ref=f1e10]: Proves action hierarchy, icon spacing, severity labels, disabled states, and focusable controls.
          - generic [ref=f1e11]:
            - article [ref=f1e12]:
              - heading "Action hierarchy" [level=2] [ref=f1e13]
              - generic [ref=f1e14]:
                - button " Primary action" [ref=f1e16] [cursor=pointer]:
                  - generic [ref=f1e17]: 
                  - generic [ref=f1e18]: Primary action
                - button " Outlined action" [ref=f1e20] [cursor=pointer]:
                  - generic [ref=f1e21]: 
                  - generic [ref=f1e22]: Outlined action
                - button " Text action" [ref=f1e24] [cursor=pointer]:
                  - generic [ref=f1e25]: 
                  - generic [ref=f1e26]: Text action
                - button " Disabled action" [disabled] [ref=f1e28]:
                  - generic [ref=f1e29]: 
                  - generic [ref=f1e30]: Disabled action
            - article [ref=f1e31]:
              - heading "Status language" [level=2] [ref=f1e32]
              - generic [ref=f1e33]:
                - generic [ref=f1e35]: On track
                - generic [ref=f1e37]: Watch
                - generic [ref=f1e39]: Delayed
                - generic [ref=f1e41]: Draft
          - article [ref=f1e42]:
            - heading "Acceptance checks" [level=2] [ref=f1e43]
            - list [ref=f1e44]:
              - listitem [ref=f1e45]: Icons and labels keep visible spacing.
              - listitem [ref=f1e46]: Filled and outlined actions keep contrast in all theme modes.
              - listitem [ref=f1e47]: Status labels use meaningful text, not color alone.
              - listitem [ref=f1e48]: Disabled actions remain visibly disabled without disappearing.
```