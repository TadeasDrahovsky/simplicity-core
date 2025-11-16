import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AnnouncementCategory } from '@prisma/client';

export class FindAllAnnouncementsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: AnnouncementCategory,
    example: AnnouncementCategory.NEW_FEATURES,
  })
  @IsOptional()
  @IsEnum(AnnouncementCategory, {
    message: 'Category must be a valid announcement category',
  })
  category?: AnnouncementCategory;

  @ApiPropertyOptional({
    description: 'Number of records to skip (pagination offset)',
    example: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0, { message: 'Skip must be greater than or equal to 0' })
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of records to take (pagination limit)',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Take must be greater than or equal to 1' })
  @Max(100, { message: 'Take must be less than or equal to 100' })
  take?: number;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'search',
  })
  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @IsNotEmpty({ message: 'Search query must not be empty' })
  @MaxLength(200, { message: 'Search query must not exceed 200 characters' })
  search?: string;
}
