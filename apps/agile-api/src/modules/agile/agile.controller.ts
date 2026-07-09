import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AgileService } from './agile.service';
import { CreateAcceptanceCheckDto } from './dto/acceptance-check.dto';
import { CreateBlockerDto, UpdateBlockerDto } from './dto/blocker.dto';
import { AgileDashboardResponseDto, KanbanColumnResponseDto } from './dto/dashboard.dto';
import { CreateTimeEntryDto } from './dto/time-entry.dto';
import { CreateWorkItemDto, UpdateWorkItemDto, WorkItemResponseDto } from './dto/work-item.dto';

@ApiTags('agile')
@Controller('agile')
export class AgileController {
  constructor(private readonly agile: AgileService) {}

  @Get('dashboard')
  @ApiOkResponse({ type: AgileDashboardResponseDto })
  dashboard(): Promise<AgileDashboardResponseDto> {
    return this.agile.dashboard();
  }

  @Get('kanban')
  @ApiOkResponse({ type: [KanbanColumnResponseDto] })
  kanban(): Promise<KanbanColumnResponseDto[]> {
    return this.agile.kanban();
  }

  @Get('report')
  @ApiOkResponse({ description: 'Executive and lead developer Agile progress report.' })
  report() {
    return this.agile.report();
  }

  @Get('export')
  @ApiOkResponse({ description: 'Portable Agile workflow export used by the seed file.' })
  exportWorkflow() {
    return this.agile.exportWorkflow();
  }

  @Get('export/status')
  @ApiOkResponse({ description: 'Reports whether the database and seed artifact match.' })
  exportStatus() {
    return this.agile.exportStatus();
  }

  @Post('export/seed-file')
  @ApiCreatedResponse({ description: 'Rewrites the portable Agile seed JSON from the current database.' })
  writeSeedFile() {
    return this.agile.writeSeedFile();
  }

  @Get('work-items')
  @ApiOkResponse({ type: [WorkItemResponseDto] })
  listWorkItems(): Promise<WorkItemResponseDto[]> {
    return this.agile.listWorkItems();
  }

  @Post('work-items')
  @ApiCreatedResponse({ type: WorkItemResponseDto })
  createWorkItem(@Body() dto: CreateWorkItemDto): Promise<WorkItemResponseDto> {
    return this.agile.createWorkItem(dto);
  }

  @Patch('work-items/:slug')
  @ApiOkResponse({ type: WorkItemResponseDto })
  updateWorkItem(@Param('slug') slug: string, @Body() dto: UpdateWorkItemDto): Promise<WorkItemResponseDto> {
    return this.agile.updateWorkItem(slug, dto);
  }

  @Delete('work-items/:slug')
  @HttpCode(204)
  @ApiNoContentResponse()
  async deleteWorkItem(@Param('slug') slug: string): Promise<void> {
    await this.agile.deleteWorkItem(slug);
  }

  @Post('blockers')
  @ApiCreatedResponse({ description: 'Blocker created.' })
  createBlocker(@Body() dto: CreateBlockerDto) {
    return this.agile.createBlocker(dto);
  }

  @Patch('blockers/:slug')
  @ApiOkResponse({ description: 'Blocker updated.' })
  updateBlocker(@Param('slug') slug: string, @Body() dto: UpdateBlockerDto) {
    return this.agile.updateBlocker(slug, dto);
  }

  @Post('acceptance-checks')
  @ApiCreatedResponse({ description: 'Acceptance check created.' })
  createAcceptanceCheck(@Body() dto: CreateAcceptanceCheckDto) {
    return this.agile.createAcceptanceCheck(dto);
  }

  @Post('time-entries')
  @ApiCreatedResponse({ description: 'Time entry created.' })
  createTimeEntry(@Body() dto: CreateTimeEntryDto) {
    return this.agile.createTimeEntry(dto);
  }
}
