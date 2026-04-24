import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationConsumer } from './notification.consumer';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationConsumer,
  ],
  exports: [NotificationService,NotificationGateway,],
})
export class NotificationModule {} 


