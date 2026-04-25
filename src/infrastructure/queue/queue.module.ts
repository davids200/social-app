import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { UserQueueService } from './user.queue.service';
import { PostQueueService } from './post.queue.service';
import { CommentQueueService } from './comment.queue.service';
import { UserWorker } from './workers/user.worker';
import { PostWorker } from './workers/post.worker';

import { Neo4jModule } from '../database/neo4j/neo4j.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { CommentWorker } from './workers/comment.worker';
import { LikeModule } from 'src/modules/like/like.module';
import { LikeQueueService } from './like.queue.service';
import { LikeWorker } from './workers/like.worker';
import { FollowQueueService } from './follow.queue.service';
import { FollowWorker } from './workers/follow.worker';

@Module({
  imports: [
    Neo4jModule,
    NotificationModule,

     
    BullModule.registerQueue(
      { name: 'post-queue' },
      { name: 'user-queue' },
      { name: 'like-queue' },
      { name: 'follow-queue' },
      { name: 'comment' },
    ),
  ],
  providers: [
    UserQueueService,
    PostQueueService,
    CommentQueueService,
    UserWorker,
    PostWorker,
    FollowWorker,
    LikeWorker,
    
    CommentWorker,
    FollowQueueService,
    LikeQueueService
  ],
  exports: [
    UserQueueService,
    PostQueueService,
    CommentQueueService,
    LikeQueueService,
    FollowQueueService
  ],
})
export class QueueModule {}