CREATE TYPE "SprintStatus" AS ENUM ('planned', 'active', 'closed');
CREATE TYPE "WorkItemStatus" AS ENUM ('backlog', 'next', 'in_progress', 'blocked', 'review', 'done');
CREATE TYPE "WorkItemType" AS ENUM ('story', 'task', 'spike', 'blocker');
CREATE TYPE "EffortLevel" AS ENUM ('small', 'medium', 'large');
CREATE TYPE "TimeActivityType" AS ENUM ('discovery', 'design', 'development', 'review', 'validation', 'documentation');

CREATE TABLE "Sprint" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "status" "SprintStatus" NOT NULL DEFAULT 'planned',
  "startsOn" TIMESTAMP(3),
  "endsOn" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkItem" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "workstream" TEXT NOT NULL,
  "type" "WorkItemType" NOT NULL DEFAULT 'story',
  "status" "WorkItemStatus" NOT NULL DEFAULT 'backlog',
  "effort" "EffortLevel" NOT NULL,
  "owner" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "includes" TEXT NOT NULL,
  "blockerSummary" TEXT,
  "doneCriteria" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "sprintId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Blocker" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "affectedArea" TEXT NOT NULL,
  "mitigation" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "status" "WorkItemStatus" NOT NULL DEFAULT 'blocked',
  "workItemId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Blocker_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcceptanceCheck" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "check" TEXT NOT NULL,
  "evidence" TEXT NOT NULL,
  "gate" TEXT NOT NULL,
  "status" "WorkItemStatus" NOT NULL DEFAULT 'next',
  "workItemId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcceptanceCheck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TimeEntry" (
  "id" TEXT NOT NULL,
  "workItemId" TEXT NOT NULL,
  "activityType" "TimeActivityType" NOT NULL,
  "entryDate" TIMESTAMP(3) NOT NULL,
  "minutes" INTEGER NOT NULL,
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Sprint_slug_key" ON "Sprint"("slug");
CREATE UNIQUE INDEX "WorkItem_slug_key" ON "WorkItem"("slug");
CREATE UNIQUE INDEX "Blocker_slug_key" ON "Blocker"("slug");
CREATE UNIQUE INDEX "AcceptanceCheck_slug_key" ON "AcceptanceCheck"("slug");

ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Blocker" ADD CONSTRAINT "Blocker_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AcceptanceCheck" ADD CONSTRAINT "AcceptanceCheck_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
