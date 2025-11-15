import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnnouncementsService } from '../services/announcements.service';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { FindAllAnnouncementsQueryDto } from '../dto/find-all-announcements-query.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { AnnouncementResponseDto } from '../dto/announcement-response.dto';
import { AnnouncementCategory } from '@prisma/client';

@ApiTags('announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  @ApiResponse({
    status: 200,
    description: 'List of announcements',
    type: [AnnouncementResponseDto],
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: AnnouncementCategory,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: String,
    description: 'Pagination offset',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: String,
    description: 'Pagination limit',
  })
  findAllAnnouncements(@Query() query: FindAllAnnouncementsQueryDto) {
    return this.announcementsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'The announcement',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  findOneAnnouncement(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiResponse({
    status: 201,
    description: 'The announcement has been successfully created',
    type: AnnouncementResponseDto,
  })
  createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'The announcement has been successfully updated',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  updateAnnouncement(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'The announcement has been successfully deleted',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  removeAnnouncement(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
