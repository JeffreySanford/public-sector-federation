export type CandidateLinkStatus = 'Available' | 'Local' | 'Pending';

export interface CandidateLink {
  id: 'storybook' | 'figma' | 'source' | 'stories' | 'tests' | 'plan';
  label: string;
  description: string;
  status: CandidateLinkStatus;
  href?: string;
  external?: boolean;
}

export const BUTTON_CANDIDATE_STORY_ID =
  'design-system-experiments-button-contract-exploration--current-vs-candidate';

export const BUTTON_CANDIDATE_STORYBOOK_URL =
  `http://localhost:4400/?path=/story/${BUTTON_CANDIDATE_STORY_ID}`;

export const BUTTON_CANDIDATE_STORYBOOK_EMBED_URL =
  `http://localhost:4400/iframe.html?id=${BUTTON_CANDIDATE_STORY_ID}&viewMode=story&shortcuts=false&singleStory=true`;

const githubRoot =
  'https://github.com/JeffreySanford/public-sector-federation/blob/master';

export const candidateLinks: readonly CandidateLink[] = [
  {
    id: 'storybook',
    label: 'Open live Storybook comparison',
    description:
      'Runs locally on port 4400 and opens the Current vs Candidate story with the Storybook toolbar and addons.',
    status: 'Local',
    href: BUTTON_CANDIDATE_STORYBOOK_URL,
    external: true,
  },
  {
    id: 'figma',
    label: 'Open Button candidate Figma component',
    description:
      'Pending an approved Button component URL and verified variable collection.',
    status: 'Pending',
  },
  {
    id: 'source',
    label: 'Candidate wrapper source',
    description: 'Angular ps-button-candidate implementation in the governed ui-patterns package.',
    status: 'Available',
    href: `${githubRoot}/packages/ui-patterns/src/public-button-candidate.component.ts`,
    external: true,
  },
  {
    id: 'stories',
    label: 'Candidate Storybook source',
    description: 'All candidate variants, matrices, interaction harness, and current-versus-candidate story.',
    status: 'Available',
    href: `${githubRoot}/apps/qa-remote/src/stories/button-candidate.stories.ts`,
    external: true,
  },
  {
    id: 'tests',
    label: 'Candidate Component Lab and federation tests',
    description: 'Direct Component Lab and shell-composed Playwright coverage for the Candidates view.',
    status: 'Available',
    href: `${githubRoot}/apps/qa-remote/e2e/candidates-view.spec.ts`,
    external: true,
  },
  {
    id: 'plan',
    label: 'Button candidate overview',
    description: 'Lifecycle, source-of-truth boundaries, and links to design, developer, and validation guidance.',
    status: 'Available',
    href: `${githubRoot}/docs/design-system/components/button-candidate.md`,
    external: true,
  },
];
