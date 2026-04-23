import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationConsumer {
  constructor(
    private notificationService: NotificationService,
    private gateway: NotificationGateway,
  ) {}

  @OnEvent('user.followed')
  async onFollow(payload: any) {
    const notif = await this.notificationService.create({
      userId: payload.followingId,
      type: 'follow',
      sourceUserId: payload.followerId,
    });

    this.gateway.sendToUser(payload.followingId, notif);
  }

  @OnEvent('post.liked')
  async onLike(payload: any) {
    const notif = await this.notificationService.create({
      userId: payload.postOwnerId,
      type: 'like',
      sourceUserId: payload.userId,
      postId: payload.postId,
    });

    this.gateway.sendToUser(payload.postOwnerId, notif);
  }
}