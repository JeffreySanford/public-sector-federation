#!/usr/bin/env node

import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(
  command,
  ['exec', 'playwright', 'test', '--config', 'apps/starlight/playwright.config.ts', '--update-snapshots'],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      UPDATE_STARLIGHT_SNAPSHOTS: '1',
    },
  },
);

child.on('error', (error) => {
  console.error(`Unable to start Playwright: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 1));
