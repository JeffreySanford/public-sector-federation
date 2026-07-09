import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { workItemStatuses } from './agile.enums';
import type { WorkItemStatusDto } from './agile.enums';

export class CreateAcceptanceCheckDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  check!: string;

  @ApiProperty()
  @IsString()
  evidence!: string;

  @ApiProperty()
  @IsString()
  gate!: string;

  @ApiProperty({ enum: workItemStatuses })
  @IsEnum(workItemStatuses)
  status!: WorkItemStatusDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workItemSlug?: string;
}

export class UpdateAcceptanceCheckDto extends PartialType(CreateAcceptanceCheckDto) {}
