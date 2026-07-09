import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://public_sector:public_sector@localhost:5432/public_sector_agile?schema=public';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const seedPath = join(dirname(fileURLToPath(import.meta.url)), 'seed-data', 'agile-workflow.seed.json');
const seed = JSON.parse(await readFile(seedPath, 'utf8'));

await prisma.$transaction(async (tx) => {
  await tx.timeEntry.deleteMany();
  await tx.acceptanceCheck.deleteMany();
  await tx.blocker.deleteMany();
  await tx.workItem.deleteMany();
  await tx.sprint.deleteMany();

  const sprint = await tx.sprint.create({
    data: {
      slug: seed.sprint.slug,
      name: seed.sprint.name,
      goal: seed.sprint.goal,
      status: seed.sprint.status,
      startsOn: seed.sprint.startsOn ? new Date(seed.sprint.startsOn) : null,
      endsOn: seed.sprint.endsOn ? new Date(seed.sprint.endsOn) : null,
    },
  });

  const createdWorkItems = new Map();

  for (const item of seed.workItems) {
    const created = await tx.workItem.create({
      data: {
        ...item,
        sprintId: sprint.id,
      },
    });
    createdWorkItems.set(created.slug, created);
  }

  for (const check of seed.acceptanceChecks) {
    const workItem = createdWorkItems.get(check.workItemSlug);
    await tx.acceptanceCheck.create({
      data: {
        slug: check.slug,
        check: check.check,
        evidence: check.evidence,
        gate: check.gate,
        status: check.status,
        workItemId: workItem?.id,
      },
    });
  }

  for (const blocker of seed.blockers) {
    const workItem = createdWorkItems.get(blocker.workItemSlug);
    await tx.blocker.create({
      data: {
        slug: blocker.slug,
        title: blocker.title,
        affectedArea: blocker.affectedArea,
        mitigation: blocker.mitigation,
        owner: blocker.owner,
        status: blocker.status,
        workItemId: workItem?.id,
      },
    });
  }

  for (const entry of seed.timeEntries) {
    const workItem = createdWorkItems.get(entry.workItemSlug);
    if (!workItem) {
      continue;
    }

    await tx.timeEntry.create({
      data: {
        activityType: entry.activityType,
        entryDate: new Date(entry.entryDate),
        minutes: entry.minutes,
        note: entry.note,
        workItemId: workItem.id,
      },
    });
  }
});

await prisma.$disconnect();

console.log(`Seeded Agile workflow data for ${seed.sprint.slug}.`);
