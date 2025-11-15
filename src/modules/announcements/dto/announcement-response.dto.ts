import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementCategory } from '@prisma/client';

export class AnnouncementResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the announcement',
    example: 'New Feature: Enhanced Search',
  })
  title: string;

  @ApiProperty({
    description: 'Body content of the announcement',
    example: 'We are excited to announce...',
  })
  body: string;

  @ApiProperty({
    description: 'Category of the announcement',
    enum: AnnouncementCategory,
    example: AnnouncementCategory.NEW_FEATURES,
  })
  category: AnnouncementCategory;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
