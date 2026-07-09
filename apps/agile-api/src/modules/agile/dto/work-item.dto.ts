import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { effortLevels, workItemStatuses, workItemTypes } from './agile.enums';
import type { EffortLevelDto, WorkItemStatusDto, WorkItemTypeDto } from './agile.enums';

export class CreateWorkItemDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  workstream!: string;

  @ApiProperty({ enum: workItemTypes })
  @IsEnum(workItemTypes)
  type!: WorkItemTypeDto;

  @ApiProperty({ enum: workItemStatuses })
  @IsEnum(workItemStatuses)
  status!: WorkItemStatusDto;

  @ApiProperty({ enum: effortLevels })
  @IsEnum(effortLevels)
  effort!: EffortLevelDto;

  @ApiProperty()
  @IsString()
  owner!: string;

  @ApiProperty()
  @IsString()
  summary!: string;

  @ApiProperty()
  @IsString()
  includes!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  blockerSummary?: string;

  @ApiProperty()
  @IsString()
  doneCriteria!: string;

  @ApiProperty()
  @IsString()
  sprintSlug!: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateWorkItemDto extends PartialType(CreateWorkItemDto) {}

export class WorkItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  workstream!: string;

  @ApiProperty({ enum: workItemTypes })
  type!: WorkItemTypeDto;

  @ApiProperty({ enum: workItemStatuses })
  status!: WorkItemStatusDto;

  @ApiProperty({ enum: effortLevels })
  effort!: EffortLevelDto;

  @ApiProperty()
  owner!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty()
  includes!: string;

  @ApiPropertyOptional()
  blockerSummary?: string | null;

  @ApiProperty()
  doneCriteria!: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  totalMinutes!: number;
}
