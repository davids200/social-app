import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { NotificationModel } from './notification.model';

@Resolver(() => NotificationModel)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  // 📥 GET USER NOTIFICATIONS
  @Query(() => [NotificationModel])
  async getNotifications(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.notificationService.findUserNotifications(userId);
  }

  // ✅ MARK AS READ
  @Mutation(() => Boolean)
  async markNotificationRead(
    @Args('id', { type: () => Int }) id: number,
  ) {
    await this.notificationService.markAsRead(id);
    return true;
  }
}