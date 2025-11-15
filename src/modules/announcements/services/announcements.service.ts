import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../db/services/prisma.service';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { FindAllAnnouncementsQueryDto } from '../dto/find-all-announcements-query.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { AnnouncementResponseDto } from '../dto/announcement-response.dto';

@Injectable()
export class AnnouncementsService {
  private readonly selectFields = {
    id: true,
    title: true,
    body: true,
    category: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.create({
      data: createAnnouncementDto,
      select: this.selectFields,
    });

    return announcement as AnnouncementResponseDto;
  }

  async findAll(
    query: FindAllAnnouncementsQueryDto,
  ): Promise<AnnouncementResponseDto[]> {
    const where: Prisma.AnnouncementWhereInput = {};

    if (query.category) {
      where.category = query.category;
    }

    const skip = query.skip;
    const take = query.take;

    const announcements = await this.prisma.announcement.findMany({
      where,
      select: this.selectFields,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return announcements as AnnouncementResponseDto[];
  }

  async findOne(id: string): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      select: this.selectFields,
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }

    return announcement as AnnouncementResponseDto;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    await this.findOne(id);

    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: updateAnnouncementDto,
      select: this.selectFields,
    });

    return announcement as AnnouncementResponseDto;
  }

  async remove(id: string): Promise<AnnouncementResponseDto> {
    await this.findOne(id);

    const announcement = await this.prisma.announcement.delete({
      where: { id },
      select: this.selectFields,
    });

    return announcement as AnnouncementResponseDto;
  }
}
