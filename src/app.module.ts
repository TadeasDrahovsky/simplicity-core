import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/db/database.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';

@Module({
  imports: [DatabaseModule, AnnouncementsModule],
})
export class AppModule {}
