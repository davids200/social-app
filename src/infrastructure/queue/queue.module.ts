import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redisOptions } from '../config/redis.config';

import { PostWorker } from './workers/post.worker';

// ✅ IMPORT THESE
import { Neo4jModule } from '../database/neo4j/neo4j.module';
import { NotificationModule } from '../../modules/notification/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: redisOptions,
    }),

    BullModule.registerQueue({
      name: 'post-queue',
    }),

    // 🔥 ADD THESE
    Neo4jModule,
    NotificationModule,
  ],
  providers: [PostWorker],
})
export class QueueModule {}