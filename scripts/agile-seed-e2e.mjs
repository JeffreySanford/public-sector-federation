import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const seedPath = join(process.cwd(), 'apps/agile-api/prisma/seed-data/agile-workflow.seed.json');
const seed = JSON.parse(await readFile(seedPath, 'utf8'));

const allowedStatuses = new Set(['backlog', 'next', 'in_progress', 'blocked', 'review', 'done']);
const requiredWorkItems = new Set([
  'harden-proven-primeng-families',
  'create-storybook-acceptance-checks',
  'track-platform-validation-risks',
  'compare-token-delivery-methods',
  'validate-storybook-zeroheight-dx',
  'citizen-services-primeng-reintroduction',
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertUnique(items, field, label) {
  const seen = new Set();
  for (const item of items) {
    assert(typeof item[field] === 'string' && item[field].length > 0, `${label} is missing ${field}.`);
    assert(!seen.has(item[field]), `${label} has duplicate ${field}: ${item[field]}.`);
    seen.add(item[field]);
  }
  return seen;
}

assert(seed.sprint?.slug === 'sprint-1-design-system-hardening', 'Seed sprint slug changed unexpectedly.');
assert(seed.sprint?.status === 'active', 'Seed sprint should remain active for the current agile plan.');

for (const collection of ['workItems', 'acceptanceChecks', 'blockers', 'timeEntries']) {
  assert(Array.isArray(seed[collection]) && seed[collection].length > 0, `Seed ${collection} must be a non-empty array.`);
}

const workItemSlugs = assertUnique(seed.workItems, 'slug', 'workItems');
assertUnique(seed.acceptanceChecks, 'slug', 'acceptanceChecks');
assertUnique(seed.blockers, 'slug', 'blockers');

for (const requiredSlug of requiredWorkItems) {
  assert(workItemSlugs.has(requiredSlug), `Seed is missing required work item: ${requiredSlug}.`);
}

for (const workItem of seed.workItems) {
  assert(allowedStatuses.has(workItem.status), `Work item ${workItem.slug} has unsupported status: ${workItem.status}.`);
  assert(Number.isInteger(workItem.sortOrder), `Work item ${workItem.slug} needs an integer sortOrder.`);
}

for (const collection of ['acceptanceChecks', 'blockers', 'timeEntries']) {
  for (const item of seed[collection]) {
    assert(workItemSlugs.has(item.workItemSlug), `${collection} entry references unknown work item: ${item.workItemSlug}.`);
  }
}

const statusBySlug = new Map(seed.workItems.map((workItem) => [workItem.slug, workItem.status]));
assert(statusBySlug.get('validate-storybook-zeroheight-dx') === 'next', 'Storybook and Zeroheight DX should stay next in the agile plan.');
assert(statusBySlug.get('citizen-services-primeng-reintroduction') === 'backlog', 'Citizen Services PrimeNG reintroduction should stay backlog.');

const formControlsBlocker = seed.blockers.find((blocker) => blocker.slug === 'form-controls-not-reintroduced');
assert(formControlsBlocker, 'Seed is missing the form controls reintroduction blocker.');
assert(
  formControlsBlocker.workItemSlug === 'citizen-services-primeng-reintroduction',
  'Form controls blocker must stay linked to Citizen Services PrimeNG reintroduction.',
);
assert(formControlsBlocker.status === 'backlog', 'Form controls blocker should remain backlog until direct remote and shell-mounted checks pass.');

const doneItems = seed.workItems.filter((workItem) => workItem.status === 'done');
const openItems = seed.workItems.filter((workItem) => workItem.status !== 'done');
assert(doneItems.length >= 1, 'Seed should include completed validation work.');
assert(openItems.length >= 1, 'Seed should include remaining agile plan work.');

console.log(`Agile seed e2e checks passed for ${seed.workItems.length} work items, ${seed.acceptanceChecks.length} checks, and ${seed.blockers.length} blockers.`);
