import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { Like } from './like.entity';

import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver'; 
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    BullModule.registerQueue({
      name: 'like-queue',
      
    }),
    RedisModule,
      FeedModule
  ],
  providers: [
    LikeService,
    LikeResolver, 
  ],
})
export class LikeModule {}