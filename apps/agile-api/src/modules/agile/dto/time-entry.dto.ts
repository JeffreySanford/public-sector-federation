import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { timeActivityTypes } from './agile.enums';
import type { TimeActivityTypeDto } from './agile.enums';

export class CreateTimeEntryDto {
  @ApiProperty()
  @IsString()
  workItemSlug!: string;

  @ApiProperty({ enum: timeActivityTypes })
  @IsEnum(timeActivityTypes)
  activityType!: TimeActivityTypeDto;

  @ApiProperty({ example: '2026-07-09T14:00:00.000Z' })
  @IsDateString()
  entryDate!: string;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  minutes!: number;

  @ApiProperty()
  @IsString()
  note!: string;
}
