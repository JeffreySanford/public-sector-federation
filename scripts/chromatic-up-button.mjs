import 'dotenv/config';
import { spawnSync } from 'node:child_process';

const projectToken = process.env['CHROMATIC_PROJECT_TOKEN'];

if (!projectToken) {
  console.error('Missing CHROMATIC_PROJECT_TOKEN. Add it to .env or the CI secret store before running Chromatic.');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  [
    'chromatic',
    '--build-script-name=build-storybook:qa',
    '--only-story-files=apps/qa-remote/src/stories/up-button.stories.ts',
  ],
  {
    shell: true,
    env: {
      ...process.env,
      CHROMATIC_PROJECT_TOKEN: projectToken,
    },
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
