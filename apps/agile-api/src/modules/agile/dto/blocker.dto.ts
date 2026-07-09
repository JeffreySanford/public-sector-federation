import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { workItemStatuses } from './agile.enums';
import type { WorkItemStatusDto } from './agile.enums';

export class CreateBlockerDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  affectedArea!: string;

  @ApiProperty()
  @IsString()
  mitigation!: string;

  @ApiProperty()
  @IsString()
  owner!: string;

  @ApiProperty({ enum: workItemStatuses })
  @IsEnum(workItemStatuses)
  status!: WorkItemStatusDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workItemSlug?: string;
}

export class UpdateBlockerDto extends PartialType(CreateBlockerDto) {}
