import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AnnouncementCategory } from '@prisma/client';

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Title of the announcement',
    example: 'New Feature: Enhanced Search',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Body content of the announcement',
    example:
      'We are excited to announce our new enhanced search functionality...',
  })
  @IsString({ message: 'Body must be a string' })
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @ApiProperty({
    description: 'Category of the announcement',
    enum: AnnouncementCategory,
    example: AnnouncementCategory.NEW_FEATURES,
  })
  @IsEnum(AnnouncementCategory, {
    message: 'Category must be a valid announcement category',
  })
  category: AnnouncementCategory;
}
