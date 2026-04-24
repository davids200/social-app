import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { UserQueueService } from './user.queue.service';
import { PostQueueService } from './post.queue.service';
import { UserWorker } from './workers/user.worker';
import { PostWorker } from './workers/post.worker';

import { Neo4jModule } from '../database/neo4j/neo4j.module';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    Neo4jModule,
    NotificationModule,

    // ✅ THIS IS THE MISSING PIECE
    BullModule.registerQueue(
      { name: 'post-queue' },
      { name: 'user-queue' },
    ),
  ],
  providers: [
    UserQueueService,
    PostQueueService,
    UserWorker,
    PostWorker,
  ],
  exports: [
    UserQueueService,
    PostQueueService,
  ],
})
export class QueueModule {}