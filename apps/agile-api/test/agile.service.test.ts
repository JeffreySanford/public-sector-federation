import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AgileService } from '../src/modules/agile/agile.service';
import type { PrismaService } from '../src/prisma/prisma.service';

const workItems = [
  {
    id: '1',
    slug: 'done-token-delivery',
    title: 'Compare token delivery methods',
    workstream: 'Token delivery architecture',
    type: 'story',
    status: 'done',
    effort: 'medium',
    owner: 'Tokens',
    summary: 'Compare shell and subapp token delivery paths.',
    includes: 'Shared package, shell CSS, subapp CSS, host variables.',
    blockerSummary: null,
    doneCriteria: 'Options and tradeoffs are documented.',
    sortOrder: 10,
    timeEntries: [{ minutes: 60 }, { minutes: 30 }],
  },
  {
    id: '2',
    slug: 'review-overlay-behavior',
    title: 'Validate overlay behavior',
    workstream: 'Architecture validation',
    type: 'task',
    status: 'review',
    effort: 'small',
    owner: 'Platform',
    summary: 'Confirm overlay container and token inheritance behavior.',
    includes: 'Dialog, Select, Menu.',
    blockerSummary: 'Overlay container behavior is not confirmed.',
    doneCriteria: 'Overlay behavior is verified in shell-mounted routes.',
    sortOrder: 20,
    timeEntries: [{ minutes: 45 }],
  },
  {
    id: '3',
    slug: 'next-zeroheight-dx',
    title: 'Validate Storybook and Zeroheight developer experience',
    workstream: 'Developer experience validation',
    type: 'task',
    status: 'next',
    effort: 'small',
    owner: 'Design system',
    summary: 'Prove a small evidence and guidance workflow.',
    includes: 'Storybook evidence, token display, component status.',
    blockerSummary: 'Needs production repository access.',
    doneCriteria: 'Zeroheight remains a small evidence surface.',
    sortOrder: 30,
    timeEntries: [],
  },
];

const blockers = [
  {
    slug: 'overlay-clipping-and-z-index',
    title: 'Overlay clipping and z-index',
    affectedArea: 'Dialog, Select, Menu',
    mitigation: 'Verify token inheritance in shell-composed routes.',
    owner: 'Platform',
    status: 'review',
  },
];

const acceptanceChecks = [
  {
    slug: 'promotion-decision',
    check: 'Promotion decision',
    evidence: 'Validation evidence is updated after validation.',
    gate: 'Storybook, direct remote, shell-mounted, and accessibility evidence exist.',
    status: 'done',
  },
];

const makeService = () => {
  const prisma = {
    sprint: {
      findFirst: async () => ({
        slug: 'sprint-1-design-system-hardening',
        name: 'Sprint 1',
        goal: 'Compare token delivery approaches.',
        status: 'active',
        workItems,
      }),
    },
    blocker: {
      findMany: async () => blockers,
    },
    acceptanceCheck: {
      findMany: async () => acceptanceChecks,
    },
    timeEntry: {
      findMany: async () => [{ minutes: 60 }, { minutes: 30 }, { minutes: 45 }],
    },
    workItem: {
      findMany: async () => workItems,
    },
  };

  return new AgileService(prisma as unknown as PrismaService);
};

describe('AgileService', () => {
  it('builds a dashboard with work item totals and sprint time summary', async () => {
    const dashboard = await makeService().dashboard();

    assert.equal(dashboard.sprint.slug, 'sprint-1-design-system-hardening');
    assert.equal(dashboard.timeSummary.totalMinutes, 135);
    assert.equal(dashboard.timeSummary.totalHours, 2.3);
    assert.equal(dashboard.timeSummary.entryCount, 3);

    assert.equal(dashboard.workItems[0].slug, 'done-token-delivery');
    assert.equal(dashboard.workItems[0].totalMinutes, 90);
    assert.equal(dashboard.workItems[1].blockerSummary, 'Overlay container behavior is not confirmed.');
    assert.equal(dashboard.blockers[0].owner, 'Platform');
    assert.equal(dashboard.acceptanceChecks[0].status, 'done');
  });

  it('groups report work by status and returns focused next-step recommendations', async () => {
    const report = await makeService().report();

    assert.equal(report.summary.completedCount, 1);
    assert.equal(report.summary.currentCount, 1);
    assert.equal(report.summary.remainingCount, 1);
    assert.equal(report.summary.blockerCount, 1);
    assert.equal(report.summary.totalTrackedHours, 2.3);

    assert.deepEqual(
      report.timeByWorkstream.map((entry) => [entry.workstream, entry.minutes]),
      [
        ['Token delivery architecture', 90],
        ['Architecture validation', 45],
        ['Developer experience validation', 0],
      ],
    );

    assert.ok(report.recommendations.some((recommendation) => recommendation.includes('Validate Storybook and Zeroheight developer experience')));
    assert.ok(report.recommendations.includes('Keep /qa and Storybook as the visual proof points for completed component work.'));
  });
});
