import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../db/services/prisma.service';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { FindAllAnnouncementsQueryDto } from '../dto/find-all-announcements-query.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { AnnouncementResponseDto } from '../dto/announcement-response.dto';
import { AnnouncementsGateway } from '../gateways/announcements.gateway';

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

  constructor(
    private readonly prisma: PrismaService,
    private readonly announcementsGateway: AnnouncementsGateway,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    const announcement = await this.prisma.announcement.create({
      data: createAnnouncementDto,
      select: this.selectFields,
    });

    const announcementDto = announcement as AnnouncementResponseDto;

    this.announcementsGateway.emitAnnouncementCreated(announcementDto);

    return announcementDto;
  }

  async findAll(
    query: FindAllAnnouncementsQueryDto,
  ): Promise<AnnouncementResponseDto[]> {
    const { search, category, skip, take } = query;

    if (search) {
      return this.searchAnnouncements(search, category, skip, take);
    }

    const where: Prisma.AnnouncementWhereInput = {};

    if (category) {
      where.category = category;
    }

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

  private async searchAnnouncements(
    search: string,
    category?: AnnouncementCategory,
    skip?: number,
    take?: number,
  ): Promise<AnnouncementResponseDto[]> {
    const searchTerms = search
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length > 0)
      .map((term) => term.replace(/[&|!():'";\\]/g, ''))
      .join(' & ');

    if (!searchTerms) {
      return [];
    }

    const categoryFilter = category
      ? Prisma.sql`AND category = ${category}::announcement_category`
      : Prisma.empty;

    const skipClause =
      skip !== undefined ? Prisma.sql`OFFSET ${skip}` : Prisma.empty;
    const limitClause =
      take !== undefined ? Prisma.sql`LIMIT ${take}` : Prisma.empty;

    const announcements = await this.prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        body: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
        SELECT 
          id,
          title,
          body,
          category,
          "createdAt",
          "updatedAt"
        FROM announcements
        WHERE search_vector @@ to_tsquery('english', ${searchTerms})
        ${categoryFilter}
        ORDER BY "createdAt" DESC
        ${limitClause}
        ${skipClause}
      `;

    return announcements as AnnouncementResponseDto[];
  }
}
