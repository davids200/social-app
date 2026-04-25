import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';

// 👇 ADD THIS IMPORT (IMPORTANT)
import { QueueModule } from '../../infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    QueueModule, 
  ],
  providers: [LikeService, LikeResolver],
})
export class LikeModule {}

