import { ApiProperty } from '@nestjs/swagger';
import { workItemStatuses } from './agile.enums';
import type { WorkItemStatusDto } from './agile.enums';
import { WorkItemResponseDto } from './work-item.dto';

export class SprintResponseDto {
  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  status!: string;
}

export class BlockerResponseDto {
  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  affectedArea!: string;

  @ApiProperty()
  mitigation!: string;

  @ApiProperty()
  owner!: string;

  @ApiProperty({ enum: workItemStatuses })
  status!: WorkItemStatusDto;
}

export class AcceptanceCheckResponseDto {
  @ApiProperty()
  slug!: string;

  @ApiProperty()
  check!: string;

  @ApiProperty()
  evidence!: string;

  @ApiProperty()
  gate!: string;

  @ApiProperty({ enum: workItemStatuses })
  status!: WorkItemStatusDto;
}

export class TimeSummaryResponseDto {
  @ApiProperty()
  totalMinutes!: number;

  @ApiProperty()
  totalHours!: number;

  @ApiProperty()
  entryCount!: number;
}

export class AgileDashboardResponseDto {
  @ApiProperty({ type: SprintResponseDto })
  sprint!: SprintResponseDto;

  @ApiProperty({ type: [WorkItemResponseDto] })
  workItems!: WorkItemResponseDto[];

  @ApiProperty({ type: [BlockerResponseDto] })
  blockers!: BlockerResponseDto[];

  @ApiProperty({ type: [AcceptanceCheckResponseDto] })
  acceptanceChecks!: AcceptanceCheckResponseDto[];

  @ApiProperty({ type: TimeSummaryResponseDto })
  timeSummary!: TimeSummaryResponseDto;
}

export class KanbanColumnResponseDto {
  @ApiProperty({ enum: workItemStatuses })
  status!: WorkItemStatusDto;

  @ApiProperty({ type: [WorkItemResponseDto] })
  items!: WorkItemResponseDto[];
}
