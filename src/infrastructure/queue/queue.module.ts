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

@Module({
  imports: [
    Neo4jModule,
    NotificationModule,

    // ✅ THIS IS THE MISSING PIECE
    BullModule.registerQueue(
      { name: 'post-queue' },
      { name: 'user-queue' },
      { name: 'comment' },
    ),
  ],
  providers: [
    UserQueueService,
    PostQueueService,
    CommentQueueService,
    UserWorker,
    PostWorker,
    CommentWorker
  ],
  exports: [
    UserQueueService,
    PostQueueService,
    CommentQueueService,
  ],
})
export class QueueModule {}