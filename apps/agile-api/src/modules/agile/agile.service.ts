import { Injectable, NotFoundException } from '@nestjs/common';
import type { AcceptanceCheck, Blocker, Prisma, TimeEntry, WorkItem } from '@prisma/client';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateAcceptanceCheckDto } from './dto/acceptance-check.dto';
import type { CreateBlockerDto, UpdateBlockerDto } from './dto/blocker.dto';
import { workItemStatuses } from './dto/agile.enums';
import type { CreateTimeEntryDto } from './dto/time-entry.dto';
import type { CreateWorkItemDto, UpdateWorkItemDto, WorkItemResponseDto } from './dto/work-item.dto';
import type { AgileDashboardResponseDto, KanbanColumnResponseDto } from './dto/dashboard.dto';

type WorkItemWithTime = WorkItem & { timeEntries: Pick<TimeEntry, 'minutes'>[] };
const seedFilePath = join(process.cwd(), 'apps', 'agile-api', 'prisma', 'seed-data', 'agile-workflow.seed.json');

@Injectable()
export class AgileService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(): Promise<AgileDashboardResponseDto> {
    const sprint = await this.prisma.sprint.findFirst({
      orderBy: { startsOn: 'desc' },
      include: {
        workItems: {
          include: { timeEntries: { select: { minutes: true } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!sprint) {
      throw new NotFoundException('No sprint data has been seeded yet.');
    }

    const [blockers, acceptanceChecks, timeEntries] = await Promise.all([
      this.prisma.blocker.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.acceptanceCheck.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.timeEntry.findMany(),
    ]);

    const totalMinutes = timeEntries.reduce((sum, entry) => sum + entry.minutes, 0);

    return {
      sprint: {
        slug: sprint.slug,
        name: sprint.name,
        goal: sprint.goal,
        status: sprint.status,
      },
      workItems: sprint.workItems.map((item) => this.toWorkItemResponse(item)),
      blockers: blockers.map((blocker) => this.toBlockerResponse(blocker)),
      acceptanceChecks: acceptanceChecks.map((check) => this.toAcceptanceCheckResponse(check)),
      timeSummary: {
        totalMinutes,
        totalHours: Number((totalMinutes / 60).toFixed(1)),
        entryCount: timeEntries.length,
      },
    };
  }

  async kanban(): Promise<KanbanColumnResponseDto[]> {
    const items = await this.prisma.workItem.findMany({
      include: { timeEntries: { select: { minutes: true } } },
      orderBy: [{ status: 'asc' }, { sortOrder: 'asc' }],
    });

    return workItemStatuses.map((status) => ({
      status,
      items: items.filter((item) => item.status === status).map((item) => this.toWorkItemResponse(item)),
    }));
  }

  async listWorkItems(): Promise<WorkItemResponseDto[]> {
    const items = await this.prisma.workItem.findMany({
      include: { timeEntries: { select: { minutes: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    return items.map((item) => this.toWorkItemResponse(item));
  }

  async createWorkItem(dto: CreateWorkItemDto): Promise<WorkItemResponseDto> {
    const sprint = await this.findSprint(dto.sprintSlug);
    const item = await this.prisma.workItem.create({
      data: {
        ...this.workItemData(dto),
        sprintId: sprint.id,
      },
      include: { timeEntries: { select: { minutes: true } } },
    });
    await this.writeSeedFile();
    return this.toWorkItemResponse(item);
  }

  async updateWorkItem(slug: string, dto: UpdateWorkItemDto): Promise<WorkItemResponseDto> {
    const { sprintSlug, ...rest } = dto;
    const data: Prisma.WorkItemUpdateInput = { ...rest };

    if (sprintSlug) {
      data.sprint = { connect: { slug: sprintSlug } };
    }

    const item = await this.prisma.workItem.update({
      where: { slug },
      data,
      include: { timeEntries: { select: { minutes: true } } },
    });
    await this.writeSeedFile();
    return this.toWorkItemResponse(item);
  }

  async deleteWorkItem(slug: string): Promise<void> {
    await this.prisma.workItem.delete({ where: { slug } });
    await this.writeSeedFile();
  }

  async createBlocker(dto: CreateBlockerDto): Promise<ReturnType<AgileService['toBlockerResponse']>> {
    const blocker = await this.prisma.blocker.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        affectedArea: dto.affectedArea,
        mitigation: dto.mitigation,
        owner: dto.owner,
        status: dto.status,
        workItem: dto.workItemSlug ? { connect: { slug: dto.workItemSlug } } : undefined,
      },
    });
    await this.writeSeedFile();
    return this.toBlockerResponse(blocker);
  }

  async updateBlocker(slug: string, dto: UpdateBlockerDto): Promise<ReturnType<AgileService['toBlockerResponse']>> {
    const blocker = await this.prisma.blocker.update({
      where: { slug },
      data: {
        title: dto.title,
        affectedArea: dto.affectedArea,
        mitigation: dto.mitigation,
        owner: dto.owner,
        status: dto.status,
        workItem: dto.workItemSlug ? { connect: { slug: dto.workItemSlug } } : undefined,
      },
    });
    await this.writeSeedFile();
    return this.toBlockerResponse(blocker);
  }

  async createAcceptanceCheck(
    dto: CreateAcceptanceCheckDto,
  ): Promise<ReturnType<AgileService['toAcceptanceCheckResponse']>> {
    const check = await this.prisma.acceptanceCheck.create({
      data: {
        slug: dto.slug,
        check: dto.check,
        evidence: dto.evidence,
        gate: dto.gate,
        status: dto.status,
        workItem: dto.workItemSlug ? { connect: { slug: dto.workItemSlug } } : undefined,
      },
    });
    await this.writeSeedFile();
    return this.toAcceptanceCheckResponse(check);
  }

  async createTimeEntry(dto: CreateTimeEntryDto): Promise<{ id: string; workItemSlug: string; minutes: number }> {
    const workItem = await this.findWorkItem(dto.workItemSlug);
    const entry = await this.prisma.timeEntry.create({
      data: {
        workItemId: workItem.id,
        activityType: dto.activityType,
        entryDate: new Date(dto.entryDate),
        minutes: dto.minutes,
        note: dto.note,
      },
    });
    await this.writeSeedFile();
    return { id: entry.id, workItemSlug: workItem.slug, minutes: entry.minutes };
  }

  async exportWorkflow() {
    const sprint = await this.prisma.sprint.findFirst({
      orderBy: { startsOn: 'desc' },
      include: {
        workItems: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!sprint) {
      throw new NotFoundException('No sprint data has been seeded yet.');
    }

    const [acceptanceChecks, blockers, timeEntries] = await Promise.all([
      this.prisma.acceptanceCheck.findMany({ include: { workItem: { select: { slug: true } } }, orderBy: { createdAt: 'asc' } }),
      this.prisma.blocker.findMany({ include: { workItem: { select: { slug: true } } }, orderBy: { createdAt: 'asc' } }),
      this.prisma.timeEntry.findMany({ include: { workItem: { select: { slug: true } } }, orderBy: { entryDate: 'asc' } }),
    ]);

    return {
      sprint: {
        slug: sprint.slug,
        name: sprint.name,
        goal: sprint.goal,
        status: sprint.status,
        startsOn: sprint.startsOn?.toISOString() ?? null,
        endsOn: sprint.endsOn?.toISOString() ?? null,
      },
      workItems: sprint.workItems.map((item) => ({
        slug: item.slug,
        title: item.title,
        workstream: item.workstream,
        type: item.type,
        status: item.status,
        effort: item.effort,
        owner: item.owner,
        summary: item.summary,
        includes: item.includes,
        blockerSummary: item.blockerSummary,
        doneCriteria: item.doneCriteria,
        sortOrder: item.sortOrder,
      })),
      acceptanceChecks: acceptanceChecks.map((check) => ({
        slug: check.slug,
        check: check.check,
        evidence: check.evidence,
        gate: check.gate,
        status: check.status,
        workItemSlug: check.workItem?.slug ?? null,
      })),
      blockers: blockers.map((blocker) => ({
        slug: blocker.slug,
        title: blocker.title,
        affectedArea: blocker.affectedArea,
        mitigation: blocker.mitigation,
        owner: blocker.owner,
        status: blocker.status,
        workItemSlug: blocker.workItem?.slug ?? null,
      })),
      timeEntries: timeEntries.map((entry) => ({
        workItemSlug: entry.workItem.slug,
        activityType: entry.activityType,
        entryDate: entry.entryDate.toISOString(),
        minutes: entry.minutes,
        note: entry.note,
      })),
    };
  }

  async writeSeedFile() {
    const exportData = await this.exportWorkflow();
    await writeFile(seedFilePath, `${JSON.stringify(exportData, null, 2)}\n`);
    return {
      path: seedFilePath,
      hash: this.hashJson(exportData),
      synced: true,
    };
  }

  async exportStatus() {
    const exportData = await this.exportWorkflow();
    const databaseHash = this.hashJson(exportData);
    let seedHash = '';
    let synced = false;

    try {
      const seedData = JSON.parse(await readFile(seedFilePath, 'utf8'));
      seedHash = this.hashJson(seedData);
      synced = seedHash === databaseHash;
    } catch {
      seedHash = 'missing';
    }

    return {
      synced,
      seedFilePath,
      databaseHash,
      seedHash,
    };
  }

  async report() {
    const [dashboard, kanban] = await Promise.all([this.dashboard(), this.kanban()]);
    const completed = dashboard.workItems.filter((item) => item.status === 'done');
    const current = dashboard.workItems.filter((item) => ['in_progress', 'review', 'blocked'].includes(item.status));
    const remaining = dashboard.workItems.filter((item) => ['backlog', 'next'].includes(item.status));
    const minutesByWorkstream = dashboard.workItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.workstream] = (acc[item.workstream] ?? 0) + item.totalMinutes;
      return acc;
    }, {});

    return {
      generatedAt: new Date().toISOString(),
      sprint: dashboard.sprint,
      summary: {
        completedCount: completed.length,
        currentCount: current.length,
        remainingCount: remaining.length,
        blockerCount: dashboard.blockers.filter((blocker) => blocker.status !== 'done').length,
        totalTrackedHours: dashboard.timeSummary.totalHours,
      },
      completedWork: completed,
      currentStatus: current,
      workLeft: remaining,
      blockers: dashboard.blockers,
      acceptanceChecks: dashboard.acceptanceChecks,
      timeSummary: dashboard.timeSummary,
      timeByWorkstream: Object.entries(minutesByWorkstream).map(([workstream, minutes]) => ({
        workstream,
        minutes,
        hours: Number((minutes / 60).toFixed(1)),
      })),
      kanban,
      recommendations: [
        ...remaining.slice(0, 2).map((item) => `Next: ${item.title} (${item.status.replace('_', ' ')}).`),
        'Keep /qa and Storybook as the visual proof points for completed component work.',
        'Run `pnpm report:all` before executive or lead developer reviews.',
      ],
    };
  }

  private async findSprint(slug: string): Promise<{ id: string }> {
    const sprint = await this.prisma.sprint.findUnique({ where: { slug }, select: { id: true } });
    if (!sprint) {
      throw new NotFoundException(`Sprint ${slug} was not found.`);
    }
    return sprint;
  }

  private async findWorkItem(slug: string): Promise<{ id: string; slug: string }> {
    const item = await this.prisma.workItem.findUnique({ where: { slug }, select: { id: true, slug: true } });
    if (!item) {
      throw new NotFoundException(`Work item ${slug} was not found.`);
    }
    return item;
  }

  private workItemData(dto: CreateWorkItemDto): Prisma.WorkItemUncheckedCreateInput {
    return {
      slug: dto.slug,
      title: dto.title,
      workstream: dto.workstream,
      type: dto.type,
      status: dto.status,
      effort: dto.effort,
      owner: dto.owner,
      summary: dto.summary,
      includes: dto.includes,
      blockerSummary: dto.blockerSummary,
      doneCriteria: dto.doneCriteria,
      sortOrder: dto.sortOrder ?? 0,
      sprintId: '',
    };
  }

  private toWorkItemResponse(item: WorkItemWithTime): WorkItemResponseDto {
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      workstream: item.workstream,
      type: item.type,
      status: item.status,
      effort: item.effort,
      owner: item.owner,
      summary: item.summary,
      includes: item.includes,
      blockerSummary: item.blockerSummary,
      doneCriteria: item.doneCriteria,
      sortOrder: item.sortOrder,
      totalMinutes: item.timeEntries.reduce((sum, entry) => sum + entry.minutes, 0),
    };
  }

  private toBlockerResponse(blocker: Blocker) {
    return {
      slug: blocker.slug,
      title: blocker.title,
      affectedArea: blocker.affectedArea,
      mitigation: blocker.mitigation,
      owner: blocker.owner,
      status: blocker.status,
    };
  }

  private toAcceptanceCheckResponse(check: AcceptanceCheck) {
    return {
      slug: check.slug,
      check: check.check,
      evidence: check.evidence,
      gate: check.gate,
      status: check.status,
    };
  }

  private hashJson(value: unknown): string {
    return createHash('sha256').update(JSON.stringify(value)).digest('hex');
  }
}
