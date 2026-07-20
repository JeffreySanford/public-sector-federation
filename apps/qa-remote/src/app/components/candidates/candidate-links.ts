export type CandidateLinkStatus = 'Available' | 'Local' | 'Pending';

export interface CandidateLink {
  id: 'storybook' | 'zeroheight' | 'figma' | 'source' | 'stories' | 'tests' | 'plan';
  label: string;
  description: string;
  status: CandidateLinkStatus;
  href?: string;
  external?: boolean;
}

export const UP_BUTTON_STORY_ID =
  'design-system-experiments-button-contract-exploration--current-vs-candidate';

export const UP_BUTTON_STORYBOOK_URL =
  `http://localhost:4400/?path=/story/${UP_BUTTON_STORY_ID}`;

export const UP_BUTTON_STORYBOOK_EMBED_URL =
  `http://localhost:4400/iframe.html?id=${UP_BUTTON_STORY_ID}&viewMode=story&shortcuts=false&singleStory=true`;

const githubRoot =
  'https://github.com/JeffreySanford/public-sector-federation/blob/master';

export const candidateLinks: readonly CandidateLink[] = [
  {
    id: 'storybook',
    label: 'Open live Storybook comparison',
    description:
      'Runs locally on port 4400 and opens the Current vs Candidate story with the Storybook toolbar and addons.',
    status: 'Local',
    href: UP_BUTTON_STORYBOOK_URL,
    external: true,
  },
  {
    id: 'zeroheight',
    label: 'Open Button Candidate in Zeroheight',
    description:
      'Governed Candidate documentation with status, comparison guidance, design and token direction, developer usage, and validation evidence.',
    status: 'Available',
    href: 'https://jeffreysanford.zeroheight.com/styleguide/s/143938/p/238541-up-button-Candidate',
    external: true,
  },
  {
    id: 'figma',
    label: 'Open UP Button Figma component',
    description:
      'Pending an approved UP Design System Button component URL and verified variable collection.',
    status: 'Pending',
  },
  {
    id: 'source',
    label: 'Candidate wrapper source',
    description: 'Angular ps-up-button implementation in the governed ui-patterns package.',
    status: 'Available',
    href: `${githubRoot}/packages/ui-patterns/src/public-up-button.component.ts`,
    external: true,
  },
  {
    id: 'stories',
    label: 'Candidate Storybook source',
    description: 'All candidate variants, matrices, interaction harness, and current-versus-candidate story.',
    status: 'Available',
    href: `${githubRoot}/apps/qa-remote/src/stories/up-button.stories.ts`,
    external: true,
  },
  {
    id: 'tests',
    label: 'Candidate QA and federation tests',
    description: 'Direct QA remote and shell-composed Playwright coverage for the Candidates view.',
    status: 'Available',
    href: `${githubRoot}/apps/qa-remote/e2e/candidates-view.spec.ts`,
    external: true,
  },
  {
    id: 'plan',
    label: 'UP Button candidate integration plan',
    description: 'Token, Figma, Storybook, testing, Zeroheight, and promotion checklist.',
    status: 'Available',
    href: `${githubRoot}/docs/design-system/components/button-candidate-integration-plan.md`,
    external: true,
  },
];
