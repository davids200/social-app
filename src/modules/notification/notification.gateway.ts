import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  // user joins their personal room
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    client.join(`user_${userId}`);
  }

  sendToUser(userId: number, notification: any) {
    this.server
      .to(`user_${userId}`)
      .emit('notification', notification);
  }
}