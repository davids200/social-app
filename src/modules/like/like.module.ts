import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { Like } from './like.entity';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeQueueService } from 'src/infrastructure/queue/like.queue.service';
import { LikeWorker } from 'src/infrastructure/queue/workers/like.worker';
import { Neo4jModule } from 'src/infrastructure/database/neo4j/neo4j.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),

     
    BullModule.registerQueue({
      name: 'like-queue',
    }),
    Neo4jModule,
  ],
  providers: [
    LikeService,
    LikeResolver,
    LikeQueueService,
    LikeWorker,  
  ],
})
export class LikeModule {}