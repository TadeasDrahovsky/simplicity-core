import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AnnouncementResponseDto } from '../dto/announcement-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/announcements',
})
export class AnnouncementsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AnnouncementsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitAnnouncementCreated(announcement: AnnouncementResponseDto) {
    this.server.emit('announcement:created', announcement);
    this.logger.log(
      `Emitted announcement:created event for announcement ${announcement.id}`,
    );
  }
}
