import { Module } from '@nestjs/common';
import { AnnouncementsController } from './controllers/announcements.controller';
import { AnnouncementsService } from './services/announcements.service';
import { AnnouncementsGateway } from './gateways/announcements.gateway';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementsGateway],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
