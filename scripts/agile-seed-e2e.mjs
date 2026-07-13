import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const seedPath = join(process.cwd(), 'apps/agile-api/prisma/seed-data/agile-workflow.seed.json');
const seed = JSON.parse(await readFile(seedPath, 'utf8'));

const allowedStatuses = new Set(['backlog', 'next', 'in_progress', 'blocked', 'review', 'done']);
const requiredWorkItems = new Set([
  'execute-e2e-tests',
  'ci-cd-integration',
  'performance-benchmarking',
  'code-coverage-reports',
  'testing-documentation',
  'performance-tracking',
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

assert(seed.sprint?.slug === 'test-sprint', 'Seed sprint slug changed unexpectedly.');
assert(seed.sprint?.status === 'active', 'Seed sprint should remain active for the current agile plan.');

for (const collection of ['workItems', 'acceptanceChecks', 'blockers', 'timeEntries']) {
  assert(Array.isArray(seed[collection]), `Seed ${collection} must be an array.`);
}

assert(seed.workItems.length > 0, 'Seed workItems must be a non-empty array.');

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
assert(statusBySlug.get('execute-e2e-tests') === 'done', 'E2E test execution should stay done in the current seed.');
assert(statusBySlug.get('performance-tracking') === 'done', 'Performance tracking should stay done in the current seed.');

const doneItems = seed.workItems.filter((workItem) => workItem.status === 'done');
const openItems = seed.workItems.filter((workItem) => workItem.status !== 'done');
assert(doneItems.length >= 1, 'Seed should include completed validation work.');
assert(doneItems.length + openItems.length === seed.workItems.length, 'Seed work item status counts should cover every work item.');

console.log(`Agile seed e2e checks passed for ${seed.workItems.length} work items, ${seed.acceptanceChecks.length} checks, and ${seed.blockers.length} blockers.`);
